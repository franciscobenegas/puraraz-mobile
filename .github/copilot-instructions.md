# Puraraz Mobile - React Native + Expo

Aplicación móvil para gestión de ganadería desarrollada con React Native + Expo que se conecta con el backend Next.js existente en `c:\Proyectos\purarazapp`.

## ✅ Setup Completado

- [x] Inicializar proyecto Expo con TypeScript
- [x] Instalar dependencias principales
- [x] Configurar estructura de carpetas
- [x] Crear servicios HTTP con Axios
- [x] Configurar autenticación (AsyncStorage + JWT)
- [x] Crear stores Zustand
- [x] Crear pantallas base (Login, Dashboard, Mortandad)
- [x] Crear componentes reutilizables
- [ ] Instalar dependencias con npm install
- [ ] Compilar y verificar errores
- [ ] Crear task para ejecutar en dev mode

## Stack Tecnológico

- **Framework**: React Native 0.73 + Expo 51
- **Lenguaje**: TypeScript
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Storage Local**: AsyncStorage (tokens JWT)
- **Ubicación**: expo-location (GPS)
- **Imágenes**: expo-image-picker (cámara/galería)
- **Navegación**: Expo Router

## Estructura del Proyecto

```
src/
├── app/                    # Navegación (Expo Router)
│   ├── (auth)/            # Pantallas de autenticación
│   │   └── login.tsx
│   └── (app)/             # Pantallas autenticadas
│       ├── index.tsx      # Dashboard
│       └── mortandad/
│           ├── index.tsx  # Listado
│           └── crear.tsx  # Crear nueva
├── components/            # Componentes reutilizables
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   └── Card.tsx
├── services/              # Llamadas a API
│   ├── api.ts            # Cliente HTTP
│   ├── auth.ts           # Autenticación
│   └── mortandad.ts      # Operaciones de mortandad
├── stores/               # Estado global (Zustand)
│   ├── authStore.ts      # Estado de usuario
│   └── mortandadStore.ts # Estado de mortandades
├── types/                # Tipos TypeScript
├── utils/                # Funciones auxiliares
│   ├── theme.ts         # Colores, espaciado, tipografía
│   └── storage.ts       # Utilidades AsyncStorage
```

## Próximos Pasos

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar URL del backend** en `.env`:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm start
   ```

4. **En el emulador/dispositivo**:
   - Android: Press `a`
   - iOS: Press `i`
   - Web: Press `w`

## Endpoints Implementados

✅ **Autenticación**
- `POST /auth/login` - Login
- `POST /auth/refresh` - Renovar token

✅ **Mortandades**
- `POST /mortandad` - Crear (con fotos)
- `GET /mortandad` - Listar
- `GET /mortandad/:id` - Obtener
- `PUT /mortandad/:id` - Actualizar
- `DELETE /mortandad/:id` - Eliminar

✅ **Datos de Referencia**
- `GET /categoria` - Categorías
- `GET /causamortandad` - Causas
- `GET /potrero` - Potreros
- `GET /propietario` - Propietarios

## Características Principales

### 🔐 Autenticación
- Login con JWT
- Tokens almacenados en AsyncStorage
- Interceptores automáticos
- Logout con confirmación

### 📍 Geolocalización
- Captura automática de GPS
- Coordenadas en formato lat,lon
- Permisos manejados por Expo

### 📸 Cámara y Galería
- Captura de hasta 3 fotos
- Selección desde galería
- Subida a Cloudinary automática
- Compresión de imágenes (70% quality)

### 📊 Dashboard
- Resumen de mortandades
- Últimas mortandades registradas
- Rol del usuario

### 📝 Formularios
- Validación en tiempo real
- Selects dinámicos
- Manejo de errores
- Loading states

## Variables de Entorno

```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

Ver [.env.example](.env.example) para más detalles.

## Documentación

- [README.md](README.md) - Instrucciones generales
- [Expo Docs](https://docs.expo.dev/) - Documentación oficial
- [React Native Docs](https://reactnative.dev/) - Guía de React Native
