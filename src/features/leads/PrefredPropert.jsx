import React from "react";
import styles from "./PreferredProperty.module.css";
import { useNavigate } from "react-router-dom";
import { MapPin, Building, Home, BedDouble, Bath } from "lucide-react";

function PreferredProperty({ preferred_property_details ,type}) {
  const navigate = useNavigate();

  if (!preferred_property_details?.length) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <img src="/icons/description.svg" alt="" className={styles.headerIcon} />
          <h3>Preferred Property</h3>
        </div>
        <div className={styles.noProperties}>
          No preferred properties selected
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <img src="/icons/description.svg" alt="" className={styles.headerIcon} />
        <h3>Preferred Property</h3>
      </div>
      <div className={styles.container}>
        {preferred_property_details?.map((property) => (
          <div
            key={property.id}
            className={styles.propertyCard}
            onClick={() => navigate(`/for-${type}/new-list/${property.id}`)}
          >
            <div className={styles.propertyContent}>
              <div className={styles.propertyHeader}>
                <h3 className={styles.propertyTitle}>{property.title}</h3>
              </div>
              
              {property.location && (
                <div className={styles.propertyInfo}>
                  <MapPin className={styles.icon} size={16} />
                  <span>{property.location}</span>
                </div>
              )}
              
              {property.propertyType && (
                <div className={styles.propertyInfo}>
                  <Building className={styles.icon} size={16} />
                  <span>{property.propertyType}</span>
                </div>
              )}
              
              <div className={styles.propertyDetails}>
                {property.bedrooms && (
                  <div className={styles.detailItem}>
                    <BedDouble className={styles.icon} size={16} />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                )}
                
                {property.bathrooms && (
                  <div className={styles.detailItem}>
                    <Bath className={styles.icon} size={16} />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                )}
              </div>

              {property.price && (
                <div className={styles.price}>
                  AED {property.price.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreferredProperty;