# EXP Core - AI-Powered Application

Una aplicación full-stack que integra Node.js con MongoDB y Ollama para capacidades de inteligencia artificial local.

## 🚀 Características

- **Backend Node.js**: API REST desarrollada con Node.js
- **Base de datos MongoDB**: Almacenamiento de datos con autenticación
- **IA Local con Ollama**: Modelo `qwen2:1.5b` para procesamiento de lenguaje natural
- **Containerización completa**: Todo el stack funciona con Docker Compose
- **Configuración automática**: Setup automático del modelo de IA

## 📋 Pre-requisitos

- [Docker](https://docs.docker.com/get-docker/) >= 20.0
- [Docker Compose](https://docs.docker.com/compose/install/) >= 2.0
- Al menos 4GB de RAM disponible para Ollama
- 2GB de espacio en disco para el modelo de IA

## 🚀 Instalación y Uso

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd exp-project
```

### 2. Iniciar los servicios
```bash
docker-compose up -d
```

### 3. Verificar el estado de los servicios
```bash
docker-compose ps
```

### 4. Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose logs -f

# Solo exp-core
docker-compose logs -f exp-core

# Solo ollama
docker-compose logs -f ollama
```

## 🔧 Configuración

### Variables de Entorno

El servicio `exp-core` utiliza las siguientes variables:

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `NODE_ENV` | `develop` | Entorno de ejecución |
| `MONGODB_URI` | `mongodb://admin:password123@mongodb:27017/expdb?authSource=admin` | URI de conexión a MongoDB |
| `OLLAMA_URL` | `http://ollama:11434` | URL del servicio Ollama |
| `PORT` | `3000` | Puerto de la aplicación |

### MongoDB

- **Usuario**: `admin`
- **Contraseña**: `password123`
- **Base de datos**: `expdb`
- **Puerto**: `27017`

### Ollama

- **Modelo**: `qwen2:1.5b`
- **Puerto**: `11434`
- **Host**: `0.0.0.0`

## 📡 Endpoints de la API

La aplicación estará disponible en: `http://localhost:3000`

> **Nota**: Los endpoints específicos dependen de tu implementación en el código de `exp-core`.

## 🐳 Servicios Docker

### exp-core
- **Puerto**: 3000
- **Descripción**: Aplicación principal Node.js
- **Dependencias**: MongoDB, Ollama

### mongodb
- **Puerto**: 27017
- **Descripción**: Base de datos MongoDB con autenticación
- **Volúmenes**: 
  - `mongodb_data`: Datos de la base
  - `mongodb_config`: Configuración
  - `./mongo-init`: Scripts de inicialización

### ollama
- **Puerto**: 11434
- **Descripción**: Servicio de IA local
- **Volumen**: `ollama_data`: Modelos y configuración

### ollama-setup
- **Descripción**: Servicio temporal para instalar el modelo `qwen2:1.5b`
- **Ejecución**: Una sola vez al inicio

## 🛠️ Comandos Útiles

### Gestión de contenedores
```bash
# Iniciar servicios
docker-compose up -d

# Parar servicios
docker-compose down

# Reiniciar un servicio específico
docker-compose restart exp-core

# Reconstruir e iniciar
docker-compose up --build -d

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v
```

### Debugging
```bash
# Acceder al contenedor de exp-core
docker-compose exec exp-core sh

# Acceder a MongoDB
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Ver logs de un servicio específico
docker-compose logs -f [servicio]
```

### Ollama
```bash
# Listar modelos instalados
docker-compose exec ollama ollama list

# Instalar un nuevo modelo
docker-compose exec ollama ollama pull [modelo]

# Probar el modelo
docker-compose exec ollama ollama run qwen2:1.5b "Hola, ¿cómo estás?"
```

## 📁 Estructura del Proyecto

```
.
├── docker-compose.yml
├── Dockerfile
├── README.md
├── mongo-init/           # Scripts de inicialización de MongoDB
├── src/                  # Código fuente de la aplicación
├── package.json
└── node_modules/
```

## 🔍 Troubleshooting

### El modelo de IA no se descarga
```bash
# Verificar si Ollama está funcionando
curl http://localhost:11434/api/version

# Reinstalar el modelo manualmente
docker-compose exec ollama ollama pull qwen2:1.5b
```

### Error de conexión a MongoDB
```bash
# Verificar que MongoDB esté corriendo
docker-compose exec mongodb mongosh --eval "db.runCommand({ping: 1})"

# Verificar logs de MongoDB
docker-compose logs mongodb
```

### La aplicación no inicia
```bash
# Verificar logs de exp-core
docker-compose logs exp-core

# Reconstruir la imagen
docker-compose build exp-core
docker-compose up -d exp-core
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de [Troubleshooting](#-troubleshooting)
2. Verifica los logs: `docker-compose logs -f`
3. Abre un issue en el repositorio

---

**¡Listo para usar!** 🎉

Una vez que todos los servicios estén corriendo, tu aplicación estará disponible en `http://localhost:3000`