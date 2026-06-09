import { useState } from 'react';

function Connexion({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [estInscription, setEstInscription] = useState(false); // Permet de basculer entre login et inscription
  const [message, setMessage] = useState("");

  const soumettreFormulaire = async (e) => {
    e.preventDefault(); // Empêche la page de se recharger
    setMessage("");

    if (!email || !password) return alert("Remplis tous les champs !");

    // On choisit la bonne route selon le mode choisi
    const urlDestination = estInscription 
      ? 'http://localhost:5001/api/inscription' 
      : 'http://localhost:5001/api/connexion';

    try {
      const response = await fetch(urlDestination, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (estInscription) {
          setMessage("🎉 Compte créé ! Tu peux maintenant te connecter.");
          setEstInscription(false); // Bascule automatiquement sur l'écran connexion
          setPassword("");
        } else {
          // Connexion réussie ! On prévient le composant parent App.jsx
          onLoginSuccess(data.user);
        }
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Impossible de joindre le serveur.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "30px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", fontFamily: "'Segoe UI', sans-serif" }}>
      
      <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: "20px" }}>
        {estInscription ? "Créer un compte" : "Se connecter"}
      </h2>

      {message && <p style={{ textAlign: "center", fontWeight: "bold", color: message.startsWith('🎉') ? "green" : "red" }}>{message}</p>}

      <form onSubmit={soumettreFormulaire} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input 
          type="email" 
          placeholder="Ton adresse email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "14px" }}
        />
        <input 
          type="password" 
          placeholder="Ton mot de passe" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "14px" }}
        />
        <button type="submit" style={{ padding: "12px", backgroundColor: "orange", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
          {estInscription ? "S'inscrire" : "Se connecter"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#555" }}>
        {estInscription ? "Déjà un compte ?" : "Nouveau sur Plan It Easy ?"} 
        <span 
          onClick={() => { setEstInscription(!estInscription); setMessage(""); }} 
          style={{ color: "orange", cursor: "pointer", fontWeight: "bold", marginLeft: "5px" }}
        >
          {estInscription ? "Se connecter" : "Créer un compte"}
        </span>
      </p>

    </div>
  );
}

export default Connexion;