// ToggleButton/index.js
import  { useState, createContext, useContext } from 'react';
import styles from './ToggleButton.module.css';

const ToggleButtonContext = createContext();

const ToggleButton = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggle = () => setIsOpen(!isOpen);

  return (
    <ToggleButtonContext.Provider value={{ isOpen, toggle }}>
      <div className={styles.toggleBtn__container}>
        {children}
      </div>
    </ToggleButtonContext.Provider>
  );
};

const Button = ({ label, style, icon }) => {
  const { toggle, isOpen } = useContext(ToggleButtonContext);

  return (
    <button
      className={`${styles.toggleBtn__trigger} ${isOpen ? styles['toggleBtn__trigger--active'] : ''}`}
      style={style}
      onClick={toggle}
      aria-expanded={isOpen}
    >
      <div className={styles.toggleBtn__triggerContent}>
        {icon && <span className={styles.toggleBtn__icon}>{icon}</span>}
        {label}
      </div>
    </button>
  );
};

const Content = ({ children,  }) => {
  const { isOpen } = useContext(ToggleButtonContext);
  
  // Remove special handling for 'up' position since we want inline display
  return (
    <div className={`
      ${styles.toggleBtn__content} 
      ${isOpen ? styles['toggleBtn__content--visible'] : styles['toggleBtn__content--hidden']}
      ${styles['toggleBtn__content--inline']}
    `}>
      {children}
    </div>
  );
};

ToggleButton.Button = Button;
ToggleButton.Content = Content;

export default ToggleButton;