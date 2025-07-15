# Formulario de Contacto - Migración a Vercel

## 🚀 Configuración realizada

### Archivos modificados/creados:

1. **`/api/contact.js`** - Nueva API route para Vercel
2. **`src/components/ContactForm.astro`** - Actualizado para usar la API de Vercel
3. **`vercel.json`** - Configuración de funciones serverless
4. **`env.example`** - Variables de entorno necesarias

### Funcionalidades implementadas:

- ✅ **API Serverless**: Función que maneja el formulario en Vercel
- ✅ **Validación completa**: Servidor y cliente
- ✅ **Envío de emails**: Configuración SMTP opcional
- ✅ **reCAPTCHA**: Validación en producción
- ✅ **Modo desarrollo**: Simulación local sin envío real
- ✅ **Logs estructurados**: Para debugging
- ✅ **Manejo de errores**: Respuestas detalladas

## 🔧 Configuración en Vercel

### Paso 1: Variables de entorno en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables y agrega:

```env
# Para envío de emails (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password-de-gmail

# Para reCAPTCHA (opcional)
RECAPTCHA_SECRET_KEY=tu-recaptcha-secret-key

# Entorno
NODE_ENV=production
```

### Paso 2: Configurar Gmail (si usas Gmail)

1. Ve a tu cuenta de Google → Seguridad
2. Activa "Verificación en 2 pasos"
3. Genera una "Contraseña de aplicación"
4. Usa esa contraseña en `SMTP_PASS`

### Paso 3: Configurar reCAPTCHA (opcional)

1. Ve a [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Crea un sitio con reCAPTCHA v2
3. Agrega tu dominio de Vercel
4. Copia la clave secreta a `RECAPTCHA_SECRET_KEY`

## 📧 Funcionamiento

### En desarrollo:
- Los datos se muestran en la consola
- No se envían emails reales
- Simula delay de red

### En producción:
- Envía emails a `francisgcastellano1@gmail.com`
- Valida reCAPTCHA si está configurado
- Logs completos en Vercel Functions

## 🎯 Estructura del email

El email incluye:
- **Header**: Logo de Pucará Gaming
- **Datos del contacto**: Nombre, email, motivo, fecha
- **Mensaje**: Contenido formateado
- **Footer**: Información del formulario

## 🔍 Debugging

### Logs en Vercel:
1. Ve a tu proyecto → Functions
2. Selecciona `/api/contact`
3. Revisa los logs en tiempo real

### Logs en desarrollo:
```bash
npm run dev
# Los datos aparecen en la consola del navegador
```

## 🚨 Troubleshooting

### Error: "Method not allowed"
- Verifica que la API esté en `/api/contact.js`
- Verifica que el método sea POST

### Error: "Campos requeridos"
- Verifica que todos los campos estén completos
- Revisa la validación del formulario

### Error: "Email inválido"
- Verifica el formato del email
- Revisa la regex de validación

### Error: "reCAPTCHA fallida"
- Verifica la configuración de reCAPTCHA
- Revisa la clave secreta en variables de entorno

## 📝 Próximos pasos

1. **Deploy a Vercel**: `vercel --prod`
2. **Configurar variables de entorno** en el dashboard
3. **Probar el formulario** en producción
4. **Configurar dominio personalizado** (opcional)

## 💡 Ventajas vs Netlify

- ✅ **Más control**: API customizable
- ✅ **Mejor debugging**: Logs detallados
- ✅ **Integración GitHub**: Deploys automáticos
- ✅ **Escalabilidad**: Funciones serverless optimizadas
- ✅ **Flexibilidad**: Fácil agregar nuevas funcionalidades

¡Tu formulario está listo para funcionar en Vercel! 🎮⚡
