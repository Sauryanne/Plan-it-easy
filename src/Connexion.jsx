function Connexion(){
    return (
    <>
      <div style={{display:"flex", alignItems: "center", flexDirection:"column"}}>
        <div>
            <h1 style={{color:"white", backgroundColor:"orange", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px", margin: "20px auto", width: "500px",height:"70px" }}> <em> Connectez-vous ! </em></h1>
        </div>
        <div style={{backgroundColor:"#F5F5DC", borderRadius: "10px", width:"800px", height:"400px",display:"flex", alignItems: "center",justifyContent: "center", margin:"20px auto", flexDirection:"column"}}>
            <p style={{alignItems: "center", margin: "20px "}}>Identifiant ou adresse mail</p>
            <input style={{ width:"400px",alignItems: "center",margin: "20px 10px"}}></input>
            <p style={{ alignItems: "center", margin: "20px"}}>Mot de passe</p>
            <input type="password" style={{width:"400px", alignItems: "center", margin: "20px"}}></input>
            <a src="https://moodle.bordeaux-inp.fr/pluginfile.php/311611/mod_resource/content/2/COG6-SCFCW-cours%203-%20REACT%20-%202026.pdf"><em> Mot de pas oublié ?</em></a>
        </div>
      </div>
    </>
  )
}
export default Connexion