'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import Icons from "../constants/icons";
import Button from "./button";
import { useEffect, useId, useRef } from "react";

export default function SaveModal({}) {
  const modal = useRef(null);
  const titleId = useId();
  const router = useRouter();
  const previouslyFocused = useRef(null);


  useEffect(() => {
    const appearingFromBottom = [
      { transform: "translateY(100%)" },
      { transform: "translateY(0%)" }
    ];
    const modalTiming = {
      duration: 200,
      iterations: 1
    };

    modal.current.animate(appearingFromBottom, modalTiming);
  }, [modal])

  // Capture the element that opened the modal so we can restore focus on close,
  // move focus into the dialog on open, and let ESC route to the same close
  // handler. The focus trap below is a minimal implementation — it cycles
  // focus across all focusables inside the dialog.
  useEffect(() => {
    previouslyFocused.current =
      typeof document !== "undefined" ? document.activeElement : null;

    const closeAndReturn = () => {
      document.body.style.transition = "opacity 0.5s";
      document.body.style.opacity = "1";
      router.push("/");
    };

    const focusables = () =>
      modal.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea'
      ) ?? [];

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeAndReturn();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const initial = focusables()[0];
    initial?.focus();
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [router]);

  return (
    <div
      ref={modal}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{
        position: "fixed",
        bottom: "0",
        width: "100%",
        height: "50%",
        color: "#000000",
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: "5% 5% 0 0",
        padding: "1rem",
        zIndex: "1000",
        display: "flex",
        flexWrap: "wrap",
        textAlign: "center",
        justifyContent: "center"
      }}
    >
      <h2
        id={titleId}
        style={{
          color: "#39542D",
          fontWeight: "bolder",
          fontSize: "1rem",
          width: "40%",
          font: "normal normal bold 24px/29px 'Montserrat'",
          fontFamily: "'Montserrat', sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
        }}
      >
        Seu contato foi enviado!
      </h2>
      <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Image
            src={Icons.checkbranco.value}
            alt={Icons.checkbranco.alt}
            height={75}
            width={75}
            style={{
              backgroundColor: "#39542D",
              objectFit: "scale-down",
              borderRadius: "50%"
            }}
        />
      </div>
      <span style={{
        color: "#39542D",
        font: "normal normal normal 15px/18px 'Montserrat'",
        fontFamily: "'Montserrat', sans-serif",
        width: "75%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        Agradecemos o seu interesse.
        <br/>
        Entraremos em contato em até 15 dias pelo e-mail ou telefone informados no formulário.
      </span>
      <div style={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center"}}>
        <Button
          placeholder="Voltar para a página inicial"
          onPress={() => {
            document.body.style.transition = "opacity 0.5s";
            document.body.style.opacity = "1";
            router.push("/");
          }}
        />
      </div>
    </div>
  );
}
