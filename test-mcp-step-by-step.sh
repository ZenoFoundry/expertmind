#!/bin/bash

# 🚀 Script para probar ExpertMind con MCP step by step

echo "🚀 PROBANDO INTEGRACIÓN MCP CON EXPERTMIND"
echo "=========================================="
echo ""

BASE_URL="http://localhost:3000"

echo "1. 🏥 Verificando salud del servidor..."
echo "Comando: curl $BASE_URL/ai/health"
curl -s $BASE_URL/ai/health | jq '.' || echo "❌ Error - ¿Está el servidor ejecutándose?"
echo ""

echo "2. 📋 Verificando modelos de Ollama disponibles..."
echo "Comando: curl $BASE_URL/ai/models"
curl -s $BASE_URL/ai/models | jq '.' || echo "❌ Error - ¿Está Ollama ejecutándose?"
echo ""

echo "3. 🛠️ Verificando herramientas MCP disponibles..."
echo "Comando: curl $BASE_URL/ai/enhanced/tools"
curl -s $BASE_URL/ai/enhanced/tools | jq '.'
echo ""

echo "4. 🤖 Probando generación simple (sin MCP)..."
echo "Comando: curl -X POST $BASE_URL/ai/enhanced/generate/simple"
curl -s -X POST $BASE_URL/ai/enhanced/generate/simple \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hola, ¿cómo estás?", "model": "tinyllama"}' | jq '.'
echo ""

echo "5. 🔗 Probando generación con MCP automático..."
echo "Comando: curl -X POST $BASE_URL/ai/enhanced/generate"
curl -s -X POST $BASE_URL/ai/enhanced/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "¿Qué repositorios tengo en GitLab?", "model": "tinyllama"}' | jq '.'
echo ""

echo "6. 💬 Probando chat con MCP..."
echo "Comando: curl -X POST $BASE_URL/ai/enhanced/chat"
curl -s -X POST $BASE_URL/ai/enhanced/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Muéstrame información de mis repositorios GitLab"}
    ],
    "model": "tinyllama"
  }' | jq '.'
echo ""

echo "7. 🛠️ Ejecutando herramienta GitLab específica..."
echo "Comando: curl -X POST $BASE_URL/ai/enhanced/tools/execute"
curl -s -X POST $BASE_URL/ai/enhanced/tools/execute \
  -H "Content-Type: application/json" \
  -d '{"toolName": "gitlab_list_repositories", "args": {}}' | jq '.'
echo ""

echo "8. 🔄 Comparando: Endpoint original vs nuevo..."
echo ""
echo "8a. Tu endpoint original:"
echo "Comando: curl -X POST $BASE_URL/ai/generate"
curl -s -X POST $BASE_URL/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "¿Qué repositorios tengo?", "model": "tinyllama"}' | jq '.'
echo ""

echo "8b. Nuevo endpoint con MCP:"
echo "Comando: curl -X POST $BASE_URL/ai/enhanced/generate"
curl -s -X POST $BASE_URL/ai/enhanced/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "¿Qué repositorios tengo en GitLab?", "model": "tinyllama"}' | jq '.'
echo ""

echo "✅ PRUEBAS COMPLETADAS!"
echo ""
echo "📝 Notas importantes:"
echo "- Si ves errores 500, revisa los logs del servidor: npm run start:dev"
echo "- Si no hay herramientas MCP, verifica tu token de GitLab en mcp-config.json" 
echo "- Si Ollama falla, asegúrate de que esté ejecutándose: docker compose up"
echo "- Para logs detallados, mira la consola donde ejecutaste npm run start:dev"
