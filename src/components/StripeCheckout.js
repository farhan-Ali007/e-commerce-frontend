import React, { useEffect, useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useSelector, useDispatch } from 'react-redux'
import { createPaymentIntent } from '../functions/stripe'
import { createOrder, emptyUserCart } from '../functions/user'
import { Link } from 'react-router-dom'
import { Card } from 'antd'
import { DollarOutlined, CheckOutlined } from '@ant-design/icons'
import laptop from '../images/laptop.png'

const StripeCheckout = ({ history }) => {

    const dispatch = useDispatch()
    const stripe = useStripe()
    const elements = useElements()
    const { user, coupon } = useSelector((state) => ({ ...state }))

    const [succeeded, setSucceeded] = useState(false)
    const [error, setError] = useState(null)
    const [processing, setProcessing] = useState('')
    const [disabled, setDisabled] = useState(true)
    const [clientSecret, setClientSecret] = useState('')
    const [cartTotal, setCartTotal] = useState(0)
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
    const [payable, setPayable] = useState(0)


    useEffect(() => {
        createPaymentIntent(user.token, coupon)
            .then((res) => {
                // console.log("Create payment intent--->", res.data)
                setClientSecret(res.data.clientSecret)
                //additional response received on successdull payment from backend
                setCartTotal(res.data.cartTotal)
                setTotalAfterDiscount(res.data.totalAfterDiscount)
                setPayable(res.data.payable)
            })
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setProcessing(true)

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: e.target.name.value
                }
            }
        }
        )

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`)
            setProcessing(false)
        } else {
            //here you get result after successful payment
            //create ordre and save in the database for admin to process

            createOrder(payload, user.token)
                .then((res) => {
                    if (res.data.ok) {
                        //empty cart from local storage

                        if (typeof window !== undefined) localStorage.removeItem("cart")

                        //empty cart from redux store

                        dispatch({
                            type: "ADD_TO_CART",
                            payload: []
                        });
                        //reset coupon to false
                        dispatch({
                            type: "COUPON_APPLIED",
                            payload: false,
                        });
                        //empty cart from database
                        emptyUserCart(user.token);
                    }
                })

            //empty user cart from redux and loclastorage
            // console.log(JSON.stringify(payload, null, 4))
            setError(null)
            setProcessing(false)
            setSucceeded(true)
        }
    }


    const handleChange = async (e) => {
        //listen for any changes in the card element
        //and display any errors as the customer types their card details
        setDisabled(e.empty) //diable pay button if there is any error
        setError(e.error ? e.error.message : "") //show error messages
    }

    const cartStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: "Arial, sans-serif",
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
    }

    return (
        <>
            {
                !succeeded && <div >
                    {
                        coupon && totalAfterDiscount !== undefined ? (
                            <p className='alert alert-success'>{`Total after discount: $${totalAfterDiscount}`}</p>
                        ) : (
                            <p className='alert alert-danger'>No coupon applied!</p>)
                    }
                </div>
            }
            <div className='text-center pb-5'>
                <Card
                    cover={
                        <img src={laptop} alt=''
                            style={{
                                height: "200px",
                                objectFit: "cover",
                                marginBottom: "-50px"
                            }}
                        />}
                    actions={[
                        <>
                            <DollarOutlined className='text-info' />
                            <br />
                            Total: ${cartTotal}
                        </>,
                        <>
                            <CheckOutlined className='text-info' />
                            <br />
                            Total Payable: ${(payable / 100).toFixed(2)}
                        </>,
                    ]} />
            </div>

            <form
                id='payment-form'
                className='stripe-form'
                onSubmit={handleSubmit}>
                <CardElement
                    id='card-element'
                    options={cartStyle}
                    onChange={handleChange}
                />
                <button className='stripe-button' disabled={processing || disabled || succeeded}>
                    <span id='button-text'>
                        {processing ? <div className='spinner' id='spinner'></div> : "Pay"}
                    </span>
                </button>
                <br />
                {error && <div className='card-error' role='alert'>{error}</div>}
                <br />
                <p className={succeeded ? "result-message" : "result-message hidden"}>Payment successful.
                    <Link to="/user/history">See it in your purchase history</Link></p>
            </form>

        </>
    )
}

export default StripeCheckout
