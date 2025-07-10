# Dimensiones Exactas - Elementos Gráficos Pucará Gaming

## ✅ **ESTADO DE MIGRACIÓN**
**MIGRACIÓN COMPLETADA AL 100%** - Todo el sitio web ha sido migrado exitosamente a Tailwind CSS.

### Resumen de la Migración:
- ✅ **Todas las páginas migradas a Tailwind CSS**
- ✅ **CSS legacy completamente eliminado** (solo queda `global.css` para Tailwind)
- ✅ **Sistema responsive implementado** en todas las páginas
- ✅ **Fuente Ubuntu aplicada** en todo el sitio
- ✅ **Color primario #ea601a** implementado consistentemente
- ✅ **Componentes optimizados y tipados**
- ✅ **Sistema de equipos completamente dinámico y optimizado**
- ✅ **Página About reestructurada** según especificaciones del cliente
- ✅ **Separadores negros implementados** entre secciones
- ✅ **Estructura correcta**: MISIÓN → VISIÓN → VALORES → LOGROS E HITOS

### Últimas Actualizaciones - Sistema de Equipos Optimizado:
- ✅ **Datos centralizados**: Creado `/src/data/teams.ts` con tipos TypeScript
- ✅ **Eliminada duplicación**: Unificados datos entre `index.astro` y `[team].astro`
- ✅ **PlayerCard mejorado**: Agregado campo "rol" para cada jugador
- ✅ **Utility functions**: Funciones helper para gestión de equipos
- ✅ **Tipado completo**: Interfaces TypeScript para Player y Team
- ✅ **Mantenibilidad mejorada**: Un solo punto de verdad para datos de equipos
- ✅ **Actualizado a Astro 5.11.0**: Mejoras de rendimiento y optimizaciones
- ✅ **Dependencias actualizadas**: Tailwind CSS 3.4.17, PostCSS y Autoprefixer latest

---

## 📐 **NAVBAR**
- **Logo principal**: 
  - Mobile: 80px altura
  - Tablet: 100px altura  
  - Desktop: 110px altura
- **Íconos sociales**: 20px x 20px (FA icons text-base)
- **Altura total navbar**: 90px (mobile) / 120px (desktop)

## 📐 **PÁGINA ABOUT (NOSOTROS)**

### **Imágenes de Fundadores**
- **Contenedor**: 100% ancho, altura variable
- **Foto perfil**: 
  - Ancho: 100% del contenedor
  - Alto: 350px (desktop)
  - Alto: 320px (tablet)  
  - Alto: 280px (mobile pequeño)
- **Aspecto recomendado**: 4:5 (retrato)
- **Formato**: PNG con fondo transparente
- **Resolución mínima**: 400x500px
- **Resolución óptima**: 800x1000px

### **Imágenes de Fondo de Secciones**
#### **Sección MISIÓN**
- **Archivo**: `/public/mision.png`
- **Dimensiones recomendadas**: 1920x1080px
- **Formato**: PNG/JPG
- **Optimización**: WebP si es posible

#### **Sección VISIÓN**  
- **Archivo**: `/public/vision.png`
- **Dimensiones recomendadas**: 1920x1080px
- **Formato**: PNG/JPG
- **Optimización**: WebP si es posible

#### **Sección LOGROS E HITOS**
- **Archivo**: `/public/achievements.png`
- **Dimensiones recomendadas**: 1920x1080px  
- **Formato**: PNG/JPG
- **Optimización**: WebP si es posible

## 📐 **HERO BANNER**
- **Archivo**: `/public/herobanner.png`
- **Dimensiones recomendadas**: 1920x1080px
- **Formato**: JPG/PNG
- **Optimización**: WebP si es posible
- **Aspecto**: 16:9
- **Min-height**: 60vh

## 📐 **LOGO PRINCIPAL**
- **Archivo**: `/public/logopucara.png`
- **Dimensiones actuales**: Variable (ajustado por CSS)
- **Formato**: PNG con fondo transparente
- **Resolución recomendada**: 500x500px mínimo
- **Aspecto**: Cuadrado o rectangular horizontal

## 📐 **FOOTER**
- **Logo footer**: 120px altura
- **Íconos sociales**: 24px (text-2xl)

## 📱 **BREAKPOINTS RESPONSIVE**
```css
/* Mobile First */
Default: 0px - 767px (mobile)
md: 768px+ (tablet)  
lg: 1024px+ (desktop)
xl: 1280px+ (desktop grande)
2xl: 1536px+ (pantallas muy grandes)
```

## 🎨 **PALETA DE COLORES**
- **Primario**: #ea601a (naranja Pucará)
- **Oscuro**: #000000 (negro)
- **Claro**: #FFFFFF (blanco)

## 📏 **ESPECIFICACIONES TÉCNICAS**
- **Fuente principal**: Ubuntu (Google Fonts)
- **Framework CSS**: Tailwind CSS
- **Formato imágenes**: PNG para transparencias, JPG para fotos
- **Optimización**: Considerar WebP para mejor rendimiento
- **Responsive**: Mobile-first design

---
## 📐 **SISTEMA DE EQUIPOS**

### **Estructura Optimizada**
- **Archivo de datos**: `/src/data/teams.ts`
- **Tipos TypeScript**: Interfaces `Player` y `Team`
- **Utility functions**: `getAllTeams()`, `getTeamById()`, `getTeamStaticPaths()`

### **PlayerCard Component**
- **Foto perfil**: 128px x 128px (w-32 h-32)
- **Border**: 4px color primario
- **Información mostrada**:
  - Nombre del jugador
  - Rol (nuevo campo agregado)
  - Edad
  - Nacionalidad con emoji
  - Link a Instagram

### **Grid Responsive**
- **Mobile**: 1 columna
- **Tablet (sm)**: 2 columnas  
- **Desktop (lg)**: 3 columnas
- **XL**: 4 columnas
- **2XL**: 5 columnas

### **Navegación Entre Equipos**
- **Botones**: Pills con emoji y nombre
- **Estado activo**: Fondo primario
- **Estado hover**: Fondo primario/80

**Nota**: Todas las medidas están optimizadas para dispositivos móviles primero (mobile-first) y escalan hacia desktop.

**Actualizado**: Julio 2025
