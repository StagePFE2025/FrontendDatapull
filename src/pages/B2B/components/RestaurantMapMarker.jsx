import React, { useEffect, useRef, useCallback, useMemo } from "react";
import L from "leaflet";
import "./style2.css";

const RestaurantMapMarker = ({
  restaurant,
  isFavorite,
  isHovered,
  onHover,
  onLeave,
  onShowDetails,
  onFavoriteToggle,
  isDarkMode,
  map,
}) => {
  const markerRef = useRef(null);
  const popupRef = useRef(null);
  
  // Memoize coordinates validation to avoid recalculations
  const hasValidCoordinates = useMemo(() => {
    return (
      typeof restaurant.latitude === "number" &&
      typeof restaurant.longitude === "number" &&
      !isNaN(restaurant.latitude) &&
      !isNaN(restaurant.longitude)
    );
  }, [restaurant.latitude, restaurant.longitude]);

  // Create marker icon using memoization
  const createMarkerIcon = useCallback(() => {
    // Créez une classe différente basée sur l'état du marker
    const markerClass = `map-marker ${isFavorite ? "favorite" : ""} ${
      isHovered ? "hovered" : ""
    } ${isDarkMode ? "dark" : ""}`;
    
    return L.divIcon({
      className: markerClass,
      html: `<span class="marker-label">${restaurant.name[0]}</span>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, [isFavorite, isHovered, isDarkMode, restaurant.name]);

  // Create popup content using memoization
  const createPopupContent = useCallback(() => {
    const popupContent = document.createElement("div");
    const url=   "https://fakeimg.pl/600x400?text=Image"
    popupContent.className = `custom-popup ${isDarkMode ? "dark" : ""}`;
    popupContent.innerHTML = `
      <div class="restaurant-card">
        <img 
  class="restaurant-image" 
  src="${restaurant.featuredImage}" 
  onerror="this.onerror=null; this.src='https://fakeimg.pl/600x400?text=Image';"
  alt="${restaurant.lo || 'Image'}"
/>


        <div class="restaurant-info">
          <h4 class="restaurant-name">${restaurant.name}</h4>

          <div class="restaurant-rating">
            ⭐ ${restaurant.rating || "N/A"} <span class="reviews">(${
      restaurant.reviews || "0"
    } Reviews)</span>
          </div>

          <div class="restaurant-address">
            📍 ${restaurant.address || "Adresse non disponible"}
          </div>

          <div class="restaurant-status">
            <span class="status-open">${
              restaurant.isOpen ? "Open" : "Closed"
            }</span> • 
            <span class="closing-time">Close ${
              restaurant.closingTime || "10 PM"
            }</span>
          </div>

        </div>
      </div>
    `;

    return popupContent;
  }, [
    restaurant.name,
    restaurant.featuredImage,
    restaurant.rating,
    restaurant.reviews,
    restaurant.address,
    restaurant.isOpen,
    restaurant.closingTime,
    isDarkMode,
  ]);

  // Create and manage marker lifecycle
  useEffect(() => {
    if (!map || !hasValidCoordinates) {
      if (!hasValidCoordinates) {
        console.warn(
          `Invalid coordinates for restaurant ${restaurant.name}: latitude=${restaurant.latitude}, longitude=${restaurant.longitude}`
        );
      }
      return;
    }

    try {
      // Create the popup with custom options
      popupRef.current = L.popup({
        closeButton: false,
        className: `restaurant-popup ${isDarkMode ? "dark" : ""}`,
        offset: [0, -12],
        autoPan: false,
      }).setContent(createPopupContent());

      // Create and add marker to map
      markerRef.current = L.marker(
        [restaurant.latitude, restaurant.longitude],
        { icon: createMarkerIcon() }
      ).addTo(map);

      // Add event listeners
      const marker = markerRef.current;
      
      const handleClick = () => {
        if (onShowDetails) onShowDetails(restaurant);
      };
      
      const handleMouseOver = () => {
        if (marker) {
          marker.bindPopup(popupRef.current).openPopup();
        }
        if (onHover) onHover(restaurant);
      };
      
      const handleMouseOut = () => {
        if (marker) {
          marker.closePopup();
        }
        //if (onLeave) onLeave();
      };

      // Attacher les gestionnaires d'événements
      marker.on("click", handleClick);
      marker.on("mouseover", handleMouseOver);
      marker.on("mouseout", handleMouseOut);

      // Ajouter un gestionnaire d'événements pour le bouton de détail dans le popup
      const popup = popupRef.current;
      if (popup && popup._contentNode) {
        const detailsButton = popup._contentNode.querySelector(".details-button");
        if (detailsButton) {
          detailsButton.addEventListener("click", handleClick);
        }
      }

      // Clean up on component unmount
      return () => {
        if (marker) {
          marker.closePopup();
          marker.off("click", handleClick);
          marker.off("mouseover", handleMouseOver);
          marker.off("mouseout", handleMouseOut);
          map.removeLayer(marker);
        }
      };
    } catch (error) {
      console.error("Error creating marker:", error);
    }
  }, [
    map,
    restaurant,
    hasValidCoordinates,
    isDarkMode,
    createMarkerIcon,
    createPopupContent,
    onHover,
    onLeave,
    onShowDetails,
  ]);

  // Update marker icon when states change
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setIcon(createMarkerIcon());
    }
  }, [createMarkerIcon, isHovered, isFavorite]);
  // Dans RestaurantMapMarker
useEffect(() => {
  if (markerRef.current && popupRef.current) {
    if (isHovered) {
      markerRef.current.bindPopup(popupRef.current).openPopup();
    } else {
      markerRef.current.closePopup();
    }
  }
}, [isHovered]);
  

  // No JSX needed as rendering is handled by Leaflet
  return null;
};

export default React.memo(RestaurantMapMarker);