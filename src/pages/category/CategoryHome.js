import React, { useEffect, useState } from 'react'
import { getCategory } from '../../functions/category'
import ProductCard from '../../components/cards/ProductCard'


const CategoryHome = ({ match }) => {

  const { slug } = match.params
  const [category, setCategory] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getCategory(slug)
      .then((res) => {
        console.log(JSON.stringify(res.data, null, 4))
        setProducts(res.data.product)
        setCategory(res.data.category)
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
                {products?.length} Products in {category.name} category
              </h4>)
          }
        </div>
      </div>
      <div className='row'>
        {
          products.map((p) => (<div key={p._id} className='col'>
            <ProductCard product={p}/>
          </div>))
        }
      </div>
    </div>
  )
}

export default CategoryHome
