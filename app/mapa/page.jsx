"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import {
  LayoutDashboard, TrendingUp, Crown, Award, Megaphone, HandCoins,
  Newspaper, Phone, IdCard, Building2, Target, Zap, Database, Eye,
  Code2, Boxes, Server, Palette, Rocket, Bell, ShieldCheck, RefreshCw,
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Visão geral" },
  { id: "ambientes", label: "Ambientes & telas" },
  { id: "fluxo", label: "Fluxograma" },
  { id: "dados", label: "Modelo de dados" },
  { id: "stack", label: "Stack técnico" },
  { id: "jornada", label: "Jornada & próximos" },
];

const STATS = [
  { label: "Ambientes", value: "2", delta: "Portal + Backoffice", accent: true },
  { label: "Seções no Portal", value: "9", delta: "em 3 grupos" },
  { label: "Agências (demo)", value: "6", delta: "dados de exemplo" },
  { label: "Backend", value: "0", delta: "localStorage, sem servidor" },
];

const PORTAL_GROUPS = [
  {
    icon: LayoutDashboard, title: "Meu negócio",
    desc: "Onde a agência lê o próprio status.",
    items: [
      "Visão geral — meta atual, desafios, vendas, ranking, nível, resumo semanal",
      "Meu desempenho — vendas por período, evolução, cabines, rotas e cias",
      "Nível da agência — régua Prata/Ouro/Diamante + selo de reconhecimento",
    ],
  },
  {
    icon: Award, title: "Oportunidades de ganho",
    desc: "Tudo que rende bônus para a agência.",
    items: [
      "Metas e desafios — metas de volume, desafios-relâmpago e conquistas",
      "Campanhas ativas — bônus e incentivos com companhias aéreas",
      "Repasses por cia aérea — percentuais de comissão por rota/companhia",
    ],
  },
  {
    icon: IdCard, title: "TPAir",
    desc: "Institucional e cadastro.",
    items: [
      "Informativos — comunicados da consolidadora",
      "Contatos — canais de atendimento e emergência",
      "Perfil da agência — cadastro, endereço e dados bancários",
    ],
  },
];

const BACKOFFICE_GROUPS = [
  {
    icon: LayoutDashboard, title: "Global",
    desc: "Visível sempre, sem agência selecionada.",
    items: [
      "Visão geral — lista de agências com volume do mês, variação e nível",
      "Campanhas ativas — cria campanhas (bônus/incentivo) e define elegibilidade",
    ],
  },
  {
    icon: Building2, title: "Ao selecionar uma agência",
    desc: "O menu de gestão só aparece após escolher a agência.",
    items: [
      "Metas mensais e anuais — valor, prazo derivado da data e recompensa",
      "Metas relâmpago — desafios curtos com contagem regressiva",
      "Níveis da régua — ajusta os limites de Ouro e Diamante da agência",
    ],
  },
];

const ENTITIES = [
  { name: "Agência", hint: "Unidade central de tudo.", fields: ["nome", "cidade", "annualVolume", "tierThresholds", "goals[]", "challenges[]"] },
  { name: "Meta", hint: "Objetivo de volume por período.", fields: ["titulo", "metaValor", "vendido", "prazo", "recompensa"] },
  { name: "Desafio", hint: "Missão curta com prazo em horas.", fields: ["titulo", "meta", "progresso", "horas", "recompensa"] },
  { name: "Campanha", hint: "Acordo com companhia aérea.", fields: ["companhia", "tipo · bônus | incentivo", "regra", "recompensa", "elegibilidade"] },
  { name: "Nível", hint: "Calculado, nunca armazenado.", fields: ["Prata", "Ouro", "Diamante", "= f(volume 12m, régua)"] },
];

const STACK = [
  { icon: Code2, title: "Frontend", desc: "Next.js App Router + React.", items: ["Next.js 14 (App Router)", "React 18 · client components", "Tailwind CSS · dark mode por classe", "next/font — Barlow Condensed, Montserrat, Space Mono"] },
  { icon: Boxes, title: "UI & dados visuais", desc: "Componentes e gráficos.", items: ["lucide-react — ícones", "Recharts — pizza de cabines", "Gráficos e candlestick feitos à mão", "CSS Modules por página"] },
  { icon: Database, title: "Integração", desc: "Sincronização sem servidor.", items: ["localStorage do navegador", "Chave única compartilhada", "Backoffice grava · Portal lê", "Sync aplicada em useEffect (evita hydration)"] },
  { icon: ShieldCheck, title: "Robustez", desc: "Cuidados de protótipo.", items: ["Foco de teclado visível", "Modais com ESC e clique-fora", "Máscaras de moeda e data (pt-BR)", "tabular-nums em toda tabela"] },
  { icon: Server, title: "Estrutura", desc: "Organização do projeto.", items: ["app/ — landing, /bussola, /backoffice, /mapa", "components/ — os dois apps", "origem-claude/ — export original", "Build estático (SSG)"] },
  { icon: Rocket, title: "Deploy", desc: "Caminho natural.", items: ["GitHub — leoconter/bussola", "Vercel detecta Next.js automaticamente", "Sem variáveis de ambiente", "Custo de operação: R$ 0"] },
];

const JORNADA_OPERACAO = [
  { n: 1, title: "Abre o Backoffice", desc: "Vê a lista de agências com volume do mês, variação vs. mês anterior e o nível atual de cada uma.", meta: "/backoffice · Visão geral" },
  { n: 2, title: "Seleciona uma agência", desc: "Clica em \"Gerenciar\". O menu de gestão aparece travado naquela agência — sem risco de editar a errada.", meta: "Gerenciando · [agência]" },
  { n: 3, title: "Cadastra metas e desafios", desc: "Define valor (com máscara R$), data de início (o prazo é derivado do tipo mensal/anual) e recompensa.", meta: "Metas · Metas relâmpago" },
  { n: 4, title: "Ajusta a régua de níveis", desc: "Define os limites de Ouro e Diamante negociados com aquela agência.", meta: "Níveis da régua" },
  { n: 5, title: "Publica campanhas", desc: "Cria campanhas com companhias aéreas e escolhe quais agências são elegíveis.", meta: "Campanhas ativas" },
];

const JORNADA_AGENCIA = [
  { n: 6, title: "Abre o Portal Bússola", desc: "No mesmo navegador, o Portal lê o dado compartilhado e reflete metas, campanhas e o nível calculado.", meta: "/bussola · Visão geral" },
  { n: 7, title: "Acompanha ganhos", desc: "Vê a meta atual, os desafios-relâmpago que expiram, as campanhas ativas e o resumo semanal.", meta: "Metas e desafios · Campanhas" },
  { n: 8, title: "Sobe de nível", desc: "Vende mais; o volume de 12 meses cresce e, ao cruzar a régua, o nível sobe automaticamente.", meta: "Nível da agência" },
];

const PROXIMOS = [
  { icon: Server, title: "Backend real", desc: "Trocar o localStorage por Supabase para sincronizar entre dispositivos e usuários, não só no mesmo navegador." },
  { icon: ShieldCheck, title: "Autenticação por agência", desc: "Cada agência entra com login e vê apenas os próprios dados." },
  { icon: Bell, title: "Notificações", desc: "Avisar a agência quando uma meta nova, campanha ou desafio for publicado." },
  { icon: Rocket, title: "Deploy na Vercel", desc: "Publicar o repositório para colocar o app no ar com URL pública." },
];

function Stat({ label, value, delta, accent }) {
  return (
    <div className={`${styles.stat} ${accent ? styles.statAccent : ""}`}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statDelta}>{delta}</div>
    </div>
  );
}

function FeatGroup({ icon: Icon, title, desc, items, badge, badgeClass }) {
  return (
    <div className={styles.feat}>
      <div className={styles.featHead}>
        <span className={`${styles.iconWrap} ${styles.accent}`}><Icon size={17} /></span>
        <div className={styles.featTitle}>{title}</div>
        {badge && <span className={`${styles.badge} ${badgeClass}`} style={{ marginLeft: "auto" }}>{badge}</span>}
      </div>
      <p className={styles.featDesc}>{desc}</p>
      <ul className={styles.featList}>
        {items.map((it) => <li key={it}>{it}</li>)}
      </ul>
    </div>
  );
}

function JourneyRow({ n, title, desc, meta, amber }) {
  return (
    <div className={styles.journeyRow}>
      <div className={`${styles.journeyNum} ${amber ? styles.amber : ""}`}>{n}</div>
      <div className={styles.journeyContent}>
        <div className={styles.journeyTitle}>{title}</div>
        <div className={styles.journeyDesc}>{desc}</div>
        <div className={styles.journeyMeta}>{meta}</div>
      </div>
    </div>
  );
}

/* ---- flowchart ---- */
function Flowchart() {
  return (
    <svg className={styles.flowchartSvg} viewBox="0 0 1080 620" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fluxograma da plataforma">
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fc-arrow" />
        </marker>
        <marker id="arrA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fc-arrow accent" />
        </marker>
        <marker id="arrD" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fc-arrow dash" />
        </marker>
      </defs>

      <text x="60" y="70" className="fc-tag">Operação TPAir</text>
      <text x="700" y="70" className="fc-tag">Agência parceira</text>
      <text x="380" y="258" className="fc-tag">Integração · navegador</text>

      {/* Backoffice */}
      <g>
        <rect x="60" y="82" width="320" height="120" rx="14" className="fc-node navy" />
        <text x="82" y="116" className="fc-title">Backoffice</text>
        <text x="82" y="138" className="fc-sub">Grava metas, desafios, campanhas e níveis</text>
        <text x="82" y="166" className="fc-sub">▸ Metas · Desafios-relâmpago</text>
        <text x="82" y="185" className="fc-sub">▸ Campanhas · Régua de níveis</text>
      </g>

      {/* Portal */}
      <g>
        <rect x="700" y="82" width="320" height="120" rx="14" className="fc-node teal" />
        <text x="722" y="116" className="fc-title">Portal Bússola</text>
        <text x="722" y="138" className="fc-sub">Lê ao abrir e reflete o estado</text>
        <text x="722" y="166" className="fc-sub">▸ Visão · Desempenho · Nível</text>
        <text x="722" y="185" className="fc-sub">▸ Metas · Campanhas · Repasses</text>
      </g>

      {/* localStorage */}
      <g>
        <rect x="380" y="270" width="320" height="96" rx="14" className="fc-node data" />
        <text x="402" y="302" className="fc-title">Dado compartilhado</text>
        <text x="402" y="323" className="fc-sub">localStorage · mesmo navegador</text>
        <text x="402" y="345" className="fc-mono">tpair_bussola_shared_data_v1</text>
      </g>

      {/* Nível calculado */}
      <g>
        <rect x="380" y="440" width="320" height="86" rx="14" className="fc-node amber" />
        <text x="402" y="472" className="fc-title">Nível calculado</text>
        <text x="402" y="493" className="fc-sub">volume 12 meses × régua da agência</text>
        <text x="402" y="512" className="fc-sub">→ Prata · Ouro · Diamante</text>
      </g>

      {/* Agência vende */}
      <g>
        <rect x="700" y="300" width="320" height="86" rx="14" className="fc-node" />
        <text x="722" y="332" className="fc-title">A agência vende</text>
        <text x="722" y="353" className="fc-sub">o volume sobe e o nível pode subir</text>
        <text x="722" y="372" className="fc-sub">novos bilhetes viram progresso das metas</text>
      </g>

      {/* arrows */}
      <path d="M 220 202 C 220 245, 400 250, 450 270" className="fc-line accent" markerEnd="url(#arrA)" />
      <text x="288" y="242" className="fc-lbl">grava</text>

      <path d="M 700 318 C 800 318, 860 260, 860 202" className="fc-line accent" markerEnd="url(#arrA)" />
      <text x="775" y="268" className="fc-lbl">lê</text>

      <path d="M 540 366 L 540 440" className="fc-line accent" markerEnd="url(#arrA)" />
      <text x="552" y="408" className="fc-lbl">calcula</text>

      <path d="M 860 202 L 860 300" className="fc-line" markerEnd="url(#arr)" />
      <text x="872" y="256" className="fc-lbl">usa</text>

      {/* loop de ciclo */}
      <path d="M 860 386 L 860 575 L 130 575 L 130 202" className="fc-line dash" markerEnd="url(#arrD)" />
      <text x="470" y="568" className="fc-lbl">ciclo · o novo volume alimenta a próxima gestão</text>
    </svg>
  );
}

export default function MapaPage() {
  const [tab, setTab] = useState("overview");

  return (
    <main className={styles.root}>
      <div className={styles.container}>
        {/* hero */}
        <header className={styles.hero}>
          <div>
            <div className={styles.eyebrow}>Documentação · plataforma</div>
            <h1 className={styles.h1}>Mapa do <span className={styles.accent}>Bússola</span><br />de ponta a ponta.</h1>
            <p className={styles.heroLead}>
              A central de incentivos e performance de uma consolidadora aérea. Dois
              ambientes que compartilham os mesmos dados: a operação define o rumo no
              Backoffice, as agências acompanham seus ganhos no Portal.
            </p>
          </div>
          <Link href="/" className={styles.backLink}>← Início</Link>
        </header>

        {/* tabs */}
        <div className={styles.tabs} role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* --- VISÃO GERAL --- */}
        {tab === "overview" && (
          <section className={styles.section} key="overview">
            <div className={styles.stats}>
              {STATS.map((s) => <Stat key={s.label} {...s} />)}
            </div>

            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Arquitetura em 2 lados</div>
              <h2>Operação grava · agência lê</h2>
              <p>O fluxo é linear: a consolidadora cadastra tudo no Backoffice, os dados vão para uma chave única do navegador, e o Portal da agência lê e reflete — sem backend.</p>
            </div>

            <div className={styles.flow}>
              <div className={styles.flowLabel}>Os três estágios</div>
              <div className={`${styles.cardRow} ${styles.cols3}`}>
                <div className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.iconWrap}><Building2 size={17} /></span>
                    <div>
                      <div className={styles.cardTitle}>Backoffice</div>
                      <div className={styles.cardSubtitle}>Operação TPAir</div>
                    </div>
                    <span className={`${styles.badge} ${styles.bAmber}`} style={{ marginLeft: "auto" }}>Grava</span>
                  </div>
                  <div className={styles.cardDesc}>Cadastra metas, desafios, campanhas e a régua de níveis de cada agência.</div>
                </div>
                <div className={styles.card + " " + styles.cardAccent}>
                  <div className={styles.cardHead}>
                    <span className={`${styles.iconWrap} ${styles.accent}`}><Database size={17} /></span>
                    <div>
                      <div className={styles.cardTitle}>Dado compartilhado</div>
                      <div className={styles.cardSubtitle}>localStorage</div>
                    </div>
                  </div>
                  <div className={styles.cardDesc}>Uma chave única guarda o estado das agências, no mesmo navegador.</div>
                  <div className={styles.chips}><span className={styles.chip}>tpair_bussola_shared_data_v1</span></div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={`${styles.iconWrap} ${styles.accent}`}><Eye size={17} /></span>
                    <div>
                      <div className={styles.cardTitle}>Portal Bússola</div>
                      <div className={styles.cardSubtitle}>Agência parceira</div>
                    </div>
                    <span className={`${styles.badge} ${styles.bAccent}`} style={{ marginLeft: "auto" }}>Lê</span>
                  </div>
                  <div className={styles.cardDesc}>Lê o dado ao abrir e reflete metas, campanhas e o nível calculado.</div>
                </div>
              </div>
            </div>

            <div className={styles.card} style={{ marginTop: 24 }}>
              <div className={styles.cardHead}>
                <span className={`${styles.iconWrap} ${styles.amber}`}><Crown size={17} /></span>
                <div>
                  <div className={styles.cardTitle}>A regra que amarra tudo: o nível</div>
                  <div className={styles.cardSubtitle}>Calculado, nunca digitado</div>
                </div>
              </div>
              <div className={styles.cardDesc}>
                <p>O nível de cada agência (Prata, Ouro ou Diamante) não é escolhido — é <strong>calculado</strong> comparando o volume de vendas dos últimos 12 meses com a régua que a operação definiu para aquela agência. Vender mais move o nível para cima automaticamente, tanto no Backoffice quanto no Portal.</p>
              </div>
            </div>
          </section>
        )}

        {/* --- AMBIENTES --- */}
        {tab === "ambientes" && (
          <section className={styles.section} key="ambientes">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Interface</div>
              <h2>As telas de cada ambiente</h2>
              <p>O Portal tem 9 seções em 3 grupos; o Backoffice tem um fluxo global + gestão por agência.</p>
            </div>

            <div className={styles.legend}>
              <div className={styles.legendItem}><span className={styles.legendSw} style={{ background: "rgba(94,234,212,0.12)", borderColor: "rgba(94,234,212,0.4)" }} /> Portal · lê os dados</div>
              <div className={styles.legendItem}><span className={styles.legendSw} style={{ background: "rgba(245,166,35,0.12)", borderColor: "rgba(245,166,35,0.4)" }} /> Backoffice · grava os dados</div>
            </div>

            <div className={styles.subH2} style={{ marginTop: 0 }}>Portal da Agência <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-tertiary)" }}>/bussola</span></div>
            <div className={styles.featGrid}>
              {PORTAL_GROUPS.map((g) => <FeatGroup key={g.title} {...g} badge="Lê" badgeClass={styles.bAccent} />)}
            </div>

            <div className={styles.subH2}>Backoffice <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-tertiary)" }}>/backoffice</span></div>
            <div className={`${styles.cardRow} ${styles.cols2}`}>
              {BACKOFFICE_GROUPS.map((g) => <FeatGroup key={g.title} {...g} badge="Grava" badgeClass={styles.bAmber} />)}
            </div>
          </section>
        )}

        {/* --- FLUXOGRAMA --- */}
        {tab === "fluxo" && (
          <section className={styles.section} key="fluxo">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Mapa de interligação</div>
              <h2>Fluxograma completo</h2>
              <p>Como o Backoffice alimenta o dado compartilhado, como o Portal lê, como o nível é calculado e como o ciclo se fecha quando a agência vende.</p>
            </div>

            <div className={styles.legend}>
              <div className={styles.legendItem}><span className={styles.legendSw} style={{ background: "rgba(30,39,97,0.5)", borderColor: "rgba(120,130,200,0.4)" }} /> Operação</div>
              <div className={styles.legendItem}><span className={styles.legendSw} style={{ background: "rgba(94,234,212,0.1)", borderColor: "rgba(94,234,212,0.4)" }} /> Dado / Portal</div>
              <div className={styles.legendItem}><span className={styles.legendSw} style={{ background: "rgba(245,166,35,0.1)", borderColor: "rgba(245,166,35,0.4)" }} /> Cálculo / ciclo</div>
            </div>

            <div className={styles.flowchartWrap}>
              <Flowchart />
            </div>

            <div className={`${styles.cardRow} ${styles.cols3}`}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={`${styles.iconWrap} ${styles.accent}`}><Database size={17} /></span>
                  <div><div className={styles.cardTitle}>Uma chave, dois lados</div></div>
                </div>
                <div className={styles.cardDesc}>Todo o estado das agências vive numa única chave do localStorage — é o único ponto de encontro entre Backoffice e Portal.</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={`${styles.iconWrap} ${styles.amber}`}><Crown size={17} /></span>
                  <div><div className={styles.cardTitle}>Nível é derivado</div></div>
                </div>
                <div className={styles.cardDesc}>Ninguém digita o nível. Ele é sempre recalculado a partir do volume e da régua, então nunca fica dessincronizado.</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.iconWrap}><RefreshCw size={17} /></span>
                  <div><div className={styles.cardTitle}>O ciclo se fecha</div></div>
                </div>
                <div className={styles.cardDesc}>A agência vende, o volume sobe, e a próxima gestão no Backoffice já parte desse novo patamar.</div>
              </div>
            </div>
          </section>
        )}

        {/* --- MODELO DE DADOS --- */}
        {tab === "dados" && (
          <section className={styles.section} key="dados">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Modelo de dados</div>
              <h2>As entidades da plataforma</h2>
              <p>Tudo gira em torno da agência. Metas, desafios e campanhas penduram nela; o nível é derivado.</p>
            </div>

            <div className={styles.featGrid}>
              {ENTITIES.map((e) => (
                <div key={e.name} className={styles.feat}>
                  <div className={styles.featHead}>
                    <div className={styles.featTitle}>{e.name}</div>
                  </div>
                  <p className={styles.featDesc}>{e.hint}</p>
                  <div className={styles.chips}>
                    {e.fields.map((f) => <span key={f} className={styles.chip}>{f}</span>)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.subH2}>Como fica no localStorage</div>
            <div className={styles.card}>
              <div className={styles.cardDesc} style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre", overflowX: "auto" }}>
{`{
  "agencies": {
    "flytop-viagens": {
      "annualVolume": 1980000,
      "tierThresholds": { "prata": 0, "ouro": 1500000, "diamante": 3000000 },
      "goals": [ { "titulo": "...", "metaValor": 1000000, "vendido": 740000 } ],
      "challenges": [ { "titulo": "...", "meta": 3, "progresso": 1 } ]
    }
  },
  "campaigns": [ { "companhia": "LATAM", "tipo": "bonus", "elegibilidade": "todas" } ]
}`}
              </div>
            </div>
          </section>
        )}

        {/* --- STACK --- */}
        {tab === "stack" && (
          <section className={styles.section} key="stack">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Infraestrutura</div>
              <h2>Com o que foi construído</h2>
              <p>Um app Next.js moderno, sem servidor próprio — a integração acontece no navegador.</p>
            </div>
            <div className={styles.featGrid}>
              {STACK.map((s) => (
                <div key={s.title} className={styles.feat}>
                  <div className={styles.featHead}>
                    <span className={`${styles.iconWrap} ${styles.accent}`}><s.icon size={17} /></span>
                    <div className={styles.featTitle}>{s.title}</div>
                  </div>
                  <p className={styles.featDesc}>{s.desc}</p>
                  <ul className={styles.featList}>
                    {s.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- JORNADA --- */}
        {tab === "jornada" && (
          <section className={styles.section} key="jornada">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Jornada típica</div>
              <h2>Do cadastro à agência</h2>
              <p>O caminho completo: a operação define no Backoffice, a agência colhe no Portal.</p>
            </div>

            <div className={styles.flowLabel}>Lado da operação (Backoffice)</div>
            <div className={styles.journey} style={{ marginBottom: 28 }}>
              {JORNADA_OPERACAO.map((j) => <JourneyRow key={j.n} {...j} />)}
            </div>

            <div className={styles.flowLabel}>Lado da agência (Portal)</div>
            <div className={styles.journey}>
              {JORNADA_AGENCIA.map((j) => <JourneyRow key={j.n} {...j} amber />)}
            </div>

            <div className={styles.subH2}>Próximos passos</div>
            <div className={`${styles.cardRow} ${styles.cols2}`}>
              {PROXIMOS.map((p) => (
                <div key={p.title} className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={`${styles.iconWrap} ${styles.amber}`}><p.icon size={17} /></span>
                    <div className={styles.cardTitle}>{p.title}</div>
                    <span className={`${styles.badge} ${styles.bGhost}`} style={{ marginLeft: "auto" }}>Futuro</span>
                  </div>
                  <div className={styles.cardDesc}>{p.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className={styles.footerNote}>
          TPAir Bússola · Protótipo · Mapa da plataforma · Next.js + Tailwind
        </div>
      </div>
    </main>
  );
}
