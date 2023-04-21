import React from 'react';
import { useParams } from 'react-router-dom';

function Product() {
  const { productId } = useParams();

  return (
    <div>
      <h1>Product {productId}</h1>
      <p>Details about product {productId} go here...</p>
    </div>
  );
}

export default Product;