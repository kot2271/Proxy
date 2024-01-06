import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721V2 } from "../typechain";
import { BigNumber } from "ethers";

task("setTokenUri", "Sets the token URI for an existing token")
  .addParam("contract", "The address of the MyERC721V2 contract")
  .addParam("tokenId", "The token ID to set the URI for")
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

      const tokenId: BigNumber = taskArgs.tokenId;
      const tokenUri: string = taskArgs.tokenUri;

      await contract.setTokenURI(tokenId, tokenUri);

      const filter = contract.filters.MetadataUpdate();
      const events = await contract.queryFilter(filter);
      const txTokenId = events[0].args["_tokenId"];

      console.log(
        `Token with ID ${txTokenId} has been set with URI ${tokenUri}`
      );
    }
  );
