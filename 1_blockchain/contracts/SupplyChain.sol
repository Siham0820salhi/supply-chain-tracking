// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
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

    mapping(uint256 => Product) public products;
    uint256 public productCount = 0;

    modifier onlyOwner(uint256 _id) {
        require(products[_id].currentOwner == msg.sender, "Erreur: Vous n'etes pas le proprietaire actuel !");
        _;
    }

    // Fonctionnalite 1: Enregistrement
    function registerProduct(string memory _name) public {
        productCount++;
        Product storage newProduct = products[productCount];
        newProduct.id = productCount;
        newProduct.name = _name;
        newProduct.currentOwner = msg.sender;
        newProduct.creator = msg.sender;
        
        newProduct.history.push(Step("Creation du produit", msg.sender, block.timestamp));
    }

    // Fonctionnalite 2: Changement de proprietaire
    function changeOwner(uint256 _id, address _newOwner) public onlyOwner(_id) {
        products[_id].currentOwner = _newOwner;
        products[_id].history.push(Step("Changement de proprietaire", msg.sender, block.timestamp));
    }

    // Fonctionnalite 3: Ajout d'etape logistique
    function addLogisticsStep(uint256 _id, string memory _desc) public onlyOwner(_id) {
        products[_id].history.push(Step(_desc, msg.sender, block.timestamp));
    }

    // Fonctionnalite 4 & 5: Historique
    function getProductHistory(uint256 _id) public view returns (Step[] memory) {
        return products[_id].history;
    }
}