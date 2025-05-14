import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, X, Plus, Minus } from "./components/Icons";
import Button from "./components/Button";
import RestaurantListItem from "./components/RestaurantListItem";
import RestaurantMapMarker from "./components/RestaurantMapMarker";
import Badge from "./components/Badge";
import { searchRestaurants } from "./api"; // Importer le service API
import RestaurantDetailsPopup from "./components/RestaurantDetailsPopup";
import "./style.css";

const FoodDeliveryPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("Casablanca"); // Remplacer la location par city
  const [category, setCategory] = useState(""); // Nouvelle état pour la catégorie
  const [hoveredRestaurant, setHoveredRestaurant] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([1, 3]);
  const [restaurants, setRestaurants] = useState([]); // État pour stocker les restaurants
  const [totalResults, setTotalResults] = useState(0); // Nombre total de résultats
  const [currentPage, setCurrentPage] = useState(0); // Page actuelle
  const [pageSize, setPageSize] = useState(5); // Taille de la page
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Fonction pour effectuer une recherche
  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      
      // Préparation des filtres à envoyer au backend
      const filters = {
        name: searchQuery,
        city: city,
        query: category, // La catégorie correspond au champ 'query' dans le backend
      };
      
      // Appel de l'API avec pagination
      const result = await searchRestaurants(filters, currentPage, pageSize);
      
      // Mise à jour des états
      setRestaurants(result.page.content);
      setTotalResults(result.totalResults);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des restaurants:", error);
      setIsLoading(false);
    }
  };

  // Effectuer une recherche lors du chargement initial et lorsque les filtres changent
  useEffect(() => {
    fetchRestaurants();
  }, [currentPage, pageSize]); // Relancer la recherche quand la page change

  // Fonction pour effectuer une recherche manuelle (bouton ou touche Entrée)
  const handleSearch = () => {
    setCurrentPage(0); // Réinitialiser à la première page lors d'une nouvelle recherche
    fetchRestaurants();
  };

  // Gestionnaire pour la touche Entrée dans le champ de recherche
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Gestionnaire pour le changement de page
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Gestionnaire pour le changement de taille de page
  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(0); // Réinitialiser à la première page
  };

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(totalResults / pageSize);

  useEffect(() => {
    if (restaurants.length > 0 && mapInstanceRef.current) {
      // Mettre à jour les marqueurs sur la carte
      // Nettoyer les marqueurs existants
      Object.values(markersRef.current).forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = {};

      // Ajouter les nouveaux marqueurs
      restaurants.forEach((restaurant) => {
        const marker = L.marker([restaurant.lat, restaurant.lon], {
          icon: L.divIcon({
            className: `map-marker ${favorites.includes(restaurant.id) ? "favorite" : ""} ${isDarkMode ? "dark" : ""} ${restaurant.isNew ? "new" : ""}`,
            html: `<span className="marker-label">${restaurant.name[0]}</span>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
        }).addTo(mapInstanceRef.current);

        markersRef.current[restaurant.id] = marker;

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
          setShowDetailsPopup(true);
        });
      });

      // Ajuster la vue de la carte pour montrer tous les marqueurs
      if (restaurants.length > 0) {
        const bounds = L.latLngBounds(restaurants.map(r => [r.lat, r.lon]));
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [restaurants, isDarkMode, favorites, hoveredRestaurant]);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [33.5731, -7.5898], // Casablanca par défaut
        zoom: mapZoom,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    mapInstanceRef.current.setZoom(mapZoom);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapZoom]);

  const handleZoomIn = () => setMapZoom((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setMapZoom((prev) => Math.max(prev - 1, 10));

  const toggleFilter = (filter) => {
    // Si c'est une catégorie de cuisine, mettre à jour l'état category
    if (["American", "Italian", "Japanese", "Mexican"].includes(filter)) {
      if (category === filter) {
        setCategory(""); // Désélectionner
      } else {
        setCategory(filter); // Sélectionner
      }
    }
    
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailsPopup(true);
  };

  return (
    <div className={`map-container ${isDarkMode ? "dark" : ""}`}>
      <div className={`sidebar ${isDarkMode ? "dark" : ""}`}>
        <div className={`search-container ${isDarkMode ? "dark" : ""}`}>
          <div className="search-input-container">
            <Search size={12} className={`search-icon ${isDarkMode ? "dark" : ""}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Rechercher par nom de restaurant"
              className={`search-input ${isDarkMode ? "dark" : ""}`}
            />
            <Button 
              className="search-button" 
              onClick={handleSearch}
              size="sm"
            >
              Rechercher
            </Button>
          </div>
        </div>

        <div className={`location-container ${isDarkMode ? "dark" : ""}`}>
          <div className={`location-input ${isDarkMode ? "dark" : ""}`}>
            <div className="location-info">
              <MapPin size={16} className={`location-icon ${isDarkMode ? "dark" : ""}`} />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ville"
                className={`location-text-input ${isDarkMode ? "dark" : ""}`}
              />
            </div>
            <button
              onClick={() => setCity("")}
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
            <span>Filtres</span>
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
                      variant={category === cuisine ? "default" : "outline"}
                      className={`filter-badge ${
                        category === cuisine ? "active" : ""
                      } ${isDarkMode ? "dark" : ""}`}
                      onClick={() => {
                        setCategory(category === cuisine ? "" : cuisine);
                        handleSearch(); // Lancer la recherche après changement
                      }}
                    >
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <p className="filter-label">Prix</p>
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
            {isLoading ? "Loading..." : `${totalResults} Restaurants trouvés`}
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
            : restaurants.map((restaurant) => (
                <RestaurantListItem
                  key={restaurant.id}
                  restaurant={restaurant}
                  isHovered={hoveredRestaurant?.id === restaurant.id}
                  isFavorite={favorites.includes(restaurant.id)}
                  onHover={() => setHoveredRestaurant(restaurant)}
                  onLeave={() => setHoveredRestaurant(null)}
                  onClick={() => handleRestaurantClick(restaurant)}
                  onFavoriteToggle={() => toggleFavorite(restaurant.id)}
                  isDarkMode={isDarkMode}
                />
              ))}
        </div>

        {/* Pagination */}
        <div className={`pagination-container ${isDarkMode ? "dark" : ""}`}>
          <div className="pagination-controls">
            <Button 
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              size="sm"
              variant={isDarkMode ? "outline" : "secondary"}
            >
              Précédent
            </Button>
            
            <div className="pagination-info">
              Page {currentPage + 1} sur {totalPages || 1}
            </div>
            
            <Button 
              onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              size="sm"
              variant={isDarkMode ? "outline" : "secondary"}
            >
              Suivant
            </Button>
          </div>
          
          <div className="page-size-selector">
            <span>Résultats par page:</span>
            <select 
              value={pageSize} 
              onChange={handlePageSizeChange}
              className={isDarkMode ? "dark" : ""}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>

      <div className="map-view">
        <div className="map-content">
          <div
            ref={mapRef}
            className={`map-image-container ${isDarkMode ? "dark" : ""}`}
            style={{ height: "100%", width: "100%" }}
          >
            {/* Les marqueurs sont gérés dans useEffect */}
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

      {showDetailsPopup && selectedRestaurant && (
        <RestaurantDetailsPopup
          restaurant={selectedRestaurant}
          onClose={() => setShowDetailsPopup(false)}
          isFavorite={favorites.includes(selectedRestaurant.id)}
          onFavoriteToggle={() => toggleFavorite(selectedRestaurant.id)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default FoodDeliveryPage;