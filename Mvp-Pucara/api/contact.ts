import type { APIRoute } from 'astro';

// Tipos para el formulario de contacto
interface ContactFormData {
  nombre: string;
  apellido: string;
  email: string;
  motivo: 'press' | 'partner-sponsor' | 'player' | 'work' | 'other';
  mensaje: string;
  'g-recaptcha-response'?: string;
  terminos?: string;
  timestamp?: string;
}

interface APIResponse {
  success?: boolean;
  message?: string;
  timestamp?: string;
  error?: string;
  details?: string;
}

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

// Mapeo de motivos de contacto
const MOTIVOS_CONTACTO = {
  'press': 'Prensa',
  'partner-sponsor': 'Quiero ser Partner/Sponsor',
  'player': 'Quiero ser jugador',
  'work': 'Quiero trabajar en PUCARA',
  'other': 'Otro'
} as const;

// Validador de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar campos requeridos
function validateFormData(data: Partial<ContactFormData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.nombre?.trim()) errors.push('Nombre es requerido');
  if (!data.apellido?.trim()) errors.push('Apellido es requerido');
  if (!data.email?.trim()) errors.push('Email es requerido');
  else if (!isValidEmail(data.email)) errors.push('Email inválido');
  if (!data.motivo) errors.push('Motivo es requerido');
  else if (!Object.keys(MOTIVOS_CONTACTO).includes(data.motivo)) errors.push('Motivo inválido');
  if (!data.mensaje?.trim()) errors.push('Mensaje es requerido');
  
  return { isValid: errors.length === 0, errors };
}

// Validar reCAPTCHA
async function validateRecaptcha(token: string, secretKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`
    });
    
    const result = await response.json() as RecaptchaResponse;
    return result.success;
  } catch (error) {
    console.error('Error validating reCAPTCHA:', error);
    return false;
  }
}

// Enviar email via Resend
async function sendEmail(data: ContactFormData, timestamp: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('=== SIMULANDO ENVÍO DE EMAIL ===');
    console.log('Timestamp:', timestamp);
    console.log('Nombre:', data.nombre, data.apellido);
    console.log('Email:', data.email);
    console.log('Motivo:', MOTIVOS_CONTACTO[data.motivo]);
    console.log('Mensaje:', data.mensaje);
    console.log('===============================');
    return true; // Simular éxito en desarrollo
  }

  try {
    const motivoTexto = MOTIVOS_CONTACTO[data.motivo];
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff6b1a; margin: 10px 0 0 0;">Nuevo contacto desde la web</h1>
        </div>
        
        <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #ff6b1a; margin: 0 0 15px 0; font-size: 18px;">Información del contacto:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #ff6b1a;">Nombre:</td>
              <td style="padding: 8px 0;">${data.nombre} ${data.apellido}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #ff6b1a;">Email:</td>
              <td style="padding: 8px 0;">${data.email}</td>
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
          <p style="line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.mensaje}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
          <p>Este mensaje fue enviado desde el formulario de contacto de Pucará Gaming</p>
        </div>
      </div>
    `;

    const emailData = {
      from: 'Pucará Gaming <contacto@pucaragaming.com>',
      to: [process.env.CONTACT_EMAIL || 'francisgcastellano1@gmail.com'],
      reply_to: data.email,
      subject: `[PUCARA GAMING] ${motivoTexto} - ${data.nombre} ${data.apellido}`,
      html: emailContent
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Email enviado exitosamente via Resend:', result.id);
      return true;
    } else {
      console.error('Error enviando email:', result);
      return false;
    }
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
}

// Función para crear respuesta JSON
function createResponse(data: APIResponse, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Handler principal
const POST: APIRoute = async ({ request }) => {
  console.log('=== CONTACT API CALLED ===');
  
  try {
    // Parsear datos del formulario
    let formData: Partial<ContactFormData>;
    
    const contentType = request.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType?.includes('application/json')) {
      formData = await request.json();
      console.log('Datos parseados como JSON');
    } else {
      const formDataObj = await request.formData();
      formData = Object.fromEntries(formDataObj);
      console.log('Datos parseados como FormData');
    }
    
    console.log('Datos recibidos:', {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      motivo: formData.motivo,
      mensajeLength: formData.mensaje?.length,
      recaptcha: formData['g-recaptcha-response'] ? 'Present' : 'Not present'
    });

    // Validar campos requeridos
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      console.error('Validación fallida:', validation.errors);
      return createResponse({ 
        error: 'Datos inválidos: ' + validation.errors.join(', ')
      }, 400);
    }

    // Validar reCAPTCHA si está disponible
    const recaptchaToken = formData['g-recaptcha-response'];
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    
    if (recaptchaToken && recaptchaSecret) {
      console.log('Validando reCAPTCHA...');
      const isRecaptchaValid = await validateRecaptcha(recaptchaToken, recaptchaSecret);
      
      if (!isRecaptchaValid) {
        console.error('reCAPTCHA validation failed');
        return createResponse({ 
          error: 'Verificación reCAPTCHA fallida' 
        }, 400);
      }
      
      console.log('reCAPTCHA validado exitosamente');
    } else {
      console.log('Saltando validación reCAPTCHA - no configurado o no presente');
    }

    // Preparar datos completos
    const timestamp = new Date().toLocaleString('es-AR', { 
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const contactData: ContactFormData = {
      nombre: formData.nombre!,
      apellido: formData.apellido!,
      email: formData.email!,
      motivo: formData.motivo as ContactFormData['motivo'],
      mensaje: formData.mensaje!,
      'g-recaptcha-response': recaptchaToken,
      timestamp
    };

    // Enviar email
    const emailSent = await sendEmail(contactData, timestamp);
    
    if (!emailSent) {
      console.warn('Email no pudo ser enviado, pero continuando...');
    }

    // Respuesta exitosa
    console.log('=== PROCESAMIENTO COMPLETADO ===');
    return createResponse({ 
      success: true, 
      message: 'Mensaje enviado exitosamente',
      timestamp: timestamp
    });

  } catch (error) {
    console.error('=== ERROR EN PROCESAMIENTO ===');
    console.error('Error details:', error);
    console.error('Stack trace:', (error as Error).stack);
    
    return createResponse({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, 500);
  }
};

export { POST };
