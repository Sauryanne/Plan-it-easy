import { useState } from 'react';
import Connexion from './Connexion';
import EmploiDuTemps from './EmploiDuTemps';

function App() {
  // Ce state stockera l'utilisateur connecté (null s'il est déconnecté)
  const [utilisateur, setUtilisateur] = useState(null);

  return (
    <div>
      {utilisateur === null ? (
        // 🚪 Si pas connecté : On affiche le formulaire de connexion
        <Connexion onLoginSuccess={(user) => setUtilisateur(user)} />
      ) : (
        // 📅 Si connecté : On lui souhaite la bienvenue et on montre l'emploi du temps
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 30px", backgroundColor: "#2c3e50", color: "white" }}>
            <span>👤 Connecté en tant que : <strong>{utilisateur.email}</strong></span>
            <button 
              onClick={() => setUtilisateur(null)} 
              style={{ padding: "5px 15px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Déconnexion
            </button>
          </div>
          
          <EmploiDuTemps />
        </div>
      )}
    </div>
  );
}

export default App;