/**
 *
 * ProductPage
 *
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Table from '../../components/Table';
// Utils
import request from '../../utils/request';

import './styles.scss';

const ProductPage = () => {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const requestURL = `${process.env.REACT_APP_STRAPI_HOST}/api/products?populate=*`;
    const products = await request(requestURL, { method: 'GET' });
    if ('data' in products) setProducts(products.data);
  }

  useEffect(() => {
    getProducts();
  }, []);

  const onClick = (id) => {
    navigate(`/products/${id}`);
  }

  return (
    <div className="productPageWrapper">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h1>Products</h1>
          </div>
          <div className="col-md-4 offset-md-4 productPageLink">
            <Link to="/products/create">Create a product</Link>
          </div>
        </div>
        <div className="row">
          <Table
            data={products}
            headers={['id', 'name', 'pictures', '']}
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
