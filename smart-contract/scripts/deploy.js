
async function main() {
  const COT = await ethers.getContractFactory("CoolingOffNFT")

  // Start deployment, returning a promise that resolves to a contract object
  const cot = await COT.deploy()
  await cot.deployed()
  console.log("Contract deployed to address:", cot.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
