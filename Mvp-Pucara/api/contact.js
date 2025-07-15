// API Endpoint para Astro - Manejo del formulario de contacto
export const prerender = false;

export async function POST(context) {
  console.log('=== API CONTACT CALLED ===');
  console.log('Context received:', !!context);
  
  const { request } = context;
  
  if (!request) {
    console.error('Request is undefined');
    return new Response(JSON.stringify({ error: 'Request no disponible' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Extraer datos del formulario - Priorizar JSON que es lo que envía el frontend
    let body;
    
    console.log('Content-Type:', request.headers.get('content-type'));
    
    try {
      // Intentar JSON primero (que es lo que envía el ContactForm.astro)
      body = await request.json();
      console.log('Successfully parsed as JSON');
    } catch (jsonError) {
      console.log('JSON parsing failed, trying FormData:', jsonError.message);
      try {
        const formData = await request.formData();
        body = Object.fromEntries(formData);
        console.log('Successfully parsed as FormData');
      } catch (formError) {
        console.error('Both JSON and FormData parsing failed:', formError);
        return new Response(JSON.stringify({ error: 'Formato de datos inválido' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    const { nombre, apellido, email, motivo, mensaje, 'g-recaptcha-response': recaptchaResponse } = body;
    
    console.log('=== DATOS RECIBIDOS ===');
    console.log('Nombre:', nombre);
    console.log('Apellido:', apellido);
    console.log('Email:', email);
    console.log('Motivo:', motivo);
    console.log('Mensaje length:', mensaje?.length);
    console.log('reCAPTCHA response:', recaptchaResponse ? 'Present' : 'Not present');
    console.log('=================');

    // Validación básica
    if (!nombre || !apellido || !email || !motivo || !mensaje) {
      console.error('Validation failed - missing fields');
      return new Response(JSON.stringify({ 
        error: 'Todos los campos son requeridos',
        missing: { nombre: !nombre, apellido: !apellido, email: !email, motivo: !motivo, mensaje: !mensaje }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return new Response(JSON.stringify({ error: 'Email inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log de variables de entorno (sin mostrar valores sensibles)
    console.log('=== ENVIRONMENT CHECK ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Present' : 'Not set');
    console.log('RECAPTCHA_SECRET_KEY:', process.env.RECAPTCHA_SECRET_KEY ? 'Present' : 'Not set');
    console.log('CONTACT_EMAIL:', process.env.CONTACT_EMAIL || 'Using default');
    console.log('=====================');

    // Validar reCAPTCHA (solo en producción si está configurado)
    if (recaptchaResponse && process.env.RECAPTCHA_SECRET_KEY) {
      console.log('Validating reCAPTCHA...');
      try {
        const recaptchaVerification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`
        });
        
        const recaptchaResult = await recaptchaVerification.json();
        console.log('reCAPTCHA result:', recaptchaResult);
        
        if (!recaptchaResult.success) {
          console.error('reCAPTCHA validation failed:', recaptchaResult);
          return new Response(JSON.stringify({ error: 'Verificación reCAPTCHA fallida' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        console.log('reCAPTCHA validation successful');
      } catch (recaptchaError) {
        console.error('Error validating reCAPTCHA:', recaptchaError);
        return new Response(JSON.stringify({ error: 'Error en verificación reCAPTCHA' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      console.log('Skipping reCAPTCHA validation - not configured or no response');
    }

    // Preparar datos para el email
    const timestamp = new Date().toLocaleString('es-AR', { 
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const motivoTexto = {
      'press': 'Prensa',
      'partner-sponsor': 'Quiero ser Partner/Sponsor',
      'player': 'Quiero ser jugador',
      'work': 'Quiero trabajar en PUCARA',
      'other': 'Otro'
    }[motivo] || motivo;

    // Crear el contenido del email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://mvp-pucara-grbrbc6la-frqns-projects.vercel.app/logopucara.png" alt="Pucará Gaming" style="width: 80px; height: 80px;" />
          <h1 style="color: #ff6b1a; margin: 10px 0 0 0;">Nuevo contacto desde la web</h1>
        </div>
        
        <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #ff6b1a; margin: 0 0 15px 0; font-size: 18px;">Información del contacto:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #ff6b1a;">Nombre:</td>
              <td style="padding: 8px 0;">${nombre} ${apellido}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #ff6b1a;">Email:</td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #ff6b1a;">Motivo:</td>
              <td style="padding: 8px 0;">${motivoTexto}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #ff6b1a;">Fecha:</td>
              <td style="padding: 8px 0;">${timestamp}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #2a2a2a; padding: 20px; border-radius: 8px;">
          <h3 style="color: #ff6b1a; margin: 0 0 15px 0; font-size: 16px;">Mensaje:</h3>
          <p style="line-height: 1.6; margin: 0; white-space: pre-wrap;">${mensaje}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
          <p>Este mensaje fue enviado desde el formulario de contacto de Pucará Gaming</p>
        </div>
      </div>
    `;

    // Enviar email usando Resend (recomendado para producción)
    if (process.env.RESEND_API_KEY) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Pucará Gaming <contacto@pucaragaming.com>',
            to: [process.env.CONTACT_EMAIL || 'francisgcastellano1@gmail.com'],
            reply_to: email,
            subject: `[PUCARA GAMING] ${motivoTexto} - ${nombre} ${apellido}`,
            html: emailContent
          })
        });

        const resendResult = await resendResponse.json();
        
        if (!resendResponse.ok) {
          console.error('Resend API error:', resendResult);
          throw new Error(`Resend error: ${resendResult.message || 'Unknown error'}`);
        }
        
        console.log('Email enviado exitosamente via Resend:', resendResult.id);
      } catch (resendError) {
        console.error('Error enviando email via Resend:', resendError);
        
        // Log para debugging pero no fallar
        console.log('=== CONTACTO RECIBIDO (Error en envío) ===');
        console.log('Timestamp:', timestamp);
        console.log('Nombre:', nombre, apellido);
        console.log('Email:', email);
        console.log('Motivo:', motivoTexto);
        console.log('Mensaje:', mensaje);
        console.log('Error:', resendError.message);
        console.log('===============================');
        
        // Continuar con la respuesta exitosa para no bloquear al usuario
        // throw new Error('Error enviando email');
      }
    } else {
      // Fallback: Log para desarrollo
      console.log('=== NUEVO CONTACTO RECIBIDO ===');
      console.log('Timestamp:', timestamp);
      console.log('Nombre:', nombre, apellido);
      console.log('Email:', email);
      console.log('Motivo:', motivoTexto);
      console.log('Mensaje:', mensaje);
      console.log('===============================');
      console.log('NOTA: Configurar RESEND_API_KEY para envío de emails');
    }

    // Respuesta exitosa
    console.log('=== FORM PROCESSING COMPLETE ===');
    console.log('Success response being sent');
    console.log('============================');
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Mensaje enviado exitosamente',
      timestamp: timestamp
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('=== ERROR PROCESSING FORM ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    console.error('==========================');
    
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
