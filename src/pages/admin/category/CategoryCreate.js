import React, { useEffect, useState } from 'react'
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { createCategory, removeCategory, getCategories } from '.././../../functions/category'
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import CategoryFrom from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';

const CategoryCreate = () => {

    const { user } = useSelector(state => ({ ...state }))

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    //filtering and searching
    //Step 1

    const [keyword, setKeyword] = useState("")


    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(name)
        setLoading(true)
        createCategory({ name }, user.token)
            .then(res => {
                console.log('res====>', res)
                setLoading(false)
                setName('')
                toast.success(`${res.data.name} created`)
                loadCategories();

            }).catch((error) => {
                console.log(error)
                setLoading(false)
                setName('')
                if (error.response.status === 400)
                    toast.error(error.response.data)
            })
    }


    useEffect(() => {
        loadCategories();
    }, [])

    const loadCategories = () => {
        getCategories().then((c) => setCategories(c.data))

    }


    const handleRemove = async (slug) => {
        // let answer = window.confirm("Are you sure yow want to delete it?")
        // console.log(answer,slug)
        if (window.confirm("Are you sure yow want to delete it?")) {
            setLoading(true)
            removeCategory(slug, user.token)
                .then(res => {
                    setLoading(false)
                    toast.info(`${res.data.name} deleted successfully`)
                    loadCategories();
                })
                .catch((error) => {
                    setLoading(false)
                    if (error.response.status === 400)
                        toast.error(error.response.data)
                })
        }
    }



    //Step 4

    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword)


    return (
        <div className='container-fluid '>
            <div className='row'>
                <div className="col-md-2"><AdminNav /></div>
                <div className='col'>
                    {
                        loading ? <h4 className='text-danger'>Loading...</h4> : <h4>Create category</h4>
                    }
                    <br />
                    <CategoryFrom handleSubmit={handleSubmit} name={name} setName={setName} />
                    {/*step 2 and Step 3 */}
                    <LocalSearch keyword={keyword} setKeyword={setKeyword} />

                    
                    {/*Step 5*/}
                    {categories.filter(searched(keyword)).map((c) => (
                        <div className='alert alert-secondary' key={c._id}>
                            {c.name}<span onClick={() => handleRemove(c.slug)} className='btn btn-sm float-right text-danger'><DeleteOutlined /></span>{""}
                            <Link to={`/admin/category/${c.slug}`}><span className='btn btn-sm float-right text-warning'><EditOutlined /></span></Link>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default CategoryCreate;
