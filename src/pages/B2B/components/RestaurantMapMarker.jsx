import React, { useState } from "react";
import { Star, Heart, MapPin, Clock, Sparkles } from "./Icons";
import Badge from "./Badge";
import Button from "./Button";
import RestaurantDetailsPopup from "./RestaurantDetailsPopup";

const RestaurantMapMarker = ({
  restaurant,
  isHovered,
  isFavorite,
  onHover,
  onLeave,
  onClick,
  onFavoriteToggle,
  isDarkMode,
}) => {
  const [showPopup, setShowPopup] = useState(false);

  // Ce composant ne rend plus le marqueur lui-même, mais gère le hover et le popup
  return (
    <>
      {isHovered && !showPopup && (
        <div className={`hover-card ${isDarkMode ? "dark" : ""}`} style={{ position: 'absolute', zIndex: 1000 }}>
          <div className="hover-card-image-container">
            <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} className="hover-card-image" />
            <div className="hover-card-image-overlay"></div>

            <div className="hover-card-badge">
              <Badge className={isDarkMode ? "dark-badge" : "light-badge"}>
                {restaurant.cuisine}
              </Badge>
            </div>

            <div className="hover-card-rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={10}
                    fill={star <= Math.floor(restaurant.rating)}
                    className="text-amber-400"
                  />
                ))}
              </div>
              <span className="rating-value">{restaurant.rating}</span>
            </div>
          </div>

          <div className="hover-card-content">
            <div className="hover-card-header">
              <h3 className="hover-card-title">{restaurant.name}</h3>
              <button
                className="favorite-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle();
                }}
              >
                <Heart
                  size={16}
                  fill={isFavorite}
                  className={isFavorite ? "text-red-500" : ""}
                />
              </button>
            </div>

            <div className="hover-card-address">
              <MapPin size={12} className="address-icon" />
              <p>{restaurant.address}</p>
            </div>

            <div className="hover-card-hours">
              <Clock size={12} className="hours-icon" />
              <p>{restaurant.hours}</p>
            </div>

            <div className="hover-card-details">
              <div className="hover-card-badges">
                <Badge variant={isDarkMode ? "outline" : "secondary"} className="delivery-badge">
                  {restaurant.deliveryTime}
                </Badge>
                <Badge variant={isDarkMode ? "outline" : "secondary"} className="fee-badge">
                  {restaurant.deliveryFee}
                </Badge>
              </div>
              <span className="price-range">{restaurant.priceRange}</span>
            </div>

            <div className="hover-card-actions">
              <Button
                size="sm"
                variant={isDarkMode ? "outline" : "secondary"}
                className="details-button"
                onClick={() => {
                  setShowPopup(true);
                }}
              >
                See Details
              </Button>
              <Button size="sm" className="order-button">
                Order Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <RestaurantDetailsPopup
          restaurant={restaurant}
          onClose={() => setShowPopup(false)}
          isFavorite={isFavorite}
          onFavoriteToggle={onFavoriteToggle}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};

export default RestaurantMapMarker;