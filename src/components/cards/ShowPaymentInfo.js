import React from 'react'


const ShowPaymentInfo = ({ order }) => {
    return (
        <div>
            <p>
                <span className='pl-2 pr-2 badge' >Order Id:{order.paymentIntent?.id} </span>{""}
                <span className='pl-2 pr-2'>Amount:{(order.paymentIntent?.amount / 100).toLocaleString("en-Us", {
                    style: "currency", currency: "USD"
                })} </span>{""}
                <span className='pl-2 pr-2'>Currency: {order.paymentIntent.currency.toUpperCase()}</span>{""}
                <span className='pl-2 pr-2' >Method: {order.paymentIntent.payment_method_types[0]}</span>{""}
                <span className='pl-2 pr-2' >Payment: {order.paymentIntent.status.toUpperCase()}</span>{""}
                <span className='pl-2 pr-2' >Orderd on:{" / "}
                    {new Date(order.paymentIntent.created * 1000).toLocaleString()}</span>{""}
                <span className='pl-2 pr-2 badge bg-primary text-white' >STATUS: {order.orderStatus}</span>
            </p>
        </div>
    )
}
export default ShowPaymentInfo
