Link Repository Temporaneo per lo Smart Contract:
https://github.com/giovannifarina/RemixAgritech

Seguire la guida per l'installazione del Developer Quickstart di Besu, vi sono alcuni software come prerequisito.
- Dopo la prima instruzione per installare node bisogna chiudere il terminale
- Per installare Hardhat, in una cartella vuota eseguire il comando ```npx hardhat init```
- Dare tutti i permessi alla cartella creata altrimenti da problemi sui volumi montanti ```chmod -R 777 quorum-test-network/```
- ```rm -rf quorum-test-network/```
- Chainlens da problemi, Blockscount sembra non utile
- ELK da problemi, lasciato default

https://besu.hyperledger.org/development/private-networks/tutorials/quickstart


Questo Tutorial Collegat REMIX e Metamask a Besu https://www.youtube.com/watch?v=2dGRIlvmvOE

- Tutorial Sviluppo DLT https://youtu.be/jcgfQEbptdo?si=zxjuOoFzo-TX0sjh

# NOTE
- Al momento ho lasciato tutte le installazione di default di Besu senza seguire la guida;
- Su Linux, installare solo Docker Desktop e non seguire la guida per installare l'engine separatamente (altrimenti crea due context)


Get EVM version

```curl -X POST --data '{"jsonrpc":"2.0","method":"eth_protocolVersion","params":[],"id":1}' -H "Content-Type: application/json" http://localhost:8545```
