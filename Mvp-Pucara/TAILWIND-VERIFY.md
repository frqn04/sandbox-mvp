# Verificación de instalación de Tailwind CSS

Este archivo contiene instrucciones para verificar que Tailwind CSS y PostCSS estén correctamente instalados en tu proyecto.

## Paso 1: Verificar dependencias instaladas

Ejecuta este comando en la terminal para ver las dependencias instaladas:

```bash
npm list tailwindcss postcss autoprefixer @astrojs/tailwind
```

Deberías ver algo como:
```
├── @astrojs/tailwind@x.x.x
├── autoprefixer@x.x.x
├── postcss@x.x.x
└── tailwindcss@x.x.x
```

## Paso 2: Verificar archivos de configuración

Asegúrate de que existan estos archivos:
- `tailwind.config.cjs` (o `tailwind.config.js`)
- `postcss.config.cjs` (o `postcss.config.js`)
- `.vscode/settings.json` (para la integración con VS Code)

## Paso 3: Verificar integración en Astro

En `astro.config.mjs`, deberías tener:
```javascript
import tailwind from '@astrojs/tailwind';
// ...
export default defineConfig({
  integrations: [tailwind()],
  // ...
});
```

## Paso 4: Verificar directivas en CSS

En `src/assets/styles/global.css`, deberías tener:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Paso 5: Solucionar problemas de VS Code

Si sigues viendo errores "Unknown at rule" en VS Code:

1. Instala estas extensiones:
   - Tailwind CSS IntelliSense
   - PostCSS Language Support

2. Reinicia VS Code después de instalar las extensiones

3. Asegúrate de que el archivo `.vscode/settings.json` tenga esta configuración:
```json
{
  "css.validate": false,
  "postcss.validate": true,
  "files.associations": {
    "*.css": "postcss"
  }
}
```

4. Si los errores persisten, pueden ignorarse ya que son solo advertencias visuales y no afectan la compilación.