import { Resend } from "resend"

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  // Simple browser test
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "CRE8 email endpoint",
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
    })
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({
      error: "RESEND_API_KEY is not available to this deployment",
    })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
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

    const result = await resend.emails.send({
      from: "CRE8 Website <hello@cre8it.media>",
      to: ["hello@cre8it.media"],
      replyTo: businessEmail || "hello@cre8media.es",
      subject: `New CRE8 lead — ${packageName || "Website enquiry"}`,
      html: `
        <h2>New CRE8 Lead</h2>
        <p><strong>Package:</strong> ${packageName || ""} ${packagePrice || ""} ${billing || ""}</p>
        <p><strong>Business:</strong> ${businessName || ""}</p>
        <p><strong>Website:</strong> ${website || (noWebsite ? "No website yet" : "")}</p>
        <p><strong>Wants website quote:</strong> ${wantsWebsiteQuote ? "Yes" : "No"}</p>
        <p><strong>Email:</strong> ${businessEmail || ""}</p>
        <p><strong>Product / Service:</strong> ${offer || ""}</p>
        <p><strong>Campaign Goal:</strong> ${campaignGoal || ""}</p>
        <p><strong>Platform:</strong> ${platformPreference || ""}</p>
        <p><strong>Target Customer:</strong> ${targetCustomer || ""}</p>
        <p><strong>Contact Name:</strong> ${fullName || ""}</p>
        <p><strong>Phone:</strong> ${phone || ""}</p>
        <p><strong>Notes:</strong> ${additionalNotes || ""}</p>
      `,
    })

    return res.status(200).json({
      success: true,
      id: result?.data?.id || null,
    })
  } catch (error) {
    console.error("Resend error:", error)

    return res.status(500).json({
      error: "Email failed",
      message: error?.message || "Unknown error",
    })
  }
}
