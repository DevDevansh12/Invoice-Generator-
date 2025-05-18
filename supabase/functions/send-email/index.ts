import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createTransport } from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, subject, invoiceNumber, customerName, amount, pdfBuffer } =
      await req.json();

    const transporter = createTransport({
      host: Deno.env.get("SMTP_HOST"),
      port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
      secure: false,
      auth: {
        user: Deno.env.get("SMTP_USER"),
        pass: Deno.env.get("SMTP_PASS"),
      },
    });

    const info = await transporter.sendMail({
      from: Deno.env.get("SMTP_FROM"),
      to,
      subject,
      html: `
        <h2>Invoice #${invoiceNumber}</h2>
        <p>Dear ${customerName},</p>
        <p>Please find attached your invoice for amount ₹${amount.toFixed(
          2
        )}.</p>
        <p>Thank you for your business!</p>
      `,
      attachments: [
        {
          filename: `Invoice_${invoiceNumber}.pdf`,
          content: Buffer.from(pdfBuffer, "base64"),
          contentType: "application/pdf",
        },
      ],
    });

    return new Response(
      JSON.stringify({
        message: "Email sent successfully",
        id: info.messageId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
