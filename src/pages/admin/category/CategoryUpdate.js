import React, { useEffect, useState } from 'react'
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getCategory, updateCategory } from '.././../../functions/category'
import CategoryFrom from '../../../components/forms/CategoryForm';

const CategoryUpdate = ({ history, match }) => {

    const { user } = useSelector(state => ({ ...state }))

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);




    useEffect(() => {
        loadCategory()
    }, [])

    const loadCategory = () => {
        getCategory(match.params.slug).then((c) => setName(c.data.name))

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(name)
        setLoading(true)
        updateCategory(match.params.slug, { name }, user.token)
            .then(res => {
                console.log('res====>', res)
                setLoading(false)
                setName('')
                toast(`Updated to ${res.data.name} `)
                history.push("/admin/category")
            }).catch((error) => {
                console.log(error)
                setLoading(false)
                setName('')
                if (error.response.status === 400)
                    toast.error(error.response.data)
            })
    }


    return (
        <div className='container-fluid '>
            <div className='row'>
                <div className="col-md-2"><AdminNav /></div>
                <div className='col'>
                    {
                        loading ? <h4 className='text-danger'>Loading...</h4> : <h4>Update category</h4>
                    }
                    <br />
                    <CategoryFrom handleSubmit={handleSubmit} name={name} setName={setName} />
                    <hr />

                </div>

            </div>
        </div>
    )
}

export default CategoryUpdate;
