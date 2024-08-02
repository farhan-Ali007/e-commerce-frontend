import React, { useEffect, useState } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { createCoupon, getCoupons, removeCoupon } from '../../../functions/coupon'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { DeleteOutlined } from '@ant-design/icons'


const CreateCouponPage = () => {


  const { user } = useSelector((state) => ({ ...state }))

  const [name, setName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [discount, setDiscount] = useState("")
  const [coupons, setCoupons] = useState("")
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    loadAllCoupons()

  }, []);

  const loadAllCoupons = () => {
    getCoupons(user.token)
      .then((res) => {
        console.log('Coupon response===>', res.data);
        setCoupons(res.data);
      })
      .catch((error) => {
        console.log('Fetch coupons error--->', error);
        toast.error('Failed to load coupons');
      })
  }


  const handlesubmit = (e) => {
    e.preventDefault()
    // console.table(name, expiry, discount)


    setLoading(true)
    createCoupon({ name, expiry, discount })
      .then((res) => {
        setLoading(false)
        setName('')
        setExpiry('')
        setDiscount('')
        toast.success(`${res.data.name} created successfully!`)
        loadAllCoupons()
      })
      .catch((error) => {
        setLoading(false);
        console.log("Create coupon error--->", error)
        toast.error(error.response.data && error.response.data.message)
      })

  }

  const handleRemove = (couponId) => {
    if (window.confirm('Are you sure you want to delete it?')) {
      setLoading(true);
      removeCoupon(couponId, user.token)
        .then((res) => {
          toast.error(`Coupon deleted successfully!`);
          loadAllCoupons();
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error('Delete coupon error:', error);
          toast.error('Failed to delete coupon');
        });
    }
  };


  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-10'>
          {loading ? <h4 className='text-danger'>Loading...</h4> : <h4>Coupon</h4>}
          <form onSubmit={handlesubmit}>

            <div className='form-group'>
              <label className='text-muted'>Name</label>
              <input type="text"
                className='form-control'
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required />
            </div>
            <div className='form-group'>
              <label className='text-muted'>Discount %</label>
              <input type="text"
                className='form-control'
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                autoFocus
                required />
            </div>
            <div className='form-group'>
              <label className='text-muted'>Expiry</label>
              <br />
              <Datepicker
                className='form-control'
                selected={expiry}
                onChange={(date) => setExpiry(date)}
                dateFormat="dd/MM/yyyy"
                required
              />
            </div>

            <button className='btn btn-outline-primary'>Save</button>

          </form>
          <br />
          <h4>{coupons.length} Coupons</h4>
          <table className='table table-bordered'>
            <thead className='thead-light'>
              <tr>
                <th scope='col'>Name</th>
                <th scope='col'>Expiry</th>
                <th scope='col'>Discount</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons && coupons.map((c) => {
                return <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>{c.discount}%</td>
                  <td className='text-center'><DeleteOutlined
                    style={{ cursor: "pointer" }}
                    className='text-danger'
                    onClick={() => handleRemove(c._id)} /></td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default CreateCouponPage
