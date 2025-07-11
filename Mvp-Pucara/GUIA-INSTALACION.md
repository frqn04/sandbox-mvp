# 🚀 Guía de Instalación - Pucará Gaming

> **Instrucciones completas para configurar el proyecto en cualquier sistema operativo**

## 📋 **Requisitos Previos**

### **Node.js (Requerido)**
- **Versión mínima**: Node.js 18.0.0 o superior
- **Recomendado**: Node.js 20.x LTS

#### **Windows:**
```powershell
# Descargar desde https://nodejs.org/
# O usar Chocolatey
choco install nodejs

# Verificar instalación
node --version
npm --version
```

#### **Linux (Ubuntu/Debian):**
```bash
# Actualizar repositorios
sudo apt update

# Instalar Node.js
sudo apt install nodejs npm

# O usar NodeSource para última versión
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

#### **macOS:**
```bash
# Usando Homebrew
brew install node

# Verificar instalación
node --version
npm --version
```

---

## 📦 **Instalación del Proyecto**

### **1. Clonar o Descargar el Proyecto**

#### **Con Git:**
```bash
# Windows/Linux/macOS
git clone [URL_DEL_REPOSITORIO]
cd mvp-pucara
```

#### **Sin Git:**
- Descargar ZIP del repositorio
- Extraer archivos
- Abrir terminal en la carpeta del proyecto

### **2. Instalar Dependencias**

#### **Windows (PowerShell/CMD):**
```powershell
# Instalar todas las dependencias
npm install

# O usar yarn si lo prefieres
yarn install
```

#### **Linux/macOS:**
```bash
# Instalar todas las dependencias
npm install

# O usar yarn si lo prefieres
yarn install
```

---

## 🛠️ **Dependencias del Proyecto**

### **Framework Principal**
- **Astro 5.11.0**: Framework principal del sitio
- **TypeScript 5.8.3**: Tipado estático

### **Estilos**
- **Tailwind CSS 3.4.17**: Framework de CSS utility-first
- **@astrojs/tailwind 6.0.2**: Integración oficial de Tailwind con Astro
- **PostCSS 8.5.6**: Procesador de CSS
- **Autoprefixer 10.4.21**: Auto-prefijos CSS para compatibilidad

### **Optimización**
- **Sharp 0.34.3**: Optimización automática de imágenes
- **Shiki 3.7.0**: Syntax highlighting

### **Herramientas de Desarrollo**
- **@astrojs/check 0.9.4**: Type checking para Astro

---

## 🚀 **Comandos de Desarrollo**

### **Desarrollo Local**

#### **Windows:**
```powershell
# Iniciar servidor de desarrollo
npm run dev
# El sitio estará disponible en http://localhost:4321
```

#### **Linux/macOS:**
```bash
# Iniciar servidor de desarrollo
npm run dev
# El sitio estará disponible en http://localhost:4321
```

### **Construcción para Producción**

#### **Windows:**
```powershell
# Construir sitio estático
npm run build

# Previsualizar build de producción
npm run preview
```

#### **Linux/macOS:**
```bash
# Construir sitio estático
npm run build

# Previsualizar build de producción
npm run preview
```

### **Comandos Adicionales**

#### **Windows/Linux/macOS:**
```bash
# Type checking
npm run astro check

# Comandos específicos de Astro
npm run astro --help

# Actualizar dependencias
npm update
```

---

## 📁 **Estructura del Proyecto**

```
mvp-pucara/
├── src/
│   ├── components/     # Componentes Astro
│   ├── layouts/        # Layouts base
│   ├── pages/         # Páginas del sitio
│   ├── data/          # Datos centralizados
│   └── assets/        # Assets del proyecto
├── public/            # Archivos estáticos (imágenes, etc.)
├── astro.config.mjs   # Configuración de Astro
├── tailwind.config.cjs # Configuración de Tailwind
├── tsconfig.json      # Configuración de TypeScript
└── package.json       # Dependencias del proyecto
```

---

## 🔧 **Configuración del Editor**

### **VS Code (Recomendado)**

#### **Extensiones Necesarias:**
```bash
# Instalar extensiones desde terminal
code --install-extension astro-build.astro-vscode
code --install-extension bradlc.vscode-tailwindcss
```

#### **O buscar en VS Code Marketplace:**
- **Astro** (astro-build.astro-vscode)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)

---

## 🚨 **Solución de Problemas Comunes**

### **Error de permisos (Linux/macOS):**
```bash
# Si hay problemas de permisos con npm
sudo chown -R $(whoami) ~/.npm
```

### **Cache de Node.js:**
```bash
# Limpiar cache si hay problemas
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Puerto ocupado:**
```bash
# Si el puerto 4321 está ocupado
npm run dev -- --port 3000
```

---

## ✅ **Verificación de Instalación**

### **Checklist Final:**
- [ ] Node.js instalado (versión 18+)
- [ ] Dependencias instaladas (`npm install` ejecutado)
- [ ] Servidor de desarrollo funcionando (`npm run dev`)
- [ ] Sitio accesible en `http://localhost:4321`
- [ ] No hay errores en consola

### **Comando de Verificación:**
```bash
# Verificar que todo funciona
npm run build
```

Si el build se completa sin errores, ¡todo está listo!

---

## 📞 **Soporte**

- **Documentación Astro**: https://docs.astro.build/
- **Documentación Tailwind**: https://tailwindcss.com/docs
- **Node.js**: https://nodejs.org/

**Actualizado**: Enero 2025
