import React, { useState, useEffect } from 'react';
import { homeAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const data = await homeAPI.getHomeData();
      
      // Handle the array response format from the backend
      let productsData = [];
      if (Array.isArray(data)) {
        productsData = data;
      } else if (data.products && Array.isArray(data.products)) {
        productsData = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        productsData = data.data;
      }
      
      console.log('Products loaded:', productsData);
      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
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

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to ShopHub</h1>
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
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 