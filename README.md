# FolklorHub

**Sastav tima:** Gabriel Beronja

## 🎓 Institucija

[Fakultet informatike u Puli](https://fipu.unipu.hr/)

**Kolegij:** [Programsko inženjerstvo](https://ntankovic.unipu.hr/pi)

**Mentor:** [doc. dr. sc. Nikola Tanković](https://ntankovic.unipu.hr)

## 📖 Opis aplikacije

FolklorHub je digitalna platforma namijenjena očuvanju i promociji hrvatske folklorne baštine. Aplikacija omogućuje korisnicima pregledavanje bogatog kataloga hrvatskih folklornih plesova i pjesama organiziranih po regijama, praćenje kalendara folklornih događanja (smotre, festivali, radionice), kao i sudjelovanje u forumu za diskusiju o folkloru.

### ✨ Ključne funkcionalnosti

- **📚 Katalog plesova i pjesama** - Pregled folklornih sadržaja po regijama Hrvatske s detaljnim opisima, videozapisima i audio materijalima
- **📅 Kalendar događanja** - Praćenje nadolazećih smotri, festivala i radionica s mogućnostima filtriranja i kalendarski prikaz
- **💬 Forum za diskusiju** - Platforma za komunikaciju između folkloraša, dijeljenje iskustava i postavljanje pitanja
- **⭐ Korisnički profili** - Personalizirani profili s favoriti, statistikama aktivnosti i upravljanjem računa
- **🔍 Pretraživanje i filtriranje** - Napredne mogućnosti pretrage po regijama, tipovima sadržaja i ključnim riječima

## 🌐 Javni prototip

[Link na prototip će biti dodavan naknadno]

## 🛠️ Tehnologije

- **Frontend:** Vue.js 3, Vite, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)
- **State Management:** Pinia
- **Routing:** Vue Router
- **UI komponente:** Headless UI

## 👨‍💻 Zaduženja po članu tima

### Gabriel Beronja

- [x] **Projektno planiranje i arhitektura**
  - Definiranje strukture aplikacije i tehnološkog steka
  - Postavljanje Vue.js projekta s Vite build sustavom
  - Konfiguracija Tailwind CSS-a za stiliziranje
- [x] **Dizajn i korisničko sučelje**
  - Kreiranje responzivnog dizajna s fokusom na korisnost
  - Implementacija komponenti za navigaciju (Navbar, Footer)
  - Dizajn home stranice s hero sekcijom i featured sadržajem
- [x] **Autentifikacija i korisnici**
  - Integracija Supabase autentifikacije
  - Implementacija registracije, prijave i odjave
  - Razvoj korisničkih profila s mogućnostima uređivanja
  - Upload i upravljanje profilnim slikama
- [x] **Katalog funkcionalnost**
  - Kreiranje kataloga plesova i pjesama
  - Implementacija sistema favorita
  - Dodavanje pretraživanja i filtriranja po regijama
  - Detaljni prikaz pojedinih stavki kataloga
- [x] **Forum sustav**
  - Razvoj forum funkcionalnosti za kreiranje tema
  - Sistem komentiranja s mogućnostima lajkanja
  - Upravljanje korisničkim objavama i komentarima
- [x] **Kalendar događanja**
  - Kreiranje kalendara folklornih događanja
  - Implementacija filtriranja po tipovima događaja
  - Kalendarski i lista prikaz s detaljnim informacijama
- [x] **State management**
  - Postavljanje Pinia store-ova za upravljanje stanjem
  - Implementacija reaktivnih podataka kroz aplikaciju
  - Optimizacija performansi i cache-iranja podataka
- [x] **Supabase integracija**
  - Konfiguracija baze podataka i sigurnosnih politika
  - Implementacija CRUD operacija
  - File storage za profilne slike i medijske sadržaje
- [ ] **Testiranje i optimizacija**
  - Unit testiranje ključnih komponenti
  - Optimizacija performansi aplikacije
  - Browser kompatibilnost testing
- [ ] **Deployment i dokumentacija**
  - Priprema aplikacije za produkciju
  - Kreiranje korisničke dokumentacije
  - Setup CI/CD pipeline-a

## 📋 Status razvoja

Projekt je trenutno u fazi razvoja. Implementirane su sve glavne funkcionalnosti:

- ✅ Autentifikacija korisnika
- ✅ Katalog plesova i pjesama
- ✅ Forum za diskusiju
- ✅ Kalendar događanja
- ✅ Korisnički profili
- ✅ Responsive design

## 🚀 Pokretanje projekta lokalno

```bash
# Kloniranje repozitorija
git clone <repository-url>
cd folklorhub

# Instalacija dependencies
npm install

# Pokretanje development servera
npm run dev
```

## 📝 Napomene

Aplikacija koristi Supabase kao backend-as-a-service rješenje za upravljanje bazom podataka, autentifikacijom i file storage-om. Za lokalno pokretanje potrebno je konfigurirati Supabase okruženje prema uputama u projektu.
