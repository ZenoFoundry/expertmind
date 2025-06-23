FROM node:18-alpine AS development

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Instalar NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Verificar instalación (opcional, para debugging)
RUN nest --version

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

# Definir variables de entorno
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el código compilado desde la etapa de desarrollo
COPY --from=development /usr/src/app/dist ./dist

# Crear un usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Cambiar la propiedad de los archivos de la aplicación
RUN chown -R nestjs:nodejs /usr/src/app

# Cambiar al usuario no-root
USER nestjs

# Exponer puertos
EXPOSE 3000

# Comando por defecto para producción
CMD ["node", "dist/main"]