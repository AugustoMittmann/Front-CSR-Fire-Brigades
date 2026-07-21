'use client'

import Button from "@/app/components/button";
import { useEffect, useRef } from "react";
import { useState } from 'react'
import DynamicRadioButtons from "./dynamicRadioButtons";
import styles from "./filterPopup.module.css";

export default function FilterPopup({isOpen, onClose}) {
  const modal = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { label: 'No meu estado', value: 'option1' },
    { label: 'Precisando de voluntários', value: 'option2' },
    { label: 'Precisando de recursos', value: 'option3' },
  ];

  const handleOptionSelect = (value) => {
    setSelectedOption(value);
  };

  const saveFilter = () => {           
    onClose();
  };

  useEffect(() => {    
    const appearingFromTop = [
      { transform: "translateY(-50%)" },
      { transform: "translateY(0%)" }
    ];
    const modalTiming = {
      duration: 300,
      iterations: 1
    };
    
    if(!isOpen) return;

    modal.current.animate(appearingFromTop, modalTiming);    
    tagSelector();
  }, [modal])

  function tagSelector() {    
    const sorterTags = document.getElementById('tagSorter').querySelectorAll(`.${styles.tag}`);
    addActiveTagEventListener(sorterTags);
  }

  function addActiveTagEventListener(tags) {
    tags.forEach(tag => {
      tag.addEventListener('click', () => {
          tags.forEach(btn => btn.className = styles.tag);
          tag.className = styles.activetag;
      });
    });  
  }

  return isOpen && (
    <div 
    ref={modal}    
    style={{
      position: 'fixed',
      top: "0",
      left: "0",      
      width: '100%',
      height: '50%',
      color: "#000000",
      backgroundColor: "rgba(255, 255, 255, 0.99)",
      border: "1px solid rgba(0,0,0,0.5)",
      borderRadius: "5% 5% 0 0",
      padding: "1rem",
      zIndex: "1000",
      display: "flex",
      flexWrap: "wrap",
      textAlign: "center",
      justifyContent: "space-between"
    }}>

      <span style={{
        color: "#39542D",
        fontWeight: "bolder",
        fontSize: "1rem",
        width: "50%",
        font: "normal normal bold 16px/24px 'Montserrat'",
        fontFamily: "'Montserrat', sans-serif",
        display: "flex",
        justifyContent: "left",
        alignItems: "center"
      }}>Filtrar</span>

      <button 
        onClick={onClose} 
        style={{          
          class:"close-button",                    
          backgroundColor: "transparent",
          border: "none",
          fontSize: "2rem",          
          cursor: "pointer",          
          justifyContent: "initial",
        }}>&times;</button>
      
      <DynamicRadioButtons options={options} onSelect={handleOptionSelect} />      

      <span style={{
        color: "#39542D",
        fontWeight: "bolder",
        fontSize: "1rem",
        width: "50%",
        font: "normal normal bold 16px/24px 'Montserrat'",
        fontFamily: "'Montserrat', sans-serif",
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        marginBottom: "0.5rem"
      }}>Ordenar</span>
      <div id="tagSorter" style={
        {width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
          <button className={styles.tag} data-filter="sort1">Ordem A-Z</button>
          <button className={styles.tag} data-filter="sort2">Ordem Z-A</button>
          <button className={styles.tag} data-filter="sort3">Proximidade</button>          
      </div>
      
      <div style={
        {width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Button
          placeholder="Salvar filtros"
          onPress={() => {
            document.body.style.transition = "opacity 0.5s";
            document.body.style.opacity = "1";
            saveFilter();
          }}
          style={styles.saveButton}     
        />
      </div>
    </div>
  );
}