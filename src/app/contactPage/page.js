'use client';

import { useState } from "react";
import Button, { ButtonStyle } from "../components/button";
import Input from "../components/input";
import Select from "../components/select";
import StateCodes from "../constants/estados";
import MotivoContato from "../constants/motivoContato";
import "./css.css";
import CitiesByState from "../constants/cidadesPorEstado";
import { useRouter } from "next/navigation";
import SaveModal from "../components/saveModal";
import EmailValidator from "../validators/emailValidator";

function Contact() {
  const [state, setState] = useState(StateCodes[0].key);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validate = () => {
    const newErrors = {};

    const getValue = (fieldName) => document.getElementsByName(fieldName)[0]?.value || "";

    const name = getValue("name");
    if (!name.trim()) {
      newErrors.name = "Campo obrigatório";
    }

    const email = getValue("email");
    if (!email.trim()) {
      newErrors.email = "Campo obrigatório";
    } else if (!EmailValidator.make()(email)) {
      newErrors.email = "E-mail inválido";
    }

    const phone = getValue("phone");
    if (!phone.trim()) {
      newErrors.phone = "Campo obrigatório";
    }

    const message = getValue("message");
    if (!message.trim()) {
      newErrors.message = "Campo obrigatório";
    }

    const acceptedTerms = document.getElementsByName("terms")[0]?.checked;
    if (!acceptedTerms) {
      newErrors.terms = "Você deve aceitar os Termos e Condições";
    }

    return newErrors;
  };

  const onSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const inputNames = ["name", "email", "phone", "message", "state", "city", "contactReason", "brigade"];
    const data = {};

    inputNames.forEach((name) => {
      data[name] = document.getElementsByName(name)[0].value;
    });
    const acceptedTerms = document.getElementsByName("terms")[0].checked;
    data["terms"] = acceptedTerms;

    console.log(data);

    try {
      const response = await Promise.resolve();
      setIsSaveSuccess(true);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  return (
    <>
      <div style={{opacity: isSaveSuccess ? "0.5" : "1", transition: "opacity 0.5s"}}>
        <div style={{margin: "1rem"}}>
          <div style={{display: "flex", flexWrap: "wrap"}}>
            <span style={{color: "#39542D", fontWeight: "bolder", fontSize: "1rem", width: "100%", marginBottom: "1rem", font: "normal normal bold 24px/29px 'Montserrat'", fontFamily: "'Montserrat', sans-serif"}}>Contato</span>

            <span style={{color: "#39542D", width: "100%", marginBottom: "1rem", font: "normal normal normal 16px/20px 'Montserrat'", fontFamily: "'Montserrat', sans-serif"}}>Entre em contato com uma brigada para se tornar um voluntário ou tirar dúvidas.</span>
          </div>
          <form
            id="contactForm"
            className="form"
          >
            <Input label="Nome e Sobrenome" placeholder="Seu nome" name="name"/>
            {errors.name && <span style={{font: "normal normal normal 12px/15px Montserrat", color: "#D92D20"}}>{errors.name}</span>}

            <Input label="E-mail de Contato" placeholder="Seu e-mail" type="email" name="email"/>
            {errors.email && <span style={{font: "normal normal normal 12px/15px Montserrat", color: "#D92D20"}}>{errors.email}</span>}

            <Input label="Telefone de Contato" placeholder="Seu telefone" type="phone" name="phone"/>
            {errors.phone && <span style={{font: "normal normal normal 12px/15px Montserrat", color: "#D92D20"}}>{errors.phone}</span>}

            <div style={{display: "flex", width: "100%"}}>
              <Select label="Estado" items={StateCodes} placeholder="UF" setSelectedKey={setState} name="state"/>
              <span style={{marginLeft: "1rem"}}/>
              <Select label="Cidade" items={CitiesByState[state] || []} placeholder="Selecione a sua cidade" width="100%" name="city"/>
            </div>

            <Select label="Motivo do Contato" placeholder="Selecione o motivo do contato" width="100%" items={MotivoContato} name="contactReason"/>

            <Select label="Deseja falar com uma brigada específica? Se sim, selecione a brigada desejada." placeholder="Selecione uma brigada" width="100%" name="brigade" />

            <Input label="Mensagem" placeholder="Digite aqui a sua mensagem" height="5rem" name="message"/>
            {errors.message && <span style={{font: "normal normal normal 12px/15px Montserrat", color: "#D92D20"}}>{errors.message}</span>}
          </form>

          <div style={{display: "flex", alignItems: "center", marginTop: "2rem"}}>
            <input style={{marginRight: "0.5rem", border: "1px solid #39542D"}} type="checkbox" id="terms" name="terms" value="accepted"/>
            <label htmlFor="terms" style={{color: "#39542D", font: "normal normal normal 16px/20px 'Montserrat'", fontFamily: "'Montserrat', sans-serif" }}>Afirmo que li e aceito os Termos e Condições</label>
          </div>
          {errors.terms && <span style={{font: "normal normal normal 12px/15px Montserrat", color: "#D92D20"}}>{errors.terms}</span>}

          <div style={{display: "flex", marginTop: "1rem"}}>
            <span style={{flexGrow: "1"}}/>
            <Button
              placeholder="Voltar"
              style={ButtonStyle.standard}
              onPress={() => router.push("/")}/>
            <span style={{marginLeft: "0.5rem"}}/>
            <Button
              placeholder="Enviar"
              onPress={() => onSubmit()}
              type="submit"
            />
          </div>
        </div>
      </div>
      {isSaveSuccess && <SaveModal/>}
    </>
  );
}

  export default Contact