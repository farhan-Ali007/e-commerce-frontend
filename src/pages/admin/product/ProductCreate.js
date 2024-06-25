import React, { useEffect, useState } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { createProduct } from '../../../functions/product'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { LoadingOutlined } from '@ant-design/icons'
import ProductCreateFrom from '../../../components/forms/ProductCreateFrom'
import { getCategories, getCategorySubs } from '../../../functions/category'
import FileUpload from '../../../components/forms/FileUpload'

const ProductCreate = () => {

    const initialState = {
        title: '',
        description: '',
        price: '',
        categories: '',
        category: '',
        subs: [],
        shipping: '',
        quantity: '',
        images: [],
        colors: ["Black", "Silver", "Brown", "Blue", "Red", "White", "Yellow"],
        brands: ["Apple", "Samsung", "Lenovo", "HP", "ASUS", "Microsoft"],
        color: '',
        brand: ''
    }


    const [values, setValues] = useState(initialState)
    const [subOptions, setSubOptions] = useState([])
    const [showSub, setShowSub] = useState(false)
    const [loading, setLoading] = useState(false)


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
                window.alert(`Create ${res.data.title} ?`)
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
        setValues({ ...values, subs: [], category: e.target.value });

        getCategorySubs(e.target.value)
            .then(res => {
                console.log("Response ====>", res)
                setSubOptions(res.data)
            })
        setShowSub(true)
    }

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'><AdminNav /></div>
                <div className='col-md-10'>
                    {loading ? <LoadingOutlined className='text-danger h1' /> : <h4>Product create</h4>}
                    <hr />
                    {/* {JSON.stringify(values.images)} */}

                    <div className='p-3'>
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}
                        />
                    </div>

                    <ProductCreateFrom
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        values={values}
                        setValues={setValues}
                        handleCategoryChange={handleCategoryChange}
                        subOptions={subOptions}
                        showSub={showSub} />
                </div>
            </div>

        </div>
    )
}

export default ProductCreate



