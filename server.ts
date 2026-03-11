import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

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
        console.warn(`Invalid GOOGLE_SHEETS_WEBHOOK_URL: "${webhookUrl}". Expected a full URL (e.g. Google Apps Script). Falling back to mock data.`);
      }
      // Fallback mock data for demo
      return res.json({
        success: true,
        data: {
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
        }
      });
    }

    try {
      const response = await fetch(webhookUrl);
      if (response.ok) {
        const data = await response.json();
        res.json({ success: true, data });
      } else {
        res.status(500).json({ success: false, error: "Failed to fetch data from Google Sheets" });
      }
    } catch (error) {
      console.error("Error fetching from webhook:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
