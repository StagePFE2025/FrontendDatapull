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
    if (onHover && restaurant) onHover(restaurant);
  };

  const handleMouseLeave = () => {
    if (onLeave) onLeave();
  };

  const handleClick = () => {
    if (onShowDetails && restaurant) onShowDetails(restaurant);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Empêcher le clic de se propager à l'élément parent
    if (onFavoriteToggle) onFavoriteToggle();
  };

  // Vérifier que l'objet restaurant existe pour éviter les erreurs
  if (!restaurant) {
    return null;
  }

  return (
    <div
      className={`restaurant-list-item ${isHovered ? "hovered" : ""} ${isDarkMode ? "dark" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="restaurant-list-item-content">
        <div className="restaurant-info">
          <div className="restaurant-name-row">
            <h3 className="restaurant-name">{restaurant.name}</h3>
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

          {/* Informations principales */}
          <div className="main-info">
            {restaurant.address && <div>{restaurant.address}</div>}
            {restaurant.phone && <div>{restaurant.phone}</div>}
            {/*restaurant.status && (
              <div className="status-info">
                <Clock size={12} />
                <span>{restaurant.status}</span>
              </div>
            )*/}
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