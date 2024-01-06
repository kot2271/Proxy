import { ethers, upgrades } from "hardhat";
import { verify } from "../helpers/verify";

const V1_CONTRACT_NAME = "MyERC721V1";
const V2_CONTRACT_NAME = "MyERC721V2";

async function deployFunction() {
  // Deploy MyERC721V1
  const MyERC721V1 = await ethers.getContractFactory(V1_CONTRACT_NAME);
  const myERC721V1 = await upgrades.deployProxy(MyERC721V1, [], {
    initializer: "initialize",
  });
  await myERC721V1.deployed();
  console.log(`${V1_CONTRACT_NAME} deployed to: ${myERC721V1.address}`);
  await verify(myERC721V1.address, []);

  // Upgrade MyERC721V1 to MyERC721V2
  const MyERC721V2 = await ethers.getContractFactory(V2_CONTRACT_NAME);
  const myERC721V2 = await upgrades.upgradeProxy(
    myERC721V1.address,
    MyERC721V2
  );
  await myERC721V2.deployed();
  console.log(
    `${V2_CONTRACT_NAME} (upgraded from MyERC721V1) deployed to: ${myERC721V2.address}`
  );
  await verify(myERC721V2.address, []);
}

deployFunction()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
