import type { NextApiRequest, NextApiResponse } from 'next'
import { Stripe } from 'stripe'

import stripe from '@/lib/stripe'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Stripe.Checkout.Session | { message: any }>
) {
  try {
    const {
      cancel_url,
      price,
      success_url
    }: {
      cancel_url: string
      price: string
      success_url: string
    } = req.body

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        cancel_url,
        line_items: [
          {
            price,
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url
      } as Stripe.Checkout.SessionCreateParams)

    res.status(201).json(checkoutSession)
  } catch (error) {
    console.log(error)

    res.status(400).json({ message: error.message })
  }
}
