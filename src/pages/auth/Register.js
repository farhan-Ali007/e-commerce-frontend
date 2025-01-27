import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'

const Register = ({ history }) => {

    const [email, setEmail] = useState('')

    const { user } = useSelector((state) => ({ ...state }))

    useEffect(() => {
        if (user && user.token) {
            history.push("/")
        }
    }, [user, history])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp: true,
        };
        console.log('invoked', email);
        await auth.sendSignInLinkToEmail(email, config)
            .then(() => {
                // Log the user's token after the sign-in link is sent
                const user = auth.currentUser;
                if (user) {
                    return user.getIdToken().then((token) => {
                        console.log('Token:', token);
                    });
                } else {
                    console.log('No user is signed in.');
                }
            })
            .catch((error) => {
                console.error('Error sending sign-in link:', error);
            });
        toast.success(`Email is sent to ${email}. Click the link to complete your registration.`);
        // save user email in local storage
        window.localStorage.setItem('emailForRegistration', email);
        // clear state
        setEmail('');
    };


    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                className='form-control'
                placeholder='Your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <button type="submit" className='btn btn-raised mt-3'>
                Register
            </button>
        </form>
    )

    return (
        <div className='container p-5'>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <h4
                        className='text-center pb-2'
                    >Register</h4>
                    {registerForm()}
                </div>
            </div>
        </div>
    )
}

export default Register