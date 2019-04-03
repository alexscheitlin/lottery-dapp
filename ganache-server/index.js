const Web3 = require('web3');
const ganache = require("ganache-core");

const web3 = new Web3(ganache.provider());
const server = ganache.server();

function getAccounts(){
    return web3.eth.getAccounts()
    .then(response => console.log(response))
}

server.listen(7545, 
    function(err, blockchain) {
        console.log("Ganache is running on port 7545...")
        getAccounts()
    });