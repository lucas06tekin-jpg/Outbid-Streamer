import { Resend } from "resend";
import { formatOre } from "./format";

export async function sendReceiptEmail(params: {
  to: string;
  streamerName: string;
  totalOre: number;
  exVatOre: number;
  vatOre: number;
  vatNumber?: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RECEIPT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      "RESEND_API_KEY/RECEIPT_FROM_EMAIL missing - skipping receipt email."
    );
    return;
  }

  const resend = new Resend(apiKey);
  const reverseCharge = Boolean(params.vatNumber);

  await resend.emails.send({
    from,
    to: params.to,
    subject: `Receipt - ${params.streamerName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Receipt</h2>
        <p>Thanks for your bid on <strong>${params.streamerName}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 4px 0;">Amount excl. VAT</td>
            <td style="padding: 4px 0; text-align: right;">${formatOre(params.exVatOre)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">VAT (25%)${reverseCharge ? " - reverse charge" : ""}</td>
            <td style="padding: 4px 0; text-align: right;">${
              reverseCharge ? "0 kr" : formatOre(params.vatOre)
            }</td>
          </tr>
          <tr style="font-weight: 600; border-top: 1px solid #ddd;">
            <td style="padding: 4px 0;">Total</td>
            <td style="padding: 4px 0; text-align: right;">${formatOre(params.totalOre)}</td>
          </tr>
        </table>
        ${
          reverseCharge
            ? `<p style="font-size: 12px; color: #666; margin-top: 12px;">VAT number: ${params.vatNumber}. Reverse charge under EU B2B sales rules may apply - contact your accountant regarding OSS handling if needed.</p>`
            : ""
        }
      </div>
    `,
  });
}
