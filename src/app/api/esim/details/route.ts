/**
 * GET /api/esim/details?on=ORDER_NUMBER
 * Returns order + live eSIM profile details for the eSIM details page.
 * Queries the eSIM Access API by ICCID for live usage/status data.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getOrderByEsimOrderNo } from '@/server/orders';
import { queryEsimByIccid, queryOrderStatus } from '@/lib/esim-access/client';

const querySchema = z.object({
  on: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = querySchema.safeParse({
      on: searchParams.get('on'),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Missing or invalid order number.' },
        { status: 400 }
      );
    }

    const orderNo = parsed.data.on;
    const order = await getOrderByEsimOrderNo(orderNo);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found.' },
        { status: 404 }
      );
    }

    // Build base response from DB
    const response: Record<string, unknown> = {
      id: order.id,
      packageName: order.packageName,
      packageCode: order.packageCode,
      countryCode: order.countryCode,
      countryName: order.countryName,
      days: order.days,
      amountUSD: order.amountUSD,
      esimOrderNo: order.esimOrderNo,
      esimTranNo: order.esimTranNo,
      stripePaymentIntentId: order.stripePaymentIntentId,
      iccid: order.iccid,
      qrCodeUrl: order.qrCodeUrl,
      activationCode: order.activationCode,
      smdpAddress: order.smdpAddress,
      matchingId: order.matchingId,
      esimStatus: order.esimStatus,
      createdAt: order.createdAt,
    };

    // Fetch live data from eSIM Access API
    // Try by ICCID first (gives most detailed data), fallback to orderNo
    let liveProfile: Record<string, unknown> | null = null;

    if (order.iccid) {
      try {
        const iccidResponse = await queryEsimByIccid(order.iccid);
        if (iccidResponse.success && iccidResponse.obj?.esimList?.[0]) {
          liveProfile = iccidResponse.obj.esimList[0] as unknown as Record<string, unknown>;
        }
      } catch (err) {
        console.error('[API /esim/details] ICCID query failed:', err);
      }
    }

    if (!liveProfile && order.esimOrderNo) {
      try {
        const orderResponse = await queryOrderStatus(order.esimOrderNo);
        if (orderResponse.success && orderResponse.obj?.esimList?.[0]) {
          liveProfile = orderResponse.obj.esimList[0] as unknown as Record<string, unknown>;
        }
      } catch (err) {
        console.error('[API /esim/details] Order query failed:', err);
      }
    }

    // Attach live profile data if available
    if (liveProfile) {
      response.live = {
        status: liveProfile.esimStatus ?? liveProfile.status ?? null,
        // Usage data
        totalVolume: liveProfile.totalVolume ?? null,         // total data in bytes
        remainingVolume: liveProfile.remainVolume ?? liveProfile.remainingVolume ?? null, // remaining in bytes
        usedVolume: liveProfile.usedVolume ?? null,           // used in bytes
        // Package info
        packageName: liveProfile.packageName ?? null,
        expired: liveProfile.expired ?? null,
        // Network details
        apn: liveProfile.apn ?? null,
        operators: liveProfile.operators ?? null,
        breakout: liveProfile.breakout ?? null,
        // Plan type details
        packageCode: liveProfile.packageCode ?? null,
        duration: liveProfile.duration ?? null,
        durationUnit: liveProfile.durationUnit ?? null,
        totalDays: liveProfile.totalDays ?? null,
        remainDays: liveProfile.remainDays ?? null,
        activeDays: liveProfile.activeDays ?? null,
        activeDate: liveProfile.activeDate ?? null,
        expireDate: liveProfile.expireDate ?? null,
        // Countries / location
        locationCode: liveProfile.locationCode ?? null,
        countries: liveProfile.countries ?? liveProfile.locationCode ?? null,
        // Full raw for debugging (remove in production if not needed)
        raw: liveProfile,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /esim/details] Error:', error);
    return NextResponse.json(
      { error: 'Unable to fetch eSIM details.' },
      { status: 500 }
    );
  }
}
