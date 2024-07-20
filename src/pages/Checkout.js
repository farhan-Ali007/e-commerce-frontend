import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserCart, emptyUserCart, saveUserAddress } from '../functions/user'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


const Checkout = () => {

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [addressSaved, setAddressSaved] = useState(false);

    const dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            // console.log("User---->", user)
            getUserCart(user.token).then((res) => {
                // console.log("user cart res", JSON.stringify(res.data, null, 4));
                setProducts(res.data.products);
                setTotal(res.data.cartTotal);
            });
        }
    }, []);

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

    return (
        <div className='row'>
            <div className='col-md-6'>
                <h4>Delivery Address </h4>
                <br />
                <br />
                <ReactQuill theme="snow" value={address} onChange={setAddress} />
                <button className='btn btn-primary mt-2' onClick={saveAddressToDb}>Save</button>
                <hr />
                <h4>Get Coupon?</h4>
                <br />
                coupon input and apply button
            </div>
            <div className='col-md-6'>
                <h4>Order Summary</h4>
                <hr />

                <p>{products.length} Products</p>
                <hr />
                {products.map((p, i) => {
                    return <div key={i}>
                        <p>{p.product.title}  ({p.color}) x {p.count} = {p.product.price * p.count}  </p>

                    </div>
                })}
                <hr />
                <p>Cart total : {total}</p>
                <hr />
                <div className='row'>
                    <div className='col-md-6'>
                        <button className='btn btn-primary' disabled={!addressSaved}>Place Order </button>
                    </div>

                    <div className='col-md-6'>
                        <button disabled={!products.length} onClick={emptyCart} className='btn btn-primary'>Empty Order </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout