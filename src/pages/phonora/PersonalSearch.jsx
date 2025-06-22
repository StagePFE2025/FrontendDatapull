import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Option,
  CardFooter,
} from "@material-tailwind/react";
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import axios from 'axios';
import './UserSearchApp.css';
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Switch from "../../components/form/switch/Switch";
import ComponentCard from "../../components/common/ComponentCard";

// Icônes pour le téléchargement
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

// Reused ProtectedData component - memoized for better performance
const ProtectedData = memo(({ dataId, type }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const cacheKey = `${dataId}-${type}`;
  const dataCache = new Map();
  
  const handleToggleReveal = async () => {
    if (isRevealed) {
      setIsRevealed(false);
      return;
    }
    
    if (dataCache.has(cacheKey)) {
      setData(dataCache.get(cacheKey));
      setIsRevealed(true);
      setTimeout(() => setIsRevealed(false), 10000);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.get(`http://51.44.136.165:8080/users/protectedData/${dataId}?type=${type}`);
      const responseData = response.data.value;
      dataCache.set(cacheKey, responseData);
      setData(responseData);
      setIsRevealed(true);
      setTimeout(() => setIsRevealed(false), 10000);
    } catch (error) {
      console.error("Error fetching protected data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPlaceholder = () => {
    switch(type) {
      case "email": return "••••@••••.•••";
      case "phone": return "••• ••• ••••";
      case "relationship": return "••••••";
      default: return "•••••••";
    }
  };
  
  return (
    <span 
      onClick={handleToggleReveal} 
      className={`protected-data cursor-pointer transition-all duration-300 hover:bg-blue-gray-50 dark:hover:bg-blue-gray-800 px-2 py-1 rounded ${isLoading ? 'opacity-50' : ''}`}
    >
      {isRevealed && data ? data : getPlaceholder()}
    </span>
  );
});

export function PersonalSearch() {
  // Initialize state with memoized default values
  const defaultSearchParams = useMemo(() => ({
    firstName: '',
    lastName: '',
    email: '',
    currentCity: '',
    workplace: '',
    gender: '',
    relationshipStatus: '',
    phoneNumber: '',
    hometownCity: '',
    hometownCountry: '',
    currentCountry: '',
    currentDepartment: '',
  }), []);

  const optionsG = [
    { value: "", label: "All" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const optionsR = [
    { value: "", label: "All" },
    { value: "Married", label: "Married" },
    { value: "In a relationship", label: "In a relationship" },
    { value: "Single ", label: "Single" },
    { value: "Engaged", label: "Engaged" },
    { value: "Separated", label: "Separated" },
  ];
  const optionsP = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
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

  // Nouveaux états pour la progression du téléchargement
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadType, setDownloadType] = useState(''); // 'current' ou 'all'
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  // Modal de progression de téléchargement
  const DownloadProgressModal = () => {
    if (!showDownloadModal) return null;

    return (
      <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-[5000]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className={`bg-white rounded-lg p-20 max-w-xl w-full mx-4`}>
          <div className="text-center">
            <div className="mb-4">
              <FileTextIcon size={48} className="mx-auto mb-2 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {downloadSuccess ? 'Téléchargement terminé!' : 'Téléchargement en cours...'}
              </h3>
            </div>

            {downloadError ? (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-300 text-sm">
                Erreur: {downloadError}
              </div>
            ) : downloadSuccess ? (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded text-green-700 dark:text-green-300 text-sm">
                Fichier CSV téléchargé avec succès!
              </div>
            ) : (
              <div className="mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Progression: {downloadProgress}%
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {downloadProgress < 30 ? 'Préparation des données...' :
                   downloadProgress < 70 ? 'Génération du fichier CSV...' :
                   downloadProgress < 100 ? 'Finalisation...' : 'Terminé!'}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Type: {downloadType === 'current' ? 'Page actuelle' : 'Tous les résultats'}
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

  // Fonction pour fermer la modal
  const closeDownloadModal = () => {
    if (!isDownloading) {
      setShowDownloadModal(false);
      setDownloadProgress(0);
      setDownloadError(null);
      setDownloadSuccess(false);
      setDownloadType('');
    }
  };

  // Fonction pour télécharger la page actuelle
  const downloadCurrentResults = async () => {
    if (results.length === 0) {
      setError("Aucun résultat à télécharger.");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadError(null);
    setDownloadSuccess(false);
    setShowDownloadModal(true);
    setDownloadType('all');
    setDownloadType('current');

    try {
      setDownloadProgress(20);

      // Create CSV headers
      const headers = [
        "First Name",
        "Last Name",
        "Gender",
        "City",
        "Country",
        "Department",
        "Region",
        "Phone",
        "Email",
        "Workplace",
        "Job Title",
        "Relationship Status",
        "Hometown City",
        "Hometown Country",
      ];

      setDownloadProgress(40);

      // Format the results data
      const csvData = results.map((user) => [
        user.firstName || "",
        user.lastName || "",
        user.gender || "",
        user.currentCity || "",
        user.currentCountry || "",
        user.currentDepartment || "",
        user.currentRegion || "",
        user.phoneNumber || "",
        user.email || "",
        user.workplace || "",
        user.jobTitle || "",
        user.relationshipStatus || "",
        user.hometownCity || "",
        user.hometownCountry || "",
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
      const fileName = `personal-search-page${currentPage + 1}-${new Date()
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

      // Fermer la modal après 2 secondes
      setTimeout(() => {
        closeDownloadModal();
      }, 2000);

    } catch (err) {
      console.error("Download error:", err);
      setDownloadError("Une erreur est survenue lors du téléchargement. Veuillez réessayer.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Effect pour fermer le dropdown quand on clique ailleurs
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

    // Choose API endpoint based on fuzzy search toggle
    const apiEndpoint = useFuzzySearch 
      ? 'http://51.44.136.165:8080/users/searchByA04'
      : 'http://51.44.136.165:8080/users/searchByA04NoFus';

    try {
      const response = await axios.post(
        apiEndpoint,
        filteredParams,
        {
          params: {
            page: currentPage,
            size: resultsPerPage,
            sortBy: '_score',
            direction: 'desc',
            protectSensitiveData: true,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setResults(response.data.page?.content || response.data.content || []);
      setNBR(response.data.page?.totalElements || response.data.totalResults || 0);
    } catch (err) {
      setError("An error occurred during the search. Please try again.");
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
    setSearchParams(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((value, name) => {
    setSearchParams(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setCurrentPage(0);
    performSearch();
  }, [performSearch]);

  const handleFuzzyToggle = useCallback(() => {
    setUseFuzzySearch(prev => !prev);
    setCurrentPage(0);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchParams(defaultSearchParams);
    setResults([]);
    setNBR(0);
    setCurrentPage(0);
  }, [defaultSearchParams]);

  // Fonction améliorée pour télécharger tous les résultats avec progression
  const downloadAllResults = async () => {
    if (nbr === 0) {
      setError("Aucun résultat à télécharger.");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadError(null);
    setDownloadSuccess(false);
    setShowDownloadModal(true);

    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => 
        typeof value === 'string' && value.trim() !== ''
      )
    );

    try {
      setDownloadProgress(10);

      const response = await fetch("http://51.44.136.165:8080/users/export-csvPS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredParams),
      });

      setDownloadProgress(40);

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du fichier CSV.");
      }

      setDownloadProgress(70);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      setDownloadProgress(90);

      link.href = url;
      link.setAttribute("download", `personal-search-results-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setDownloadProgress(100);
      setDownloadSuccess(true);

      // Fermer la modal après 2 secondes
      setTimeout(() => {
        closeDownloadModal();
      }, 2000);

    } catch (err) {
      console.error("Erreur téléchargement :", err);
      setDownloadError("Une erreur est survenue pendant le téléchargement.");
    } finally {
      setIsDownloading(false);
    }
  };

  const displayedResults = useMemo(() => {
    return results.map((user, index) => (
      <tr key={user.idS || index} className="border-b border-gray-50 dark:border-gray-800">
        <td className="py-3 px-5 ">
          <div className="flex items-center gap-4">
            <div>
              <Typography variant="small" className="font-semibold text-black dark:text-white">
                {user.firstName} {user.lastName}
              </Typography>
            </div>
          </div>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100">
            {user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : user.gender}
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100">
            {user.currentCity}
          </Typography>
          <Typography className="text-xs font-normal text-blue-gray-500 dark:text-gray-100">
            {user.currentCountry}
          </Typography>
        </td>
        
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100">
            {user.currentDepartment}
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100">
            {user.currentRegion}
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-normal text-blue-gray-500 dark:text-gray-100">
            <ProtectedData dataId={user.idS} type="phone" />
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100">
            <ProtectedData dataId={user.idS} type="email" />
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100">
            {user.workplace || "Not specified"}
          </Typography>
          <Typography className="text-xs font-normal text-blue-gray-500 dark:text-gray-100">
            {user.jobTitle || ""}
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100">
            <ProtectedData dataId={user.idS} type="relationship" />
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600 dark:text-gray-100">
            {user.hometownCity}
          </Typography>
          <Typography className="text-xs font-normal text-blue-gray-500 dark:text-gray-100">
            {user.hometownCountry}
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

  const gradientStyle = { background: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)" };
  
  return (
    <div className="mt-2 mb-2  flex flex-col gap-10">
      {/* Modal de progression */}
      <DownloadProgressModal />

      <ComponentCard 
       title={
        <div className="flex flex-col items-center justify-center mb-4 mt-4">
        <div className="flex items-center mb-3">
          {/* Logo de la marque */}
          <div className="p-3 rounded-lg shadow-lg mr-4" style={gradientStyle}>
         
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>

        </div>
          
          {/* Titre de l'application */}
          <div>
            <label className="font-bold mb-0 text-gray-800 dark:text-gray-200" color="blue-gray" style={{ fontSize: "3rem" }}>
              Personal<span className="text-red-400"> Search</span>
            </label>
          </div>
        </div>
        
        <label className="text-center max-w-lg opacity-80 text-gray-800 dark:text-gray-200" style={{ fontSize: "1rem" }}>
Trouver rapidement le numéro de Téléphone de n'importe quelle personne        </label>
      </div>
      }
      className="bg-white dark:bg-gray-900 shadow-md">
        <CardHeader className="mb-8 p-6" style={gradientStyle}>
          <Typography variant="h5" color="white" className="">
            Recherche Personnelle 
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pt-2 pb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                  Prénom
                </Typography>
                <Input
                  type="text"
                  name="firstName"
                  value={searchParams.firstName}
                  onChange={handleInputChange}
                  placeholder="Prénom "
                  className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
              <div className="flex flex-col">
                <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                  Nom de famille
                </Typography>
                <Input
                  type="text"
                  name="lastName"
                  value={searchParams.lastName}
                  onChange={handleInputChange}
                  placeholder="Nom de famille"
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
                  name="currentCity"
                  value={searchParams.currentCity}
                  onChange={handleInputChange}
                  placeholder="Ville"
                  className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
              <div className="flex flex-col">
                <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                  Sexe
                </Typography>
                <Select
                  name="gender"
                  value={searchParams.gender}
                  onChange={(value) => handleSelectChange(value, "gender")} 
                  placeholder="All"
                  options={optionsG}
                  className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
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
                {showAdvanced ? 'Masquer la recherche avancée' : 'Afficher la recherche avancée'}
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
                    Departement
                  </Typography>
                  <Input
                    type="text"
                    name="currentDepartment"
                    value={searchParams.currentDepartment}
                    onChange={handleInputChange}
                    placeholder="Departement"
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Relationship Status
                  </Typography>
                  <Select
                    name="relationshipStatus"
                    value={searchParams.relationshipStatus}
                    onChange={(value) => handleSelectChange(value, "relationshipStatus")}
                    placeholder="All"
                    options={optionsR}
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    lieu de travail
                  </Typography>
                  <Input
                    type="text"
                    name="workplace"
                    value={searchParams.workplace}
                    onChange={handleInputChange}
                    placeholder="lieu de travail"
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Email
                  </Typography>
                  <Input
                    type="email"
                    name="email"
                    value={searchParams.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Numéro de Téléphone
                  </Typography>
                  <Input
                    type="text"
                    name="phoneNumber"
                    value={searchParams.phoneNumber}
                    onChange={handleInputChange}
                    placeholder=" Numéro de Téléphone"
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Pays d'origine
                  </Typography>
                  <Input
                    type="text"
                    name="hometownCountry"
                    value={searchParams.hometownCountry}
                    onChange={handleInputChange}
                    placeholder="Pays d'origine"
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    Ville d'origine
                  </Typography>
                  <Input
                    type="text"
                    name="hometownCity"
                    value={searchParams.hometownCity}
                    onChange={handleInputChange}
                    placeholder="Ville d'origine"
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
                    options={optionsP}
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
                {isLoading ? "Recherche en cours..." : "Rechrcher"}
              </Button>
              <Button 
                type="button" 
                variant="outlined" 
                color="red" 
                onClick={clearSearch}
                className="dark:border-red-400 dark:text-red-400"
              >
                EFFACER
              </Button>
            </div>

            <div className="flex justify-between items-center mt-4 gap-20 justify-end">
              <div className="relative">
                {/* Bouton de téléchargement avec dropdown */}
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
                        Téléchargement...
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
                          <div className="text-xs text-gray-500 dark:text-gray-400">{nbr} résultats au total</div>
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
              Résultats de la recherche {useFuzzySearch ? "( Recherche Fuzzy)" : "(Recherche exacte)"}
            </Typography>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-white">
                <span className="px-2 py-0.5 rounded-full bg-white text-red-500 font-bold shadow-sm">
                  {nbr} Résultats
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white text-red-500 font-bold shadow-sm">
                  {results.length} Affiché(s)
                </span>
              </div>
              {/* Bouton d'export rapide dans le header 
              <button
                onClick={() => downloadAllResults()}
                disabled={isDownloading || nbr === 0}
                className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 rounded-full text-white text-sm font-medium transition-colors"
                title="Télécharger tous les résultats en CSV"
              >
                <DownloadIcon size={14} />
                Export CSV
              </button>*/}
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="search-results-table w-full min-w-[640px] table-auto">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    {["Utilisateurs", "Genre", "Localisation", "Département", "Région", "Numéro de téléphone", "Adresse e-mail", "Lieu de travail", "Statut relationnel", "Localisation domicile"].map((el) => (
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
              <Typography className="text-gray-800 dark:text-gray-200"> Chargement des résultats...</Typography>
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
                  color={currentPage === page ? "red" : "gray"}
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

export default PersonalSearch;