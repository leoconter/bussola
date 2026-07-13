"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2, Upload, FileSpreadsheet, Save, Plus, Trash2, Users, Target, Zap,
  Crown, Megaphone, ChevronDown, ChevronRight, AlertTriangle, CheckCircle2,
  Search, X, Info, Download, LayoutDashboard, ShieldAlert,
} from "lucide-react";

// ---------- marca ----------
const BRAND = {
  navy: "#1E2761",
  navyDark: "#161D4A",
  teal: "#0D9488",
  tealDark: "#0B7A70",
  amber: "#F5A623",
};

// mesmo canal de dados usado pelo TPAir Bússola (sistema das agências).
// Gravar aqui é o que faz o cadastro "refletir" no Bússola quando aberto no mesmo navegador.
const SHARED_DATA_KEY = "tpair_bussola_shared_data_v1";

const LOGO_PNG_BASE64 = "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";

function Logo() {
  return (
    <img
      src={`data:image/png;base64,${LOGO_PNG_BASE64}`}
      alt="TPAir Bússola"
      style={{ height: 34, width: "auto" }}
    />
  );
}

// ---------- dados de exemplo (seed) ----------
// A FlyTop Viagens replica exatamente os dados que já existem hoje no protótipo do Bússola,
// para que a integração entre os dois sistemas seja visível desde a primeira abertura.
function seedAgencies() {
  const defaultThresholds = { prata: 0, ouro: 1500000, diamante: 3000000 };
  return [
    {
      id: "flytop-viagens", nome: "FlyTop Viagens", cnpj: "12.345.678/0001-90", cidade: "Porto Alegre/RS",
      annualVolume: 1980000,
      tierThresholds: { ...defaultThresholds },
      goals: [
        { id: "g0", titulo: "Meta de abertura — Q1 2026", recompensa: "R$ 2.000 via Pix", metaValor: 500000, vendido: 512000, prazo: "Concluída em 31/03/2026", diasRestantes: 0 },
        { id: "g1", titulo: "Meta de volume — Junho 2026", recompensa: "R$ 5.000 via Pix", metaValor: 1000000, vendido: 740000, prazo: "9 dias restantes", diasRestantes: 9 },
        { id: "g2", titulo: "Meta trimestral — Q2 2026", recompensa: "Pacote de viagem para 2 pessoas", metaValor: 3000000, vendido: 1450000, prazo: "42 dias restantes", diasRestantes: 42 },
      ],
      challenges: [
        { id: "d1", titulo: "Venda 3 bilhetes até domingo", regra: "", recompensa: "R$ 50 de bônus extra por bilhete", horas: 62, progresso: 1, meta: 3 },
        { id: "d2", titulo: "Emita 5 bilhetes para o Nordeste em 72h", regra: "", recompensa: "R$ 300 em bônus único", horas: 18, progresso: 4, meta: 5 },
      ],
    },
    {
      id: "horizonte-viagens", nome: "Horizonte Viagens", cnpj: "23.456.789/0001-11", cidade: "São Paulo/SP",
      annualVolume: 850000,
      tierThresholds: { ...defaultThresholds },
      goals: [
        { id: "hg1", titulo: "Meta de volume — Junho 2026", recompensa: "R$ 2.500 via Pix", metaValor: 600000, vendido: 410000, prazo: "9 dias restantes", diasRestantes: 9 },
      ],
      challenges: [],
    },
    {
      id: "voar-turismo", nome: "Voar Turismo", cnpj: "34.567.890/0001-22", cidade: "Curitiba/PR",
      annualVolume: 320000,
      tierThresholds: { ...defaultThresholds },
      goals: [
        { id: "vg1", titulo: "Meta de volume — Junho 2026", recompensa: "R$ 1.200 via Pix", metaValor: 300000, vendido: 95000, prazo: "9 dias restantes", diasRestantes: 9 },
      ],
      challenges: [],
    },
    {
      id: "destino-certo", nome: "Destino Certo Viagens", cnpj: "45.678.901/0001-33", cidade: "Recife/PE",
      annualVolume: 2100000,
      tierThresholds: { ...defaultThresholds },
      goals: [
        { id: "dg1", titulo: "Meta de volume — Junho 2026", recompensa: "R$ 6.000 via Pix", metaValor: 1300000, vendido: 1180000, prazo: "9 dias restantes", diasRestantes: 9 },
      ],
      challenges: [
        { id: "dg-c1", titulo: "Emita 5 bilhetes para o Nordeste em 72h", regra: "", recompensa: "R$ 300 em bônus único", horas: 30, progresso: 3, meta: 5 },
      ],
    },
    {
      id: "mundi-viagens", nome: "Mundi Viagens", cnpj: "56.789.012/0001-44", cidade: "Belo Horizonte/MG",
      annualVolume: 4200000,
      // Agência de grande porte: régua negociada mais alta que o padrão.
      tierThresholds: { prata: 0, ouro: 2000000, diamante: 5000000 },
      goals: [
        { id: "mg1", titulo: "Meta de volume — Junho 2026", recompensa: "R$ 12.000 via Pix", metaValor: 2500000, vendido: 2380000, prazo: "9 dias restantes", diasRestantes: 9 },
      ],
      challenges: [],
    },
    {
      id: "boa-viagem-turismo", nome: "Boa Viagem Turismo", cnpj: "67.890.123/0001-55", cidade: "Salvador/BA",
      annualVolume: 150000,
      // Agência de pequeno porte: régua negociada mais acessível que o padrão.
      tierThresholds: { prata: 0, ouro: 600000, diamante: 1500000 },
      goals: [],
      challenges: [],
    },
  ];
}

const SEED_CAMPAIGNS = [
  {
    id: "c1", companhia: "LATAM", status: "Ativa", tipo: "bonus",
    regra: "Emita 5 bilhetes em Classe Executiva", recompensa: "R$ 150 por emissão, via Pix", valorPorBilhete: 150,
    inicio: "01/06/2026", fim: "30/06/2026", meta: 5, tickets: [],
    regrasDetalhadas: ["Válido para emissões entre 01/06/2026 e 30/06/2026.", "Aplica-se somente a bilhetes em Classe Executiva."],
    agenciasElegiveis: "todas",
  },
  {
    id: "c2", companhia: "GOL", status: "Ativa", tipo: "bonus",
    regra: "Venda 10 bilhetes para destinos no Nordeste", recompensa: "R$ 80 por emissão, via Pix", valorPorBilhete: 80,
    inicio: "01/06/2026", fim: "15/07/2026", meta: 10, tickets: [],
    regrasDetalhadas: ["Válido para emissões entre 01/06/2026 e 15/07/2026.", "Destinos elegíveis: Norte e Nordeste."],
    agenciasElegiveis: "todas",
  },
  {
    id: "c3", companhia: "American Airlines", status: "Encerrando em 6 dias", tipo: "bonus",
    regra: "Emita 3 bilhetes internacionais em Primeira Classe", recompensa: "R$ 300 por emissão, via Pix", valorPorBilhete: 300,
    inicio: "10/06/2026", fim: "01/07/2026", meta: 3, tickets: [],
    regrasDetalhadas: ["Válido para emissões internacionais entre 10/06/2026 e 01/07/2026."],
    agenciasElegiveis: "todas",
  },
  {
    id: "c4", companhia: "Air Canada", status: "Ativa", tipo: "incentivo",
    regra: "Incentivo extra em todas as emissões internacionais", recompensa: "+2% de incentivo sobre o comissionamento padrão", percentualIncentivo: 2,
    inicio: "01/06/2026", fim: "31/08/2026", meta: null, tickets: [],
    regrasDetalhadas: ["Válido para todas as emissões internacionais entre 01/06/2026 e 31/08/2026."],
    agenciasElegiveis: "todas",
  },
  {
    id: "c5", companhia: "Iberia", status: "Ativa", tipo: "incentivo",
    regra: "Incentivo extra em Classe Executiva", recompensa: "+1,5% de incentivo sobre o comissionamento padrão", percentualIncentivo: 1.5,
    inicio: "15/06/2026", fim: "15/09/2026", meta: null, tickets: [],
    regrasDetalhadas: ["Válido para emissões em Classe Executiva entre 15/06/2026 e 15/09/2026."],
    agenciasElegiveis: "todas",
  },
];

function loadInitialState() {
  const fallback = { agencies: seedAgencies(), campaigns: SEED_CAMPAIGNS };
  try {
    if (typeof window === "undefined" || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(SHARED_DATA_KEY);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    const seed = seedAgencies();
    const agencies = seed.map(a => {
      const saved = data.agencies && data.agencies[a.id];
      if (!saved) return a;
      return {
        ...a,
        annualVolume: typeof saved.annualVolume === "number" ? saved.annualVolume : a.annualVolume,
        tierThresholds: saved.tierThresholds || a.tierThresholds,
        goals: Array.isArray(saved.goals) ? saved.goals : a.goals,
        challenges: Array.isArray(saved.challenges) ? saved.challenges : a.challenges,
      };
    });
    return {
      agencies,
      campaigns: Array.isArray(data.campaigns) && data.campaigns.length ? data.campaigns : SEED_CAMPAIGNS,
    };
  } catch (e) {
    return fallback;
  }
}

function persist(agencies, campaigns) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const agenciesMap = {};
    agencies.forEach(a => {
      agenciesMap[a.id] = { annualVolume: a.annualVolume, tierThresholds: a.tierThresholds, goals: a.goals, challenges: a.challenges };
    });
    const data = { agencies: agenciesMap, campaigns };
    window.localStorage.setItem(SHARED_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Backoffice: não foi possível salvar.", e);
  }
}

function formatBRL(n) {
  return "R$ " + Number(n || 0).toLocaleString("pt-BR");
}

// máscara de moeda para inputs (inteiros em reais): "1500000" -> "R$ 1.500.000"
function formatMoneyInput(str) {
  const digits = String(str == null ? "" : str).replace(/\D/g, "");
  return digits ? "R$ " + Number(digits).toLocaleString("pt-BR") : "";
}
function parseMoney(str) {
  const digits = String(str == null ? "" : str).replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}
// máscara de data DD/MM/AAAA enquanto digita (só números)
function formatDateInput(str) {
  const d = String(str == null ? "" : str).replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return d.slice(0, 2) + "/" + d.slice(2);
  return d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4);
}
const isDateComplete = s => /^\d{2}\/\d{2}\/\d{4}$/.test(String(s || ""));
// deriva o fim do período e os dias restantes a partir do tipo da meta + data de início (DD/MM/AAAA)
function calcularPrazoMeta(tipo, dataInicioBR) {
  const meses = { Mensal: 1, Trimestral: 3, Anual: 12 }[tipo] || 1;
  const [dia, mes, ano] = String(dataInicioBR).split("/").map(Number);
  if (!dia || !mes || !ano) return { diasRestantes: 0, prazo: "Sem data", fimLabel: "" };
  const fim = new Date(ano, (mes - 1) + meses, 0, 23, 59, 59); // último dia do último mês da janela
  const hoje = new Date();
  const dias = Math.max(0, Math.ceil((fim.getTime() - hoje.getTime()) / 86400000));
  const fimLabel = `${String(fim.getDate()).padStart(2, "0")}/${String(fim.getMonth() + 1).padStart(2, "0")}/${fim.getFullYear()}`;
  return { diasRestantes: dias, prazo: dias > 0 ? `${dias} dias restantes` : "Encerrada", fimLabel };
}

function tierForVolume(volume, thresholds) {
  const order = [
    { id: "diamante", nome: "Diamante", min: thresholds.diamante },
    { id: "ouro", nome: "Ouro", min: thresholds.ouro },
    { id: "prata", nome: "Prata", min: thresholds.prata },
  ];
  return (order.find(t => volume >= t.min) || order[order.length - 1]).nome;
}

// ---------- componentes utilitários ----------
// itens globais (sempre visíveis) e itens de gestão de uma agência
// (só aparecem depois que o operador seleciona uma agência na Visão geral).
const GLOBAL_NAV = [
  { id: "visao", label: "Visão geral", icon: LayoutDashboard },
  { id: "campanhas", label: "Campanhas ativas", icon: Megaphone },
];
const AGENCY_NAV = [
  { id: "metas", label: "Metas mensais e anuais", icon: Target },
  { id: "desafios", label: "Metas relâmpago", icon: Zap },
  { id: "niveis", label: "Níveis da régua", icon: Crown },
];

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: BRAND.teal }}>{eyebrow}</p>
        <h2 className="text-2xl font-semibold text-slate-900" style={{ fontFamily: "Georgia, serif" }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg z-50">
      <CheckCircle2 className="w-4 h-4" style={{ color: BRAND.amber }} /> {message}
    </div>
  );
}

function AgencyPicker({ agencies, selected, onSelect }) {
  return (
    <div className="relative inline-block">
      <select
        value={selected}
        onChange={e => onSelect(e.target.value)}
        className="appearance-none border border-slate-200 rounded-lg pl-3 pr-9 py-2 text-sm bg-white text-slate-900 font-medium"
      >
        {agencies.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

// ---------- módulos ----------

function OverviewModule({ agencies, goTo }) {
  return (
    <div>
      <SectionTitle eyebrow="Backoffice TPAir" title="Agências cadastradas no Bússola" />
      <div className="rounded-xl p-4 mb-6 flex gap-3 items-start" style={{ backgroundColor: "#FFF4DF" }}>
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" style={{ color: BRAND.amber }} />
        <p className="text-sm text-slate-700">
          Este é o ambiente interno da consolidadora — separado do portal Bússola que as agências acessam. Tudo o que for cadastrado aqui (metas, desafios, campanhas e a régua de níveis de cada agência) passa a valer no Bússola da agência correspondente assim que ela abrir ou atualizar o portal dela, no mesmo navegador.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agencies.map(a => {
          const nivel = tierForVolume(a.annualVolume, a.tierThresholds);
          const metasAtivas = a.goals.filter(g => g.diasRestantes > 0).length;
          // volume do mês (estimado a partir do volume anual) e variação estável
          // vs. o mesmo período do mês anterior — determinístico por agência.
          const hash = a.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
          const volumeMes = Math.round((a.annualVolume / 12) * (1 + ((hash % 13) - 6) / 100));
          const variacaoMes = (hash % 47) - 18;
          return (
            <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" style={{ color: BRAND.teal }} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{a.nome}</p>
                  <p className="text-xs text-slate-400">{a.cidade}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-500">Volume do mês</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatBRL(volumeMes)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-500">vs. mês anterior</span>
                <span className={`font-semibold tabular-nums ${variacaoMes >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {variacaoMes >= 0 ? "▲ +" : "▼ "}{variacaoMes}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-500">Volume 12 meses</span>
                <span className="font-medium text-slate-900 tabular-nums">{formatBRL(a.annualVolume)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-slate-500">Nível atual</span>
                <span className="font-medium" style={{ color: BRAND.tealDark }}>{nivel}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-slate-50 text-slate-600">{metasAtivas} meta{metasAtivas === 1 ? "" : "s"} ativa{metasAtivas === 1 ? "" : "s"}</span>
                <span className="px-2 py-1 rounded-full bg-slate-50 text-slate-600">{a.challenges.length} desafio{a.challenges.length === 1 ? "" : "s"}</span>
              </div>
              <button
                onClick={() => goTo("metas", a.id)}
                className="w-full mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Gerenciar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GoalsModule({ agencies, selectedId, setSelectedId, onAdd, onRemove }) {
  const agency = agencies.find(a => a.id === selectedId) || agencies[0];
  const [form, setForm] = useState({ tipo: "Mensal", titulo: "", metaValor: "", vendido: "R$ 0", dataInicio: "", recompensa: "" });
  const set = k => e => setForm({ ...form, [k]: e.target.value });
  const setMoney = k => e => setForm({ ...form, [k]: formatMoneyInput(e.target.value) });
  const setDate = k => e => setForm({ ...form, [k]: formatDateInput(e.target.value) });
  const valid = form.titulo && form.metaValor && form.recompensa && isDateComplete(form.dataInicio);
  const prazoInfo = isDateComplete(form.dataInicio) ? calcularPrazoMeta(form.tipo, form.dataInicio) : null;

  function submit() {
    if (!valid) return;
    const p = calcularPrazoMeta(form.tipo, form.dataInicio);
    onAdd(agency.id, {
      id: "g_" + Date.now(),
      titulo: form.titulo,
      recompensa: form.recompensa,
      metaValor: parseMoney(form.metaValor),
      vendido: parseMoney(form.vendido),
      prazo: p.prazo,
      diasRestantes: p.diasRestantes,
    });
    setForm({ tipo: "Mensal", titulo: "", metaValor: "", vendido: "R$ 0", dataInicio: "", recompensa: "" });
  }

  const inputCls = "w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-900";

  return (
    <div>
      <SectionTitle
        eyebrow="Metas"
        title="Metas mensais e anuais por agência"      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
        <p className="font-semibold text-slate-900 mb-4">Cadastrar nova meta para {agency.nome}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500">Tipo</label>
            <select value={form.tipo} onChange={set("tipo")} className={inputCls}>
              <option>Mensal</option>
              <option>Trimestral</option>
              <option>Anual</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">Título da meta</label>
            <input value={form.titulo} onChange={set("titulo")} placeholder="Ex: Meta de volume — Julho 2026" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Valor da meta (R$)</label>
            <input inputMode="numeric" value={form.metaValor} onChange={setMoney("metaValor")} placeholder="Ex: R$ 1.000.000" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Valor já vendido (R$)</label>
            <input inputMode="numeric" value={form.vendido} onChange={setMoney("vendido")} placeholder="Ex: R$ 0" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Data de início</label>
            <input inputMode="numeric" maxLength={10} value={form.dataInicio} onChange={setDate("dataInicio")} placeholder="DD/MM/AAAA" className={inputCls} />
            {prazoInfo && (
              <p className="text-xs text-slate-400 mt-1">Meta {form.tipo.toLowerCase()} · termina em {prazoInfo.fimLabel} · {prazoInfo.diasRestantes} dias</p>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-500">Recompensa</label>
            <input value={form.recompensa} onChange={set("recompensa")} placeholder="Ex: R$ 5.000 via Pix" className={inputCls} />
          </div>
        </div>
        <button
          onClick={submit}
          disabled={!valid}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg py-2 px-4 text-sm font-medium text-white disabled:opacity-40"
          style={{ backgroundColor: BRAND.teal }}
        >
          <Plus className="w-4 h-4" /> Cadastrar meta
        </button>
      </div>

      <p className="font-semibold text-slate-900 mb-3">Metas de {agency.nome}</p>
      <div className="space-y-3">
        {agency.goals.length === 0 && <p className="text-sm text-slate-400">Nenhuma meta cadastrada ainda.</p>}
        {agency.goals.map(g => (
          <div key={g.id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{g.titulo}</p>
              <p className="text-xs text-slate-500 mt-0.5">{formatBRL(g.vendido)} de {formatBRL(g.metaValor)} · {g.prazo} · Recompensa: {g.recompensa}</p>
            </div>
            <button onClick={() => onRemove(agency.id, g.id)} className="text-slate-400 hover:text-rose-600 shrink-0" title="Remover meta">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const CHALLENGE_DURATION_OPTIONS = [
  { value: "fim_de_semana", label: "Neste final de semana" },
  { value: "esta_semana", label: "Nesta semana" },
  { value: "fim_do_mes", label: "Até o final deste mês" },
  { value: "fim_do_semestre", label: "Até o final deste semestre" },
  { value: "fim_do_ano", label: "Até o final deste ano" },
  { value: "personalizada", label: "Escolher uma data específica..." },
];

// Calcula quantas horas faltam a partir de agora até o prazo escolhido (aproximado, com base na data/hora do operador).
function calcularHorasAte(opcao, dataPersonalizada) {
  const agora = new Date();
  let alvo;
  if (opcao === "fim_de_semana" || opcao === "esta_semana") {
    const diaSemana = agora.getDay();
    const diasAteDomingo = (7 - diaSemana) % 7;
    alvo = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + diasAteDomingo, 23, 59, 59);
  } else if (opcao === "fim_do_mes") {
    alvo = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);
  } else if (opcao === "fim_do_semestre") {
    alvo = agora.getMonth() <= 5
      ? new Date(agora.getFullYear(), 5, 30, 23, 59, 59)
      : new Date(agora.getFullYear(), 11, 31, 23, 59, 59);
  } else if (opcao === "fim_do_ano") {
    alvo = new Date(agora.getFullYear(), 11, 31, 23, 59, 59);
  } else if (opcao === "personalizada" && dataPersonalizada) {
    const [ano, mes, dia] = dataPersonalizada.split("-").map(Number);
    alvo = new Date(ano, mes - 1, dia, 23, 59, 59);
  } else {
    alvo = new Date(agora.getTime() + 48 * 3600 * 1000);
  }
  const diffMs = alvo.getTime() - agora.getTime();
  return Math.max(1, Math.round(diffMs / 3600000));
}

function ChallengesModule({ agencies, selectedId, setSelectedId, onAdd, onRemove }) {
  const agency = agencies.find(a => a.id === selectedId) || agencies[0];
  const [form, setForm] = useState({ titulo: "", recompensa: "", duracao: "fim_de_semana", dataPersonalizada: "", meta: "5" });
  const set = k => e => setForm({ ...form, [k]: e.target.value });
  const validDate = form.duracao !== "personalizada" || !!form.dataPersonalizada;
  const valid = form.titulo && form.recompensa && form.meta && validDate;

  function submit() {
    if (!valid) return;
    const horas = calcularHorasAte(form.duracao, form.dataPersonalizada);
    onAdd(agency.id, {
      id: "d_" + Date.now(),
      titulo: form.titulo,
      regra: "",
      recompensa: form.recompensa,
      horas,
      meta: parseInt(form.meta, 10) || 1,
      progresso: 0,
    });
    setForm({ titulo: "", recompensa: "", duracao: "fim_de_semana", dataPersonalizada: "", meta: "5" });
  }

  const inputCls = "w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-900";

  return (
    <div>
      <SectionTitle
        eyebrow="Metas relâmpago"
        title="Desafios de curta duração por agência"      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
        <p className="font-semibold text-slate-900 mb-4">Cadastrar novo desafio-relâmpago para {agency.nome}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-500">O que a agência precisa fazer</label>
            <input value={form.titulo} onChange={set("titulo")} placeholder="Ex: Venda 3 bilhetes até domingo" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Recompensa</label>
            <input value={form.recompensa} onChange={set("recompensa")} placeholder="Ex: R$ 50 de bônus extra por bilhete" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Meta (nº de bilhetes)</label>
            <input value={form.meta} onChange={set("meta")} className={inputCls} />
          </div>
          <div className={form.duracao === "personalizada" ? "" : "sm:col-span-2"}>
            <label className="text-xs text-slate-500">Válido até</label>
            <select value={form.duracao} onChange={set("duracao")} className={inputCls}>
              {CHALLENGE_DURATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {form.duracao === "personalizada" && (
            <div>
              <label className="text-xs text-slate-500">Data-limite</label>
              <input type="date" value={form.dataPersonalizada} onChange={set("dataPersonalizada")} className={inputCls} />
            </div>
          )}
        </div>
        <button
          onClick={submit}
          disabled={!valid}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg py-2 px-4 text-sm font-medium text-white disabled:opacity-40"
          style={{ backgroundColor: BRAND.amber }}
        >
          <Plus className="w-4 h-4" /> Cadastrar desafio
        </button>
      </div>

      <p className="font-semibold text-slate-900 mb-3">Desafios ativos de {agency.nome}</p>
      <div className="space-y-3">
        {agency.challenges.length === 0 && <p className="text-sm text-slate-400">Nenhum desafio cadastrado ainda.</p>}
        {agency.challenges.map(c => (
          <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{c.titulo}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.progresso}/{c.meta} bilhetes · {c.horas}h de duração · {c.recompensa}</p>
            </div>
            <button onClick={() => onRemove(agency.id, c.id)} className="text-slate-400 hover:text-rose-600 shrink-0" title="Remover desafio">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TiersModule({ agencies, selectedId, setSelectedId, onSave }) {
  const agency = agencies.find(a => a.id === selectedId) || agencies[0];
  const [form, setForm] = useState({
    ouro: formatMoneyInput(String(agency.tierThresholds.ouro)),
    diamante: formatMoneyInput(String(agency.tierThresholds.diamante)),
  });

  useEffect(() => {
    setForm({
      ouro: formatMoneyInput(String(agency.tierThresholds.ouro)),
      diamante: formatMoneyInput(String(agency.tierThresholds.diamante)),
    });
  }, [agency.id]);

  const setMoney = k => e => setForm({ ...form, [k]: formatMoneyInput(e.target.value) });

  function submit() {
    onSave(agency.id, {
      prata: 0,
      ouro: parseMoney(form.ouro),
      diamante: parseMoney(form.diamante),
    });
  }

  const inputCls = "w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-900";
  const nivelAtual = tierForVolume(agency.annualVolume, agency.tierThresholds);

  return (
    <div>
      <SectionTitle
        eyebrow="Régua de relacionamento"
        title="Volume necessário para cada nível, por agência"      />
      <div className="rounded-xl p-4 mb-6 flex gap-3 items-start" style={{ backgroundColor: "#EAF6F4" }}>
        <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: BRAND.tealDark }} />
        <p className="text-sm text-slate-700">
          Cada agência pode ter sua própria régua de níveis, conforme o que for negociado com a consolidadora. O nível é calculado automaticamente no Bússola comparando o volume de vendas dos últimos 12 meses da agência com os limites definidos abaixo.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 max-w-lg">
        <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-slate-100">
          <span className="text-slate-500">Volume 12 meses de {agency.nome}</span>
          <span className="font-medium text-slate-900">{formatBRL(agency.annualVolume)}</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-5">
          <span className="text-slate-500">Nível atual (com a régua abaixo)</span>
          <span className="font-medium" style={{ color: BRAND.tealDark }}>{nivelAtual}</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500">Prata — a partir de</label>
            <input value="R$ 0 (fixo, nível de entrada)" disabled className={inputCls + " opacity-60"} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Ouro — a partir de (R$ em 12 meses)</label>
            <input inputMode="numeric" value={form.ouro} onChange={setMoney("ouro")} className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Diamante — a partir de (R$ em 12 meses)</label>
            <input inputMode="numeric" value={form.diamante} onChange={setMoney("diamante")} className={inputCls} />
          </div>
        </div>
        <button
          onClick={submit}
          className="mt-5 w-full inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-white"
          style={{ backgroundColor: BRAND.teal }}
        >
          <Save className="w-4 h-4" /> Salvar níveis de {agency.nome}
        </button>
      </div>
    </div>
  );
}

function CampaignsModule({ agencies, campaigns, onAdd, onRemove }) {
  const [form, setForm] = useState({
    companhia: "", tipo: "bonus", regra: "", recompensa: "", valor: "", inicio: "", fim: "", meta: "5", elegibilidade: "todas",
  });
  const [selectedAgencies, setSelectedAgencies] = useState([]);
  const set = k => e => setForm({ ...form, [k]: e.target.value });
  const setDate = k => e => setForm({ ...form, [k]: formatDateInput(e.target.value) });
  // valor: máscara de R$ quando bônus; número puro quando incentivo (%)
  const setValor = e => setForm(f => ({ ...f, valor: f.tipo === "bonus" ? formatMoneyInput(e.target.value) : e.target.value.replace(/\D/g, "") }));
  const setTipo = e => setForm(f => ({ ...f, tipo: e.target.value, valor: "" }));
  const valid = form.companhia && form.regra && form.recompensa && form.valor && isDateComplete(form.inicio) && isDateComplete(form.fim);

  function toggleAgency(id) {
    setSelectedAgencies(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  }

  function submit() {
    if (!valid) return;
    const base = {
      id: "c_" + Date.now(),
      companhia: form.companhia,
      status: "Ativa",
      tipo: form.tipo,
      regra: form.regra,
      recompensa: form.recompensa,
      inicio: form.inicio,
      fim: form.fim,
      meta: form.tipo === "bonus" ? (parseInt(form.meta, 10) || null) : null,
      tickets: [],
      regrasDetalhadas: [`Válido entre ${form.inicio} e ${form.fim}.`, "Cadastrado via Backoffice TPAir."],
      agenciasElegiveis: form.elegibilidade === "todas" ? "todas" : selectedAgencies,
    };
    if (form.tipo === "bonus") base.valorPorBilhete = parseMoney(form.valor);
    else base.percentualIncentivo = parseInt(String(form.valor).replace(/\D/g, ""), 10) || 0;
    onAdd(base);
    setForm({ companhia: "", tipo: "bonus", regra: "", recompensa: "", valor: "", inicio: "", fim: "", meta: "5", elegibilidade: "todas" });
    setSelectedAgencies([]);
  }

  const inputCls = "w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-900";

  return (
    <div>
      <SectionTitle eyebrow="Campanhas" title="Campanhas ativas com companhias aéreas" />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
        <p className="font-semibold text-slate-900 mb-4">Cadastrar nova campanha</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500">Companhia aérea</label>
            <input value={form.companhia} onChange={set("companhia")} placeholder="Ex: LATAM" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Tipo</label>
            <select value={form.tipo} onChange={setTipo} className={inputCls}>
              <option value="bonus">Bônus por emissão (valor fixo)</option>
              <option value="incentivo">Incentivo de comissão (percentual)</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-500">Regra</label>
            <input value={form.regra} onChange={set("regra")} placeholder="Ex: Emita 5 bilhetes em Classe Executiva" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Recompensa (texto exibido)</label>
            <input value={form.recompensa} onChange={set("recompensa")} placeholder="Ex: R$ 150 por emissão, via Pix" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-500">{form.tipo === "bonus" ? "Valor por bilhete (R$)" : "Percentual de incentivo (%)"}</label>
            <input inputMode="numeric" value={form.valor} onChange={setValor} placeholder={form.tipo === "bonus" ? "Ex: R$ 150" : "Ex: 3"} className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Início</label>
            <input inputMode="numeric" maxLength={10} value={form.inicio} onChange={setDate("inicio")} placeholder="DD/MM/AAAA" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Fim</label>
            <input inputMode="numeric" maxLength={10} value={form.fim} onChange={setDate("fim")} placeholder="DD/MM/AAAA" className={inputCls} />
          </div>
          {form.tipo === "bonus" && (
            <div>
              <label className="text-xs text-slate-500">Meta de bilhetes (opcional)</label>
              <input value={form.meta} onChange={set("meta")} className={inputCls} />
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-500">Elegibilidade</label>
            <select value={form.elegibilidade} onChange={set("elegibilidade")} className={inputCls}>
              <option value="todas">Todas as agências</option>
              <option value="especificas">Agências específicas</option>
            </select>
          </div>
          {form.elegibilidade === "especificas" && (
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              {agencies.map(a => (
                <button
                  key={a.id}
                  onClick={() => toggleAgency(a.id)}
                  className="text-xs px-3 py-1.5 rounded-full border"
                  style={selectedAgencies.includes(a.id) ? { backgroundColor: "#EAF6F4", color: BRAND.tealDark, borderColor: "#CCEAE6" } : { borderColor: "#E2E8F0", color: "#475569" }}
                >
                  {a.nome}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={submit}
          disabled={!valid}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg py-2 px-4 text-sm font-medium text-white disabled:opacity-40"
          style={{ backgroundColor: BRAND.teal }}
        >
          <Plus className="w-4 h-4" /> Cadastrar campanha
        </button>
      </div>

      <p className="font-semibold text-slate-900 mb-3">Campanhas cadastradas</p>
      <div className="space-y-3">
        {campaigns.map(c => (
          <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{c.companhia} · {c.regra}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {c.inicio} – {c.fim} · {c.recompensa} · Elegibilidade: {c.agenciasElegiveis === "todas" ? "todas as agências" : `${c.agenciasElegiveis.length} agência(s) selecionada(s)`}
              </p>
            </div>
            <button onClick={() => onRemove(c.id)} className="text-slate-400 hover:text-rose-600 shrink-0" title="Remover campanha">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImportModule({ agencies, onApply }) {
  const [rows, setRows] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  function downloadTemplate() {
    const header = "agencia_id,tipo,titulo,meta_valor,vendido,dias_restantes,recompensa";
    const example = agencies.slice(0, 2).map(a =>
      `${a.id},Mensal,Meta de volume - Julho 2026,1000000,0,31,R$ 5.000 via Pix`
    ).join("\n");
    const csv = header + "\n" + example;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modelo_metas_bussola.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const header = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).filter(Boolean).map(line => {
      const cols = line.split(",").map(c => c.trim());
      const obj = {};
      header.forEach((h, i) => { obj[h] = cols[i]; });
      return obj;
    });
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseCSV(String(reader.result));
        setRows(parsed);
      } catch (err) {
        setRows([]);
      }
    };
    reader.readAsText(file);
  }

  function confirmImport() {
    if (!rows || rows.length === 0) return;
    const byAgency = {};
    rows.forEach(r => {
      if (!r.agencia_id) return;
      const dias = parseInt(r.dias_restantes, 10) || 0;
      const goal = {
        id: "imp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
        titulo: r.titulo || "Meta importada",
        recompensa: r.recompensa || "A combinar",
        metaValor: parseFloat(r.meta_valor) || 0,
        vendido: parseFloat(r.vendido) || 0,
        prazo: dias > 0 ? `${dias} dias restantes` : "Concluída",
        diasRestantes: dias,
      };
      byAgency[r.agencia_id] = byAgency[r.agencia_id] || [];
      byAgency[r.agencia_id].push(goal);
    });
    onApply(byAgency);
    setRows(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const knownIds = new Set(agencies.map(a => a.id));

  return (
    <div>
      <SectionTitle eyebrow="Importação em lote" title="Cadastrar metas de várias agências de uma vez" />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
        <p className="font-semibold text-slate-900 mb-2">Como funciona</p>
        <p className="text-sm text-slate-500 mb-4">
          Baixe o modelo, preencha uma linha por meta (uma agência pode ter várias linhas) usando o identificador exato da agência, e importe o arquivo de volta aqui.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={downloadTemplate} className="inline-flex items-center gap-1.5 rounded-lg py-2 px-4 text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50">
            <Download className="w-4 h-4" /> Baixar modelo CSV
          </button>
          <label className="inline-flex items-center gap-1.5 rounded-lg py-2 px-4 text-sm font-medium text-white cursor-pointer" style={{ backgroundColor: BRAND.teal }}>
            <Upload className="w-4 h-4" /> Selecionar arquivo CSV
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </label>
          {fileName && <span className="text-sm text-slate-500 self-center">{fileName}</span>}
        </div>
      </div>

      {rows && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="font-semibold text-slate-900 mb-4">Prévia — {rows.length} linha{rows.length === 1 ? "" : "s"} encontrada{rows.length === 1 ? "" : "s"}</p>
          <div className="overflow-x-auto -mx-1 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 px-1 font-medium">Agência</th>
                  <th className="py-2 px-1 font-medium">Título</th>
                  <th className="py-2 px-1 font-medium">Meta (R$)</th>
                  <th className="py-2 px-1 font-medium">Dias restantes</th>
                  <th className="py-2 px-1 font-medium">Recompensa</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 px-1">
                      {knownIds.has(r.agencia_id)
                        ? <span className="text-slate-700">{r.agencia_id}</span>
                        : <span className="text-rose-600 inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {r.agencia_id || "—"} (id não encontrado)</span>}
                    </td>
                    <td className="py-2 px-1 text-slate-700">{r.titulo}</td>
                    <td className="py-2 px-1 text-slate-700">{formatBRL(r.meta_valor)}</td>
                    <td className="py-2 px-1 text-slate-700">{r.dias_restantes}</td>
                    <td className="py-2 px-1 text-slate-700">{r.recompensa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={confirmImport} className="inline-flex items-center gap-1.5 rounded-lg py-2 px-4 text-sm font-medium text-white" style={{ backgroundColor: BRAND.teal }}>
            <CheckCircle2 className="w-4 h-4" /> Confirmar importação
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- app shell ----------
export default function TPAirBackoffice() {
  const initial = loadInitialState();
  const [agencies, setAgencies] = useState(initial.agencies);
  const [campaigns, setCampaigns] = useState(initial.campaigns);
  const [active, setActive] = useState("visao");
  const [selectedAgencyId, setSelectedAgencyId] = useState(null);
  const [toast, setToast] = useState(null);

  function exitAgency() {
    setSelectedAgencyId(null);
    setActive("visao");
  }

  useEffect(() => {
    persist(agencies, campaigns);
  }, [agencies, campaigns]);

  function goTo(tab, agencyId) {
    setActive(tab);
    if (agencyId) setSelectedAgencyId(agencyId);
  }

  function addGoal(agencyId, goal) {
    setAgencies(list => list.map(a => a.id === agencyId ? { ...a, goals: [...a.goals, goal] } : a));
    setToast("Meta cadastrada. Já reflete no Bússola da agência.");
  }
  function removeGoal(agencyId, goalId) {
    setAgencies(list => list.map(a => a.id === agencyId ? { ...a, goals: a.goals.filter(g => g.id !== goalId) } : a));
  }
  function addChallenge(agencyId, challenge) {
    setAgencies(list => list.map(a => a.id === agencyId ? { ...a, challenges: [...a.challenges, challenge] } : a));
    setToast("Desafio-relâmpago cadastrado. Já reflete no Bússola da agência.");
  }
  function removeChallenge(agencyId, challengeId) {
    setAgencies(list => list.map(a => a.id === agencyId ? { ...a, challenges: a.challenges.filter(c => c.id !== challengeId) } : a));
  }
  function saveTiers(agencyId, newThresholds) {
    setAgencies(list => list.map(a => a.id === agencyId ? { ...a, tierThresholds: newThresholds } : a));
    const agencyName = agencies.find(a => a.id === agencyId)?.nome || "";
    setToast(`Níveis de ${agencyName} atualizados.`);
  }
  function addCampaign(campaign) {
    setCampaigns(list => [...list, campaign]);
    setToast("Campanha cadastrada e já visível nas agências elegíveis.");
  }
  function removeCampaign(campaignId) {
    setCampaigns(list => list.filter(c => c.id !== campaignId));
  }
  function applyImport(byAgency) {
    setAgencies(list => list.map(a => {
      const newGoals = byAgency[a.id];
      if (!newGoals) return a;
      return { ...a, goals: [...a.goals, ...newGoals] };
    }));
    const count = Object.values(byAgency).reduce((s, arr) => s + arr.length, 0);
    setToast(`${count} meta(s) importada(s) com sucesso.`);
  }

  const managingAgency = selectedAgencyId ? agencies.find(a => a.id === selectedAgencyId) : null;
  const agencyScoped = active === "metas" || active === "desafios" || active === "niveis";
  // proteção: sem agência selecionada não dá pra abrir telas de gestão
  const activeSafe = agencyScoped && !managingAgency ? "visao" : active;

  const content = {
    visao: <OverviewModule agencies={agencies} goTo={goTo} />,
    metas: <GoalsModule agencies={agencies} selectedId={selectedAgencyId} onAdd={addGoal} onRemove={removeGoal} />,
    desafios: <ChallengesModule agencies={agencies} selectedId={selectedAgencyId} onAdd={addChallenge} onRemove={removeChallenge} />,
    niveis: <TiersModule agencies={agencies} selectedId={selectedAgencyId} onSave={saveTiers} />,
    campanhas: <CampaignsModule agencies={agencies} campaigns={campaigns} onAdd={addCampaign} onRemove={removeCampaign} />,
  }[activeSafe];

  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-slate-900" style={{ fontFamily: "Arial, ui-sans-serif, system-ui" }}>
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-6 pt-6 pb-5">
          <Logo />
          <p className="text-xs font-semibold uppercase tracking-wide mt-3 px-2 py-1 rounded-md inline-block" style={{ backgroundColor: "#1E2761", color: "#FFFFFF" }}>
            Backoffice · Consolidadora
          </p>
        </div>
        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="space-y-1">
            {GLOBAL_NAV.map(item => {
              const Icon = item.icon;
              const isActive = activeSafe === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-slate-100"
                  style={isActive ? { backgroundColor: "#EAF6F4", color: BRAND.tealDark, fontWeight: 600 } : { color: "#475569" }}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {managingAgency && (
            <div className="mt-6">
              <div className="px-3 mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Gerenciando</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">{managingAgency.nome}</p>
                </div>
                <button onClick={exitAgency} title="Sair da agência" className="text-slate-400 hover:text-slate-700 shrink-0 mt-0.5">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {AGENCY_NAV.map(item => {
                  const Icon = item.icon;
                  const isActive = activeSafe === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActive(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-slate-100"
                      style={isActive ? { backgroundColor: "#EAF6F4", color: BRAND.tealDark, fontWeight: 600 } : { color: "#475569" }}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
        <div className="px-6 py-5 border-t border-slate-100">
          <p className="text-xs text-slate-400">{agencies.length} agências conectadas ao Bússola</p>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8 max-w-6xl">
        {content}
      </main>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
