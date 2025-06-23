// Cambiar a la base de datos chatdb
db = db.getSiblingDB('expdb');

// Crear usuario específico para la aplicación
db.createUser({
  user: 'chatapp',
  pwd: 'chatapp123',
  roles: [
    {
      role: 'readWrite',
      db: 'chatdb'
    }
  ]
});

// Crear colección chats con validación
db.createCollection('chats', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'title', 'status', 'messages'],
      properties: {
        userId: {
          bsonType: 'string',
          description: 'ID del usuario - requerido'
        },
        title: {
          bsonType: 'string',
          maxLength: 100,
          description: 'Título de la conversación - requerido'
        },
        status: {
          enum: ['active', 'archived', 'deleted'],
          description: 'Estado de la conversación'
        },
        messageCount: {
          bsonType: 'int',
          minimum: 0,
          description: 'Número de mensajes'
        },
        messages: {
          bsonType: 'array',
          maxItems: 1000,
          items: {
            bsonType: 'object',
            required: ['id', 'role', 'content', 'timestamp'],
            properties: {
              id: { bsonType: 'string' },
              role: { enum: ['user', 'assistant'] },
              content: {
                bsonType: 'object',
                required: ['type'],
                properties: {
                  type: {
                    enum: ['text']
                  }
                }
              },
              timestamp: { bsonType: 'date' }
            }
          }
        }
      }
    }
  }
});

// Crear índices optimizados
db.chats.createIndex({ "userId": 1, "updatedAt": -1 });
db.chats.createIndex({ "userId": 1, "status": 1, "updatedAt": -1 });
db.chats.createIndex({ 
  "title": "text", 
  "messages.content.data": "text" 
}, {
  name: "search_index"
});

// Insertar datos de ejemplo (opcional)
db.chats.insertOne({
  userId: "user_demo",
  title: "Conversación de ejemplo",
  status: "active",
  messageCount: 2,
  messages: [
    {
      id: "msg_001",
      role: "user",
      content: {
        type: "text",
        data: "Hola, ¿cómo estás?"
      },
      timestamp: new Date()
    },
    {
      id: "msg_002", 
      role: "assistant",
      content: {
        type: "text",
        data: "¡Hola! Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte?"
      },
      timestamp: new Date()
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  lastMessageAt: new Date()
});

print('Base de datos inicializada correctamente');
print('Usuario chatapp creado');
print('Colección chats creada con validación');
print('Índices creados');
print('Datos de ejemplo insertados');