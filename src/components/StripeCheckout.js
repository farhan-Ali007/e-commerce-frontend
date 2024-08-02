import React from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useSelector, useDispatch } from 'react-redux'
import { createPaymentIntent } from '../functions/stripe'

const StripeCheckout = () => {
    return (
        <div>
            StripeCheckout
        </div>
    )
}

export default StripeCheckout
