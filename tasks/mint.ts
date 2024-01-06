import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721V1 } from "../typechain";
import { BigNumber } from "ethers";

task("mint", "Mints a new token")
  .addParam("contract", "The address of the MyERC721V1 contract")
  .addParam("to", "The address to mint the token to")
  .addParam("tokenId", "The token ID to mint")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const contract: MyERC721V1 = <MyERC721V1>(
        await hre.ethers.getContractAt(
          "MyERC721V1",
          taskArgs.contract as string
        )
      );

      const addressTo: string = taskArgs.to;
      const tokenId: BigNumber = taskArgs.tokenId;

      await contract.mint(addressTo, tokenId);

      const filter = contract.filters.Transfer();
      const events = await contract.queryFilter(filter);
      const txTo = events[0].args["to"];
      const txTokenId = events[0].args["tokenId"];

      console.log(`Token with ID ${txTokenId} has been minted to ${txTo}`);
    }
  );
