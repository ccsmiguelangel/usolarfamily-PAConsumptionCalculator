import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: 'mail.usolarfamily.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'calculatorpty@usolarfamily.com',
    pass: 'c@^}96ahL}8cZBiZ'
  }
});

// Route to send email
app.post('/api/send-email', async (req, res) => {
  try {
    const {
      clientInfo,
      averageConsumption,
      totalConsumption,
      totalNaturgyEnsa,
      totalNewProjection,
      systemSize,
      numberOfPanels
    } = req.body;

    // Create email content
    const emailContent = `
      <h2>Propuesta de Sistema Solar - USolar Family</h2>
      
      <h3>Datos del Cliente:</h3>
      <p><strong>Nombre:</strong> ${clientInfo.name} ${clientInfo.lastname}</p>
      <p><strong>Email:</strong> ${clientInfo.email}</p>
      <p><strong>Teléfono:</strong> ${clientInfo.phone}</p>
      <p><strong>Dirección:</strong> ${clientInfo.address}</p>
      
      <h3>Análisis de Consumo:</h3>
      <p><strong>Consumo Promedio:</strong> ${averageConsumption.toFixed(2)} kWh</p>
      <p><strong>Consumo Total:</strong> ${totalConsumption.toFixed(2)} kWh</p>
      
      <h3>Análisis Financiero:</h3>
      <p><strong>Total Gastado en Naturgy | Ensa:</strong> $${totalNaturgyEnsa.toFixed(2)}</p>
      <p><strong>Total Ahorrado en Nueva Proyección:</strong> $${totalNewProjection.toFixed(2)}</p>
      
      <h3>Propuesta del Sistema:</h3>
      <p><strong>Tamaño del Sistema:</strong> ${systemSize.toFixed(2)} kWh</p>
      <p><strong>Cantidad de Paneles Necesarios:</strong> ${numberOfPanels}</p>
      
      <hr>
      <p><em>Este es un análisis personalizado generado por nuestro calculador solar.</em></p>
      <p><em>Para más información, contáctenos.</em></p>
    `;

    // Configure email
    const mailOptions = {
      from: 'calculatorpty@usolarfamily.com',
      to: clientInfo.email,
      subject: 'Propuesta de Sistema Solar - USolar Family',
      html: emailContent
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Email enviado exitosamente' 
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar el email',
      error: error.message 
    });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
