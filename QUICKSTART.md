# 🚀 Guía Rápida - Puraraz Mobile

## 1️⃣ Primeros pasos

### Instalar dependencias
```bash
npm install
```

### Crear archivo .env
```bash
# Copiar ejemplo
cp .env.example .env

# Editar .env y configurar tu URL de backend
# EXPO_PUBLIC_API_URL=http://TU_IP:3000/api
```

**IMPORTANTE**: Si ejecutas desde un dispositivo físico o emulador que no sea `localhost`, cambia la URL a tu IP local (ej: `http://192.168.1.100:3000/api`)

## 2️⃣ Ejecutar la app

```bash
# Iniciar servidor Expo
npm start

# En la terminal que aparece, presiona:
# 'a' para Android (requiere emulador o Expo Go app)
# 'i' para iOS (solo Mac)
# 'w' para Web
```

## 3️⃣ Credenciales de prueba

Usa las credenciales de tu proyecto Next.js (base de datos compartida):

```
Usuario: [tu_username]
Contraseña: [tu_password]
```

## 📱 Instalación en dispositivo

### Opción A: Emulador (Recomendado para desarrollo)

**Android**:
1. Instala [Android Studio](https://developer.android.com/studio)
2. Crea un emulador desde AVD Manager
3. Ejecuta `npm start` y presiona `a`

**iOS**:
1. Requiere Mac con Xcode
2. Ejecuta `npm start` y presiona `i`

### Opción B: Dispositivo físico

1. Descarga app "Expo Go" desde Play Store / App Store
2. Ejecuta `npm start`
3. Escanea código QR con tu teléfono

## 🔗 Conexión con Backend

La app se conecta automáticamente a tu backend Next.js:

```
Login → AsyncStorage (token JWT) → Axios interceptor → API Next.js
```

### Flujo de Mortandada Completo:

1. **Captura datos** en formulario
2. **Obtiene GPS** con `expo-location`
3. **Captura fotos** con `expo-image-picker`
4. **Crea FormData** con todo
5. **POST /mortandad** → Backend sube a Cloudinary
6. **Guarda en BD** PostgreSQL
7. **Muestra en listado** con datos actualizados

## 🛠️ Desarrollo

### Scripts disponibles

```bash
npm start      # Inicia Expo
npm run type-check  # Verifica tipos TypeScript
npm run lint   # Ejecuta eslint
```

### Estructura de carpetas

```
src/
├── app/        → Pantallas (Expo Router)
├── components/ → Componentes reutilizables
├── services/   → Llamadas API
├── stores/     → Estado global (Zustand)
├── types/      → Tipos TypeScript
└── utils/      → Funciones auxiliares
```

### Agregar nueva pantalla

```bash
# Crear archivo en src/app/(app)/nueva-pantalla.tsx
```

### Agregar nuevo componente

```bash
# Crear archivo en src/components/MiComponente.tsx
```

## 🐛 Troubleshooting

### "No se puede conectar a API"
- ✅ Verifica que Next.js está corriendo (`npm run dev`)
- ✅ Comprueba la URL en `.env`
- ✅ Si usas dispositivo físico, usa IP local no localhost

### "Error de autenticación"
- ✅ Comprueba credenciales en BD
- ✅ Verifica que usuario está activo (`activo = true`)
- ✅ Limpia AsyncStorage: reinicia la app

### "Permisos de cámara/ubicación"
- ✅ La app pide permisos automáticamente
- ✅ Si rechazas, ve a Configuración del teléfono
- ✅ En emulador, algunos permisos no funcionan

## 📚 Documentación

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Zustand Examples](https://github.com/pmndrs/zustand)
- [Axios Guide](https://axios-http.com/)

## 💡 Tips

1. **Hot Reload**: Salva un archivo y la app se recarga automáticamente
2. **Developer Menu**: Agita tu teléfono (o `Ctrl+M` en Android emulator)
3. **Console Logs**: Visibles en la terminal donde ejecutas `npm start`
4. **React DevTools**: Disponible desde Developer Menu

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola de Expo (terminal)
2. Verifica que tu backend esté corriendo
3. Comprueba archivos de configuración (`.env`, `app.json`)
4. Documenta el error exacto antes de debugging

---

**¡Listo para empezar!** 🎉

```bash
npm install && npm start
```
