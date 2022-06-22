require("dotenv").config();
const API_URL = process.env.API_URL_RINKEBY;
const PUBLIC_KEY = process.env.PUBLIC_KEY_RINKEBY;
const PRIVATE_KEY = process.env.PRIVATE_KEY_RINKEBY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/CoolingOffNFT.sol/CoolingOffNFT.json");
//contract address of nft
const contractAddress = PUBLIC_KEY;
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(myAddress, tokenURI) {
  web3.utils.toChecksumAddress(myAddress);
  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: PUBLIC_KEY,
    gas: 800000,
    data: nftContract.methods.safeMint(myAddress, tokenURI).encodeABI()
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (err, hash) {
        if (!err) {
          console.log(
            "The hash of your transaction is: ",
            hash,
            "\nCheck Alchemy's Mempool to view the status of your transaction!"
          );
        } else {
          console.log("Something went wrong when submitting your transaction:", err);
        }
      });
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}

// buzz
mintNFT("0x340C4e8288c67aaf2BB6C8Db10D55112b483566a", "https://cryptostone.io/nft/diamond/A5.json");
// mintNFT("0xF27567073b00a09b8C150B213855CD11fC70edBc", "https://cryptostone.io/nft/diamond/A5.json");

// shoh
// mintNFT("0x752aa9C176c9fcb8aE58A98E9c221E2387312708","https://cryptostone.io/nft/diamond/A5.json")

// fizz
// mintNFT("0x9620EfCFb32771Ad4D7Ec69FE30EF675F93B9446","https://cryptostone.io/nft/diamond/A5.json")
