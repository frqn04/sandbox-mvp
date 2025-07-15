# Configuración del Formulario de Contacto

## 🎯 Configuración Actual

El formulario está configurado para enviar emails a: **francisgcastellano1@gmail.com**

## 📧 Funcionamiento

### En Desarrollo (localhost)
- El formulario simula el envío exitoso
- Los datos se muestran en la consola del navegador
- Puedes ver todos los datos enviados para debugging

### En Producción (Netlify)
- El formulario usa **Netlify Forms**
- Los emails se envían automáticamente a tu email
- Redirección a página de agradecimiento

## 🚀 Para Probar

### 1. Modo Desarrollo
```bash
npm run dev
```
- Ve a `http://localhost:4321/contact`
- Llena el formulario
- Abre las herramientas de desarrollador (F12)
- Ve a la pestaña "Console"
- Envía el formulario y verás los datos

### 2. Modo Producción
- Deploy en Netlify
- Netlify detectará automáticamente el formulario
- Los emails llegarán a tu bandeja de entrada

## 📋 Datos que se Envían

```javascript
{
  nombre: "Nombre del usuario",
  apellido: "Apellido del usuario", 
  email: "email@usuario.com",
  motivo: "press|partner-sponsor|player|work|other",
  mensaje: "Mensaje del usuario",
  terminos: "on",
  timestamp: "2025-01-14T10:30:00.000Z"
}
```

## 🔧 Configuración Netlify

El archivo `netlify.toml` ya está configurado para:
- Detectar el formulario automáticamente
- Enviar notificaciones a tu email
- Redirigir a la página de agradecimiento

## 📱 Funcionalidades

✅ **Validación en tiempo real**
✅ **Contador de caracteres**
✅ **Loading states**
✅ **Mensajes de éxito/error**
✅ **Accesibilidad completa**
✅ **Responsive design**
✅ **Protección reCAPTCHA**

## 🛠️ Troubleshooting

### Si no llegan los emails:
1. Verifica que el deploy esté en Netlify
2. Ve a Netlify Dashboard > Site Settings > Forms
3. Verifica que el formulario aparezca listado
4. Revisa la carpeta de spam

### Para cambiar el email destino:
1. Edita `netlify.toml` línea 8
2. Cambia `to = "francisgcastellano1@gmail.com"`
3. Redeploy el sitio

## 📧 Estructura del Email

Los emails llegarán con este formato:

```
Asunto: Nuevo contacto desde Pucará Gaming

Nuevo mensaje desde el formulario de contacto de Pucará Gaming:

Nombre: Juan
Apellido: Pérez
Email: juan@ejemplo.com
Motivo: Quiero ser Partner/Sponsor

Mensaje:
Hola, me interesa ser sponsor de Pucará Gaming...

Términos aceptados: on

Fecha: 2025-01-14T10:30:00.000Z
```

¡Listo para probar! 🎮
