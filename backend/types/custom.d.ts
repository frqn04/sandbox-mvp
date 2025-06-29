declare module '@ioc:Adonis/Core/Route' {
  const Route: any
  export default Route
}

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    request: any
    response: any
    params: any
    // agrega aquí otros tipos que uses si querés
  }
  export type { HttpContextContract }
}
