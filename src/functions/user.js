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

