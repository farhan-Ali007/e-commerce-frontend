import React, { useEffect, useState } from 'react'
import { auth, googleAuthProvider } from '../../firebase'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from 'antd'
import { GoogleOutlined, MailOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import axios from 'axios'


const createOrUpdateUser = async (authToken) => {
    return await axios.post(`${process.env.REACT_APP_API}/create-or-update-user`, {}, {
        headers: {
            authToken,
        }
    })
}

const Login = ({ history }) => {

    const [email, setEmail] = useState('farhanali7991225@gmail.com')
    const [password, setPassword] = useState('00000000')
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }))

    useEffect(() => {
        if (user && user.token) {
            history.push("/")
        }
    }, [user, history])

    let dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await auth.signInWithEmailAndPassword(email, password)
            const { user } = result
            const idTokenResult = await user.getIdTokenResult()

            createOrUpdateUser(idTokenResult.token)
                .then((res) => {
                    dispatch({
                        type: 'LOGGED_IN_USER',
                        payload: {
                            name: res.data.name,
                            email: res.data.email,
                            token: idTokenResult.token,
                            role:res.data.role,
                            id:res.data._id
                        },
                    })
                })
                .catch()

            history.push('/')
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            setLoading(false)
        }
    }

    const googleLogin = () => {
        auth.signInWithPopup(googleAuthProvider)
            .then(async (result) => {
                const { user } = result
                const idTokenResult = await user.getIdTokenResult()
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: { email: user.email, token: idTokenResult.token },
                })
                history.push('/')

            })
            .catch((err) => {
                console.log(err)
                toast.error(err.message)
            })
    }

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <input
                    type="email"
                    className='form-control'
                    placeholder='Your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className='form-group'>
                <input
                    type="password"
                    className='form-control'
                    placeholder='Your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <br />
            <Button
                type='primary'
                className='mb-3'
                block
                shape='round'
                icon={<MailOutlined />}
                size='large'
                disabled={!email || password.length < 6}
                onClick={handleSubmit}
            >
                Login with Email/Password
            </Button>
        </form>
    )

    return (
        <div className='container p-5'>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    {!loading ?
                        <h4>Login</h4> :
                        <h4 className='text-danger'>Loading...</h4>
                    }
                    {registerForm()}
                    <Button
                        type='dashed'
                        className='mb-3'
                        block
                        shape='round'
                        icon={<GoogleOutlined />}
                        size='large'
                        onClick={googleLogin}
                    >
                        Login with Google
                    </Button>

                    <Link to="/forgot/password" className="float-right text-danger">Forgot Password?</Link>
                </div>
            </div>
        </div>
    )
}

export default Login

