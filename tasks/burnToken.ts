import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721V2 } from "../typechain";
import { BigNumber } from "ethers";

task("burnToken", "Burns a token")
  .addParam("contract", "The address of the MyERC721V2 contract")
  .addParam("tokenId", "The token ID to burn")
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

      await contract.burn(tokenId);

      const filter = contract.filters.Transfer();
      const events = await contract.queryFilter(filter);
      const txFrom = events[0].args["from"];
      const txTokenId = events[0].args["tokenId"];

      console.log(`Token with ID ${txTokenId} has been burned from ${txFrom}`);
    }
  );
