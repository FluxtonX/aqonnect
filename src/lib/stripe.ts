import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripeInstance = new Stripe(key, {
      typescript: true,
    });
  }
  return stripeInstance;
}

// Re-export as `stripe` for convenience (lazy getter)
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getStripe() as any)[prop];
  },
});
