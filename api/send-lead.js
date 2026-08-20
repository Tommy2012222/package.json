import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const data = req.body || {}

    const {
      businessName,
      website,
      noWebsite,
      wantsWebsiteQuote,
      businessEmail,
      offer,
      campaignGoal,
      platformPreference,
      targetCustomer,
      fullName,
      phone,
      additionalNotes,
      packageName,
      packagePrice,
      billing,
    } = data

    await resend.emails.send({
      from: "CRE8 Website <hello@cre8media.es>",
      to: "hello@cre8media.es",
      replyTo: businessEmail,
      subject: `New CRE8 lead — ${packageName || "Website enquiry"}`,
      html: `
        <h2>New CRE8 Lead</h2>
        <p><strong>Package:</strong> ${packageName || ""} ${packagePrice || ""} ${billing || ""}</p>
        <p><strong>Business:</strong> ${businessName || ""}</p>
        <p><strong>Website:</strong> ${website || (noWebsite ? "No website" : "")}</p>
        <p><strong>Wants website quote:</strong> ${wantsWebsiteQuote ? "Yes" : "No"}</p>
        <p><strong>Business email:</strong> ${businessEmail || ""}</p>
        <p><strong>Product / service:</strong> ${offer || ""}</p>
        <p><strong>Campaign goal:</strong> ${campaignGoal || ""}</p>
        <p><strong>Platform:</strong> ${platformPreference || ""}</p>
        <p><strong>Target customer:</strong> ${targetCustomer || ""}</p>
        <p><strong>Contact name:</strong> ${fullName || ""}</p>
        <p><strong>Phone:</strong> ${phone || ""}</p>
        <p><strong>Notes:</strong> ${additionalNotes || ""}</p>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Email failed" })
  }
}
