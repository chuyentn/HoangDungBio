/**
 * Email Service for CRM Integration
 * Recommended Platform: Brevo (formerly Sendinblue)
 * Free Tier: 300 emails/day, unlimited contacts
 */

export const sendEmail = async (payload: { to: string; subject: string; htmlContent: string }) => {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Email Service Error:", error);
    return { success: false, error: "Failed to connect to server" };
  }
};

