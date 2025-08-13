// server.js

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Required for cross-origin requests

// Load environment variables from a .env file
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Configure your email credentials using environment variables
// IMPORTANT: Make sure your .env file exists and contains EMAIL_USER and EMAIL_PASS
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or another service like 'outlook'
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS  // Your app password from .env
    }
});

// Define the API endpoint to handle email sending
app.post('/send-email', (req, res) => {
    // Extract form data from the request body
    const { name, email, subject, message } = req.body;

    // Validate message word count
    const words = message.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (words < 30) {
        return res.status(400).json({ error: 'Mail must have 30+ words.' });
    }

    // Configure the email message
    const mailOptions = {
        from: `"${name}" <${email}>`, // Sender's name and email
        to: 'jtorres090906@gmail.com', // The email address the form messages should be sent to
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}` // Plain text body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            // Send an error response back to the client
            return res.status(500).json({ error: 'There was an error sending your message. Please try again.' });
        }
        console.log('Email sent: ' + info.response);
        // Send a success response back to the client
        res.status(200).json({ success: 'Message sent successfully!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Email backend listening at http://localhost:${port}`);
});
