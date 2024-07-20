import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { userCart } from '../functions/user'
import ProductCardInCheckout from '../components/cards/ProductCardInCheckout'

const Cart = () => {
    const dispatch = useDispatch()
    const { cart, user } = useSelector((state) => ({ ...state }))

    const history = useHistory()

    const getTotal = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    }

    const saveOrderToDb = () => {
        userCart(cart, user.token)
            .then((res) => {
                // console.log("Cart Response----->", res)

                if (res.data.ok) {
                    history.push("/checkout")
                }
            })
            .catch((error) => {
                console.log("cart post error", error)
            })
        // console.log("Cart---->", JSON.stringify(cart, null, 4))

    }

    const showCartItems = () => {

        return <table className='table table-bordered'>
            <thead className='thead-light'>
                <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Count</th>
                    <th scope="col">Shipping</th>
                    <th scope="col">Remove</th>
                </tr>
            </thead>

            {cart.map((p) => (
                <ProductCardInCheckout key={p._id} p={p} />
            ))}

        </table>
    }

    return (

        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-8'>
                    <h4 className='text-center mt-2 mb-2 pb-2'>{cart.length} Products in Cart</h4>
                    {!cart.length ? (
                        <h4 className='text-center'>No product in cart.
                            <Link to="/shop">Continue shopping</Link>
                        </h4>
                    ) : (
                        showCartItems()
                    )}
                </div>
                <div className='col-md-4'>
                    <h4>Order Summary</h4>
                    <hr />
                    <p>Products</p>
                    {cart.map((c, i) => (
                        <div key={i}>
                            <p>{c.title} * {c.count} = ${c.price * c.count}</p>
                        </div>))}
                    <hr />
                    Total : <b>${getTotal()}</b>
                    <hr />
                    {
                        user ? (
                            <button
                                onClick={saveOrderToDb}
                                className='btn btn-small btn-primary mt-2'
                                disabled={!cart.length}
                            >
                                Proceed to checkout
                            </button>
                        ) : (
                            <button
                                className='btn btn-small btn-primary mt-2'
                            >
                                <Link
                                    style={{ textDecoration: "none" }}
                                    to={{
                                        pathname: "/login",
                                        state: { from: "cart" }
                                    }}>Login to checkout</Link>
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Cart
