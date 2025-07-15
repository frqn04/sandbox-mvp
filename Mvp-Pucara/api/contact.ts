// API Endpoint para Astro - Manejo del formulario de contacto
import type { APIRoute } from 'astro';

export const prerender = false;

// Interfaces para type safety
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
  missing?: Partial<Record<keyof ContactFormData, boolean>>;
}

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

interface ResendEmailRequest {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  html: string;
}

interface ResendEmailResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

// Tipos para motivos de contacto
const MOTIVOS_CONTACTO = {
  'press': 'Prensa',
  'partner-sponsor': 'Quiero ser Partner/Sponsor',
  'player': 'Quiero ser jugador',
  'work': 'Quiero trabajar en PUCARA',
  'other': 'Otro'
} as const;

// Validador de email con TypeScript
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validador de campos requeridos
const validateRequiredFields = (data: Partial<ContactFormData>): { isValid: boolean; missing: Partial<Record<keyof ContactFormData, boolean>> } => {
  const required: Array<keyof ContactFormData> = ['nombre', 'apellido', 'email', 'motivo', 'mensaje'];
  const missing: Partial<Record<keyof ContactFormData, boolean>> = {};
  
  for (const field of required) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field]?.trim())) {
      missing[field] = true;
    }
  }
  
  return {
    isValid: Object.keys(missing).length === 0,
    missing
  };
};

// Función para validar reCAPTCHA
const validateRecaptcha = async (response: string, secretKey: string): Promise<RecaptchaResponse> => {
  const recaptchaVerification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secretKey}&response=${response}`
  });
  
  return await recaptchaVerification.json() as RecaptchaResponse;
};

// Función para enviar email via Resend
const sendEmailViaResend = async (
  emailData: ResendEmailRequest,
  apiKey: string
): Promise<ResendEmailResponse> => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(`Resend API error: ${result.message || 'Unknown error'}`);
  }
  
  return result as ResendEmailResponse;
};

// Función para generar contenido del email
const generateEmailContent = (data: ContactFormData, timestamp: string): string => {
  const motivoTexto = MOTIVOS_CONTACTO[data.motivo] || data.motivo;
  
  return `
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
};

// Función para crear respuesta HTTP
const createResponse = (data: APIResponse, status: number = 200): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

// Handler principal del endpoint
const POST: APIRoute = async (context) => {
  console.log('=== API CONTACT CALLED ===');
  console.log('Context received:', !!context);
  
  const { request } = context;
  
  if (!request) {
    console.error('Request is undefined');
    return createResponse({ error: 'Request no disponible' }, 500);
  }
  
  try {
    // Extraer datos del formulario - Priorizar JSON que es lo que envía el frontend
    let body: Partial<ContactFormData>;
    
    console.log('Content-Type:', request.headers.get('content-type'));
    
    try {
      // Intentar JSON primero (que es lo que envía el ContactForm.astro)
      const requestBody = await request.json();
      body = requestBody as ContactFormData;
      console.log('Successfully parsed as JSON');
    } catch (jsonError) {
      console.log('JSON parsing failed, trying FormData:', (jsonError as Error).message);
      try {
        const formData = await request.formData();
        body = Object.fromEntries(formData) as unknown as ContactFormData;
        console.log('Successfully parsed as FormData');
      } catch (formError) {
        console.error('Both JSON and FormData parsing failed:', formError);
        return createResponse({ error: 'Formato de datos inválido' }, 400);
      }
    }
    
    const { nombre, apellido, email, motivo, mensaje } = body;
    const recaptchaResponse = body['g-recaptcha-response'];
    
    console.log('=== DATOS RECIBIDOS ===');
    console.log('Nombre:', nombre);
    console.log('Apellido:', apellido);
    console.log('Email:', email);
    console.log('Motivo:', motivo);
    console.log('Mensaje length:', mensaje?.length);
    console.log('reCAPTCHA response:', recaptchaResponse ? 'Present' : 'Not present');
    console.log('=================');

    // Validación de campos requeridos
    const validation = validateRequiredFields(body);
    if (!validation.isValid) {
      console.error('Validation failed - missing fields');
      return createResponse({ 
        error: 'Todos los campos son requeridos',
        missing: validation.missing
      }, 400);
    }

    // Validar formato de email
    if (!isValidEmail(email!)) {
      console.error('Invalid email format:', email);
      return createResponse({ error: 'Email inválido' }, 400);
    }

    // Validar motivo
    if (!Object.keys(MOTIVOS_CONTACTO).includes(motivo!)) {
      console.error('Invalid motivo:', motivo);
      return createResponse({ error: 'Motivo inválido' }, 400);
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
        const recaptchaResult = await validateRecaptcha(recaptchaResponse, process.env.RECAPTCHA_SECRET_KEY);
        console.log('reCAPTCHA result:', recaptchaResult);
        
        if (!recaptchaResult.success) {
          console.error('reCAPTCHA validation failed:', recaptchaResult);
          return createResponse({ error: 'Verificación reCAPTCHA fallida' }, 400);
        }
        
        console.log('reCAPTCHA validation successful');
      } catch (recaptchaError) {
        console.error('Error validating reCAPTCHA:', recaptchaError);
        return createResponse({ error: 'Error en verificación reCAPTCHA' }, 400);
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

    const contactData: ContactFormData = {
      nombre: nombre!,
      apellido: apellido!,
      email: email!,
      motivo: motivo as ContactFormData['motivo'],
      mensaje: mensaje!,
      'g-recaptcha-response': recaptchaResponse,
      timestamp
    };

    const motivoTexto = MOTIVOS_CONTACTO[contactData.motivo];
    const emailContent = generateEmailContent(contactData, timestamp);

    // Enviar email usando Resend (recomendado para producción)
    if (process.env.RESEND_API_KEY) {
      try {
        const emailData: ResendEmailRequest = {
          from: 'Pucará Gaming <contacto@pucaragaming.com>',
          to: [process.env.CONTACT_EMAIL || 'francisgcastellano1@gmail.com'],
          reply_to: contactData.email,
          subject: `[PUCARA GAMING] ${motivoTexto} - ${contactData.nombre} ${contactData.apellido}`,
          html: emailContent
        };

        const resendResult = await sendEmailViaResend(emailData, process.env.RESEND_API_KEY);
        console.log('Email enviado exitosamente via Resend:', resendResult.id);
      } catch (resendError) {
        console.error('Error enviando email via Resend:', resendError);
        
        // Log para debugging pero no fallar
        console.log('=== CONTACTO RECIBIDO (Error en envío) ===');
        console.log('Timestamp:', timestamp);
        console.log('Nombre:', contactData.nombre, contactData.apellido);
        console.log('Email:', contactData.email);
        console.log('Motivo:', motivoTexto);
        console.log('Mensaje:', contactData.mensaje);
        console.log('Error:', (resendError as Error).message);
        console.log('===============================');
        
        // Continuar con la respuesta exitosa para no bloquear al usuario
        // En producción, podrías querer fallar aquí dependiendo de los requerimientos
      }
    } else {
      // Fallback: Log para desarrollo
      console.log('=== NUEVO CONTACTO RECIBIDO ===');
      console.log('Timestamp:', timestamp);
      console.log('Nombre:', contactData.nombre, contactData.apellido);
      console.log('Email:', contactData.email);
      console.log('Motivo:', motivoTexto);
      console.log('Mensaje:', contactData.mensaje);
      console.log('===============================');
      console.log('NOTA: Configurar RESEND_API_KEY para envío de emails');
    }

    // Respuesta exitosa
    console.log('=== FORM PROCESSING COMPLETE ===');
    console.log('Success response being sent');
    console.log('============================');
    
    return createResponse({ 
      success: true, 
      message: 'Mensaje enviado exitosamente',
      timestamp: timestamp
    });

  } catch (error) {
    console.error('=== ERROR PROCESSING FORM ===');
    console.error('Error details:', error);
    console.error('Stack trace:', (error as Error).stack);
    console.error('==========================');
    
    return createResponse({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, 500);
  }
};

export { POST };
