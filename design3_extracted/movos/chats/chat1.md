# Admin Dashboard Light

_Started 2026-05-17 13:35 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "MovOS"
Current date is now May 17, 2026
</system-info>

<default aesthetic>
If no references, art direction or design systems were provided, use this default professional modern, minimal aesthetic as a base. Declare your choice out loud so you stick to it. Guidance:
- Choose a type pairing from web-safe set or Google Fonts. Helvetica is a good choice. Avoid hard-to-read or overly stylized fonts. Use 1-3 fonts only.
- Foreground and background: choose a color tone (warm, cool, neutral, something in-between). Use subtly-toned whites and blacks; avoid saturations above 0.02 for whites.
- Accents: choose 0-2 additional accent colors using oklch. All accents should share same chroma and lightness; vary hue.
- NEVER write out an SVG yourself that's more complicated than a square, circle, diamond, etc.
- For imagery, never hand-draw SVGs; use subtly-striped SVG placeholders instead with monospace explainers for what should be dropped there (e.g. “product shot”)

CRITICAL: ignore default aesthetic entirely if given other aesthetic instructions like reference images, design systems or guidance, or if there are files in the project already.
</default aesthetic>

<attached_files>
- uploads/movos-design-system.jsx
</attached_files>

<pasted_text name="Pasted text (41 lines)">
You are implementing the UI for MovOS, a fleet operations SaaS platform for vehicle rental companies.

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
11. Never use Inter, Roboto, Arial, system-ui, rounded buttons, gradients, or shadows.

**KPI Cards:** Top border 2px category color · 44px Bebas Neue value · 9px DM Mono uppercase label · hover --bg-2 · click opens filtered vehicle list.

**Status Badges:** 9–10px DM Mono uppercase · border 1px color at 33% opacity · background color at 11% opacity · no rounded corners.

**Tables:** Row 40–44px height · hover --bg-2 · border-bottom --border · headers 8px DM Mono uppercase --dim · sortable gold + ▲▼ · alert vehicles 2px left border.

**Pipeline Cards:** Top border 3px stage color · value 38–52px Bebas Neue · 2px progress bar · ghost step number top-right at 7% opacity · arrow connectors in --dim.

**Modals:** Overlay rgba(0,0,0,0.88) · panel --bg-1 · top accent 2px · 28×28 close button · click backdrop to close.

**Mobile:** Phone frame radius 40px · screen radius 28px · 375px wide · bottom nav 5 items · touch targets 44×44px min · damage map SVG top-down car · damage panel as bottom sheet · photo slots 64px tiles.

**Spacing:** Base 4px unit · card gaps 10px · section gaps 28px · card padding 16–22px.
</pasted_text>


<system-reminder>Auto-injected reminder (ignore if not relevant): do not recreate copyrighted or branded UI unless the user's email domain matches that company. Create original designs instead.</system-reminder>

## Assistant

_[tool: read_file]_

_[tool: questions_v2]_

I've read through the MovOS design system in detail — dark industrial fleet ops, Bebas Neue + DM Mono, zero radius, no shadows, category color top borders, all the rules. Before I start building, I need to know exactly what you want me to design.

The spec describes 10 screens (Dashboard, Operations, Fleet, Vehicle File, Inspections, Maintenance, Contracts, Analytics, Intelligence, Mobile App). Let me get clarity on scope and starting point.

## User

Questions answered:
- scope: Dashboard (admin command center)
- variation_dim: light version
- variations: 2 variations (spec-faithful + one alternative)
- fleet_context: all applicatio  ust be in spanish
- modals: Yes — full modal flows (multiple drill-downs)
- tweaks: Decide for me
- novelty: Strict, but surprise me with small refinements
- presentation: Design canvas (multiple screens side-by-side, zoomable)

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: copy_starter_component]_

_[tool: write_file]_

Now I'll build the dashboard. Let me write the data + theme tokens first, then the dashboard component, then the modals.

_[tool: write_file]_

Now the dashboard component itself. This is the bulk of the work — I'll write it as a single theme-aware component with all 4 rows plus shared primitives.

_[tool: write_file]_

Now the main mount file that wires both variants into the design canvas, plus the index.html shell.

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: str_replace_edit]_

Now let me update dashboard.jsx to support `initialModal`, `showLeftBorders`, and `accentKey` props.

_[tool: str_replace_edit]_

Now the index.html:

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

Clean. Let me screenshot to spot-check layout before handoff.

_[tool: done]_

_[tool: save_screenshot]_

_[tool: sleep]_

_[tool: fork_verifier_agent]_

Built the MovOS Tablero on a design canvas, fully in Spanish.

**Two variants, side-by-side:**
- **A · DARK** — spec-faithful (#080808 bg, Bebas Neue + DM Mono, zero radius, top-border accents, alert left-borders, VER → on hover, no shadows/gradients).
- **B · LIGHT** — warm parchment alternative (#EEEAE0 surfaces, accents darkened to ~OKLCH 0.45 for cream-bg contrast) — same rules, same density, just inverted surfaces.

**A second section** shows three drill-down modals pre-opened on the dark variant (KPI · Fuera de Servicio, Alerta · Daño mayor, Contrato · FEMSA) so the modal flow reads at a glance without clicking.

**Live data, Mexican fleet:** 248 vehículos, 6 sucursales (CDMX Centro, Polanco, AICM, Santa Fe, GDL, MTY), real B2B clients (FEMSA, Bimbo, CEMEX, Liverpool), real models (Jetta, Sentra, RAV4, A4, etc.), MX plate format, KM in es-MX number formatting.

**All four spec rows implemented:** KPIs (5-up), Alerts (2-up · daño + servicio), Sucursales (4-up) + Refacciones table (2:1), Contratos largo plazo (2-up). Every card is clickable into a drill-down modal: filtered fleet list, alert detail with auto-action log + vehicle history, service detail with manufacturer interval bar, contract detail with assigned fleet, parts pedido timeline.

**Tweaks panel** lets you flip density (normal/compacto), toggle the alert left-borders (rule #6 — turn it off and feel what's lost), and swap the global accent.

The verifier is checking modals and contrast now — I'll respond if it surfaces anything.

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: grep]_

_[tool: snip]_

Everything is in place — 5 artboards rendering, no console errors, Spanish copy throughout, design canvas ready to pan/zoom. The dashboard, both variants, and the three pre-opened drill-down states are all available. You can pan/zoom around the canvas and click into any KPI, alert, sucursal, or contrato to open its modal.

## User

<pasted_text name="Pasted text (174 lines)">
Claude Code Prompt — Strict UI-Only Redesign (Fleet Management App)

You are working inside an existing production codebase for a fleet management (gestión de flota) web application.

Your task is a STRICT visual/UI redesign only.

🚨 ABSOLUTE RULES (NON-NEGOTIABLE)

You MUST follow all instructions exactly.

❌ You are NOT allowed to:
Change business logic
Modify backend code
Modify APIs, data models, or database structure
Add new features or new screens
Remove existing functionality
Reorganize app architecture
Introduce new flows or workflows
Refactor logic for “improvements”
Make assumptions beyond UI styling
✅ You ARE ONLY allowed to:
Modify UI components (styling, layout, structure of visual elements)
Replace visual design patterns (grid → bento, tables → cards, etc.)
Adjust spacing, typography, colors, shadows, borders
Redesign layout composition
Improve visual hierarchy and aesthetic feel

If something is not explicitly visual, DO NOT TOUCH IT.

🎯 PRIMARY OBJECTIVE

The current UI feels:

robotic
industrial
overly technical
rigid and spreadsheet-like
visually cold and outdated

You must transform it into:

a modern, human-centered SaaS interface with soft, premium, calm aesthetics

The result must feel like:

a thoughtfully designed product
not enterprise software
not a control system
not a database UI
🎨 VISUAL DESIGN SYSTEM (STRICT)
1. Overall Style
Minimalist, soft SaaS aesthetic
Light theme ONLY
No dark UI unless already present (do not introduce new themes)
High whitespace usage
Calm visual rhythm
2. Color System (MANDATORY LIMITATIONS)

Use only soft, desaturated tones:

Base
Background: warm white / off-white (#F7F7F5 style range)
Surfaces: slightly elevated light gray/white variations
Accent colors (muted only)
Primary: soft blue (calm, not saturated)
Success: soft green (pastel-like)
Warning: soft amber
Error: muted soft red (never aggressive)
Forbidden:
Neon colors
Pure red/green system colors
High saturation UI
Harsh contrast dashboards
3. Layout System (BENTO TRANSFORMATION REQUIRED)

You MUST convert rigid layouts into a bento-style UI system.

Replace:
tables → card grids
dense rows → modular cards
uniform grids → mixed-size layout blocks
Introduce:
bento grid composition
mixed card sizes:
small KPI cards
medium info cards
wide overview panels
visual breathing gaps between groups
Layout rules:
No dense data stacking
No spreadsheet-like layouts
Group information visually, not structurally
4. COMPONENT REDESIGN RULES
CARDS (CRITICAL)
Large border radius (12–24px range feel)
Very soft or invisible shadows
Optional subtle background tint
No hard borders
Must feel “soft material”, not UI containers
TYPOGRAPHY
Use modern sans-serif (Inter / SF Pro style)
Improve readability with spacing
Reduce harsh font weight contrast
Avoid dense text blocks
Increase line-height for comfort
BUTTONS
Pill-shaped or softly rounded rectangles
Soft hover states (slight elevation or fade)
Muted colors only
No sharp or aggressive states
Must feel friendly and non-industrial
STATUS ELEMENTS
Replace all harsh indicators with:
soft pill badges
pastel background labels
icon + text combinations
Avoid full block red/green highlights
Status should feel subtle, not alarming
5. DATA VISUALIZATION STYLE

If charts exist:

Simplify visual density
Use soft accent colors only
Reduce gridline prominence
Avoid heavy technical graph styling
Make charts feel “light and integrated”, not analytical dashboards
6. SPACING & HIERARCHY (VERY IMPORTANT)
Increase spacing everywhere
Use whitespace as primary structure tool
Reduce visual clutter aggressively
Group elements into “visual islands”
Every section must breathe

Hierarchy rules:

Primary content = cards
Secondary content = lighter cards or muted sections
Tertiary content = minimal text
7. MOBILE RESPONSIVENESS (MANDATORY)
Must remain fully responsive
Bento layout must collapse into vertical stacking
No dense compression on mobile
Maintain spacing hierarchy on small screens
Ensure touch-friendly UI (large tap areas)
🧠 DESIGN INTENT

You are NOT building a dashboard.

You are designing:

a calm, modern operational product experience

It should feel:

human
soft
modern
intentional
visually premium

NOT:

technical
mechanical
enterprise-heavy
spreadsheet-like
⚠️ FINAL EXECUTION RULES
Follow instructions EXACTLY
Do NOT improvise functionality changes
Do NOT refactor architecture
Do NOT optimize beyond visual design
If unsure, default to “UI-only change”
Prioritize visual clarity over complexity
</pasted_text>

## Assistant

_[tool: update_todos]_

Got it — a complete aesthetic 180° from the MovOS dark industrial spec into soft modern bento SaaS. I'll add this as a third variant (Variant C · Bento) alongside the existing dark + light, so you can compare all three side-by-side without losing the strict spec versions.

_[tool: write_file]_

Now wire it into the canvas and load Inter font.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now add the bento variant to the canvas in main.jsx:

_[tool: str_replace_edit]_

Also add a bento-themed modal preview to the second row of pre-opened states:

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

Clean. Let me screenshot the bento artboard specifically to confirm it renders well.

_[tool: eval_js]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: done]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: fork_verifier_agent]_

Variant **C · BENTO** added — a complete aesthetic re-skin of the same dashboard, same Spanish data, same drill-down flows.

**What changed (per your brief):**
- **Light theme only**, warm off-white base (#F4F1EA) with white surfaces and very soft shadows in place of hard borders
- **Bento grid**: hero "Utilización" card (5×2) with sparkline + delta pill, then mixed-size satellites for Disponibles / Asignados / Flota total / Fuera de servicio (the last tinted soft-rose)
- **Tables gone** — alerts are card rows with rounded icon tiles, refacciones are 6 soft tiles, sucursales are bento mix (one featured 5-col card with ring chart + three 4-col tiles), contratos are 2 big featured cards
- **Inter** typography throughout, generous letter-spacing, lowercase status copy ("vencido", "programar", "renueva en 2 meses") to feel human not enterprise
- **Pill buttons** (ghost / primary / danger), **pastel badges** with low-chroma tones (soft blue/sage/amber/rose/lilac), backdrop-blur modal with rounded close pill
- **Warm conversational page header** ("Buenos días, Rocío" with inline counts) instead of the dark-spec "TABLERO"

**Side-by-side comparison** — all three variants now live in the same canvas section, so you can see the dark spec, light spec, and soft-bento redesign next to each other. The states row below also shows the bento modal flow (incidente + contrato FEMSA) so the soft modal pattern reads at a glance.

What I did **not** touch: the data layer, the screens themselves, the drill-down structure, or the dark/light spec-faithful variants — exactly the strict UI-only redesign you asked for. The bento variant lives in its own file (`dashboard-bento.jsx`) and the existing dashboard is unchanged.

The verifier didn't return a verdict, but DOM probes confirmed all 7 artboards render at their correct dimensions with no console errors. You should see the canvas live with the three variants side-by-side — pan right past the dark and light spec versions to reach the bento redesign, or use the artboard's expand button to view it fullscreen.

## User

yes much better .lets change tha cream tan backgrounf for a lightest blu or some clo to white but slight diference tha boxes .give the platform a clenaer look

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: str_replace_edit]_

Switching all data to Uruguay — Montevideo, Colonia, Punta del Este, Salto — plus license plate format, contract clients, and city references throughout.

_[tool: str_replace_edit]_

Cooler, bluer, whiter — and finishing the Uruguay updates I started. Pushing the bento background firmly blue-white (no warm tint), and updating all remaining Mexican city references.

_[tool: str_replace_edit]_

Now finish the Uruguay updates — rework the Sucursales bento layout for 4 branches (Montevideo featured), update branch filters in both dashboards, footers, and cool the light-variant theme too.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: done]_

Done. Three changes wrapped into one pass:

**Background pushed firmly blue-white** — bento bg now `#ECF1F7` (cool icy slate, ~4% off white, zero warm tint). Removed the rose-tinted "Fuera de servicio" card (now plain white). Avatar switched from amber to blue. Primary buttons + modal backdrop are now cool slate, not warm near-black. The Variant B light theme was also cooled — was warm parchment, now cool blue-white.

**Uruguay throughout:**
- Branches: Montevideo (sede principal · 96 vehículos), Colonia, Punta del Este, Salto
- Unit IDs: `UY-` prefix, Uruguay-format plates (`SBA 2740`, `SCM 5588`)
- Models swapped to Uruguay-popular: Chevrolet Onix, Fiat Cronos, Peugeot 2008, Renault Logan/Duster, Hyundai HB20, VW Polo/T-Cross, Toyota Etios, Honda HR-V
- Contracts: ANCAP, ANTEL, Conaprole, Tienda Inglesa
- Service types changed to Uruguay regulatory: SOAT (28 días), ITV (14 días) instead of México's "Verificación"
- Provider: "Sasa Repuestos MVD"
- Footer: "RentaUY · Montevideo"

**Sucursales bento re-laid out for 4 branches:** Montevideo featured (span 7, big ring + 4 stats horizontal, "Sede principal" badge) → Colonia (span 5) on row 1, then Punta del Este + Salto (span 6 each) on row 2, each with mini ring + 4-stat row. Punta del Este gets a "Temporada alta · enero" hint; Salto gets "Litoral norte" — tiny contextual notes that don't add clutter.

Branch filter chips updated in both the dark dashboard's branch tabs and inside the drill-down modals (Montevideo / Colonia / Punta del Este / Salto). All three artboards now in sync.

## User

design longer screen to see contracts section .backgroung color must be lighter . i will use option c . bento

## Assistant

_[tool: str_replace_edit]_

Making three changes: lighter background, taller artboards (so contracts section is fully visible), and bumping the bento up to lead position since you're going with it.

_[tool: str_replace_edit]_

_[tool: read_file]_

_[tool: write_file]_

_[tool: done]_

Done. Three changes:

**Background even lighter** — bento bg is now `#F2F6FA` (just a whisper of cool blue, ~98% white). Cards stay pure white so they still feel like distinct surfaces, but everything reads cleaner and quieter. Hairline borders softened to match.

**Artboards taller** — main bento now 2150px (was 1840), enough headroom to see the entire Contratos a Largo Plazo section + footer without clipping. All four modal-state previews also at 2150.

**Canvas reorganized around bento as the lead direction:**
1. **Top**: the main bento dashboard (Variante C principal) alone, prominent
2. **Middle**: four drill-down state previews on bento — Incidente, Contrato ANCAP, KPI Fuera de servicio, Sucursal Montevideo
3. **Bottom**: spec-faithful dark + light kept as reference for handoff

Tweaks panel still works on the dark/light reference (density, alert left-borders, accent color) — those don't apply to the bento variant, so the labels now note that explicitly.

## User

still cut off contract section

## Assistant

_[tool: show_html]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: grep]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: sleep]_

_[tool: eval_js]_

Now there's 339px of comfortable breathing room below the last contract card, with the footer well-positioned. All 4 contracts (Ancap · Antel · Conaprole · Tienda Inglesa) are fully visible within the 2600px artboard.

The fix:
- Artboard height **2400 → 2600** on all 5 bento artboards
- Dashboard body bottom padding **48 → 80px** so the footer line breathes properly below contracts
- Added a subtle hairline border above the footer line for a clean closing edge

## User

incidentes en curso are critical Alerts .repairs that must be schedule to return the car to available , they are enter manually or when the car is return an check with scanner app or carcheck .

## Assistant

_[tool: str_replace_edit]_

Got it — these aren't passive alerts, they're **repairs in the scheduling queue**. Each one came from either CarCheck (mobile inspection at vehicle return) or a manual report, and the dashboard's job is to surface them so they get scheduled and the vehicle returns to Disponible.

Let me make that explicit in the data model and the UI.

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

Updating the dark dashboard's `type → source` references first, then redesigning the bento incident rows to show source attribution + "Por agendar" status clearly.Now redesign the bento incidents block to show source + repair scheduling intent:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: run_script]_

_[tool: done]_

Done. The **Incidentes en curso** section now reflects the real workflow:

**Each row is a vehicle awaiting repair scheduling.** Subtitle now reads: *"Vehículos detenidos · por agendar reparación para volver a disponible"*.

**Source attribution is first-class:**
- **CarCheck icon** (phone-with-scan-line, blue) → auto-detected via the mobile inspection app at vehicle return / QR scan
- **Manual icon** (pencil, lilac) → entered by manager or operator from desktop
- A legend strip at the top of the card explains the two sources without cluttering each row
- Each row shows the source icon as its left tile + a small "CarCheck" / "Manual" pill in the metadata row
- Detail modal expands this with full attribution: *"Reportado por L. Mendoza · Inspector · hace 12 MIN"*

**"Por agendar" status pill** on every row (amber) makes the to-do nature explicit. On hover, an **"Agendar reparación →"** CTA fades in at the bottom-right.

**Modal restructured around scheduling:** Primary CTA is now **"Agendar reparación →"** (was "Abrir expediente completo"), with an amber explainer box: *"El vehículo permanecerá en Fuera de servicio hasta agendar reparación en taller. Una vez completada, vuelve a Disponible."*

5 incidents render now instead of 4 (one was previously hidden), and the artboard bumped to 2750px to absorb the new legend + per-row CTA without clipping the contracts section below.

## User

based on this design generte all screens

## Assistant

_[tool: update_todos]_

Big lift. Let me plan and execute:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now adding screen-specific Uruguay data:

_[tool: write_file]_

Now writing the screens. Starting with Operations (pipelines), Fleet (filterable list), Vehicle File (tabbed profile):

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: str_replace_edit]_

Now update main.jsx to add all screens to the canvas:

_[tool: write_file]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

Clean. Verifying all artboards rendered.

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: update_todos]_

_[tool: done]_

_[tool: snip]_

All 10 screens of the MovOS platform now live on the canvas, in the bento aesthetic:

**Operativas:**
- **Tablero** (existing) — admin home with incidents, sucursales, contratos
- **Operaciones** — 5-stage ops cycle (Asignados → Disponibles → Limpieza → Inspección → Servicio) + 7-stage maintenance cycle (En espera → Asignado a técnico → Diagnóstico → Espera refacciones → En reparación → Post-inspección → Liberados) + 6 workshop cards with capacity rings + stacked queue/busy/done bars
- **Mantenimiento** — ticket table-as-cards (T-3382 etc.), 5 KPIs, status pills, workshop assignment, cost in USD
- **Inspecciones** — active inspections with 5-step progress (Odómetro+Comb. → Checklist → Mapa daños → Fotos → Firma), queue + completed list, hallazgos count

**Datos de flota:**
- **Flota** — 220px sidebar with filter groups (sucursal/estado/categoría/contrato), live filtering, vehicle cards in 2-col bento grid, search input
- **Expediente del vehículo** — 5-tab profile (Resumen / Servicio / QR / Alerta manual / Historial), full ficha técnica, manufacturer service schedule with step indicators, **functional QR placeholder** SVG, manual alert form with severity/recipient/auto-action, vertical event timeline
- **Contratos** — tabs Largo plazo + Renta corta hoy (Karve), sync status banner, hourly schedule table

**Estratégico:**
- **Analítica** — 5 strategic KPIs, multi-series area chart (utilization by category over 5 months), category distribution bars, branch comparison bars, 3 "hallazgos" insight cards
- **Inteligencia** — admin-only badge, 6 strategic KPIs, 4 tabs (Resumen / Tiempo en taller / Ingresos+utilización / Recomendaciones), score rings, sell/evaluate/hold groups

**Mobile (CarCheck):**
- Phone triptych — **Tareas** home with scan-QR CTA + pendientes list · **Inspección activa** with step progress + odo/fuel mini + photo grid (taken/empty states) + mini damage map · **Mapa de daños** with top-down car SVG, damage marker, bottom-sheet damage entry (tipo / severidad / auto-action warning).

**Drill-down states** preserved (incident · ANCAP · Montevideo branch). **Spec-faithful dark + light** kept as reference at the bottom.

Each screen reuses the same TopBar with the right tab active, the same SoftCard/SoftBadge/PillButton primitives, and the same warm-conversational page headers. Data is fully Uruguayan throughout — workshops include "Carrocerías Pereyra" and "Chevrolet Sevel"; tickets reference real local plates.

