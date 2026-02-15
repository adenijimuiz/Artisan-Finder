import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  // service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (options) => {
  const mailOptions = {
    from: `Artisan Finder <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };


  await transporter.sendMail(mailOptions);
};

export const sendBookingNotification = async (booking, artisan, client) => {
  const message = `
    New booking request from ${client.name}
    
    Service: ${booking.serviceType}
    Date: ${new Date(booking.date).toLocaleDateString()}
    Time: ${booking.time}
    Location: ${booking.location || 'Not specified'}
    Budget: ${booking.budget ? `₦${booking.budget}` : 'Not specified'}
    
    Login to your dashboard to view details and respond.
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
        .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Booking Request! 🎉</h1>
        </div>
        <div class="content">
          <p>Hello ${artisan.name},</p>
          <p>You have received a new booking request from <strong>${client.name}</strong>.</p>
          
          <div class="details">
            <h3>Booking Details:</h3>
            <p><strong>Service:</strong> ${booking.serviceType}</p>
            <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Location:</strong> ${booking.location?.address || 'Not specified'}</p>
            <p><strong>Budget:</strong> ${booking.budget ? `₦${booking.budget}` : 'Not specified'}</p>
            ${booking.description ? `<p><strong>Description:</strong> ${booking.description}</p>` : ''}
          </div>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/bookings/${booking._id}" class="button">View Booking Details</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Artisan Finder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: artisan.email,
    subject: 'New Booking Request - Artisan Finder',
    message,
    html
  });
};

export const sendBookingConfirmation = async (booking, client, artisan) => {
  const message = `
    Your booking with ${artisan.name} has been confirmed!
    
    Service: ${booking.serviceType}
    Date: ${new Date(booking.date).toLocaleDateString()}
    Time: ${booking.time}
    Location: ${booking.location?.address || 'Not specified'}
    
    The artisan will contact you soon.
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
        .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed! ✅</h1>
        </div>
        <div class="content">
          <p>Hello ${client.name},</p>
          <p>Great news! Your booking with <strong>${artisan.name}</strong> has been confirmed.</p>
          
          <div class="details">
            <h3>Booking Details:</h3>
            <p><strong>Service:</strong> ${booking.serviceType}</p>
            <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Location:</strong> ${booking.location?.address || 'Not specified'}</p>
            <p><strong>Artisan:</strong> ${artisan.name}</p>
            ${artisan.email ? `<p><strong>Contact:</strong> ${artisan.email}</p>` : ''}
          </div>
          
          <p>The artisan will contact you soon to finalize the details.</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/bookings/${booking._id}" class="button">View Booking</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Artisan Finder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: client.email,
    subject: 'Booking Confirmed - Artisan Finder',
    message,
    html
  });
};

export const sendBookingRejected = async (booking, client, artisan) => {
  const message = `
    Your booking request with ${artisan.name} has been declined.
    
    Service: ${booking.serviceType}
    Date: ${new Date(booking.date).toLocaleDateString()}
    Time: ${booking.time}
    Location: ${booking.location?.address || 'Not specified'}
    
    Feel free to browse other artisans on our platform.
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #D32F2F; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
        .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #D32F2F; }
        .button { display: inline-block; padding: 12px 24px; background-color: #333; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Declined ❌</h1>
        </div>
        <div class="content">
          <p>Hello ${client.name},</p>
          <p>We're sorry, but your booking request with <strong>${artisan.name}</strong> has been declined at this time.</p>
          
          <div class="details">
            <h3>Request Details:</h3>
            <p><strong>Service:</strong> ${booking.serviceType}</p>
            <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Location:</strong> ${booking.location?.address || 'Not specified'}</p>
          </div>
          
          <p>Don't worry! There are many other talented artisans available. You can find a new professional by visiting our marketplace.</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/explore" class="button">Find Another Artisan</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Artisan Finder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: client.email,
    subject: 'Update on your Booking Request - Artisan Finder',
    message,
    html
  });
};


export const sendBookingCancellation = async (booking, recipient, cancelledBy) => {
  const message = `
    Booking Cancelled
    
    Your booking for ${booking.serviceType} has been cancelled by ${cancelledBy.name}.
    
    Date: ${new Date(booking.date).toLocaleDateString()}
    Location: ${booking.location?.address || 'Not specified'}
    
    If you have any questions, please contact support.
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
        .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #f44336; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Cancelled</h1>
        </div>
        <div class="content">
          <p>Hello ${recipient.name},</p>
          <p>We're writing to inform you that a booking has been cancelled by ${cancelledBy.name}.</p>
          
          <div class="details">
            <h3>Booking Details:</h3>
            <p><strong>Service:</strong> ${booking.serviceType}</p>
            <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${booking.location?.address || 'Not specified'}</p>
          </div>
          
          <p>If you have any questions, please contact our support team.</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/bookings" class="button">View Your Bookings</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Artisan Finder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: recipient.email,
    subject: 'Booking Cancelled - Artisan Finder',
    message,
    html
  });
};
