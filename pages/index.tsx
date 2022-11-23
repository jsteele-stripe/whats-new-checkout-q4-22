import type { NextPage } from 'next'
import type Stripe from 'stripe'

import * as React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { anOldHope } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

export default function Index({}: NextPage) {
  const [tosRequired, setTosRequired] = React.useState<boolean>(false)
  const [invoiceCreation, setInvoiceCreation] = React.useState<boolean>(false)
  const [customText, setCustomText] = React.useState<{
    shipping_address: string
    submit: string
  }>({ shipping_address: '', submit: '' })

  const createCheckoutSession = async () => {
    try {
      const checkoutSession: Stripe.Checkout.Session = await (
        await fetch('/api/stripe/checkout/sessions/create', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            customText,
            invoiceCreation,
            tosRequired
          })
        })
      ).json()

      window.location.assign(checkoutSession.url)
    } catch (error) {
      console.error(error)
    }
  }

  const onTextChange = (e) =>
    setCustomText((current) => ({
      ...current,
      [e.target.name]: e.target.value
    }))

  const tosSnippet = `const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
  cancel_url: 'https://stripe.com?cancel',
  consent_collection: {
    terms_of_service: 'required'
  },
  line_items: [{
    price: 'price_xyz'
    quantity: 1
  }],
  mode: 'payment',
  success_url: 'https://stripe.com?success',
})`

  const customTextSnippet = `const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
  cancel_url: 'https://stripe.com?cancel',
  custom_text: {
    shipping_address: {
      message: 'This text will appear below the shipping address fields on the payment page'
    },
    submit: {
      message: 'This text will appear above the pay button on the payment page'
    }
  },
  line_items: [{
    price: 'price_xyz'
    quantity: 1
  }],
  mode: 'payment',
  shipping_address_collection: {
    allowed_countries: ['GB', 'US']
  },
  success_url: 'https://stripe.com?success',
})`

  const invoiceCreationSnippet = `const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
  cancel_url: 'https://stripe.com?cancel',
  invoice_creation: {
    enabled: true
  },
  line_items: [{
    price: 'price_xyz'
    quantity: 1
  }],
  mode: 'payment',
  success_url: 'https://stripe.com?success',
})`

  return (
    <div className="max-w-xl mx-auto divide-y md:max-w-4xl">
      <div className="py-8">
        <h1 className="text-4xl font-bold">New Checkout features</h1>
      </div>
      <div className="py-12">
        <h1 className="text-2xl font-bold">Terms of service consent</h1>
        <p className="mt-2 text-lg text-gray-600">
          Require terms of service agreement before allowing customers to pay.
        </p>
        <div className="mt-8">
          <SyntaxHighlighter
            className="mb-8"
            language="typescript"
            style={anOldHope}
          >
            {tosSnippet}
          </SyntaxHighlighter>
          <div className="grid grid-cols-1 gap-6">
            <div className="block">
              <div className="mt2">
                <label className="inline-flex items-center">
                  <input
                    checked={tosRequired}
                    onChange={() => setTosRequired((current) => !current)}
                    type="checkbox"
                  />
                  <span className="m-2">
                    Pass{' '}
                    <code>
                      consent_collection[terms_of_service]: 'required'
                    </code>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-12">
        <h1 className="text-2xl font-bold">Custom text</h1>
        <p className="mt-2 text-lg text-gray-600">
          Present additional text to customers when they purchase with Checkout.
        </p>
        <div className="mt-8">
          <SyntaxHighlighter
            className="mb-8"
            language="typescript"
            style={anOldHope}
          >
            {customTextSnippet}
          </SyntaxHighlighter>
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span>Shipping address text</span>
              <textarea
                className="mt-1 block w-full"
                rows={6}
                name="shipping_address"
                value={customText.shipping_address}
                onChange={onTextChange}
                placeholder="This text will appear below the shipping address fields on the payment page"
              ></textarea>
            </label>
            <label className="block">
              <span>Submit button text</span>
              <textarea
                className="mt-1 block w-full"
                rows={6}
                name="submit"
                value={customText.submit}
                onChange={onTextChange}
                placeholder="This text will appear above the pay button on the payment page"
              ></textarea>
            </label>
          </div>
        </div>
      </div>
      <div className="py-12">
        <h1 className="text-2xl font-bold">Post-payment invoices</h1>
        <p className="mt-2 text-lg text-gray-600">
          Send post-payment invoices for one-time payments with Checkout.
        </p>
        <div className="mt-8">
          <SyntaxHighlighter
            className="mb-8"
            language="typescript"
            style={anOldHope}
          >
            {invoiceCreationSnippet}
          </SyntaxHighlighter>
          <div className="grid grid-cols-1 gap-6">
            <div className="block">
              <div className="mt2">
                <label className="inline-flex items-center">
                  <input
                    checked={invoiceCreation}
                    onChange={() => setInvoiceCreation((current) => !current)}
                    type="checkbox"
                  />
                  <span className="m-2">
                    Pass <code>invoice_creation[enabled]: true</code>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={createCheckoutSession}
      >
        Create Checkout Session
      </button>
    </div>
  )
}
