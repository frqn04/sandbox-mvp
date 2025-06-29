import router from '@adonisjs/core/services/router'
import { readFileSync, createReadStream } from 'node:fs'
import { join } from 'node:path'
import { load } from 'js-yaml'
import swaggerUiDist from 'swagger-ui-dist'

router.get('/swagger.json', async ({ response }) => {
  const swaggerPath = join(process.cwd(), 'docs/swagger.yaml')
  const swaggerDoc = load(readFileSync(swaggerPath, 'utf8'))
  return response.json(swaggerDoc)
})

router.get('/docs', async ({ response }) => {
  const indexPath = join(swaggerUiDist.getAbsoluteFSPath(), 'index.html')
  let html = readFileSync(indexPath, 'utf8')

  // Cambiar la URL del JSON para que apunte a nuestro endpoint
  html = html.replace('https://petstore.swagger.io/v2/swagger.json', '/swagger.json')

  // Insertar div donde se mostrará Swagger UI si no existe
  if (!html.includes('id="swagger-ui"')) {
    html = html.replace('<body>', '<body><div id="swagger-ui"></div>')
  }

  // Insertar script para inicializar Swagger UI
  if (!html.includes('window.ui = SwaggerUIBundle')) {
    const swaggerInitScript = `
      <script>
        window.onload = function() {
          const ui = SwaggerUIBundle({
            url: "/swagger.json",
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            layout: "BaseLayout",
            deepLinking: true
          })
          window.ui = ui
        }
      </script>
    `
    html = html.replace('</body>', swaggerInitScript + '</body>')
  }

  response.type('text/html')
  return response.send(html)
})

router.get('/docs/*', async ({ params, response }) => {
  const assetPath = join(swaggerUiDist.getAbsoluteFSPath(), params['*'])
  const stream = createReadStream(assetPath)
  return response.stream(stream)
})
