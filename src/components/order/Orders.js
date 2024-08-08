import React from 'react'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import ShowPaymentInfo from '../cards/ShowPaymentInfo'

const Orders = ({ orders, handleStatusChange }) => {
  if (!orders || !Array.isArray(orders)) {
    return <p>No orders available</p>;
  }

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
  return (
    <div>
      {orders && orders.map((order) => {
        return <div key={order._id} className='row pb-5 mr-2'>
          <div
            className='btn bg-light'
            style={{
              width: "100%",
              padding: "10px",
              maxWidth: "100%", // Ensures it doesn't exceed 100%
              margin: "0 auto", // Centering
              boxSizing: "border-box",
            }}>

            <ShowPaymentInfo order={order} showStatus={false} />
            <div className='row'>
              <div className='col-md-4 pt-2 text-secondary'>Delivery Status</div>
              <div className='co-md-8'>

                <select
                  onChange={e => handleStatusChange(order._id, e.target.value)}
                  className='form-control'
                  defaultValue={order.orderStatus}
                  name='Status'>
                  <option value={"Not Processed"}>Not Processed</option>
                  <option value={"Cash On Delivery"}>Cash On Delivery</option>
                  <option value={"Processing"}>Processing</option>
                  <option value={"Dispatched"}>Dispatched</option>
                  <option value={"Canceled"}>Canceled</option>
                  <option value={"Completed"}>Completed</option>
                </select>
              </div>
            </div>
          </div>
          {showOrderInTable(order)}
        </div>
      })}
    </div>
  )
}

export default Orders;
