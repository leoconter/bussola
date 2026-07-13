"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/* ---- split-flap text: scrambles, then locks tile by tile ---- */
function FlapText({ text }) {
  const final = text.toUpperCase().split("");
  const [chars, setChars] = useState(() => final.map((c) => (c === " " ? " " : "")));
  const [locked, setLocked] = useState(() => final.map(() => false));

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setChars(final);
      setLocked(final.map(() => true));
      return;
    }

    const timers = [];
    const lockRef = { current: final.map(() => false) };

    // scramble unlocked, non-space tiles
    const scramble = setInterval(() => {
      setChars((prev) =>
        prev.map((c, i) =>
          final[i] === " " || lockRef.current[i]
            ? final[i] === " "
              ? " "
              : c
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        )
      );
    }, 55);

    // progressive lock, left to right
    final.forEach((c, i) => {
      const t = setTimeout(() => {
        lockRef.current[i] = true;
        setLocked((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        setChars((prev) => {
          const next = [...prev];
          next[i] = c;
          return next;
        });
        if (i === final.length - 1) clearInterval(scramble);
      }, 260 + i * 65);
      timers.push(t);
    });

    return () => {
      clearInterval(scramble);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className={styles.flap} aria-hidden="true">
      {chars.map((c, i) =>
        final[i] === " " ? (
          <span key={i} className={`${styles.tile} ${styles.tileSpace}`} />
        ) : (
          <span
            key={i}
            className={`${styles.tile} ${locked[i] ? "" : styles.scrambling}`}
          >
            {c || " "}
          </span>
        )
      )}
    </span>
  );
}

function CompassMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={styles.brandMark} aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
      <path d="M16 5.5 L19 16 L16 26.5 L13 16 Z" fill="currentColor" opacity="0.9" />
      <path d="M16 5.5 L19 16 L16 16 Z" fill="#fff" opacity="0.55" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className={styles.goArrow} aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DEPARTURES = [
  {
    href: "/bussola",
    flight: "TP 01",
    dest: "Portal da Agência",
    who: "Acompanhe metas, campanhas e incentivos",
    whoSub: "Agências parceiras",
    label: "Entrar no Portal da Agência",
  },
  {
    href: "/backoffice",
    flight: "TP 02",
    dest: "Backoffice",
    who: "Defina o rumo e cadastre as campanhas",
    whoSub: "Operação TPAir",
    label: "Abrir o Backoffice",
  },
];

export default function Home() {
  const [theme, setTheme] = useState(null);
  const [clock, setClock] = useState("--:--");
  const started = useRef(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("tpair_landing_theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
    const tick = () => {
      const d = new Date();
      setClock(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  function toggleTheme() {
    const isDark =
      theme === "dark" ||
      (theme === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const next = isDark ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("tpair_landing_theme", next);
  }

  return (
    <main className={styles.root}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <CompassMark />
          <span className={styles.brandText}>
            <span className={styles.brandName}>TPAir Bússola</span>
            <span className={styles.brandSub}>Consolidadora Aérea</span>
          </span>
        </div>
        <button className={styles.themeBtn} onClick={toggleTheme} type="button">
          Tema
        </button>
      </header>

      <section className={styles.board} aria-label="Painel de partidas — escolha um ambiente">
        <div className={styles.boardHead}>
          <div className={styles.boardTitle}>
            <span className={styles.liveDot} />
            <span className={styles.boardTitleText}>Partidas</span>
          </div>
          <div className={styles.boardMeta}>
            <span className={styles.clock}>{clock}</span>
            <span>GRU · TPAir OPS</span>
          </div>
        </div>

        <div className={`${styles.grid} ${styles.colHead}`} aria-hidden="true">
          <span>Voo</span>
          <span>Destino</span>
          <span>Para</span>
          <span className={styles.colGoLbl}>Embarque</span>
        </div>

        <div className={styles.rows}>
          {DEPARTURES.map((d) => (
            <Link key={d.href} href={d.href} className={`${styles.grid} ${styles.row}`} aria-label={d.label}>
              <span className={styles.flight}>{d.flight}</span>
              <FlapText text={d.dest} />
              <span className={styles.who}>
                {d.who}
                <span className={styles.whoSub}>{d.whoSub}</span>
              </span>
              <span className={styles.go}>
                Embarcar <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <p className={styles.lede}>
        Dois destinos, um só instrumento. As <strong>agências</strong> acompanham
        desempenho, metas e incentivos; a <strong>operação TPAir</strong> define o
        rumo. Os dois ambientes compartilham os mesmos dados no navegador.
      </p>

      <footer className={styles.footer}>
        <span className={styles.footNote}>
          <span className={styles.footDot} />
          Protótipo — dados de exemplo, sem backend.
        </span>
        <span className={styles.footCoord}>GRU 23°26′S 046°28′W</span>
      </footer>
    </main>
  );
}
