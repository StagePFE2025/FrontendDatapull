import { useEffect, useRef } from "react"
import { X, Heart, MapPin, Clock, Phone, Globe } from "./Icons"
import "./modern-restaurant-details.css"

const RestaurantDetails = ({ restaurant, isFavorite, onClose, onFavoriteToggle, isDarkMode }) => {
  const cardRef = useRef(null)

  if (!restaurant) return null

  // Empêcher le défilement de la page quand le popup est ouvert
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  // Gestionnaire pour fermer quand on clique en dehors
  const handleOverlayClick = (e) => {
    if (cardRef.current && !cardRef.current.contains(e.target)) {
      onClose()
    }
  }

  const formatHours = (hours) => {
    if (!hours) return ""
    if (Array.isArray(hours)) {
      return hours.join(", ")
    } else if (typeof hours === "object" && hours.times) {
      return hours.times
    }
    return hours
  }

  // Fonction pour obtenir la couleur du score
  const getScoreColor = (score, isTrack = false) => {
    if (!score) return isTrack ? "#6b7280" : "#6b7280" // Gris par défaut

    const percentage = (score / 100) * 100 // Convertir le score sur 5 en pourcentage

    if (percentage < 30) return isTrack ? "#ef4444" : "#dc2626"
    if (percentage < 50) return isTrack ? "#f97316" : "#ea580c"
    if (percentage < 70) return isTrack ? "#eab308" : "#ca8a04"
    if (percentage < 85) return isTrack ? "#84cc16" : "#65a30d"
    return isTrack ? "#22c55e" : "#16a34a"
  }

  // Fonction pour obtenir la couleur du rating - CORRIGÉE
  const getRatingColor = (rating) => {
    if (!rating || rating === 0) return "#6b7280" // Gris pour rating nul ou 0

    if (rating >= 4.5) return "#34d399" // Vert émeraude
    if (rating >= 4.0) return "#10b981" // Vert moyen
    if (rating >= 3.5) return "#facc15" // Jaune vif
    if (rating >= 3.0) return "#fb923c" // Orange moderne
    return "#f87171" // Rouge doux
  }

  // Fonction pour déterminer si le restaurant est ouvert maintenant - CORRIGÉE
  const getOpenStatus = () => {
    // Si pas d'horaires dans l'API
    if (!restaurant.hours || !Array.isArray(restaurant.hours) || restaurant.hours.length === 0) {
      return { isOpen: null, text: "Horaires non disponibles", color: "#6b7280" }
    }

    const now = new Date()
    const currentDay = now.getDay() // 0 = Dimanche, 1 = Lundi, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes() // Minutes depuis minuit

    // Mapping des jours JS vers les noms français utilisés dans l'API
    const dayNamesMapping = {
      0: "dimanche",
      1: "lundi",
      2: "mardi",
      3: "mercredi",
      4: "jeudi",
      5: "vendredi",
      6: "samedi",
    }

    const currentDayName = dayNamesMapping[currentDay]

    // Trouver les horaires du jour actuel
    const todayHours = restaurant.hours.find((day) => day.day.toLowerCase() === currentDayName)

    if (!todayHours || !todayHours.times || todayHours.times.length === 0) {
      return { isOpen: false, text: "Fermé aujourd'hui", color: "#f87171" }
    }

    // Vérifier chaque créneau horaire du jour
    for (const timeSlot of todayHours.times) {
      if (typeof timeSlot === "string") {
        // Vérifier si c'est "Fermé"
        if (timeSlot.toLowerCase().includes("fermé") || timeSlot.toLowerCase().includes("ferme")) {
          return { isOpen: false, text: "Fermé aujourd'hui", color: "#f87171" }
        }

        // Parse les horaires comme "09:00–17:00"
        const timeMatch = timeSlot.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/)
        if (timeMatch) {
          const openHour = Number.parseInt(timeMatch[1])
          const openMinute = Number.parseInt(timeMatch[2])
          const closeHour = Number.parseInt(timeMatch[3])
          const closeMinute = Number.parseInt(timeMatch[4])

          const openTime = openHour * 60 + openMinute
          let closeTime = closeHour * 60 + closeMinute

          // Gérer le cas où le restaurant ferme après minuit (ex: 02:00)
          if (closeTime < openTime) {
            closeTime += 24 * 60 // Ajouter 24h
            // Si on est après minuit, ajuster l'heure actuelle
            const adjustedCurrentTime = currentTime < 12 * 60 ? currentTime + 24 * 60 : currentTime
            if (adjustedCurrentTime >= openTime || currentTime <= closeTime - 24 * 60) {
              return { isOpen: true, text: "Ouvert maintenant", color: "#34d399" }
            }
          } else {
            // Cas normal (fermeture le même jour)
            if (currentTime >= openTime && currentTime < closeTime) {
              return { isOpen: true, text: "Ouvert maintenant", color: "#34d399" }
            }
          }
        }
      }
    }

    return { isOpen: false, text: "Fermé maintenant", color: "#f87171" }
  }

  const openStatus = getOpenStatus()

  return (
    <div className={`modern-restaurant-overlay ${isDarkMode ? "dark" : ""}`} onClick={handleOverlayClick}>
      <div ref={cardRef} className="modern-restaurant-modal">
        {/* Header avec image */}
        <div className="restaurant-header">
          <div className="header-image-container">
            <img
              src={restaurant.featuredImage || "https://fakeimg.pl/600x400?text=Image"}
              alt={restaurant.name}
              className="header-image"
              onError={(e) => (e.target.src = "https://fakeimg.pl/600x400?text=Image")}
            />
            <div className="image-overlay"></div>
          </div>

          {/* Boutons d'action */}
          <div className="header-actions">
            <button className="action-button favorite-button" onClick={onFavoriteToggle}>
              <Heart size={20} fill={isFavorite ? "#f43f5e" : "none"} />
            </button>
            <button className="action-button close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Informations principales */}
          <div className="header-info">
            <h2 className="restaurant-title">{restaurant.name}</h2>

            <div className="rating-section">
              {restaurant.rating && restaurant.rating > 0 ? (
                <span className="rating-badge" style={{ backgroundColor: getRatingColor(restaurant.rating) }}>
                  {restaurant.rating} ★
                </span>
              ) : (
                <span className="rating-badge no-rating">Pas de note</span>
              )}
              <span className="rating-text">({restaurant.reviews || 0} avis)</span>

              {restaurant.score && (
                <span className="score-badge" style={{ backgroundColor: getScoreColor(restaurant.score) }}>
                  Score: {restaurant.score}
                </span>
              )}
            </div>

            {restaurant.mainCategory && <div className="category-badge">{restaurant.mainCategory}</div>}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="restaurant-content">
          {/* Description */}
          {restaurant.description && (
            <div className="content-section description-section">
              <div className="description-text">{restaurant.description}</div>
            </div>
          )}

          {/* Informations de base */}
          <div className="content-section info-section">
            {/* Statut d'ouverture */}
            {restaurant.hours && restaurant.hours.length > 0 && (
              <div className="info-item status-item">
                <div className="info-icon">
                  <Clock size={20} style={{ color: openStatus.color }} />
                </div>
                <div className="info-content">
                  <span className="status-text" style={{ color: openStatus.color }}>
                    {openStatus.text}
                  </span>
                </div>
              </div>
            )}

            {/* Adresse */}
            {restaurant.address && (
              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-content">
                  <span className="info-text">{restaurant.address}</span>
                </div>
              </div>
            )}

            {/* Téléphone */}
            {restaurant.phone && (
              <div className="info-item">
                <div className="info-icon">
                  <Phone size={20} />
                </div>
                <div className="info-content">
                  <span className="info-text">{restaurant.phone}</span>
                </div>
              </div>
            )}

            {/* Site web */}
            {restaurant.website && (
              <div className="info-item">
                <div className="info-icon">
                  <Globe size={20} />
                </div>
                <div className="info-content">
                  <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="website-link">
                    {restaurant.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Horaires d'ouverture */}
          {restaurant.hours && Array.isArray(restaurant.hours) && (
            <div className="content-section hours-section">
              <h3 className="section-title text-gray-800 dark:text-gray-200">
                <Clock size={20} />
                Heures d'ouverture
              </h3>
              <div className="hours-list">
                {restaurant.hours.map((dayInfo, index) => {
                  const dayNamesMapping = {
                    dimanche: 0,
                    lundi: 1,
                    mardi: 2,
                    mercredi: 3,
                    jeudi: 4,
                    vendredi: 5,
                    samedi: 6,
                  }
                  const today = new Date().getDay()
                  const dayIndex = dayNamesMapping[dayInfo.day.toLowerCase()]
                  const isToday = today === dayIndex

                  return (
                    <div key={index} className={`day-hours ${isToday ? "today" : ""}`}>
                      <span className="day-name">{dayInfo.day}:</span>
                      <span className="day-times">
                        {dayInfo.times && dayInfo.times.length > 0 ? dayInfo.times.join(", ") : "Fermé"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Galerie d'images */}
          {restaurant.images && restaurant.images.length > 0 && (
            <div className="content-section images-section">
              <h3 className="section-title">Photos</h3>
              <div className="images-grid">
                {restaurant.images.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image.link || "/placeholder.svg"} alt={image.about || `Image ${index + 1}`} />
                    {image.about && <div className="image-label">{image.about}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section avis */}
          {(restaurant.reviewsPerRating || restaurant.reviewKeywords || restaurant.featuredReviews) && (
            <div className="content-section reviews-section">
              <h3 className="section-title">Avis clients</h3>

              {/* Répartition des notes */}
              {restaurant.reviewsPerRating && (
                <div className="ratings-breakdown">
                  {Object.entries(restaurant.reviewsPerRating)
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map(([rating, count]) => (
                      <div key={rating} className="rating-bar">
                        <span className="rating-label">{rating} ★</span>
                        <div className="rating-bar-container">
                          <div
                            className="rating-bar-fill"
                            style={{
                              width: `${count > 0 ? (count / restaurant.reviews) * 100 : 0}%`,
                              backgroundColor: count > 0 ? getRatingColor(rating) : "transparent",
                            }}
                          ></div>
                        </div>
                        <span className="rating-count">{count}</span>
                      </div>
                    ))}
                </div>
              )}

              {/* Mots-clés */}
              {restaurant.reviewKeywords && restaurant.reviewKeywords.length > 0 && (
                <div className="review-keywords">
                  <h4 className="keywords-title">Mots-clés fréquents :</h4>
                  <div className="keywords-list">
                    {restaurant.reviewKeywords.slice(0, 10).map((keyword, index) => (
                      <span key={index} className="keyword-tag">
                        {keyword.keyword} ({keyword.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Avis en vedette */}
              {restaurant.featuredReviews && restaurant.featuredReviews.length > 0 && (
                <div className="featured-reviews">
                  <h4 className="featured-reviews-title">Avis en vedette</h4>
                  <div className="reviews-list">
                    {restaurant.featuredReviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">{review.name ? review.name.charAt(0) : "?"}</div>
                            <div className="reviewer-details">
                              <div className="reviewer-name">
                                {review.name}
                                {review.isLocalGuide && <span className="local-guide-badge">Guide local</span>}
                              </div>
                              <div className="review-date">{review.publishedAt}</div>
                            </div>
                          </div>
                          <div className="review-rating" style={{ backgroundColor: getRatingColor(review.rating) }}>
                            {review.rating}
                          </div>
                        </div>

                        <div className="review-content">
                          {review.reviewText ||
                            (review.reviewTranslatedText && `${review.reviewTranslatedText} (traduit)`)}
                        </div>

                        {review.reviewPhotos && review.reviewPhotos.length > 0 && (
                          <div className="review-photos">
                            {review.reviewPhotos.slice(0, 3).map((photo, photoIndex) => (
                              <div key={photoIndex} className="review-photo">
                                <img src={photo.url || "/placeholder.svg"} alt={`Photo par ${review.name}`} />
                              </div>
                            ))}
                          </div>
                        )}

                        {review.responseFromOwnerText && (
                          <div className="owner-response">
                            <div className="response-header">
                              <div className="response-title">Réponse du propriétaire</div>
                              <div className="response-date">{review.responseFromOwnerAgo}</div>
                            </div>
                            <div className="response-content">
                              {review.responseFromOwnerTranslatedText || review.responseFromOwnerText}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {restaurant.reviewsLink && (
                    <div className="reviews-link-container">
                      <a
                        href={restaurant.reviewsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reviews-link"
                      >
                        Voir tous les avis
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Localisation */}
          {restaurant.plusCode && (
            <div className="content-section location-section">
              <h3 className="section-title">Localisation</h3>
              <div className="location-info1">
                {restaurant.plusCode && (
                  <div className="location-item">
                    <span className="location-label">Plus Code :</span>
                    <span className="location-value">{restaurant.plusCode}</span>
                  </div>
                )}
                {restaurant.coordinates && (
                  <div className="location-item">
                    <span className="location-label">Coordonnées :</span>
                    <span className="location-value">
                      {restaurant.coordinates.lat}, {restaurant.coordinates.lon}
                    </span>
                  </div>
                )}
                <a
                  href={
                    restaurant.link ||
                    `https://www.google.com/maps/search/?api=1&query=${restaurant.coordinates?.lat},${restaurant.coordinates?.lon}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="maps-link"
                >
                  Voir sur Google Maps
                </a>
              </div>
            </div>
          )}

          {/* Concurrents */}
          {restaurant.competitors && restaurant.competitors.length > 0 && (
            <div className="content-section competitors-section">
              <h3 className="section-title">Autres boutiques similaires à proximité</h3>
              <div className="competitors-list">
                {restaurant.competitors.slice(0, 3).map((competitor, index) => (
                  <div key={index} className="competitor-item">
                    <div className="competitor-header">
                      <span className="competitor-name">{competitor.name}</span>
                      <span className="competitor-rating" style={{ color: getRatingColor(competitor.rating) }}>
                        {competitor.rating} ★<span className="competitor-reviews">({competitor.reviews})</span>
                      </span>
                    </div>
                    {competitor.mainCategory && <div className="competitor-category">{competitor.mainCategory}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services disponibles */}
          {restaurant.about && restaurant.about.length > 0 && (
            <div className="content-section services-section">
              <h3 className="section-title">Services disponibles</h3>
              <div className="services-list">
                {restaurant.about.map((section, index) => (
                  <div key={index} className="service-section">
                    <h4 className="service-section-title">{section.name}</h4>
                    <div className="service-options">
                      {section.options &&
                        section.options
                          .filter((option) => option.enabled)
                          .map((option, optIndex) => (
                            <div key={optIndex} className="service-option">
                              <span className="option-icon">✓</span>
                              <span className="option-name">{option.name}</span>
                            </div>
                          ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="action-buttons">
            <button className="action-btn close-btn" onClick={onClose}>
              Fermer
            </button>
            {restaurant.website && (
              <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="action-btn website-btn">
                <Globe size={18} />
                Visiter le site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetails
