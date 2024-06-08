import React, { useEffect, useState } from 'react';
import { getProducts, getProductsCount } from '../../functions/product';
import LoadingCard from '../cards/LoadingCard';
import ProductCard from '../cards/ProductCard';
import { Pagination } from 'antd';

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productsCount, setProductsCount] = useState(0);
    const [page, setPage] = useState(1);

    const loadAllProducts = (currentPage) => {
        setLoading(true);
        getProducts("sold", "desc", currentPage).then((res) => {
            // console.log('API response:', res.data);
            setProducts(res.data);
            setLoading(false);
        }).catch((err) => {
            console.error('Error fetching products:', err);
            setLoading(false);
        });
    };

    useEffect(() => {
        loadAllProducts(page);
    }, [page]);

    useEffect(() => {
        getProductsCount()
            .then((res) => setProductsCount(res.data))
            .catch((err) => console.error('Error fetching products count:', err));
    }, []);

    return (
        <>
            <div className='container'>
                {loading ? (
                    <LoadingCard count={3} />
                ) : (
                    <div className='row'>
                        {products.map((product) => (
                            <div key={product._id} className='col-md-4'>
                                <ProductCard product={product} useDefaultImage={true} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className='row'>
                <nav className='col-md-4 offset-md-4 text-center pt-5 p-3'>
                    <Pagination
                        current={page}
                        total={productsCount}
                        pageSize={3}
                        onChange={(value) => setPage(value)}
                    />
                </nav>
            </div>
        </>
    );
};

export default BestSellers;
