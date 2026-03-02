# Nattsken - Utvecklingsblogg

**Ett individuellt arbete för Lexicon Front-end-utbildningen 2025-2026**

Projektet är för https://github.com/Lexicon-Utbildning-Front-end-2025-2026/individuellt-arbete

## Projektbeskrivning

### Intro
Jag vill simulera en verklighetstrogen uppgift där jag kastas in i ett projekt och ska utveckla en blogg åt något företag. I detta fall är det faktiskt ett projekt jag startat vid sidan av Lexicon med projektnamnet **Nattsken**. Mycket av koden, designen, frontend i Next.js, backend i Express m.m. finns redan klart för det projektet. Men - stora delar av det projektet är saker jag inte vill dela publikt och passar därför inte scope:et för detta individuella projekt åt Lexicon.

### Projektet
Projektet är en utvecklingsblogg för just den plattformen, där jag kan dokumentera det arbete som görs och hur arbetet fortskrider vid sidan om faktiska plattformen.
Skriven i Next.js och vara rätt simpel rent layout-mässigt, men extra vikt läggs vid att anpassa bloggen så den matchar existerande design utifrån referenser.

Tanken med detta upplägg är för att uppfylla både uppgiften men samtidigt få något jag kan använda i utvecklingen för mitt existerande projekt också.

### Design
Designen/Layout tas fram antingen med Figma, men utgå ifrån inspirationslänkarna nedan.

Utvecklingsbloggen ska anpassas så att färger, typografi och känsla passar **Nattsken** i övrigt - enligt existerande designdokument.

#### Inspiration
- [Cloudflare: Blogg](https://blog.cloudflare.com) 
- [Cloudflare: Individuell bloggpost](https://blog.cloudflare.com/vinext/)


### Tekniker
Inloggning sker med enkel Google OAuth där jag enbart tillåter personer från domänen jine.se att logga in. Det är enkelt löst.

Databasen för **Nattsken** är PostgreSQL. Av säkerhetsskäl och enkelhet valde jag att använda Neon (serverless PostgreSQL) i detta projekt, dvs hålla databasen för bloggposter helt separat. 
Jag valde Neon just för att det är mer likt _vanlig_ Postgres än t.ex. Supabase.

Det gör även att jag slipper migrationsfiler för att hålla riktiga databasen i rätt stadie, samt håller utvecklingsprocesserna separata. Huvudprojektet använder sig av websockets, realtids-data och platsinformation, så det är av självklara skäl som denna plattform hålls separat. 

Trots den separata databasen och att det bara är jag som kan logga in m.h.a OAuth, så är det viktigt att all postdata valideras med Zod när jag postar något.

Admin-delen är en simpel CRUD via API-routes som i sin tur kommunicerar med Neon, inget separat backend utanför Next.js behövs.
Men jag vill kunna bifoga bilder (eller egentligen klistra in) bilder direkt i admin/WYSIWYG-gränssnittet.

Av enkelhetsskäl hostas den på samma plattform som projektet, en egen-hostad Coolify (som fungerar ungefär som Vercel).

## Tech-stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Rich text-editor**: Tiptap
- **Styling**: Tailwind CSS (**anpassat** efter Nattskens designsystem)
- **Databas**: Neon (Serverless PostgreSQL), helt separat instans
- **Autentisering**: Auth.js + Google OAuth (endast @jine.se)
- **Validering**: Zod
- **Bildhantering**: Lokal uppladdning i admin (kommer specificeras närmare)
- **Deployment**: Self-hosted Coolify

## Projektdelar

### Publik del
- Lista med inlägg samt tillhörande paginering
- Individuella, snyggt formaterade bloggposter (HTML)
- Footer per-post med Postat när/av
- Responsiv design som matchar Nattskens vibe, med extra fokus på Mobile First
- Enkel sökning efter inlägg

### Admin (skyddad med inloggning)
- Full CRUD för bloggposter
- Rich text med [Tiptap](https://tiptap.dev/) + möjlighet att klistra in eller ladda upp bilder lokalt
- Strikt validering med Zod på all indata
- Google OAuth med domänbegränsning (jine.se)

### Övrigt
- Helt separat databas ([Neon](https://neon.com/))
- [Dockerfile](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile) för att få snabbare deployment i Coolify

## Projektplanering (Lexicon)

- **GitHub Projects + Product Backlog**: https://github.com/users/jine/projects/4
- **Wireframes / Designskiss**: [Utkast 1](https://www.figma.com/make/ni24Umd4pqnUxOT8V821xO/Develop-Blog-for-Nattsken?t=uumlYSsbnfbGeXpY-1)

### Nattsken-referensdokument (Ej publika)
- **Design System Reference**: https://github.com/jine/nattsken.se/blob/main/DESIGN.md
- **README.md**: https://github.com/jine/nattsken.se/blob/main/README.md
- **API.md**: https://github.com/jine/nattsken.se/blob/main/API.md
- **ARCHITECTURE.md**: https://github.com/jine/nattsken.se/blob/main/ARCHITECTURE.md
