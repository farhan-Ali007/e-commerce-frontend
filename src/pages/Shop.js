import { BarsOutlined, BgColorsOutlined, CarOutlined, ClusterOutlined, CrownOutlined, DollarOutlined, StarOutlined } from '@ant-design/icons'
import { Checkbox, Menu, Radio, Slider } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../components/cards/ProductCard'
import Star from '../components/forms/Star'
import { getCategories } from '../functions/category'
import { getProductsByCount, getProductsByFilter } from '../functions/product'
import { getSubs } from '../functions/sub'

const { SubMenu, ItemGroup } = Menu;

const Shop = () => {

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [subs, setSubs] = useState([])
    const [categoryIds, setCategoryIds] = useState([])
    const [price, setPrice] = useState([0, 0])
    const [ok, setOk] = useState(false)
    const [loading, setLoading] = useState(false);
    const [star, setStar] = useState('');
    const [sub, setSub] = useState('');
    const [brand, setBrand] = useState('')
    const [color, setColor] = useState('')
    const [brands, setBrands] = useState([
        "Apple",
        "Samsung",
        "Lenovo",
        "HP",
        "ASUS",
        "Microsoft"]);
    const [colors, setColors] = useState([
        "Black",
        "Silver",
        "Brown",
        "Blue",
        "Red",
        "White",]);
    const [shipping, setShipping] = useState("")

    let dispatch = useDispatch()
    let { search } = useSelector((state) => ({ ...state }))
    const { text } = search;

    useEffect(() => {
        loadAllProducts()
        //fetch categories
        getCategories()
            .then((res) => {
                setCategories(res.data)
            })
        //fetch subcategories
        getSubs()
            .then((res) => {
                console.log(res.data)
                setSubs(res.data)
            })

    }, [])


    // 1. load product by default on load page
    const loadAllProducts = () => {
        getProductsByCount(12)
            .then((res) => {
                // console.log(res)
                setProducts(res.data)
                setLoading(false)
            })
            .catch((error) => {
                console.log("Error in fetching products", error)
            })

    }

    // 2. Load products on user search input

    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProductsByFilter({ query: text })
        }, 300)
        return () => clearTimeout(delayed)
    }, [text])

    const fetchProductsByFilter = (arg) => {
        getProductsByFilter(arg)
            .then((res) => {
                setProducts(res.data)
            })
    }
    //3. Load products based on price range
    useEffect(() => {
        if (price[0] !== 0 || price[1] !== 0) {
            fetchProductsByFilter({ price });
        }
    }, [ok, price]);

    const handleSlider = (value) => {
        dispatch({
            type: "SEARCH_QUERY",
            payLoad: {
                text: ""
            }

        })
        setCategoryIds([]);
        setPrice(value);
        setStar("");
        setSub('');
        setColor('');
        setShipping('');
        setBrand('');
        setTimeout(() => {
            setOk(!ok);
        }, 300)

    }

    //4. Load products based on category
    //show categories in a list of checkbox

    const showCategories = () => {
        return categories.map((c) => (
            <div key={c._id} style={{ marginTop: "5px" }} >
                <Checkbox onChange={handleCheck}
                    className='pb-2 pt-2 pl-4 pr-4'
                    value={c._id}
                    name='Category'
                    checked={categoryIds.includes(c._id)}>
                    {c.name}
                </Checkbox>
                <br />
            </div>))
    }

    //Handle check for categories
    const handleCheck = (e) => {
        //reset
        dispatch({
            type: "SEARCH_QUERY",
            payLoad: {
                text: ""
            }

        })
        setPrice([0, 0])
        setStar("");
        setSub('');
        setColor('');
        setBrand('');
        setShipping('');

        const inTheState = [...categoryIds]
        const justChecked = e.target.value
        const foundInTheState = inTheState.indexOf(justChecked)  //true or -1

        //IndexOf method ?? IF NOT FOUND RETURNS -1 else returns 
        if (foundInTheState === -1) {
            inTheState.push(justChecked)
        } else {
            // if found pull out one item from index
            inTheState.splice(foundInTheState, 1)
        }

        setCategoryIds(inTheState)
        // console.log("In the state ------>", inTheState)
        fetchProductsByFilter({ category: inTheState })
    }

    //5. Show products by star rating

    const handleStarClick = (num) => {
        console.log("Star Numbers ===>", num);
        dispatch({
            type: "SEARCH_QUERY",
            payload: {
                text: ""
            }
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar(num);
        setSub('')
        setBrand('');
        setShipping('');
        setColor('')
        fetchProductsByFilter({ stars: num })

    };

    const showStars = () => (<div className='pr-4 pl-4 pb-2 pt-3'>
        <Star starClick={handleStarClick} numberOfStars={5} />
        <Star starClick={handleStarClick} numberOfStars={4} />
        <Star starClick={handleStarClick} numberOfStars={3} />
        <Star starClick={handleStarClick} numberOfStars={2} />
        <Star starClick={handleStarClick} numberOfStars={1} />

    </div>)

    //6. show products by sub categories

    const handleSub = (sub) => {

        setSub(sub)
        dispatch({
            type: "SEARCH_QUERY",
            payload: {
                text: ""
            }
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setBrand('');
        setColor('');
        setShipping('');
        setStar('');
        fetchProductsByFilter({ sub })
        // console.log("Sub category----->", s)

    }

    const showSubs = () => {
        return subs.map((s) => (
            <div
                key={s._id}
                className='p-2 m-1 mt-3 mb-1 badge badge-secondary'
                onClick={() => handleSub(s)}
                style={{ cursor: "pointer" }}
            >
                {s.name}
            </div>
        ));
    };

    //7. show products by Brands

    const handleBrand = (e) => {
        setSub('')
        dispatch({
            type: "SEARCH_QUERY",
            payload: {
                text: ""
            }
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setColor('');
        setShipping('');
        setBrand(e.target.value)
        fetchProductsByFilter({ brand: e.target.value })
    }

    const showBrands = () => {

        return brands.map((b) =>
        (
            <>
                <Radio
                    value={b}
                    name={b}
                    checked={b === brand}
                    onChange={handleBrand}
                    className='pb-1 pl-4 pr-4'>
                    {b}
                </Radio>
            </>
        )
        )
    }

    //8. show products by colors

    const handleColor = (e) => {
        setSub('')
        dispatch({
            type: "SEARCH_QUERY",
            payload: {
                text: ""
            }
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setBrand('')
        setShipping('')
        setStar('');
        setColor(e.target.value)
        fetchProductsByFilter({ color: e.target.value })
    }

    const showColors = () => {

        return colors.map((c) =>
        (
            <>
                <Radio
                    value={c}
                    name={c}
                    checked={c === color}
                    onChange={handleColor}
                    className='pb-1 pl-4 pr-4'>
                    {c}
                </Radio>
            </>
        )
        )
    }


    //9. show products by Shipping yes/no

    const handleShippingChange = (e) => {
        setSub('')
        dispatch({
            type: "SEARCH_QUERY",
            payload: {
                text: ""
            }
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setBrand('')
        setStar('');
        setColor('');
        setShipping(e.target.value)
        fetchProductsByFilter({ shipping: e.target.value })
    }

    const showShipping = () => {
        return (
            <>
                <Checkbox
                    className='pb-2 pl-4 pr-4'
                    onChange={handleShippingChange}
                    value="Yes"
                    checked={shipping === "Yes"}
                >
                    Yes
                </Checkbox>

                <Checkbox
                    className='pb-2 pl-4 pr-4'
                    onChange={handleShippingChange}
                    value="No"
                    checked={shipping === "No"}
                >
                    No
                </Checkbox>

            </>
        )

    }


    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-3 pt-3'>
                    <h4>Search/Filter</h4>
                    <hr />
                    <Menu mode='inline' defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']}>
                        {/* price */}
                        <SubMenu key="1"
                            title={
                                <span className='h6 '>
                                    <DollarOutlined className='pr-3' />

                                    Price
                                </span>}>
                            <div>
                                <Slider className='ml-4 mr-4'
                                    tooltip={{ formatter: (v) => `$${v}` }}
                                    range
                                    value={price}
                                    onChange={handleSlider}
                                    max="3500" />
                            </div>
                        </SubMenu>
                        {/* categoriey */}
                        <SubMenu key="2"
                            title={
                                <span className='h6 '>
                                    <ClusterOutlined className='pr-3' />
                                    Categories
                                </span>}>
                            <div style={{ marginTop: "-10px", marginBottom: "20px", }}>
                                {showCategories()}
                            </div>
                        </SubMenu>

                        {/* stars */}
                        <SubMenu key="3"
                            title={
                                <span className='h6 '>
                                    <StarOutlined className='pr-3' />
                                    Rating
                                </span>}>
                            <div style={{ marginTop: "-10px" }}>
                                {showStars()}
                            </div>
                        </SubMenu>

                        {/* Sub categories */}
                        <SubMenu key="4"
                            title={
                                <span className='h6 '>
                                    <BarsOutlined className='pr-3' />
                                    Sub Categories
                                </span>}>
                            <div style={{ marginTop: "-10px" }} className='pl-4 pr-4'>
                                {showSubs()}
                            </div>
                        </SubMenu>

                        {/* Brands */}

                        <SubMenu key="5"
                            title={
                                <span className='h6 '>
                                    <CrownOutlined className='pr-3' />
                                    Brands
                                </span>}>
                            <div
                                style={{
                                    marginTop: "0px",
                                    marginBottom: "20px",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                                className=' pr-5 pl-1 ml-1'>
                                {showBrands()}
                            </div>
                        </SubMenu>

                        {/* Colors */}

                        <SubMenu key="6"
                            title={
                                <span className='h6 '>
                                    <BgColorsOutlined className='pr-3' />
                                    Colors
                                </span>}>
                            <div
                                style={{
                                    marginTop: "0px",
                                    marginBottom: "20px",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                                className=' pr-5 pl-1 ml-1'>
                                {showColors()}
                            </div>
                        </SubMenu>

                        {/* Shipping */}

                        <SubMenu key="7"
                            title={
                                <span className='h6 '>
                                    <CarOutlined className='pr-3' />
                                    Shipping
                                </span>}>
                            <div
                                style={{
                                    marginTop: "0px",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                                className=' pr-5 pl-1 ml-1'>
                                {showShipping()}
                            </div>
                        </SubMenu>
                    </Menu>
                </div>

                <div className='col-md-9'>
                    {
                        loading ? (
                            <h4 className='text-danger'>Loading...</h4>
                        ) : (
                            <h4 className='text-danger text-center pt-2'>Products</h4>
                        )
                    }
                    {products.length < 0 && <p>No product found</p>}
                    <div className='row pb-5'>
                        {
                            products.map((p) => {
                                return (
                                    <div key={p._id} className='col-md-4 mt-3'>
                                        <ProductCard product={p} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shop
