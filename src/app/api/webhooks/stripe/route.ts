/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events, particularly checkout.session.completed.
 * Orders eSIM only after confirmed payment.
 */
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createOrder, getPackageList, queryOrderStatus } from '@/lib/esim-access/client';
import {
  markOrderPaid,
  attachEsimResult,
  getOrderBySessionId,
  hasEsimOrder,
} from '@/server/orders';

/** Wait ms milliseconds */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};
    const stripeSessionId = session.id;
    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id || null;
    const customerEmail = session.customer_details?.email || null;

    console.log(`[Webhook] checkout.session.completed: ${stripeSessionId}`);

    try {
      // Mark order as paid
      const order = await markOrderPaid(stripeSessionId, paymentIntentId, customerEmail);

      // Idempotency: check if eSIM order already created
      const alreadyOrdered = await hasEsimOrder(order.id);
      if (alreadyOrdered) {
        console.log(`[Webhook] eSIM already ordered for ${order.id}, skipping`);
        return NextResponse.json({ received: true });
      }

      // Create eSIM order
      try {
        // Retrieve the raw supplier package price in cents from the eSIM Access API plans
        const plans = await getPackageList(order.countryCode);
        const plan = plans.find(p => p.packageCode === order.packageCode);
        if (!plan) {
          throw new Error(`Plan not found for packageCode: ${order.packageCode}`);
        }
        const providerPrice = (plan.raw as { price: number }).price; // raw price in cents

        const esimResponse = await createOrder({
          packageCode: metadata.packageCode || order.packageCode,
          price: providerPrice,
          days: order.days || undefined,
          transactionId: order.id,
        });

        const esimObj = esimResponse.obj;
        const orderNo = esimObj?.orderNo;

        // Save order number immediately so we can track it
        await attachEsimResult(order.id, {
          esimOrderNo: orderNo,
          esimTranNo: esimObj?.transactionId,
          esimStatus: 'processing',
          rawEsimResponse: JSON.stringify(esimResponse),
        });

        console.log(`[Webhook] eSIM order placed: ${orderNo} for ${order.id}`);

        // The eSIM Access API provisions eSIM profiles asynchronously.
        // The initial order response may not include esimList.
        // Poll the query endpoint to get the actual eSIM profile details.
        let firstEsim = esimObj?.esimList?.[0];

        if (!firstEsim?.iccid && orderNo) {
          console.log(`[Webhook] eSIM profile not ready yet, polling query API...`);

          const MAX_RETRIES = 5;
          const RETRY_DELAYS = [2000, 3000, 5000, 8000, 10000]; // ms

          for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            await sleep(RETRY_DELAYS[attempt]);
            console.log(`[Webhook] Query attempt ${attempt + 1}/${MAX_RETRIES} for order ${orderNo}`);

            try {
              const queryResponse = await queryOrderStatus(orderNo);
              const queryEsim = queryResponse.obj?.esimList?.[0];

              if (queryEsim?.iccid || queryEsim?.qrCodeUrl) {
                firstEsim = queryEsim;
                console.log(`[Webhook] eSIM profile retrieved on attempt ${attempt + 1}`);
                break;
              }
            } catch (queryError) {
              console.warn(`[Webhook] Query attempt ${attempt + 1} failed:`, queryError);
            }
          }
        }

        if (firstEsim?.iccid || firstEsim?.qrCodeUrl) {
          // The query API uses 'ac' for activation code (LPA format: "LPA:1$smdpAddress$matchingId")
          const rawAc = (firstEsim as Record<string, unknown>).ac as string | undefined;
          const activationCode = firstEsim.activationCode || rawAc || undefined;

          // Parse SM-DP+ address and matching ID from LPA/ac string
          let smdpAddress = firstEsim.smdpAddress || firstEsim.lpa;
          let matchingId = firstEsim.matchingId;

          if (rawAc && rawAc.startsWith('LPA:')) {
            const parts = rawAc.split('$');
            if (parts.length >= 2) smdpAddress = smdpAddress || parts[1];
            if (parts.length >= 3) matchingId = matchingId || parts[2];
          }

          await attachEsimResult(order.id, {
            esimOrderNo: orderNo,
            esimTranNo: (firstEsim as Record<string, unknown>).esimTranNo as string || esimObj?.transactionId,
            iccid: firstEsim.iccid,
            qrCodeUrl: firstEsim.qrCodeUrl,
            activationCode: activationCode,
            smdpAddress: smdpAddress,
            matchingId: matchingId,
            esimStatus: 'completed',
            rawEsimResponse: JSON.stringify({ order: esimResponse, profile: firstEsim }),
          });
          console.log(`[Webhook] eSIM ready for ${order.id} — ICCID: ${firstEsim.iccid}`);
        } else {
          console.warn(`[Webhook] eSIM profile still not available after polling for ${order.id}. Status left as 'processing'.`);
        }
      } catch (esimError) {
        console.error(`[Webhook] eSIM ordering failed for ${order.id}:`, esimError);
        
        // Mark as processing — provisioning may still complete asynchronously
        await attachEsimResult(order.id, {
          esimStatus: 'processing',
          rawEsimResponse: JSON.stringify({ error: String(esimError) }),
        });
      }
    } catch (dbError) {
      console.error(`[Webhook] Database error for ${stripeSessionId}:`, dbError);
      // Return 200 to prevent Stripe from retrying indefinitely
      // The order can be reconciled manually
    }
  }

  return NextResponse.json({ received: true });
}
