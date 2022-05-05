async function main() {
  
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log("Deploying the contracts with the account:", await deployer.getAddress() );
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    const mintContract = await ethers.getContractFactory("SpaceWorms");
    const mintToken = await mintContract.deploy();
    console.log("Mint Contract deployed to:", mintToken.address);
    
    saveFrontendFiles(mintToken);

    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
      //console.log(account);
    }
    
}


function saveFrontendFiles(mintToken) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) { fs.mkdirSync(contractsDir); }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify(
                    { 
                      MintToken: mintToken.address
                    }, 
                    undefined, 2)
  );

  const mintTokenArtifact = artifacts.readArtifactSync("SpaceWorms");
  fs.writeFileSync( contractsDir + "/SpaceWorms.json", JSON.stringify(mintTokenArtifact, null, 2));
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });