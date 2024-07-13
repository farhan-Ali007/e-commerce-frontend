import React, { useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '../../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'antd';
import { GoogleOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { createOrUpdateUser } from '../../functions/auth';

const Login = () => {
    const [email, setEmail] = useState('farhanali7991225@gmail.com');
    const [password, setPassword] = useState('00000000');
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        let intended = location.state;
        // console.log('Intended:', intended); 
        if (intended) {
            return;
        } else {
            if (user && user.token) {
                history.push("/");
            }
        }
    }, [user, history, location.state]);

    const roleBasedRedirect = (res) => {
        let intended = location.state;
        // console.log('Role Based Redirect Intended:', intended); 
        if (intended) {
            history.push(intended.from);
        } else {
            if (res.data.role === "admin") {
                history.push("/admin/dashboard");
            } else {
                history.push("/user/history");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();

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
                    });
                    roleBasedRedirect(res);
                })
                .catch(error => console.log(error));
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    const googleLogin = () => {
        auth.signInWithPopup(googleAuthProvider)
            .then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();
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
                        });
                        roleBasedRedirect(res);
                    })
                    .catch(error => console.log(error));
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                toast.error(error.message);
            });
    };

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
    );

    return (
        <div className='container p-5'>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    {!loading ? <h4>Login</h4> : <h4 className='text-danger'>Loading...</h4>}
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
    );
};

export default Login;
