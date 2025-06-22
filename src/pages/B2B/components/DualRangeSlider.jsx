import React, { useState, useRef, useCallback, useMemo } from 'react';
import './style2.css';

const DualRangeSlider = ({ 
  min = 0, 
  max = 100, 
  step = 1, 
  value = [0, 100], 
  onChange, 
  disabled = false,
  isDarkMode = false,
  label = "",
  unit = "",
  colorMode = "gradient", // "gradient", "rating", "score", "performance"
  showStepMarkers = true // Nouvelle prop pour afficher/masquer les marqueurs
}) => {
  const [isDragging, setIsDragging] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const sliderRef = useRef(null);

  // Fonction pour calculer les couleurs basées sur les valeurs
  const getColorFromValue = useCallback((val, isTrack = false) => {
    const percentage = ((val - min) / (max - min)) * 100;
    
    switch (colorMode) {
      case "rating":
        // Pour les notes : rouge (mauvais) → jaune → vert (excellent)
        if (percentage < 20) return isTrack ? '#ef4444' : '#dc2626'; // Rouge
        if (percentage < 40) return isTrack ? '#f97316' : '#ea580c'; // Orange
        if (percentage < 60) return isTrack ? '#eab308' : '#ca8a04'; // Jaune
        if (percentage < 80) return isTrack ? '#84cc16' : '#65a30d'; // Lime
        return isTrack ? '#22c55e' : '#16a34a'; // Vert
        
      case "score":
        // Pour les scores : rouge → orange → vert
        if (percentage < 30) return isTrack ? '#ef4444' : '#dc2626';
        if (percentage < 50) return isTrack ? '#f97316' : '#ea580c';
        if (percentage < 70) return isTrack ? '#eab308' : '#ca8a04';
        if (percentage < 85) return isTrack ? '#84cc16' : '#65a30d';
        return isTrack ? '#22c55e' : '#16a34a';
        
      case "performance":
        // Pour la performance : dégradé bleu → violet → rose
        if (percentage < 25) return isTrack ? '#3b82f6' : '#2563eb';
        if (percentage < 50) return isTrack ? '#6366f1' : '#4f46e5';
        if (percentage < 75) return isTrack ? '#8b5cf6' : '#7c3aed';
        return isTrack ? '#ec4899' : '#db2777';
        
      case "gradient":
      default:
        // Dégradé par défaut : bleu → violet → rose
        const r = Math.round(59 + (percentage * 1.96)); // 59 → 255
        const g = Math.round(130 - (percentage * 0.58)); // 130 → 72
        const b = Math.round(246 - (percentage * 0.97)); // 246 → 153
        return `rgb(${r}, ${g}, ${b})`;
    }
  }, [min, max, colorMode]);

  // Générer les valeurs de marqueurs basées sur le pas
  const stepMarkers = useMemo(() => {
    const markers = [];
    const stepCount = (max - min) / step;
    
    // Limiter le nombre de marqueurs pour éviter l'encombrement
    const maxMarkers = 20;
    const skipFactor = Math.ceil(stepCount / maxMarkers);
    
    for (let i = 0; i <= stepCount; i += skipFactor) {
      const stepValue = min + (i * step);
      if (stepValue <= max) {
        markers.push({
          value: stepValue,
          percentage: ((stepValue - min) / (max - min)) * 100,
          color: getColorFromValue(stepValue)
        });
      }
    }
    
    // S'assurer que la valeur max est incluse
    if (markers[markers.length - 1]?.value !== max) {
      markers.push({
        value: max,
        percentage: 100,
        color: getColorFromValue(max)
      });
    }
    
    return markers;
  }, [min, max, step, getColorFromValue]);

  // Couleurs dynamiques basées sur la valeur moyenne
  const colors = useMemo(() => {
    const avgValue = (value[0] + value[1]) / 2;
    const minColor = getColorFromValue(value[0]);
    const maxColor = getColorFromValue(value[1]);
    const trackColor = getColorFromValue(avgValue, true);
    
    return { minColor, maxColor, trackColor };
  }, [value, getColorFromValue]);

  const getPercentage = useCallback((value) => {
    return ((value - min) / (max - min)) * 100;
  }, [min, max]);

  const getValue = useCallback((percentage) => {
    const newValue = min + (percentage / 100) * (max - min);
    return Math.round(newValue / step) * step;
  }, [min, max, step]);

  // Fonction pour gérer le clic sur un marqueur
  const handleStepMarkerClick = useCallback((stepValue, event) => {
    if (disabled) return;
    
    event.stopPropagation();
    
    const distanceToMin = Math.abs(stepValue - value[0]);
    const distanceToMax = Math.abs(stepValue - value[1]);
    
    let newRange = [...value];
    
    // Déterminer quel thumb est le plus proche et l'ajuster
    if (distanceToMin <= distanceToMax) {
      newRange[0] = Math.min(stepValue, value[1]);
    } else {
      newRange[1] = Math.max(stepValue, value[0]);
    }
    
    onChange(newRange);
  }, [disabled, value, onChange]);

  const handleMouseDown = useCallback((e, thumb) => {
    if (disabled) return;
    setIsDragging(thumb);
    e.preventDefault();
  }, [disabled]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = getValue(percentage);

    let newRange = [...value];
    
    if (isDragging === 'min') {
      newRange[0] = Math.min(newValue, value[1]);
    } else {
      newRange[1] = Math.max(newValue, value[0]);
    }

    onChange(newRange);
  }, [isDragging, value, getValue, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercentage = getPercentage(value[0]);
  const maxPercentage = getPercentage(value[1]);

  // Fonction pour obtenir l'intensité de la couleur
  const getIntensityLabel = useCallback((val) => {
    const percentage = ((val - min) / (max - min)) * 100;
    
    if (colorMode === "rating") {
      if (percentage < 20) return "Très faible";
      if (percentage < 40) return "Faible"; 
      if (percentage < 60) return "Moyen";
      if (percentage < 80) return "Bon";
      return "Excellent";
    }
    
    if (colorMode === "score") {
      if (percentage < 30) return "Faible";
      if (percentage < 50) return "Insuffisant";
      if (percentage < 70) return "Correct";
      if (percentage < 85) return "Bon";
      return "Excellent";
    }
    
    return "";
  }, [min, max, colorMode]);

  return (
    <div className={`dual-range-container ${disabled ? 'disabled' : ''}`}>
      {label && (
        <div className={`range-label-header ${isDarkMode ? 'dark' : ''}`}>
          {label}
        </div>
      )}
      
      <div className="dual-range-wrapper">
        <div 
          ref={sliderRef}
          className={`dual-range-slider ${isDarkMode ? 'dark' : ''}`}
        >
          {/* Track de fond */}
          <div className="range-track"></div>
          
          {/* Marqueurs de pas */}
          {showStepMarkers && stepMarkers.map((marker, index) => (
            <div
              key={index}
              className={`step-marker ${hoveredStep === marker.value ? 'hovered' : ''}`}
              style={{
                left: `${marker.percentage}%`,
                backgroundColor: marker.color,
                opacity: hoveredStep === marker.value ? 1 : 0.6
              }}
              onClick={(e) => handleStepMarkerClick(marker.value, e)}
              onMouseEnter={() => setHoveredStep(marker.value)}
              onMouseLeave={() => setHoveredStep(null)}
              title={`${marker.value}${unit}`}
            >
              <div className="step-marker-tooltip">
                {marker.value}{unit}
              </div>
            </div>
          ))}
          
          {/* Track actif avec couleur dynamique */}
          <div 
            className="range-track-active"
            style={{
              left: `${minPercentage}%`,
              right: `${100 - maxPercentage}%`,
              background: colorMode === "gradient" 
                ? `linear-gradient(90deg, ${colors.minColor}, ${colors.maxColor})`
                : colors.trackColor
            }}
          ></div>
          
          {/* Thumb minimum avec couleur dynamique */}
          <div
            className={`range-thumb range-thumb-min ${isDragging === 'min' ? 'dragging' : ''}`}
            style={{ 
              left: `${minPercentage}%`,
              borderColor: colors.minColor,
              boxShadow: `0 2px 8px ${colors.minColor}40`,
              zIndex: isDragging === 'min' ? 10 : 5
            }}
            onMouseDown={(e) => handleMouseDown(e, 'min')}
          >
            <div className="thumb-tooltip" style={{ backgroundColor: colors.minColor }}>
              {value[0]}{unit}
              {getIntensityLabel(value[0]) && (
                <div style={{ fontSize: '0.6rem', opacity: 0.9 }}>
                  {getIntensityLabel(value[0])}
                </div>
              )}
            </div>
          </div>
          
          {/* Thumb maximum avec couleur dynamique */}
          <div
            className={`range-thumb range-thumb-max ${isDragging === 'max' ? 'dragging' : ''}`}
            style={{ 
              left: `${maxPercentage}%`,
              borderColor: colors.maxColor,
              boxShadow: `0 2px 8px ${colors.maxColor}40`,
              zIndex: isDragging === 'max' ? 10 : 5
            }}
            onMouseDown={(e) => handleMouseDown(e, 'max')}
          >
            <div className="thumb-tooltip" style={{ backgroundColor: colors.maxColor }}>
              {value[1]}{unit}
              {getIntensityLabel(value[1]) && (
                <div style={{ fontSize: '0.6rem', opacity: 0.9 }}>
                  {getIntensityLabel(value[1])}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualRangeSlider;