# 🚀 Guía de Deploy - G2K Hosting

> **Instrucciones paso a paso para subir el sitio Pucará Gaming a producción**

## 📋 **Pre-requisitos**

### **Información Necesaria:**
- **Datos del hosting G2K**: Usuario/contraseña de cPanel
- **Dominio**: URL final del sitio
- **FTP**: Credenciales (si usás cliente FTP)
- **Proyecto compilado**: Build de Astro listo

---

## 🔧 **Paso 1: Preparar el Build de Producción**

### **En tu computadora local:**

#### **Windows:**
```powershell
# Navegar a la carpeta del proyecto
cd "C:\Users\User\Desktop\sandbox-mvp\Mvp-Pucara"

# Limpiar builds anteriores (opcional)
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Crear build de producción
npm run build

# Verificar que se creó la carpeta dist/
ls dist
```

#### **Linux/macOS:**
```bash
# Navegar a la carpeta del proyecto
cd /path/to/Mvp-Pucara

# Limpiar builds anteriores (opcional)
rm -rf dist

# Crear build de producción
npm run build

# Verificar que se creó la carpeta dist/
ls -la dist/
```

### **✅ Verificación del Build:**
El comando debe generar una carpeta `dist/` con:
- `index.html` (página principal)
- `about/index.html`, `teams/index.html`, etc.
- Carpeta `_astro/` (CSS y JS optimizados)
- Carpeta con imágenes (`*.png`, `*.jpg`)

---

## 📁 **Paso 2: Acceso al Panel de Control**

### **Opción A: cPanel (Recomendado)**

1. **Ingresar a cPanel:**
   - URL: `https://cpanel.tudominio.com` (o la que te proporcione G2K)
   - Usuario: Tu usuario de hosting
   - Contraseña: Tu contraseña de hosting

2. **Buscar "Administrador de archivos":**
   - Clic en "File Manager" o "Administrador de archivos"
   - Seleccionar "public_html" (directorio raíz del sitio)

### **Opción B: Cliente FTP**

#### **FileZilla (Gratuito):**
```
Host: ftp.tudominio.com (o IP que te dé G2K)
Usuario: [tu_usuario_ftp]
Contraseña: [tu_contraseña_ftp]
Puerto: 21 (FTP) o 22 (SFTP)
```

#### **WinSCP (Windows):**
```
Protocolo: FTP o SFTP
Servidor: ftp.tudominio.com
Usuario: [tu_usuario_ftp]
Contraseña: [tu_contraseña_ftp]
```

---

## 📤 **Paso 3: Subir Archivos**

### **Con cPanel File Manager:**

1. **Limpiar directorio (solo para actualizaciones):**
   - Seleccionar todos los archivos en `public_html/`
   - ⚠️ **CUIDADO**: No borrar `.htaccess` si existe
   - Eliminar archivos del sitio anterior

2. **Subir archivos del build:**
   - Clic en "Upload" o "Subir"
   - Seleccionar **TODO** el contenido de la carpeta `dist/`
   - **NO subir la carpeta `dist/` en sí, sino su contenido**

3. **Estructura final en public_html/:**
   ```
   public_html/
   ├── index.html
   ├── about/
   │   └── index.html
   ├── teams/
   │   └── index.html
   ├── contact/
   │   └── index.html
   ├── _astro/
   │   ├── *.css
   │   └── *.js
   ├── logopucara.png
   ├── herobanner.png
   └── [otras imágenes]
   ```

### **Con FTP:**

1. **Conectar al servidor**
2. **Navegar a `/public_html/`**
3. **Subir contenido de `dist/`:**
   - Seleccionar TODO dentro de `dist/`
   - Arrastrar al directorio remoto `public_html/`
   - Confirmar sobrescribir archivos existentes

---

## 🔗 **Paso 4: Configurar Dominio (Si es necesario)**

### **Si usás dominio principal:**
- El sitio debería estar disponible inmediatamente en `https://tudominio.com`

### **Si usás subdominio:**
1. **En cPanel, buscar "Subdominios"**
2. **Crear subdominio:** `pucara.tudominio.com`
3. **Apuntar a:** `/public_html/` (donde subiste los archivos)

### **Si usás carpeta:**
- Subir archivos a `/public_html/pucara/`
- Sitio disponible en `https://tudominio.com/pucara/`

---

## ✅ **Paso 5: Verificar Deploy**

### **Checklist Post-Deploy:**
- [ ] **Página principal carga**: `https://tudominio.com`
- [ ] **Navegación funciona**: Todas las páginas (About, Teams, etc.)
- [ ] **Imágenes se ven**: Logo, banners, fotos de fundadores
- [ ] **Estilos aplicados**: Colores, fuentes, responsive design
- [ ] **Enlaces externos**: Redes sociales funcionan
- [ ] **Mobile responsive**: Probar en celular
- [ ] **Velocidad**: Sitio carga rápido

### **URLs a probar:**
```
https://tudominio.com/
https://tudominio.com/about/
https://tudominio.com/teams/
https://tudominio.com/contact/
https://tudominio.com/teams/dota-2/
https://tudominio.com/teams/street-fighter/
https://tudominio.com/teams/fifa/
```

---

## 🚨 **Troubleshooting Común**

### **Problema: Página en blanco**
- **Causa**: Archivos no subidos correctamente
- **Solución**: Verificar que `index.html` esté en la raíz de `public_html/`

### **Problema: Estilos no cargan**
- **Causa**: Carpeta `_astro/` faltante o mal ubicada
- **Solución**: Verificar que `/public_html/_astro/` exista con archivos CSS/JS

### **Problema: Imágenes no cargan**
- **Causa**: Imágenes no subidas o rutas incorrectas
- **Solución**: Verificar que las imágenes estén en `/public_html/` (no en subcarpeta)

### **Problema: Error 404 en páginas internas**
- **Causa**: Astro genera carpetas para cada página
- **Solución**: Verificar que existan las carpetas `about/`, `teams/`, etc. con sus `index.html`

### **Problema: HTTPS no funciona**
- **Causa**: SSL no configurado
- **Solución**: En cPanel, activar "Let's Encrypt SSL" o contactar a G2K

---

## 🔄 **Actualizaciones Futuras**

### **Para actualizar el sitio:**

1. **Build local nuevo:**
   ```bash
   npm run build
   ```

2. **Subir solo archivos cambiados:**
   - Identificar qué cambió
   - Subir solo esos archivos via cPanel/FTP

3. **Cache del navegador:**
   - Probar en ventana privada
   - Ctrl+F5 para forzar recarga

---

## 📊 **Plan Premium G2K - Ventajas**

### **Recursos disponibles:**
- **150 GB almacenamiento**: Tu sitio usa ~50MB
- **2000 GB transferencia**: Soporta mucho tráfico
- **2 sitios web**: Podés crear staging.tudominio.com para pruebas
- **SSL incluido**: HTTPS automático
- **Email corporativo**: info@tudominio.com

### **Monitoreo:**
- **Estadísticas**: cPanel tiene métricas de tráfico
- **Backup**: G2K hace backups automáticos
- **Soporte**: Chat/email en español

---

## � **Alternativa: Deploy en Vercel (Moderno)**

> **Vercel es una plataforma moderna ideal para sitios estáticos como Astro**

### **🌟 Ventajas de Vercel:**
- **Deploy automático**: Conecta con GitHub y se actualiza solo
- **CDN global**: Velocidad mundial automática
- **SSL gratuito**: HTTPS incluido
- **Dominio gratuito**: `tu-proyecto.vercel.app`
- **Sin configuración**: Detecta Astro automáticamente

### **📋 Proceso de Deploy:**

#### **1. Preparación (Solo una vez):**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login en Vercel
vercel login
```

#### **2. Deploy desde terminal:**
```bash
# En la carpeta del proyecto
cd "C:\Users\User\Desktop\sandbox-mvp\Mvp-Pucara"

# Deploy automático
vercel

# Primera vez: seguir configuración interactiva
# Deploy automático detectará Astro y configurará todo
```

#### **3. Deploy desde GitHub (Recomendado):**
1. **Subir código a GitHub**
2. **Ir a vercel.com**
3. **"New Project" → Importar desde GitHub**
4. **Seleccionar repositorio**
5. **Vercel detecta Astro automáticamente**
6. **Deploy automático cada vez que hagas push**

### **⚡ Comparación G2K vs Vercel:**

| Característica | G2K Hosting | Vercel |
|---------------|------------|---------|
| **Precio** | ~$70 USD/año | Gratis (plan hobby) |
| **Deploy** | Manual (FTP/cPanel) | Automático (Git) |
| **Velocidad** | Servidores Argentina | CDN Global |
| **SSL** | Incluido | Incluido |
| **Dominio custom** | Incluido (.com gratis) | $20 USD/año |
| **Email** | Incluido (ilimitado) | No incluido |
| **Soporte** | Español | Inglés |
| **Ideal para** | Clientes tradicionales | Desarrolladores |

### **🎯 Recomendación:**

**Para Pucará Gaming:**
- **G2K** si necesitás email corporativo y soporte en español
- **Vercel** si priorizás velocidad y deploy automático

**Setup híbrido:**
- **Hosting principal**: G2K (para email y dominio)
- **CDN/Deploy**: Vercel (para velocidad)
- **Redirigir**: `pucaraesports.com` → `pucara-gaming.vercel.app`

---

## �📞 **Contacto G2K**

- **Soporte técnico**: Via panel de cliente
- **Documentación**: Base de conocimientos G2K
- **Horarios**: Verificar en su sitio web

**✅ Una vez completados todos los pasos, tu sitio estará live en internet!**

**Actualizado**: Enero 2025 - Específico para Plan Premium G2K
