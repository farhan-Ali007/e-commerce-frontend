import React, { useEffect, useState } from 'react'
import { getCategories } from '../../functions/category'
import { Link } from 'react-router-dom'

const CategoryList = () => {

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getCategories()
            .then((res) => setCategories(res.data))
        setLoading(false)
    }, [])

    const showCategories = () => categories.map((c) => (
        <div
            key={c._id}
            className='col btn btn-outlined-primary btn-lg btn-block btn-raised m-3 '
        >
            <Link to={`/category/${c.slug}`} style={{ color: "rgb(22, 119, 255)", textDecoration: "none" }}> {c.name}</Link>
        </div>)
    )

    return (
        <div className='container'>
            <div className='row'>
                {
                    loading ? <h4 className='text-center text-danger'>Loading...</h4> : showCategories()
                }
            </div>

        </div>
    )
}

export default CategoryList
