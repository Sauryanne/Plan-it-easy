import express from 'express';
import cors from 'cors';
import axios from 'axios';
import ical from 'node-ical';
import fs from 'fs';       // Outil pour lire/écrire des fichiers
import bcrypt from 'bcrypt'; // Outil pour crypter les mots de passe

const app = express();
app.use(cors()); 
app.use(express.json());

const FICHIER_USER = './utilisateurs.json';

// --- FONCTIONS UTILS POUR NOTRE "BASE DE DONNÉES" JSON ---
const lireUtilisateurs = () => {
    if (!fs.existsSync(FICHIER_USER)) return [];
    const donnees = fs.readFileSync(FICHIER_USER);
    return JSON.parse(donnees);
};

const sauvegarderUtilisateurs = (utilisateurs) => {
    fs.writeFileSync(FICHIER_USER, JSON.stringify(utilisateurs, null, 2));
};


// 🔐 1. ROUTE D'INSCRIPTION
app.post('/api/inscription', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const utilisateurs = lireUtilisateurs();

    // Vérifier si l'utilisateur existe déjà
    const userExiste = utilisateurs.find(u => u.email === email);
    if (userExiste) {
        return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    try {
        // Hachage (cryptage) du mot de passe - sécurité maximale !
        const hashedPassword = await bcrypt.hash(password, 10);

        // On crée le nouvel utilisateur
        const nouvelUtilisateur = { email, password: hashedPassword };
        utilisateurs.push(nouvelUtilisateur);
        
        // On enregistre dans notre fichier JSON
        sauvegarderUtilisateurs(utilisateurs);

        res.status(201).json({ message: "Compte créé avec succès !" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'inscription." });
    }
});


// 🔑 2. ROUTE DE CONNEXION
app.post('/api/connexion', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const utilisateurs = lireUtilisateurs();

    // Chercher l'utilisateur par son email
    const utilisateur = utilisateurs.find(u => u.email === email);
    if (!utilisateur) {
        return res.status(400).json({ error: "Identifiants incorrects." });
    }

    try {
        // Comparer le mot de passe tapé avec le mot de passe haché stocké
        const motDePasseValide = await bcrypt.compare(password, utilisateur.password);
        
        if (!motDePasseValide) {
            return res.status(400).json({ error: "Identifiants incorrects." });
        }

        // Si tout est bon, on valide la connexion
        res.json({ message: "Connexion réussie !", user: { email: utilisateur.email } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la connexion." });
    }
});


// 📅 3. TON ANCIENNE ROUTE ICAL (Reste inchangée)
app.post('/api/agenda', async (req, res) => {
    const { urlIcal } = req.body; 
    if (!urlIcal) return res.status(400).json({ error: "L'URL iCal est requise" });

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
        console.error(err);
        res.status(500).json({ error: "Impossible de récupérer ou lire l'iCal" });
    }
});

app.listen(5001, () => console.log("Serveur démarré sur le port 5001"));