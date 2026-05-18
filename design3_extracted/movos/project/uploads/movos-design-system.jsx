import { useState } from "react";

const T = {
  gold: "#C8A96E", blue: "#7EB8C9", purple: "#9B7EC8",
  green: "#6DBF8E", red: "#C97E7E", orange: "#C9956E",
  yellow: "#C9B87E", lime: "#A8C96E", slate: "#7E9BC9",
  critical: "#C97E7E", warning: "#C9B87E",
  bg: "#080808", bg1: "#0D0D0D", bg2: "#111111", bg3: "#161616",
  border: "#1C1C1C", border2: "#242424",
  dim: "#3A3A3A", muted: "#555", soft: "#888",
  text: "#E2D9C8", textDim: "#AAA",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "identity",    label: "Brand Identity",      color: T.gold   },
  { id: "typography",  label: "Typography",           color: T.blue   },
  { id: "color",       label: "Color System",         color: T.purple },
  { id: "grid",        label: "Grid & Spacing",       color: T.green  },
  { id: "components",  label: "Components",           color: T.orange },
  { id: "screens",     label: "Screen Specs",         color: T.slate  },
  { id: "mobile",      label: "Mobile (CarCheck)",    color: T.lime   },
  { id: "states",      label: "States & Interactions",color: T.yellow },
  { id: "prompt",      label: "Claude Prompt",        color: T.gold   },
];

const SCREENS_LIST = [
  { id: "dashboard",    name: "Dashboard",        role: "Admin / Management", desc: "Main operational command center. KPIs, critical alerts, service alerts, fleet by location, parts alerts, long-term contracts." },
  { id: "operations",   name: "Operations",       role: "Admin / Management / Operator", desc: "Fleet and maintenance cycles as visual pipeline stages. Parts alerts. Cars per repair location." },
  { id: "fleet",        name: "Fleet",            role: "All roles",          desc: "Full vehicle list with sidebar filters: category, location, ops cycle, maintenance cycle, contract type." },
  { id: "vehicle",      name: "Vehicle File",     role: "All roles",          desc: "Single vehicle profile. Template fields, manufacturer service schedule, QR code, manual alert creation, event history timeline." },
  { id: "inspections",  name: "Inspections",      role: "All roles",          desc: "Inspection queue, active inspection detail, before/after comparison view." },
  { id: "maintenance",  name: "Maintenance",      role: "Admin / Management / Mechanic", desc: "Repair ticket list, ticket detail, service log, preventive maintenance rules." },
  { id: "contracts",    name: "Contracts",        role: "Admin / Management", desc: "Short-term rental sync (Karve), long-term contract management. Assigned vehicles per contract." },
  { id: "analytics",    name: "Analytics",        role: "Admin / Management", desc: "Utilization, downtime, cost per vehicle, inspection quality, damage trends, branch comparison." },
  { id: "intelligence", name: "Intelligence",     role: "Admin only",         desc: "TOP MANAGEMENT. Vehicle performance scores, shop analysis, revenue ranking, depreciation, sell recommendations, category benchmarks." },
  { id: "mobile",       name: "Mobile App",       role: "Inspector / Operator / Mechanic", desc: "CarCheck inspections (checklist, damage map, photos, signature) + maintenance cycle management + QR scan + alerts." },
];

const COLOR_TOKENS = [
  { token: "--color-gold",     hex: "#C8A96E", role: "Primary brand, gold accents, KPI highlights, vehicle unit IDs" },
  { token: "--color-blue",     hex: "#7EB8C9", role: "Information, assigned status, reservations sync, inspection module" },
  { token: "--color-green",    hex: "#6DBF8E", role: "Available, pass, cleared, positive metrics, hold recommendation" },
  { token: "--color-red",      hex: "#C97E7E", role: "Critical alerts, damage, out of service, sell recommendation" },
  { token: "--color-orange",   hex: "#C9956E", role: "Warning, manual alerts, move to maintenance, evaluate recommendation" },
  { token: "--color-yellow",   hex: "#C9B87E", role: "Service warnings, cleaning status, assigned-to-tech stage" },
  { token: "--color-purple",   hex: "#9B7EC8", role: "Maintenance module, repair tickets, under repair stage" },
  { token: "--color-slate",    hex: "#7E9BC9", role: "Infrastructure layer, post-inspection stage, auth module" },
  { token: "--color-lime",     hex: "#A8C96E", role: "Analytics, category tab, cleared stage" },
  { token: "--bg",             hex: "#080808", role: "Page background — near-black" },
  { token: "--bg-1",           hex: "#0D0D0D", role: "Card background, nav bar, sidebar" },
  { token: "--bg-2",           hex: "#111111", role: "Hover state, table row hover, nested panels" },
  { token: "--bg-3",           hex: "#161616", role: "Input backgrounds, progress bar tracks, deep nested" },
  { token: "--border",         hex: "#1C1C1C", role: "Default border — all cards, tables, dividers" },
  { token: "--border-2",       hex: "#242424", role: "Elevated border — modals, phone frames" },
  { token: "--text",           hex: "#E2D9C8", role: "Primary text — warm white, not pure white" },
  { token: "--text-dim",       hex: "#AAAAAA", role: "Secondary text — model names, descriptions" },
  { token: "--muted",          hex: "#555555", role: "Tertiary text — labels, timestamps, branch names" },
  { token: "--dim",            hex: "#3A3A3A", role: "Disabled / inactive text — placeholder, step numbers" },
];

const TYPE_RULES = [
  { role: "Display / Hero Numbers", font: "Bebas Neue", size: "44–52px", tracking: "0.05–0.08em", weight: "400", use: "KPI values, large counts, vehicle unit IDs in headers" },
  { role: "Section Headings",       font: "Bebas Neue", size: "24–32px", tracking: "0.08em",     weight: "400", use: "Screen titles, module headers, modal titles" },
  { role: "Card Labels",            font: "Bebas Neue", size: "16–22px", tracking: "0.06–0.08em",weight: "400", use: "Card titles, location names, contract client names" },
  { role: "Body / Data",            font: "DM Mono",    size: "11–13px", tracking: "0.03–0.05em",weight: "400", use: "Model names, descriptions, detail text, notes" },
  { role: "Labels / Caps",          font: "DM Mono",    size: "8–10px",  tracking: "0.15–0.2em", weight: "400", use: "Column headers, section labels, badge text — always uppercase" },
  { role: "Micro",                  font: "DM Mono",    size: "7–9px",   tracking: "0.1–0.15em", weight: "300", use: "Timestamps, sub-labels, diagram zone labels" },
];

const COMPONENT_SPECS = [
  {
    name: "KPI Card",
    color: T.gold,
    rules: [
      "Top border: 2px solid, color matches data category",
      "Background: --bg-1, hover: --bg-2",
      "Label: 9px DM Mono, uppercase, --muted, 0.2em tracking",
      "Value: 44px Bebas Neue, category color",
      "Sub-label: 10px DM Mono, --muted or warning color if alerting",
      "'VIEW →' label: absolute bottom-right, 9px, appears on hover",
      "Click always opens filtered vehicle list",
      "Never show a KPI card without a drill-down target",
    ],
  },
  {
    name: "Section Label",
    color: T.blue,
    rules: [
      "3px vertical bar left, category color",
      "9px DM Mono uppercase label, --muted",
      "Optional count badge: 9px, category color, bordered pill",
      "16px margin-bottom minimum",
      "Used before every content block — never skip it",
    ],
  },
  {
    name: "Status Badge",
    color: T.green,
    rules: [
      "Font: 9–10px DM Mono uppercase, 0.08–0.12em tracking",
      "Border: 1px solid color at 33–44% opacity",
      "Background: color at 10–15% opacity",
      "Text: full color",
      "Never use filled background badges — always outlined with opacity fill",
      "Padding: 2px 6–8px",
    ],
  },
  {
    name: "Table Row",
    color: T.slate,
    rules: [
      "Height: 40–44px, padding 10–12px 16px",
      "Hover: background --bg-2, transition 0.15s",
      "Border-bottom: 1px solid --border",
      "Alert vehicles: 2px solid left border in alert color",
      "Column headers: 8px DM Mono uppercase, --dim, sticky",
      "Sortable columns: gold color + ▲▼ indicator when active",
      "Always clickable — opens vehicle detail or relevant drill-down",
    ],
  },
  {
    name: "Cycle Card (Pipeline Stage)",
    color: T.purple,
    rules: [
      "Top border: 3px solid, stage color",
      "Background step number: Bebas Neue, 32–36px, color at 7–8% opacity, top-right",
      "Value: 38–52px Bebas Neue, stage color",
      "Progress bar: 2px, --bg-3 track, stage color fill = (value / total) %",
      "Arrow connector between cards: --dim color, NOT stage color",
      "Hover lifts border to color at 55% opacity",
      "Always click to filtered vehicle list",
    ],
  },
  {
    name: "Alert Row",
    color: T.critical,
    rules: [
      "Critical alerts: 2px red left border on urgent items",
      "Service alerts: 2px left border in warning/critical color",
      "Grid layout — columns consistent across all rows in a table",
      "Source badge (Damage vs Manager): separate colors, never merge",
      "'View All' footer row: centered, category color, 10px uppercase",
      "Hover: --bg-2 background",
    ],
  },
  {
    name: "Modal / Drill-Down",
    color: T.gold,
    rules: [
      "Overlay: rgba(0,0,0,0.88)",
      "Panel: --bg-1, 1px solid --border-2",
      "Top accent: 2px solid, context color",
      "Header: title in context color (Bebas Neue 22px), subtitle in --muted",
      "Close button: 28×28px, 1px --border, --muted ✕",
      "Filter bar below header: branch chips, result count right-aligned",
      "Click outside closes",
      "Never use full-screen modals on desktop",
    ],
  },
  {
    name: "Location / Repair Location Card",
    color: T.blue,
    rules: [
      "Top border: 2px solid, location color",
      "Utilization bar: 2–4px, --bg-3 track",
      "Stats grid: 3–4 columns, Bebas Neue 18–20px values",
      "Footer line: utilization % + 'VIEW →', color on hover",
      "Stacked bar for repair locations: 4 segments (waiting/in-progress/inspected/cleared)",
    ],
  },
  {
    name: "Action Button",
    color: T.gold,
    rules: [
      "No border-radius — always sharp corners (0px)",
      "Primary: color at 22% opacity fill, 55% opacity border, full color text",
      "Secondary: no fill, --border, --muted text",
      "Danger: --critical at 22% opacity fill, --critical text",
      "Hover: opacity increases to 33% fill",
      "Font: 10–11px DM Mono uppercase, 0.10–0.12em tracking",
      "Padding: 10–13px 16px",
      "Never use rounded buttons anywhere in the system",
    ],
  },
];

const MOBILE_RULES = [
  "Phone frame: border-radius 40px, 12px padding, --border-2 border",
  "Screen border-radius: 28px inner",
  "Status bar: 10px DM Mono, time left, MovOS center (gold Bebas Neue 12px), signal right",
  "Bottom nav: 5 items — Tasks, Fleet, Inspect, Maintain, Alerts",
  "Active nav icon: full opacity + gold label. Inactive: 30% opacity",
  "All headers: sticky with --bg background",
  "Touch targets: minimum 44×44px for all interactive elements",
  "Fuel level: 8-segment tap bar, gold fill",
  "Checklist items: OK / ISSUE / N/A three-option row, full width",
  "Damage map: SVG top-down car, all zones tappable, colored damage markers",
  "Damage panel: slides up from bottom (bottom sheet pattern)",
  "Photo slots: 64×64px tap tiles, 📷 empty / 🖼 filled",
  "Signature pad: full-width white background area, timestamp below",
  "Pipeline stages: vertical timeline with dot + line connectors",
  "QR scan area: dashed border, tap to simulate scan",
];

const GRID_RULES = [
  { context: "Desktop nav",          spec: "52px height, sticky, z-index 10" },
  { context: "Page padding",         spec: "24px top/bottom, 32px left/right" },
  { context: "Max content width",    spec: "1400px, centered" },
  { context: "KPI row",              spec: "5 equal columns, 10px gap" },
  { context: "Alert row (2-up)",     spec: "2 equal columns, 16px gap" },
  { context: "Location cards",       spec: "4 equal columns, 10px gap" },
  { context: "Contract cards",       spec: "2 equal columns, 10px gap" },
  { context: "Fleet sidebar",        spec: "220px fixed, rest fluid" },
  { context: "Intelligence KPIs",    spec: "6 equal columns, 10px gap" },
  { context: "Vehicle file tabs",    spec: "Full width tab strip, borderBottom 2px active" },
  { context: "Section label margin", spec: "12–16px below label, 28px below section block" },
  { context: "Card inner padding",   spec: "16–22px, consistent within card type" },
  { context: "Table row height",     spec: "40–44px, 10–16px horizontal padding" },
  { context: "Mobile phone width",   spec: "375px, fixed" },
  { context: "Mobile phone height",  spec: "760–780px visible screen area" },
];

const INTERACTION_RULES = [
  { trigger: "Hover on card",             response: "Background → --bg-2, border opacity increases, 0.15s transition" },
  { trigger: "Hover on KPI card",         response: "'VIEW →' label appears bottom-right in category color" },
  { trigger: "Click KPI or cycle stage",  response: "Opens drill-down modal with filtered vehicle list" },
  { trigger: "Click table row",           response: "Opens vehicle quick-view modal or vehicle file" },
  { trigger: "Click alert row",           response: "Opens vehicle-specific alert detail modal" },
  { trigger: "Click location card",       response: "Opens vehicle list filtered to that branch" },
  { trigger: "Click contract card",       response: "Opens vehicle list filtered to that contract" },
  { trigger: "Hover table row",           response: "Background → --bg-2, 0.15s" },
  { trigger: "Sort column header click",  response: "Gold color, ▲▼ indicator, direction toggles" },
  { trigger: "Filter chip click",         response: "Active state: category color border + 11% fill" },
  { trigger: "Drill modal backdrop click",response: "Modal closes" },
  { trigger: "Mobile zone tap (damage)",  response: "Bottom panel slides up, zone pre-filled" },
  { trigger: "Mobile checklist item",     response: "OK/ISSUE/N/A instant tap, no confirm needed" },
  { trigger: "Major damage save",         response: "Auto-trigger: Out of Service + repair ticket + management alert" },
  { trigger: "Maintenance stage move",    response: "Confirmation banner inline, event logged to history" },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function SLabel({ label, color = T.dim }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 3, height: 14, background: color }} />
      <span style={{ fontSize: 9, color: T.muted, letterSpacing: "0.2em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function Chip({ label, color }) {
  return (
    <span style={{ fontSize: 9, color, padding: "2px 8px", border: `1px solid ${color}44`, background: color + "11", letterSpacing: "0.08em" }}>{label}</span>
  );
}

// ─── TAB CONTENT ──────────────────────────────────────────────────────────────

function IdentityTab() {
  return (
    <div style={{ maxWidth: 760 }}>
      <SLabel label="Product Identity" color={T.gold} />
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, color: T.gold, letterSpacing: "0.08em", lineHeight: 1, marginBottom: 8 }}>MovOS</div>
      <div style={{ fontSize: 13, color: T.muted, lineHeight: "1.8", marginBottom: 28, maxWidth: 580 }}>
        An operating system for rental fleet operations. Not a maintenance app. Not a reservation system. The operational and intelligence layer that sits between Karve (reservations) and the physical fleet. Dark, dense, precise — built for people who work with vehicles, not for people who want to look at dashboards.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Aesthetic Direction",  value: "Dark industrial · Operational precision · Zero decorative elements" },
          { label: "Tone",                 value: "Dense and data-first. No white space for its own sake. Every pixel earns its place." },
          { label: "Anti-patterns",        value: "No rounded cards. No gradients. No shadows. No emojis in UI (data only). No color fills on backgrounds." },
          { label: "What it feels like",   value: "Bloomberg terminal meets iOS dark mode. Information-dense but never chaotic." },
          { label: "Typography pairing",   value: "Bebas Neue (display/numbers) + DM Mono (body/labels). No system fonts. No Inter. No Roboto." },
          { label: "Color philosophy",     value: "Dark neutral base (#080808). Semantic color accents only — never decorative. Gold is the brand anchor." },
        ].map(r => (
          <div key={r.label} style={{ padding: "14px 16px", background: T.bg1, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 9, color: T.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>{r.label}</div>
            <div style={{ fontSize: 12, color: T.textDim, lineHeight: "1.7" }}>{r.value}</div>
          </div>
        ))}
      </div>

      <SLabel label="Design Rules — Non-Negotiable" color={T.critical} />
      {[
        "Border-radius: 0px on all cards, buttons, badges, inputs. Absolute maximum 2px on progress bars only.",
        "No box shadows. Borders define depth, not shadows.",
        "No gradient backgrounds. Solid colors only.",
        "No filled button backgrounds. Always outlined with opacity fill (color at 11–22%).",
        "Alert left-borders are mandatory on all alert rows and cards — they are the primary visual signal.",
        "Top-border accents (2–3px) define card category. Required on every card.",
        "Hover transitions: 0.15s, background only. No scale, no translate, no glow.",
        "All interactive elements must have a visible hover state.",
        "Click targets that open lists must show 'VIEW →' or '→' affordance.",
        "Section labels with 3px vertical bar are required before every content block.",
        "Font-family: DM Mono for all body. Bebas Neue for all display. Import both from Google Fonts.",
      ].map((rule, i) => (
        <div key={i} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.textDim }}>
          <span style={{ color: T.gold, fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, flexShrink: 0, marginTop: 1 }}>{String(i + 1).padStart(2, "0")}</span>
          {rule}
        </div>
      ))}
    </div>
  );
}

function TypographyTab() {
  return (
    <div>
      <SLabel label="Type System" color={T.blue} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        {[
          { name: "Bebas Neue", role: "Display / Numbers / Headers", import: "Google Fonts", weights: "400 only", note: "Used for all large numbers, KPI values, screen titles, card labels, vehicle unit IDs." },
          { name: "DM Mono",    role: "Body / Labels / Data",        import: "Google Fonts", weights: "300, 400, 500", note: "Used for everything else: descriptions, table data, badges, section labels, timestamps." },
        ].map(f => (
          <div key={f.name} style={{ padding: 20, background: T.bg1, border: `1px solid ${T.border}`, borderTop: `2px solid ${T.blue}` }}>
            <div style={{ fontFamily: f.name === "Bebas Neue" ? "'Bebas Neue',sans-serif" : "'DM Mono',monospace", fontSize: 36, color: T.text, letterSpacing: "0.06em", marginBottom: 8 }}>{f.name}</div>
            <div style={{ fontSize: 10, color: T.gold, marginBottom: 4 }}>{f.role}</div>
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 8 }}>Weights: {f.weights} · Source: {f.import}</div>
            <div style={{ fontSize: 11, color: T.muted, lineHeight: "1.6" }}>{f.note}</div>
          </div>
        ))}
      </div>

      <SLabel label="Type Scale" color={T.blue} />
      <div style={{ border: `1px solid ${T.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 120px 100px 100px 1fr", gap: 12, padding: "8px 16px", borderBottom: `1px solid ${T.border}`, background: T.bg2 }}>
          {["Role", "Font", "Size", "Tracking", "Usage"].map(h => (
            <div key={h} style={{ fontSize: 8, color: T.dim, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {TYPE_RULES.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 120px 100px 100px 1fr", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${T.border}`, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T.textDim }}>{r.role}</span>
            <span style={{ fontSize: 10, color: T.gold, fontFamily: r.font === "Bebas Neue" ? "'Bebas Neue',sans-serif" : "'DM Mono',monospace" }}>{r.font}</span>
            <span style={{ fontSize: 10, color: T.muted }}>{r.size}</span>
            <span style={{ fontSize: 10, color: T.muted }}>{r.tracking}</span>
            <span style={{ fontSize: 10, color: T.muted, lineHeight: "1.5" }}>{r.use}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, padding: "16px 20px", background: T.bg1, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.critical}` }}>
        <div style={{ fontSize: 9, color: T.critical, letterSpacing: "0.15em", marginBottom: 8 }}>NEVER USE</div>
        <div style={{ fontSize: 12, color: T.muted, lineHeight: "1.8" }}>
          Inter · Roboto · Arial · Helvetica · system-ui · SF Pro · any variable font · any font not listed above. If Google Fonts is unavailable, fallback to: Bebas Neue → Impact, DM Mono → 'Courier New', monospace.
        </div>
      </div>
    </div>
  );
}

function ColorTab() {
  return (
    <div>
      <SLabel label="Color Tokens" color={T.purple} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 28 }}>
        {COLOR_TOKENS.filter(c => !c.token.startsWith("--bg") && !c.token.startsWith("--border") && !c.token.startsWith("--text") && !c.token.startsWith("--muted") && !c.token.startsWith("--dim")).map(c => (
          <div key={c.token} style={{ padding: "14px", background: T.bg1, border: `1px solid ${T.border}`, borderTop: `3px solid ${c.hex}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 16, height: 16, background: c.hex, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, color: c.hex, letterSpacing: "0.06em" }}>{c.hex}</span>
            </div>
            <div style={{ fontSize: 9, color: T.dim, letterSpacing: "0.1em", marginBottom: 4 }}>{c.token}</div>
            <div style={{ fontSize: 10, color: T.muted, lineHeight: "1.5" }}>{c.role}</div>
          </div>
        ))}
      </div>

      <SLabel label="Background & Surface Scale" color={T.purple} />
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {COLOR_TOKENS.filter(c => c.token.startsWith("--bg")).map(c => (
          <div key={c.token} style={{ flex: 1, padding: "14px", background: c.hex, border: `1px solid ${T.border2}` }}>
            <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.1em", marginBottom: 4 }}>{c.token}</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: "#666", letterSpacing: "0.06em" }}>{c.hex}</div>
            <div style={{ fontSize: 10, color: "#444", marginTop: 4, lineHeight: "1.5" }}>{c.role}</div>
          </div>
        ))}
      </div>

      <SLabel label="Status Color Usage Rules" color={T.purple} />
      <div style={{ border: `1px solid ${T.border}` }}>
        {[
          { status: "Available",       color: T.green,    uses: "KPI card top border, ops cycle card, status badge, utilization bar high, fleet row hover" },
          { status: "Assigned / On Rent", color: T.blue,  uses: "KPI card, ops cycle, reservation sync module, before/after comparison — pickup side" },
          { status: "Needs Cleaning",  color: T.yellow,   uses: "Ops cycle card, cleaning task badge, service warning alerts" },
          { status: "For Inspection",  color: T.gold,     uses: "Ops cycle card, inspection module, pre-rental check badge" },
          { status: "Out of Service",  color: T.critical, uses: "KPI card, critical alert border, major damage badge, sell recommendation" },
          { status: "In Maintenance",  color: T.purple,   uses: "Maintenance module, repair ticket, under-repair stage, maintenance cycle pipeline" },
          { status: "Warning Alert",   color: T.warning,  uses: "Service interval warning, document expiry 30d, manual info alert" },
          { status: "Critical Alert",  color: T.critical, uses: "Damage alert, GPS offline, service overdue, manual critical alert" },
          { status: "Sell Now",        color: T.critical, uses: "Intelligence screen sell recommendation card border and badge" },
          { status: "Evaluate",        color: T.orange,   uses: "Intelligence screen evaluate recommendation" },
          { status: "Hold",            color: T.green,    uses: "Intelligence screen hold recommendation" },
        ].map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16, padding: "10px 16px", borderBottom: `1px solid ${T.border}`, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, background: r.color }} />
              <span style={{ fontSize: 11, color: r.color }}>{r.status}</span>
            </div>
            <span style={{ fontSize: 11, color: T.muted, lineHeight: "1.5" }}>{r.uses}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GridTab() {
  return (
    <div>
      <SLabel label="Grid & Spacing System" color={T.green} />
      <div style={{ border: `1px solid ${T.border}`, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 12, padding: "8px 16px", borderBottom: `1px solid ${T.border}`, background: T.bg2 }}>
          {["Context", "Specification"].map(h => (
            <div key={h} style={{ fontSize: 8, color: T.dim, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {GRID_RULES.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 12, padding: "10px 16px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 11, color: T.textDim }}>{r.context}</span>
            <span style={{ fontSize: 11, color: T.muted, fontFamily: "'DM Mono',monospace" }}>{r.spec}</span>
          </div>
        ))}
      </div>

      <SLabel label="Spacing Scale" color={T.green} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {[4,6,8,10,12,14,16,20,24,28,32,40].map(n => (
          <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: n*2, height: n*2, background: T.green, opacity: 0.15, border: `1px solid ${T.green}44` }} />
            <span style={{ fontSize: 9, color: T.dim }}>{n}px</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "14px 16px", background: T.bg1, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.green}` }}>
        <div style={{ fontSize: 9, color: T.green, letterSpacing: "0.15em", marginBottom: 8 }}>SPACING RULES</div>
        {["Base unit: 4px. All spacing is multiples of 4.",
          "Gap between cards in a grid: 10px.",
          "Gap between sections: 28px.",
          "Padding inside cards: 16–22px.",
          "Table row padding: 10–12px vertical, 14–16px horizontal.",
          "Section label margin-bottom: 12–14px.",
          "Never use odd-number spacing values.",
        ].map((r,i) => (
          <div key={i} style={{ fontSize: 11, color: T.muted, padding: "4px 0", borderBottom: `1px solid ${T.border}` }}>{r}</div>
        ))}
      </div>
    </div>
  );
}

function ComponentsTab() {
  return (
    <div>
      <SLabel label="Component Specifications" color={T.orange} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {COMPONENT_SPECS.map(comp => (
          <div key={comp.name} style={{ padding: "18px", background: T.bg1, border: `1px solid ${T.border}`, borderTop: `2px solid ${comp.color}` }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: comp.color, letterSpacing: "0.06em", marginBottom: 12 }}>{comp.name}</div>
            {comp.rules.map((rule, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: `1px solid ${T.border}`, fontSize: 11, color: T.muted }}>
                <span style={{ color: comp.color, fontSize: 8, marginTop: 3, flexShrink: 0 }}>◆</span>
                {rule}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreensTab() {
  const [active, setActive] = useState("dashboard");
  const screen = SCREENS_LIST.find(s => s.id === active);

  const SCREEN_DETAILS = {
    dashboard: {
      rows: [
        { label: "Row 1 — Fleet KPIs", color: T.gold, desc: "5 cards: Total Fleet, Available, Assigned, Utilization %, Out of Service. Each clicks to filtered vehicle list. Maintenance/inspection sub-count below main value." },
        { label: "Row 2 — Alerts (2-up)", color: T.critical, desc: "Left: Critical Alerts (damage + manual manager alerts). Right: Service Interval Alerts (manufacturer + internal rules). Each row clickable. 'View All' footer." },
        { label: "Row 3 — Locations + Parts (2:1)", color: T.blue, desc: "Left 2/3: 4 location cards with utilization bar and stats. Right 1/3: Parts Requests table. All clickable." },
        { label: "Row 4 — Long-Term Contracts", color: T.orange, desc: "2-column grid of contract cards. Vehicle count prominent. Expiring contracts in warning color. 'View All' footer row." },
      ],
      notes: ["No charts or graphs — all data is tabular or card-based.", "Global branch filter in page header applies to all rows.", "Sticky nav with notification badge."],
    },
    operations: {
      rows: [
        { label: "Row 1 — Fleet KPIs", color: T.gold, desc: "Identical to Dashboard Row 1. Consistent reference across all screens." },
        { label: "Row 2 — Operations Cycle", color: T.blue, desc: "5 cards in a horizontal pipeline: Assigned → Available → For Cleaning → For Inspection → On Service. Arrow connectors between cards. Flow legend below." },
        { label: "Row 3 — Maintenance Cycle", color: T.purple, desc: "7 cards: Waiting → Assigned to Tech → Diagnostic → Waiting Parts → Under Repair → Post Inspection → Cleared. Each with icon and bar." },
        { label: "Row 4 — Parts Alerts + Repair Locations", color: T.orange, desc: "Left: Parts alert table. Right: 6 repair location cards (2 internal, 3 dealers, 1 specialist) with stacked bars." },
      ],
      notes: ["Cycle flow legend below each pipeline row.", "Total vehicles in maintenance shown as section count badge."],
    },
    fleet: {
      rows: [
        { label: "Row 1 — Fleet KPIs", color: T.gold, desc: "Same 5 KPI cards. Clicking a KPI applies that filter to the vehicle list below and clears other filters." },
        { label: "Row 2 — Vehicle List with Sidebar Filters", color: T.slate, desc: "220px sticky sidebar with 5 filter groups (Category, Location, Ops Cycle, Maint. Cycle, Contract). Multi-select chips with color per status. Active filter count + clear button. Full-width scrollable vehicle table: 10 columns, sortable headers, alert left-border, click row for vehicle quick-view." },
      ],
      notes: ["Search input at top of sidebar.", "Table footer: showing X of Y vehicles, pagination.", "Quick-view modal on row click with 4 action buttons."],
    },
    vehicle: {
      rows: [
        { label: "Tab 1 — Vehicle Template", color: T.gold, desc: "6 spec sections in sidebar. Fields with type tags. Manufacturer Service Schedule: add rows from booklet. All fields expandable." },
        { label: "Tab 2 — Service Intervals", color: T.blue, desc: "Toggle between Manufacturer layer and Internal Rules layer. Each shows tracking logic and alert chain." },
        { label: "Tab 3 — QR Code", color: T.gold, desc: "SVG QR code + use cases + download options (PNG / PDF / Label)." },
        { label: "Tab 4 — Manual Alerts", color: T.orange, desc: "Alert level selector, message input, recipient targeting, status action. Creates event in history." },
        { label: "Tab 5 — Event History", color: T.purple, desc: "Filterable timeline. All event types. Immutable. Each event: type badge, summary, detail, actor, timestamp." },
      ],
      notes: ["Vehicle header always visible: unit, model, plate, status badge, branch.", "QR code opens vehicle page on scan — no login required for operators with active session."],
    },
    intelligence: {
      rows: [
        { label: "Row 1 — Strategic KPIs", color: T.gold, desc: "6 cards: Fleet Score, Sell Candidates, Evaluate Now, Monthly Revenue, Total Maint. Cost, Avg Utilization." },
        { label: "Tab: Overview", color: T.gold, desc: "3 panels: Most Time in Shop (ranked), Best Performers (score rings), Action Required (sell/evaluate list)." },
        { label: "Tab: Shop Analysis", color: T.critical, desc: "Table sorted by days in shop. Mini-bars for repairs, days, cost. Cost/100km column." },
        { label: "Tab: Revenue & Utilization", color: T.green, desc: "Two ranked lists: monthly revenue + utilization rate. Both with bars." },
        { label: "Tab: Depreciation", color: T.orange, desc: "Summary strip + full table: acq. cost, market price, value lost %, dep. rate, optimal sell year/km." },
        { label: "Tab: Sell Recommendations", color: T.critical, desc: "Three sections: SELL NOW / EVALUATE / HOLD. Each vehicle card with score ring, metrics, recommendation reasoning." },
        { label: "Tab: By Category", color: T.purple, desc: "Category benchmarks table + insight panel." },
      ],
      notes: ["'TOP MANAGEMENT ONLY' badge in nav.", "Click any vehicle → detail modal with plain-language recommendation + 12 metric tiles + actions.", "Score ring: SVG circle gauge 0–100, color-coded by performance."],
    },
    mobile: {
      rows: [
        { label: "Screen: Home / Tasks", color: T.gold, desc: "Quick stats (tasks, urgent, done today). Task list by type (pickup, return, maintenance, cleaning). Recent activity." },
        { label: "Screen: Pickup Inspection", color: T.blue, desc: "4-step flow: Odometer + Fuel → Checklist → Damage Map → Photos → Signature. Step progress bar at top." },
        { label: "Screen: Damage Map", color: T.orange, desc: "SVG top-down car, all body panels tappable. Damage panel (bottom sheet): type, severity, note, photo guide, photo slots. 3 tabs: Diagram / List / Photos." },
        { label: "Screen: QR Scan", color: T.gold, desc: "Camera scan area. On scan: vehicle quick-view with 4 action buttons." },
        { label: "Screen: Move to Maintenance", color: T.orange, desc: "Stage selector (all 7 maintenance stages). Issue description. Status change warning. Confirm." },
        { label: "Screen: Update Maint. Status", color: T.purple, desc: "Visual pipeline timeline. Current stage highlighted. Select next stage. Cleared → returns to fleet." },
      ],
      notes: ["Phone frame: 375px wide, 760px screen height.", "Bottom nav: 5 items.", "All touch targets 44×44px minimum.", "Damage panel slides up (bottom sheet pattern)."],
    },
  };

  const detail = SCREEN_DETAILS[active] || SCREEN_DETAILS.dashboard;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
      <div style={{ borderRight: `1px solid ${T.border}`, paddingRight: 20 }}>
        <div style={{ fontSize: 9, color: T.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Screens</div>
        {SCREENS_LIST.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)}
            style={{ background: active === s.id ? T.bg2 : "none", border: "none", width: "100%", textAlign: "left", padding: "10px 12px", cursor: "pointer", borderLeft: `3px solid ${active === s.id ? T.slate : "transparent"}`, marginBottom: 2, transition: "all 0.15s" }}>
            <div style={{ fontSize: 11, color: active === s.id ? T.slate : T.muted }}>{s.name}</div>
            <div style={{ fontSize: 9, color: T.dim, marginTop: 2 }}>{s.role}</div>
          </button>
        ))}
      </div>
      <div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: T.slate, letterSpacing: "0.08em", marginBottom: 4 }}>{screen?.name}</div>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Role: {screen?.role}</div>
        <div style={{ fontSize: 12, color: T.muted, lineHeight: "1.7", marginBottom: 20, borderLeft: `2px solid ${T.slate}44`, paddingLeft: 12 }}>{screen?.desc}</div>

        <div style={{ fontSize: 9, color: T.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Layout Structure</div>
        {detail.rows.map((row, i) => (
          <div key={i} style={{ padding: "14px 16px", border: `1px solid ${row.color}22`, borderLeft: `3px solid ${row.color}`, marginBottom: 8, background: T.bg1 }}>
            <div style={{ fontSize: 11, color: row.color, marginBottom: 6 }}>{row.label}</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: "1.7" }}>{row.desc}</div>
          </div>
        ))}

        {detail.notes && (
          <div style={{ marginTop: 14, padding: "14px 16px", background: T.bg1, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 9, color: T.dim, letterSpacing: "0.15em", marginBottom: 8 }}>NOTES</div>
            {detail.notes.map((n, i) => (
              <div key={i} style={{ fontSize: 11, color: T.muted, padding: "4px 0", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
                <span style={{ color: T.slate }}>—</span>{n}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileTab() {
  return (
    <div style={{ maxWidth: 760 }}>
      <SLabel label="Mobile App Design Rules" color={T.lime} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
        {MOBILE_RULES.map((rule, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: T.bg1, border: `1px solid ${T.border}`, fontSize: 11, color: T.muted }}>
            <span style={{ color: T.lime, fontSize: 8, marginTop: 3, flexShrink: 0 }}>◆</span>
            {rule}
          </div>
        ))}
      </div>

      <SLabel label="Damage Map — Critical Rules" color={T.orange} />
      {[
        "Top-down SVG car diagram. All body panels are individual tappable zones with transparent hit areas.",
        "Damaged zones: colored fill at 28% opacity + full-color border + damage marker dot with ! in center.",
        "Hovered undamaged zone: gold border at 88% + zone label text appears.",
        "Zone labels: always subtle (--dim color), permanent, 7px DM Mono.",
        "Compass labels: FRONT / REAR / LEFT / RIGHT at edges, 7px, --dim.",
        "Damage panel is a bottom sheet (slides up from bottom). Never a full-screen modal.",
        "Photo guide: blue box with specific instructions per zone. Always visible in the panel.",
        "Photo slots: 4 × 64px tiles. 📷 empty, 🖼 filled. Tap to add. Minimum 1 required to save.",
        "Major damage severity: show auto-action warning before saving (Out of Service, repair ticket, management alert).",
        "Three tabs on damage map screen: Diagram / Damage List / Photos. All three required.",
      ].map((rule, i) => (
        <div key={i} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.textDim }}>
          <span style={{ color: T.orange, fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
          {rule}
        </div>
      ))}
    </div>
  );
}

function StatesTab() {
  return (
    <div>
      <SLabel label="Interaction States" color={T.yellow} />
      <div style={{ border: `1px solid ${T.border}`, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 12, padding: "8px 16px", borderBottom: `1px solid ${T.border}`, background: T.bg2 }}>
          {["Trigger", "Response"].map(h => (
            <div key={h} style={{ fontSize: 8, color: T.dim, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {INTERACTION_RULES.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 12, padding: "10px 16px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 11, color: T.textDim }}>{r.trigger}</span>
            <span style={{ fontSize: 11, color: T.muted, lineHeight: "1.5" }}>{r.response}</span>
          </div>
        ))}
      </div>

      <SLabel label="Loading & Empty States" color={T.yellow} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { state: "Loading",       rule: "Skeleton bars: --bg-3 rectangles at 60–80% opacity. Match the layout of the content they replace. No spinners." },
          { state: "Empty table",   rule: "'No vehicles match the current filters.' centered, 13px, --dim. No illustrations or icons." },
          { state: "Empty task list",rule:"'No tasks assigned.' centered. Then: 'All caught up.' in --green." },
          { state: "No damage",     rule:"'No damage marked — no photos required.' in damage map photo tab. --dim, centered." },
          { state: "Error state",   rule: "Red left border on affected component. 11px error message in --critical below. Never full-page error screens." },
          { state: "Success action",rule: "Inline confirmation banner: green left border, --green text, 'Saved' or action-specific message. Auto-dismisses after 3s." },
        ].map(s => (
          <div key={s.state} style={{ padding: "14px", background: T.bg1, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.yellow, marginBottom: 6 }}>{s.state}</div>
            <div style={{ fontSize: 11, color: T.muted, lineHeight: "1.6" }}>{s.rule}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromptTab() {
  const prompt = `You are implementing the UI for MovOS, a fleet operations SaaS platform for vehicle rental companies.

## Design System

**Fonts** (import from Google Fonts):
- Bebas Neue: all display numbers, screen titles, card headings, vehicle unit IDs
- DM Mono: all body text, labels, table data, badges, timestamps

**Color Tokens:**
--bg: #080808 | --bg-1: #0D0D0D | --bg-2: #111111 | --bg-3: #161616
--border: #1C1C1C | --border-2: #242424
--text: #E2D9C8 | --text-dim: #AAAAAA | --muted: #555555 | --dim: #3A3A3A
--gold: #C8A96E | --blue: #7EB8C9 | --purple: #9B7EC8 | --green: #6DBF8E
--red: #C97E7E | --orange: #C9956E | --yellow: #C9B87E | --lime: #A8C96E | --slate: #7E9BC9

**Hard Rules (never break these):**
1. Border-radius: 0px on ALL elements. Maximum 2px on progress bars only.
2. No box shadows anywhere.
3. No gradient backgrounds. Solid colors only.
4. No filled button backgrounds — always outlined with color at 11–22% opacity fill.
5. All cards have a top-border accent (2–3px, category color). Required, never skip.
6. All alert rows have a left-border (2px, alert color). Required signal.
7. Section labels (3px vertical bar + 9px uppercase DM Mono) before every content block.
8. Hover transitions: 0.15s, background --bg-2 only. No scale, glow, or translate.
9. 'VIEW →' affordance on all clickable cards. Appears on hover, bottom-right.
10. All interactive elements must show a visible hover state.

**KPI Cards:**
- Top border: 2px solid, category color
- Label: 9px DM Mono uppercase, --muted, 0.2em tracking
- Value: 44px Bebas Neue, category color
- Sub: 10px DM Mono, --muted
- Hover: --bg-2, border opacity 55%
- Click: opens drill-down modal with filtered vehicle list

**Status Badges:**
- 9–10px DM Mono uppercase, 0.08–0.12em tracking
- Border: 1px solid color at 33–44% opacity
- Background: color at 10–15% opacity
- No rounded corners

**Tables:**
- Row height 40–44px, padding 10–12px 16px
- Hover: --bg-2, 0.15s transition
- Border-bottom: 1px solid --border
- Column headers: 8px DM Mono uppercase, --dim, sticky top
- Sortable: active header gold + ▲▼
- Alert vehicles: 2px left border in alert color

**Pipeline / Cycle Cards:**
- Top border: 3px, stage color
- Large value: 38–52px Bebas Neue, stage color
- Progress bar: 2px, --bg-3 track, stage color fill
- Step number ghost: Bebas Neue 32–36px, color at 7% opacity, top-right
- Arrow connectors between cards: --dim color

**Modals:**
- Overlay: rgba(0,0,0,0.88)
- Panel: --bg-1, border --border-2
- Top accent: 2px, context color
- 28×28px close button, --muted ✕
- Click backdrop to close

**Mobile (CarCheck):**
- Phone frame: border-radius 40px, inner screen radius 28px
- Screen width: 375px
- Bottom nav: 5 items (Tasks, Fleet, Inspect, Maintain, Alerts)
- Active nav: full opacity + gold label. Inactive: 30% opacity
- All touch targets: 44×44px minimum
- Damage map: SVG top-down car, tappable zones, damage panel as bottom sheet
- Damage panel: type selector + severity (3 levels) + photo guide box + 64px photo slots
- Major damage: show auto-action warning before save

**Spacing:**
- Base unit: 4px. All values are multiples of 4.
- Card gaps: 10px. Section gaps: 28px.
- Card padding: 16–22px. Table padding: 10–12px vertical, 14–16px horizontal.

**Never use:** Inter, Roboto, Arial, system-ui, any rounded buttons, any gradients, any shadows, any filled solid-color buttons.`;

  return (
    <div style={{ maxWidth: 800 }}>
      <SLabel label="Claude Implementation Prompt" color={T.gold} />
      <div style={{ fontSize: 12, color: T.muted, lineHeight: "1.7", marginBottom: 20 }}>
        Copy this prompt and paste it at the start of any Claude conversation to implement a new MovOS screen. It encodes the full design system in a format Claude can follow precisely.
      </div>
      <div style={{ padding: "20px", background: T.bg1, border: `1px solid ${T.border}`, borderTop: `2px solid ${T.gold}`, position: "relative" }}>
        <div style={{ position: "absolute", top: 12, right: 12, fontSize: 9, color: T.gold, letterSpacing: "0.15em", padding: "3px 10px", border: `1px solid ${T.gold}44`, cursor: "pointer" }}>
          COPY PROMPT
        </div>
        <pre style={{ fontSize: 10, color: T.textDim, lineHeight: "1.8", whiteSpace: "pre-wrap", fontFamily: "'DM Mono',monospace", margin: 0, overflow: "auto", maxHeight: 600 }}>
          {prompt}
        </pre>
      </div>
      <div style={{ marginTop: 16, padding: "14px 16px", background: T.bg1, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.blue}` }}>
        <div style={{ fontSize: 9, color: T.blue, letterSpacing: "0.15em", marginBottom: 8 }}>HOW TO USE</div>
        <div style={{ fontSize: 12, color: T.muted, lineHeight: "1.8" }}>
          1. Start a new Claude conversation. Paste this prompt first.<br />
          2. Then describe the specific screen or component you need: "Build the Maintenance screen with the repair ticket list and service log."<br />
          3. Claude will follow the design system automatically — fonts, colors, spacing, interactions, component patterns.<br />
          4. If a screen deviates from the system, paste the relevant section of this spec and ask Claude to correct it.
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function MovOSDesignSystem() {
  const [tab, setTab] = useState("identity");

  return (
    <div style={{ fontFamily: "'DM Mono','Courier New',monospace", background: T.bg, minHeight: "100vh", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#0D0D0D;}
        ::-webkit-scrollbar-thumb{background:#222;}
        button{font-family:inherit;}
      `}</style>

      {/* Header */}
      <div style={{ padding: "0 32px", borderBottom: `1px solid ${T.border}`, background: T.bg1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "24px 0 0" }}>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, color: T.gold, letterSpacing: "0.08em", lineHeight: 1 }}>MovOS</span>
          <span style={{ fontSize: 10, color: T.dim, letterSpacing: "0.2em", textTransform: "uppercase" }}>UI Design System</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {[{ l: "Dark Theme", c: T.gold }, { l: "2 Fonts", c: T.blue }, { l: "10 Screens", c: T.purple }, { l: "Mobile + Desktop", c: T.green }].map(b => (
              <Chip key={b.l} label={b.l} color={b.c} />
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12, color: T.dim, marginTop: 6, marginBottom: 18 }}>
          Complete design specification for all screens, components, typography, color, spacing, and interactions.
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setTab(s.id)}
              style={{ background: "none", border: "none", color: tab === s.id ? s.color : T.muted, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 16px", cursor: "pointer", borderBottom: `2px solid ${tab === s.id ? s.color : "transparent"}`, transition: "all 0.2s", whiteSpace: "nowrap" }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1400 }}>
        {tab === "identity"   && <IdentityTab />}
        {tab === "typography" && <TypographyTab />}
        {tab === "color"      && <ColorTab />}
        {tab === "grid"       && <GridTab />}
        {tab === "components" && <ComponentsTab />}
        {tab === "screens"    && <ScreensTab />}
        {tab === "mobile"     && <MobileTab />}
        {tab === "states"     && <StatesTab />}
        {tab === "prompt"     && <PromptTab />}
      </div>
    </div>
  );
}
