import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { ERC721CloneFactory } from "../typechain";

task("deployERC721Clone", "Deploys a clone of an ERC721 contract")
  .addParam("contract", "The address of the ERC721CloneFactory contract")
  .addParam(
    "implementationContract",
    "The address of the implementation contract"
  )
  .addParam("name", "The name of the ERC721 clone")
  .addParam("symbol", "The symbol of the ERC721 clone")
  .addParam("owner", "The owner of the ERC721 clone")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const factoryContract: ERC721CloneFactory = <ERC721CloneFactory>(
        await hre.ethers.getContractAt(
          "ERC721CloneFactory",
          taskArgs.contract as string
        )
      );

      const implementationContract: string = taskArgs.implementationContract;
      const name: string = taskArgs.name;
      const symbol: string = taskArgs.symbol;
      const owner: string = taskArgs.owner;

      try {
        await factoryContract.deployERC721Clone(
          implementationContract,
          name,
          symbol,
          owner
        );
        const filter = factoryContract.filters.CloneCreated();
        const events = await factoryContract.queryFilter(filter);
        const cloneAddress = events[0].args["clone"];

        console.log(`Clone deployed successfully at address: ${cloneAddress}`);
      } catch (error) {
        console.error("Error deploying clone: ", error);
      }
    }
  );
