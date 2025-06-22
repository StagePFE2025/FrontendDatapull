import React, { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  MapPin,
  X,
  Plus,
  Minus,
  Download,
  FileText,
  Star,
  Target,
} from "./components/Icons";
import Button from "./components/Button";
import RestaurantListItem from "./components/RestaurantListItem";
import RestaurantMapMarker from "./components/RestaurantMapMarker";
import RestaurantDetails from "./components/RestaurantDetailsPopup";
import Badge from "./components/Badge";
import { searchRestaurants } from "./api";
import "./style.css";
import "./components/style2.css";
import ComponentCard from "../../components/common/ComponentCard";
import DualRangeSlider from "./components/DualRangeSlider";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const MapSmiffer = () => {
  // États existants
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("Paris");
  const [category, setCategory] = useState("");
  const [hoveredRestaurant, setHoveredRestaurant] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [favorites, setFavorites] = useState([1, 3]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [error, setError] = useState(null);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Nouveaux états pour les filtres de range
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [useRatingFilter, setUseRatingFilter] = useState(true);
  const [useScoreFilter, setUseScoreFilter] = useState(true);

  // Nouveaux états pour l'export CSV
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Refs
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const listContainerRef = useRef(null);
  const observerRef = useRef(null);

  // Fonction d'export CSV
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      setExportProgress(0);
      setExportError(null);
      setExportSuccess(false);
      setShowExportModal(true);

      // Préparer les filtres pour l'export (incluant les nouveaux filtres)
      const exportFilters = {
        name: searchQuery || "",
        city: city || "",
        query: categoryQuery || "",
        ...(useRatingFilter && {
          ratingMin: ratingRange[0].toString(),
          ratingMax: ratingRange[1].toString(),
        }),
        ...(useScoreFilter && {
          scoreMin: scoreRange[0].toString(),
          scoreMax: scoreRange[1].toString(),
        }),
      };

      setExportProgress(10);

      // Appel à l'API d'export
      const response = await fetch(
        "http://51.44.136.165:8080/api/b2b/export-csvB2B",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exportFilters),
        }
      );

      setExportProgress(30);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      setExportProgress(60);

      // Vérifier le type de contenu de la réponse
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("text/csv")) {
        // Réponse CSV directe
        const blob = await response.blob();
        setExportProgress(90);

        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `b2b-export-${new Date()
          .toISOString()
          .slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setExportProgress(100);
        setExportSuccess(true);
      } else {
        // Réponse JSON (peut-être avec un message d'erreur)
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setExportProgress(100);
        setExportSuccess(true);
      }

      // Fermer la modal après 2 secondes de succès
      setTimeout(() => {
        setShowExportModal(false);
        setIsExporting(false);
        setExportProgress(0);
        setExportSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      setExportError(error.message);
      setIsExporting(false);
    }
  };

  // Fonction pour fermer la modal d'export
  const closeExportModal = () => {
    if (!isExporting) {
      setShowExportModal(false);
      setExportProgress(0);
      setExportError(null);
      setExportSuccess(false);
    }
  };

  // Fonction pour récupérer les restaurants (mise à jour avec les nouveaux filtres)
  const fetchRestaurants = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Construire les filtres avec les nouveaux paramètres de range
      const filters = {
        name: searchQuery,
        city,
        query: categoryQuery,
        ...(useRatingFilter && {
          ratingMin: ratingRange[0].toString(),
          ratingMax: ratingRange[1].toString(),
        }),
        ...(useScoreFilter && {
          scoreMin: scoreRange[0].toString(),
          scoreMax: scoreRange[1].toString(),
        }),
      };

      const result = await searchRestaurants(filters, currentPage, pageSize);

      if (result && result.page && Array.isArray(result.page.content)) {
        const normalizedAllRestaurants = result.page.content.map(
          (restaurant) => ({
            ...restaurant,
            hours: Array.isArray(restaurant.hours)
              ? restaurant.hours
              : typeof restaurant.hours === "object" && restaurant.hours.times
              ? restaurant.hours.times
              : restaurant.hours || "Horaires non disponibles",
            rating: restaurant.rating || 0,
            reviews: restaurant.reviews || 0,
            address: restaurant.address || "Adresse non disponible",
            featuredImage: restaurant.featuredImage || null,
          })
        );

        const mapRestaurants = normalizedAllRestaurants.filter(
          (restaurant) =>
            typeof restaurant.latitude === "number" &&
            typeof restaurant.longitude === "number" &&
            !isNaN(restaurant.latitude) &&
            !isNaN(restaurant.longitude)
        );

        if (isLoadMore) {
          setAllRestaurants((prev) => [...prev, ...normalizedAllRestaurants]);
          setRestaurants((prev) => [...prev, ...mapRestaurants]);
        } else {
          setAllRestaurants(normalizedAllRestaurants);
          setRestaurants(mapRestaurants);
        }

        setTotalResults(result.totalResults || 0);

        const totalPages = Math.ceil((result.totalResults || 0) / pageSize);
        setHasMoreData(currentPage < totalPages - 1);

        if (mapRestaurants.length < normalizedAllRestaurants.length) {
          console.warn(
            `${
              normalizedAllRestaurants.length - mapRestaurants.length
            } restaurants filtrés en raison de coordonnées invalides`
          );
        }
      } else {
        console.error("Format de réponse API invalide:", result);
        setError("Format de réponse API invalide. Veuillez réessayer.");
        if (!isLoadMore) {
          setAllRestaurants([]);
          setRestaurants([]);
        }
        setTotalResults(0);
      }

      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des restaurants:", error);
      setError(
        "Une erreur est survenue lors du chargement des données. Veuillez réessayer."
      );
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
        setAllRestaurants([]);
        setRestaurants([]);
      }
      setTotalResults(0);
    }
  };

  // Gestionnaires pour les filtres de range
  const handleRatingRangeChange = (e, index) => {
    const newRange = [...ratingRange];
    newRange[index] = parseFloat(e.target.value);
    setRatingRange(newRange);
  };

  const handleScoreRangeChange = (e, index) => {
    const newRange = [...scoreRange];
    newRange[index] = parseInt(e.target.value);
    setScoreRange(newRange);
  };

  const applyRangeFilters = () => {
    setCurrentPage(0);
    setAllRestaurants([]);
    setRestaurants([]);
    fetchRestaurants();
  };

  const resetRangeFilters = () => {
    setRatingRange([0, 5]);
    setScoreRange([0, 100]);
    setUseRatingFilter(true);
    setUseScoreFilter(true);
    setCurrentPage(0);
    setAllRestaurants([]);
    setRestaurants([]);
    fetchRestaurants();
    setSearchQuery("");
    setCity("");
    setCategoryQuery("");

  };

  const loadMoreData = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMoreData) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchRestaurants(true);
    }
  }, [currentPage, isLoading, isLoadingMore, hasMoreData]);

  // Tous les useEffect et gestionnaires existants...
  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleObserver = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMoreData) {
        loadMoreData();
      }
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);

    const loadingTriggerElement = document.getElementById("loading-trigger");
    if (loadingTriggerElement) {
      observerRef.current.observe(loadingTriggerElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreData, hasMoreData]);

  const handleCategoryChange = (e) => {
    setCategoryQuery(e.target.value);
  };

  const clearCategoryField = () => {
    setCategoryQuery("");
  };

  const handleSearch = () => {
    setCurrentPage(0);
    setAllRestaurants([]);
    setRestaurants([]);
    fetchRestaurants();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(0);
    setAllRestaurants([]);
    setRestaurants([]);
    fetchRestaurants();
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const clearCityField = () => {
    setCity("");
  };

  const toggleFilter = (filter) => {
    if (["American", "Italian", "Japanese", "Mexican"].includes(filter)) {
      if (category === filter) {
        setCategory("");
      } else {
        setCategory(filter);
      }
      setCurrentPage(0);
      setAllRestaurants([]);
      setRestaurants([]);
      fetchRestaurants();
    } else {
      setActiveFilters((prev) =>
        prev.includes(filter)
          ? prev.filter((f) => f !== filter)
          : [...prev, filter]
      );
    }
  };

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }, []);

  const handleShowDetails = useCallback((restaurant) => {
    setSelectedRestaurant(restaurant);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedRestaurant(null);
  }, []);

 const handleRestaurantHover = useCallback((restaurant) => {
  if (
    restaurant &&
    typeof restaurant.latitude === "number" &&
    typeof restaurant.longitude === "number" &&
    !isNaN(restaurant.latitude) &&
    !isNaN(restaurant.longitude)
  ) {
    setHoveredRestaurant(restaurant);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [restaurant.latitude, restaurant.longitude],
        mapInstanceRef.current.getZoom()
      );
    }
  }
}, []);

const handleRestaurantLeave = useCallback(() => {
  setHoveredRestaurant(null);
}, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      try {
        mapInstanceRef.current = L.map(mapRef.current, {
          center: [48.8566, 2.3522],
          zoom: mapZoom,
          zoomControl: false,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true,
          preferCanvas: true, // Améliore les performances
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 3,
        }).addTo(mapInstanceRef.current);
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte:", error);
      }
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapZoom);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapZoom]);

  useEffect(() => {
    if (restaurants.length > 0 && mapInstanceRef.current) {
      try {
        const validCoordinates = restaurants
          .filter(
            (r) =>
              typeof r.latitude === "number" &&
              typeof r.longitude === "number" &&
              !isNaN(r.latitude) &&
              !isNaN(r.longitude)
          )
          .map((r) => [r.latitude, r.longitude]);

        if (validCoordinates.length > 0) {
          const bounds = L.latLngBounds(validCoordinates);
          // Utilisez setTimeout pour éviter les conflits
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 15, // Limite le zoom maximum pour éviter d'être trop proche
              });
            }
          }, 100);
        } else {
          mapInstanceRef.current.setView([48.8566, 2.3522], 13);
        }
      } catch (error) {
        console.error(
          "Erreur lors de l'ajustement de la vue de la carte:",
          error
        );
      }
    }
  }, [restaurants]);

  useEffect(() => {
    if (hoveredRestaurant && mapInstanceRef.current) {
      try {
        const { latitude, longitude } = hoveredRestaurant;

        if (
          typeof latitude === "number" &&
          typeof longitude === "number" &&
          !isNaN(latitude) &&
          !isNaN(longitude)
        ) {
          mapInstanceRef.current.setView(
            [latitude, longitude],
            mapInstanceRef.current.getZoom()
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors du centrage sur le restaurant survolé:",
          error
        );
      }
    }
  }, [hoveredRestaurant]);

  const handleZoomIn = () => setMapZoom((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setMapZoom((prev) => Math.max(prev - 1, 10));

  const gradientStyle = {
    background: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
  };

  // Modal de progression d'export
  const ExportProgressModal = () => {
    if (!showExportModal) return null;

    return (
      <div
        className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-[5000]"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div
          className="bg-white rounded-lg p-20 max-w-xl w-full mx-4 "
        >
          <div className="text-center">
            <div className="mb-4">
              <FileText size={48} className="mx-auto mb-2 text-blue-500" />
              <h3 className="text-lg font-semibold">
                {exportSuccess ? "Export terminé!" : "Export en cours..."}
              </h3>
            </div>

            {exportError ? (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                Erreur: {exportError}
              </div>
            ) : exportSuccess ? (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                Fichier CSV téléchargé avec succès!
              </div>
            ) : (
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  Progression: {exportProgress}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {exportProgress < 30
                    ? "Préparation des données..."
                    : exportProgress < 70
                    ? "Génération du fichier CSV..."
                    : exportProgress < 100
                    ? "Finalisation..."
                    : "Terminé!"}
                </div>
              </div>
            )}

            {!isExporting && (
              <button
                onClick={closeExportModal}
                className="mt-4 px-10 py-3 bg-red-500 text-white rounded hover:bg-red-400 transition-colors"
              >
                Fermer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ComponentCard
      title={
        <CardHeader className=" p-6" style={gradientStyle}>
          <div className="flex justify-between items-center">
            <Typography variant="h5" color="white">
              Recherche d'entreprises B2B
            </Typography>
            <div className="flex items-center gap-2 text-sm text-white">
              <span className="px-2 py-0.5 rounded-full bg-white text-red-500 font-bold shadow-sm">
                {totalResults} Résultats
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white text-red-500 font-bold shadow-sm">
                {allRestaurants.length} Affiché(s)
              </span>
              {/* Bouton d'export CSV */}
              <button
                onClick={handleExportCSV}
                disabled={isExporting || totalResults === 0}
                className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 rounded-full text-white text-sm font-medium transition-colors"
                title="Exporter les résultats en CSV"
              >
                <Download size={14} />
                 Télécharger CSV
              </button>
            </div>
          </div>
        </CardHeader>
      }
      className="border border-blue-gray-100 shadow-md "
    >
      <div className="map-container dark:bg-gray-900 dark:text-white text-gray-800">
        {/* Modal de progression d'export */}
        <ExportProgressModal />

        {/* Barre latérale */}
        <div className="sidebar  dark:bg-gray-900 dark:text-white text-gray-800">
          <div className="search-container  dark:bg-gray-900 dark:text-white">
            <div className="search-input-container  dark:bg-gray-900 dark:text-white">
              <Search
                size={12}
                className="search-icon "
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Rechercher par nom "
                className="search-input dark:bg-gray-900 dark:text-white text-gray-800"
              />
              <Button
                className="search-button"
                onClick={handleSearch}
                size="sm"
              >
                Rechercher
              </Button>
              {/* Bouton Réinitialiser en haut avec icône */}
                <div className="filter-header-actions " style={{ marginLeft: "10px" }}>
                  <button
                    onClick={resetRangeFilters}
                    className="reset-filters-btn-top "
                    title="Réinitialiser tous les filtres"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="reset-icon"
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M3 21v-5h5" />
                    </svg>
                  </button>
                </div>
            </div>
          </div>



          <div className="filters-container  dark:bg-gray-900 dark:text-white text-gray-800"> 
            <button
              className="filters-toggle  "
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="dark:bg-gray-900 dark:text-white text-gray-800">Filtres</span>
              <span className={`toggle-icon dark:bg-gray-900 dark:text-white text-gray-800 ${showFilters ? "open" : ""}`}>
                ▼
              </span>
            </button>
            {showFilters && (
              
              <div className="">

                          <div className="location-container ">
            <div className="location-input   dark:bg-white dark:text-white text-gray-800 bg-gray-100 " >
              <div className="location-info" >
                <Search
                  size={16}
                  className="category-icon "
                />
                <input
                  type="text"
                  value={categoryQuery}
                  onChange={handleCategoryChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Catégorie (ex: restaurant, café, hotel...)"
                  className="location-text-input  "
                />
              </div>
              <button
                onClick={clearCategoryField}
                className="clear-button "
              >
                <X
                  size={16}
                  className="clear-icon "
                />
              </button>
            </div>
            <div
              className="location-input  dark:bg-white dark:text-white text-gray-800 bg-gray-100"
              style={{ marginTop: "10px" }}
            >
              <div className="location-info">
                <MapPin
                  size={16}
                  className="location-icon"
                />
                <input
                  type="text"
                  value={city}
                  onChange={handleCityChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ville"
                  className="location-text-input"
                />
              </div>
              <button
                onClick={clearCityField}
                className="clear-button "
              >
                <X
                  size={16}
                  className="clear-icon "
                />
              </button>
            </div>
          </div>
                

                {/* Section Filtre Rating */}
            
                  <div
                    className="filter-section-header"
                   
                    style={{ marginTop: "20px" }}
                  >
                    <Star
                      size={16}
                      className="mr-2 dark:bg-gray-900 dark:text-white text-gray-800"
                    />
                    <span className="font-medium dark:bg-gray-900 dark:text-white text-gray-800">Rating</span>
                    
                  </div>

                  <div
                    className={`range-filter ${
                      !useRatingFilter ? "opacity-50" : ""
                    }`}
                  >
                    <DualRangeSlider
                      min={0}
                      max={5}
                      step={0.5}
                      value={ratingRange}
                      onChange={setRatingRange}
                      disabled={!useRatingFilter}
                      isDarkMode={isDarkMode}
                      label=""
                      unit=" ⭐"
                      colorMode="rating"
                    />
                  </div>
               

                {/* Section Filtre Score */}
                
                  <div
                    className="filter-section-header "
                  >
                    <Target
                      size={16}
                      className="mr-2  dark:bg-gray-900 dark:text-white text-gray-800"
                    />
                    <span className="font-medium dark:bg-gray-900 dark:text-white text-gray-800">Score</span>
                  </div>

                  <div
                    className={`range-filter ${
                      !useScoreFilter ? "opacity-50" : ""
                    }`}
                  >
                    <DualRangeSlider
                      min={0}
                      max={100}
                      step={5}
                      value={scoreRange}
                      onChange={setScoreRange}
                      disabled={!useScoreFilter}
                      isDarkMode={isDarkMode}
                      label=""
                      unit=" pts"
                      colorMode="score"
                    />
                  </div>
                

                {/* Indicateurs de filtres actifs */}
              </div>
            )}
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="error-message dark:bg-gray-900 dark:text-white text-gray-800">
              {error}
            </div>
          )}

          {/* Liste des restaurants */}
          <div className="restaurant-list dark:bg-gray-900 dark:text-white text-gray-800 " ref={listContainerRef}>
            {isLoading && allRestaurants.length === 0 ? (
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="skeleton-item "
                  >
                    <div className="skeleton-content ">
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
            ) : allRestaurants.length === 0 ? (
              <div className="no-results">Aucun résultat trouvé.</div>
            ) : (
              <>
                {allRestaurants.map((restaurant) => (
  <RestaurantListItem
    key={restaurant.placeId}
    restaurant={restaurant}
    isFavorite={favorites.includes(restaurant.placeId)}
    isHovered={
      hoveredRestaurant &&
      (hoveredRestaurant.placeId === restaurant.placeId ||
        hoveredRestaurant.id === restaurant.id)
    }
    onHover={handleRestaurantHover}  // ← Cette ligne était manquante !
    onLeave={handleRestaurantLeave}
    onShowDetails={handleShowDetails}
    onFavoriteToggle={() => toggleFavorite(restaurant.placeId)}
    isDarkMode={isDarkMode}
  />
))}

                {hasMoreData && (
                  <div
                    id="loading-trigger"
                    style={{ height: "20px", margin: "10px 0" }}
                  >
                    {isLoadingMore && (
                      <div
                        className="loading-indicator"
                      >
                        <div className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Vue de la carte */}
        <div className="map-view">
          <div className="map-content">
            <div
              ref={mapRef}
              className="map-image-container "
              style={{ height: "100%", width: "100%" }}
            />

            {/* Contrôles de zoom */}
            <div className="map-controls">
              <button
                className="zoom-button "
                onClick={handleZoomIn}
              >
                <Plus size={18} />
              </button>
              <button
                className="zoom-button"
                onClick={handleZoomOut}
              >
                <Minus size={18} />
              </button>
            </div>

            {/* Marqueurs sur la carte */}
            {restaurants.map((restaurant) => (
              <RestaurantMapMarker
                key={restaurant.id || restaurant.placeId}
                restaurant={restaurant}
                isHovered={
                  hoveredRestaurant &&
                  (hoveredRestaurant.id === restaurant.id ||
                    hoveredRestaurant.placeId === restaurant.placeId)
                }
                isFavorite={
                  favorites.includes(restaurant.id) ||
                  favorites.includes(restaurant.placeId)
                }
                onHover={handleRestaurantHover}
                onLeave={handleRestaurantLeave}
                onShowDetails={handleShowDetails}
                onFavoriteToggle={() =>
                  toggleFavorite(restaurant.id || restaurant.placeId)
                }
                isDarkMode={isDarkMode}
                map={mapInstanceRef.current}
              />
            ))}
          </div>
        </div>

        {/* Détails du restaurant sélectionné */}
        {selectedRestaurant && (
          <RestaurantDetails
            restaurant={selectedRestaurant}
            isFavorite={favorites.includes(selectedRestaurant.id)}
            onClose={handleCloseDetails}
            onFavoriteToggle={() => toggleFavorite(selectedRestaurant.id)}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </ComponentCard>
  );
};

export default MapSmiffer;
