// const nodemailer = require('nodemailer');



// const sendMail = async(email, subject, content)=>{
 
//     try{

//         const transporter = nodemailer.createTransport({
//             host: process.env.SMTP_HOST,
//             port: process.env.SMTP_PORT,
//             secure:false,
//             requireTLS:true,
//             auth: {
//                 user:process.env.SMTP_MAIL,
//                 pass:process.env.SMTP_PASSWORD
//             }
//         });

//    const  mailOptions = {
//     from:process.env.SMTP_MAIL,
//     to:email,
//     subject: subject,
//     html:content
//    };

//    transporter.sendMail(mailOptions, (error, info )=> {
    
//     if (error){
//         console.log(error);
//     }

//         console.log('Mail sent ', info.messageId);
           
//    });

//     }
//     catch(error){
//         console.log(error);
//         throw new Error("Internal Server Error (nodemailer)")
//     }
// }

// module.exports= {
//     sendMail
// }