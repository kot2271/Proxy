import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { MyERC721V1, MyERC721V2 } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ERC721Upgradeable", () => {
  let myERC721V1: MyERC721V1;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();
    const MyERC721V1 = await ethers.getContractFactory("MyERC721V1");
    myERC721V1 = (await upgrades.deployProxy(MyERC721V1, [], {
      initializer: "initialize",
    })) as MyERC721V1;
    await myERC721V1.deployed();
  });

  describe("MyERC721V1", () => {
    it("should mint a token", async () => {
      const tokenId = 1;
      await myERC721V1.mint(user1.address, tokenId);
      expect(await myERC721V1.ownerOf(tokenId)).to.equal(user1.address);
    });

    it("should burn a token", async () => {
      const tokenId = 1;
      await myERC721V1.mint(user1.address, tokenId);
      await myERC721V1.burn(tokenId);
      await expect(myERC721V1.ownerOf(tokenId)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });

    it("should fail to initialize again", async () => {
      await expect(myERC721V1.initialize()).to.be.revertedWith(
        "Initializable: contract is already initialized"
      );
    });

    it("should fail if non-owner tries to mint", async () => {
      const tokenId = 1;
      await expect(
        myERC721V1.connect(user1).mint(user1.address, tokenId)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should fail if non-owner tries to burn", async () => {
      const tokenId = 1;
      await myERC721V1.mint(user1.address, tokenId);
      await expect(myERC721V1.connect(user1).burn(tokenId)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("MyERC721V2", () => {
    let myERC721V2: MyERC721V2;

    beforeEach(async () => {
      const MyERC721V2 = await ethers.getContractFactory("MyERC721V2");

      // Upgrade to V2
      myERC721V2 = (await upgrades.upgradeProxy(
        myERC721V1.address,
        MyERC721V2
      )) as MyERC721V2;
    });

    it("should initialize MyERC721V2 contract successfully", async () => {
      await expect(myERC721V2.initializeV2()).to.not.be.reverted;

      const ERC721URIStorageUpgradeableInterface =
        await myERC721V2.supportsInterface("0x49064906");
      expect(ERC721URIStorageUpgradeableInterface).to.be.true;
    });

    it("should not allow initializeV2 to be called again", async function () {
      await myERC721V2.initializeV2();

      await expect(myERC721V2.initializeV2()).to.be.revertedWith(
        "Initializable: contract is already initialized"
      );
    });

    it("should set token URI", async () => {
      const tokenId = 1;
      const tokenURI = `https://example.com/token${tokenId}`;
      await myERC721V2["mint(address,uint256,string)"](
        user1.address,
        tokenId,
        tokenURI
      );
      expect(await myERC721V2.tokenURI(tokenId)).to.equal(tokenURI);
    });

    it("should preserve ownership after upgrade", async () => {
      const tokenId = 1;
      await myERC721V1.mint(user1.address, tokenId);
      expect(await myERC721V2.ownerOf(tokenId)).to.equal(user1.address);
    });

    it("should fail if non-owner tries to set token URI", async () => {
      const tokenId = 1;
      const tokenURI = `https://example.com/token${tokenId}`;
      await myERC721V2["mint(address,uint256,string)"](
        owner.address,
        tokenId,
        tokenURI
      );
      await expect(
        myERC721V2.connect(user1).setTokenURI(tokenId, tokenURI)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should maintain token balance after upgrade", async () => {
      const tokenId = 1;
      await myERC721V1.mint(owner.address, tokenId);
      const balanceBeforeUpgrade = await myERC721V1.balanceOf(owner.address);
      // Perform the upgrade
      const MyERC721V2 = await ethers.getContractFactory("MyERC721V2");
      await upgrades.upgradeProxy(myERC721V1.address, MyERC721V2);
      const balanceAfterUpgrade = await myERC721V2.balanceOf(owner.address);
      expect(balanceBeforeUpgrade).to.equal(balanceAfterUpgrade);
    });

    it("should fail if non-owner tries to mint", async () => {
      const tokenId = 1;
      const tokenURI = `https://example.com/token${tokenId}`;
      await expect(
        myERC721V2
          .connect(user1)
          ["mint(address,uint256,string)"](user1.address, tokenId, tokenURI)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should burn a token and remove its URI", async function () {
      const tokenId = 1;
      const tokenURI = `https://example.com/token${tokenId}`;

      await myERC721V2["mint(address,uint256,string)"](
        user1.address,
        tokenId,
        tokenURI
      );
      expect(await myERC721V2.ownerOf(tokenId)).to.equal(user1.address);
      expect(await myERC721V2.tokenURI(tokenId)).to.equal(tokenURI);

      await myERC721V2.connect(owner).burn(tokenId);

      await expect(myERC721V2.tokenURI(tokenId)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });
  });
});
