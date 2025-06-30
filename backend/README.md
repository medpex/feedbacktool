# Feedback Backend

Node.js/Express Backend für das Feedback-System

## Setup

```bash
cd backend
npm install
```

## Entwicklung starten

```bash
npm run dev
```

## Produktion bauen

```bash
npm run build
npm start
```

## .env Beispiel

Siehe `.env.example` für die Umgebungsvariablen.

## API-Endpunkte

- POST   /api/feedback-links      → Neuen Feedback-Link generieren
- GET    /api/feedback-links/:id  → Link-Details abrufen
- POST   /api/feedback            → Kundenfeedback speichern
- GET    /api/feedback            → Alle Feedbacks abrufen (Admin) 