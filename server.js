const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Configuração do transporter do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Rota para envio de e-mail
app.post('/enviar-email', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validação básica
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos.' });
  }

  // Configuração do e-mail
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Enviar para o próprio e-mail
    subject: `Contato do site: ${subject}`,
    html: `
      <h3>Nova mensagem do formulário de contato</h3>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Assunto:</strong> ${subject}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${message}</p>
    `
  };

  // Enviar e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar e-mail:', error);
      return res.status(500).json({ success: false, message: 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.' });
    }
    
    console.log('E-mail enviado:', info.response);
    res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse o site em: http://localhost:${PORT}`);
});