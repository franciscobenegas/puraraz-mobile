# Integración de APIs - Puraraz Mobile

Esta guía explica cómo funciona la integración entre la app móvil y el backend Next.js existente.

## 🔐 Autenticación

### Flujo de Login

```
📱 App Mobile
  ├─ Usuario ingresa credenciales
  ├─ POST /auth/login
  │  └─ Body: { username, password }
  └─ Backend valida en BD
     ├─ ✅ Correcto → Retorna { token, usuario }
     └─ ❌ Error → Retorna error 401

💾 Storage Local
  ├─ Token guardado en AsyncStorage
  └─ Usuario guardado en AsyncStorage
```

### Headers Automáticos

Todos los requests después de login incluyen:
```
Authorization: Bearer {token}
```

Esto se maneja automáticamente en `src/services/api.ts` mediante interceptores de Axios.

## 📋 API Endpoints

### Autenticación

```typescript
// Login
POST /auth/login
Request: { username: string, password: string }
Response: { token: string, usuario: Usuario }

// Logout (opcional - solo limpia localStorage)
POST /auth/logout
```

### Mortandades

```typescript
// Crear mortandad (con fotos)
POST /mortandad
Content-Type: multipart/form-data
Request: {
  fecha: string              // YYYY-MM-DD
  propietarioId: string      // UUID
  numeroAnimal: string       // Caravana
  categoriaId: string        // UUID
  causaId: string            // UUID
  potreroId: string          // UUID
  ubicacionGps: string       // lat,lon
  foto1?: File               // JPEG
  foto2?: File               // JPEG
  foto3?: File               // JPEG
}
Response: Mortandad

// Listar mortandades
GET /mortandad
Response: Mortandad[]

// Obtener mortandad específica
GET /mortandad/:id
Response: Mortandad

// Actualizar mortandad
PUT /mortandad/:id
Content-Type: multipart/form-data
Request: { ...mismos campos que POST }
Response: Mortandad

// Eliminar mortandad
DELETE /mortandad/:id
Response: {}
```

### Datos de Referencia

```typescript
// Categorías
GET /categoria
Response: Categoria[]

// Causas de mortandad
GET /causamortandad
Response: CausaMortandad[]

// Potreros
GET /potrero
Response: Potrero[]

// Propietarios
GET /propietario
Response: Propietario[]
```

## 🔌 Uso desde la App

### Ejemplo 1: Login

```typescript
import { authService } from '@services/auth';

const handleLogin = async () => {
  try {
    const response = await authService.login({
      username: 'mi_usuario',
      password: 'mi_password'
    });
    
    console.log('Token:', response.token);
    console.log('Usuario:', response.usuario);
  } catch (error) {
    console.error('Error de login:', error.message);
  }
};
```

### Ejemplo 2: Crear Mortandad

```typescript
import { mortandadService } from '@services/mortandad';

const handleCreateMortandad = async () => {
  const formData = new FormData();
  
  // Datos
  formData.append('fecha', '2026-05-25');
  formData.append('propietarioId', 'uuid-propietario');
  formData.append('numeroAnimal', '12345');
  formData.append('categoriaId', 'uuid-categoria');
  formData.append('causaId', 'uuid-causa');
  formData.append('potreroId', 'uuid-potrero');
  formData.append('ubicacionGps', '-25.2637,-57.5759');
  
  // Fotos (opcional)
  formData.append('foto1', {
    uri: 'file:///path/to/image.jpg',
    type: 'image/jpeg',
    name: 'foto1.jpg'
  });
  
  try {
    const mortandad = await mortandadService.crear(formData);
    console.log('Mortandad creada:', mortandad.id);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Ejemplo 3: Listar Mortandades

```typescript
import { useMortandadStore } from '@stores/mortandadStore';

export const MiPantalla = () => {
  const { mortandades, cargarMortandades, isLoading } = useMortandadStore();
  
  useEffect(() => {
    cargarMortandades();
  }, []);
  
  return (
    <View>
      {isLoading && <Text>Cargando...</Text>}
      {mortandades.map(m => (
        <Text key={m.id}>{m.numeroAnimal}</Text>
      ))}
    </View>
  );
};
```

## 🔄 Flujo de Sincronización

### Crear Mortandada con Fotos

```
1. Capturar datos
   ↓
2. Validar formulario
   ↓
3. Crear FormData
   ├─ Datos básicos
   ├─ Archivo foto1 (si existe)
   ├─ Archivo foto2 (si existe)
   └─ Archivo foto3 (si existe)
   ↓
4. POST /mortandad (multipart/form-data)
   ↓
5. Backend (Next.js)
   ├─ Valida datos
   ├─ Sube fotos a Cloudinary
   │  └─ Obtiene URLs
   ├─ Guarda en PostgreSQL
   │  ├─ tabla: mortandad
   │  ├─ foto1_url, foto2_url, foto3_url
   │  └─ Timestamps
   └─ Retorna Mortandad completa
   ↓
6. App móvil actualiza store
   ├─ Añade a lista de mortandades
   └─ Muestra confirmación
```

## 🚨 Manejo de Errores

### Estados HTTP

```
200 OK          → Operación exitosa
201 Created     → Recurso creado
400 Bad Request → Datos inválidos
401 Unauthorized → Token expirado/inválido
403 Forbidden    → Sin permisos
404 Not Found    → Recurso no existe
500 Server Error → Error en servidor
```

### Ejemplo con Manejo de Errores

```typescript
try {
  const result = await mortandadService.crear(formData);
} catch (error) {
  if (axios.isAxiosError(error)) {
    switch (error.response?.status) {
      case 400:
        console.error('Datos inválidos:', error.response.data);
        break;
      case 401:
        console.error('Token expirado - requiere nuevo login');
        // Redirigir a login
        break;
      case 500:
        console.error('Error servidor');
        break;
    }
  }
}
```

## 📤 Subida de Fotos

### Flujo Cloudinary

```
📱 App (expo-image-picker)
  └─ Uri de imagen local
     ↓
📄 FormData
  └─ Convert a multipart
     ↓
🌐 POST /mortandad (con foto)
  └─ Backend recibe multipart
     ↓
☁️ Backend → Cloudinary
  ├─ Sube imagen
  └─ Obtiene URL segura (https)
     ↓
💾 PostgreSQL
  ├─ Guarda URL en foto1, foto2, foto3
  └─ Crea registro en tabla mortandad
     ↓
📱 App
  └─ Recibe respuesta con URLs
```

## 🔑 Tipos TypeScript

### Usuario

```typescript
interface Usuario {
  id: string;
  email: string;
  username: string;
  establecimiento: string;
  rol: 'PEON' | 'ADMIN';
  activo: boolean;
}
```

### Mortandad

```typescript
interface Mortandad {
  id: string;
  fecha: string;
  propietarioId: string;
  numeroAnimal: string;
  categoriaId: string;
  causaId: string;
  potreroId: string;
  ubicacionGps: string;
  foto1?: string;        // URL
  foto2?: string;        // URL
  foto3?: string;        // URL
  usuario: string;
  establesimiento: string;
  createdAt: string;
  updatedAt: string;
}
```

## ⚙️ Configuración

### URL de API

Configurar en `.env`:
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

Para dispositivos en red:
```
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

Para producción:
```
EXPO_PUBLIC_API_URL=https://tu-dominio.com/api
```

### Timeout

Default: 30 segundos (configurable en `src/services/api.ts`)

## 📊 Base de Datos Compartida

Ambas aplicaciones (Web + Mobile) usan la **misma base de datos PostgreSQL**:

```
Next.js Backend ←→ PostgreSQL
    ↑                  ↑
    └─ Expone API     └─ Datos compartidos
    ↓                  ↓
React Mobile ←─────────┘

Resultado: Datos sincronizados en tiempo real entre ambas plataformas
```

## 🔄 Mantener Sincronización

Para mantener datos sincronizados:

```typescript
// Al volver a la pantalla de mortandades
useEffect(() => {
  const unsubscribe = useFocusEffect(
    useCallback(() => {
      cargarMortandades(); // Recarga datos
    }, [])
  );
  
  return unsubscribe;
}, []);
```

---

**Más información en**:
- [Documentación Axios](https://axios-http.com/)
- [React Native Fetch API](https://reactnative.dev/docs/network)
- [Expo HTTP Module](https://docs.expo.dev/versions/latest/sdk/fetching-data/)
