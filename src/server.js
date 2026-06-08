import express from 'express';
import cors from 'cors';
import axios from 'axios';
import ical from 'node-ical';

const app = express();
app.use(cors()); 
app.use(express.json());

app.post('/api/agenda', async (req, res) => {
    const { urlIcal } = req.body; 

    if (!urlIcal) {
        return res.status(400).json({ error: "L'URL iCal est requise" });
    }

    try {
        const response = await axios.get(urlIcal);
        const data = ical.parseICS(response.data);
        
        const cours = Object.values(data).filter(event => event.type === 'VEVENT').map(event => ({
            titre: event.summary,
            debut: event.start,
            fin: event.end,
            salle: event.location || "Non spécifiée"
        }));

        res.json(cours);

    } catch (err) {
        res.status(500).json({ error: "Impossible de récupérer ou lire l'iCal" });
    }
});

app.listen(5001, () => console.log("Serveur démarré sur le port 5001"));