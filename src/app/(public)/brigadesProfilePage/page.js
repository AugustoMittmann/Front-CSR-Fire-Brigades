'use client'

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../../components/button";
import styles from "./style.module.css";
import { api } from "@/lib/api";

/**
 * Perfil público de uma brigada. Mantém o mesmo design da página estática
 * anterior, mas agora carrega os dados reais da brigada aberta a partir do
 * ?id=<uuid> da URL (o card da lista já manda esse id na flecha).
 *
 * Só renderiza os campos que a brigada realmente tem. As seções "Principais
 * Atividades" e "Sugestão de Doação" vêm de tabelas relacionadas
 * (activities_brigade / items_brigade), carregadas em paralelo via
 * GET /api/brigades/:id/activities e /items. Sem dados, cada seção mostra um
 * estado vazio em vez de conteúdo fictício.
 */

const currencyBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// value/quantityNeeded podem vir null; formata só o que existir.
function formatItemValue(item) {
  const parts = [];
  if (item.value != null) parts.push(currencyBRL.format(item.value));
  if (item.quantityNeeded != null) {
    const unit = item.unit ? ` ${item.unit}` : "";
    parts.push(`${item.quantityNeeded}${unit} necessário(s)`);
  }
  return parts.join(" · ");
}

// foundation pode vir como data ISO ou só o ano; formata de forma defensiva.
function formatFoundation(value) {
  if (!value) return null;
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d.toLocaleDateString("pt-BR");
  return String(value);
}

function instagramHref(handle) {
  if (!handle) return null;
  if (/^https?:\/\//i.test(handle)) return handle;
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}

function ProfileInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [brigade, setBrigade] = useState(null);
  const [activities, setActivities] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Brigada não informada.");
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [brigadeRes, activitiesRes, itemsRes] = await Promise.all([
          api.brigades.get(id, { signal: ctrl.signal }),
          api.brigades.activities(id, { signal: ctrl.signal }),
          api.brigades.items(id, { signal: ctrl.signal }),
        ]);
        setBrigade(brigadeRes?.data ?? null);
        setActivities(activitiesRes?.data ?? []);
        setItems(itemsRes?.data ?? []);
      } catch (err) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("[BrigadeProfile] load failed", err);
        setError("Não foi possível carregar a brigada.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [id]);

  if (loading) return <div className="section"><p>Carregando brigada...</p></div>;
  if (error) return <div className="section"><p style={{ color: "#C62828" }}>{error}</p></div>;
  if (!brigade) return <div className="section"><p>Brigada não encontrada.</p></div>;

  const b = brigade;
  const foundation = formatFoundation(b.foundation);
  const location =
    [b.address, [b.city, b.state].filter(Boolean).join(" - ")]
      .filter(Boolean)
      .join(", ") || null;
  const instaUrl = instagramHref(b.instagram);

  const copyPix = async () => {
    if (!b.pix) return;
    try {
      await navigator.clipboard.writeText(b.pix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível — silencioso.
    }
  };

  // Leva ao formulário de contato já com esta brigada selecionada
  // (contactPage lê ?brigadeId=<uuid> e pré-seleciona no campo).
  const openContact = () => {
    router.push(`/contactPage?brigadeId=${b.id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftCol}>
      <section className={`section ${styles.introCard}`}>
        <div className='title'>
          Acompanhe o Trabalho da {b.name}
        </div>
        <div className='mb-2'>
          <Image
            className='rounded'
            width={350}
            height={250}
            src={b.imageUrl || "/images/brigade.png"}
            alt={`Imagem da ${b.name}`}
            unoptimized={Boolean(b.imageUrl)}
            style={{
              width: "100%",
              maxWidth: "350px",
              height: "250px",
              objectFit: "cover",
            }}
          />
        </div>
        <div>
          <div className='flex flex-col gap-3'>
            {foundation && (
              <div className='flex flex-col gap-1'>
                <span className='text-orange-400 font-bold'>Fundada em</span>
                <span>{foundation}</span>
              </div>
            )}
            {b.actingArea && (
              <div className='flex flex-col gap-1'>
                <span className='text-orange-400 font-bold'>Áreas de Atuação</span>
                <span>{b.actingArea}</span>
              </div>
            )}
            {(b.volunteers || b.volunteers === 0) && (
              <div className='flex flex-col gap-1'>
                <span className='text-orange-400 font-bold'>Número de Voluntários</span>
                <span>{b.volunteers}</span>
              </div>
            )}
            {location && (
              <div className='flex flex-col gap-1'>
                <span className='text-orange-400 font-bold'>Localização</span>
                <span>{location}</span>
              </div>
            )}
            {b.instagram && (
              <div className='flex flex-col gap-1'>
                <span className='text-orange-400 font-bold'>Instagram</span>
                <span>
                  <a href={instaUrl} target="_blank" rel="noopener noreferrer">
                    {b.instagram.startsWith("@") ? b.instagram : `@${b.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")}`}
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className={`flex bg-green-200 flex-col justify-center align-center gap-3 p-5 ${styles.card}`}>
        <h3>Deseja ajudar essa Brigada?</h3>
        {b.pix && (
          <div className='flex flex-col justify-center align-center w-full gap-2'>
            <span>Para doações monetárias de qualquer valor:</span>
            <Button
              className="w-full justify-center"
              placeholder={copied ? "Chave PIX copiada!" : "Copiar Chave PIX"}
              onPress={copyPix}
            />
          </div>
        )}
        <div className='flex flex-col justify-center align-center w-full gap-2'>
          <span>Para doação de itens ou voluntariado:</span>
          <Button
            className="w-full justify-center"
            placeholder="Entrar em Contato"
            style="standard"
            onPress={openContact}
          />
        </div>
      </div>
      </div>

      <div className={styles.rightCol}>
      <div className={`p-5 bg-gray-200 ${styles.card}`}>
        <h3 className='mb-2'>Principais Atividades Desenvolvidas</h3>
        {activities.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0.75rem",
            }}
          >
            {activities.map((a) => (
              <div
                key={a.activityId}
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--green-200)",
                  borderRadius: "10px",
                  padding: "1rem",
                  textAlign: "center",
                  color: "var(--green-600)",
                }}
              >
                {a.name}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#666" }}>
            Nenhuma atividade cadastrada no momento.
          </div>
        )}
      </div>

      {(b.presentation || b.description) && (
        <div className={`bg-white p-5 ${styles.card}`}>
          <h3 className='mb-2'>Apresentação</h3>
          <div>{b.presentation || b.description}</div>
        </div>
      )}

      <div className={`bg-gray-200 p-5 ${styles.card}`}>
        <h3 className='mb-2'>Sugestão de Doação</h3>
        {items.length > 0 ? (
          <ul className='flex flex-col gap-3'>
            {items.map((it) => {
              const detail = formatItemValue(it);
              return (
                <li key={it.itemId} className='flex flex-col gap-1'>
                  <span className='font-bold'>{it.name}</span>
                  {detail && <span style={{ color: "#555" }}>{detail}</span>}
                </li>
              );
            })}
          </ul>
        ) : (
          <div style={{ color: "#666" }}>
            Nenhuma sugestão de doação cadastrada no momento.
          </div>
        )}
      </div>

      {b.pix && (
        <div className={`flex bg-green-200 flex-col justify-center align-center gap-3 p-5 ${styles.helpCardDup}`}>
          <h3>Deseja ajudar essa Brigada?</h3>
          <div className='flex flex-col justify-center align-center w-full gap-2'>
            <span>Para doações monetárias de qualquer valor:</span>
            <Button
              className="w-full justify-center"
              placeholder={copied ? "Chave PIX copiada!" : "Copiar Chave PIX"}
              onPress={copyPix}
            />
          </div>
          <div className='flex flex-col justify-center align-center w-full gap-2'>
            <span>Para doação de itens ou voluntariado:</span>
            <Button
              className="w-full justify-center"
              placeholder="Entrar em Contato"
              style="standard"
              onPress={openContact}
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function BrigadesProfilePage() {
  return (
    <Suspense fallback={<div className="section"><p>Carregando brigada...</p></div>}>
      <ProfileInner />
    </Suspense>
  );
}
