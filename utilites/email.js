import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aniruddha.212074101@vcet.edu.in',
      pass: 'aniruddha1234',
    },
  });

export default transporter;