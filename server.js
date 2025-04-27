const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

// Telegram credentials
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Kuamsha server kila baada ya dakika 5
setInterval(() => {
  fetch(process.env.BASE_URL || 'http://localhost:3000/')
    .then(res => console.log('Server is active'))
    .catch(err => console.error('Error keeping alive:', err));
}, 300000);

// Routes
app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.post('/submit', async (req, res) => {
    try {
        const formData = req.body;
        const message = `
    📄 Maombi Mapya:
    Majina: ${formData.names}
    Kitambulisho: ${formData.id_type} - ${formData.id_number}
    Tarehe ya Kuzaliwa: ${formData.birth_day}/${formData.birth_month}/${formData.birth_year}
    Hali ya Ndoa: ${formData.marital_status}
    Dharura: ${formData.emergency_contact}
    Kozi/Fani: ${formData.course}
    Uzoefu wa kazi: ${formData.workplace}
    Ulemavu: ${formData.disability} ${formData.disability_type ? `- ${formData.disability_type}` : ''}
    Anuani: ${formData.address}
    Simu: ${formData.phone}
    Muda wa kazi: ${formData.years_job}
        `;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });

        res.status(200).json({ success: true, message: 'Umetuma vizuri!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Kuna tatizo kwenye kutuma.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
