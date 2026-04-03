# 🔗 Supply Chain Tracking using Blockchain

A decentralized application (DApp) for tracking products across the supply chain using **Ethereum Blockchain**, **Smart Contracts (Solidity)**, and a full-stack architecture (**Flask + React**).

---

## 👨‍💻 Authors

- SALHI Siham  
- ESSADIKI Ibtissam  
  
---

## 📌 Overview

This project is a **blockchain-based supply chain tracking system** that allows users to monitor a product from its creation to the final consumer.

It ensures:
- 🔐 Security  
- 🔍 Transparency  
- 📦 Traceability  
- 🧾 Data integrity  

The system uses:
- **Smart Contracts (Solidity)** for data storage  
- **Flask (Backend)** for API communication  
- **React (Frontend)** for user interaction  

---

## 🎯 Objectives

- Track product lifecycle using blockchain  
- Prevent data manipulation  
- Provide transparent product history  
- Build a decentralized application (DApp)  
- Integrate blockchain with web technologies  

---

## 🏗️ Project Structure

```bash
SUPPLY-CHAIN-TRACKING/
│
├── 1_blockchain/
│   ├── contracts/
│   │   └── SupplyChain.sol
│   ├── migrations/
│   │   └── 2_deploy.js
│   ├── build/
│   │   └── SupplyChain.json
│   └── truffle-config.js
│
├── 2_backend/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── 3_frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

## ⛓️ Smart Contract (Solidity)

The system is powered by a **SupplyChain smart contract** deployed on Ethereum.

### 🔑 Data Structures

```solidity
struct Step {
    string description;
    address actor;
    uint256 timestamp;
}

struct Product {
    uint256 id;
    string name;
    address currentOwner;
    address creator;
    Step[] history;
}
```

---

## ⚙️ Core Features

### 1️⃣ Register Product
- Create a new product on blockchain  
- Assign creator and owner  

---

### 2️⃣ Transfer Ownership
- Secure ownership transfer  
- Only current owner can transfer  

---

### 3️⃣ Add Logistics Step
- Add steps (shipping, storage, etc.)  
- Store timestamp and actor  

---

### 4️⃣ Track Product History
- Retrieve full product lifecycle  
- Immutable blockchain data  

---

## 🔌 Backend API (Flask + Web3)

The backend connects the frontend to the blockchain.

---

### ⚙️ Blockchain Connection

```python
w3 = Web3(Web3.HTTPProvider("http://host.docker.internal:7545"))
```

- Connects to **Ganache local blockchain**

---

### 📄 Smart Contract Interaction

```python
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
```

---

### 🌐 API Endpoint

#### 🔍 Get Product History

```http
GET /api/history/<product_id>
```

---

### 📥 Example Request

```
http://localhost:5000/api/history/1
```

---

### 📤 Example Response

```json
{
  "success": true,
  "data": [
    {
      "description": "Creation du produit",
      "actor": "0x123...",
      "timestamp": 1710000000
    }
  ]
}
```

---

## 🔄 Data Flow

1. User requests data from frontend  
2. Flask API receives request  
3. Web3 communicates with blockchain  
4. Smart contract returns data  
5. Flask formats JSON  
6. Frontend displays results  

---

## 🧰 Technologies Used

### 🔗 Blockchain
- Solidity  
- Ethereum  
- Ganache  
- MetaMask  
- Truffle  

### 🖥️ Backend
- Python  
- Flask  
- Web3.py  

### 🌐 Frontend
- React.js  

### ⚙️ DevOps
- Docker  
- Docker Compose  
- Jenkins  

---

## 🚀 Getting Started

### 1️⃣ Start Ganache

Run Ganache to simulate blockchain.

---

### 2️⃣ Deploy Smart Contract

```bash
cd 1_blockchain
truffle migrate
```

---

### 3️⃣ Run Backend

```bash
cd 2_backend
pip install -r requirements.txt
python app.py
```

---

### 4️⃣ Run Frontend

```bash
cd 3_frontend
npm install
npm start
```

---

### 5️⃣ Configure MetaMask

- Connect to Ganache  
- Import account  
- Interact with smart contract  

---

## 🐳 Run with Docker

```bash
docker-compose up --build
```

---

## 🔄 Workflow Example

1. Manufacturer registers product  
2. Ownership is transferred  
3. Logistics steps are added  
4. Customer verifies product history  

---

## 📊 Advantages

- ✔ Transparent system  
- ✔ Immutable data  
- ✔ Decentralized trust  
- ✔ Real-time tracking  

---

## ⚠️ Limitations

- Requires blockchain knowledge  
- Works on local Ganache (not public network)  
- Limited API functionality (read-only)  

---

## 🚀 Future Improvements

- Deploy to public Ethereum network  
- Add write APIs (register / transfer / steps)  
- Add authentication system  
- Improve UI/UX  
- Add QR code tracking  
- Integrate IoT devices  

---

## 📚 References

- Ethereum Documentation  
- Solidity Documentation  
- Truffle Suite  

---
