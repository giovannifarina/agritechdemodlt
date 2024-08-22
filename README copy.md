# Agritech DEMO - Blockchain Component Elements

Raccolta dei sorgenti delle componenti della Agritech Demo relativi alla Blockchain ed all'interazione con essa.

Elenco Elementi Presenti:
- Smart contract [AgritechDemo.sol](/contracts/AgritechDemo.sol);
- Node.js scripts per l'interazione con lo smart contract [testContract.js](/scripts/testContract.js), [listenAllEvents.js](/scripts/listenAllEvents.js.md), [IntegrityRestApi.js](/scripts/IntegrityRestApi.js);
- Dockerfile per ricreare parzialmente l'ambiente di sviluppo [Dockerfile](/Dockerfile).

E' stato utilizzato [Truffle](https://archive.trufflesuite.com/) come framework di sviluppo per lo smart contract e [Ganache](https://archive.trufflesuite.com/ganache/) come EVM-compatible Blockchain di test.

## Installazione

E' necessario installare diverse compomenti software al fine di poter testare l'intero codebase

### Blockchain
E' necessaria una EVM-compatible blockchain operativa al fine di poter fare il deployment dello smart-contract ed interagirvi

Per il solo testing dello smart contract e' possibile utilizzare [Remix IDE](https://remix.ethereum.org/) clonando il repository all'interno dell'IDE. Non dovrebbe essere possibile l'interazione dall'esterno dell'IDE, non dovrebbe essere possibile tramite solo REMIX IDE testare l'interazione con lo smart contract.

Installando [Ganache](https://archive.trufflesuite.com/ganache/) è possibile avere una blockchain operativa sulla propria macchina per il testing, con in quale interagire attraverso vari strumenti (anche REMIX IDE).

### Ambiente di Sviluppo

E' necessario un ambiente di sviluppo Node.js per l'interazione ed il deployment semplificato dello smart contract.
In particolare, sono richiesti:
- Node 18
- Python 3.12, node-gyp
- Truffle
- web3

Per semplificare la creazione dell'ambiente di sviluppo è stata definita un'immagine Docker di un Ubuntu conteiner con i software di sviluppo già installati. Installando Docker e VS-Code è possibile sviluppare e testare l'environment direttamente dal container.

...

Truffle Project, testabile con Ganache o Remix

MANTENGO IN SOLO INTEGRITY SEGMENT, si può aggiornare

https://archive.trufflesuite.com/ganache/
https://archive.trufflesuite.com/docs/truffle/how-to/install/

Gli script di test richiedono Node.js versione 18 e web3.js installato

# Installa Environment Incompleto
-  Ganache https://archive.trufflesuite.com/ganache/
- nvm https://github.com/nvm-sh/nvm
- Node 18 : nvm install 18
- Python 3.12 https://www.howtogeek.com/install-latest-python-version-on-ubuntu/sud
- build-essential
- npm install -g node-gyp
- npm install web3

# Istruzioni Incomplete

attenzione alla visibilità su windows https://ethereum.stackexchange.com/questions/130553/wsl-ubuntu-to-ganache-gui-on-windows-10-network-connection-error
truffle compile
truffle migrate --development

# Note Lavoro

# Note Use Case

Codice Identificativo Bonivo : IT + 12 cifre
Timestamp come Unixtime
Un unico hash di integrity per mucca per semplicità fatto da tutto lo storico

GeoJSON is a widely used format for encoding geographic data in JSON (JavaScript Object Notation).

# Besu

Seguire la guida per l'installazione del Developer Quickstart di Besu, vi sono alcuni software come prerequisito.
- Dopo la prima instruzione per installare node bisogna chiudere il terminale
- Per installare Hardhat, in una cartella vuota eseguire il comando ```npx hardhat init```
- Dare tutti i permessi alla cartella creata altrimenti da problemi sui volumi montanti ```chmod -R 777 quorum-test-network/```
- ```rm -rf quorum-test-network/```
- Chainlens da problemi, Blockscount sembra non utile
- ELK da problemi, lasciato default

https://besu.hyperledger.org/development/private-networks/tutorials/quickstart

# Extra Links

- Tutorial Collegamento REMIX e Metamask a Besu https://www.youtube.com/watch?v=2dGRIlvmvOE

- Tutorial Sviluppo DLT https://youtu.be/jcgfQEbptdo?si=zxjuOoFzo-TX0sjh

- Check Timestamp https://www.epochconverter.com/

# Esempi Curl Requests

```curl -X POST --data '{"jsonrpc":"2.0","method":"eth_protocolVersion","params":[],"id":1}' -H "Content-Type: application/json" http://localhost:8545```
  
  
```curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest", false],"id":1}' -H "Content-Type: application/json" http://localhost:8545```


Get EVM version

```curl -X POST --data '{"jsonrpc":"2.0","method":"eth_protocolVersion","params":[],"id":1}' -H "Content-Type: application/json" http://localhost:8545```
