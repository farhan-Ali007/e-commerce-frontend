import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserCart, emptyUserCart, saveUserAddress, applyCoupon, createCashOrderForUser } from '../functions/user'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


const Checkout = ({ history }) => {

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState('');

    // dicount price
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
    const [discountError, setDiscountError] = useState('')

    const dispatch = useDispatch();
    const { user, COD } = useSelector((state) => ({ ...state }));
    const couponTrueOrFalse = useSelector((state) => state.coupon);

    useEffect(() => {
        if (user && user.token) {
            // console.log("User---->", user)
            getUserCart(user.token).then((res) => {
                // console.log("user cart res", JSON.stringify(res.data, null, 4));
                setProducts(res.data.products);
                setTotal(res.data.cartTotal);
            });
        }
    }, [user]);

    const emptyCart = () => {
        //1. remove from local storage

        if (typeof window !== "undefined") {
            localStorage.removeItem('cart')
        }

        //remove from redux store

        dispatch({
            type: "ADD_TO_CART",
            payload: []
        })

        //remove from backend / database

        emptyUserCart(user.token)
            .then((res) => {
                setProducts([])
                setTotal(0)
                setTotalAfterDiscount(0)
                setCoupon('')
                toast.info("Cart is empty. Continue shopping")
            })
            .catch((error) => {
                console.log(error)
            })

    }

    const saveAddressToDb = () => {
        // console.log(address)

        saveUserAddress(user.token, address)
            .then((res) => {
                if (res.data.ok) {
                    setAddressSaved(true)
                    toast.success("Address saved.")
                }
            })
    }


    const showAddress = () => {
        return <>
            <ReactQuill theme="snow" value={address} onChange={setAddress} className='ml-2' />
            <button className='btn btn-primary mt-2 ml-2' onClick={saveAddressToDb}>Save</button>
        </>
    }
    const showProductSummary = () =>
        products.map((p, i) => (
            <div key={i}>
                <p>
                    {p.product.title} ({p.color}) x {p.count} ={" "}
                    {p.product.price * p.count}
                </p>
            </div>
        ));

    const applyDiscountCoupon = () => {
        // console.log("Send coupon to backend ====>", coupon)
        applyCoupon(user.token, coupon)
            .then((res) => {
                console.log("Response of applied coupon", res.data)
                if (res.data) {
                    setTotalAfterDiscount(res.data)

                    //push the total after discount to the redux
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: true
                    })
                }
                //error
                if (res.data.err) {
                    setDiscountError(res.data.err)
                    //update redux coupon applied true/false

                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: false
                    })
                }
            })
    }

    const showApplyCoupon = () => (
        <>
            <input
                type='text'
                className='form-control ml-2'
                onChange={(e) => {
                    setCoupon(e.target.value)
                    setDiscountError('')
                }}
                value={coupon}
            />
            <button onClick={applyDiscountCoupon} className='btn btn-primary mt-2 ml-2'>Apply</button>
        </>
    )

    const createCashOrder = () => {
        createCashOrderForUser(user.token, COD, couponTrueOrFalse)
            .then((res) => {
                console.log("User cash on delivery order response------->", res);
                // handle success: empty cart, redirect, etc.

                if (res.data.ok) {
                    //empty local storage
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("cart")
                    }

                    //empty redux cart
                    dispatch({
                        type: "ADD_TO_CART",
                        payload: []
                    })
                    //empty redux coupon
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: false
                    })
                    //empty redux COD

                    dispatch({
                        type: "COD",
                        payload: false
                    })

                    //empty cart from backend

                    emptyUserCart(user.token)

                    //redirect user to history page

                    setTimeout(() => {
                        history.push("/user/history")
                    }, 1000)
                }
            })
            .catch((err) => {
                console.log("Error creating cash order: ", err);
            });
    };


    return (
        <div className='row'>
            <div className='col-md-6 '>
                <h4 className='pt-3'>Delivery Address </h4>
                <br />
                <br />
                {showAddress()}
                <hr />
                <h4>Got Coupon?</h4>
                <br />
                {showApplyCoupon()}
                {discountError && <p className='bg-danger p-2'>{discountError}</p>}
            </div>
            <div className='col-md-6'>
                <h4 className='pt-3'>Order Summary</h4>
                <hr />
                <p>{products.length} Products</p>
                <hr />

                {showProductSummary()}
                <hr />
                <p>Cart total : {total}</p>
                {
                    totalAfterDiscount > 0 &&
                    <p className='bg-success p-2'>Discount Applied! Total Payable: ${totalAfterDiscount}</p>
                }
                <hr />
                <div className='row'>
                    <div className='col-md-6'>
                        {COD ? (<button
                            className='btn btn-primary'
                            disabled={!addressSaved || !products.length}
                            onClick={createCashOrder}>
                            Place Order
                        </button>) : (
                            <button
                                className='btn btn-primary '
                                disabled={!addressSaved || !products.length}
                                onClick={() => history.push("/payment")}>
                                Place Order
                            </button>
                        )}
                    </div>

                    <div className='col-md-6'>
                        <button
                            disabled={!products.length}
                            onClick={emptyCart}
                            className='btn btn-primary'>
                            Empty Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout