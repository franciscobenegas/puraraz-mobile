# Puraraz Mobile - React Native + Expo

Aplicación móvil para gestión de ganadería desarrollada con React Native y Expo, que se conecta con el backend existente de Next.js.

## 📋 Características

- ✅ Autenticación con JWT
- 📸 Captura de fotos con cámara
- 📍 Integración con GPS
- 📊 Registro de mortandades
- 🔄 Sincronización con backend
- 🌙 Soporte tema oscuro/claro
- 📱 Totalmente offline-first ready

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Instalar Expo CLI globalmente (opcional)
npm install -g expo-cli
```

## 🏃 Ejecutar

```bash
# Iniciar desarrollo
npm start

# Para Android
npm run android

# Para iOS
npm run ios

# Para Web
npm run web
```

## 📁 Estructura del Proyecto

```
src/
├── app/                 # Navegación principal (Expo Router)
├── components/          # Componentes reutilizables
├── screens/             # Pantallas de la app
├── services/            # Servicios API HTTP
├── stores/              # Estado global (Zustand)
├── types/               # Tipos TypeScript
└── utils/               # Funciones auxiliares
```

## 🔗 Backend API

- Base URL: `http://localhost:3000/api` (desarrollo)
- Ver `src/services/api.ts` para configuración

## 📦 Dependencias Principales

- **react-native**: Framework móvil
- **expo**: Plataforma de desarrollo
- **expo-router**: Navegación
- **zustand**: State management
- **axios**: Cliente HTTP
- **@react-native-async-storage**: Almacenamiento local
- **expo-image-picker**: Selección de imágenes
- **expo-location**: GPS
- **typescript**: Type safety

## 🔐 Configuración de Autenticación

Los tokens JWT se almacenan en `AsyncStorage`. Ver `src/services/auth.ts` para detalles.

## 📲 Endpoints Soportados

- `POST /auth/login` - Login
- `POST /mortandad` - Crear mortandad
- `GET /mortandad` - Listar mortandades
- `GET /categoria` - Obtener categorías
- `GET /potrero` - Obtener potreros
- `GET /causamortandad` - Obtener causas

## 🛠️ Desarrollo

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## 📝 Notas

- Requiere Node.js 18+
- Compatible con Android 5+ e iOS 13+
- Documentación de Expo: https://docs.expo.dev/
