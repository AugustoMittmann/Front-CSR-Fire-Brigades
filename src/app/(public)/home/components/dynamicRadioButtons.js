import React, { useState } from 'react';
import styles from "./dynamicRadioButtons.module.css";

const DynamicRadioButtons = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <div style={
        {width: "100%", justifyContent: "center", alignItems: "start"}}>      
      {options.map((option) => (
        <div key={option.value} style={{
            width:"100%", 
            display: "flex",
            marginBottom: "0.8rem",
        }}>
          <input
            type="checkbox"
            id={option.value}            
            value={option.value}
            checked={selectedOption === option.value}
            onChange={handleOptionChange}
            className={styles.radiobutton}
          />
          <label htmlFor={option.value} style={{            
            font: "normal normal normal 16px/20px 'Montserrat'",
            fontFamily: "'Montserrat', sans-serif",
            color: "#39542D"
            }}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default DynamicRadioButtons;