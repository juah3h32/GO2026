// src/components/OrangeTitle.jsx
import React from 'react';
import BlurText from './BlurText';
import './OrangeTitle.css'; // Importamos los estilos

const OrangeTitle = ({ text, className = "" }) => {
  return (
    <BlurText
      text={text}
      className={`orange-title-custom ${className}`} // Combina nuestra clase base con otras si las pasas
      delay={50}
      animateBy="letters"
      direction="top"
      threshold={0.2}
    />
  );
};

export default OrangeTitle;