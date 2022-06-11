import { createTestAccount, createTransport } from "nodemailer";
import nodemailerConfig from "./nodemailerConfig";

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await createTestAccount();

  const transporter = createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"Bouba" <amamahir2@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

export default sendEmail;
