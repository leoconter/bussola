# TPAir Bússola

Replicação em **Next.js (App Router)** dos dois protótipos gerados no Claude:

- **Bússola** — portal das agências (desempenho, metas, campanhas, incentivos, conquistas, perfil).
- **Backoffice** — admin que cadastra metas, desafios, campanhas, níveis e importa planilhas.

Os dois apps se comunicam pela **mesma chave de `localStorage`** (`tpair_bussola_shared_data_v1`)
no mesmo navegador: o Backoffice grava, o Bússola lê. Não há backend.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse:

- http://localhost:3000/ — página inicial com os dois acessos
- http://localhost:3000/bussola — portal da agência
- http://localhost:3000/backoffice — admin

Para testar a integração, abra o **Backoffice**, cadastre/edite dados de uma agência
e depois abra o **Bússola** no mesmo navegador — os dados refletem.

## Estrutura

```
app/
├── layout.jsx            # layout raiz + globals.css
├── page.jsx             # landing com links para os dois apps
├── globals.css          # Tailwind (base/components/utilities)
├── bussola/page.jsx     # rota /bussola
└── backoffice/page.jsx  # rota /backoffice
components/
├── TPAirBussolaDashboard.jsx   # componente do portal (client)
└── TPAirBackoffice.jsx         # componente do admin (client)
origem-claude/            # arquivos originais exportados do Claude (referência)
```

## Stack

- Next.js 14 (App Router) · React 18
- Tailwind CSS (`darkMode: "class"`)
- lucide-react (ícones) · recharts (gráficos, só no Bússola)

## Notas de portabilidade

- Os componentes são `"use client"` (usam hooks, `window` e `localStorage`).
- As fontes Montserrat e o logo estão embutidos em base64 nos componentes
  (herdado do protótipo original) — por isso o bundle do `/bussola` é grande.
  Um passo de otimização futuro seria migrar para `next/font` e mover os assets
  para `public/`.
```
