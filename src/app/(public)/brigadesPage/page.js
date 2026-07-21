'use client'

import { useState } from "react";
import Image from "next/image";
import Icons from "../../constants/icons";

function Brigades() {
  const [brigadeName, setBrigadeName] = useState("Nome da Brigada");
  const [location, setLocation] = useState("Rua da Brigada, 123 - Bairro Centro, Cidade - Estado");

  return (
    <div style={{opacity: "1", transition: "opacity 0.5s"}}>
      <div>
        <span style={{color: "#39542D", fontWeight: "bolder", width: "100%", marginBottom: "1rem", font: "bold bold bold 20px/24px 'Montserrat'", fontFamily: "'Montserrat', sans-serif"}}>Perfil da Brigada</span>
        <div style={{display: "flex"}}>
          <Image src={Icons.adicionar.value} alt="Brigade" width={100} height={100} style={{borderRadius: "50%", marginBottom: "1rem"}}/>
          <div>
            <div style={{display: "flex", flexWrap: "wrap"}}>
              <span style={{color: "#DDA15E", fontWeight: "bolder", width: "100%", font: "normal normal bold 18px/22px 'Montserrat'", fontFamily: "'Montserrat', sans-serif"}}>Nome:</span>
              <span style={{color: "#39542D", width: "100%", font: "normal normal normal 14px/18px 'Montserrat'", fontFamily: "'Montserrat', sans-serif"}}>{brigadeName}</span>
            </div>
            <div style={{display: "flex", flexWrap: "wrap"}}>
              <span style={{color: "#DDA15E", fontWeight: "bolder", width: "100%", font: "normal normal bold 18px/22px 'Montserrat'", fontFamily: "'Montserrat', sans-serif"}}>Localização:</span>
              <span style={{color: "#39542D", width: "100%", font: "normal normal normal 14px/18px 'Montserrat'", fontFamily: "'Montserrat', sans-serif"}}>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}

export default Brigades