/**
 * Server-side order management.
 * Handles creating, updating, and querying orders in the database.
 */
import { prisma } from '@/lib/prisma';

interface CreateOrderParams {
  email?: string;
  countryCode: string;
  countryName: string;
  packageCode: string;
  packageName: string;
  days?: number;
  amountUSD: number;
  stripeSessionId: string;
}

export async function createPendingOrder(params: CreateOrderParams) {
  return prisma.userOrder.create({
    data: {
      email: params.email,
      countryCode: params.countryCode,
      countryName: params.countryName,
      packageCode: params.packageCode,
      packageName: params.packageName,
      days: params.days,
      amountUSD: params.amountUSD,
      stripeSessionId: params.stripeSessionId,
      paymentStatus: 'pending',
    },
  });
}

export async function markOrderPaid(
  stripeSessionId: string,
  paymentIntentId: string | null,
  email: string | null
) {
  return prisma.userOrder.update({
    where: { stripeSessionId },
    data: {
      paymentStatus: 'paid',
      stripePaymentIntentId: paymentIntentId,
      email: email || undefined,
    },
  });
}

export async function attachEsimResult(
  orderId: string,
  esimData: {
    esimOrderNo?: string;
    esimTranNo?: string;
    iccid?: string;
    qrCodeUrl?: string;
    activationCode?: string;
    smdpAddress?: string;
    matchingId?: string;
    esimStatus: string;
    rawEsimResponse: string;
  }
) {
  return prisma.userOrder.update({
    where: { id: orderId },
    data: esimData,
  });
}

export async function getOrderBySessionId(stripeSessionId: string) {
  return prisma.userOrder.findUnique({
    where: { stripeSessionId },
  });
}

export async function hasEsimOrder(orderId: string): Promise<boolean> {
  const order = await prisma.userOrder.findUnique({
    where: { id: orderId },
    select: { esimOrderNo: true, esimTranNo: true },
  });
  return !!(order?.esimOrderNo || order?.esimTranNo);
}
