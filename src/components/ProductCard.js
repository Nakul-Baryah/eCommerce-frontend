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
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  console.log('🛍️ ProductCard rendered:', {
    productId: product.productId,
    productName: product.productName,
    colors,
    selectedColor,
    sizes: product.sizes,
    selectedSize,
    hasUser: !!user
  });

  const handleColorChange = (color) => {
    console.log('🎨 Color changed:', { from: selectedColor, to: color, productId: product.productId });
    setSelectedColor(color);
  };

  const handleSizeChange = (size) => {
    console.log('📏 Size changed:', { from: selectedSize, to: size, productId: product.productId });
    setSelectedSize(size);
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      console.log('⚠️ User not logged in, cannot add to favorites');
      alert('Please login to add favorites');
      return;
    }

    console.log('❤️ Toggling favorite:', { productId: product.productId, currentState: isFavorite });
    setLoading(true);
    try {
      if (isFavorite) {
        await productAPI.removeFromFavorites(product.productId);
        setIsFavorite(false);
        console.log('✅ Removed from favorites successfully');
      } else {
        await productAPI.addToFavorites(product.productId);
        setIsFavorite(true);
        console.log('✅ Added to favorites successfully');
      }
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
      alert('Failed to update favorite status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      console.log('⚠️ User not logged in, cannot add to cart');
      alert('Please login to add items to cart');
      return;
    }

    if (!selectedColor) {
      console.log('⚠️ No color selected');
      alert('Please select a color');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      console.log('⚠️ No size selected for product with sizes');
      alert('Please select a size');
      return;
    }

    console.log('🛒 Adding to cart:', {
      productId: product.productId,
      productName: product.productName,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    });

    setCartLoading(true);
    try {
      await productAPI.addToCart(product.productId, selectedSize, selectedColor, 1);
      console.log('✅ Added to cart successfully');
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <div className="product-image-placeholder">
          <div className="placeholder-content">
            <span className="placeholder-icon">📷</span>
            <p className="placeholder-text">Product Image</p>
            <p className="placeholder-subtext">Color: {selectedColor || 'Select a color'}</p>
          </div>
        </div>
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

        {/* Size Selection or One Size Message */}
        <div className="product-options">
          <label className="option-label">Size:</label>
          {product.sizes && product.sizes.length > 0 ? (
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
          ) : (
            <div className="one-size-message">
              <span className="one-size-text">One size available</span>
            </div>
          )}
        </div>

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
