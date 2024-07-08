import React, { useEffect, useState } from 'react'
import ProductCard from '../components/cards/ProductCard'
import { getProductsByCount, getProductsByFilter } from '../functions/product'
import { getCategories } from '../functions/category'
import { useDispatch, useSelector } from 'react-redux'
import { Menu, Slider, Checkbox } from 'antd'
import { DollarOutlined, DownSquareOutlined } from '@ant-design/icons'

const { SubMenu, ItemGroup } = Menu;

const Shop = () => {

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [categoryIds, setCategoryIds] = useState([])
    const [price, setPrice] = useState([0, 0])
    const [ok, setOk] = useState(false)
    const [loading, setLoading] = useState(false);

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
        // console.log("Load products based on price range", ok)
        fetchProductsByFilter({ price })
    }, [ok, price])

    const handleSlider = (value) => {
        dispatch({
            type: "SEARCH_QUERY",
            payLoad: {
                text: ""
            }

        })
        setCategoryIds([])
        setPrice(value)
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

        dispatch({
            type: "SEARCH_QUERY",
            payLoad: {
                text: ""
            }

        })
        setPrice([0, 0])

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

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-3 pt-3'>
                    <h4>Search/Filter</h4>
                    <hr />
                    <Menu mode='inline' defaultOpenKeys={['1', '2']}>
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
                                    <DownSquareOutlined className='pr-3' />
                                    Categories
                                </span>}>
                            <div style={{ marginTop: "-10px" }}>
                                {showCategories()}
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
