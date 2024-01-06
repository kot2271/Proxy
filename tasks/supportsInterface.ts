import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721V2 } from "../typechain";

task(
  "supportsInterface",
  "Checks if the contract supports a specific interface"
)
  .addParam("contract", "The address of the MyERC721V2 contract")
  .addParam("interfaceId", "The bytes4 identifier of the interface")
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

      const interfaceId = taskArgs.interfaceId as string;

      const isSupported = await contract.supportsInterface(interfaceId);
      console.log(
        `Contract supports interface ${interfaceId}: ${
          isSupported ? "Yes" : "No"
        }`
      );
    }
  );
