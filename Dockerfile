FROM node:20-alpine

# Installer Chromium + dépendances nécessaires
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Variables d’environnement Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROME_PATH=/usr/bin/chromium-browser

WORKDIR /app
    
COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 9000

CMD ["npm", "run", "dev"]
