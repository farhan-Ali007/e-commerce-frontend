import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AdminNav from '../../../components/nav/AdminNav';
import { getProductsByCount, removeProduct } from "../../../functions/product"
import AdminProductCard from '../../../components/cards/AdminProductCard';
import { toast } from 'react-toastify'

const AllProducts = () => {

    const { user } = useSelector((state) => ({ ...state }))

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const loadAllProducts = () => {
        setLoading(true)
        getProductsByCount(100)
            .then((res) => {
                setProducts(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    useEffect(() => {
        loadAllProducts()
    }, [])


    const handleRemove = (slug) => {
        // let answer = window.confirm("Delete?");
        if (window.confirm("Delete?")) {
            // console.log("send delete request", slug);
            removeProduct(slug, user.token)
                .then((res) => {
                    loadAllProducts();
                    toast.success(`${res.data.title} deleted!`);
                })
                .catch((err) => {
                    if (err.response.status === 400) toast.error(err.response.data);
                    console.log(err);
                });
        }
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className='col'>
                    {loading ? (
                        <h4 className='text-danger'>Loading</h4>
                    ) : (
                        <>
                            <h4>All Products</h4>
                            <div>
                                <div className='row'>
                                    {products.map((product) => (
                                        <div className='col-md-4 pb-3' key={product._id}>
                                            <AdminProductCard
                                                product={product}
                                                handleRemove={handleRemove}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AllProducts;
