import React, { useEffect, useState } from 'react'
import UserNav from '../../components/nav/UserNav';
import { getWishlist, removeFromWishlist } from '../../functions/user'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons'

const Wishlist = () => {

    const [wishlist, setWishlist] = useState([])
    const { user } = useSelector((state) => ({ ...state }))

    const loadWishlist = () => {
        getWishlist(user.token)
            .then((res) => {
                // console.log("Wishlist------>", res.data)
                setWishlist(res.data.wishlist)
            })
    }

    useEffect(() => {
        loadWishlist()
    }, [])


    const handleRemove = (productId) => {
        removeFromWishlist(productId, user.token)
            .then((res) => {
                // console.log("Removed wishlist---->", res.data)
                loadWishlist()
            })
    }

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className="col-md-2"><UserNav /></div>
                <div className='col'>
                    <h4 className='text-center p-4'>Wishlist</h4>
                    {wishlist && wishlist.map((p) => {
                        return <div key={p._id} className='alert alert-secondary'>
                            <Link style={{ textDecoration: "none" ,color:"rgb(22, 119, 255)"}} to={`/product/${p.slug}`}>{p.title}</Link>
                            <span className='btn btn-sm float-right' onClick={() => handleRemove(p._id)}>
                                <DeleteOutlined className='text-danger' />
                            </span>
                        </div>
                    })}
                </div>

            </div>
        </div>
    )
}

export default Wishlist;
