# 🌙 Nattsken - Utvecklingsblogg

**Ett individuellt arbete för Lexicon Front-end-utbildningen 2025-2026**

Projekt för https://github.com/Lexicon-Utbildning-Front-end-2025-2026/individuellt-arbete

Live: https://blogg.nattsken.se

## 📋 Projektbeskrivning

### Intro
Jag vill simulera en verklighetstrogen uppgift där jag kastas in i ett projekt och ska utveckla en blogg åt något företag. I detta fall är det faktiskt ett projekt jag startat vid sidan av Lexicon med projektnamnet **Nattsken**. Mycket av koden, designen, frontend i Next.js, backend i Express m.m. finns redan klart för det projektet. Men - stora delar av det projektet är saker jag inte vill dela publikt och passar därför inte scope:et för detta individuella projekt åt Lexicon.

### Projektet
Projektet är en utvecklingsblogg för just den plattformen, där jag kan dokumentera det arbete som görs och hur arbetet fortskrider vid sidan om faktiska plattformen.
Skriven i Next.js och vara rätt simpel rent layout-mässigt, men extra vikt läggs vid att anpassa bloggen så den matchar existerande design utifrån referenser.

Tanken med detta upplägg är för att uppfylla både uppgiften men samtidigt få något jag kan använda i utvecklingen för mitt existerande projekt också.

### Design
Designen/Layout tas fram med Figma, men ska utgå ifrån inspirationslänkarna nedan.

Utvecklingsbloggen ska anpassas så att färger, typografi och känsla passar **Nattsken** i övrigt - enligt existerande designdokument.

#### 💡 Inspiration
- [Cloudflare: Blogg](https://blog.cloudflare.com) 
- [Cloudflare: Individuell bloggpost](https://blog.cloudflare.com/vinext/)

## 🚀 Installation

### Förkrav
- [Node.js](https://nodejs.org/) (version 20+)
- [PostgreSQL](https://www.postgresql.org/) databas (eller [Neon](https://neon.tech) för serverless)
- Google OAuth credentials (https://console.cloud.google.com/)

### Steg-för-steg

1. **Klona repot**
   ```bash
   git clone <repo-url>
   cd utvecklingsblogg
   ```

2. **Installera dependencies**
   ```bash
   npm install
   ```

3. **Konfigurera miljövariabler**
   ```bash
   cp .env.example .env
   ```
   
   Redigera `.env` och fyll i:
   - `DATABASE_URL` - Din PostgreSQL connection string
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Från Google Cloud Console (valfritt)
   - `BETTER_AUTH_SECRET` - Generera en stark slumpmässig sträng
   - `NEXT_PUBLIC_APP_URL` - Din lokala URL (t.ex. `http://localhost:3000`)

4. **Kör databasmigreringar**
   ```bash
   npx prisma migrate dev
   ```

5. **Starta utvecklingsservern**
   ```bash
   npm run dev
   ```

   Besök [http://localhost:3000](http://localhost:3000)

### Bygga för produktion

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t utvecklingsblogg .
docker run -p 3000:3000 --env-file .env utvecklingsblogg
```

## 🛠️ Tech-stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Rich text-editor**: Tiptap
- **Styling**: Tailwind CSS (**anpassat** efter Nattskens designsystem)
- **Databas**: Neon (Serverless PostgreSQL), Prisma ORM
- **Autentisering**: Better Auth + Google OAuth (endast @jine.se)
- **Validering**: Zod
- **Bildhantering**: Lokal uppladdning i admin
- **Deployment**: Self-hosted Coolify
- **Testing**: Playwright (E2E)

## 📦 Projektdelar

### Publik del
- Publicerade inlägg i grid 
- Individuella, snyggt formaterade bloggposter (HTML)
- Footer per-post med Postat när/med taggar
- Responsiv design som matchar Nattskens vibe, med extra fokus på Mobile First
- Enkel sökning efter inlägg

### Admin (skyddad med inloggning)
- Full CRUD för bloggposter
- Rich text med [Tiptap](https://tiptap.dev/) + möjlighet att klistra in bilder
- Strikt validering med [Zod](https://zod.dev/) på all indata
- Google OAuth med domänbegränsning (jine.se)
- Visuell markering av opublicerade inlägg (utkast)

### Övrigt
- Neon databas ([Neon](https://neon.com/))
- [Prisma ORM](https://www.prisma.io/)
- [Dockerfile](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile) för deployment

## 🧪 Tester

### Köra E2E-tester med Playwright

```bash
# Kör tester i UI-läge
npx playwright test --ui

# Kör alla tester
npx playwright test

# Kör tester i specifik browser
npx playwright test --project=chromium
```

## 📸 Screenshot

![Screenshot av blogg.nattsken.se](public/screenshot.png)

## 👤 Om mig

**Jim Nelin**

- 📧 [jim@jine.se](mailto:jim@jine.se)
- 🐙 [GitHub: @jine](https://github.com/jine)
- 🌐 [jimnelin.com](https://jimnelin.com)
- 💼 [LinkedIn: jimnelin](https://www.linkedin.com/in/jimnelin/)

## 📅 Projektplanering (Lexicon)

- **GitHub Projects + Product Backlog**: [Projekt Utvecklingsblogg](https://github.com/users/jine/projects/5)
- **Wireframes / Designskiss**: [Utkast 1](https://www.figma.com/make/ni24Umd4pqnUxOT8V821xO/Develop-Blog-for-Nattsken?t=uumlYSsbnfbGeXpY-1)

### Nattsken-referensdokument (Ej publika)
- **Design System Reference**: https://github.com/jine/nattsken.se/blob/main/DESIGN.md
- **README.md**: https://github.com/jine/nattsken.se/blob/main/README.md
- **API.md**: https://github.com/jine/nattsken.se/blob/main/API.md
- **ARCHITECTURE.md**: https://github.com/jine/nattsken.se/blob/main/ARCHITECTURE.md
