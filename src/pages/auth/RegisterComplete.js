import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from '../../firebase'
import { toast } from 'react-toastify'
import { createOrUpdateUser } from '../../functions/auth'


const RegisterComplete = ({ history }) => {

    const { user } = useSelector((state) => ({ ...state }))
    let dispatch = useDispatch()



    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegistration'))
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            toast.error('Email and password is required')
            return
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return
        }
        try {
            const result = await auth.signInWithEmailLink(email, window.location.href)

            if (result.user.emailVerified) {
                //remove user email from local storage
                window.localStorage.removeItem('emailForRegistration')

                let user = auth.currentUser
                await user.updatePassword(password)
                const idTokenResult = await user.getIdTokenResult()

                createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                        dispatch({
                            type: 'LOGGED_IN_USER',
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role: res.data.role,
                                id: res.data._id
                            },
                        })
                    })
                    .catch(error => console.log(error))

                //redirect
                history.push('/')
            }
        } catch (error) {
            console.log('error', error)
            toast.error(error.message)
        }
    }

    const completeRegisterationForm = () => (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                className='form-control'
                value={email}
                disabled
            />
            <input
                type="password"
                className='form-control'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Your password'
                autoFocus
            />
            <button type="submit" className='btn btn-raised mt-3'>
                Complete Registeration
            </button>
        </form>
    )

    return (
        <div className='container p-5'>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <h4>Complete Registeration</h4>
                    {completeRegisterationForm()}
                </div>
            </div>
        </div>
    )
}

export default RegisterComplete