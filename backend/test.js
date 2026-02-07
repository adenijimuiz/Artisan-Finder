import dotenv from 'dotenv';
dotenv.config();

import { sendEmail } from "./utils/email.js";



async function sendTestEmail() {
  try {
    console.log('Starting email test...');
    console.log(process.env.EMAIL_USER);
    
    const result = await sendEmail({
      email: 'muizodunayo111@gmail.com',
      subject: 'Test from Artisan Finder',
      message: 'This is a test email!',
      html: '<h1>Success!</h1><p>Email is working correctly.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    return result;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw error;
  }
}

// Run the test
sendTestEmail();