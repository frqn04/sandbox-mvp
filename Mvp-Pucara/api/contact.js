// API Route para Vercel - Manejo del formulario de contacto
export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Extraer datos del formulario
    const { nombre, apellido, email, motivo, mensaje, 'g-recaptcha-response': recaptchaResponse } = req.body;

    // Validación básica
    if (!nombre || !apellido || !email || !motivo || !mensaje) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos',
        missing: { nombre: !nombre, apellido: !apellido, email: !email, motivo: !motivo, mensaje: !mensaje }
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validar reCAPTCHA (habilitado)
    if (process.env.NODE_ENV === 'production' && recaptchaResponse) {
      const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
      
      if (recaptchaSecret) {
        const recaptchaVerification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${recaptchaSecret}&response=${recaptchaResponse}`
        });
        
        const recaptchaResult = await recaptchaVerification.json();
        
        if (!recaptchaResult.success) {
          return res.status(400).json({ error: 'Verificación reCAPTCHA fallida' });
        }
      }
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

    // Enviar email usando el servicio de email de Vercel o integración externa
    // Por ahora, vamos a usar un servicio simple como EmailJS o similar
    
    // Opción 1: Usar servicio de email externo (recomendado para producción)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Configurar nodemailer si tienes credenciales SMTP
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"${nombre} ${apellido}" <${process.env.SMTP_USER}>`,
        to: 'francisgcastellano1@gmail.com',
        replyTo: email,
        subject: `[PUCARA GAMING] ${motivoTexto} - ${nombre} ${apellido}`,
        html: emailContent
      });
    } else {
      // Opción 2: Log para desarrollo (cambiar por servicio real)
      console.log('=== NUEVO CONTACTO RECIBIDO ===');
      console.log('Timestamp:', timestamp);
      console.log('Nombre:', nombre, apellido);
      console.log('Email:', email);
      console.log('Motivo:', motivoTexto);
      console.log('Mensaje:', mensaje);
      console.log('IP:', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
      console.log('===============================');
    }

    // Respuesta exitosa
    return res.status(200).json({ 
      success: true, 
      message: 'Mensaje enviado exitosamente',
      timestamp: timestamp
    });

  } catch (error) {
    console.error('Error procesando formulario:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
