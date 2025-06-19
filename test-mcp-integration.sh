#!/bin/bash

# Script para probar la integración MCP con ExpertMind

echo "🚀 Probando integración MCP con ExpertMind"
echo "=========================================="

BASE_URL="http://localhost:3000"

echo ""
echo "1. 🏥 Verificando salud del servidor..."
curl -s "$BASE_URL/ai/health" | jq '.'

echo ""
echo "2. 🛠️ Obteniendo herramientas MCP disponibles..."
curl -s "$BASE_URL/ai/enhanced/tools" | jq '.'

echo ""
echo "3. 🤖 Probando generación simple sin MCP..."
curl -s -X POST "$BASE_URL/ai/enhanced/generate/simple" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hola, ¿cómo estás?", "model": "tinyllama"}' | jq '.'

echo ""
echo "4. 🔗 Probando generación con MCP automático..."
curl -s -X POST "$BASE_URL/ai/enhanced/generate" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "¿Qué repositorios tengo en GitLab?", "model": "tinyllama"}' | jq '.'

echo ""
echo "5. 💬 Probando chat con MCP..."
curl -s -X POST "$BASE_URL/ai/enhanced/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Muéstrame información de mis repositorios GitLab"}
    ],
    "model": "tinyllama"
  }' | jq '.'

echo ""
echo "6. 🛠️ Ejecutando herramienta GitLab específica..."
curl -s -X POST "$BASE_URL/ai/enhanced/tools/execute" \
  -H "Content-Type: application/json" \
  -d '{"toolName": "gitlab_list_repositories", "args": {}}' | jq '.'

echo ""
echo "✅ Pruebas completadas!"
echo ""
echo "📝 Notas:"
echo "- Asegúrate de que Ollama esté ejecutándose"
echo "- Verifica que tu token de GitLab esté configurado"
echo "- Si las herramientas MCP no aparecen, revisa los logs del servidor"
