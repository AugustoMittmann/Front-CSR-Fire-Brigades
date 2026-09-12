'use client'

import Button from "@/app/components/button";
import { useEffect, useRef } from "react";
import { useState } from 'react'
import DynamicRadioButtons from "./dynamicRadioButtons";
import styles from "./filterPopup.module.css";

export default function FilterPopup({isOpen, onClose, onApply}) {
  const modal = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const options = [
    { label: 'No meu estado', value: 'option1' },
    { label: 'Precisando de voluntários', value: 'option2' },
    { label: 'Precisando de recursos', value: 'option3' },
  ];

  const handleOptionSelect = (value) => {
    setSelectedOption(value);
    setErrorMsg("");
  };

  // Toggle das tags de ordenação: clicar na tag já ativa desmarca.
  const handleSortSelect = (value) => {
    setSortOrder((prev) => (prev === value ? null : value));
  };

  // Pega a posição atual do usuário (Promise em cima da API de callback).
  const getPosition = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalização não é suportada neste navegador."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        (err) => reject(err),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      );
    });

  const saveFilter = async () => {
    setErrorMsg("");

    // Só "az"/"za" são aplicados; "prox" (Proximidade) ainda não tem lógica.
    const sort = sortOrder === "az" || sortOrder === "za" ? sortOrder : null;

    // Só "No meu estado" (option1) está ligado. Os outros dois ainda não têm
    // campo na base, então por ora não aplicam nada (limpam o filtro de estado).
    if (selectedOption !== "option1") {
      onApply?.({ state: null, sort });
      onClose();
      return;
    }

    try {
      setSaving(true);
      const coords = await getPosition();
      const res = await fetch(
        `/api/geocode/reverse?lat=${coords.latitude}&lng=${coords.longitude}`,
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.state) {
        throw new Error(payload?.error?.message || "Não foi possível obter seu estado.");
      }
      onApply?.({ state: payload.state, sort });
      onClose();
    } catch (err) {
      // GeolocationPositionError.code === 1 => permissão negada.
      const msg =
        err?.code === 1
          ? "Permita o acesso à localização para usar este filtro."
          : err?.message || "Não foi possível obter sua localização.";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
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
  }, [modal])

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
          <button
            type="button"
            className={sortOrder === "az" ? styles.activetag : styles.tag}
            onClick={() => handleSortSelect("az")}
          >Ordem A-Z</button>
          <button
            type="button"
            className={sortOrder === "za" ? styles.activetag : styles.tag}
            onClick={() => handleSortSelect("za")}
          >Ordem Z-A</button>
          <button
            type="button"
            className={sortOrder === "prox" ? styles.activetag : styles.tag}
            onClick={() => handleSortSelect("prox")}
          >Proximidade</button>
      </div>
      
      <div style={
        {width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <Button
          placeholder={saving ? "Localizando..." : "Salvar filtros"}
          disabled={saving}
          onPress={saveFilter}
          className={styles.saveButton}
        />
        {errorMsg && (
          <span style={{
            color: "#C62828",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "13px",
            textAlign: "center",
            marginTop: "0.25rem",
          }}>{errorMsg}</span>
        )}
      </div>
    </div>
  );
}