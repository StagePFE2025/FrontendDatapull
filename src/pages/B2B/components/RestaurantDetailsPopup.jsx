import React, { useEffect } from "react";
import { Star, Heart, MapPin, Clock, X } from "./Icons";
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
          <img
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            className="popup-image"
          />
          <div className="popup-image-overlay"></div>

          <button className="popup-close-button" onClick={onClose}>
            <X size={18} />
          </button>

          <button className="popup-favorite-button" onClick={onFavoriteToggle}>
            <Heart size={18} fill={isFavorite} className={isFavorite ? "text-red-500" : ""} />
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
              <span className="price-range">({restaurant.priceRange || "150-200 MAD"})</span>
            </div>
          </div>
        </div>

        <div className="popup-content ">
          <div className="popup-options">
            {restaurant.dineIn && <Badge variant="outline">Repas sur place</Badge>}
            {restaurant.takeaway && <Badge variant="outline">Vente à emporter</Badge>}
            {restaurant.delivery && <Badge variant="outline">Livraison</Badge>}
          </div>

          <div className="popup-actions">
            <Button variant="link" size="sm">
              Itinéraires
            </Button>
            <Button variant="link" size="sm">
              Enregistrer
            </Button>
            <Button variant="link" size="sm">
              Envoyer
            </Button>
            <Button variant="link" size="sm">
              Partager
            </Button>
          </div>

          <div className="popup-menu">
            <Button variant="link" size="sm">
              Menu
            </Button>
            <Button variant="link" size="sm">
              Avis
            </Button>
            <Button variant="link" size="sm">
              À propos
            </Button>
          </div>

          <Button className="close-button" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsPopup;