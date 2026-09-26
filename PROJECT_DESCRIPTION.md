# Project Overview: Gamana Muuttopalvelu

## Executive Summary
**Gamana Muuttopalvelu** (`gamanamuutto.fi`) is a full-stack digital web platform engineered for a professional moving service operating in Finland. The application streamlines moving service requests, provides transparent dynamic pricing estimations, and allows customers to submit service bookings effortlessly.

---

## 🏗️ Architecture & Infrastructure

### Frontend Architecture
* **Framework:** Angular (Standalone Components)
* **Routing & State:** RxJS-driven reactive data flow with client-side SPA routing.
* **Geospatial & Mapping:** Leaflet and MapLibre integration for route visualization and distance-based price estimations.
* **UI Framework:** Integrated Angular Material and Bootstrap styling.

### Backend Architecture
* **Framework:** .NET Core RESTful Web API
* **Static Asset Delivery:** Server-configured static file handling for SPA fallbacks and direct root file access (`robots.txt`, `sitemap.xml`).

### Deployment & Hosting Pipeline
* **Hosting Platform:** Render Web Service
* **Domain & DNS Provider:** Zoner.fi with custom CNAME/A records and SSL termination.
* **SEO & Indexing:** Verified via DNS TXT records on Google Search Console, configured with crawling directives and structured XML sitemaps.

---

## 🎯 Key Capabilities

1. **Interactive Moving Cost Estimator**  
   Calculates route distances using mapping services to give users immediate, accurate moving estimates.

2. **Multi-Step Booking System**  
   User-friendly forms to capture relocation details, inventory size, preferred schedules, and special handling requests.

3. **Production-Ready SEO Integration**  
   Full compliance with search engine indexing standards, canonical route definitions, and automated bot crawling permissions.