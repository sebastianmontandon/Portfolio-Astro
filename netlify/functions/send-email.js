const { createTransport } = require('netlify:email');
const { SITE_URL } = process.env;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the form data
    const { name, email, subject, message } = JSON.parse(event.body);

    // Basic validation
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    // Get the Netlify Email instance
    const transporter = createTransport();

    // Configure the email options
    const mailOptions = {
      from: `Portfolio Contact <portfolio@${SITE_URL}>`,
      to: 'sam171990@gmail.com',
      subject: `New Contact: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>This message was sent from your portfolio contact form.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully!' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send message',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
};
