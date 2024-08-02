import Axios from 'axios'


export const createPaymentIntent = async (authToken) => {
    await Axios.post(`${process.env.REACT_APP_API}/create-payment-intent`,
        {},
        {
            headers: {
                authToken,
            }
        })
}