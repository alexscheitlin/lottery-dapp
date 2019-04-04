const RandomNumberOracle = artifacts.require("./RandomNumberOracle.sol");

contract("RandomNumberOracle", accounts => {
  it("...should be between 0 and 43.", async () => {
    const instance = await RandomNumberOracle.deployed();

    
    let storedNumber = await instance.getRandomNumber(1, { from: accounts[0] });
    if(storedNumber < 1 || storedNumber > 42){
        throw "not in range";
    }

    let storedNumbers = await instance.getSixRandomNumbers(10, { from: accounts[0] });
    for(let i = 0; i < 7; i++){
        if(storedNumbers[i] < 1 || storedNumbers[i] > 42){
            throw "not in range";
        }
    }
  });
});
