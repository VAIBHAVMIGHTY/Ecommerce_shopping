import nodemailer from 'nodemailer'
export const sendEmail=async(options)=>{
 const EmailTransport = nodemailer.createTransport({service:process.env.SMTP_SERVICE,auth:{user:process.env.SMTP_EMAIL,pass:process.env.SMTP_PASSWORD}});
 const mailOptions={from:process.env.SMTP_EMAIL,to:options.email,subject:options.subject,text:options.message};
 await EmailTransport.sendMail(mailOptions);
}