import styles from "./historiaPage.module.css";
import {
  HandBulbIcon,
  MegaphoneIcon,
  FlowIcon,
  PeopleIcon,
  BulbCheckIcon,
  PeopleGroupIcon,
} from "./objetivosIcons";

const objetivos = [
  {
    Icon: HandBulbIcon,
    text: "Buscar desenvolvimento técnico nas áreas de organização, comunicação institucional, combate, saúde e segurança.",
  },
  {
    Icon: MegaphoneIcon,
    text: "Captar recursos para custeio administrativo, apoio jurídico, deslocamentos, estadias, equipamentos e realização de eventos.",
  },
  {
    Icon: FlowIcon,
    text: "Ter capacidade de organizar Forças-Tarefa para atuação em grandes ocorrências, ou seja, a viabilização de uma brigada nacional voluntária.",
  },
  {
    Icon: PeopleIcon,
    text: "Viabilizar seguro de vida e despesas médicas aos voluntários.",
  },
  {
    Icon: BulbCheckIcon,
    text: "Discutir políticas públicas relacionadas à prevenção e combate voluntário a incêndios florestais.",
  },
  {
    Icon: PeopleGroupIcon,
    text: "Atuar para estabelecimento de legislações federais e estaduais, que reconheçam as atividades dos brigadistas voluntários e a utilidade pública das organizações.",
  },
];

const brigadasFundadoras = [
  { name: "ABME" },
  { name: "BRIVAC" },
  { name: "Brigada 1" },
  { name: "Simbiose" },
  { name: "CIFA" },
  { name: "Chico Taquara" },
  { name: "Brigada Caratuva" },
  { name: "Vale do Capão" },
  { name: "Rede Contra Fogo" },
  { name: "Brigada Guará" },
  { name: "Ouro Branco" },
  { name: "João Montevade" },
  { name: "Alter do Chao" },
  { name: "Brigada Carcará" },
];

const diretoria = [
  {
    name: "Rafael Gava",
    role: "Diretor Presidente",
    photo: null,
    bio: [
      "Desenvolvedor, Cofundador e atual Coordenador da Brigada Caratuva – Paraná.",
      "Cofundador da Brigada Voluntária de Prevenção e Combate a Incêndios em Montanha (Brigada FEPAM). Vice-Presidente da Fundação João José Bigarella.",
      "Consultor Ambiental graduado em Administração. Pós Graduado em Prevenção e Combate a Incêndios Florestais – UFPR. Especialista em Zoneamento de Risco de Incêndios Florestais.",
      "Técnico de Segurança do Trabalho – Estudou sobre equipamentos de proteção respiratória para brigadistas florestais.",
      "Membro da Comissão de Estudo de Segurança Contra Incêndio Florestal da ABNT;",
      "Colaborador voluntário do comitê estadual do Programa de Prevenção a Incêndios na Natureza – PREVINA – PR; Colaborador voluntário do IBAMA/PREVFOGO na capacitação de Brigadas Indígenas.",
      "Um idealista fazendo a sua parte para ajudar a proteger a biodiversidade brasileira.",
    ],
  },
  {
    name: "Maíz d’Assumpção",
    role: "Diretora Secretária",
    photo: null,
    bio: [
      "Brigadista Florestal Voluntária desde 2014, foi Coordenadora do Núcleo de Belo Horizonte da Brigada 1 e é representante do Grupo de Mulheres da RNBV.",
      "Prêmio Cidadã Sustentável Categoria Meio Ambiente em 2014 pelos seus trabalhos como brigadista voluntária em Brumadinho/MG.",
      "Produtora executiva e roteirista possui 14 anos de experiência em gestão de projetos.",
    ],
  },
  {
    name: "Vinícius Gaburro De Zorzi",
    role: "Diretor Financeiro",
    photo: null,
    bio: [
      "Brigadista Florestal Voluntário desde 2003, associado da OSCIP SIMBiOSE desde 2007, instituição onde atua voluntariamente no planejamento, acompanhamento de implantação e monitoramento de projetos de conservação da natureza.",
      "Além do trabalho voluntariado, experiência profissional na gestão de parques urbanos e unidades de conservação públicas, na coordenação de projetos de manejo de bacias hidrográficas e áreas prioritárias para conservação da natureza.",
      "Bacharel em Hotelaria (Senac-SP), bacharel em Gestão Ambiental (Escola Superior de Agricultura Luiz de Queiroz – ESALQ/USP) e Mestre em Ecologia (Instituto de Biociências – IB/USP).",
    ],
  },
];

export default function HistoriaPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>História da RNBV</h1>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>
            Por que uma rede nacional de brigadas?
          </h2>
          <p className={styles.paragraph}>
            Existem dezenas de grupos voluntários dedicados a proteger as matas
            dos incêndios, entretanto a maior parte deles não tem apoio do
            setor público. São pessoas movidas pelo senso de pertencimento,
            cidadania e responsabilidade por cuidar do planeta.
          </p>
          <p className={styles.paragraph}>
            Para isso se articulam e usam recursos próprios para aquisição de
            equipamentos e ferramentas. Usam seus próprios veículos, arcam com
            as despesas de deslocamento e alimentação. Muitas vezes lutam
            contra o descrédito das autoridades e estão sempre à procura de
            conhecimento sobre a prevenção e combate aos incêndios florestais.
            Poucos são reconhecidos e muitos se arriscam sem amparo algum caso
            sofram algum acidente.
          </p>
          <p className={styles.paragraph}>
            São inúmeras as situações em que as brigadas passam muito tempo
            combatendo o fogo sem sequer terem a oportunidade de uma
            capacitação específica! Foi para isso que a Rede Nacional de
            Brigadas Voluntárias foi criada. Representamos a união de
            organizações sem fins lucrativos que atuam de forma voluntária na
            prevenção e combate aos incêndios florestais em todo o Brasil. O
            objetivo principal é o compartilhamento de conhecimento e a busca
            conjunta para a solução de dificuldades comuns.
          </p>
          <p className={styles.paragraph}>
            Nosso posicionamento sempre será na defesa de melhores condições
            de atuação dessas organizações, que agregam pessoas interessadas
            na proteção do meio ambiente por meio da doação do seu tempo, seus
            recursos, esforço físico e até correndo muitos riscos. A única
            certeza é saber que estão fazendo o melhor possível por um mundo
            melhor.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>Nossa missão</h2>
          <p className={styles.paragraph}>
            Buscar solução para as dificuldades comuns e representar os
            interesses das organizações que de forma voluntária combatem
            incêndios florestais no Brasil, visando a proteção ambiental.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>Objetivos</h2>
          <ul className={styles.objetivosList}>
            {objetivos.map(({ Icon, text }, index) => (
              <li key={index} className={styles.objetivoCard}>
                <div className={styles.objetivoIcon}>
                  <Icon />
                </div>
                <p className={styles.objetivoText}>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>Mídias</h2>
          <div
            className={styles.videoPlaceholder}
            role="img"
            aria-label="Vídeo em breve"
          >
            <div className={styles.playButton} aria-hidden="true">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="16,12 30,20 16,28" fill="currentColor" />
              </svg>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>Brigadas Fundadoras</h2>
          <ul className={styles.brigadasGrid}>
            {brigadasFundadoras.map(({ name }) => (
              <li key={name} className={styles.brigadaCard}>
                <div
                  className={styles.brigadaLogo}
                  aria-label={`Logo ${name}`}
                />
                <span className={styles.brigadaName}>{name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>Diretoria</h2>
          <div className={styles.diretoriaList}>
            {diretoria.map(({ name, role, bio }) => (
              <article key={name} className={styles.diretorCard}>
                <div
                  className={styles.diretorPhoto}
                  aria-label={`Foto de ${name}`}
                />
                <div className={styles.diretorInfo}>
                  <h3 className={styles.diretorName}>{name}</h3>
                  <p className={styles.diretorRole}>{role}</p>
                  {bio.map((paragraph, idx) => (
                    <p key={idx} className={styles.paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
