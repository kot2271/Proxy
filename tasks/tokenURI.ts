import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721V2 } from "../typechain";
import { BigNumber } from "ethers";

task("tokenURI", "Fetches the token URI for a specific token")
  .addParam("contract", "The address of the MyERC721V2 contract")
  .addParam("tokenId", "The token ID")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const contract: MyERC721V2 = <MyERC721V2>(
        await hre.ethers.getContractAt(
          "MyERC721V2",
          taskArgs.contract as string
        )
      );
      const tokenId: BigNumber = taskArgs.tokenId;
      const tokenURI = await contract.tokenURI(tokenId);

      console.log(`Token URI for MyERC721V2 token ${tokenId}: ${tokenURI}`);
    }
  );
