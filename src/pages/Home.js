import React, { useState, useEffect } from 'react';
import { homeAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🏠 Home component mounted');
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      console.log('🏠 Starting to fetch home data...');
      setLoading(true);
      const data = await homeAPI.getHomeData();
      
      // Handle the array response format from the backend
      let productsData = [];
      if (Array.isArray(data)) {
        productsData = data;
        console.log('🏠 Data is an array, using directly');
      } else if (data.products && Array.isArray(data.products)) {
        productsData = data.products;
        console.log('🏠 Data has products property, using data.products');
      } else if (data.data && Array.isArray(data.data)) {
        productsData = data.data;
        console.log('🏠 Data has data property, using data.data');
      } else {
        console.warn('🏠 Unexpected data format:', data);
      }
      
      console.log('🏠 Setting products:', {
        count: productsData.length,
        products: productsData.map(p => ({ id: p.productId, name: p.productName }))
      });
      
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('❌ Error in fetchHomeData:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      console.log('🏠 Finished loading, setting loading to false');
      setLoading(false);
    }
  };

  if (loading) {
    console.log('🏠 Rendering loading state');
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    console.log('🏠 Rendering error state:', error);
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchHomeData} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  console.log('🏠 Rendering home page with products:', products.length);
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to MN-SHOP</h1>
          <p>Discover amazing products at unbeatable prices</p>
        </div>
      </div>

      <div className="products-section">
        <div className="container">
          <h2>Featured Products</h2>
          {products.length === 0 ? (
            <div className="no-products">
              <p>No products available at the moment.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                console.log('🏠 Rendering product:', {
                  id: product.productId,
                  name: product.productName,
                  colors: product.images ? Object.keys(product.images) : [],
                  sizes: product.sizes || []
                });
                return (
                  <ProductCard key={product.productId} product={product} />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 