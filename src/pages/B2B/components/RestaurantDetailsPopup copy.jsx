import React, { useEffect, useRef } from "react";
import { X, Heart, MapPin, Clock, Phone, Globe } from "./Icons";

// Importation de la police moderne (Inter)
const RestaurantDetails = ({
  restaurant,
  isFavorite,
  onClose,
  onFavoriteToggle,
  isDarkMode,
}) => {
  if (!restaurant) return null;

  const cardRef = useRef(null);

  // Empêcher le défilement de la page quand le popup est ouvert
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Gestionnaire pour fermer quand on clique en dehors
  const handleOverlayClick = (e) => {
    if (cardRef.current && !cardRef.current.contains(e.target)) {
      onClose();
    }
  };

  const formatHours = (hours) => {
    if (!hours) return "";
    if (Array.isArray(hours)) {
      return hours.join(", ");
    } else if (typeof hours === "object" && hours.times) {
      return hours.times;
    }
    return hours;
  };

  // Fonction pour obtenir la couleur du score
  const getScoreColor = (score, isTrack = false) => {
    if (!score) return isTrack ? '#6b7280' : '#6b7280'; // Gris par défaut
    
    const percentage = (score / 100) * 100; // Convertir le score sur 5 en pourcentage
    
    if (percentage < 30) return isTrack ? '#ef4444' : '#dc2626';
    if (percentage < 50) return isTrack ? '#f97316' : '#ea580c';
    if (percentage < 70) return isTrack ? '#eab308' : '#ca8a04';
    if (percentage < 85) return isTrack ? '#84cc16' : '#65a30d';
    return isTrack ? '#22c55e' : '#16a34a';
  };

  // Fonction pour obtenir la couleur du rating - CORRIGÉE
  const getRatingColor = (rating) => {
    if (!rating || rating === 0) return "#6b7280"; // Gris pour rating nul ou 0
    
    if (rating >= 4.5) return "#34d399"; // Vert émeraude
    if (rating >= 4.0) return "#10b981"; // Vert moyen
    if (rating >= 3.5) return "#facc15"; // Jaune vif
    if (rating >= 3.0) return "#fb923c"; // Orange moderne
    return "#f87171"; // Rouge doux
  };

  // Fonction pour déterminer si le restaurant est ouvert maintenant - CORRIGÉE
  const getOpenStatus = () => {
    // Si pas d'horaires dans l'API
    if (!restaurant.hours || !Array.isArray(restaurant.hours) || restaurant.hours.length === 0) {
      return { isOpen: null, text: "Horaires non disponibles", color: "#6b7280" };
    }

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes depuis minuit
    
    // Mapping des jours JS vers les noms français utilisés dans l'API
    const dayNamesMapping = {
      0: 'dimanche',
      1: 'lundi', 
      2: 'mardi',
      3: 'mercredi',
      4: 'jeudi',
      5: 'vendredi',
      6: 'samedi'
    };
    
    const currentDayName = dayNamesMapping[currentDay];
    
    // Trouver les horaires du jour actuel
    const todayHours = restaurant.hours.find(day => day.day.toLowerCase() === currentDayName);
    
    if (!todayHours || !todayHours.times || todayHours.times.length === 0) {
      return { isOpen: false, text: "Fermé aujourd'hui", color: "#f87171" };
    }

    // Vérifier chaque créneau horaire du jour
    for (const timeSlot of todayHours.times) {
      if (typeof timeSlot === 'string') {
        // Vérifier si c'est "Fermé"
        if (timeSlot.toLowerCase().includes('fermé') || timeSlot.toLowerCase().includes('ferme')) {
          return { isOpen: false, text: "Fermé aujourd'hui", color: "#f87171" };
        }
        
        // Parse les horaires comme "09:00–17:00"
        const timeMatch = timeSlot.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const openHour = parseInt(timeMatch[1]);
          const openMinute = parseInt(timeMatch[2]);
          const closeHour = parseInt(timeMatch[3]);
          const closeMinute = parseInt(timeMatch[4]);
          
          const openTime = openHour * 60 + openMinute;
          let closeTime = closeHour * 60 + closeMinute;
          
          // Gérer le cas où le restaurant ferme après minuit (ex: 02:00)
          if (closeTime < openTime) {
            closeTime += 24 * 60; // Ajouter 24h
            // Si on est après minuit, ajuster l'heure actuelle
            const adjustedCurrentTime = currentTime < 12 * 60 ? currentTime + 24 * 60 : currentTime;
            if (adjustedCurrentTime >= openTime || currentTime <= closeTime - 24 * 60) {
              return { isOpen: true, text: "Ouvert maintenant", color: "#34d399" };
            }
          } else {
            // Cas normal (fermeture le même jour)
            if (currentTime >= openTime && currentTime < closeTime) {
              return { isOpen: true, text: "Ouvert maintenant", color: "#34d399" };
            }
          }
        }
      }
    }
    
    return { isOpen: false, text: "Fermé maintenant", color: "#f87171" };
  };

  const openStatus = getOpenStatus();

  return (
    <div
      className="popup-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 5000,
        backdropFilter: "blur(8px)",
        padding: "24px",
      }}
      onClick={handleOverlayClick}
    >
      <div
        ref={cardRef}
        className="restaurant-details"
        style={{
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "120vh",
          backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: isDarkMode
            ? "0 12px 30px rgba(0, 0, 0, 0.6)"
            : "0 12px 30px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          animation: "slideIn 0.4s ease-out",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          className="details-header"
          style={{
            position: "relative",
            height: "280px",
            width: "100%",
          }}
        >
          <img
            src={restaurant.featuredImage || "https://fakeimg.pl/600x400?text=Image"}
            alt={restaurant.name}
            className="details-image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transition: "transform 0.3s ease",
            }}
            onError={(e) => (e.target.src = "https://fakeimg.pl/600x400?text=Image")}
          />
          <div
            className="image-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8))",
            }}
          ></div>

          <button
            className="details-close-button"
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.9)",
              color: isDarkMode ? "#ffffff" : "#1f2937",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
          >
            <X size={20} />
          </button>

          <button
            className="details-favorite-button"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            style={{
              position: "absolute",
              top: "16px",
              right: "64px",
              backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.9)",
              color: isFavorite ? "#f43f5e" : isDarkMode ? "#ffffff" : "#1f2937",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
          >
            <Heart size={20} fill={isFavorite ? "#f43f5e" : "none"} />
          </button>

          <div
            className="details-header-info"
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              color: "#ffffff",
              zIndex: 10,
              width: "calc(100% - 140px)",
            }}
          >
            <h2
              className="details-title"
              style={{
                margin: "0 0 12px 0",
                fontSize: "32px",
                fontWeight: "700",
                textShadow: "0 2px 6px rgba(0, 0, 0, 0.6)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {restaurant.name}
            </h2>

            <div
              className="details-rating"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "0 0 8px 0",
              }}
            >
              {/* CORRECTION: Afficher le badge seulement si rating > 0 */}
              {restaurant.rating && restaurant.rating > 0 ? (
                <span
                  className="rating-badge"
                  style={{
                    backgroundColor: getRatingColor(restaurant.rating),
                    color: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: "55px",
                    fontWeight: "700",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {restaurant.rating} ★
                </span>
              ) : (
                <span
                  className="rating-badge"
                  style={{
                    backgroundColor: "#6b7280",
                    color: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: "55px",
                    fontWeight: "700",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Pas de note
                </span>
              )}
              <span
                className="rating-text"
                style={{
                  fontSize: "15px",
                  opacity: 0.95,
                }}
              >
                ({restaurant.reviews || 0} avis)
              </span>
              
              {/* Affichage du score si disponible */}
              {restaurant.score && (
                <span
                  className="score-badge"
                  style={{
                    backgroundColor: getScoreColor(restaurant.score),
                    color: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: "55px",
                    fontWeight: "700",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginLeft: "auto",
                  }}
                >
                  Score: {restaurant.score}
                </span>
              )}
            </div>

            {restaurant.mainCategory && (
              <div
                className="details-category"
                style={{
                  fontSize: "15px",
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  display: "inline-block",
                  maxWidth: "fit-content",
                  fontWeight: "500",
                }}
              >
                {restaurant.mainCategory}
              </div>
            )}
          </div>
        </div>

        <div
          className="details-content"
          style={{
            padding: "24px",
            overflowY: "auto",
            color: isDarkMode ? "#e5e7eb" : "#1f2937",
            flex: 1,
            maxHeight: "calc(92vh - 280px)",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        >
          {restaurant.description && (
            <div
              className="details-description"
              style={{
                padding: "16px 20px",
                backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)",
                borderRadius: "12px",
                marginBottom: "24px",
                fontSize: "16px",
                fontStyle: "normal",
                borderLeft: isDarkMode ? "4px solid rgba(255, 255, 255, 0.15)" : "4px solid rgba(0, 0, 0, 0.15)",
                transition: "background-color 0.3s ease",
              }}
            >
              {restaurant.description}
            </div>
          )}

          <div
            className="details-info-section"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {/* Statut basé sur les horaires - Afficher seulement si horaires disponibles */}
            {restaurant.hours && restaurant.hours.length > 0 && (
              <div
                className="details-status"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 20px",
                  backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)",
                  borderRadius: "12px",
                }}
              >
                <Clock size={20} style={{ color: openStatus.color }} />
                <p
                  className="details-info-text status-text"
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "600",
                    color: openStatus.color,
                  }}
                >
                  {openStatus.text}
                </p>
              </div>
            )}

            {restaurant.address && (
              <div
                className="details-address"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px 20px",
                  backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)",
                  borderRadius: "12px",
                }}
              >
                <MapPin size={20} style={{ color: isDarkMode ? "#e5e7eb" : "#4b5563", minWidth: "20px", marginTop: "2px" }} />
                <p
                  className="details-info-text"
                  style={{
                    margin: 0,
                    fontSize: "16px",
                  }}
                >
                  {restaurant.address}
                </p>
              </div>
            )}

            {restaurant.phone && (
              <div
                className="details-phone"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 20px",
                  backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)",
                  borderRadius: "12px",
                }}
              >
                <Phone size={20} style={{ color: isDarkMode ? "#e5e7eb" : "#4b5563" }} />
                <p
                  className="details-info-text"
                  style={{
                    margin: 0,
                    fontSize: "16px",
                  }}
                >
                  {restaurant.phone}
                </p>
              </div>
            )}

            {restaurant.website && (
              <div
                className="details-website"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 20px",
                  backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)",
                  borderRadius: "12px",
                }}
              >
                <Globe size={20} style={{ color: isDarkMode ? "#e5e7eb" : "#4b5563" }} />
                <p
                  className="details-info-text"
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    wordBreak: "break-all",
                  }}
                >
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#3b82f6",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    {restaurant.website}
                  </a>
                </p>
              </div>
            )}

            {restaurant.hours && Array.isArray(restaurant.hours) && (
              <div
                className="details-hours"
                style={{
                  padding: "12px 20px",
                  backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <Clock
                    size={20}
                    style={{
                      color: isDarkMode ? "#e5e7eb" : "#4b5563",
                      minWidth: "20px",
                      marginTop: "2px",
                    }}
                  />
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Heures d'ouverture
                  </h4>
                </div>
                <div
                  className="hours-list"
                  style={{
                    marginLeft: "32px",
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  {restaurant.hours.map((dayInfo, index) => {
                    const dayNamesMapping = {
                      'dimanche': 0, 'lundi': 1, 'mardi': 2, 'mercredi': 3,
                      'jeudi': 4, 'vendredi': 5, 'samedi': 6
                    };
                    const today = new Date().getDay();
                    const dayIndex = dayNamesMapping[dayInfo.day.toLowerCase()];
                    const isToday = today === dayIndex;

                    return (
                      <div
                        key={index}
                        className="day-hours"
                        style={{
                          display: "flex",
                          fontSize: "15px",
                          padding: isToday ? "6px 12px" : "4px 0",
                          backgroundColor: isToday ? (isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.07)") : "transparent",
                          borderRadius: isToday ? "8px" : "0",
                          color: isToday ? (isDarkMode ? "#ffffff" : "#1f2937") : (isDarkMode ? "#e5e7eb" : "#4b5563"),
                        }}
                      >
                        <span
                          className="day-name"
                          style={{
                            fontWeight: isToday ? "600" : "500",
                            width: "110px",
                            flexShrink: 0,
                            textTransform: "capitalize",
                          }}
                        >
                          {dayInfo.day}:
                        </span>
                        <span
                          className="day-times"
                          style={{
                            fontWeight: isToday ? "600" : "500",
                          }}
                        >
                          {dayInfo.times && dayInfo.times.length > 0 ? dayInfo.times.join(", ") : "Fermé"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {restaurant.images && restaurant.images.length > 0 && (
            <div
              className="details-images-section"
              style={{
                marginBottom: "32px",
                padding: "20px",
                backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                borderRadius: "12px",
              }}
            >
              <h3
                className="section-title"
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginTop: 0,
                  marginBottom: "16px",
                  color: isDarkMode ? "#e5e7eb" : "#1f2937",
                }}
              >
                Photos
              </h3>

              <div
                className="images-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "16px",
                }}
              >
                {restaurant.images.map((image, index) => (
                  <div
                    key={index}
                    className="image-item"
                    style={{
                      height: "140px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      position: "relative",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <img
                      src={image.link}
                      alt={image.about || `Image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                    />
                    {image.about && (
                      <div
                        className="image-label"
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "6px 10px",
                          backgroundColor: "rgba(0, 0, 0, 0.75)",
                          color: "white",
                          fontSize: "12px",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {image.about}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(restaurant.reviewsPerRating || restaurant.reviewKeywords || restaurant.featuredReviews) && (
            <div
              className="details-review-section"
              style={{
                marginBottom: "32px",
                padding: "20px",
                backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                borderRadius: "12px",
              }}
            >
              <h3
                className="section-title"
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginTop: 0,
                  marginBottom: "16px",
                  color: isDarkMode ? "#e5e7eb" : "#1f2937",
                }}
              >
                Avis clients
              </h3>

              {restaurant.reviewsPerRating && (
                <div
                  className="ratings-breakdown"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  {Object.entries(restaurant.reviewsPerRating)
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map(([rating, count]) => (
                      <div
                        key={rating}
                        className="rating-bar"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <span
                          className="rating-label"
                          style={{
                            width: "40px",
                            fontSize: "15px",
                            textAlign: "right",
                          }}
                        >
                          {rating} ★
                        </span>
                        <div
                          className="rating-bar-container"
                          style={{
                            flex: 1,
                            height: "10px",
                            backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)",
                            borderRadius: "5px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            className="rating-bar-fill"
                            style={{
                              width: `${count > 0 ? (count / restaurant.reviews) * 100 : 0}%`,
                              height: "100%",
                              backgroundColor: count > 0 ? getRatingColor(rating) : "transparent",
                              borderRadius: "5px",
                              transition: "width 0.5s ease",
                            }}
                          ></div>
                        </div>
                        <span
                          className="rating-count"
                          style={{
                            width: "40px",
                            fontSize: "15px",
                          }}
                        >
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {restaurant.reviewKeywords && restaurant.reviewKeywords.length > 0 && (
                <div
                  className="review-keywords"
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <h4
                    className="keywords-title"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginTop: 0,
                      marginBottom: "12px",
                      color: isDarkMode ? "#e5e7eb" : "#1f2937",
                    }}
                  >
                    Mots-clés fréquents :
                  </h4>
                  <div
                    className="keywords-list"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    {restaurant.reviewKeywords.slice(0, 10).map((keyword, index) => (
                      <span
                        key={index}
                        className="keyword-tag"
                        style={{
                          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.06)",
                          color: isDarkMode ? "#e5e7eb" : "#4b5563",
                          padding: "6px 14px",
                          borderRadius: "999px",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {keyword.keyword} ({keyword.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {restaurant.featuredReviews && restaurant.featuredReviews.length > 0 && (
                <div
                  className="featured-reviews"
                  style={{
                    marginTop: "24px",
                  }}
                >
                  <h4
                    className="featured-reviews-title"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginTop: 0,
                      marginBottom: "16px",
                      color: isDarkMode ? "#e5e7eb" : "#1f2937",
                    }}
                  >
                    Avis en vedette
                  </h4>

                  <div
                    className="reviews-list"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    {restaurant.featuredReviews.slice(0, 3).map((review, index) => (
                      <div
                        key={index}
                        className="review-card"
                        style={{
                          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 1)",
                          borderRadius: "12px",
                          padding: "20px",
                          boxShadow: isDarkMode ? "0 2px 6px rgba(0, 0, 0, 0.2)" : "0 2px 6px rgba(0, 0, 0, 0.05)",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                      >
                        <div
                          className="review-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "12px",
                          }}
                        >
                          <div
                            className="reviewer-info"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              className="reviewer-avatar"
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "600",
                                color: isDarkMode ? "#e5e7eb" : "#4b5563",
                                fontSize: "16px",
                              }}
                            >
                              {review.name ? review.name.charAt(0) : "?"}
                            </div>
                            <div>
                              <div
                                className="reviewer-name"
                                style={{
                                  fontWeight: "600",
                                  fontSize: "15px",
                                }}
                              >
                                {review.name}
                                {review.isLocalGuide && (
                                  <span
                                    style={{
                                      marginLeft: "8px",
                                      fontSize: "13px",
                                      backgroundColor: "#4f46e5",
                                      color: "white",
                                      padding: "3px 8px",
                                      borderRadius: "6px",
                                    }}
                                  >
                                    Guide local
                                  </span>
                                )}
                              </div>
                              <div
                                className="review-date"
                                style={{
                                  fontSize: "13px",
                                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                                }}
                              >
                                {review.publishedAt}
                              </div>
                            </div>
                          </div>
                          <div
                            className="review-rating"
                            style={{
                              backgroundColor: getRatingColor(review.rating),
                              color: "white",
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "600",
                              fontSize: "15px",
                            }}
                          >
                            {review.rating}
                          </div>
                        </div>

                        <div
                          className="review-content"
                          style={{
                            fontSize: "15px",
                            lineHeight: "1.6",
                            margin: "12px 0",
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                          }}
                        >
                          {review.reviewText || (review.reviewTranslatedText && `${review.reviewTranslatedText} (traduit)`)}
                        </div>

                        {review.reviewPhotos && review.reviewPhotos.length > 0 && (
                          <div
                            className="review-photos"
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginTop: "12px",
                              overflowX: "auto",
                              padding: "6px 0",
                            }}
                          >
                            {review.reviewPhotos.slice(0, 3).map((photo, photoIndex) => (
                              <div
                                key={photoIndex}
                                className="review-photo"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  flexShrink: 0,
                                }}
                              >
                                <img
                                  src={photo.url}
                                  alt={`Photo par ${review.name}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {review.responseFromOwnerText && (
                          <div
                            className="owner-response"
                            style={{
                              marginTop: "16px",
                              padding: "14px",
                              backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                              borderRadius: "8px",
                              fontSize: "14px",
                            }}
                          >
                            <div
                              className="response-header"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "8px",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "600",
                                  fontSize: "14px",
                                }}
                              >
                                Réponse du propriétaire
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                                  marginLeft: "10px",
                                }}
                              >
                                {review.responseFromOwnerAgo}
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: "14px",
                                lineHeight: "1.5",
                                color: isDarkMode ? "#d1d5db" : "#4b5563",
                              }}
                            >
                              {review.responseFromOwnerTranslatedText || review.responseFromOwnerText}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {restaurant.reviewsLink && (
                    <div
                      style={{
                        marginTop: "16px",
                        textAlign: "center",
                      }}
                    >
                      <a
                        href={restaurant.reviewsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#3b82f6",
                          fontSize: "15px",
                          textDecoration: "none",
                          display: "inline-block",
                          padding: "8px 20px",
                          borderRadius: "999px",
                          backgroundColor: isDarkMode ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)",
                          transition: "background-color 0.3s, transform 0.3s",
                          fontWeight: "500",
                        }}
                      >
                        Voir tous les avis
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {restaurant.plusCode && (
            <div
              className="details-map-section"
              style={{
                marginBottom: "32px",
                padding: "20px",
                backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                borderRadius: "12px",
              }}
            >
              <h3
                className="section-title"
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginTop: 0,
                  marginBottom: "16px",
                  color: isDarkMode ? "#e5e7eb" : "#1f2937",
                }}
              >
                Localisation
              </h3>

              <div
                className="map-info"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {restaurant.plusCode && (
                  <div
                    className="plus-code"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                      borderRadius: "8px",
                      fontSize: "15px",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>Plus Code :</span>
                    <span>{restaurant.plusCode}</span>
                  </div>
                )}

                {restaurant.coordinates && (
                  <div
                    className="coordinates"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                      borderRadius: "8px",
                      fontSize: "15px",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>Coordonnées :</span>
                    <span>{restaurant.coordinates.lat}, {restaurant.coordinates.lon}</span>
                  </div>
                )}

                <a
                  href={restaurant.link || `https://www.google.com/maps/search/?api=1&query=${restaurant.coordinates?.lat},${restaurant.coordinates?.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "15px",
                    fontWeight: "500",
                    textAlign: "center",
                    marginTop: "12px",
                    display: "block",
                    transition: "background-color 0.3s, transform 0.3s",
                  }}
                >
                  Voir sur Google Maps
                </a>
              </div>
            </div>
          )}

          {restaurant.competitors && restaurant.competitors.length > 0 && (
            <div
              className="details-competitors-section"
              style={{
                marginBottom: "32px",
                padding: "20px",
                backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                borderRadius: "12px",
              }}
            >
              <h3
                className="section-title"
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginTop: 0,
                  marginBottom: "16px",
                  color: isDarkMode ? "#e5e7eb" : "#1f2937",
                }}
              >
                Autres boutiques similaires à proximité
              </h3>
              <div
                className="competitors-list"
                style={{
                  display: "grid",
                  gap: "16px",
                }}
              >
                {restaurant.competitors.slice(0, 3).map((competitor, index) => (
                  <div
                    key={index}
                    className="competitor-item"
                    style={{
                      padding: "16px",
                      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "white",
                      borderRadius: "10px",
                      boxShadow: isDarkMode ? "0 2px 6px rgba(0, 0, 0, 0.2)" : "0 2px 6px rgba(0, 0, 0, 0.05)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                  >
                    <div
                      className="competitor-header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        className="competitor-name"
                        style={{
                          fontWeight: "600",
                          fontSize: "16px",
                        }}
                      >
                        {competitor.name}
                      </span>
                      <span
                        className="competitor-rating"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "15px",
                          color: getRatingColor(competitor.rating),
                        }}
                      >
                        {competitor.rating} ★
                        <span
                          className="competitor-reviews"
                          style={{
                            fontSize: "14px",
                            color: isDarkMode ? "#d1d5db" : "#6b7280",
                          }}
                        >
                          ({competitor.reviews})
                        </span>
                      </span>
                    </div>
                    {competitor.mainCategory && (
                      <div
                        className="competitor-category"
                        style={{
                          fontSize: "14px",
                          color: isDarkMode ? "#d1d5db" : "#6b7280",
                        }}
                      >
                        {competitor.mainCategory}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {restaurant.about && restaurant.about.length > 0 && (
            <div
              className="details-about-section"
              style={{
                marginBottom: "32px",
                padding: "20px",
                backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                borderRadius: "12px",
              }}
            >
              <h3
                className="section-title"
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginTop: 0,
                  marginBottom: "16px",
                  color: isDarkMode ? "#e5e7eb" : "#1f2937",
                }}
              >
                Services disponibles
              </h3>
              <div
                className="about-list"
                style={{
                  display: "grid",
                  gap: "20px",
                }}
              >
                {restaurant.about.map((section, index) => (
                  <div key={index} className="about-section">
                    <h4
                      className="about-section-title"
                      style={{
                        fontSize: "17px",
                        fontWeight: "600",
                        marginTop: 0,
                        marginBottom: "12px",
                        color: isDarkMode ? "#e5e7eb" : "#374151",
                      }}
                    >
                      {section.name}
                    </h4>
                    <div
                      className="about-options"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: "10px",
                      }}
                    >
                      {section.options &&
                        section.options
                          .filter((option) => option.enabled)
                          .map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className="about-option"
                              style={{
                                fontSize: "15px",
                                color: isDarkMode ? "#d1d5db" : "#4b5563",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span
                                className="option-icon"
                                style={{
                                  color: "#34d399",
                                  fontSize: "18px",
                                }}
                              >
                                ✓
                              </span>
                              <span>{option.name}</span>
                            </div>
                          ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className="details-actions"
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "24px",
              padding: "0 20px 20px",
            }}
          >
            <button
              className="details-button close-button"
              onClick={onClose}
              style={{
                padding: "12px 24px",
                backgroundColor: isDarkMode ? "#4b5563" : "#e5e7eb",
                color: isDarkMode ? "#e5e7eb" : "#1f2937",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "15px",
                transition: "background-color 0.3s, transform 0.3s",
                flex: 1,
                maxWidth: "180px",
              }}
            >
              Fermer
            </button>

            {restaurant.website && (
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="details-button website-button"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "15px",
                  transition: "background-color 0.3s, transform 0.3s",
                  textDecoration: "none",
                  textAlign: "center",
                  flex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Globe size={18} />
                Visiter le site
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .details-close-button:hover,
        .details-favorite-button:hover {
          transform: scale(1.15);
          background-color: ${isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 1)"};
        }

        .details-close-button:active,
        .details-favorite-button:active {
          transform: scale(0.95);
        }

        .details-content {
          scrollbar-width: thin;
          scrollbar-color: ${isDarkMode ? "#6b7280 #1f2937" : "#d1d5db #f8fafc"};
        }

        .details-content::-webkit-scrollbar {
          width: 10px;
        }

        .details-content::-webkit-scrollbar-track {
          background: ${isDarkMode ? "#1f2937" : "#f8fafc"};
        }

        .details-content::-webkit-scrollbar-thumb {
          background-color: ${isDarkMode ? "#6b7280" : "#d1d5db"};
          border-radius: 20px;
          border: 2px solid ${isDarkMode ? "#1f2937" : "#f8fafc"};
        }

        .image-item:hover {
          transform: scale(1.05);
        }

        .image-item img:hover {
          transform: scale(1.1);
        }

        .competitor-item:hover {
          transform: translateY(-4px);
          box-shadow: ${isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.15)"};
        }

        .review-card:hover {
          transform: translateY(-4px);
          box-shadow: ${isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.15)"};
        }

        .details-button.close-button:hover {
          background-color: ${isDarkMode ? "#6b7280" : "#d1d5db"};
          transform: translateY(-2px);
        }

        .details-button.website-button:hover,
        .details-map-section a:hover,
        .details-review-section a:hover {
          background-color: #2563eb;
          transform: translateY(-2px);
        }

        @media (max-width: 1000px) {
          .restaurant-details {
            max-width: 100%;
            margin: 16px;
          }

          .details-header {
            height: 220px;
          }

          .details-title {
            font-size: 24px !important;
          }

          .details-content {
            padding: 16px;
          }

          .images-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
          }

          .image-item {
            height: 100px !important;
          }

          .details-actions {
            flex-direction: column;
          }

          .details-button,
          .details-button.website-button {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RestaurantDetails;