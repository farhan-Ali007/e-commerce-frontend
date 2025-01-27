import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
    PDFDownloadLink
} from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ShowPaymentInfo from '../../components/cards/ShowPaymentInfo';
import UserNav from '../../components/nav/UserNav';
import Invoice from '../../components/order/Invoice';
import { getUserOrders } from '../../functions/user';


const History = () => {

    const { user } = useSelector((state) => ({ ...state }))

    const [orders, setOrders] = useState([])


    const loadUserOrders = () => {
        getUserOrders(user.token)
            .then((res) => {
                // console.log("All Orders=====>", JSON.stringify(res.data, null, 4))
                setOrders(res.data)
            })
    }

    useEffect(() => {
        loadUserOrders()
    }, [])

    const showOrderInTable = (order) => (
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Count</th>
                    <th scope="col">Shipping</th>
                </tr>
            </thead>

            <tbody>
                {order.products.map((p, i) => (
                    <tr key={i}>
                        <td>
                            <b>{p.product.title}</b>
                        </td>
                        <td>{p.product.price}</td>
                        <td>{p.product.brand}</td>
                        <td>{p.color}</td>
                        <td>{p.count}</td>
                        <td>
                            {p.product.shipping === "Yes" ? (
                                <CheckCircleOutlined style={{ color: "green" }} />
                            ) : (
                                <CloseCircleOutlined style={{ color: "red" }} />
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const showDownloadLink = (order) => {
        return <PDFDownloadLink document={<Invoice order={order} />}
            fileName='invoice.pdf'
            className='btn btn-sm btn-outline-primary'>
            Download PDF
        </PDFDownloadLink>
    }

    const showEachOrder = () => {
        return orders.reverse().map((order, i) => {
            return <div key={i} className='m-5 p-3 card'>
                <ShowPaymentInfo order={order} />
                {showOrderInTable(order)}
                <div className='row'>
                    <div className='col'>
                        {/* <p>PDF download </p> */}
                        {showDownloadLink(order)}
                    </div>
                </div>
            </div>
        })
    }

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className="col-md-2"><UserNav /></div>
                <div className='col text-center'>
                    <h4>{orders.length > 0 ? "User purchase orders" : "No order yet"}</h4>
                    {showEachOrder()}
                </div>
            </div>
        </div>
    )
}

export default History;
