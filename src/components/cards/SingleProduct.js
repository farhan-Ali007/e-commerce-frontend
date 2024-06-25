import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from 'react-router-dom';
import StarRating from 'react-star-ratings';
import Laptop from '../../images/laptop.png';
import RatingModal from '../modal/RatingModal';
import ProductListItem from './ProductListItem';
import { showAverage } from '../../functions/rating'

const { TabPane } = Tabs;

const SingleProduct = ({ product, onStarClick, star }) => {



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
              {images.map((i) => (
                <img alt="" src={i.url} key={i.public_id} />
              ))}
            </Carousel>
            :
            <Card>
              <img alt='' src={Laptop} className='mb-3 card-image' />
            </Card>
        }

        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call us on 03xx xxxxx00 to learn more about this product.
          </TabPane>
        </Tabs>
      </div>

      <div className='col-md-5'>
        <h1 className='bg-info p-3 mb-3'>{title}</h1>


        {product && product.ratings && product.ratings.length > 0
          ? showAverage(product)
          : <div className='text-center pt-1 pb-3'>No rating yet</div>}


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
              Add to Wishlist
            </Link>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItem product={product} />
        </Card>

      </div>
    </>
  );
};

export default SingleProduct;
