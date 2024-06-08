import React, { useEffect, useState } from 'react'
import { getProduct } from '../functions/product'

const Product = ({ match }) => {

  const [product, setProduct] = useState()

  const { slug } = match.params

  const loadSingleProduct = () => getProduct(slug).then(res => setProduct(res.data)).catch()

  useEffect(() => {
    loadSingleProduct()
  }, [slug])

  return (
    <div>
      {JSON.stringify(product)}
    </div>
  )
}

export default Product
