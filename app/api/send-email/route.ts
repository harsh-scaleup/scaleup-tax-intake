import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const emailHtml = `
      <h2>New Tax Intake Submission</h2>

      <h3>Contact</h3>
      <p><strong>Name:</strong> ${body.fullName || ""}</p>
      <p><strong>Email:</strong> ${body.email || ""}</p>
      <p><strong>Phone:</strong> ${body.phone || ""}</p>
      <p><strong>Filing for:</strong> ${body.filingFor || ""}</p>
      <p><strong>Province:</strong> ${body.province || ""}</p>
      <p><strong>First-time client:</strong> ${body.clientType || ""}</p>
      <p><strong>Filed last year:</strong> ${body.filedLastYear || ""}</p>

      <h3>Income Types</h3>
      <ul>${(body.incomeTypes || []).map((x: string) => `<li>${x}</li>`).join("")}</ul>

      <h3>Credits / Deductions</h3>
      <ul>${(body.credits || []).map((x: string) => `<li>${x}</li>`).join("")}</ul>

      <h3>Special Situations</h3>
      <ul>${(body.specialSituations || []).map((x: string) => `<li>${x}</li>`).join("")}</ul>

      <h3>Notes</h3>
      <p>${body.notes || "None"}</p>

      <h3>Routing</h3>
      <p><strong>Status:</strong> ${body.manualReview ? "Manual review required" : "Calendly shown"}</p>

      <h3>Document Checklist</h3>
      <ul>${(body.checklist || []).map((x: string) => `<li>${x}</li>`).join("")}</ul>
    `;

    await resend.emails.send({
      from: "ScaleUp Accounting <tax@scaleupaccounting.net>",
      to: ["harsh@scaleupaccounting.net"],
      subject: `New Tax Intake - ${body.fullName || "New Client"}`,
      html: emailHtml,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Email send failed:", error);
    return Response.json({ success: false, error: "Email failed" }, { status: 500 });
  }
}