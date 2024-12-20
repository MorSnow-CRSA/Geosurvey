import emailjs from '@emailjs/browser';
const EMAILJS_PUBLIC_KEY = "7M3bDioxSR_OWd6ba";
const EMAILJS_SERVICE_ID = "service_tq5pqgf";
const EMAILJS_TEMPLATE_ID = "template_5y0l3q7";

export const sendEmail = async (to, equipement_name, request_sender, from_date, to_date, subject) =>{


    const templateParams = {
        manager: to,
        to_name: to.split("@")[0].split(".").join(" "),
        equipement_name: equipement_name,
        request_sender: request_sender.split("@")[0].split(".").join(" "),
        from_date: from_date,
        to_date: to_date,
        reply_to: request_sender,
        subject: subject,

    };
    console.log("templateParams", templateParams)

    await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
    );
}

const Email = async (to, equipement_name, request_sender, from_date, to_date) =>{
    console.log("Email", to, equipement_name, request_sender, from_date, to_date)
}

export default Email;