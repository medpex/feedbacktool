# Feedback System

Ein schlankes, nutzerfreundliches Feedback-System mit Kunden-Landingpage und Admin-Dashboard.

## 🚀 Funktionen

- **Kunden-Feedback**: Einfache Sternebewertung und optionales Textfeedback
- **Admin-Dashboard**: Übersicht, Statistiken und Verwaltung aller Bewertungen
- **Link-Generator**: Personalisierte Feedback-Links mit QR-Codes
- **Responsive Design**: Optimiert für Desktop und Mobile

## 🐳 Docker Installation

### Voraussetzungen
- Docker (Version 20.10 oder höher)
- Docker Compose (Version 2.0 oder höher)

### Installation über GitHub

1. **Repository klonen**
```bash
git clone https://github.com/medpex/quick-review-compass
cd quick-review-compass
```

2. **Mit Docker Compose starten**
```bash
docker-compose up -d
```

3. **Anwendung öffnen**
- Kunden-Feedback: http://localhost:3000
- Admin-Dashboard: http://localhost:3000/admin

### Alternative: Direkter Docker Build

```bash
# Image erstellen
docker build -t feedback-system .

# Container starten
docker run -d -p 3000:80 --name feedback-app feedback-system
```

### Entwicklungsmodus

Für die lokale Entwicklung ohne Docker:

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

## 🔧 Konfiguration

### Umgebungsvariablen

Erstellen Sie eine `.env` Datei für lokale Konfiguration:

```env
# Beispiel-Konfiguration
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=Feedback System
```

### Admin-Zugang

**Standard-Login:**
- Benutzername: `admin`
- Passwort: `password123`

> ⚠️ **Wichtig**: Ändern Sie das Admin-Passwort in der Produktionsumgebung!

## 📡 API-Endpunkte für n8n Integration

### Links generieren
```http
POST /api/links
Content-Type: application/json

{
  "customerNumber": "KD-12345",
  "customerName": "Max Mustermann",
  "concern": "Internet-Freischaltung"
}
```

**Response:**
```json
{
  "id": "unique-link-id",
  "feedbackUrl": "http://localhost:3000/?customer=KD-12345&name=Max+Mustermann&concern=Internet-Freischaltung&text=K%C3%BCrzlich+wurde+Ihr+Internet+freigeschaltet%2C+wie+war+Ihre+Erfahrung%3F&ref=unique-link-id",
  "qrCodeDataUrl": "data:image/svg+xml;base64,..."
}
```

### Link-Details abrufen
```http
GET /api/links/{id}
```

### Feedback abrufen
```http
GET /api/feedback
```

## 🔄 n8n Workflow-Integration

### Beispiel-Workflow für automatischen E-Mail-Versand:

1. **Trigger**: Webhook oder Schedule
2. **HTTP Request**: POST zu `/api/links` mit Kundendaten
3. **E-Mail senden**: QR-Code und Link an Kunde
4. **Daten speichern**: Link-ID für Tracking

### n8n HTTP Request Node Konfiguration:
```json
{
  "method": "POST",
  "url": "http://localhost:3000/api/links",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "customerNumber": "{{ $json.customerNumber }}",
    "customerName": "{{ $json.customerName }}",
    "concern": "{{ $json.concern }}"
  }
}
```

## 🖥️ Backend-API & Datenbank (ab Version X)

- Das neue Backend liegt im Ordner /backend (mit eigenem README und tsconfig.json)
- Die Daten werden in einer PostgreSQL-Datenbank gespeichert
- API-Endpunkte:
  - POST /api/feedback-links: Erzeugt einen neuen Feedback-Link
  - GET /api/feedback-links/:id: Holt Details zu einem Link
  - POST /api/feedback: Speichert Kundenfeedback
  - GET /api/feedback: Holt alle Feedbacks (Admin)
- Die Frontend-App muss die API-URL auf das Backend zeigen (z.B. VITE_API_URL=http://localhost:4000/api)

## 🛠️ Wartung

### Container-Logs anzeigen
```bash
docker-compose logs -f feedback-app
```

### Container neustarten
```bash
docker-compose restart feedback-app
```

### Updates einspielen
```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Datenbank-Backup (falls PostgreSQL verwendet)
```bash
docker-compose exec postgres pg_dump -U feedback_user feedback_db > backup.sql
```

## 🔒 Sicherheit

- SSL/TLS für Produktionsumgebung konfigurieren
- Admin-Passwort ändern
- Firewall-Regeln für Port 3000 beachten
- Regelmäßige Updates der Docker-Images

## 📊 Monitoring

Für Produktionsumgebungen empfohlen:
- Container-Monitoring (z.B. Portainer)
- Log-Aggregation (z.B. ELK Stack)
- Uptime-Monitoring

## 🤝 Support

Bei Problemen:
1. Container-Logs prüfen: `docker-compose logs`
2. Port-Verfügbarkeit prüfen: `netstat -tulpn | grep 3000`
3. Docker-Status prüfen: `docker-compose ps`

## 📝 Lizenz

[Ihre Lizenz hier einfügen]

- Das Frontend bleibt wie gehabt im src-Ordner und funktioniert unabhängig vom Backend
