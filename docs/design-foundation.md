# Mixpo Design Foundation

Deze foundation vertaalt de eerdere CSS-analyse naar een rustig, professioneel systeem voor een briefingplatform. De nadruk ligt op leesbaarheid, ritme, vertrouwen en schaalbaarheid, niet op show.

## 1. Kleurenpalet

### Neutrale basis

- `#F4F6F8` pagina-achtergrond
- `#EDF1F5` achtergrond-variant voor dashboardlagen
- `#FFFFFF` primaire surface
- `#F8FAFC` secundaire surface
- `#D9E1EA` standaard border
- `#C1CDDB` sterkere border
- `#16212C` primaire tekst
- `#405160` secundaire tekst
- `#647487` muted tekst en metadata

### Hoofdaccent

- `#0D5B6E` petrol-blauwgroen voor primary acties en focus
- `#0A4959` sterkere hover- en active-variant
- `#E2EDF1` zachte accentachtergrond voor pills, filters en rustige nadruk

### Premium detailkleur

- `#8A6B45` warme, ingetogen detailtoon
- `#F2EBE1` zachte achtergrond voor highlight-tags, editorial details of statuslabels

### Statuskleuren

- `#14715A` positief / stabiel
- `#936723` waarschuwing / aandacht nodig
- `#B34B46` urgent / risico

Waarom dit werkt:

- De neutrale laag houdt dashboards rustig en geloofwaardig.
- Het petrol-accent voelt zakelijk en modern zonder de "startup-blue" valkuil.
- De warme detailkleur geeft een subtiel premium-signaal zonder entertainment-esthetiek.

## 2. Typografie

### UI-font

- Aanbevolen: `Public Sans`
- Veilige fallback in de foundation: `Aptos`, `Segoe UI Variable`, `Segoe UI`

Waarom:

- Zeer leesbaar in dashboards, tabellen, briefingkaarten en filters
- Professionele uitstraling
- Minder modegevoelig dan expressieve display-sans fonts

### Accent-font

- Aanbevolen: `Source Serif 4`
- Veilige fallback in de foundation: `Iowan Old Style`, `Palatino Linotype`, `Georgia`

Gebruik alleen voor:

- hero-titels op de homepage
- belangrijke sectietitels
- quotes of redactionele intro's

Niet gebruiken voor:

- navigatie
- dashboards
- kleine metadata
- dense contentmodules

### Typografische rolverdeling

- `xs`: labels, filters, metadata
- `sm`: compacte UI-tekst
- `base`: standaard body copy
- `md`: introtekst en kaartsamenvattingen
- `lg`: kaarttitels en belangrijke subheads
- `xl` tot `3xl`: homepage-headlines en sectiekoppen

Praktische regel:

- Gebruik uppercase alleen voor eyebrow, tabs, statuslabels en kleine metadata.
- Laat briefingtitels, samenvattingen en dashboardcontent gewoon lezen in sentence case.

## 3. Spacing- en schaal-systeem

De foundation gebruikt een 4/8-gebaseerde schaal:

- `2xs`: 4px
- `xs`: 8px
- `sm`: 12px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 72px
- `4xl`: 96px

Gebruik:

- `xs` tot `md` binnen componenten
- `lg` tot `xl` tussen cards en sectieblokken
- `2xl` en groter alleen voor page rhythm, hero's en grotere sectie-overgangen

Waarom:

- Houdt briefingblokken compact en scanbaar
- Voorkomt dat de homepage te luchtig of te leeg wordt
- Werkt goed op mobiel zonder eindeloze overrides

## 4. Basis grid en layout

### Containers

- Standaard contentcontainer: `76rem`
- Dashboardcontainer: `90rem`
- Tekstbreedte: `64ch`

### Homepage

- Hero: `1.45fr / 0.8fr`
- Contentsecties: 2 kolommen waar zinvol
- Kaartgrids: 12-kolomslogica, met featured kaart groter dan de rest

### Dashboard

- Hoofdlayout: `1.7fr / sidebar`
- Sidebar breedte: `18rem` tot `21rem`
- Sticky rail alleen op desktop
- Op tablet en mobiel alles terug naar 1 kolom

Ontwerpprincipe:

- Desktop geeft overzicht en scannability via duidelijke kolommen.
- Mobiel krijgt eenvoud: geen mini-dashboard in twee smalle kolommen als de content dat niet verdraagt.

## 5. CSS-architectuur

De file `css/design-foundation.css` is bewust opgebouwd in deze volgorde:

1. Tokens
2. Base
3. Layout objects
4. Core components
5. Homepage patterns
6. Dashboard patterns
7. Utilities

Dat betekent in de praktijk:

- Tokens bevatten alleen design decisions.
- Layout objects regelen breedte, grids, spacing en flow.
- Components zijn herbruikbare bouwstenen zoals `card`, `button`, `pill`, `surface`.
- Page patterns zijn specifieke composities voor homepage en dashboard.
- Utilities blijven klein en functioneel.

## 6. Belangrijkste klassen in de foundation

### Pagina en layout

- `.app-frame`
- `.app-frame--dashboard`
- `.app-shell`
- `.app-shell--dashboard`
- `.page-section`
- `.page-section--hero`

### Structuur

- `.section-heading`
- `.stack-sm`, `.stack-md`, `.stack-lg`
- `.cluster`
- `.cluster--spread`

### Componenten

- `.surface`
- `.surface--solid`
- `.surface--hero`
- `.card`
- `.card--briefing`
- `.card--priority`
- `.card--metric`
- `.pill`
- `.pill--neutral`
- `.pill--warm`
- `.button`
- `.button--secondary`
- `.button--quiet`

### Homepage patronen

- `.hero-panel`
- `.hero-grid`
- `.hero-copy`
- `.hero-sidebar`
- `.signal-list`
- `.home-grid`
- `.home-grid--cards`

### Dashboard patronen

- `.dashboard-layout`
- `.dashboard-main`
- `.dashboard-rail`
- `.dashboard-header`
- `.dashboard-toolbar`
- `.metric-grid`
- `.briefing-card`
- `.briefing-card__footer`

## 7. Aanbevolen toepassing in jullie platform

### Homepage

- Gebruik de accent-serif alleen in de hoofdheadline en maximaal een paar redactionele subkoppen.
- Werk met rustige surfaces en een featured briefingkaart, niet met veel bewegende lagen.
- Laat metadata, tags en actieknoppen consequent uit hetzelfde tokensysteem komen.

### Dashboard

- Gebruik vooral `surface`, `card`, `metric-grid` en `dashboard-layout`.
- Houd kaarten informatief en compact.
- Laat de visuele hierarchie uit spacing, typografie en border-contrast komen, niet uit veel kleur.

### Niet doen

- Geen zware glassmorphism of felle gradients op alle panels.
- Geen grote uppercase display-headers in het dashboard.
- Geen complexe clip-paths of showcase-animatie als default patroon.

## 8. Hoe ik dit zou invoeren

Aanbevolen volgorde:

1. Eerst tokens en typography invoeren.
2. Daarna bestaande cards en buttons op de nieuwe componentlaag mappen.
3. Vervolgens homepage hero en briefinggrids aanpassen.
4. Als laatste pas de dashboard-layout vereenvoudigen en aanscherpen.

Zo kun je moderniseren zonder dat de site onrustig of inconsistent wordt.
