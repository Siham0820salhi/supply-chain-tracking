import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

// ⚠️ BDLAY HAD L'ADRESSE B L'ADRESSE LI GHA T3TIK TRUFFLE MN B3D DEPLOIEMENT
const CONTRACT_ADDRESS = "0x6021aaa32E1e8112eD721E4626d976dF1dB3e8de"; 

// ABI kaml (Copiiih hna bach React yfhem ga3 les fonctions)
const CONTRACT_ABI = [
  "function registerProduct(string memory _name) public",
  "function changeOwner(uint256 _id, address _newOwner) public",
  "function addLogisticsStep(uint256 _id, string memory _desc) public",
  "function getProductHistory(uint256 _id) public view returns (tuple(string description, address actor, uint256 timestamp)[])"
];

function App() {
  const [account, setAccount] = useState("");
  const [searchId, setSearchId] = useState("");
  const [history, setHistory] = useState([]);
  
  // States dyal les inputs
  const [productName, setProductName] = useState("");
  const [productIdOwner, setProductIdOwner] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [productIdStep, setProductIdStep] = useState("");
  const [stepDesc, setStepDesc] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
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
    try {
      const contract = getContract();
      const tx = await contract.registerProduct(productName);
      await tx.wait();
      alert("Produit créé avec succès !");
    } catch (e) { alert("Erreur : " + e.message); }
  };

  // 2. Changement de propriétaire
  const changeProductOwner = async () => {
    try {
      const contract = getContract();
      const tx = await contract.changeOwner(productIdOwner, newOwner);
      await tx.wait();
      alert("Propriétaire changé !");
    } catch (e) { alert("Erreur : " + e.message); }
  };

  // 3. Ajout d'étapes logistiques
  const addStep = async () => {
    try {
      const contract = getContract();
      const tx = await contract.addLogisticsStep(productIdStep, stepDesc);
      await tx.wait();
      alert("Étape ajoutée !");
    } catch (e) { alert("Erreur : " + e.message); }
  };

  // 4 & 5. Vérification Publique via Flask
  const checkHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/history/${searchId}`);
      if(res.data.success) {
        setHistory(res.data.data);
      } else {
        alert("Produit introuvable ou erreur");
      }
    } catch (error) {
      alert("Erreur de connexion avec le backend Flask");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: 'auto' }}>
      <h1>📦 Traçabilité de Produits (Supply Chain)</h1>
      
      {/* ESPACE PRIVÉ */}
      <div style={{ border: '2px solid #000', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
        <h2>🔒 Espace Acteurs (Sécurisé par MetaMask)</h2>
        <button onClick={connectWallet} style={{ padding: '10px', background: '#f6851b', color: 'white', border: 'none' }}>
          {account ? `Connecté: ${account.substring(0,6)}...` : "Connecter MetaMask"}
        </button>
        <hr/>
        
        <div>
          <h3>Créer Produit</h3>
          <input placeholder="Nom du produit" onChange={(e) => setProductName(e.target.value)} />
          <button onClick={register} disabled={!account}>Enregistrer</button>
        </div>

        <div>
          <h3>Changer Propriétaire</h3>
          <input placeholder="ID Produit" type="number" onChange={(e) => setProductIdOwner(e.target.value)} />
          <input placeholder="Adresse nouveau proprio" onChange={(e) => setNewOwner(e.target.value)} />
          <button onClick={changeProductOwner} disabled={!account}>Changer</button>
        </div>

        <div>
          <h3>Ajouter Étape Logistique</h3>
          <input placeholder="ID Produit" type="number" onChange={(e) => setProductIdStep(e.target.value)} />
          <input placeholder="Description (ex: Arrivé au port)" onChange={(e) => setStepDesc(e.target.value)} />
          <button onClick={addStep} disabled={!account}>Ajouter</button>
        </div>
      </div>

      {/* ESPACE PUBLIC */}
      <div style={{ border: '2px solid #28a745', padding: '15px', borderRadius: '8px' }}>
        <h2>🌐 Espace Public (Vérification)</h2>
        <input type="number" placeholder="ID du Produit" onChange={(e) => setSearchId(e.target.value)} />
        <button onClick={checkHistory} style={{ background: '#28a745', color: 'white' }}>Vérifier l'Authenticité</button>
        
        <ul>
          {history.map((step, index) => (
            <li key={index}>
              <strong>Action:</strong> {step.description} <br/>
              <strong>Acteur:</strong> {step.actor} <br/>
              <strong>Date:</strong> {new Date(step.timestamp * 1000).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default App;