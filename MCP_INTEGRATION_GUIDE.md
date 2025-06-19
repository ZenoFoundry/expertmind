# 🚀 Integración MCP con ExpertMind

## 📋 Resumen de lo implementado

### 1. **Configuración MCP**
- ✅ SDK de MCP ya instalado (`@modelcontextprotocol/sdk`)
- ✅ Configuración de servidor GitLab en `mcp-config.json`

### 2. **Nuevos servicios creados**
- 🔧 `MCPService`: Gestiona conexiones y herramientas MCP
- 🤖 `EnhancedOllamaService`: Ollama + MCP integrado
- 🎯 `EnhancedOllamaController`: Endpoints con capacidades MCP

## 🔗 Nuevos Endpoints Disponibles

### **Generación con MCP Automático**
```bash
POST /ai/enhanced/generate
{
  "prompt": "¿Qué repositorios tengo en GitLab?",
  "model": "tinyllama",
  "autoExecuteTools": true
}
```

### **Chat con MCP**
```bash
POST /ai/enhanced/chat
{
  "messages": [
    {"role": "user", "content": "Muéstrame mis issues de GitLab"}
  ],
  "autoExecuteTools": true
}
```

### **Ejecutar herramienta específica**
```bash
POST /ai/enhanced/tools/execute
{
  "toolName": "gitlab_list_repositories",
  "args": {}
}
```

### **Listar herramientas disponibles**
```bash
GET /ai/enhanced/tools
```

## 🔄 Cómo responde a tus preguntas

### **Pregunta 1: ¿Cómo instalar MCP?**
✅ **Ya está instalado y configurado**:
- SDK: `@modelcontextprotocol/sdk: ^1.12.3`
- Configuración GitLab en `mcp-config.json`
- Solo actualicé la URL de GitLab a la estándar

### **Pregunta 2: ¿Configurar /api/generate para MCP?**
✅ **Creé nuevos endpoints que extienden tu funcionalidad**:

1. **Tu endpoint original** (`/ai/generate`): Sigue funcionando igual
2. **Nuevo endpoint mejorado** (`/ai/enhanced/generate`): Incluye MCP automático

## 🛠️ Cómo funciona la integración

### **Flujo automático:**
1. Usuario envía prompt
2. `MCPService` analiza si necesita herramientas GitLab
3. Si detecta palabras clave (gitlab, repository, issue), ejecuta herramientas automáticamente
4. Enriquece el prompt con la información obtenida
5. Envía el prompt mejorado a Ollama
6. Retorna respuesta + datos de herramientas usadas

### **Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": {
    "response": "Basado en tu información de GitLab, tienes 3 repositorios...",
    "toolsUsed": ["gitlab_list_repositories"],
    "toolResults": [{"tool": "gitlab_list_repositories", "result": {...}}],
    "model": "tinyllama",
    "timestamp": "2025-06-18T..."
  }
}
```

## 🚀 Para usar inmediatamente:

1. **Instalar dependencias MCP** (si no están):
```bash
npm install @modelcontextprotocol/server-gitlab
```

2. **Configurar tu token GitLab** en `mcp-config.json`:
```json
{
  "mcpServers": {
    "gitlab": {
      "env": {
        "GITLAB_PERSONAL_ACCESS_TOKEN": "TU_TOKEN_AQUI"
      }
    }
  }
}
```

3. **Iniciar el servidor**:
```bash
npm run start:dev
```

4. **Probar la integración**:
```bash
curl -X POST http://localhost:3000/ai/enhanced/generate \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "¿Qué repositorios tengo en GitLab?"}'
```

## 🔧 Personalización

### **Agregar más herramientas MCP:**
1. Actualizar `mcp-config.json` con nuevo servidor
2. El `MCPService` automáticamente detectará y cargará las nuevas herramientas

### **Modificar detección automática:**
Editar el método `analyzePromptForTools()` en `MCPService` para detectar nuevos patrones.

### **Compatibilidad:**
- ✅ Tu código existente sigue funcionando
- ✅ Nuevos endpoints añaden funcionalidad MCP
- ✅ Puedes migrar gradualmente o usar ambos
