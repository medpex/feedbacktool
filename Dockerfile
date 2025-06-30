# ─── Builder Stage ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

# Arbeitsverzeichnis
WORKDIR /app

# Build-Argument, damit npm ci alle deps installiert
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Nur package-Manifeste kopieren und alle Dependencies installieren
COPY package*.json ./
RUN npm ci

# Quellcode kopieren und Anwendung bauen
COPY . .
RUN npm run build

# Production-Deps reduzieren (optional, reduziert node_modules)
RUN npm prune --production

# Hinweis: Das Backend läuft jetzt in einem eigenen Container (siehe docker-compose.yml)

# ─── Production Stage mit Nginx ───────────────────────────────────────────────
FROM nginx:alpine AS runner

# Dist-Ordner aus dem Builder übernehmen
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: node_modules, falls Du SSR oder API-Calls brauchst (entfällt bei purem Static-Build)
# COPY --from=builder /app/node_modules /app/node_modules

# Eigene Nginx-Config einbinden
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port freigeben
EXPOSE 80

# Nginx starten
CMD ["nginx", "-g", "daemon off;"]
