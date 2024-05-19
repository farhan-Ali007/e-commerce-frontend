import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CategoryForm from '../../../components/forms/CategoryForm'; // Corrected import
import AdminNav from '../../../components/nav/AdminNav';
import { getCategories } from '../../../functions/category';
import { getsub, updateSub } from '../../../functions/sub'; // Corrected import

const SubCreate = ({ match, history }) => {
    const { user } = useSelector(state => ({ ...state }));

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [parent, setParent] = useState('');

    useEffect(() => {
        loadCategories();
        loadSub();
    }, []);

    const loadCategories = () => {
        getCategories().then((c) => setCategories(c.data));
    };

    const loadSub = () => { // Corrected function name
        getsub(match.params.slug).then((s) => {
            if (s.data) { // Check if data exists
                setName(s.data.name);
                setParent(s.data.parent);
            }
        }).catch((error) => {
            console.error('Error loading subcategory:', error); // Debug log
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        updateSub(match.params.slug, { name, parent }, user.token)
            .then((res) => {

                setLoading(false);
                setName('');
                toast.success(`${res.data.name} updated successfully!`);
                history.push("/admin/sub");
            })
            .catch((error) => {
                console.error('Update error:', error);
                setLoading(false);
                setName('');
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data);
                }
            });
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className="col-md-2"><AdminNav /></div>
                <div className='col'>
                    {loading ? <h4 className='text-danger'>Loading...</h4> : <h4>Update sub category</h4>}
                    <br />
                    <div className='form-group'>
                        <label>Parent category</label>
                        <select
                            name='category'
                            className="form-control"
                            value={parent}
                            onChange={(e) => setParent(e.target.value)}
                        >
                            <option>Please select</option>
                            {categories.length > 0 &&
                                categories.map((c) => (
                                    <option key={c._id} value={c._id} selected={c._id === parent}>
                                        {c.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />
                </div>
            </div>
        </div>
    );
};

export default SubCreate;
