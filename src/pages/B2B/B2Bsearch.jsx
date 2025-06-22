import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  CardFooter,
} from "@material-tailwind/react";
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import axios from 'axios';
//import './B2BSearchApp.css';
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Switch from "../../components/form/switch/Switch";
import ComponentCard from "../../components/common/ComponentCard";
import RestaurantDetails from "./components/RestaurantDetailsPopup"; // Import du composant RestaurantDetails

// Icons for download
const DownloadIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const FileTextIcon = ({ size = 48, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14,2 H6 A2,2 0 0,0 4,4 V20 A2,2 0 0,0 6,22 H18 A2,2 0 0,0 20,20 V8 Z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

// Fonction pour obtenir la couleur et le style en fonction du score
const getScoreColor = (score, scoreCategory) => {
  const numScore = parseFloat(score);
  
  if (!score || isNaN(numScore)) {
    return {
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      textColor: 'text-gray-600 dark:text-gray-400',
      borderColor: 'border-gray-300 dark:border-gray-600',
      label: 'N/A'
    };
  }
  
  // Définition des couleurs basées sur le score numérique
  if (numScore >= 80) {
    return {
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-400',
      borderColor: 'border-green-300 dark:border-green-600',
      label: 'Excellent'
    };
  } else if (numScore >= 60) {
    return {
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-800 dark:text-blue-400',
      borderColor: 'border-blue-300 dark:border-blue-600',
      label: 'Bon'
    };
  } else if (numScore >= 40) {
    return {
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-800 dark:text-yellow-400',
      borderColor: 'border-yellow-300 dark:border-yellow-600',
      label: 'Moyen'
    };
  } else {
    return {
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-800 dark:text-red-400',
      borderColor: 'border-red-300 dark:border-red-600',
      label: 'Faible'
    };
  }
};

// Fonction pour obtenir la couleur du rating
const getRatingColor = (rating) => {
  const numRating = parseFloat(rating);
  
  if (!rating || isNaN(numRating)) {
    return 'text-gray-500 dark:text-gray-400';
  }
  
  if (numRating >= 4.5) {
    return 'text-green-600 dark:text-green-400';
  } else if (numRating >= 4.0) {
    return 'text-blue-600 dark:text-blue-400';
  } else if (numRating >= 3.0) {
    return 'text-yellow-600 dark:text-yellow-400';
  } else {
    return 'text-red-600 dark:text-red-400';
  }
};

// Composant Score Badge
const ScoreBadge = ({ score, scoreCategory }) => {
  const scoreStyle = getScoreColor(score, scoreCategory);
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`px-3 py-1 rounded-full border ${scoreStyle.bgColor} ${scoreStyle.borderColor} ${scoreStyle.textColor} text-center min-w-[60px]`}>
        <Typography className="text-xs font-bold">
          {score || 'N/A'}
        </Typography>
      </div>
      <Typography className={`text-xs font-medium ${scoreStyle.textColor}`}>
        {scoreCategory || scoreStyle.label}
      </Typography>
    </div>
  );
};

// Composant Rating avec couleurs
const RatingDisplay = ({ rating }) => {
  const ratingColor = getRatingColor(rating);
  
  return (
    <div className="flex flex-col items-center">
      <Typography className={`text-xs font-semibold ${ratingColor} text-center`}>
        {rating ? `${rating}/5` : 'N/A'}
      </Typography>
      {rating && (
        <div className="flex justify-center mt-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
    </div>
  );
};

// Légende des couleurs
const ScoreLegend = () => {
  const legends = [
    { range: '80-100', label: 'Excellent', bgColor: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-300' },
    { range: '60-79', label: 'Bon', bgColor: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-300' },
    { range: '40-59', label: 'Moyen', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-300' },
    { range: '0-39', label: 'Faible', bgColor: 'bg-red-100', textColor: 'text-red-800', borderColor: 'border-red-300' }
  ];

  return (
    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <Typography variant="small" className="font-medium text-gray-700 dark:text-gray-300 mb-2">
        Légende des scores :
      </Typography>
      <div className="flex flex-wrap gap-2">
        {legends.map((legend) => (
          <div key={legend.range} className="flex items-center gap-1">
            <div className={`w-4 h-4 rounded border ${legend.bgColor} ${legend.borderColor}`}></div>
            <Typography variant="small" className="text-xs text-gray-600 dark:text-gray-400">
              {legend.range} - {legend.label}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant pour afficher les erreurs de validation
const ValidationError = ({ error }) => {
  if (!error) return null;
  
  return (
    <Typography variant="small" className="text-red-500 mt-1 text-xs">
      {error}
    </Typography>
  );
};

export function B2BSearch() {
  // Initialize state with memoized default values
  const defaultSearchParams = useMemo(() => ({
    name: '',
    description: '',
    mainCategory: '',
    categories: '',
    query: '',
    city: '',
    address: '',
    ward: '',
    street: '',
    postalCode: '',
    state: '',
    countryCode: '',
    timeZone: '',
    plusCode: '',
    rating: '',
    ratingMin: '',
    ratingMax: '',
    score: '',
    scoreMin: '',
    scoreMax: '',
    scoreCategory: '',
    about: '',
    serviceName: '',
    serviceOption: '',
  }), []);

  const optionsPerPage = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  const scoreCategoryOptions = [
    { value: "", label: "All" },
    { value: "Excellent", label: "Excellent" },
    { value: "Good", label: "Good" },
    { value: "Average", label: "Average" },
    { value: "Poor", label: "Poor" },
  ];

  const [searchParams, setSearchParams] = useState(defaultSearchParams);
  const [currentPage, setCurrentPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [results, setResults] = useState([]);
  const [nbr, setNBR] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useFuzzySearch, setUseFuzzySearch] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // États pour l'affichage des détails
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Download progress states
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadType, setDownloadType] = useState('');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  // États pour les erreurs de validation
  const [validationErrors, setValidationErrors] = useState({});

  // Fonctions de validation
  const validateScore = (value, fieldName) => {
    const numValue = parseFloat(value);
    
    if (value === '') return null; // Champ vide autorisé
    
    if (isNaN(numValue)) {
      return `${fieldName} doit être un nombre valide`;
    }
    
    if (numValue < 0 || numValue > 100) {
      return `${fieldName} doit être entre 0 et 100`;
    }
    
    return null;
  };

  const validateRating = (value, fieldName) => {
    const numValue = parseFloat(value);
    
    if (value === '') return null; // Champ vide autorisé
    
    if (isNaN(numValue)) {
      return `${fieldName} doit être un nombre valide`;
    }
    
    if (numValue < 0 || numValue > 5) {
      return `${fieldName} doit être entre 0 et 5`;
    }
    
    return null;
  };

  const validateRange = (min, max, fieldType) => {
    if (min === '' || max === '') return null;
    
    const minValue = parseFloat(min);
    const maxValue = parseFloat(max);
    
    if (!isNaN(minValue) && !isNaN(maxValue) && minValue > maxValue) {
      return `La valeur minimale de ${fieldType} ne peut pas être supérieure à la valeur maximale`;
    }
    
    return null;
  };

  const validateAllFields = (params) => {
    const errors = {};
    
    // Validation des scores
    const scoreMinError = validateScore(params.scoreMin, 'Score minimum');
    const scoreMaxError = validateScore(params.scoreMax, 'Score maximum');
    const scoreRangeError = validateRange(params.scoreMin, params.scoreMax, 'score');
    
    if (scoreMinError) errors.scoreMin = scoreMinError;
    if (scoreMaxError) errors.scoreMax = scoreMaxError;
    if (scoreRangeError) errors.scoreRange = scoreRangeError;
    
    // Validation des ratings
    const ratingMinError = validateRating(params.ratingMin, 'Rating minimum');
    const ratingMaxError = validateRating(params.ratingMax, 'Rating maximum');
    const ratingRangeError = validateRange(params.ratingMin, params.ratingMax, 'rating');
    
    if (ratingMinError) errors.ratingMin = ratingMinError;
    if (ratingMaxError) errors.ratingMax = ratingMaxError;
    if (ratingRangeError) errors.ratingRange = ratingRangeError;
    
    return errors;
  };

  // Fonction pour transformer les données B2B en format RestaurantDetails
  const transformBusinessToRestaurant = (business) => {
    return {
      id: business.id,
      name: business.name || 'Business sans nom',
      description: business.description || '',
      mainCategory: business.mainCategory || business.query || 'Non spécifié',
      categories: Array.isArray(business.categories) ? business.categories : [business.categories].filter(Boolean),
      address: business.address || `${business.city || ''}, ${business.state || ''}, ${business.countryCode || ''}`.replace(/^,\s*|,\s*$/g, ''),
      city: business.city || '',
      state: business.state || '',
      countryCode: business.countryCode || '',
      postalCode: business.postalCode || '',
      phone: business.phone || '',
      website: business.website || '',
      rating: business.rating || 0,
      reviews: business.reviews || 0,
      score: business.score || 0,
      scoreCategory: business.scoreCategory || '',
      plusCode: business.plusCode || '',
      coordinates: business.coordinates || null,
      timeZone: business.timeZone || '',
      
      // Données transformées pour correspondre au format RestaurantDetails
      featuredImage: business.featuredImage || business.image || "https://fakeimg.pl/600x400?text=Business+Image",
      images: business.images || [],
      hours: business.hours || [],
      about: business.about || [],
      competitors: business.competitors || [],
      reviewsPerRating: business.reviewsPerRating || {},
      reviewKeywords: business.reviewKeywords || [],
      featuredReviews: business.featuredReviews || [],
      link: business.link || (business.coordinates ? 
        `https://www.google.com/maps/search/?api=1&query=${business.coordinates.lat},${business.coordinates.lon}` : 
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + ' ' + business.address)}`),
      reviewsLink: business.reviewsLink || ''
    };
  };

  // Fonction pour gérer le clic sur une ligne de tableau
  const handleBusinessClick = (business) => {
    const transformedBusiness = transformBusinessToRestaurant(business);
    setSelectedBusiness(transformedBusiness);
    setShowDetails(true);
  };

  // Fonction pour fermer les détails
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedBusiness(null);
  };

  // Fonction pour gérer les favoris
  const handleFavoriteToggle = () => {
    if (!selectedBusiness) return;
    
    const newFavorites = new Set(favorites);
    if (favorites.has(selectedBusiness.id)) {
      newFavorites.delete(selectedBusiness.id);
    } else {
      newFavorites.add(selectedBusiness.id);
    }
    setFavorites(newFavorites);
  };

  // Download progress modal
  const DownloadProgressModal = () => {
    if (!showDownloadModal) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[5000]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className={`bg-white rounded-lg p-20 max-w-xl w-full mx-4`}>
          <div className="text-center">
            <div className="mb-4">
              <FileTextIcon size={48} className="mx-auto mb-2 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {downloadSuccess ? 'Download completed!' : 'Download in progress...'}
              </h3>
            </div>

            {downloadError ? (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-300 text-sm">
                Error: {downloadError}
              </div>
            ) : downloadSuccess ? (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded text-green-700 dark:text-green-300 text-sm">
                Fichier CSV téléchargé avec succès !
              </div>
            ) : (
              <div className="mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                 Progression :{downloadProgress}%
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {downloadProgress < 30 ? 'Preparing data...' :
                   downloadProgress < 70 ? 'Generating CSV file...' :
                   downloadProgress < 100 ? 'Finalizing...' : 'Done!'}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Type: {downloadType === 'current' ? 'Current page' : 'All results'}
                </div>
              </div>
            )}

            {!isDownloading && (
              <button
                onClick={closeDownloadModal}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                Fermer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Function to close modal
  const closeDownloadModal = () => {
    if (!isDownloading) {
      setShowDownloadModal(false);
      setDownloadProgress(0);
      setDownloadError(null);
      setDownloadSuccess(false);
      setDownloadType('');
    }
  };

  // Function to download current results
  const downloadCurrentResults = async () => {
    if (results.length === 0) {
      setError("No results to download.");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadError(null);
    setDownloadSuccess(false);
    setShowDownloadModal(true);
    setDownloadType('current');

    try {
      setDownloadProgress(20);

      // Create CSV headers
      const headers = [
        "Name",
        "Description",
        "Main Category",
        "Categories",
        "City",
        "Address",
        "Ward",
        "Street",
        "Postal Code",
        "State",
        "Country Code",
        "Time Zone",
        "Plus Code",
        "Rating",
        "Score",
        "Score Category",
        "About",
        "Service Name",
        "Service Option",
        "Query"
      ];

      setDownloadProgress(40);

      // Format the results data
      const csvData = results.map((business) => [
        business.name || "",
        business.description || "",
        business.mainCategory || "",
        business.query || "",
        Array.isArray(business.categories) ? business.categories.join("; ") : business.categories || "",
        business.city || "",
        business.address || "",
        business.ward || "",
        business.street || "",
        business.postalCode || "",
        business.state || "",
        business.countryCode || "",
        business.timeZone || "",
        business.plusCode || "",
        business.rating || "",
        business.score || "",
        business.scoreCategory || "",
        typeof business.about === 'object' ? JSON.stringify(business.about) : business.about || "",
        business.serviceName || "",
        business.serviceOption || ""
      ]);

      setDownloadProgress(70);

      // Combine headers and data
      const csvContent = [
        headers.join(","),
        ...csvData.map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" && cell.includes(",")
                ? `"${cell.replace(/"/g, '""')}"`
                : cell
            )
            .join(",")
        ),
      ].join("\n");

      setDownloadProgress(90);

      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      const fileName = `b2b-search-page${currentPage + 1}-${useFuzzySearch ? 'fuzzy' : 'exact'}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setDownloadProgress(100);
      setDownloadSuccess(true);

      // Close modal after 2 seconds
      setTimeout(() => {
        closeDownloadModal();
      }, 2000);

    } catch (err) {
      console.error("Download error:", err);
      setDownloadError("An error occurred during download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDownloadOptions) {
        const dropdown = document.querySelector(".dropdown-menu");
        if (dropdown && !dropdown.contains(event.target)) {
          setShowDownloadOptions(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDownloadOptions]);

  const hasValidSearchParams = useMemo(() => {
    const filteredParams = Object.entries(searchParams).filter(
      ([_, value]) => typeof value === 'string' && value.trim() !== ''
    );
    return filteredParams.length > 0;
  }, [searchParams]);

  const performSearch = useCallback(async () => {
    if (!hasValidSearchParams) {
      setResults([]);
      setNBR(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => 
        typeof value === 'string' && value.trim() !== ''
      )
    );

    try {
      // Choisir l'API en fonction du type de recherche
      const apiEndpoint = useFuzzySearch 
        ? 'http://51.44.136.165:8080/api/b2b/searchByA04Fus' // API Fuzzy
        : 'http://51.44.136.165:8080/api/b2b/searchByA04';    // API Exact

      console.log(`Using ${useFuzzySearch ? 'Fuzzy' : 'Exact'} search API: ${apiEndpoint}`);

      const response = await axios.post(
        apiEndpoint,
        filteredParams,
        {
          params: {
            page: currentPage,
            size: resultsPerPage,
            sortBy: '_score',
            direction: 'desc',
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setResults(response.data.page?.content || response.data.content || []);
      setNBR(response.data.page?.totalElements || response.data.totalResults || 0);
    } catch (err) {
      setError(`An error occurred during the ${useFuzzySearch ? 'fuzzy' : 'exact'} search. Please try again.`);
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, currentPage, resultsPerPage, hasValidSearchParams, useFuzzySearch]);

  useEffect(() => {
    // Only update search when page changes (pagination), not during typing
    if (hasValidSearchParams && currentPage > 0) {
      performSearch();
    }
  }, [currentPage, performSearch, hasValidSearchParams]);

  const totalPages = useMemo(() => Math.ceil(nbr / resultsPerPage) || 1, [nbr, resultsPerPage]);

  const goToNextPage = useCallback(() => {
    if ((currentPage + 1) * resultsPerPage < nbr) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, resultsPerPage, nbr]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const goToPage = useCallback((page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Mettre à jour les paramètres de recherche
    setSearchParams(prev => ({ ...prev, [name]: value }));
    
    // Validation en temps réel pour les champs numériques
    if (['scoreMin', 'scoreMax', 'ratingMin', 'ratingMax'].includes(name)) {
      const newParams = { ...searchParams, [name]: value };
      const errors = validateAllFields(newParams);
      setValidationErrors(errors);
    }
  }, [searchParams]);

  const handleSelectChange = useCallback((value, name) => {
    setSearchParams(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Valider tous les champs avant la soumission
    const errors = validateAllFields(searchParams);
    setValidationErrors(errors);
    
    // Si il y a des erreurs, empêcher la soumission
    if (Object.keys(errors).length > 0) {
      setError("Veuillez corriger les erreurs de validation avant de continuer.");
      return;
    }
    
    setCurrentPage(0);
    performSearch();
  }, [performSearch, searchParams]);

  const handleFuzzyToggle = useCallback(() => {
    setUseFuzzySearch(prev => !prev);
    setCurrentPage(0);
    // Relancer automatiquement la recherche si on a des paramètres valides
    if (hasValidSearchParams) {
      // Petit délai pour que l'état soit mis à jour
      setTimeout(() => {
        performSearch();
      }, 100);
    }
  }, [hasValidSearchParams, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchParams(defaultSearchParams);
    setResults([]);
    setNBR(0);
    setCurrentPage(0);
    setValidationErrors({});
  }, [defaultSearchParams]);

  // Function to download all results with progress
  const downloadAllResults = async () => {
    if (nbr === 0) {
      setError("No results to download.");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadError(null);
    setDownloadSuccess(false);
    setShowDownloadModal(true);
    setDownloadType('all');

    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => 
        typeof value === 'string' && value.trim() !== ''
      )
    );

    try {
      setDownloadProgress(10);

      // Choisir l'API de téléchargement en fonction du type de recherche
      const exportEndpoint = useFuzzySearch 
        ? "http://51.44.136.165:8080/api/b2b/export-csvB2B-fus"  // API Export Fuzzy
        : "http://51.44.136.165:8080/api/b2b/export-csvB2B";     // API Export Exact

      console.log(`Using ${useFuzzySearch ? 'Fuzzy' : 'Exact'} export API: ${exportEndpoint}`);

      const response = await fetch(exportEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredParams),
      });

      setDownloadProgress(40);

      if (!response.ok) {
        throw new Error("Error generating CSV file.");
      }

      setDownloadProgress(70);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      setDownloadProgress(90);

      link.href = url;
      link.setAttribute("download", `b2b-search-results-${useFuzzySearch ? 'fuzzy' : 'exact'}-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setDownloadProgress(100);
      setDownloadSuccess(true);

      // Close modal after 2 seconds
      setTimeout(() => {
        closeDownloadModal();
      }, 2000);

    } catch (err) {
      console.error("Download error:", err);
      setDownloadError("An error occurred during download.");
    } finally {
      setIsDownloading(false);
    }
  };

  const displayedResults = useMemo(() => {
    return results.map((business, index) => (
      <tr 
        key={business.id || index} 
        className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
        onClick={() => handleBusinessClick(business)}
      >
        <td className="py-3 px-5">
          <div className="flex items-center gap-4">
            <div>
              <Typography variant="small" className="font-semibold text-black dark:text-white">
                {business.name}
              </Typography>
              <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                {business.mainCategory}
              </Typography>
            </div>
          </div>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100 text-center">
            {business.city}
          </Typography>
          <Typography className="text-xs font-normal text-blue-gray-500 dark:text-gray-100 text-center">
            {business.state}, {business.countryCode}
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100">
            {business.address}
          </Typography>
          <Typography className="text-xs font-normal text-blue-gray-500 dark:text-gray-100">
            {business.postalCode}
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100">
            {business.phone}
          </Typography>
        </td>
        <td className="py-3 px-5">
          <RatingDisplay rating={business.rating} />
        </td>
        <td className="py-3 px-5">
          <ScoreBadge score={business.score} scoreCategory={business.scoreCategory} />
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-normal text-blue-gray-500 dark:text-gray-100">
            {business.description ? 
              (business.description.length > 100 ? 
                `${business.description.substring(0, 100)}...` : 
                business.description) 
              : 'aucune description'}
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100">
            {Array.isArray(business.categories) ? 
              business.categories.slice(0, 2).join(", ") + 
              (business.categories.length > 2 ? "..." : "") :
              business.categories || "Aucune catégorie"}
          </Typography>
        </td>
      </tr>
    ));
  }, [results]);

  const getPageNumbers = useMemo(() => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  const gradientStyle = { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" };
  
  return (
    <div className="mt-2 mb-2 flex flex-col gap-10">
      {/* Progress modal */}
      <DownloadProgressModal />

      {/* Restaurant Details Modal */}
      {showDetails && selectedBusiness && (
        <RestaurantDetails
          restaurant={selectedBusiness}
          isFavorite={favorites.has(selectedBusiness.id)}
          onClose={handleCloseDetails}
          onFavoriteToggle={handleFavoriteToggle}
          isDarkMode={isDarkMode}
        />
      )}

      <ComponentCard 
        title={
          <div className="flex flex-col items-center justify-center mb-4 mt-4">
            <div className="flex items-center mb-3">
              {/* Brand logo */}
              <div className="p-3 rounded-lg shadow-lg mr-4" style={gradientStyle}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-1.39 11.651V9.35m0 0a3.001 3.001 0 003.75-2.836M18 9.349a3.001 3.001 0 00-3.75-2.836M18 9.349V6a2.25 2.25 0 00-2.25-2.25H8.25A2.25 2.25 0 006 6v3.349m12 0V9.35m0 0a3.001 3.001 0 003.75-2.836M18 9.349a3.001 3.001 0 00-3.75-2.836M6 9.349V6m12 3.349V6m-12 3.349V9.35m0 0a3.001 3.001 0 00-3.75 2.836M6 9.349V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v3.349M6 9.349a3.001 3.001 0 00-3.75 2.836" />
                </svg>
              </div>
              
              {/* Application title */}
              <div>
                <label className="font-bold mb-0 text-gray-800 dark:text-gray-200" style={{ fontSize: "3rem" }}>
                  B2B<span className="text-purple-400"> Recherche</span>
                </label>
              </div>
            </div>
            
            <label className="text-center max-w-lg opacity-80 text-gray-800 dark:text-gray-200" style={{ fontSize: "1rem" }}>
                Trouvez des entreprises et des services grâce à des capacités de recherche avancées.
            </label>
          </div>
        }
        className="bg-white dark:bg-gray-900 shadow-md">
        <CardHeader className="mb-8 p-6" style={gradientStyle}>
          <Typography variant="h5" color="white" className="">
            Recherche d'entreprises B2B
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pt-2 pb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                  Nom du Business
                </Typography>
                <Input
                  type="text"
                  name="name"
                  value={searchParams.name}
                  onChange={handleInputChange}
                  placeholder="Business Name"
                  className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
              <div className="flex flex-col">
                <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                  Description
                </Typography>
                <Input
                  type="text"
                  name="description"
                  value={searchParams.description}
                  onChange={handleInputChange}
                  placeholder="Business Description"
                  className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
              <div className="flex flex-col">
                <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                  Categorie principale
                </Typography>
                <Input
                  type="text"
                  name="query"
                  value={searchParams.query}
                  onChange={handleInputChange}
                  placeholder="Categorie principale"
                  className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
            </div>

            {/* Search Type Toggle */}
            <div className="flex items-center gap-3 mb-4 mt-2">
              <Typography variant="small" className="font-medium text-gray-800 dark:text-gray-200">
                type de recherche:
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="small" className="text-gray-800 dark:text-gray-200">Exact</Typography>
                <Switch
                  checked={useFuzzySearch}
                  onChange={handleFuzzyToggle}
                  color="purple"
                  className="h-full w-full checked:bg-gradient-to-r checked:from-purple-500 checked:to-pink-500"
                />
                <Typography variant="small" className="text-gray-800 dark:text-gray-200">Fuzzy</Typography>
              </div>
            </div>

            <div className="mb-4">
              <Button
                variant="text"
                className="flex items-center gap-2 text-gray-800 dark:text-gray-200"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Masquer la recherche avancée' : 'afficher la recherche avancée'}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </Button>
            </div>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Google catégorie principale
                  </Typography>
                  <Input
                    type="text"
                    name="mainCategory"
                    value={searchParams.mainCategory}
                    onChange={handleInputChange}
                    placeholder="Main Category"
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Google Categories
                  </Typography>
                  <Input
                    type="text"
                    name="categories"
                    value={searchParams.categories}
                    onChange={handleInputChange}
                    placeholder="Categories"
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Ville
                  </Typography>
                  <Input
                    type="text"
                    name="city"
                    value={searchParams.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    adresse
                  </Typography>
                  <Input
                    type="text"
                    name="address"
                    value={searchParams.address}
                    onChange={handleInputChange}
                    placeholder="Adresse"
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Région
                  </Typography>
                  <Input
                    type="text"
                    name="state"
                    value={searchParams.state}
                    onChange={handleInputChange}
                    placeholder="State or Region"
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Score Categorie
                  </Typography>
                  <Select
                    name="scoreCategory"
                    value={searchParams.scoreCategory}
                    onChange={(value) => handleSelectChange(value, "scoreCategory")} 
                    placeholder="All"
                    options={scoreCategoryOptions}
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Score Min
                  </Typography>
                  <Input
                    type="number"
                    name="scoreMin"
                    value={searchParams.scoreMin}
                    onChange={handleInputChange}
                    placeholder="Min Score (0-100)"
                    className={`dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 ${
                      validationErrors.scoreMin ? 'border-red-500' : ''
                    }`}
                    labelProps={{ className: "before:content-none after:content-none" }}
                    min="0"
                    max="100"
                    step="5"
                  />
                  <ValidationError error={validationErrors.scoreMin} />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Score Max
                  </Typography>
                  <Input
                    type="number"
                    name="scoreMax"
                    value={searchParams.scoreMax}
                    onChange={handleInputChange}
                    placeholder="Max Score (0-100)"
                    className={`dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 ${
                      validationErrors.scoreMax ? 'border-red-500' : ''
                    }`}
                    labelProps={{ className: "before:content-none after:content-none" }}
                    min="0"
                    max="100"
                    step="5"
                  />
                  <ValidationError error={validationErrors.scoreMax} />
                </div>
                {validationErrors.scoreRange && (
                  <div className="col-span-2">
                    <ValidationError error={validationErrors.scoreRange} />
                  </div>
                )}
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Rating Min
                  </Typography>
                  <Input
                    type="number"
                    name="ratingMin"
                    value={searchParams.ratingMin}
                    onChange={handleInputChange}
                    placeholder="Min Rating (0-5)"
                    min="0"
                    max="5"
                    step="0.1"
                    className={`dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 ${
                      validationErrors.ratingMin ? 'border-red-500' : ''
                    }`}
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                  <ValidationError error={validationErrors.ratingMin} />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Rating Max
                  </Typography>
                  <Input
                    type="number"
                    name="ratingMax"
                    value={searchParams.ratingMax}
                    onChange={handleInputChange}
                    placeholder="Max Rating (0-5)"
                    min="0"
                    max="5"
                    step="0.1"
                    className={`dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 ${
                      validationErrors.ratingMax ? 'border-red-500' : ''
                    }`}
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                  <ValidationError error={validationErrors.ratingMax} />
                </div>
                {validationErrors.ratingRange && (
                  <div className="col-span-2">
                    <ValidationError error={validationErrors.ratingRange} />
                  </div>
                )}
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Service Tags
                  </Typography>
                  <Input
                    type="text"
                    name="serviceOption"
                    value={searchParams.serviceOption}
                    onChange={handleInputChange}
                    placeholder="Service Option"
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Résultats par page
                  </Typography>
                  <Select
                    name="resultsPerPage"
                    value={resultsPerPage.toString()}
                    onChange={(value) => {
                      setResultsPerPage(Number(value));
                      setCurrentPage(0);
                    }}
                    options={optionsPerPage}
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-6">
              <Button 
                type="submit" 
                color="gray" 
                disabled={isLoading} 
                style={gradientStyle}
                className="font-bold"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
              <Button 
                type="button" 
                variant="outlined" 
                color="red" 
                onClick={clearSearch}
                className="dark:border-red-400 dark:text-red-400"
              >
                Effacer
              </Button>
            </div>

            <div className="flex justify-between items-center mt-4 gap-20 justify-end">
              <div className="relative">
                {/* Download button with dropdown */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
                    onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                    disabled={results.length === 0 || isLoading || isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                        Téléchargement en cours...
                      </>
                    ) : (
                      <>
                        <DownloadIcon size={16} />
                        Télécharger CSV
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </Button>
                </div>

                {showDownloadOptions && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-[1000] border border-gray-200 dark:border-gray-700 dropdown-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <button
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center justify-between"
                        onClick={() => {
                          downloadCurrentResults();
                          setShowDownloadOptions(false);
                        }}
                        disabled={isDownloading}
                      >
                        <div>
                          <div className="font-medium">Page actuelle</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{results.length} résultats</div>
                        </div>
                        <DownloadIcon size={14} />
                      </button>
                      <hr className="border-gray-200 dark:border-gray-600" />
                      <button
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center justify-between"
                        onClick={() => {
                          downloadAllResults();
                          setShowDownloadOptions(false);
                        }}
                        disabled={isDownloading}
                      >
                        <div>
                          <div className="font-medium">Tous les résultats</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{nbr} Résultats totaux</div>
                        </div>
                        <DownloadIcon size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && <div className="text-red-500 mt-4">{error}</div>}
          </form>
        </CardBody>
      </ComponentCard>

      <ComponentCard className="bg-white dark:bg-gray-900 shadow-md">
        <CardHeader className="mb-8 p-6" style={gradientStyle}>
          <div className="flex justify-between items-center">
            <Typography variant="h5" color="white">
              Résultats de recherche {useFuzzySearch ? "(Fuzzy Search)" : "(Exact Search)"}
            </Typography>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-white">
                <span className="px-2 py-0.5 rounded-full bg-white text-purple-500 font-bold shadow-sm">
                  {nbr} Résultats
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white text-purple-500 font-bold shadow-sm">
                  {results.length} Affiché(s)
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          {results.length > 0 && <ScoreLegend />}
          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="search-results-table w-full min-w-[640px] table-auto">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    {["Business", "localisation", "Adresse"," téléphone", "Rating", "Score", "Description", "Categories"].map((el) => (
                      <th key={el} className="py-3 px-5 text-left">
                        <Typography variant="small" className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300">
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900">
                  {displayedResults}
                </tbody>
              </table>
            </div>
          ) : (
            !isLoading && (
              <div className="text-center py-4">
                <Typography className="text-gray-800 dark:text-gray-200">Aucun résultat trouvé.</Typography>
              </div>
            )
          )}
          {isLoading && (
            <div className="text-center py-4">
              <Typography className="text-gray-800 dark:text-gray-200">Chargement des résultats...</Typography>
            </div>
          )}
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 dark:border-blue-gray-800 p-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={goToPreviousPage}
              disabled={currentPage === 0 || isLoading}
              color="gray"
              size="sm"
              style={gradientStyle}
            >
              Précédent
            </Button>
            <div className="flex items-center gap-1">
              {getPageNumbers.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "filled" : "outlined"}
                  color={currentPage === page ? "purple" : "gray"}
                  size="sm"
                  className="pagination-button text-gray-800 dark:text-gray-200"
                  onClick={() => goToPage(page)}
                  disabled={isLoading}
                >
                  {page + 1}
                </Button>
              ))}
            </div>
            <Button
              onClick={goToNextPage}
              disabled={(currentPage + 1) * resultsPerPage >= nbr || !nbr || isLoading}
              color="gray"
              size="sm"
              style={gradientStyle}
            >
              Suivant
            </Button>
          </div>
          <Typography variant="small" className="font-medium text-gray-800 dark:text-gray-200">
            Page {currentPage + 1} sur {totalPages}
          </Typography>
        </CardFooter>
      </ComponentCard>
    </div>
  );
}

export default B2BSearch;