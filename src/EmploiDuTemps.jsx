import { useState } from 'react';

function EmploiDuTemps() {
  const [urlIcal, setUrlIcal] = useState("");
  const [listeCours, setListeCours] = useState([]); 

  const chargerAgenda = async () => {
    if (!urlIcal.trim()) {
      alert("Oups ! Tu as oublié de coller ton lien iCal.");
      return;
    }
    try {
      const response = await fetch('http://localhost:5001/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlIcal: urlIcal })
      });
      const data = await response.json();
      setListeCours(data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  };

  // 1. Mise à jour : On ajoute Samedi et Dimanche 📅
  const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const heures = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

  // Helper pour trouver à quelle colonne et ligne correspond un cours
  const positionnerCours = (cours) => {
    const debut = new Date(cours.debut);
    const fin = new Date(cours.fin);

    let indexJour = debut.getDay(); // 0 = Dimanche, 1 = Lundi, 2 = Mardi...
    
    // 🛠️ PETIT AJUSTEMENT : En JavaScript, le Dimanche vaut 0.
    // On veut que le lundi soit en colonne 2, et le dimanche en dernière colonne (colonne 8).
    let colStart;
    if (indexJour === 0) {
      colStart = 8; // Le dimanche va à la 8ème colonne de la grille (7ème jour + 1 colonne heures)
    } else {
      colStart = indexJour + 1; // Décale de +1 pour laisser la colonne 1 aux heures de gauche
    }

    // Calcul du positionnement en heures (Grid Row)
    const heureDebutDecimale = debut.getHours() + debut.getMinutes() / 60;
    const heureFinDecimale = fin.getHours() + fin.getMinutes() / 60;

    // Notre grille commence à 8h00. Donc 8h = ligne 2.
    const rowStart = Math.round((heureDebutDecimale - 8) * 60) + 2;
    const rowEnd = Math.round((heureFinDecimale - 8) * 60) + 2;

    return { gridRow: `${rowStart} / ${rowEnd}`, gridColumn: colStart };
  };

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1400px", margin: "0 auto" }}>
      
      <h2 style={{ color: "#2c3e50", textAlign: "center", marginBottom: "20px" }}> Mon Planning Hebdomadaire</h2>
      
      {/* Barre de recherche */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
        <input 
          type="text" 
          placeholder="Lien iCal ..."
          value={urlIcal}
          onChange={(e) => setUrlIcal(e.target.value)}
          style={{ width: "50%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button onClick={chargerAgenda} style={{ padding: "10px 20px", backgroundColor: "orange", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
          Synchroniser
        </button>
      </div>

      {/* 🗓️ LE TABLEAU MAÎTRE ÉTENDU */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "80px repeat(7, 1fr)", // 🛠️ Modifié : 7 colonnes pour les 7 jours de la semaine
        gridTemplateRows: "40px repeat(660, 1px)", // 1 ligne par minute de 8h à 19h
        backgroundColor: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
      }}>
        
        {/* Coin supérieur gauche vide */}
        <div style={{ gridRow: "1", gridColumn: "1", backgroundColor: "#f4f6f7", borderBottom: "2px solid #ddd" }}></div>

        {/* EN-TÊTES : Les 7 jours de la semaine (Haut) */}
        {joursSemaine.map((jour, i) => (
          <div key={i} style={{ 
            gridRow: "1", 
            gridColumn: i + 2, 
            backgroundColor: "#f4f6f7", 
            color: "#34495e",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "2px solid #ddd",
            borderLeft: "1px solid #e0e0e0"
          }}>
            {jour}
          </div>
        ))}

        {/* AXE GAUCHE : Les heures et lignes de fond */}
        {heures.map((heure, i) => {
          const rowPosition = (i * 60) + 2;
          return (
            <div key={i} style={{ 
              gridRow: `${rowPosition} / ${rowPosition + 60}`, 
              gridColumn: "1 / 9", // 🛠️ Modifié : S'étire jusqu'à la colonne 9 pour couvrir les 7 jours + l'axe des heures
              borderTop: "1px dashed #e8e8e8",
              position: "relative",
              pointerEvents: "none"
            }}>
              {/* Le texte de l'heure à gauche */}
              <span style={{ 
                position: "absolute", 
                top: "-10px", 
                left: "10px", 
                fontSize: "12px", 
                color: "#7f8c8d",
                fontWeight: "bold",
                backgroundColor: "#fff",
                padding: "0 5px"
              }}>
                {heure}
              </span>
            </div>
          );
        })}

        {/* 🚀 INJECTION DES COURS SUR LA GRILLE */}
        {listeCours.map((cours, index) => {
          const stylePlacement = positionnerCours(cours);
          if (!stylePlacement) return null; 

          const heureDebut = new Date(cours.debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          const heureFin = new Date(cours.fin).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={index} style={{ 
              ...stylePlacement,
              backgroundColor: "rgba(255, 165, 0, 0.15)", 
              borderLeft: "4px solid orange",
              margin: "2px",
              padding: "8px",
              borderRadius: "4px",
              fontSize: "12px",
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              zIndex: 2
            }}>
              <span style={{ fontWeight: "bold", color: "#d35400", display: "block", marginBottom: "2px" }}>
                {heureDebut} - {heureFin}
              </span>
              <strong style={{ color: "#2c3e50", display: "block" }}>{cours.titre}</strong>
              <span style={{ color: "#7f8c8d", display: "block", marginTop: "2px" }}>📍 {cours.salle}</span>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default EmploiDuTemps;