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
