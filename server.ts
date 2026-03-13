import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const MOCK_DASHBOARD_DATA = {
  totalLeads: 156,
  conversionRate: "18.4%",
  activeProjects: 24,
  carbonOffset: "4,250 Tons",
  topProducts: [
    { name: "Wood Pellets", value: 450 },
    { name: "Rice Husk Pellets", value: 320 },
    { name: "Cashew Shell Cake", value: 180 },
    { name: "Corn Cobs", value: 120 }
  ],
  monthlySavings: [
    { month: "Oct", savings: 4200 },
    { month: "Nov", savings: 5100 },
    { month: "Dec", savings: 4800 },
    { month: "Jan", savings: 6200 },
    { month: "Feb", savings: 7500 },
    { month: "Mar", savings: 8800 }
  ],
  leadStatus: [
    { name: "New", value: 45, color: "#3b82f6" },
    { name: "Contacted", value: 30, color: "#f59e0b" },
    { name: "Negotiating", value: 15, color: "#10b981" },
    { name: "Closed", value: 10, color: "#22c55e" }
  ]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API route for leads
  app.post("/api/leads", async (req, res) => {
    const leadData = req.body;
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn("GOOGLE_SHEETS_WEBHOOK_URL is not set. Data will not be sent to Google Sheets.");
      // For demo purposes, we'll just log it and return success
      console.log("Lead Data received:", leadData);
      return res.json({ success: true, message: "Lead received (Demo mode - no webhook set)" });
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...leadData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        res.json({ success: true });
      } else {
        const errorText = await response.text();
        console.error("Webhook error:", errorText);
        res.status(500).json({ success: false, error: "Failed to send data to Google Sheets" });
      }
    } catch (error) {
      console.error("Error sending to webhook:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // API route for comments
  app.post("/api/comments", async (req, res) => {
    const commentData = req.body;
    const webhookUrl = process.env.GOOGLE_SHEETS_COMMENTS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn("GOOGLE_SHEETS_COMMENTS_WEBHOOK_URL is not set. Comment will not be sent to Google Sheets.");
      console.log("Comment Data received:", commentData);
      return res.json({ success: true, message: "Comment received (Demo mode)" });
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...commentData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        res.json({ success: true });
      } else {
        res.status(500).json({ success: false, error: "Failed to send comment to Google Sheets" });
      }
    } catch (error) {
      console.error("Error sending comment to webhook:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // API route to fetch dashboard data
  app.get("/api/dashboard", async (req, res) => {
    console.log("GET /api/dashboard request received");
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    console.log("GOOGLE_SHEETS_WEBHOOK_URL:", webhookUrl);

    const isValidUrl = (url: string | undefined): url is string => {
      if (!url) return false;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (!isValidUrl(webhookUrl)) {
      if (webhookUrl) {
        console.warn(`Invalid GOOGLE_SHEETS_WEBHOOK_URL: "${webhookUrl}". Expected a full URL. Falling back to mock data.`);
      }
      return res.json({ success: true, data: MOCK_DASHBOARD_DATA });
    }

    try {
      // Add a timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(webhookUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        res.json({ success: true, data });
      } else {
        console.warn(`Google Sheets API returned ${response.status}. Falling back to mock data.`);
        res.json({ success: true, data: MOCK_DASHBOARD_DATA });
      }
    } catch (error) {
      console.error("Error fetching from webhook, falling back to mock data:", error);
      res.json({ success: true, data: MOCK_DASHBOARD_DATA });
    }
  });

  // API route for sending emails (Integrated with Brevo)
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, htmlContent } = req.body;
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.warn("BREVO_API_KEY is not set. Email logged to console (Demo mode).");
      console.log("Email to:", to);
      console.log("Subject:", subject);
      return res.json({ success: true, message: "Demo mode: Email logged to server console" });
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: "no-reply@hoangdungbiomass.com", name: "Hoàng Dung Biomass" },
          to: [{ email: to }],
          subject: subject,
          htmlContent: htmlContent,
        }),
      });

      if (response.ok) {
        res.json({ success: true });
      } else {
        const error = await response.json();
        console.error("Brevo API Error:", error);
        res.status(500).json({ success: false, error: error.message || "Failed to send email" });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite in middleware mode...");
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
