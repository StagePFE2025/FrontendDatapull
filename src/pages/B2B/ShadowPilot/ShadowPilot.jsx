import React, { useState, useEffect } from 'react';
import CompanySearch from './CompanySearch';
import CompanyDetails from './CompanyDetails';

const TrustpilotApp = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyReviews, setCompanyReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [previousSearchResults, setPreviousSearchResults] = useState([]);
  const [previousSearchState, setPreviousSearchState] = useState({
    searchTerm: "",
    currentPage: 0,
    totalPages: 0,
    totalResults: 0,
    hasAdvancedSearch: false,
    advancedSearchParams: null
  });

  // Fonction pour voir les détails d'une entreprise
  const handleViewCompanyDetails = async (company, currentSearchResults, currentSearchState) => {
    // Sauvegarder l'état de recherche actuel avant de naviguer
    if (currentSearchResults && currentSearchResults.length > 0) {
      setPreviousSearchResults(currentSearchResults);
      setPreviousSearchState(currentSearchState);
    }
    
    setSelectedCompany(company);
    setReviewsLoading(true);
    
    // Simuler un appel API pour récupérer les avis
    setTimeout(() => {
      // Les avis viennent maintenant directement de l'API via company.enhancedReviews, etc.
      const reviews = company.enhancedReviews || [];
      setCompanyReviews(reviews);
      setReviewsLoading(false);
    }, 500);
  };

  // Fonction pour revenir à la liste
  const handleBackToList = () => {
    setSelectedCompany(null);
    setCompanyReviews([]);
  };

  // Si une entreprise est sélectionnée, afficher la vue détaillée
  if (selectedCompany) {
    return (
      <CompanyDetails
        company={selectedCompany}
        reviews={companyReviews}
        reviewsLoading={reviewsLoading}
        onBackToList={handleBackToList}
      />
    );
  }

  // Sinon, afficher la page de recherche
  return (
    <CompanySearch
      onViewCompanyDetails={handleViewCompanyDetails}
      initialSearchResults={previousSearchResults}
      initialSearchState={previousSearchState}
    />
  );
};

export default TrustpilotApp;