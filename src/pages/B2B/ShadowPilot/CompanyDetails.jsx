import React, { useState } from "react";
import {
  Star,
  StarHalf,
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  User,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  Calendar,
  TrendingUp,
  Users,
  Award,
  BarChart3,
  Shield,
  Filter,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";

const CompanyDetails = ({ company, reviews, reviewsLoading, onBackToList }) => {
  const [selectedReviewFilter, setSelectedReviewFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [activeTab, setActiveTab] = useState("all");
  const [copiedField, setCopiedField] = useState(null);

  const renderStars = (rating, size = "w-3 h-3") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className={`${size} fill-green-500 text-green-500`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className={`${size} fill-green-500 text-green-500`}
          />
        );
      } else {
        stars.push(<Star key={i} className={`${size} text-gray-300`} />);
      }
    }
    return stars;
  };

  const getTrustScoreColor = (score) => {
    if (typeof score === "number") {
      if (score >= 4.5)
        return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700";
      if (score >= 4.0)
        return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
      if (score >= 3.0)
        return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700";
      if (score >= 2.0)
        return "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700";
      return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";
    }

    switch (score) {
      case "Excellent":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700";
      case "Très bien":
        return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
      case "Bien":
        return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
    }
  };

  const getTrustScoreLabel = (score) => {
    if (typeof score === "number") {
      if (score >= 4.5) return "Excellent";
      if (score >= 4.0) return "Très bien";
      if (score >= 3.0) return "Bien";
      if (score >= 2.0) return "Moyen";
      return "Mauvais";
    }
    return score || "Non évalué";
  };

  const formatDate = (dateString) => {
    if (dateString.includes(" ")) {
      return dateString;
    } else {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const formatBusinessAge = (days) => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    if (years > 0) {
      return `${years} an${years > 1 ? "s" : ""}${
        months > 0 ? ` et ${months} mois` : ""
      }`;
    }
    return `${months} mois`;
  };

  const calculateStarDistribution = (sentimentDistribution) => {
    if (!sentimentDistribution) return null;

    const totalReviews =
      (sentimentDistribution["1_star_count"] || 0) +
      (sentimentDistribution["2_star_count"] || 0) +
      (sentimentDistribution["3_star_count"] || 0) +
      (sentimentDistribution["4_star_count"] || 0) +
      (sentimentDistribution["5_star_count"] || 0);

    if (totalReviews === 0) return null;

    return {
      5: {
        count: sentimentDistribution["5_star_count"] || 0,
        percentage:
          ((sentimentDistribution["5_star_count"] || 0) / totalReviews) * 100,
        avgWords: sentimentDistribution["5_star_avg_words"] || 0,
      },
      4: {
        count: sentimentDistribution["4_star_count"] || 0,
        percentage:
          ((sentimentDistribution["4_star_count"] || 0) / totalReviews) * 100,
        avgWords: sentimentDistribution["4_star_avg_words"] || 0,
      },
      3: {
        count: sentimentDistribution["3_star_count"] || 0,
        percentage:
          ((sentimentDistribution["3_star_count"] || 0) / totalReviews) * 100,
        avgWords: sentimentDistribution["3_star_avg_words"] || 0,
      },
      2: {
        count: sentimentDistribution["2_star_count"] || 0,
        percentage:
          ((sentimentDistribution["2_star_count"] || 0) / totalReviews) * 100,
        avgWords: sentimentDistribution["2_star_avg_words"] || 0,
      },
      1: {
        count: sentimentDistribution["1_star_count"] || 0,
        percentage:
          ((sentimentDistribution["1_star_count"] || 0) / totalReviews) * 100,
        avgWords: sentimentDistribution["1_star_avg_words"] || 0,
      },
      total: totalReviews,
    };
  };

  // Fonction pour copier le texte
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Récupération des données depuis l'API
  const businessMetrics = company.businessMetrics || {};
  const socialMedia = company.socialMedia || {};
  const enhancedReviews = company.enhancedReviews || reviews || [];
  const fiveStarReviews = company.fiveStarReviews || [];
  const oneStarReviews = company.oneStarReviews || [];
  const starRatings = company.starRatings || {};
  const sentimentDistribution =
    businessMetrics.sentimentDistribution ||
    company.sentimentDistribution ||
    {};
  const similarCompanies = company.similarCompanies || [];

  const starDistribution = calculateStarDistribution(sentimentDistribution);

  const getBarColor = (stars) => {
    switch (stars) {
      case 5:
        return "bg-emerald-500";
      case 4:
        return "bg-lime-500";
      case 3:
        return "bg-amber-500";
      case 2:
        return "bg-orange-500";
      case 1:
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getReviewsByTab = () => {
    switch (activeTab) {
      case "positive":
        return fiveStarReviews;
      case "negative":
        return oneStarReviews;
      default:
        return enhancedReviews;
    }
  };

  const getFilteredReviews = () => {
    let filtered = getReviewsByTab();

    if (selectedReviewFilter !== "all" && activeTab === "all") {
      const starFilter = parseInt(selectedReviewFilter);
      filtered = enhancedReviews.filter(
        (review) => Math.floor(review.rating) === starFilter
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      } else if (sortBy === "helpful") {
        return (b.helpful_votes || 0) - (a.helpful_votes || 0);
      }
      return 0;
    });
  };

  const filteredReviews = getFilteredReviews();

  return (
    <div className="dark:text-gray-100 dark:bg-gray-900 min-h-screen bg-gray-50">
      {/* Header moderne avec gradient subtil */}
      <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 py-6">
          <button
            onClick={onBackToList}
            className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à la recherche
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center text-3xl overflow-hidden border border-gray-200 dark:border-gray-700">
                {businessMetrics.logo_url ? (
                  <img
                    src={businessMetrics.logo_url}
                    alt={company.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">
                    {company.logo || company.name?.charAt(0) || "🏢"}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {company.name}
                </h1>
                <div className="flex items-center space-x-6 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(
                        businessMetrics.trustscore || company.rating || 0,
                        "w-5 h-5"
                      )}
                    </div>
                    <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
                      {(
                        businessMetrics.trustscore ||
                        company.rating ||
                        0
                      ).toFixed(1)}
                    </span>
                    <span className="text-gray-500 font-medium">
                      (
                      {(
                        businessMetrics.number_of_reviews ||
                        company.totalReviews ||
                        0
                      ).toLocaleString()}{" "}
                      avis)
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-wrap gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getTrustScoreColor(
                      businessMetrics.trustscore || company.rating || 0
                    )}`}
                  >
                    {getTrustScoreLabel(
                      businessMetrics.trustscore || company.trustScore
                    )}
                  </span>
                  {company.category && (
                    <span className="text-sm text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-2 rounded-full border border-indigo-200 dark:border-indigo-700 font-medium">
                      {company.category}
                    </span>
                  )}
                  {company.subCategory && (
                    <span className="text-sm text-purple-700 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-2 rounded-full border border-purple-200 dark:border-purple-700 font-medium">
                      {company.subCategory}
                    </span>
                  )}
                  {businessMetrics.is_claimed && (
                    <span className="text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-full flex items-center border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
                      <Shield className="w-4 h-4 mr-1" />
                      Profil revendiqué
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-3 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar avec informations de l'entreprise */}
          <div className="lg:col-span-1 space-y-6">
            {/* Informations de contact mises en valeur */}
            {/* Informations de contact mises en valeur */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                  Informations de contact
                </h3>
                <p className="text-emerald-100 text-sm">
                  Toutes les coordonnées de l'entreprise
                </p>
              </div>

              <div className="p-6 space-y-4">
                {company.address && (
                  <div
                    className="group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 transition-colors cursor-pointer"
                    onClick={() => copyToClipboard(company.address, "address")}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Adresse
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
                          {company.address}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {copiedField === "address" ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {company.phone && (
                  <div
                    className="group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 transition-colors cursor-pointer"
                    onClick={() => copyToClipboard(company.phone, "phone")}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Téléphone
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-mono break-all">
                          {company.phone}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {copiedField === "phone" ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {company.email && (
                  <div
                    className="group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 transition-colors cursor-pointer"
                    onClick={() => copyToClipboard(company.email, "email")}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Email
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-mono break-all">
                          {company.email}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {copiedField === "email" ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {(company.website || company.domain) && (
                  <div className="group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Site web
                        </p>
                        <a
                          href={company.website || `https://${company.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center font-mono break-all"
                        >
                          {company.domain || company.website}
                          <ExternalLink className="w-3 h-3 ml-2 flex-shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Catégories */}
                {(company.category || company.subCategory) && (
                  <div className="group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Secteur d'activité
                        </p>
                        <div className="space-y-2">
                          {company.category && (
                            <div className="flex items-center space-x-2 flex-wrap">
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex-shrink-0">
                                Catégorie:
                              </span>
                              <span className="text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md font-medium break-words">
                                {company.category}
                              </span>
                            </div>
                          )}
                          {company.subCategory && (
                            <div className="flex items-center space-x-2 flex-wrap">
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex-shrink-0">
                                Sous-catégorie:
                              </span>
                              <span className="text-sm text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md font-medium break-words">
                                {company.subCategory}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Complétude du profil */}
                {businessMetrics.contact_completeness && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Complétude du profil
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {businessMetrics.contact_completeness}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${businessMetrics.contact_completeness}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques améliorées */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Statistiques</h3>
                <p className="text-blue-100 text-sm">
                  Données de performance de l'entreprise
                </p>
              </div>

              <div className="p-6 space-y-4">
                {businessMetrics.business_age_days && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Âge de l'entreprise
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {formatBusinessAge(businessMetrics.business_age_days)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total avis
                    </span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">
                    {(businessMetrics.number_of_reviews || 0).toLocaleString()}
                  </span>
                </div>

                {businessMetrics.avg_reviews_per_month && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Avis/mois (moy.)
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {businessMetrics.avg_reviews_per_month.toFixed(1)}
                    </span>
                  </div>
                )}

                {businessMetrics.response_rate !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Taux de réponse
                      </span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">
                      {Math.round(businessMetrics.response_rate)}%
                    </span>
                  </div>
                )}

                {businessMetrics.verified_reviews_count !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Avis vérifiés
                      </span>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {businessMetrics.verified_reviews_count}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Distribution des étoiles modernisée */}
            {starDistribution && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">
                    Répartition des notes
                  </h3>
                  <p className="text-amber-100 text-sm">
                    Distribution des avis par étoiles
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center space-x-4">
                      <div className="flex items-center w-16">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                          {stars}
                        </span>
                        <Star className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-full rounded-full ${getBarColor(
                            stars
                          )} transition-all duration-500`}
                          style={{
                            width: `${starDistribution[stars].percentage}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 w-28">
                        <span className="font-medium">
                          {starDistribution[stars].count}
                        </span>
                        <span className="text-gray-400">
                          ({starDistribution[stars].percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section avis modernisée */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                {/* Onglets modernisés */}
                <div className="flex items-center space-x-1 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`flex-shrink-0 px-4 py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                      activeTab === "all"
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    <span className="truncate">
                      Échantillons des avis ({enhancedReviews.length})
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("positive")}
                    className={`flex-shrink-0 px-4 py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                      activeTab === "positive"
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 fill-emerald-500 text-emerald-500 flex-shrink-0" />
                      <span className="hidden sm:inline">
                        Échantillons des avis Positifs ({fiveStarReviews.length}
                        )
                      </span>
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("negative")}
                    className={`flex-shrink-0 px-4 py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                      activeTab === "negative"
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 fill-red-500 text-red-500 flex-shrink-0" />
                      <span className="hidden sm:inline">
                        Échantillons des avis Négatifs ({oneStarReviews.length})
                      </span>
                      <span className="truncate"></span>
                    </span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                    {activeTab === "all" &&
                      `Tous les avis (${filteredReviews.length})`}
                    {activeTab === "positive" &&
                      `Avis positifs (${filteredReviews.length})`}
                    {activeTab === "negative" &&
                      `Avis négatifs (${filteredReviews.length})`}
                  </h3>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    {activeTab === "all" && (
                      <select
                        value={selectedReviewFilter}
                        onChange={(e) =>
                          setSelectedReviewFilter(e.target.value)
                        }
                        className="text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-w-0"
                      >
                        <option value="all">Toutes les notes</option>
                        <option value="5">5 étoiles</option>
                        <option value="4">4 étoiles</option>
                        <option value="3">3 étoiles</option>
                        <option value="2">2 étoiles</option>
                        <option value="1">1 étoile</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    <span className="ml-4 text-gray-600 dark:text-gray-400">
                      Chargement des avis...
                    </span>
                  </div>
                ) : filteredReviews.length > 0 ? (
                  <div className="space-y-6">
                    {/* Badge d'information pour les avis filtrés */}
                    {activeTab !== "all" && (
                      <div
                        className={`p-4 rounded-xl border-l-4 ${
                          activeTab === "positive"
                            ? "bg-emerald-50 border-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-500"
                            : "bg-red-50 border-red-400 dark:bg-red-900/20 dark:border-red-500"
                        }`}
                      >
                        <div className="flex items-start">
                          <Star
                            className={`w-4 h-4 sm:w-5 sm:h-5 mr-3 flex-shrink-0 ${
                              activeTab === "positive"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          />
                          <p
                            className={`text-xs sm:text-sm font-medium break-words ${
                              activeTab === "positive"
                                ? "text-emerald-800 dark:text-emerald-200"
                                : "text-red-800 dark:text-red-200"
                            }`}
                          >
                            {activeTab === "positive"
                              ? `Affichage des ${fiveStarReviews.length} avis les mieux notés (5 étoiles)`
                              : `Affichage des ${oneStarReviews.length} avis les moins bien notés (1 étoile)`}
                          </p>
                        </div>
                      </div>
                    )}

                    {filteredReviews.map((review, index) => (
                      <div
                        key={`${activeTab}-${index}`}
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  Client anonyme
                                </span>
                                {review.is_verified === "True" && (
                                  <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium dark:bg-emerald-900/30 dark:text-emerald-300">
                                    ✓ Vérifié
                                  </span>
                                )}
                                {activeTab === "positive" && (
                                  <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium dark:bg-emerald-900/30 dark:text-emerald-300">
                                    Positif
                                  </span>
                                )}
                                {activeTab === "negative" && (
                                  <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium dark:bg-red-900/30 dark:text-red-300">
                                    Négatif
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                  {renderStars(review.rating, "w-4 h-4")}
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(review.date)}
                                </span>
                                {review.word_count && (
                                  <span className="text-sm text-gray-400 dark:text-gray-500">
                                    {review.word_count} mots
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {review.title && review.has_title === "True" && (
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-lg">
                            {review.title}
                          </h4>
                        )}
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg">
                          {review.text}
                        </p>

                        <div className="flex items-center space-x-6">
                          <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group">
                            <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Utile ({review.helpful_votes || 0})</span>
                          </button>
                          <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            Signaler
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {activeTab === "all" &&
                        selectedReviewFilter === "all" &&
                        "Aucun avis disponible"}
                      {activeTab === "all" &&
                        selectedReviewFilter !== "all" &&
                        `Aucun avis avec ${selectedReviewFilter} étoile${
                          selectedReviewFilter > 1 ? "s" : ""
                        }`}
                      {activeTab === "positive" &&
                        "Aucun avis positif disponible"}
                      {activeTab === "negative" &&
                        "Aucun avis négatif disponible"}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {activeTab === "all" &&
                        selectedReviewFilter === "all" &&
                        "Soyez le premier à laisser un avis pour cette entreprise."}
                      {activeTab === "all" &&
                        selectedReviewFilter !== "all" &&
                        "Essayez un autre filtre pour voir plus d'avis."}
                      {activeTab === "positive" &&
                        "Cette entreprise n'a pas encore d'avis 5 étoiles."}
                      {activeTab === "negative" &&
                        "Cette entreprise n'a pas d'avis 1 étoile."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Entreprises similaires modernisées */}
            {similarCompanies.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mt-8 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">
                    Entreprises similaires
                  </h3>
                  <p className="text-purple-100 text-sm">
                    Découvrez d'autres entreprises du même secteur
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similarCompanies.slice(0, 6).map((similar, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:shadow-md cursor-pointer group"
                      >
                        <div className="min-w-0 w-full">
                          <div
                            className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate"
                            title={
                              similar.name?.split(/(\d+\.\d+)/)[0] ||
                              similar.name
                            }
                          >
                            {similar.name?.split(/(\d+\.\d+)/)[0] ||
                              similar.name}
                          </div>
                          <div
                            className="text-sm text-gray-500 dark:text-gray-400 truncate"
                            title={similar.name}
                          >
                            {similar.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer modernisé */}
      <div className="bg-white border-t border-gray-200 dark:border-gray-700 mt-12 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-3 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-6">
              <span className="font-medium">© 2025 Shadowtpilot </span>
              <a
                href="#"
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Politique de confidentialité
              </a>
              <a
                href="#"
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Conditions d'utilisation
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium">Intégré dans DataPull</span>
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
