import React, { useEffect, useState } from 'react'
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { createSub, removeSub, getSubs } from '.././../../functions/sub'
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import CategoryFrom from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';
import { getCategories } from '../../../functions/category';

const SubCreate = () => {

    const { user } = useSelector(state => ({ ...state }))

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [subs, setSubs] = useState([]);

    //filtering and searching
    //Step 1

    const [keyword, setKeyword] = useState("")


    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(name)
        setLoading(true)
        createSub({ name, parent: category }, user.token)
            .then(res => {
                console.log('res====>', res)
                setLoading(false)
                setName('')
                toast.success(`${res.data.name} created`)
                loadCategories();
                loadSubs()
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
        loadSubs();
    }, [])

    const loadCategories = () => {
        getCategories().then((c) => setCategories(c.data))

    }
    const loadSubs = () => {
        getSubs().then((s) => setSubs(s.data))

    }


    const handleRemove = async (slug) => {
        // let answer = window.confirm("Are you sure yow want to delete it?")
        // console.log(answer,slug)
        if (window.confirm("Are you sure yow want to delete it?")) {
            setLoading(true)
            removeSub(slug, user.token)
                .then(res => {
                    setLoading(false)
                    toast.info(`${res.data.name} deleted successfully`)
                    loadCategories();
                    loadSubs();
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
                        loading ? <h4 className='text-danger'>Loading...</h4> : <h4>Create sub category</h4>
                    }
                    <br />
                    <div className='form-group'>
                        <label>Parent category</label>
                        <select name='category' className="form-control"
                            onChange={(e) => setCategory(e.target.value)}>
                            <option>Please select</option>
                            {categories.length > 0 &&
                                categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <CategoryFrom handleSubmit={handleSubmit} name={name} setName={setName} />
                    {/*step 2 and Step 3 */}
                    <LocalSearch keyword={keyword} setKeyword={setKeyword} />


                    {/*Step 5*/}
                    {subs.filter(searched(keyword)).map((s) => (
                        <div className='alert alert-secondary' key={s._id}>
                            {s.name}
                            <span
                                onClick={() => handleRemove(s.slug)}
                                className='btn btn-sm float-right text-danger'>
                                <DeleteOutlined />
                            </span>{""}
                            <Link to={`/admin/sub/${s.slug}`}>
                                <span className='btn btn-sm float-right text-warning'>
                                    <EditOutlined />
                                </span></Link>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default SubCreate;
