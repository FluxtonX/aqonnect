/**
 * GET /api/order/status?session_id=...
 * Returns order status and eSIM details for the success page.
 * If eSIM is still processing, actively queries the eSIM provider.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getOrderBySessionId, attachEsimResult } from '@/server/orders';
import { queryOrderStatus } from '@/lib/esim-access/client';

const querySchema = z.object({
  session_id: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = querySchema.safeParse({
      session_id: searchParams.get('session_id'),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Missing or invalid session_id.' },
        { status: 400 }
      );
    }

    let order = await getOrderBySessionId(parsed.data.session_id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found.' },
        { status: 404 }
      );
    }

    // If eSIM is still processing and we have an order number, try querying the provider
    if (order.esimStatus === 'processing' && order.esimOrderNo && !order.iccid) {
      try {
        const queryResponse = await queryOrderStatus(order.esimOrderNo);
        const queryEsim = queryResponse.obj?.esimList?.[0];

        if (queryEsim?.iccid || queryEsim?.qrCodeUrl) {
          const rawAc = (queryEsim as Record<string, unknown>).ac as string | undefined;
          const activationCode = rawAc || undefined;
          let smdpAddress: string | undefined;
          let matchingId: string | undefined;

          if (rawAc && rawAc.startsWith('LPA:')) {
            const parts = rawAc.split('$');
            if (parts.length >= 2) smdpAddress = parts[1];
            if (parts.length >= 3) matchingId = parts[2];
          }

          await attachEsimResult(order.id, {
            esimOrderNo: order.esimOrderNo,
            esimTranNo: (queryEsim as Record<string, unknown>).esimTranNo as string || undefined,
            iccid: queryEsim.iccid,
            qrCodeUrl: queryEsim.qrCodeUrl,
            activationCode: activationCode,
            smdpAddress: smdpAddress,
            matchingId: matchingId,
            esimStatus: 'completed',
            rawEsimResponse: JSON.stringify(queryEsim),
          });

          // Re-fetch the updated order
          order = await getOrderBySessionId(parsed.data.session_id);
          if (!order) {
            return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
          }
        }
      } catch (queryErr) {
        console.error('[API /order/status] eSIM query failed:', queryErr);
        // Continue with existing order data
      }
    }

    // Return sanitized order data (no raw responses)
    return NextResponse.json({
      id: order.id,
      email: order.email,
      countryCode: order.countryCode,
      countryName: order.countryName,
      packageName: order.packageName,
      days: order.days,
      amountUSD: order.amountUSD,
      paymentStatus: order.paymentStatus,
      esimStatus: order.esimStatus,
      iccid: order.iccid,
      qrCodeUrl: order.qrCodeUrl,
      activationCode: order.activationCode,
      smdpAddress: order.smdpAddress,
      matchingId: order.matchingId,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error('[API /order/status] Error:', error);
    return NextResponse.json(
      { error: 'Unable to fetch order status.' },
      { status: 500 }
    );
  }
}

