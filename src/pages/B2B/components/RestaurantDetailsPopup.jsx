import React, { useEffect } from "react";
import { Star, Heart, MapPin, Clock, X, Sparkles } from "./Icons";
import Badge from "./Badge";
import Button from "./Button";

const RestaurantDetailsPopup = ({ restaurant, onClose, isFavorite, onFavoriteToggle, isDarkMode }) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains("popup-overlay")) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="popup-overlay">
      <div className={`restaurant-popup ${isDarkMode ? "dark" : ""}`}>
        <div className="popup-header">
          <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} className="popup-image" />
          <div className="popup-image-overlay"></div>

          <button className="popup-close-button" onClick={onClose}>
            <X size={18} />
          </button>

          <button className="popup-favorite-button" onClick={onFavoriteToggle}>
            <Heart
              size={18}
              fill={isFavorite}
              className={isFavorite ? "text-red-500" : ""}
            />
          </button>

          <div className="popup-header-info">
            <h2 className="popup-title">{restaurant.name}</h2>
            <div className="popup-rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    fill={star <= Math.floor(restaurant.rating)}
                    className="text-amber-400"
                  />
                ))}
              </div>
              <span className="rating-text">
                {restaurant.rating} ({restaurant.reviews.toLocaleString()})
              </span>
            </div>
          </div>

          {restaurant.isNew && (
            <div className="popup-new-badge">
              <Badge className="gradient-badge">
                <Sparkles size={12} className="sparkle-icon" />
                New
              </Badge>
            </div>
          )}
        </div>

        <div className="popup-content">
          <div className="popup-tags">
            <Badge variant={isDarkMode ? "outline" : "secondary"} className="rounded-badge">
              {restaurant.cuisine}
            </Badge>
            <Badge variant={isDarkMode ? "outline" : "secondary"} className="rounded-badge">
              {restaurant.priceRange}
            </Badge>
            <Badge variant={isDarkMode ? "outline" : "secondary"} className="rounded-badge">
              {restaurant.deliveryTime}
            </Badge>
          </div>

          <div className="popup-stats">
            <div className={`stat-box ${isDarkMode ? "dark" : ""}`}>
              <p className="stat-label">Distance</p>
              <p className="stat-value">{restaurant.distance}</p>
            </div>
            <div className={`stat-box ${isDarkMode ? "dark" : ""}`}>
              <p className="stat-label">Delivery</p>
              <p className="stat-value">{restaurant.deliveryFee}</p>
            </div>
            <div className={`stat-box ${isDarkMode ? "dark" : ""}`}>
              <p className="stat-label">Rating</p>
              <p className="stat-value">{restaurant.rating}</p>
            </div>
          </div>

          <div className="popup-popular">
            <h3 className="section-title">Popular Items</h3>
            <div className="popular-items">
              {restaurant.popular.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`popular-badge ${isDarkMode ? "dark" : ""}`}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div className="popup-address">
            <MapPin size={14} className="address-icon" />
            <p>{restaurant.address}</p>
          </div>

          <div className="popup-hours">
            <Clock size={14} className="hours-icon" />
            <p>{restaurant.hours}</p>
          </div>

          {restaurant.promoCode && (
            <div className={`popup-promo ${isDarkMode ? "dark" : ""}`}>
              <div>
                <p className="promo-label">Promo Code</p>
                <p className={`promo-code ${isDarkMode ? "dark" : ""}`}>
                  {restaurant.promoCode}
                </p>
              </div>
              <Button
                size="sm"
                variant={isDarkMode ? "outline" : "secondary"}
                className={isDarkMode ? "dark-button" : ""}
              >
                Copy
              </Button>
            </div>
          )}

          <div className="popup-menu">
            <h3 className="section-title">Menu Preview</h3>
            <div className={`menu-preview ${isDarkMode ? "dark" : ""}`}>
              <div className="menu-items">
                {restaurant.popular.map((item, index) => (
                  <div key={index} className="menu-item">
                    <div>
                      <p className="item-name">{item}</p>
                      <p className="item-description">Popular choice</p>
                    </div>
                    <p className="item-price">${(Math.random() * 10 + 5).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Button variant="link" size="sm" className="view-menu-button">
                View Full Menu
              </Button>
            </div>
          </div>

          <div className="popup-actions">
            <Button
              className={`close-button ${isDarkMode ? "dark" : ""}`}
              onClick={onClose}
            >
              Close
            </Button>
            <Button className="order-button">Order Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsPopup;