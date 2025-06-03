# FolklorHub

Digitalna platforma za očuvanje i promociju hrvatske folklorne baštine.

## 🎭 O projektu

FolklorHub je web aplikacija razvljena u Vue.js 3 koja omogućuje:

- Pregled kataloga hrvatskih folklornih plesova i pjesama
- Kalendar folklornih događanja (smotre, festivali, radionice)
- Forum za diskusiju o folkloru
- Korisničke profile s favoritima
- Pretraživanje i filtriranje sadržaja po regijama

## 🛠️ Tehnologije

- **Frontend**: Vue.js 3, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI komponente**: Headless UI

## 🚀 Pokretanje projekta

### Preduvjeti

- Node.js (verzija 16 ili viša)
- npm ili yarn
- Supabase projekt

### Instalacija

1. Klonirajte repozitorij:

```bash
git clone <repository-url>
cd folklorhub
```

2. Instalirajte dependencies:

```bash
npm install
```

3. Postavite environment varijable:

```bash
cp .env.example .env
```

Uredite `.env` datoteku s vašim Supabase podacima:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Postavite Supabase bazu podataka:

- Otvorite Supabase SQL Editor
- Izvršite skriptu `supabase-schema.sql`
- Izvršite skriptu `sample-data.sql`

5. Pokrenite development server:

```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:5173`

## 📦 Build za produkciju

```bash
npm run build
```

## 🎨 Funkcionalnosti

### Katalog

- Pregled plesova i pjesama po regijama
- Filtriranje po tipu sadržaja (ples/pjesma)
- Pretraživanje po nazivu i opisu
- Detaljni prikaz svake stavke

### Događanja

- Kalendar smotri, festivala i radionica
- Filtriranje po tipu događanja i lokaciji
- Kalendarski i lista prikaz
- Izvoz događanja u kalendar

### Forum

- Kreiranje tema za diskusiju
- Komentiranje i lajkanje
- Tagovi za lakše organiziranje
- Pretraživanje tema

### Korisnički profili

- Registracija i prijava
- Uređivanje profila
- Lista favorita
- Pregled vlastitih tema i komentara

## 📱 Responzivni dizajn

Aplikacija je potpuno responzivna i optimizirana za:

- Desktop računala
- Tablet uređaje
- Mobilne telefone

## 🔐 Sigurnost

- Supabase autentifikacija
- Row Level Security (RLS) politike
- Zaštićene rute
- Secure file upload

## 🎯 Buduće funkcionalnosti

- [ ] Upload audio/video zapisa
- [ ] Integracija s vanjskim kalendarima
- [ ] Push notifikacije za nova događanja
- [ ] Advanced search s AI preporukama
- [ ] Multi-jezik podrška

## 👥 Razvoj

Projekt je razvijen kao studentski projekt na Fakultetu informatike u Puli.

### Osoba:

- Gabriel Beronja

## 📄 Licenca

Ovaj projekt je licenciran pod MIT licencom.

## 🤝 Doprinosi

Doprinosi su dobrodošli! Molimo otvorite issue prije kreiranja pull requesta.

---

**FolklorHub** - čuvajmo našu tradiciju za buduće generacije! 🇭🇷
