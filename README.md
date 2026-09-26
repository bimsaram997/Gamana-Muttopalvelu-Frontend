# Gamana Muuttopalvelu - Frontend

The client-facing web application for **Gamana Muuttopalvelu** (`gamanamuutto.fi`), built with Angular. It provides an interactive moving cost calculator, service request forms, and localized route visualizations.

---

## 🛠️ Tech Stack & Libraries

* **Framework:** Angular (Standalone Components)
* **UI & Styling:** Angular Material, Bootstrap 5, Bootstrap Icons
* **Maps & Routing:** Leaflet, Leaflet Routing Machine, MapLibre GL
* **SEO & Crawling:** Canonical domain configurations, static `robots.txt`, and `sitemap.xml`
* **Deployment:** Render

---

## 📁 Repository Structure

```text
gamana-frontend/
├── public/                 # Root-served static assets (robots.txt, sitemap.xml)
├── src/
│   ├── app/                # Angular components, services, models, and guards
│   ├── assets/             # Images, icons, and dynamic local assets
│   ├── environments/       # Environment configurations (dev, prod)
│   └── styles.css          # Global application styles
├── angular.json            # Build options & static asset glob definitions
└── package.json            # Dependencies and npm build scripts
```

---

## ⚡ Local Development Setup

### Prerequisites
* **Node.js**: `v18+` or `v20+`
* **Angular CLI**: `npm install -g @angular/cli`

### Installation & Run

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   ng serve
   ```

3. Open your browser and navigate to `http://localhost:4200/`.

---

## 🚀 Production Build & Deployment

To generate a production-ready build bundle:

```bash
ng build --configuration production
```

The compiled output files will be generated in `dist/gamana-muttopalvelu-frontend/browser`.

### SEO Verification Rules
Ensure the following static routes respond with raw content on production:
* `https://gamanamuutto.fi/robots.txt`
* `https://gamanamuutto.fi/sitemap.xml`