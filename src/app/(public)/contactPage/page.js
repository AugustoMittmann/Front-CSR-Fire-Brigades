'use client';

import { useEffect, useState } from "react";
import Button, { ButtonStyle } from "../../components/button";
import Input from "../../components/input";
import CustomSelect from "./components/customSelect";
import StateCodes from "../../constants/estados";
import ContactReasons from "../../constants/contactReasons";
import "./css.css";
import CitiesByState from "../../constants/cidadesPorEstado";
import { useRouter } from "next/navigation";
import SaveModal from "../../components/saveModal";
import EmailValidator from "../../validators/emailValidator";
import PhoneValidator from "../../validators/phoneValidator";
import { api } from "@/lib/api";

// A RNBV é a própria organização da plataforma (não é uma brigada do banco).
// Fica sempre como primeira opção e é o default do campo.
const RNBV_OPTION = { key: "rnbv", value: "RNBV - Rede Nacional de Brigadas Voluntárias" };

function Contact() {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [contactReason, setContactReason] = useState("");
  const [brigade, setBrigade] = useState(RNBV_OPTION.key);
  const [brigadeItems, setBrigadeItems] = useState([RNBV_OPTION]);
  const [brigadesLoading, setBrigadesLoading] = useState(true);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const onStateChange = (key) => {
    setState(key);
    setCity(""); // reseta a cidade ao trocar de estado
  };

  // Remove o erro de um campo assim que o usuário começa a corrigi-lo.
  // A revalidação completa continua acontecendo no submit.
  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Carrega as brigadas reais do banco e monta a lista com a RNBV fixa no topo.
  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      try {
        setBrigadesLoading(true);
        const res = await api.brigades.list({ limit: 100 }, { signal: ctrl.signal });
        const fromDb = (res?.data ?? []).map((b) => ({ key: b.id, value: b.name }));
        setBrigadeItems([RNBV_OPTION, ...fromDb]);
      } catch (err) {
        if (err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("[Contact] falha ao carregar brigadas", err);
        // Mantém ao menos a RNBV disponível se o fetch falhar.
        setBrigadeItems([RNBV_OPTION]);
      } finally {
        setBrigadesLoading(false);
      }
    };
    load();
    return () => ctrl.abort();
  }, []);

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
    } else if (!PhoneValidator.isValid(phone)) {
      newErrors.phone = "Telefone inválido";
    }

    const message = getValue("message");
    if (!message.trim()) {
      newErrors.message = "Campo obrigatório";
    }

    const selectedBrigade = getValue("brigade");
    if (!selectedBrigade.trim()) {
      newErrors.brigade = "Selecione uma brigada";
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
            <Input label="Nome" placeholder="Seu nome" name="name" onChange={() => clearError("name")}/>
            {errors.name && <span style={{font: "normal normal normal 12px/15px Montserrat", color: "#D92D20"}}>{errors.name}</span>}

            <Input label="E-mail de Contato" placeholder="Seu e-mail" type="email" name="email" onChange={() => clearError("email")}/>
            {errors.email && <span style={{font: "normal normal normal 12px/15px Montserrat", color: "#D92D20"}}>{errors.email}</span>}

            <Input label="Telefone de Contato" placeholder="Seu telefone" type="phone" name="phone" onChange={() => clearError("phone")}/>
            {errors.phone && <span style={{font: "normal normal normal 12px/15px Montserrat", color: "#D92D20"}}>{errors.phone}</span>}

            <div style={{display: "flex", width: "100%"}}>
              <CustomSelect label="Estado" items={StateCodes} placeholder="UF" value={state} onChange={onStateChange} name="state" width="30%"/>
              <span style={{marginLeft: "1rem"}}/>
              <CustomSelect label="Cidade" items={CitiesByState[state] || []} placeholder="Selecione a sua cidade" value={city} onChange={setCity} width="100%" name="city"/>
            </div>

            <CustomSelect label="Motivo do Contato" placeholder="Selecione o motivo do contato" width="100%" items={ContactReasons} value={contactReason} onChange={setContactReason} name="contactReason"/>

            <CustomSelect label="Deseja falar com uma organização específica? Se sim, selecione abaixo:" placeholder="Selecione uma brigada" width="100%" items={brigadeItems} value={brigade} onChange={(key) => { setBrigade(key); clearError("brigade"); }} name="brigade" searchable searchPlaceholder="Buscar brigada..." loading={brigadesLoading} />
            {errors.brigade && <span style={{font: "normal normal normal 12px/15px Montserrat", color: "#D92D20"}}>{errors.brigade}</span>}

            <Input label="Mensagem" placeholder="Digite aqui a sua mensagem" height="5rem" name="message" onChange={() => clearError("message")}/>
            {errors.message && <span style={{font: "normal normal normal 12px/15px Montserrat", color: "#D92D20"}}>{errors.message}</span>}
          </form>

          <div style={{display: "flex", alignItems: "center", marginTop: "2rem"}}>
            <input className="termsCheckbox" type="checkbox" id="terms" name="terms" value="accepted" onChange={() => clearError("terms")}/>
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