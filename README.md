# Agritech DEMO - Blockchain Component Elements

Raccolta dei sorgenti delle componenti della Agritech Demo relativi alla Blockchain ed all'interazione con essa.

Elenco Elementi Presenti:
- Smart contract [AgritechDemo.sol](/contracts/AgritechDemo.sol);
- Node.js scripts per l'interazione con lo smart contract [testContract.js](/scripts/testContract.js), [listenAllEvents.js](/scripts/listenAllEvents.js.md), [IntegrityRestApi.js](/scripts/IntegrityRestApi.js);
- Dockerfile per ricreare parzialmente l'ambiente di sviluppo [Dockerfile](/Dockerfile).

E' stato utilizzato [Truffle](https://archive.trufflesuite.com/) come framework di sviluppo per lo smart contract e [Ganache](https://archive.trufflesuite.com/ganache/) come EVM-compatible Blockchain di test.

## Obiettivi della DEMO

1. Garantire l’integrità, autenticità, ed il non ripudio, dei dati relativi al pascolo di mucche in alta montagna;
2. Garantire la disponibilità, autenticità, integrità, ed il non ripudio dei passaggi di gestione di ogni mucca.

## Installazione

E' necessario installare diverse compomenti software al fine di poter testare l'intero codebase

## Blockchain
E' necessaria una EVM-compatible blockchain operativa al fine di poter fare il deployment dello smart-contract ed interagirvi

Per il solo testing dello smart contract e' possibile utilizzare [Remix IDE](https://remix.ethereum.org/) clonando il repository all'interno dell'IDE. Non dovrebbe essere possibile l'interazione dall'esterno dell'IDE, non dovrebbe essere possibile tramite solo REMIX IDE testare l'interazione con lo smart contract.

Installando [Ganache](https://archive.trufflesuite.com/ganache/) è possibile avere una blockchain operativa sulla propria macchina per il testing, con in quale interagire attraverso vari strumenti (anche REMIX IDE).

## Ambiente di Sviluppo

E' necessario un ambiente di sviluppo Node.js per l'interazione ed il deployment semplificato dello smart contract.
In particolare, sono richiesti:
- Node 18
- Python 3.12, node-gyp
- Truffle
- web3

Per semplificare la creazione dell'ambiente di sviluppo è disponibile un'immagine Docker di un Ubuntu conteiner con i software di sviluppo già installati. Installando Docker e VS-Code è possibile sviluppare e testare l'environment direttamente dal container.

## AgritechDemo Smart Contract

Lo smart contract tiene traccia, tramite variabili di stato ed eventi, dei passaggi di ownership e dell'integrita del pascolo delle mucche.
Gli identificativi delle mucche sono stringhe di lunghezza fissa di 14 caratteri. Vi sono diversi ruoli associati agli address che interagiscono con lo smart contract. Sono emessi eventi a seguito l'esecuzione della maggiorparte delle operazione che portano ad un aggiornamento dello stato del ledger. I timestamp sono in UNIX time e sono salvati come uint256, e vengono considerati come forniti sempre dall'utilizzatore esterno.

## Testing

Si consiglia di clonare il repository e di aprire la cartella clonata all'interno di VS Code.

Avviare Ganache

Nel file [truffle-config.js](/truffle-config.js) VANO DEFINITI i parametri della rete blockchain sul quale si farà il deployment dello smart contract (rete development).

I seguenti comandi eseguono la compilazione ed il deployment dello smart contract AgritechDemo.sol sulla rete configurata

```truffle compile```
```truffle migrate --network develoment``` 

E' possibile testare l'interazione con lo smart contract o tramite REMIX IDE (connettendolo con Ganache) oppure tramite gli script presenti nella cartella [scripts](/scripts/)

Il comando di seguito testa le funzionalità del base dello smart-contract. ATTENZIONE: prima dell'esecuzione degli script di seguito è necessario aggiornare l'indirizzo della rete all'interno dei codici sorgenti

```cd scripts```
```node testContract.js```
```node listenAllEvents.js```

E' possibile verifiare l'integrity

## Verifica Integrità Pascolo

Per generare l'hash del pascolo di una singols mucca si assume che i dati del pascolo associati siano formattati in un file JSON come [gpsLogExample.json](/gpsLogExample.json). Viene quindi computato l'hash del file .json generato tramite l'algoritmo SHA3-256. Al momento è assunto che il digest di integrità associato al pascolo di un mucca è salvato una sola volta in blockchain. 
Il file [IntegrityRestApi.js](scripts/IntegrityRestApi.js) avvia un server REST che permette la verifica dell'integrità dei dati del pascolo associati ad una singola mucca. Il server accetta richieste POST non autenticate all'indirizzo http://localhost:3000/check-integrity. Il server accetta richieste in formato JSON e fornisce risposta nello stesso formato. Il payload atteso per la richiesta è un JSON avente le chiavi "cowId" ed "hash" definite con valori da verificare. La risposta è in formato JSON avente le chiavi "correct" con l'esito dell'integrity check e "message" per informazioni addizionali.

```node IntegrityRestApi.js```
```curl -X POST   http://localhost:3000/check-integrity   -H 'Content-Type: application/json'   -d '{"cowId": "IT345678901234", "hash" : "0x399885402c9fdf4879ef139ef3f1995cdfdf"}'df4879ef139ef3f1995cdfdf"}'```