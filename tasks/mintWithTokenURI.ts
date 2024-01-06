import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721V2 } from "../typechain";
import { BigNumber } from "ethers";

task("mintWithTokenURI", "Mints a new token with a URI")
  .addParam("contract", "The address of the MyERC721V2 contract")
  .addParam("to", "The address to mint the token to")
  .addParam("tokenId", "The token ID to mint")
  .addParam("tokenUri", "The token URI to set")
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

      const addressTo: string = taskArgs.to;
      const tokenId: BigNumber = taskArgs.tokenId;
      const tokenUri: string = taskArgs.tokenUri;

      await contract["mint(address,uint256,string)"](
        addressTo,
        tokenId,
        tokenUri
      );

      const filter = contract.filters.Transfer();
      const events = await contract.queryFilter(filter);
      const txTo = events[0].args["to"];
      const txTokenId = events[0].args["tokenId"];

      console.log(
        `Token with ID ${txTokenId} has been minted to ${txTo} with URI ${tokenUri}`
      );
    }
  );
