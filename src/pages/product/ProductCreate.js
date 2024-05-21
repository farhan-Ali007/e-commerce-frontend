import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/nav/AdminNav'
import { createProduct } from '../../functions/product'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import ProductCreateFrom from '../../components/forms/ProductCreateFrom'
import { getCategories, getCategorySubs } from '../../functions/category'

const ProductCreate = () => {

    const initialState = {
        title: 'Macbook',
        description: 'This is an Apple Product',
        price: '999999',
        categories: '',
        category: '',
        subs: [],
        shipping: 'Yes',
        quantity: '50',
        images: [],
        colors: ["Black", "Silver", "Brown", "Blue", "Orange", "Red", "White", "Purple", "Pink", "Yellow"],
        brands: ["Apple", "Samsung", "Lenovo", "HP", "ASUS", "Microsoft"],
        color: 'Silver',
        brand: 'Apple'
    }


    const [values, setValues] = useState(initialState)
    const [subOptions, setSubOptions] = useState([])


    //redux
    const { user } = useSelector((state) => ({ ...state }))

    useEffect(() => {
        loadCategories();
    }, [])


    const loadCategories = () =>
        getCategories().then((c) => setValues({ ...values, categories: c.data }))



    const handleSubmit = (e) => {
        e.preventDefault();
        createProduct(values, user.token)
            .then(res => {
                console.log(res)
                window.alert(`${res.data.title} is created`)
                toast.success("Product created successfully!")
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
                if (err.response && err.response.status === 400) {
                    toast.error(err.response.data.error);
                }
            });
    }

    const handleChange = (e) => {
        if (e.target.name === 'category') {
            setValues({ ...values, category: e.target.value });
        } else {
            setValues({ ...values, [e.target.name]: e.target.value });
        }
        // console.log(e.target.name, '------------', e.target.value)
    }


    const handleCategoryChange = (e) => {
        e.preventDefault()
        console.log("CLICKED CATEGORY =====> ", e.target.value)
        setValues({ ...values, category: e.target.value });

        getCategorySubs(e.target.value)
        .then(res=>{
            console.log("Response ====>",res)
            setSubOptions(res.data)
        })
    }

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'><AdminNav /></div>
                <div className='col-md-10'>
                    <h4>Product create</h4>
                    <hr />
                    {/* {JSON.stringify(values.categories)} */}
                    <ProductCreateFrom
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        values={values}
                        handleCategoryChange={handleCategoryChange} />
                </div>
            </div>

        </div>
    )
}

export default ProductCreate



