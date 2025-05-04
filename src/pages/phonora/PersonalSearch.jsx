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
      const response = await axios.get(`http://localhost:8080/users/protectedData/${dataId}?type=${type}`);
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
      className={`protected-data cursor-pointer transition-all duration-300 hover:bg-blue-gray-50 px-2 py-1 rounded ${isLoading ? 'opacity-50' : ''}`}
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
      ? 'http://localhost:8080/users/searchByA04'
      : 'http://localhost:8080/users/searchByA04NoFus';

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

  const displayedResults = useMemo(() => {
    return results.map((user, index) => (
      <tr key={user.idS || index}>
        <td className="py-3 px-5">
          <div className="flex items-center gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                {user.firstName} {user.lastName}
              </Typography>
              
            </div>
          </div>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-normal text-blue-gray-500">
                {user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : user.gender}
            </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600">
            {user.currentCity}
          </Typography>
          <Typography className="text-xs font-normal text-blue-gray-500">
            {user.currentCountry}
          </Typography>
        </td>
        
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600">
            {user.currentDepartment}
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600">
            {user.currentRegion}
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-normal text-blue-gray-500">
            <ProtectedData dataId={user.idS} type="phone" />
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600">
            <ProtectedData dataId={user.idS} type="email" />
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600">
            {user.workplace || "Not specified"}
          </Typography>
          <Typography className="text-xs font-normal text-blue-gray-500">
            {user.jobTitle || ""}
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600">
            <ProtectedData dataId={user.idS} type="relationship" />
          </Typography>
        </td>
        <td className="py-3 px-5">
          <Typography className="text-xs font-semibold text-blue-gray-600">
            {user.hometownCity}
          </Typography>
          <Typography className="text-xs font-normal text-blue-gray-500">
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

  //const gradientStyle = { background: "linear-gradient(135deg, #b24592 0%, #f15f79 100%)" };
  const gradientStyle = { background: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)" };
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader className="mb-8 p-6" style={gradientStyle}>
          <Typography variant="h5" color="white">
            Personal Search 
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-6 pt-2 pb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <Typography variant="small" className="mb-2 font-medium">
                  First Name
                </Typography>
                <Input
                  type="text"
                  name="firstName"
                  value={searchParams.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  //className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
              <div className="flex flex-col">
                <Typography variant="small" className="mb-2 font-medium">
                  Last Name
                </Typography>
                <Input
                  type="text"
                  name="lastName"
                  value={searchParams.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  //className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
              <div className="flex flex-col">
                <Typography variant="small" className="mb-2 font-medium">
                  City
                </Typography>
                <Input
                  type="text"
                  name="currentCity"
                  value={searchParams.currentCity}
                  onChange={handleInputChange}
                  placeholder="City"
                  //className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
              <div className="flex flex-col">
                <Typography variant="small" className="mb-2 font-medium">
                  Gender
                </Typography>
                <Select
                  name="gender"
                  value={searchParams.gender}
                  onChange={(value) => handleSelectChange(value, "gender")} 
                  placeholder="All"
                  options={optionsG}
                />
                  
              </div>
            </div>

            {/* Search Type Toggle */}
            <div className="flex items-center gap-3 mb-4 mt-2">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Search Type:
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="small" color="blue-gray">Exact</Typography>
                <Switch
                  checked={useFuzzySearch}
                  onChange={handleFuzzyToggle}
                  color="purple"
                  className="h-full w-full checked:bg-gradient-to-r checked:from-purple-500 checked:to-pink-500"
                />
                <Typography variant="small" color="blue-gray">Fuzzy</Typography>
              </div>
            </div>

            <div className="mb-4">
              <Button
                variant="text"
                color="blue-gray"
                className="flex items-center gap-2"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Hide advanced search' : 'Show advanced search'}
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
                  <Typography variant="small" className="mb-2 font-medium">
                    Department
                  </Typography>
                  <Input
                    type="text"
                    name="currentDepartment"
                    value={searchParams.currentDepartment}
                    onChange={handleInputChange}
                    placeholder="Department"
                    //className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium">
                    Relationship Status
                  </Typography>
                  <Select
                    name="relationshipStatus"
                    value={searchParams.relationshipStatus}
                    onChange={(value) => handleSelectChange(value, "relationshipStatus")}
                    placeholder="All"
                    options={optionsR}
                  />
                   
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium">
                    Workplace
                  </Typography>
                  <Input
                    type="text"
                    name="workplace"
                    value={searchParams.workplace}
                    onChange={handleInputChange}
                    placeholder="Workplace"
                    //className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium">
                    Email
                  </Typography>
                  <Input
                    type="email"
                    name="email"
                    value={searchParams.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    //className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium">
                    Phone Number
                  </Typography>
                  <Input
                    type="text"
                    name="phoneNumber"
                    value={searchParams.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    //className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium">
                    Hometown Country
                  </Typography>
                  <Input
                    type="text"
                    name="hometownCountry"
                    value={searchParams.hometownCountry}
                    onChange={handleInputChange}
                    placeholder="Hometown Country"
                    //className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium">
                    Hometown City
                  </Typography>
                  <Input
                    type="text"
                    name="hometownCity"
                    value={searchParams.hometownCity}
                    onChange={handleInputChange}
                    placeholder="Hometown City"
                    //className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </div>
                <div className="flex flex-col">
                  <Typography variant="small" className="mb-2 font-medium">
                    Results per page
                  </Typography>
                  <Select
                    name="resultsPerPage"
                    value={resultsPerPage.toString()}
                    onChange={(value) => {
                      setResultsPerPage(Number(value));
                      setCurrentPage(0);
                    }}
                    options={optionsP}
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
              <Button type="button" variant="outlined" color="red" onClick={clearSearch}>
                Clear
              </Button>
            </div>

            {error && <div className="text-red-500 mt-4">{error}</div>}
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="mb-8 p-6" style={gradientStyle}>
          <div className="flex justify-between items-center">
            <Typography variant="h5" color="white">
              Search Results {useFuzzySearch ? "(Fuzzy Search)" : "(Exact Search)"}
            </Typography>
            <div className="flex items-center gap-2 text-sm text-white">
              <span className="px-2 py-0.5 rounded-full bg-white text-red-500 font-bold shadow-sm">
                {nbr} results
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white text-red-500 font-bold shadow-sm">
                {results.length} shown
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {results.length > 0 ? (
            <table className="search-results-table w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Users","Gender", "Location", "Department","Region", "Phone Number", "Email", "Workplace", "Relationship Status", "Home Location"].map((el) => (
                    <th key={el} className="py-3 px-5 text-left">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-white">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedResults}
              </tbody>
            </table>
          ) : (
            !isLoading && (
              <div className="text-center py-4">
                <Typography color="blue-gray">No results found.</Typography>
              </div>
            )
          )}
          {isLoading && (
            <div className="text-center py-4">
              <Typography color="blue-gray">Loading the results...</Typography>
            </div>
          )}
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={goToPreviousPage}
              disabled={currentPage === 0 || isLoading}
              color="gray"
              size="sm"
              style={gradientStyle}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {getPageNumbers.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "filled" : "outlined"}
                  color={currentPage === page ? "red" : "gray"}
                  size="sm"
                  className="pagination-button"
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
              Next
            </Button>
          </div>
          <Typography variant="small" color="blue-gray" className="font-medium">
            Page {currentPage + 1} of {totalPages}
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PersonalSearch;