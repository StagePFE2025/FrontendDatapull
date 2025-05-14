import React, { useState, useEffect, useRef } from "react";
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
  map,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const cardRef = useRef(null);
  
  // Calcul optimisé de la position du hover card
  useEffect(() => {
    if (isHovered && !showPopup && map) {
      const markerLatLng = [restaurant.lat, restaurant.lon];
      const point = map.latLngToContainerPoint(markerLatLng);
      
      // Obtenir les dimensions de la carte pour éviter les débordements
      const mapContainer = map.getContainer();
      const mapWidth = mapContainer.offsetWidth;
      const mapHeight = mapContainer.offsetHeight;
      
      // Dimensions estimées de la carte hover (si disponibles via ref)
      const cardWidth = 300; // Valeur par défaut
      const cardHeight = 350; // Valeur par défaut
      
      // Calculer la position optimale (éviter les bords)
      let offsetX = -cardWidth / 2; // Centrer horizontalement par défaut
      let offsetY = 40; // Placer sous le marqueur par défaut
      
      // Ajuster si trop à droite
      if (point.x + offsetX + cardWidth > mapWidth - 20) {
        offsetX = -cardWidth + 20;
      }
      
      // Ajuster si trop à gauche
      if (point.x + offsetX < 20) {
        offsetX = -20;
      }
      
      // Ajuster si trop bas - placer au-dessus du marqueur
      if (point.y + offsetY + cardHeight > mapHeight - 20) {
        offsetY = -cardHeight - 20;
      }
      
      setCardPosition({
        top: point.y + offsetY,
        left: point.x + offsetX,
      });

      // Mettre à jour la position si la carte bouge
      const updatePosition = () => {
        const newPoint = map.latLngToContainerPoint(markerLatLng);
        setCardPosition({
          top: newPoint.y + offsetY,
          left: newPoint.x + offsetX,
        });
      };

      map.on("move", updatePosition);
      map.on("zoom", updatePosition);

      return () => {
        map.off("move", updatePosition);
        map.off("zoom", updatePosition);
      };
    }
  }, [isHovered, showPopup, map, restaurant.lat, restaurant.lon]);

  // Animation améliorée pour l'apparition et la disparition
  const hoverCardClasses = `hover-card ${isDarkMode ? "dark" : ""} ${isHovered ? "visible" : "hidden"}`;

  return (
    <>
      {isHovered && !showPopup && (
        <div
          ref={cardRef}
          className={hoverCardClasses}
          style={{
            position: "absolute",
            zIndex: 1000,
            top: `${cardPosition.top}px`,
            left: `${cardPosition.left}px`,
            transform: isHovered ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? "auto" : "none",
          }}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          <div className="hover-card-image-container">
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="hover-card-image"
            />
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
                <Badge
                  variant={isDarkMode ? "outline" : "secondary"}
                  className="delivery-badge"
                >
                  {restaurant.deliveryTime}
                </Badge>
                <Badge
                  variant={isDarkMode ? "outline" : "secondary"}
                  className="fee-badge"
                >
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
                Voir détails
              </Button>
              <Button size="sm" className="order-button">
                Commander
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