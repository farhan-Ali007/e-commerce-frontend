import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ForgotPassword = ({ history }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);


    const { user } = useSelector((state) => ({ ...state }))

    useEffect(() => {
        if (user && user.token) {
            history.push("/")
        }
    }, [user,history])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const config = {
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
            handleCodeInApp: true,
        };

        // Check if the environment supports the operation
        if (!isSupportedEnvironment()) {
            setLoading(false);
            toast.error("Error: This operation is not supported in the current environment.");
            return;
        }

        await auth.sendPasswordResetEmail(email, config)
            .then(() => {
                setEmail("");
                setLoading(false);
                toast.success("Check your email for password reset link");
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error in forgot password", error);
                toast.error(error.message);
            });
    };

    // Check if the environment supports the operation
    const isSupportedEnvironment = () => {
        console.log("Current protocol:", window.location.protocol);
        return window.location.protocol === 'http:' || window.location.protocol === 'https:';
    }

    return (
        <div className='container col-md-6 offset-md-3 p-5'>
            {loading ? <h4 className='text-danger'>Loading...</h4> : <h4 className='text-center pb-2 pt-2'>Forgot Password?</h4>}
            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    className='form-control'
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    autoFocus
                />
                <br />
                <button type='submit' className='btn btn-raised' disabled={!email}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
