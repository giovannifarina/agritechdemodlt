// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0 <=0.8.19; // Gio: il mio setting locale da problemi con versioni superiori sull'installazione locale di Besu

/* 
    ASSUNZIONI:
    - I timestamp delle operazioni siano forniti dagli invocatori delle funzioni, ci si aspetta quindi che questi valori siano sempre validi e sensati;
    - Si assume che i cowId siano validi (viene fatto un check solo sulla loro lunghezza, fissa a 14 caratteri);
    - Nel passaggio di ownership si interrompe il tracking della mucca, il collare viene quindi disassociato;
*/

// ALL FUNCTIONALITIES HAVE TO BE CHECKED!

contract AgritechDemo {

    /* DEFINIZIONE TIPI E STRUCT */

    // Gli identificativi delle mucche sulla Banca Dati Nazionale dell'Anagrafe Zootecnica (BDN) dovrebbero essere sempre di 14 caratteri, 1 byte è un carattere;
    //type cowid is bytes14;

    // SHA3-256 produce output da 256 bit _> 32 byte
    //type gpshash is bytes32;

    type timestamp is uint256;

    bytes14 constant EMPTYCOWID = 0x00; // 2 hex = 1 byte

    // Struct dati associazione collare
    struct DeviceAssociationData {
        address currentManager;
        bytes14 currentCow;
    }

    // Struct dati owneship mucca
    struct OwnershipData {
        timestamp startTime;
        address owner;
    }

    // Struct dati di transfer owneship mucca
    struct PendingOwnershipData {
        timestamp transferTime;
        address previousOwner;
        address newOwner;
    }

    // Ruoli associati agli address
    enum Roles {
        NoPriviledge, // Gestione ruolo con indice 0 su mapping
        Administrator, // Possono assegnare ruoli
        Actor,
        Device
    }

    /* EVENTS */

    event ContractDeployed(address deployer); 

    // Evento generato all'associazione di una mucca ad un collare. NOTA: l'aggiunta di una mucca senza l'associazione ad un collare non genera evento
    event CowToDeviceAssociated(timestamp registrationTime, bytes14 indexed cowId, address deviceAddress);
    event CowToDeviceDissociated(timestamp registrationTime, bytes14 indexed cowId, address deviceAddress);

    // Evento generato alla generazione di hash per una collezione di informazioni -  EVENTI DA SCANDIRE PER L'INTEGRITY CHECK
    event IntegritySegment(timestamp lastTimestamp, bytes14 indexed cowId, bytes32 hash);

    // Evento generato alla registrazione di un device da parte dell'amministratore
    event DeviceRegistered(timestamp registerTime, address deviceAddress, address deviceManager); 

    // Eventi generati durante il trasferimento di ownership
    event OwnershipTransferInitiated(address indexed currentOwner, address indexed proposedOwner, bytes14 cowId);
    event OwnershipTransferCompleted(address indexed previousOwner, address indexed newOwner, bytes14 cowId);
    event OwnershipTransferCanceled(address indexed previousOwner, address indexed newOwner, bytes14 cowId);

    /* STATE VARIABLES */

    // Mappa address : ruolo, ruoli degli account per la gestione dei privilegi. NOTA: quando la chiave non è presente da come valore di default 0, quindi ruolo NoPriviledge
    mapping(address => Roles) public addrToRole; // TO DO : change to internal
    // Mappa idMucca : listaOwnership, sequenza di ownerships delle mucche
    mapping(bytes14 => OwnershipData[]) public cowOwnerships; // TO DO : change to internal
    // Mappa address : gestore-mucca, tiene traccia dell'associazione del collare ad eventuale gestore e mucca
    mapping(address => DeviceAssociationData) public deviceAssociations; // TO DO : change to internal
    // Mappa idMucca : pendingOwner, tiene traccia dei cambi di ownership pending
    mapping(bytes14 => PendingOwnershipData) public pendingOwnerships; // TO DO : change to internal
    // Mappa idMucca : bool, tiene traccia del fatto che una mucca ha associato un device (utile per la verifica che una mucca sia senza collare prima del transfer)
    mapping(bytes14 => bool) public hasCowAssociatedDevice;

    constructor() {
        addrToRole[msg.sender] = Roles.Administrator;
        //emit ContractDeployed(msg.sender);
    }

    modifier onlyAdministrators{
        require(addrToRole[msg.sender] == Roles.Administrator, "Only administrators are allowed to execute the funcionality");
        _;
    }
    
    // NOTA: Roles are currently permanent
    modifier notPreviouslyRegistered (address _address) {
        require(addrToRole[_address] == Roles.NoPriviledge, "address is already registered"); 
        _;
    }

    function registerNewAdmin (address _adminAddress) external onlyAdministrators notPreviouslyRegistered(_adminAddress) {
        addrToRole[_adminAddress] = Roles.Administrator;
    } // ✓


    function registerNewActor (address _actorAddress) external onlyAdministrators notPreviouslyRegistered(_actorAddress) {
        addrToRole[_actorAddress] = Roles.Actor;
    }

    function registerNewDevice (address _deviceAddress, address _managerAddress, timestamp _registerTime) external onlyAdministrators notPreviouslyRegistered(_deviceAddress) {
        addrToRole[_deviceAddress] = Roles.Device;
        deviceAssociations[_deviceAddress] = DeviceAssociationData(_managerAddress, EMPTYCOWID);
        emit DeviceRegistered(_registerTime, _deviceAddress, _managerAddress);
    }

    function checkAndConvertCowId (string calldata _cowId) private pure returns (bytes14) { 
        bytes memory cowIdBytes = bytes(_cowId);
        require(cowIdBytes.length <= 14, "cowId too long"); // minimal check invalid cowId
        return bytes14(cowIdBytes);
    }

    function isCowRegistered(bytes14 cowIdBytes14) private view returns (bool) {
        if (cowOwnerships[cowIdBytes14].length > 0)
            return true;
        else
            return false;
    }

    function addCow (string calldata _cowId, timestamp _registrationTime) public {
        // VALIDITY CHECKS
        bytes14 cowIdBytes14 = checkAndConvertCowId(_cowId);
        require(!isCowRegistered(cowIdBytes14), "cowId already registered");
        require(addrToRole[msg.sender] == Roles.Actor, "address not allowed to register cow"); 
        
        // SAVE OWNERSHIP
        OwnershipData memory newOwnership = OwnershipData({
            owner: msg.sender,
            startTime: _registrationTime
        });
        cowOwnerships[cowIdBytes14].push(newOwnership);
    }

    function associateDeviceToCow(string calldata _cowId, address _deviceAddress, timestamp _startTime) public {
        // VALIDITY CHECKS
        require(addrToRole[_deviceAddress] == Roles.Device, "deviceAddress is not associated to a Device"); 
        DeviceAssociationData memory deviceAssociation = deviceAssociations[_deviceAddress];
        require(deviceAssociation.currentManager == msg.sender, "Only the device manager can perform this operation");
        require(deviceAssociation.currentCow == EMPTYCOWID, "The device is associated to another cow");
        bytes14 cowIdBytes14 = checkAndConvertCowId(_cowId);
        require(pendingOwnerships[cowIdBytes14].newOwner == address(0), "Cannot associate a device to a pending transfer of ownership");

        // add cow if not registered yet
        if (!isCowRegistered(cowIdBytes14))
            addCow(_cowId, _startTime); 

        // ASSOCIATE DEVICE TO COW
        deviceAssociations[_deviceAddress].currentCow = cowIdBytes14;
        hasCowAssociatedDevice[cowIdBytes14] = true;
        emit CowToDeviceAssociated(_startTime , cowIdBytes14, _deviceAddress);
    }

    function dissociateDeviceToCow(string calldata _cowId, address _deviceAddress, timestamp _endTime) public {
        // VALIDITY CHECKS
        require(addrToRole[_deviceAddress] == Roles.Device, "deviceAddress is not associated to a Device"); 
        DeviceAssociationData memory deviceAssociation = deviceAssociations[_deviceAddress];
        require(deviceAssociation.currentManager == msg.sender, "Only the device manager can perform this operation");
        bytes14 cowIdBytes14 = checkAndConvertCowId(_cowId);
        require(deviceAssociation.currentCow == cowIdBytes14, "The device is not associated to the provided cowId");

        // DISSOCIATE DEVICE TO COW
        deviceAssociations[_deviceAddress].currentCow = EMPTYCOWID;
        delete hasCowAssociatedDevice[cowIdBytes14];
        emit CowToDeviceDissociated(_endTime, cowIdBytes14, _deviceAddress);
        
        // Aggiungere come requisito per il trasferimento
    }

    function transferOwnership(string calldata _cowId, address _newOwner, timestamp _transferTime) public {
        // VALIDITY CHECKS
        bytes14 cowIdBytes14 = checkAndConvertCowId(_cowId);
        OwnershipData[] memory currentCowOwnerships = cowOwnerships[cowIdBytes14];
        require(currentCowOwnerships[currentCowOwnerships.length-1].owner == msg.sender, "Only the current owner can call this function");
        require(addrToRole[_newOwner] == Roles.Actor, "Only actors can be the new owner");
        require(_newOwner != msg.sender, "New owner must be different from the current owner");
        require(pendingOwnerships[cowIdBytes14].newOwner == address(0), "A transfer is already pending");
        require(!hasCowAssociatedDevice[cowIdBytes14], "The cow has not to bo associated to a device to transfer the ownership");

        // PENDING TRANSFER
        PendingOwnershipData memory newPOD = PendingOwnershipData({
            newOwner: _newOwner,
            previousOwner: msg.sender,
            transferTime: _transferTime
        });
        pendingOwnerships[cowIdBytes14] = newPOD;        
        emit OwnershipTransferInitiated(msg.sender, _newOwner, cowIdBytes14);
    }

    function acceptOwnership(string calldata _cowId) public  {
        // VALIDITY CHECKS
        bytes14 cowIdBytes14 = checkAndConvertCowId(_cowId);
        PendingOwnershipData memory POD = pendingOwnerships[cowIdBytes14];
        require(POD.newOwner == msg.sender, "There is not a pending ownership for cowId");

        // COMPLETE TRANSFER
        OwnershipData memory newOwnership = OwnershipData({
            owner: msg.sender,
            startTime: POD.transferTime
        });
        cowOwnerships[cowIdBytes14].push(newOwnership);
        delete pendingOwnerships[cowIdBytes14];
        emit OwnershipTransferCompleted(POD.previousOwner, msg.sender, cowIdBytes14);
    }

    function cancelTransfer(string calldata _cowId) public {
        // VALIDITY CHECKS
        bytes14 cowIdBytes14 = checkAndConvertCowId(_cowId);
        PendingOwnershipData memory POD = pendingOwnerships[cowIdBytes14];
        require(POD.newOwner == msg.sender, "There is not a pending ownership for cowId");

        // CANCEL TRANSFER
        emit OwnershipTransferCanceled(POD.previousOwner, msg.sender, cowIdBytes14);
        delete pendingOwnerships[cowIdBytes14];

    }

    function storeIntegritySegment(string calldata _cowId, timestamp _updateTime, bytes32 gpshash) public {
        // VALIDITY CHECKS
        bytes14 cowIdBytes14 = checkAndConvertCowId(_cowId);
        require(deviceAssociations[msg.sender].currentCow == cowIdBytes14, "The address is not allows to execute this functionality");

        // STORE INTEGRITY SEGMENT
        emit IntegritySegment(_updateTime, cowIdBytes14, gpshash);
    }

}