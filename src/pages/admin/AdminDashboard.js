import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/nav/AdminNav'
import { getOrders, changeStatus } from '../../functions/admin'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Orders from '../../components/order/Orders'

const AdminDashboard = () => {

  const { user } = useSelector((state) => ({ ...state }))

  const [orders, setOrders] = useState([])


  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      getOrders(user.token).then((res) => {
        // console.log(JSON.stringify(res.data, null, 4));
        setOrders(res.data);
      })
    } catch (error) {
      console.log("Error in fetching oders---->", error)
    }
  }

  const handleStatusChange = (orderId, orderStatus) => {

    changeStatus(orderId, orderStatus, user.token)
      .then((res) => {
        setOrders(res.data)
        toast.success("Status Updated Successfully!")
        loadOrders()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className='col-md-10'>
          <h4 className='text-center p-4'>Admin Dashboard</h4>
          {/* {JSON.stringify(orders)} */}
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;
