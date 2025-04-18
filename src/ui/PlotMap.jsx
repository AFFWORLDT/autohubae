import  { useState, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  InfoWindow,
  BicyclingLayer,
  TrafficLayer,
  TransitLayer,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { 
  Maximize2, 
  Minimize2, 
  Map as MapIcon, 
  Layers, 
  Navigation,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import styles from "./PlotMap.module.css";

const PlotMap = ({ listingType, addresses, initialHeight = 1000 }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [mapInstance, setMapInstance] = useState(null);
  const [mapTypeId, setMapTypeId] = useState("roadmap");
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [showBicycling, setShowBicycling] = useState(false);
  const [mapHeight, setMapHeight] = useState(initialHeight);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isExpanded) {
      const windowHeight = window.innerHeight;
      setMapHeight(windowHeight - 100);
    } else {
      setMapHeight(initialHeight);
    }
  }, [isExpanded, initialHeight]);

  const mapContainerStyle = {
    width: "100%",
    height: isExpanded ? "100vh" : `${mapHeight}px`,
    transition: "all 0.3s ease-in-out",
  };

  const mapOptions = {
    mapTypeId: mapTypeId,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: window.google?.maps?.MapTypeControlStyle?.HORIZONTAL_BAR,
      position: window.google?.maps?.ControlPosition?.TOP_RIGHT,
    },
    fullscreenControl: false,
    streetViewControl: true,
    zoomControl: true,
    zoomControlOptions: {
      position: window.google?.maps?.ControlPosition?.RIGHT_CENTER,
    },
    scaleControl: true,
    rotateControl: true,
    scrollwheel: true,
    clickableIcons: true,
    disableDoubleClickZoom: false,
    draggable: true,
    keyboardShortcuts: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#a3ccff" }],
      },
    ],
  };

  if (loadError) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>Error loading maps: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading Maps...</p>
      </div>
    );
  }

  const parseLatLng = (positionString) => {
    if (!positionString?.includes(",")) return null;
    const [lat, lng] = positionString.split(",").map(Number);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  };

  const center = { lat: 25.2048, lng: 55.2708 };

  const handleMarkerClick = (address) => {
    
    setSelectedMarker(address);

    if (listingType === "new") {
      address?.status==="active" ? navigate(`/${listingType}-projects/list/${address.id}`):navigate(`/${listingType}-projects/list/${address.id}?status=POOL`);
    } else if (listingType) {
        navigate(`/for-${listingType}/new-list/${address.id}`);
    }
};


  const handleMapLoad = (map) => {
    setMapInstance(map);
  };

  const handleMapClick = () => {
    setSelectedMarker(null);
  };

  const toggleMapSize = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.mapContainer} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.mapHeader}>
        <div className={styles.mapTitle}>
          <MapIcon size={20} />
          <h2>Interactive Map</h2>
        </div>
        <button 
          className={styles.expandButton}
          onClick={toggleMapSize}
          aria-label={isExpanded ? "Minimize map" : "Maximize map"}
        >
          {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      <div className={`${styles.mapControlsWrapper} ${!showControls ? styles.hidden : ''}`}>
  <div className={styles.mapControls}>
    <div className={styles.controlSection}>
      <div className={styles.sectionHeader}>
        <Layers size={16} />
        <span>Map Type</span>
      </div>
      <select
        value={mapTypeId}
        onChange={(e) => setMapTypeId(e.target.value)}
        className={styles.mapTypeSelect}
      >
        <option value="roadmap">Road Map</option>
        <option value="satellite">Satellite</option>
        <option value="hybrid">Hybrid</option>
        <option value="terrain">Terrain</option>
      </select>
    </div>

    <div className={styles.controlSection}>
      <div className={styles.sectionHeader}>
        <Navigation size={16} />
        <span>Layers</span>
      </div>
      <div className={styles.layerControls}>
        <label className={styles.layerToggle}>
          <span>Traffic</span>
          <input
            type="checkbox"
            checked={showTraffic}
            onChange={() => setShowTraffic(!showTraffic)}
            className={styles.layerCheckbox}
          />
          <span className={styles.switch}></span>
        </label>
        <label className={styles.layerToggle}>
          <span>Transit</span>
          <input
            type="checkbox"
            checked={showTransit}
            onChange={() => setShowTransit(!showTransit)}
            className={styles.layerCheckbox}
          />
          <span className={styles.switch}></span>
        </label>
        <label className={styles.layerToggle}>
          <span>Bicycling</span>
          <input
            type="checkbox"
            checked={showBicycling}
            onChange={() => setShowBicycling(!showBicycling)}
            className={styles.layerCheckbox}
          />
          <span className={styles.switch}></span>
        </label>
      </div>
    </div>
  </div>
</div>

{/* Separate toggle button outside the wrapper */}
<button 
  className={`${styles.toggleButton} ${!showControls ? styles.toggleButtonHidden : ''}`}
  onClick={() => setShowControls(!showControls)}
  aria-label={showControls ? "Hide controls" : "Show controls"}
>
  {showControls ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
</button>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={8}
        options={mapOptions}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
      >
        {showTraffic && <TrafficLayer />}
        {showTransit && <TransitLayer />}
        {showBicycling && <BicyclingLayer />}

        {addresses.map((address, index) => {
          const position = parseLatLng(
            address?.position || address?.area?.position
          );

          if (!position) return null;

          return (
            <MarkerF
  key={index}
  position={position}
  icon={{
    url: listingType === "new" && address?.status === "active"
      ? "https://images.freeimages.com/fic/images/icons/2463/glossy/512/location.png"
      : "https://maps.google.com/mapfiles/kml/paddle/red-circle.png",
    scaledSize: new window.google.maps.Size(40, 40),
  }}
  onClick={() => handleMarkerClick(address)}
>

              {selectedMarker === address && (
                <InfoWindow
                  position={position}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className={styles.infoWindow}>
                    <h3>{address.name || address?.area?.name}</h3>
                    {address.description && <p>{address.description}</p>}
                    {address.price && (
                      <p className={styles.price}>
                        Price: ${address.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </MarkerF>
          );
        })}
      </GoogleMap>
    </div>
  );
};

export default PlotMap;