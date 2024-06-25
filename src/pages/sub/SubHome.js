import React, { useEffect, useState } from 'react'
import { getsub } from '../../functions/sub'
import ProductCard from '../../components/cards/ProductCard'


const SubHome = ({ match }) => {

  const { slug } = match.params
  const [sub, setSub ] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getsub(slug)
      .then((res) => {
        console.log(JSON.stringify(res.data, null, 4))
        setProducts(res.data.product)
        setSub(res.data.sub)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div className='container'>
      <div className='row'>
        <div className='col'>
          {
            loading ? (<h4 className='text-danger text-center p-3 mb-5 mt-5 display-4 jumbotron'>
              Loading...
            </h4>
            ) : (
              <h4 className='text-danger text-center p-3 mb-5 mt-5 display-4 jumbotron'>
                {products?.length} Products in {sub.name} Sub category
              </h4>)
          }
        </div>
      </div>
      <div className='row'>
        {
          products.map((s) => (<div key={s._id} className='col'>
            <ProductCard product={s}/>
          </div>))
        }
      </div>
    </div>
  )
}

export default SubHome
