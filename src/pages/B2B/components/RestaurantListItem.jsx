import React from "react";
import { Star, Heart, Clock, Sparkles } from "./Icons";
import Badge from "./Badge";

const RestaurantListItem = ({
  restaurant,
  isHovered,
  isFavorite,
  onHover,
  onLeave,
  onShowDetails,
  onFavoriteToggle,
  isDarkMode,
}) => {
  // Gestionnaires d'événements explicites pour éviter les erreurs
  const handleMouseEnter = () => {
    if (onHover && restaurant) {
      onHover(restaurant);
    }
  };

  const handleMouseLeave = () => {
    if (onLeave) {
      onLeave();
    }
  };

  const handleClick = () => {
    if (onShowDetails && restaurant) onShowDetails(restaurant);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavoriteToggle) onFavoriteToggle();
  };

  if (!restaurant) {
    return null;
  }

  return (
    <div
      className={`restaurant-list-item dark:bg-gray-900 dark:text-white text-gray-800 ${
        isHovered ? 'hovered' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Le reste du contenu reste identique */}
      <div className="restaurant-list-item-content dark:bg-gray-900 dark:text-white text-gray-800">
        <div className="restaurant-info dark:bg-gray-900 dark:text-white text-gray-800">
          <div className="restaurant-name-row">
            <h3 className="restaurant-name dark:bg-gray-900 dark:text-white text-gray-800">
              {restaurant.name}
            </h3>
            <button
              className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
              onClick={handleFavoriteClick}
            >
              <Heart size={14} fill={isFavorite} className={isFavorite ? "text-red-500" : ""} />
            </button>
          </div>

          <div className="rating-row">
            <span className="rating-value">{restaurant.rating || "N/A"}</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  fill={star <= Math.floor(restaurant.rating || 0)}
                  className="text-amber-400"
                />
              ))}
            </div>
            <span className="review-count">({restaurant.reviews || 0})</span>
          </div>

          <div className="tags">
            {restaurant.priceRange && (
              <Badge variant="outline" className="price-tag">
                {restaurant.priceRange}
              </Badge>
            )}

            {restaurant.isNew && (
              <Badge className="new-tag">
                <Sparkles size={8} className="sparkle-icon" />
                New
              </Badge>
            )}
          </div>

          <div className="main-info">
            {restaurant.address && <div>{restaurant.address}</div>}
            {restaurant.phone && <div>{restaurant.phone}</div>}
          </div>
        </div>

        <div className="thumbnail-container">
          <img
            src={restaurant.featuredImage || "https://fakeimg.pl/600x400?text=Image"}
            alt={restaurant.name}
            onError={(e) => {
              e.target.src = "https://fakeimg.pl/600x400?text=Image";
            }}
            className={`thumbnail ${isHovered ? "zoomed" : ""}`}
          />
          {isFavorite && (
            <div className="favorite-indicator">
              <Heart size={10} fill={true} className="text-red-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(RestaurantListItem);