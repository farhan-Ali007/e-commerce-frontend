import React, { useEffect, useState } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { createProduct, getProduct, updateProduct } from '../../../functions/product'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { LoadingOutlined } from '@ant-design/icons'
import ProductCreateFrom from '../../../components/forms/ProductCreateFrom'
import { getCategories, getCategorySubs } from '../../../functions/category'
import FileUpload from '../../../components/forms/FileUpload'
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm'





const ProductUpdate = ({ match, history }) => {

    const initialState = {
        title: "",
        description: "",
        price: "",
        category: "",
        subs: [],
        shipping: "",
        quantity: "",
        images: [],
        colors: ["Black", "Silver", "Brown", "Blue", "Red", "White", "Yellow"],
        brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
        color: "",
        brand: "",
    };


    // state
    const [values, setValues] = useState(initialState);
    const [categories, setCategories] = useState([]);
    const [subOptions, setSubOptions] = useState([]);
    const [arrayOfSubs, setArrayOfSubs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));
    // router
    const { slug } = match.params;

    useEffect(() => {
        loadProduct();
        loadCategories();
    }, []);

    const loadProduct = () => {
        getProduct(slug).then((p) => {
            // console.log("single product", p);
            // 1 load single proudct
            setValues({ ...values, ...p.data });
            // 2 load single product category subs
            getCategorySubs(p.data.category._id).then((res) => {
                setSubOptions(res.data); // on first load, show default subs
            });
            // 3 prepare array of sub ids to show as default sub values in antd Select
            let arr = [];
            p.data.subs.map((s) => {
                arr.push(s._id);
            });
            // console.log("ARR", arr);
            setArrayOfSubs((prev) => arr); // required for ant design Select to work
        });
    };

    const loadCategories = () =>
        getCategories().then((c) => {
            // console.log("GET CATEGORIES IN UPDATE PRODUCT", c.data);
            setCategories(c.data);
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        values.subs = arrayOfSubs;
        values.category = selectedCategory ? selectedCategory : values.category;

        updateProduct(slug, values, user.token)
            .then((res) => {
                setLoading(false)
                toast.success(`${res.data.title} is updated`)
                history.push("/admin/products")
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
                toast.error(err.response.data.message)
            })
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
        // console.log(e.target.name, " ----- ", e.target.value);
    };

    const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log("CLICKED CATEGORY", e.target.value);
        setValues({ ...values, subs: [] });

        setSelectedCategory(e.target.value)

        getCategorySubs(e.target.value).then((res) => {
            // console.log("SUB OPTIONS ON CATGORY CLICK", res);
            setSubOptions(res.data);
        });

        console.log("EXISTING CATEGORY values.category ", values.category)

        //If user clicks back to original category
        //Show its sub ctegories default
        if (values.category._id === e.target.value) {
            loadProduct()
        }

        //Clear old sub category ids
        setArrayOfSubs([])
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">
                    {
                        loading ? <LoadingOutlined className='text-danger h1' /> : <h4>Product update</h4>
                    }

                    {/* {JSON.stringify(values)} */}

                    <div className='p-3'>
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}
                        />
                    </div>


                    <ProductUpdateForm
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        setValues={setValues}
                        values={values}
                        handleCategoryChange={handleCategoryChange}
                        categories={categories}
                        subOptions={subOptions}
                        arrayOfSubs={arrayOfSubs}
                        setArrayOfSubs={setArrayOfSubs}
                        selectedCategory={selectedCategory}
                    />
                    <hr />
                </div>
            </div>
        </div>
    );
};

export default ProductUpdate;