import React, { useEffect, useState } from 'react';
import ModalImage from 'react-modal-image';
import Laptop from '../../images/laptop.png';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons'

const ProductCardInCheckout = ({ p }) => {
    const dispatch = useDispatch();

    const colors = [
        "Black",
        "Silver",
        "Brown",
        "Blue",
        "Red",
        "White"
    ];

    const [color, setColor] = useState(p.color || "");
    const [errorShown, setErrorShown] = useState(false);

    const handleColorChange = (e) => {
        // console.log("Color Changed ==>", e.target.value);
        let cart = [];

        if (typeof window !== "undefined") {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart[i].color = e.target.value;
                }
                return product; // Return the product to avoid map function issues.
            });

            // Update local storage and Redux store
            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: "ADD_TO_CART",
                payload: cart,
            });

            // Update local component state
            setColor(e.target.value);
        }
    };
    const handleRemove= (e) => {
        console.log("Color Changed ==>", e.target.value);
        let cart = [];

        if (typeof window !== "undefined") {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart.splice(i,1)
                }
                return product; // Return the product to avoid map function issues.
            });

            // Update local storage and Redux store
            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: "ADD_TO_CART",
                payload: cart,
            });

        }
    };

    useEffect(() => {
        setColor(p.color || "");
    }, [p.color]);

    const handleQuantityChange = (e) => {
        let cart = [];
        let count = e.target.value < 1 ? 1 : e.target.value;

        if (typeof window !== "undefined") {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            for (let i = 0; i < cart.length; i++) {
                if (cart[i]._id === p._id) {
                    if (count > p.quantity) {
                        if (!errorShown) {
                            toast.error(`Max available quantity is ${p.quantity}`);
                            setErrorShown(true);
                        }
                        return; // Exit the function to avoid further execution
                    }

                    setErrorShown(false); // Reset errorShown if quantity is within limit
                    cart[i].count = count;
                    break; // Exit the loop once the product is found and updated
                }
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: "ADD_TO_CART",
                payload: cart,
            });
        }
    };



    return (
        <tbody>
            <tr>
                <td>
                    <div style={{ width: "100px", height: "auto" }}>
                        {p.images.length ?
                            (
                                <ModalImage small={p.images[0].url} large={p.images[0].url} />
                            ) : (
                                <ModalImage small={Laptop} large={Laptop} />
                            )
                        }
                    </div>
                </td>
                <td>{p.title}</td>
                <td>${p.price}</td>
                <td>{p.brand}</td>
                <td>
                    <select
                        name='color'
                        value={color}
                        onChange={handleColorChange}
                        className='form-control'>
                        {
                            p.color ? <option value={p.color}>{p.color}</option> : <option>Select</option>
                        }
                        {
                            colors.filter((c) => c !== p.color).map((c) => (
                                <option
                                    key={c}
                                    value={c}
                                    className='text-danger'>
                                    {c}
                                </option>
                            ))
                        }
                    </select>
                </td>
                <td className='text-center'>
                    <input type='number' className='form-control' value={p.count} onChange={handleQuantityChange} />
                </td>
                <td className='text-center'>
                    {
                        p.shipping === "Yes" ? <CheckCircleOutlined className='text-success' /> : <CloseCircleOutlined className='text-danger' />
                    }
                </td>
                <td className='text-center'><CloseOutlined style={{ cursor: "pointer", color: "red" }} onClick={handleRemove} /></td>
            </tr>
        </tbody>
    );
}

export default ProductCardInCheckout;
