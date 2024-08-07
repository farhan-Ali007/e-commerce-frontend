import Axios from "axios";

export const userCart = async (cart, authToken) => {
    return await Axios.post(`${process.env.REACT_APP_API}/user/cart`, { cart }, {
        headers: {
            authToken,
        }
    })
}

export const getUserCart = async (authToken) => {
    return await Axios.get(`${process.env.REACT_APP_API}/user/cart`, {
        headers: {
            authToken,
        }
    })
}

export const emptyUserCart = async (authToken) => {
    return await Axios.delete(`${process.env.REACT_APP_API}/user/cart`, {
        headers: {
            authToken,
        }
    })
}

export const saveUserAddress = async (authToken, address) => {
    return await Axios.post(`${process.env.REACT_APP_API}/user/address`, { address }, {
        headers: {
            authToken,
        }
    })
}

export const applyCoupon = async (authToken, coupon) => {
    return await Axios.post(`${process.env.REACT_APP_API}/user/cart/coupon`,
        { coupon },
        {
            headers: {
                authToken,
            }
        })
}

export const createOrder = async (stripeResponse, authToken) => {
    return await Axios.post(`${process.env.REACT_APP_API}/user/order`,
        { stripeResponse },
        {
            headers: {
                authToken,
            }
        })
}

export const getUserOrders = async (authToken) => {
    return await Axios.get(`${process.env.REACT_APP_API}/user/orders`, {
        headers: {
            authToken,
        }
    })
}

export const getWishlist = async (authToken) => {
    return await Axios.get(`${process.env.REACT_APP_API}/user/wishlist`, {
        headers: {
            authToken,
        }
    })
}

export const removeFromWishlist = async (productId, authToken) => {
    return await Axios.put(`${process.env.REACT_APP_API}/user/wishlist/${productId}`,
        {},
        {
            headers: {
                authToken,
            }
        })
}


export const addToWishlist = async (productId, authToken) => {
    return await Axios.post(`${process.env.REACT_APP_API}/user/wishlist`,
        { productId },
        {
            headers: {
                authToken,
            }
        })
}

