import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-01-28.clover",
    });
  }
  return _stripe;
}

export const STRIPE_PLANS = {
  tribe: {
    name: "Tribe",
    priceId: process.env.STRIPE_TRIBE_PRICE_ID!,
    price: 6,
  },
  community: {
    name: "Community",
    priceId: process.env.STRIPE_COMMUNITY_PRICE_ID!,
    price: 15,
  },
} as const;
