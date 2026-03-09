from flask import Flask, jsonify, request
from flask_cors import CORS
from web3 import Web3
import json

app = Flask(__name__)
CORS(app) # Bach nsm7ou l React yhder m3a Flask

# Connexion m3a Ganache
w3 = Web3(Web3.HTTPProvider("http://host.docker.internal:7545"))

# Khassk tjib l'ABI dyal l'contract mn (1_blockchain/build/contracts/SupplyChain.json)
# L'ABI howa l'carte dyal l'contract. Hna drt lik mital sghir dyal function getProductHistory:
CONTRACT_ABI = json.loads('[{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getProductHistory","outputs":[{"components":[{"internalType":"string","name":"description","type":"string"},{"internalType":"address","name":"actor","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct SupplyChain.Step[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"}]')

CONTRACT_ADDRESS = "0x6021aaa32E1e8112eD721E4626d976dF1dB3e8de" # Ex: 0x123...
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

@app.route('/api/history/<int:product_id>', methods=['GET'])
def get_history(product_id):
    try:
        # Flask kyjib l'historique mn l'Blockchain Ganache
        history = contract.functions.getProductHistory(product_id).call()
        
        # Formattage dyal data bach yfhmha React
        formatted_history = []
        for step in history:
            formatted_history.append({
                "description": step[0],
                "actor": step[1],
                "timestamp": step[2]
            })
        return jsonify({"success": True, "data": formatted_history})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)