import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Card, Tooltip } from 'antd'
import _ from 'lodash'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { showAverage } from '../../functions/rating'
import laptop from '../../images/laptop.png'


const { Meta } = Card;

const ProductCard = ({ product }) => {
    const { user, cart } = useSelector((state) => ({ ...state }))
    const dispatch = useDispatch()

    const [tooltip, setTooltip] = useState('Click to add')

    //destructure
    const { images, title, description, slug, price } = product;


    const handleAddToCart = () => {
        //create cart array
        let cart = [];
        let unique = []; // Declare unique outside the if block

        if (typeof window !== "undefined") {
            //if cart is in Local Storage GET it
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            //push new product to cart
            cart.push({
                ...product,
                count: 1
            });

            //remove duplicate
            unique = _.uniqWith(cart, _.isEqual);
            //save to local storage
            // console.log("Unique=====>", unique);

            localStorage.setItem('cart', JSON.stringify(unique));
        }

        //show tooltip
        setTooltip('Added');

        //Add to redux state
        dispatch({
            type: "ADD_TO_CART",
            payload: unique,
        });

        //show cart items in side drawer
        dispatch({
            type: "SET_VISIBLE",
            payload: true,
        });

    };

    return (
        <>
            {product && product.ratings && product.ratings.length > 0
                ? showAverage(product)
                : <div className='text-center pt-1 pb-3'>No rating yet</div>}
            <Card cover={
                <img alt=''
                    src={images && images.length ? images[0].url : laptop}
                    style={{ height: "150px", objectFit: "cover" }}
                    className='p-1' />
            }
                actions={[
                    <Link style={{ textDecoration: "none" }} to={`/product/${slug}`}>
                        <EyeOutlined
                            className='text-success' />
                        <br />
                        View Product
                    </Link>,
                    <Tooltip title={product.quantity < 1 ? 'Out of Stock' : tooltip}>
                        <button
                            onClick={handleAddToCart}
                            className={`btn ${product.quantity < 1 ? 'disabled' : 'text-danger'}`}
                            disabled={product.quantity < 1}
                            aria-label="Add to Cart"
                            style={{
                                border: 'none',
                                background: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                textTransform: "capitalize",
                                fontWeight: "inherit"
                            }}
                        >
                            <ShoppingCartOutlined />
                            <br />
                            {product.quantity < 1 ? 'Out of Stock' : 'Add To Cart'}
                        </button>
                    </Tooltip>

                ]}>

                <Meta
                    title={`${title} - $${price}`}
                    description={`${description && description.substring(0, 40)}... `}
                />

            </Card>
        </>
    )
}

export default ProductCard
