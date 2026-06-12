/**
 * POST /api/checkout
 * Creates a Stripe Checkout session for an eSIM purchase.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { getPackageList } from '@/lib/esim-access/client';
import { calculateCustomerPrice } from '@/lib/pricing';
import { createPendingOrder } from '@/server/orders';
import { countries } from '@/data/countries';

const checkoutSchema = z.object({
  countryCode: z.string().length(2),
  packageCode: z.string().min(1),
  days: z.number().int().min(1).max(30).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid checkout data.', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { countryCode, packageCode, days } = parsed.data;

    // Validate country exists
    const country = countries.find(c => c.iso2 === countryCode.toUpperCase());
    if (!country) {
      return NextResponse.json(
        { error: 'Invalid country code.' },
        { status: 400 }
      );
    }

    // Fetch packages and validate packageCode belongs to this country
    const plans = await getPackageList(countryCode.toUpperCase());
    const plan = plans.find(p => p.packageCode === packageCode);
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid package selected.' },
        { status: 400 }
      );
    }

    // Validate days for per-day packages
    if (plan.isPerDay && !days) {
      return NextResponse.json(
        { error: 'Number of days is required for per-day packages.' },
        { status: 400 }
      );
    }

    // Calculate price
    const providerPrice = plan.isPerDay ? (plan.dailyPriceUSD || plan.priceUSD) : plan.priceUSD;
    const { total, stripeAmount } = calculateCustomerPrice({
      providerPrice,
      isPerDay: plan.isPerDay,
      days,
    });

    // Build product name
    let productName: string;
    let productDescription: string;

    if (plan.isPerDay) {
      productName = `${country.name} ${plan.dataAmount}/Day`;
      productDescription = `${country.name} ${plan.dataAmount}/Day - ${days} days`;
    } else {
      productName = `${country.name} ${plan.dataAmount} ${plan.validityDays}Days`;
      productDescription = productName;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: stripeAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        countryCode: country.iso2,
        packageCode: plan.packageCode,
        packageName: productName,
        days: days?.toString() || '',
        totalUSD: total.toString(),
      },
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
    });

    // Create pending order in DB
    const order = await createPendingOrder({
      countryCode: country.iso2,
      countryName: country.name,
      packageCode: plan.packageCode,
      packageName: productName,
      days: days || undefined,
      amountUSD: total,
      stripeSessionId: session.id,
    });

    // Store orderId in session metadata (update session)
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...session.metadata,
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[API /checkout] Error:', error);
    return NextResponse.json(
      { error: 'Checkout could not be started. Please try again.' },
      { status: 500 }
    );
  }
}
