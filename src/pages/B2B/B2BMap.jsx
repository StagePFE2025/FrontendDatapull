import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, X, Plus, Minus } from "./components/Icons";
import Button from "./components/Button";
import RestaurantListItem from "./components/RestaurantListItem";
import RestaurantMapMarker from "./components/RestaurantMapMarker";
import Badge from "./components/Badge";
import { RESTAURANTS } from "./components/restaurants";
import "./style.css";

const FoodDeliveryPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("Pizza");
  const [location, setLocation] = useState("New York, NY");
  const [hoveredRestaurant, setHoveredRestaurant] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([1, 3]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // Simuler le chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Initialiser la carte OpenStreetMap avec Leaflet
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [40.7128, -74.0060], // Centre sur New York, NY
        zoom: mapZoom,
        zoomControl: false, // Désactiver le contrôle de zoom par défaut
      });

      // Ajouter le fond de carte OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Ajouter les marqueurs pour chaque restaurant
      RESTAURANTS.forEach((restaurant) => {
        const marker = L.marker([restaurant.lat, restaurant.lon], {
          icon: L.divIcon({
            className: `map-marker ${favorites.includes(restaurant.id) ? "favorite" : ""} ${isDarkMode ? "dark" : ""} ${restaurant.isNew ? "new" : ""}`,
            html: `<span className="marker-label">${restaurant.name[0]}</span>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
        }).addTo(mapInstanceRef.current);

        markersRef.current[restaurant.id] = marker;

        // Gestion des événements du marqueur
        marker.on("mouseover", () => {
          setHoveredRestaurant(restaurant);
          marker.setIcon(
            L.divIcon({
              className: `map-marker hovered ${favorites.includes(restaurant.id) ? "favorite" : ""} ${isDarkMode ? "dark" : ""} ${restaurant.isNew ? "new" : ""}`,
              html: `<span className="marker-label">${restaurant.name[0]}</span>`,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            })
          );
        });

        marker.on("mouseout", () => {
          if (hoveredRestaurant?.id === restaurant.id) {
            setHoveredRestaurant(null);
          }
          marker.setIcon(
            L.divIcon({
              className: `map-marker ${favorites.includes(restaurant.id) ? "favorite" : ""} ${isDarkMode ? "dark" : ""} ${restaurant.isNew ? "new" : ""}`,
              html: `<span className="marker-label">${restaurant.name[0]}</span>`,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            })
          );
        });

        marker.on("click", () => {
          setSelectedRestaurant(restaurant);
        });
      });
    }

    // Mettre à jour le zoom de la carte
    mapInstanceRef.current.setZoom(mapZoom);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapZoom, isDarkMode, favorites]);

  useEffect(() => {
    // Mettre à jour les marqueurs lors des changements de favoris ou de mode sombre
    RESTAURANTS.forEach((restaurant) => {
      const marker = markersRef.current[restaurant.id];
      if (marker) {
        marker.setIcon(
          L.divIcon({
            className: `map-marker ${hoveredRestaurant?.id === restaurant.id ? "hovered" : ""} ${favorites.includes(restaurant.id) ? "favorite" : ""} ${isDarkMode ? "dark" : ""} ${restaurant.isNew ? "new" : ""}`,
            html: `<span className="marker-label">${restaurant.name[0]}</span>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          })
        );
      }
    });
  }, [hoveredRestaurant, favorites, isDarkMode]);

  const handleZoomIn = () => setMapZoom((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setMapZoom((prev) => Math.max(prev - 1, 10));

  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredRestaurants = RESTAURANTS.filter((restaurant) => {
    return true; // À implémenter selon les besoins
  });

  return (
    


      <div className={`map-container ${isDarkMode ? "dark" : ""}`}>
        <div className={`sidebar ${isDarkMode ? "dark" : ""}`}>
          <div className={`search-container ${isDarkMode ? "dark" : ""}`}>
            <div className="search-input-container">
              <Search
                size={12}
                className={`search-icon ${isDarkMode ? "dark" : ""}`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants"
                className={`search-input ${isDarkMode ? "dark" : ""}`}
              />
            </div>
          </div>

          <div className={`location-container ${isDarkMode ? "dark" : ""}`}>
            <div className={`location-input ${isDarkMode ? "dark" : ""}`}>
              <div className="location-info">
                <MapPin size={16} className={`location-icon ${isDarkMode ? "dark" : ""}`} />
                <span className="location-text">{location}</span>
              </div>
              <button
                onClick={() => setLocation("")}
                className={`clear-button ${isDarkMode ? "dark" : ""}`}
              >
                <X size={16} className={`clear-icon ${isDarkMode ? "dark" : ""}`} />
              </button>
            </div>
          </div>

          <div className={`filters-container ${isDarkMode ? "dark" : ""}`}>
            <button
              className={`filters-toggle ${isDarkMode ? "dark" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <span>Filters</span>
              <span className={`toggle-icon ${showFilters ? "open" : ""}`}>▼</span>
            </button>

            {showFilters && (
              <div className="filters-content">
                <div className="filter-section">
                  <p className="filter-label">Cuisine</p>
                  <div className="filter-options">
                    {["American", "Italian", "Japanese", "Mexican"].map((cuisine) => (
                      <Badge
                        key={cuisine}
                        variant={activeFilters.includes(cuisine) ? "default" : "outline"}
                        className={`filter-badge ${
                          activeFilters.includes(cuisine) ? "active" : ""
                        } ${isDarkMode ? "dark" : ""}`}
                        onClick={() => toggleFilter(cuisine)}
                      >
                        {cuisine}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <p className="filter-label">Price Range</p>
                  <div className="filter-options">
                    {["$", "$$", "$$$", "$$$$"].map((price) => (
                      <Badge
                        key={price}
                        variant={activeFilters.includes(price) ? "default" : "outline"}
                        className={`filter-badge ${
                          activeFilters.includes(price) ? "active" : ""
                        } ${isDarkMode ? "dark" : ""}`}
                        onClick={() => toggleFilter(price)}
                      >
                        {price}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`results-count ${isDarkMode ? "dark" : ""}`}>
            <span className="count-text">
              {isLoading ? "Loading..." : `${filteredRestaurants.length} Restaurants`}
            </span>
          </div>

          <div className="restaurant-list">
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className={`skeleton-item ${isDarkMode ? "dark" : ""}`}>
                      <div className="skeleton-content">
                        <div className="skeleton-info">
                          <div className="skeleton-line-large"></div>
                          <div className="skeleton-line-small"></div>
                          <div className="skeleton-line-medium"></div>
                          <div className="skeleton-line-small"></div>
                        </div>
                        <div className="skeleton-image"></div>
                      </div>
                    </div>
                  ))
              : filteredRestaurants.map((restaurant) => (
                  <RestaurantListItem
                    key={restaurant.id}
                    restaurant={restaurant}
                    isHovered={hoveredRestaurant?.id === restaurant.id}
                    isFavorite={favorites.includes(restaurant.id)}
                    onHover={() => setHoveredRestaurant(restaurant)}
                    onLeave={() => setHoveredRestaurant(null)}
                    onClick={() => setSelectedRestaurant(restaurant)}
                    onFavoriteToggle={() => toggleFavorite(restaurant.id)}
                    isDarkMode={isDarkMode}
                  />
                ))}
          </div>
        </div>

        <div className="map-view">
          <div className="map-content">
            <div
              ref={mapRef}
              className={`map-image-container ${isDarkMode ? "dark" : ""}`}
              style={{ height: "100%", width: "100%" }}
            >
              {/* La carte Leaflet est rendue ici */}
              {Object.keys(markersRef.current).map((id) => {
                const restaurant = RESTAURANTS.find((r) => r.id === parseInt(id));
                return (
                  <RestaurantMapMarker
                    key={id}
                    restaurant={restaurant}
                    isHovered={hoveredRestaurant?.id === restaurant.id}
                    isFavorite={favorites.includes(restaurant.id)}
                    onHover={() => setHoveredRestaurant(restaurant)}
                    onLeave={() => setHoveredRestaurant(null)}
                    onClick={() => setSelectedRestaurant(restaurant)}
                    onFavoriteToggle={() => toggleFavorite(restaurant.id)}
                    isDarkMode={isDarkMode}
                  />
                );
              })}
            </div>

            <div className={`map-controls ${isDarkMode ? "dark" : ""}`}>
              <button
                className={`zoom-button ${isDarkMode ? "dark" : ""}`}
                onClick={handleZoomIn}
              >
                <Plus size={18} />
              </button>
              <button
                className={`zoom-button ${isDarkMode ? "dark" : ""}`}
                onClick={handleZoomOut}
              >
                <Minus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

  );
};

export default FoodDeliveryPage;