import nodemailer, { type Transporter } from "nodemailer";

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

// Where contact-form notifications are delivered
const TO = process.env.CONTACT_TO_EMAIL || "rythm.meta@gmail.com";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

let transport: Transporter | null = null;

// SMTP settings come from env. For Gmail use an App Password, not the account password:
// SMTP_USER=you@gmail.com  SMTP_PASS=<16-char app password>
function getTransport(): Transporter | null {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;

  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 465);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return transport;
}

export async function sendContactEmail(msg: ContactMessage): Promise<boolean> {
  const t = getTransport();
  if (!t) {
    console.warn("SMTP_USER / SMTP_PASS not set — skipping contact email");
    return false;
  }

  try {
    await t.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: TO,
      // Hitting "Reply" in the inbox answers the visitor directly
      replyTo: { name: msg.name, address: msg.email },
      subject: `New message from ${msg.name} via your portfolio`,
      text: `Name: ${msg.name}\nEmail: ${msg.email}\n\n${msg.message}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;color:#141413">
          <p style="color:#C6613F;font-size:12px;letter-spacing:.15em;text-transform:uppercase;margin:0 0 8px">New portfolio message</p>
          <h2 style="font-weight:normal;margin:0 0 4px">${escapeHtml(msg.name)}</h2>
          <p style="margin:0 0 20px"><a href="mailto:${escapeHtml(msg.email)}" style="color:#C6613F">${escapeHtml(msg.email)}</a></p>
          <div style="white-space:pre-wrap;background:#FAF9F5;border:1px solid #E8E6DC;border-radius:12px;padding:16px;line-height:1.6">${escapeHtml(msg.message)}</div>
        </div>`,
    });
    return true;
  } catch (err) {
    console.error("Failed sending contact email:", err);
    return false;
  }
}
