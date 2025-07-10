# Configuración de Google reCAPTCHA v2

## Resumen
Se ha implementado Google reCAPTCHA v2 en el formulario de contacto para prevenir spam y ataques automatizados. Esta solución es **gratuita hasta 1,000,000 de usos por mes**, más que suficiente para la mayoría de sitios web.

## Pasos para configurar reCAPTCHA v2

### 1. Obtener Site Key y Secret Key

1. Ve a [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Haz clic en "+" para crear un nuevo sitio
3. Configura los siguientes campos:
   - **Label**: Pucará Gaming Contact Form
   - **reCAPTCHA type**: reCAPTCHA v2 → "I'm not a robot" Checkbox
   - **Domains**: 
     - `pucaradigital.com` (producción)
     - `localhost` (desarrollo)
     - `127.0.0.1` (desarrollo)
   - **Accept the reCAPTCHA Terms of Service**: ✓

4. Después de crear, obtendrás:
   - **Site Key** (pública): se usa en el frontend
   - **Secret Key** (privada): se usa en el backend para validar

### 2. Configurar la Site Key en el frontend

En el archivo `src/pages/contact.astro`, línea ~75, reemplaza:
```html
<div class="g-recaptcha" 
     data-sitekey="YOUR_SITE_KEY_HERE"
     data-theme="dark">
</div>
```

Por:
```html
<div class="g-recaptcha" 
     data-sitekey="TU_SITE_KEY_AQUI"
     data-theme="dark">
</div>
```

### 3. Configuración del backend (opcional para validación server-side)

Para validar el reCAPTCHA en el servidor, envía una petición POST a:
```
https://www.google.com/recaptcha/api/siteverify
```

Con los parámetros:
- `secret`: Tu Secret Key
- `response`: El token de respuesta del reCAPTCHA
- `remoteip`: IP del cliente (opcional)

Ejemplo en Node.js:
```javascript
const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    secret: 'TU_SECRET_KEY',
    response: recaptchaToken,
    remoteip: clientIP
  })
});

const result = await response.json();
if (result.success) {
  // reCAPTCHA válido
} else {
  // reCAPTCHA inválido
}
```

## Integración con servicios de formularios

### Opción 1: Formspree
1. Crea una cuenta en [Formspree](https://formspree.io/)
2. Agrega tu site key de reCAPTCHA en la configuración del formulario
3. Formspree validará automáticamente el reCAPTCHA

### Opción 2: EmailJS
1. Crea una cuenta en [EmailJS](https://www.emailjs.com/)
2. Configura un servicio de email
3. Valida reCAPTCHA en el frontend antes de enviar

### Opción 3: Netlify Forms
1. Agrega `netlify` y `data-netlify-recaptcha` al formulario
2. Netlify manejará automáticamente el reCAPTCHA

## Configuración actual implementada

### Frontend
- **Script**: `https://www.google.com/recaptcha/api.js` cargado en Layout.astro
- **Widget**: Tema oscuro, checkbox "I'm not a robot"
- **Validación**: JavaScript verifica que el usuario haya completado el reCAPTCHA
- **Reset**: El reCAPTCHA se reinicia después del envío exitoso

### Características
- ✅ Tema oscuro que combina con el diseño del sitio
- ✅ Validación en tiempo real
- ✅ Mensajes de error claros
- ✅ Reset automático después del envío
- ✅ Responsive design
- ✅ Accesibilidad (labels y ARIA)

## Límites y consideraciones

### Límites gratuitos
- **1,000,000 verificaciones por mes** (gratuito)
- Si superas este límite, Google cobrará $1 por cada 1,000 verificaciones adicionales

### Alternativas si necesitas más verificaciones
1. **hCaptcha**: Hasta 1,000,000 gratuitas por mes
2. **Cloudflare Turnstile**: Gratuito, pero requiere backend
3. **FriendlyCaptcha**: €8/mes por 100,000 verificaciones

## Próximos pasos recomendados

1. **Obtener Site Key real** y reemplazar "YOUR_SITE_KEY_HERE"
2. **Configurar servicio de envío** (Formspree, EmailJS, etc.)
3. **Probar en localhost** y producción
4. **Configurar validación backend** (opcional pero recomendado)
5. **Monitorear uso** en Google reCAPTCHA Admin Console

## Variables de entorno recomendadas

Para mayor seguridad, considera usar variables de entorno:

```bash
# .env
RECAPTCHA_SITE_KEY=tu_site_key_aqui
RECAPTCHA_SECRET_KEY=tu_secret_key_aqui
```

Y en Astro:
```javascript
const RECAPTCHA_SITE_KEY = import.meta.env.RECAPTCHA_SITE_KEY;
```

## Testing

Para probar reCAPTCHA en desarrollo, Google proporciona site keys de prueba:
- **Site Key de prueba**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- **Secret Key de prueba**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

Estas keys siempre pasarán la validación y son útiles para desarrollo.
