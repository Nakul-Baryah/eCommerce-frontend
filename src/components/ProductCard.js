import React, { useState } from 'react';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  
  // Extract colors from images object keys
  const colors = product.images ? Object.keys(product.images) : [];
  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [isFavorite, setIsFavorite] = useState(false); // Default to false since API doesn't provide this
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await productAPI.removeFromFavorites(product.productId);
        setIsFavorite(false);
      } else {
        await productAPI.addToFavorites(product.productId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    if (!selectedColor) {
      alert('Please select a color');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    setCartLoading(true);
    try {
      await productAPI.addToCart(product.productId, selectedSize, selectedColor, 1);
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  const getCurrentImage = () => {
    if (product.images && selectedColor) {
      return product.images[selectedColor];
    }
    // Fallback to first image if available
    return product.images ? Object.values(product.images)[0] : '';
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={getCurrentImage()} 
          alt={product.productName}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
          }}
        />
        <button 
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={handleFavoriteToggle}
          disabled={loading}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.productName}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-price">
          <span className="price">${product.price}</span>
        </div>

        {/* Color Selection */}
        {colors.length > 0 && (
          <div className="product-options">
            <label className="option-label">Color:</label>
            <div className="color-options">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                  onClick={() => handleColorChange(color)}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                >
                  {selectedColor === color && <span className="check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="product-options">
            <label className="option-label">Size:</label>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={cartLoading || !selectedColor || (product.sizes && product.sizes.length > 0 && !selectedSize)}
        >
          {cartLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
