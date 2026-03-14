# Project Manager Demo

Aplicație web simplă pentru management de proiecte, construită ca un singur proiect full-stack:

- **Frontend:** Next.js App Router + React + TypeScript
- **Backend:** Next.js Route Handlers (`/api/...`)
- **Baza de date:** Supabase Postgres
- **Deploy recomandat:** Vercel (frontend + backend) + Supabase (database)

## De ce am ales stack-ul acesta

Este una dintre cele mai simple combinații moderne pentru un MVP:

- ai **un singur repo** pentru frontend și backend;
- deploy-ul pe Vercel este foarte simplu;
- Supabase oferă rapid o bază Postgres administrată;
- poți testa imediat aplicația cu scriptul SQL inclus.

## Funcționalități incluse

- listare proiecte
- creare proiect
- vizualizare detalii proiect
- schimbare status proiect
- ștergere proiect
- creare task
- schimbare status task
- ștergere task
- date demo pentru test

---

## 1. Cerințe locale

Instalează:

- **Node.js LTS**
- **npm** (vine cu Node)
- cont gratuit **Supabase**
- cont gratuit **Vercel**
- opțional: cont **GitHub** pentru deploy rapid

---

## 2. Creare bază de date în Supabase

1. Creezi un proiect nou în Supabase.
2. Deschizi **SQL Editor**.
3. Rulezi conținutul fișierului:

```sql
./database/001_init.sql
```

Acest script:

- creează tabelele `projects` și `tasks`
- adaugă indecși
- inserează date demo

După rulare, baza de date este gata pentru test.

---

## 3. Variabile de mediu

Copiază fișierul exemplu:

```bash
cp .env.example .env.local
```

Completează `.env.local` cu valorile din Supabase:

```env
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

### De unde iei valorile

În Supabase:

- `SUPABASE_URL` = Project URL
- `SUPABASE_SERVICE_ROLE_KEY` = cheia Service Role

> Important: `SUPABASE_SERVICE_ROLE_KEY` trebuie păstrată doar pe server. Nu o expune în frontend.

---

## 4. Pornire locală

În folderul proiectului:

```bash
npm install
npm run dev
```

Aplicația va porni la:

```text
http://localhost:3000
```

---

## 5. Structura proiectului

```text
src/
  app/
    api/
      projects/
      tasks/
    projects/[id]/
    globals.css
    layout.tsx
    page.tsx
  components/
  lib/
  types/
database/
  001_init.sql
```

---

## 6. Cum funcționează backend-ul

Backend-ul este în route handlers Next.js:

- `GET /api/projects` — listă proiecte
- `POST /api/projects` — creare proiect
- `GET /api/projects/:id` — detalii proiect + task-uri
- `PATCH /api/projects/:id` — actualizare proiect
- `DELETE /api/projects/:id` — ștergere proiect
- `POST /api/projects/:id/tasks` — creare task
- `PATCH /api/tasks/:id` — actualizare task
- `DELETE /api/tasks/:id` — ștergere task

Frontend-ul comunică doar cu aceste endpoint-uri.

---

## 7. Deploy pe Vercel

### Varianta recomandată

1. Urcă proiectul într-un repository GitHub.
2. În Vercel, alege **Add New Project**.
3. Importă repository-ul.
4. Adaugă variabilele de mediu:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

5. Apasă **Deploy**.

Vercel detectează automat aplicația Next.js.

### Build settings

Nu trebuie setat nimic special. Valorile implicite sunt suficiente.

---

## 8. Ordinea corectă pentru deploy

1. creezi proiectul Supabase
2. rulezi `database/001_init.sql`
3. verifici că datele demo există
4. configurezi variabilele de mediu în Vercel
5. faci deploy la aplicație

---

## 9. Test rapid după deploy

După deploy, verifică:

- dashboard-ul încarcă cele 3 proiecte demo
- poți crea un proiect nou
- poți intra într-un proiect
- poți adăuga task nou
- poți schimba status-ul proiectului și task-urilor
- poți șterge proiecte și task-uri

---

## 10. Limitări intenționate ale demo-ului

Ca să rămână foarte simplu, acest demo:

- nu are autentificare
- nu are roluri/permisii
- nu are upload fișiere
- nu are filtrare avansată

Pentru o versiune următoare poți adăuga:

- autentificare cu Supabase Auth
- RLS policies
- comentarii pe task-uri
- atașamente
- dashboard cu filtre și căutare

---

## 11. Comenzi utile

```bash
npm install
npm run dev
npm run build
npm run start
```

---

## 12. Fișierul SQL de migrare

Migrarea de bază este în:

```text
database/001_init.sql
```

Dacă vrei o a doua migrare în viitor, creezi de exemplu:

```text
database/002_add_priority.sql
```

și o rulezi tot din Supabase SQL Editor.

---

## 13. Observație pentru producție

Acest proiect este gândit ca **demo / MVP rapid**. Pentru producție recomand:

- autentificare
- RLS activ în Supabase
- validare mai strictă
- audit log
- rate limiting
- monitoring
