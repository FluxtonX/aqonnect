/**
 * GET /api/esim/packages?countryCode=DZ
 * Fetches and returns normalized eSIM packages for a country.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPackageList } from '@/lib/esim-access/client';

const querySchema = z.object({
  countryCode: z.string().length(2).toUpperCase(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = querySchema.safeParse({
      countryCode: searchParams.get('countryCode'),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid country code. Must be a 2-letter ISO code.' },
        { status: 400 }
      );
    }

    const { countryCode } = parsed.data;
    const plans = await getPackageList(countryCode);

    return NextResponse.json({
      countryCode,
      plans,
    });
  } catch (error) {
    console.error('[API /esim/packages] Error:', error);
    return NextResponse.json(
      { error: 'Unable to load packages. Please try again.' },
      { status: 500 }
    );
  }
}
