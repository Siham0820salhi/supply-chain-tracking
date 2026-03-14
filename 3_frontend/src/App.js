import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

// L'ADRESSE DYALK (Makt9issihach)
const CONTRACT_ADDRESS = "0x7AFed960D340e82754E90d13eFe7a75963390214"; 

// ABI Jdid (Zdna fih productCount w products bach njibou l'ID w l'catalogue)
const CONTRACT_ABI = [
  "function registerProduct(string memory _name) public",
  "function changeOwner(uint256 _id, address _newOwner) public",
  "function addLogisticsStep(uint256 _id, string memory _desc) public",
  "function getProductHistory(uint256 _id) public view returns (tuple(string description, address actor, uint256 timestamp)[])",
  "function productCount() public view returns (uint256)",
  "function products(uint256) public view returns (uint256 id, string name, address currentOwner, address creator)"
];

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("public"); 

  const [account, setAccount] = useState("");
  const [searchId, setSearchId] = useState("");
  const [history, setHistory] = useState([]);
  
  // Catalogue State
  const [allProducts, setAllProducts] = useState([]);
  
  const [productName, setProductName] = useState("");
  const [productIdOwner, setProductIdOwner] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [productIdStep, setProductIdStep] = useState("");
  const [stepDesc, setStepDesc] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        alert("Connexion annulée ou MetaMask bloqué.");
      }
    } else {
      alert("Svp installez MetaMask !");
    }
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  };

  // 1. Enregistrement d'un produit
  const register = async () => {
    if(!productName) return alert("Veuillez entrer un nom.");
    try {
      const contract = getContract();
      const tx = await contract.registerProduct(productName);
      await tx.wait(); // Kantsnnaw blockchain tvalider
      
      // Kanjibou l'ID jdid
      const newId = await contract.productCount();
      
      alert(`Transaction validée !\n\nProduit enregistré avec succès.\nL'identifiant (ID) de votre produit est : ${newId.toString()}`);
      setProductName("");
      fetchAllProducts(); // Kan-actualisiw l'catalogue otho-matiquement
    } catch (e) { alert("Erreur : " + e.message); }
  };

  // 2. Changement de propriétaire
  const changeProductOwner = async () => {
    if(!productIdOwner || !newOwner) return alert("Veuillez remplir tous les champs.");
    try {
      const contract = getContract();
      const tx = await contract.changeOwner(productIdOwner, newOwner);
      await tx.wait();
      alert("Transaction validée : Propriétaire modifié.");
      setProductIdOwner(""); setNewOwner("");
      fetchAllProducts();
    } catch (e) { alert("Erreur de transaction : Vérifiez que vous êtes le propriétaire actuel."); }
  };

  // 3. Ajout d'étape
  const addStep = async () => {
    if(!productIdStep || !stepDesc) return alert("Veuillez remplir tous les champs.");
    try {
      const contract = getContract();
      const tx = await contract.addLogisticsStep(productIdStep, stepDesc);
      await tx.wait();
      alert("Transaction validée : Étape logistique ajoutée.");
      setProductIdStep(""); setStepDesc("");
    } catch (e) { alert("Erreur de transaction : Vérifiez que vous êtes le propriétaire actuel."); }
  };

  // 4. Vérification Publique
  const checkHistory = async () => {
    if(!searchId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/history/${searchId}`);
      if(res.data.success && res.data.data.length > 0) {
        setHistory(res.data.data);
      } else {
        setHistory([]);
        alert("Aucun historique trouvé pour cet identifiant.");
      }
    } catch (error) {
      alert("Erreur de connexion avec le serveur.");
    }
  };

  // 5. Fonction bach njibou l'Catalogue kaml mn l'Blockchain
  const fetchAllProducts = async () => {
    if(!window.ethereum) return;
    try {
      const contract = getContract();
      const count = await contract.productCount();
      let tempList = [];
      for (let i = 1; i <= count; i++) {
        const prod = await contract.products(i);
        tempList.push({
          id: prod.id.toString(),
          name: prod.name,
          owner: prod.currentOwner
        });
      }
      setAllProducts(tempList);
    } catch (e) {
      console.log("Erreur chargement catalogue:", e);
    }
  };

  // Njibou l'catalogue mli n7ellou l'Espace Acteur
  useEffect(() => {
    if(activeTab === "actor" && account) {
      fetchAllProducts();
    }
  }, [activeTab, account]);

  return (
    <div style={{ fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* HEADER PROFESSIONNEL */}
      <header style={{ backgroundColor: '#0f1f2c', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#2196F3', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>B</div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '600', letterSpacing: '0.5px' }}>BlockTrack Logistics</h2>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setActiveTab("public")}
            style={tabBtnStyle(activeTab === "public")}
          >
            Portail Public
          </button>
          <button 
            onClick={() => setActiveTab("actor")}
            style={tabBtnStyle(activeTab === "actor")}
          >
            Espace Opérateur
          </button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main style={{ maxWidth: '1050px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* ===================== PORTAIL PUBLIC ===================== */}
        {activeTab === "public" && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h1 style={{ color: '#0f1f2c', fontSize: '32px', marginBottom: '12px' }}>Vérification d'Authenticité</h1>
              <p style={{ color: '#607d8b', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
                Entrez l'identifiant du produit pour consulter son historique immuable enregistré sur la blockchain.
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
              <input 
                type="number" 
                placeholder="Identifiant du produit (ex: 1)" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)} 
                style={{...inputStyle, width: '300px'}}
              />
              <button onClick={checkHistory} style={{...primaryBtnStyle, backgroundColor: '#10b981'}}>
                Tracer le produit
              </button>
            </div>

            {history.length > 0 && (
              <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 30px 0', color: '#0f1f2c', fontSize: '20px', borderBottom: '1px solid #eeeeee', paddingBottom: '15px' }}>
                  Historique de la Blockchain (ID: {searchId})
                </h3>
                
                <div style={{ position: 'relative', paddingLeft: '20px' }}>
                  {history.map((step, index) => (
                    <div key={index} style={{ position: 'relative', paddingBottom: index !== history.length - 1 ? '40px' : '10px' }}>
                      {index !== history.length - 1 && (
                        <div style={{ position: 'absolute', left: '-5px', top: '24px', bottom: '0', width: '2px', backgroundColor: '#e0e0e0' }}></div>
                      )}
                      <div style={{ position: 'absolute', left: '-9px', top: '5px', width: '10px', height: '10px', backgroundColor: '#2196F3', borderRadius: '50%', border: '3px solid #ffffff', boxShadow: '0 0 0 1px #2196F3' }}></div>
                      
                      <div style={{ paddingLeft: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0, color: '#0f1f2c', fontSize: '18px', fontWeight: '600' }}>{step.description}</h4>
                          <span style={{ fontSize: '13px', color: '#78909c', fontWeight: '500' }}>
                            {new Date(step.timestamp * 1000).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
                          </span>
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#f4f7f6', padding: '6px 12px', borderRadius: '4px', border: '1px solid #eceff1' }}>
                          <span style={{ fontSize: '12px', color: '#607d8b', marginRight: '8px' }}>Acteur :</span>
                          <span style={{ fontFamily: 'monospace', color: '#2196F3', fontSize: '13px' }}>{step.actor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== ESPACE OPÉRATEUR ===================== */}
        {activeTab === "actor" && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
              <div>
                <h1 style={{ color: '#0f1f2c', margin: '0 0 8px 0', fontSize: '28px' }}>Tableau de bord logistique</h1>
                <p style={{ margin: 0, color: '#607d8b', fontSize: '15px' }}>Administration sécurisée par contrat intelligent.</p>
              </div>
              <button onClick={connectWallet} style={{...primaryBtnStyle, backgroundColor: account ? '#10b981' : '#0f1f2c'}}>
                {account ? `Connecté: ${account.substring(0,6)}...${account.substring(38)}` : "Connecter MetaMask"}
              </button>
            </div>

            {!account ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px dashed #cfd8dc' }}>
                <div style={{ width: '48px', height: '48px', margin: '0 auto 20px auto', borderRadius: '50%', border: '2px solid #90a4ae', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#90a4ae', fontSize: '20px' }}>!</div>
                <h2 style={{ color: '#263238', fontSize: '20px', marginBottom: '10px' }}>Accès Restreint</h2>
                <p style={{ color: '#78909c', maxWidth: '500px', margin: '0 auto' }}>Veuillez connecter votre portefeuille MetaMask pour accéder aux fonctionnalités d'écriture sur la blockchain.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' }}>
                  
                  {/* Module 1: Créer */}
                  <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                      <h3 style={cardTitleStyle}>Créer un Produit</h3>
                    </div>
                    <div style={cardBodyStyle}>
                      <label style={labelStyle}>Nom du produit</label>
                      <input placeholder="Ex: Ordinateur Dell" value={productName} onChange={(e) => setProductName(e.target.value)} style={inputStyle} />
                      <button onClick={register} style={{...actionBtnStyle, backgroundColor: '#2196F3', color: 'white', marginTop: 'auto'}}>Enregistrer</button>
                    </div>
                  </div>

                  {/* Module 2: Etape */}
                  <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                      <h3 style={cardTitleStyle}>Ajouter une Étape</h3>
                    </div>
                    <div style={cardBodyStyle}>
                      <label style={labelStyle}>ID du Produit</label>
                      <input placeholder="Ex: 1" type="number" value={productIdStep} onChange={(e) => setProductIdStep(e.target.value)} style={inputStyle} />
                      <label style={labelStyle}>Description de l'étape</label>
                      <input placeholder="Ex: Arrivé à la douane" value={stepDesc} onChange={(e) => setStepDesc(e.target.value)} style={inputStyle} />
                      <button onClick={addStep} style={{...actionBtnStyle, backgroundColor: '#2196F3', color: 'white', marginTop: 'auto'}}>Ajouter l'étape</button>
                    </div>
                  </div>

                  {/* Module 3: Propriété */}
                  <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                      <h3 style={cardTitleStyle}>Transférer la Propriété</h3>
                    </div>
                    <div style={cardBodyStyle}>
                      <label style={labelStyle}>ID du Produit</label>
                      <input placeholder="Ex: 1" type="number" value={productIdOwner} onChange={(e) => setProductIdOwner(e.target.value)} style={inputStyle} />
                      <label style={labelStyle}>Adresse du nouveau propriétaire</label>
                      <input placeholder="Ex: 0x123abc..." value={newOwner} onChange={(e) => setNewOwner(e.target.value)} style={inputStyle} />
                      <button onClick={changeProductOwner} style={{...actionBtnStyle, backgroundColor: '#8b5cf6', color: 'white', marginTop: 'auto'}}>Valider le transfert</button>
                    </div>
                  </div>
                </div>

                {/* MODULE 4: CATALOGUE (Jadwal dyal les ID) */}
                <div style={{...cardStyle, marginTop: '30px'}}>
                  <div style={{...cardHeaderStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 style={cardTitleStyle}>Catalogue des Produits Enregistrés</h3>
                    <button onClick={fetchAllProducts} style={{backgroundColor: 'transparent', border: '1px solid #cfd8dc', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', color: '#607d8b'}}>
                      Actualiser la liste
                    </button>
                  </div>
                  <div style={{padding: '20px', overflowX: 'auto'}}>
                    {allProducts.length === 0 ? (
                      <p style={{color: '#607d8b', fontSize: '14px', textAlign: 'center'}}>Aucun produit trouvé sur la blockchain.</p>
                    ) : (
                      <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px'}}>
                        <thead>
                          <tr style={{borderBottom: '2px solid #e0e0e0', color: '#0f1f2c'}}>
                            <th style={{padding: '12px', width: '10%'}}>ID</th>
                            <th style={{padding: '12px', width: '30%'}}>Nom du Produit</th>
                            <th style={{padding: '12px', width: '60%'}}>Adresse Propriétaire Actuel</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allProducts.map((p, index) => (
                            <tr key={index} style={{borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'}}>
                              <td style={{padding: '12px', fontWeight: 'bold', color: '#2196F3'}}>#{p.id}</td>
                              <td style={{padding: '12px', color: '#263238', fontWeight: '500'}}>{p.name}</td>
                              <td style={{padding: '12px', fontFamily: 'monospace', color: '#607d8b'}}>{p.owner}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ----- CSS STYLES PROFESSIONNELS -----
const tabBtnStyle = (isActive) => ({
  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
  color: isActive ? '#ffffff' : '#90a4ae',
  border: '1px solid',
  borderColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
  padding: '8px 18px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.2s ease'
});

const primaryBtnStyle = {
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '4px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

const actionBtnStyle = {
  border: 'none',
  padding: '12px',
  width: '100%',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const inputStyle = {
  padding: '12px 15px',
  border: '1px solid #cfd8dc',
  borderRadius: '4px',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#fbfcfc',
  marginBottom: '15px'
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: '#607d8b',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '6px',
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const cardHeaderStyle = {
  backgroundColor: '#f8faf9',
  padding: '18px 20px',
  borderBottom: '1px solid #eeeeee'
};

const cardBodyStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1
};

const cardTitleStyle = {
  margin: 0,
  fontSize: '16px',
  color: '#263238',
  fontWeight: '600'
};

export default App;