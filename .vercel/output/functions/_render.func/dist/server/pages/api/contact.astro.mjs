import nodemailer from 'nodemailer';
export { renderers } from '../../renderers.mjs';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sam171990@gmail.com",
    pass: "fvjl yqma qwcu pcwf"
  }
});
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};
const post = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid email format" }),
        { status: 400, headers: corsHeaders }
      );
    }
    await transporter.sendMail({
      from: `"${name}" <${"sam171990@gmail.com"}>`,
      to: "sam171990@gmail.com",
      subject: `[Portfolio Contact] ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `
    });
    return new Response(
      JSON.stringify({ success: true, message: "Message sent successfully!" }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error sending message",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
const options = () => {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      "Access-Control-Max-Age": "86400"
    }
  });
};
const ALL = async (context) => {
  try {
    if (context.request.method === "OPTIONS") {
      return options(context);
    }
    if (context.request.method === "POST") {
      return post(context);
    }
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  default: ALL,
  options,
  post
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
