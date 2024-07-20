import React from 'react'
import { Drawer, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import laptop from '../../images/laptop.png'
import { Link } from 'react-router-dom'

const SideDrawer = () => {
    const dispatch = useDispatch()
    const { drawer, cart } = useSelector((state) => ({ ...state }))

    const imageStyle = {
        width: "100%",
        height: "auto",
        objectFit: "cover"
    }

    return (
        <Drawer open={drawer}
            width={"250px"}
            className='text-center'
            title={`${cart.length} items in cart`}
            placement="right"
            closable={false}
            onClose={() => {
                dispatch({
                    type: "SET_VISIBLE",
                    payload: false,
                });
            }}>
            {cart.map((p) => {
                return <div key={p._id} className='row'>
                    <div className='col'>
                        {p.images[0] ? (
                            <>
                                <img src={p.images[0].url} alt='' style={imageStyle} />
                                <p className='text-center bg-secondary pb-1 pt-1 text-light'>{p.title} x {p.count}</p>
                            </>
                        ) : (
                            <>
                                <img src={laptop} alt='' style={imageStyle} />
                                <p>{p.title}</p>
                            </>
                        )}
                    </div>
                </div>
            })}
            <Link to="/cart" style={{textDecoration:"none"}}>
                <button className="text-center btn btn-primary btn-raised btn-block" onClick={() => {
                    dispatch({
                        type: "SET_VISIBLE",
                        payload: false,
                    })
                }}>Go to cart</button>
            </Link>
        </Drawer>
    )
}

export default SideDrawer
