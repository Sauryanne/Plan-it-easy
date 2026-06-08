import { useState } from 'react';

function EmploiDuTemps() {
  const [urlIcal, setUrlIcal] = useState("");
  const [listeCours, setListeCours] = useState([]);

  // Fonction qui va envoyer l'URL à ton serveur Node.js
  const chargerAgenda = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlIcal: urlIcal })
      });
      const data = await response.json();
      setListeCours(data); // On stocke les cours reçus dans le State
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Affiche ton emploi du temps ADE</h2>
      
      {/* Zone de saisie du lien iCal */}
      <div style={{ marginBottom: "20px" }}>
        <input 
          type="text" 
          placeholder="Colle ton lien iCal / .ics ici"
          value={urlIcal}
          onChange={(e) => setUrlIcal(e.target.value)}
          style={{ width: "400px", padding: "10px", marginRight: "10px" }}
        />
        <button onClick={chargerAgenda} style={{ padding: "10px", backgroundColor: "orange", color: "white", border: "none", cursor: "pointer" }}>
          Charger l'agenda
        </button>
      </div>

      {/* Affichage des cours sous forme de liste/boîtes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {listeCours.map((cours, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
            <strong style={{ color: "orange" }}>{cours.titre}</strong>
            <p style={{ margin: "5px 0" }}>📍 Salle : {cours.salle}</p>
            <small>📅 Du {new Date(cours.debut).toLocaleString()} au {new Date(cours.fin).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmploiDuTemps;