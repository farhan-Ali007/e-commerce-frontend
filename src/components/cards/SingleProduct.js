import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from 'react-router-dom';
import Laptop from '../../images/laptop.png';
import ProductListItem from './ProductListItem';
import StarRatings from 'react-star-ratings'
import RatingModal from '../modal/RatingModal';
const { TabPane } = Tabs


//This is the children component of Product page
const SingleProduct = ({ product, onStarClick,star }) => {

  if (!product) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }


  const { title, images, description, _id } = product;

  return (
    <>
      <div className='col-md-7'>
        {
          images && images.length ?
            <Carousel showArrows={true} autoPlay infiniteLoop>
              {images && images.map((i) => <img alt="" src={i.url} key={i.public_id} />)}
            </Carousel> :
            <Card>
              <img alt=''
                src={Laptop}
                className='mb-3 card-image' />
            </Card>
        }


        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call use on 03xx xxxxx00 to learn more about this product.
          </TabPane>
        </Tabs>
      </div>
      <div className='col-md-5'>
        <h1 className='bg-info p-3 mb-3'>{title} </h1>



        <Card
          actions={[
            <>
              <ShoppingCartOutlined className='text-success' />
              <br />
              Add to Cart
            </>,
            <Link to="/" style={{ textDecoration: "none" }}>
              <HeartOutlined className='text-info' />
              <br />
              Add to whishlist
            </Link>,
            <RatingModal>
              <StarRatings
                name={_id}
                starRatedColor="red"
                numberOfStars={5}
                changeRating={onStarClick}
                rating={star}
                isSelectable={true}
              />
            </RatingModal>
          ]}
        >
          <ProductListItem product={product} />

        </Card>

      </div>
    </>
  )
}

export default SingleProduct
