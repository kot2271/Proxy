import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ERC721CloneFactory } from "../typechain";
import { MyERC721 } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

describe("ERC721CloneFactory", () => {
  let cloneFactory: ERC721CloneFactory;
  let implementation: MyERC721;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;

  beforeEach(async () => {
    const Factory = await ethers.getContractFactory("ERC721CloneFactory");
    cloneFactory = await Factory.deploy();
    await cloneFactory.deployed();

    const MyERC721 = await ethers.getContractFactory("MyERC721");
    implementation = await MyERC721.deploy();
    await implementation.deployed();

    [owner, user1] = await ethers.getSigners();
  });

  describe("deployERC721Clone", () => {
    it("should deploy a clone", async () => {
      await cloneFactory.deployERC721Clone(
        implementation.address,
        "CloneToken",
        "CT",
        owner.address
      );

      const filter = cloneFactory.filters.CloneCreated();
      const events = await cloneFactory.queryFilter(filter);
      const cloneAddress = events[0].args["clone"];
      const implementationAddress = events[0].args["implementation"];

      expect(implementationAddress).to.equal(implementation.address);
      expect(cloneAddress).to.be.properAddress;
    });

    it("should deploy a clone successfully", async () => {
      await cloneFactory.deployERC721Clone(
        implementation.address,
        "CloneToken",
        "CT",
        owner.address
      );

      const filter = cloneFactory.filters.CloneCreated();
      const events = await cloneFactory.queryFilter(filter);
      const cloneAddress = events[0].args["clone"];

      expect(cloneAddress).not.to.be.equal(ethers.constants.AddressZero);
    });

    it("should revert if deployERC721Clone is called after initialization", async () => {
      await cloneFactory.deployERC721Clone(
        implementation.address,
        "CloneToken",
        "CT",
        owner.address
      );

      await expect(
        cloneFactory.deployERC721Clone(
          implementation.address,
          "CloneToken",
          "CT",
          owner.address
        )
      ).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("should revert if initialization of the clone fails", async () => {
      await expect(
        cloneFactory.deployERC721Clone(
          implementation.address,
          "CloneToken",
          "CT",
          user1.address
        )
      ).to.be.revertedWith("Initialization failed");
    });
  });
});
