const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Route ya kupokea form
app.post('/submit', async (req, res) => {
    const data = req.body;

    // Tengeneza ujumbe mzuri wa kutuma kwa bot
    const message = `
Mpya Aliyejiunga:

Majina: ${data.names}
Kitambulisho: ${data.id_type} - ${data.id_number}
Tarehe ya Kuzaliwa: ${data.birth_day}/${data.birth_month}/${data.birth_year}
Hali ya Ndoa: ${data.marital_status}
Namba ya Dharura: ${data.emergency_contact}

Kozi/Fani: ${data.course}
Kazi aliyofanya: ${data.workplace || 'Hakuna'}
Ana ulemavu: ${data.disability}
${data.disability === 'ndio' ? `Aina ya Ulemavu: ${data.disability_type}` : ''}
Anuani: ${data.address}
Simu: ${data.phone}
Muda wa Kazi: ${data.years_job}
    `;

    try {
        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: process.env.CHAT_ID,
            text: message
        });

        res.status(200).send('Success');
    } catch (error) {
        console.error('Error sending message to Telegram:', error.message);
        res.status(500).send('Error sending data');
    }
});

// Keep server alive kila dakika 5
setInterval(() => {
    console.log('Server iko hai (' + new Date().toLocaleTimeString() + ')');
}, 5 * 60 * 1000);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
