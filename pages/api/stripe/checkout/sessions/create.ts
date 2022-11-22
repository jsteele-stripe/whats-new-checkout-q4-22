import type { NextApiRequest, NextApiResponse } from 'next'
import { Stripe } from 'stripe'

import stripe from '@/lib/stripe'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Stripe.Checkout.Session | { message: any }>
) {
  try {
    const {
      customText = { shipping_address: null, submit: null },
      invoiceCreation = false,
      tosRequired = false
    }: {
      customText?: { shipping_address?: string; submit?: string }
      invoiceCreation?: boolean
      tosRequired?: boolean
    } = req.body

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        cancel_url: `${req.headers.origin}?cancel`,
        consent_collection: {
          terms_of_service: tosRequired ? 'required' : 'none'
        },
        custom_text: {
          ...(customText?.shipping_address && {
            shipping_address: {
              message: customText.shipping_address
            }
          }),
          ...(customText?.submit && {
            submit: {
              message: customText.submit
            }
          })
        },
        invoice_creation: { enabled: invoiceCreation },
        line_items: [
          {
            price: process.env.STRIPE_ONE_TIME_PRICE_ID,
            quantity: 1
          }
        ],
        mode: 'payment',
        ...(customText?.shipping_address && {
          shipping_address_collection: { allowed_countries: ['GB', 'US'] }
        }),
        success_url: `${req.headers.origin}?success`
      } as Stripe.Checkout.SessionCreateParams)

    res.status(201).json(checkoutSession)
  } catch (error) {
    console.log(error)

    res.status(400).json({ message: error.message })
  }
}
