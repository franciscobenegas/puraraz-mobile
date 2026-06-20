# 📱 Puraraz Mobile - Proyecto React Native + Expo Creado

## ✅ Proyecto Completado

Tu aplicación móvil React Native + Expo ha sido creada exitosamente en:
```
c:\Proyectos\puraraz-mobile
```

## 📦 Lo que fue creado

### 1. **Estructura de Carpetas Completa**
```
puraraz-mobile/
├── src/
│   ├── app/              ← Navegación con Expo Router
│   ├── components/       ← Componentes reutilizables
│   ├── services/         ← Llamadas a API
│   ├── stores/          ← Estado global (Zustand)
│   ├── types/           ← Tipos TypeScript
│   └── utils/           ← Funciones auxiliares
├── assets/              ← Imágenes (placeholder)
├── .github/             ← Configuración del workspace
└── package.json         ← Dependencias
```

### 2. **Servicios de API**
- ✅ Cliente HTTP con Axios (interceptores automáticos)
- ✅ Autenticación JWT (AsyncStorage)
- ✅ Llamadas a mortandada, categorías, potreros, propietarios
- ✅ Manejo de multipart/form-data para fotos

### 3. **Estado Global (Zustand)**
- ✅ `authStore.ts` - Gestiona usuario, login, logout
- ✅ `mortandadStore.ts` - CRUD de mortandadas, datos de referencia

### 4. **Componentes UI**
- ✅ `Button.tsx` - Botones con variants (primary, secondary, danger)
- ✅ `Input.tsx` - Inputs con validación y errores
- ✅ `Select.tsx` - Selects dinámicos
- ✅ `Card.tsx` - Tarjetas reutilizables

### 5. **Pantallas Implementadas**
- ✅ **Login** - Autenticación con formulario validado
- ✅ **Dashboard** - Resumen de mortandadas y stats
- ✅ **Mortandadas (Listado)** - CRUD completo
- ✅ **Crear Mortandada** - Formulario con:
  - GPS automático con `expo-location`
  - Cámara y galería con `expo-image-picker`
  - Selects dinámicos para categorías, potreros, etc.
  - Validación de formulario

### 6. **Documentación**
- ✅ `README.md` - Guía general del proyecto
- ✅ `QUICKSTART.md` - Guía rápida para empezar
- ✅ `API_INTEGRATION.md` - Documentación detallada de APIs
- ✅ `.env.example` - Variables de entorno

### 7. **Configuración TypeScript**
- ✅ `tsconfig.json` - Configurado para Expo
- ✅ Path aliases (`@/*`, `@components/*`, etc.)
- ✅ Strict mode activado

## 🚀 Próximos Pasos

### 1. Abre la carpeta en VS Code
```bash
cd c:\Proyectos\puraraz-mobile
code .
```

### 2. Instala dependencias
```bash
npm install
```

### 3. Configura el backend
Crea un archivo `.env` basado en `.env.example`:
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

**IMPORTANTE**: Si usas dispositivo físico o IP diferente a localhost:
```
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000/api
```

### 4. Inicia la app
```bash
npm start
```

### 5. Prueba en tu plataforma
- `a` = Android (emulador)
- `i` = iOS (solo Mac)
- `w` = Web
- Escanea QR con Expo Go app en dispositivo físico

## 🎯 Características Principales

### 🔐 Autenticación
- Login/Logout
- Tokens JWT guardados localmente
- Interceptores automáticos

### 📍 GPS
- Captura automática de ubicación
- Formato: lat,lon
- Manejo de permisos incluido

### 📸 Cámara y Galería
- Captura fotos con cámara
- Selecciona desde galería
- Soporta hasta 3 fotos por mortandada

### 📊 Dashboard
- Resumen de mortandadas
- Stats por rol
- Últimas mortandadas

### ✅ Validación
- Validación de formularios
- Mensajes de error claros
- Loading states

## 🔗 Integración con Backend Existente

La app se conecta automáticamente a tu backend Next.js:

```
Puraraz Mobile ←→ API Next.js ←→ PostgreSQL
                                      ↓
                          Datos compartidos
                            (ambas plataformas)
```

**Endpoints soportados:**
- POST `/auth/login`
- POST `/mortandad` (con fotos)
- GET `/mortandad`
- DELETE `/mortandad/:id`
- GET `/categoria`, `/causamortandad`, `/potrero`, `/propietario`

## 📚 Documentación Incluida

1. **README.md** - Descripción general
2. **QUICKSTART.md** - Guía rápida (LEER PRIMERO)
3. **API_INTEGRATION.md** - Cómo funciona la integración con backend
4. **.github/copilot-instructions.md** - Instrucciones del proyecto

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Verificar tipos TypeScript
npm run type-check

# Ejecutar linter
npm run lint

# Limpiar caché de Expo
npm start -- --clear
```

## 🐛 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| No se conecta a API | Verifica URL en `.env` e IP correcta |
| Error de autenticación | Comprueba credenciales en BD Next.js |
| Permisos de cámara | La app pide permisos automáticamente |
| Caché corrupto | Ejecuta `npm start -- --clear` |

## ✨ Stack Final

- **React Native 0.73** - Framework móvil
- **Expo 51** - Plataforma
- **TypeScript** - Type safety
- **Zustand** - State management
- **Axios** - HTTP client
- **AsyncStorage** - Almacenamiento local
- **expo-location** - GPS
- **expo-image-picker** - Cámara y galería
- **Expo Router** - Navegación

## 📞 Próximas Funcionalidades

Puedes agregar fácilmente:
- Offline sync con SQLite
- Notificaciones push
- Dark mode completo
- Filtros y búsqueda avanzada
- Reportes/exportación
- Sincronización automática

## 🎓 Recursos

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com/)

---

## 🎉 ¡Listo para empezar!

```bash
cd c:\Proyectos\puraraz-mobile
npm install
npm start
```

**¿Necesitas ayuda?** Revisa `QUICKSTART.md` o `API_INTEGRATION.md`
