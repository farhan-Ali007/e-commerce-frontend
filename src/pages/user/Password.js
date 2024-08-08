import React, { useState } from 'react'
import UserNav from '../../components/nav/UserNav';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

const Password = () => {

    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // console.log(password)

        await auth.currentUser.updatePassword(password)
            .then(() => {
                setLoading(false)
                setPassword("")
                toast.success("Password updated successfully!")
            })
            .catch(err => {
                setLoading(false)
                toast.error(err.message)

            })

    }

    const passwordUpdateForm = () => <form onSubmit={handleSubmit}>
        <div className='form-group' >
            <input type='password'
                onChange={(e) => setPassword(e.target.value)}
                className='form-control'
                placeholder='Enter your new password'
                disabled={loading}
                value={password}
            />
            <button className='btn btn-primary mt-2'
                disabled={!password || password.length < 6 || loading}
            >
                Submit
            </button>
        </div>
    </form>


    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className="col-md-2"><UserNav /></div>
                <div className='col'>
                    {loading ? <h4 className='text-danger'>Loading...</h4>
                        :
                        <h4 className='text-center pt-5 pb-0'> Update Your Password</h4>}
                    {passwordUpdateForm()}
                </div>

            </div>
        </div>
    )
}

export default Password;
