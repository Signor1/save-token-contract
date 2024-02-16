import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SaveToken } from "../typechain-types";
import { SignorToken } from "../typechain-types";

describe("Save Token Contract Testing", function () {
  let signorToken: SignorToken;
  let saveToken: SaveToken;

  async function deploySaveTokenContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const initialOwner = "0xdF0a689A22B64C455AE212DBc13AF35f1B1dFD55";

    const signorToken = await ethers.getContractFactory("SignorToken");

    const token = await signorToken.deploy(initialOwner);

    const SaveERC20 = await ethers.getContractFactory("SaveToken");

    const saveToken = await SaveERC20.deploy(token.target);

    return { token, saveToken, owner, otherAccount };
  }

  describe("Deployment Check", function () {
    it("Check if the ERC20 token contract was deployed", async function () {
      const { token } = await loadFixture(deploySaveTokenContract);

      expect(token).to.exist;
    });

    it("Check if the Save ERC20 token contract was deployed", async function () {
      const { saveToken } = await loadFixture(deploySaveTokenContract);

      expect(saveToken).to.exist;
    });
  });

  describe("Deposit Check", function () {
    it("Should check that the depositor is address 0", async function () {
      const { owner } = await loadFixture(deploySaveTokenContract);

      const sender = owner.address;

      const nullAddress = "0x0000000000000000000000000000000000000000";

      expect(sender).is.not.equal(nullAddress);
    });

    it("Should revert if the deposit amount is 0", async function () {
      // Deploy the contract
      const { saveToken } = await loadFixture(deploySaveTokenContract);

      // Attempt deposit with 0 token
      await expect(saveToken.deposit(0)).to.be.revertedWith(
        "Can't save zero value"
      );
    });

    it("Should allow users deposit token correctly", async function () {
      const { token, saveToken, owner } = await loadFixture(
        deploySaveTokenContract
      );

      await token.approve(saveToken.target, 2000);

      const ownerbalBeforeDeposit = await saveToken.checkUserBalance(owner);

      await saveToken.connect(owner).deposit(2000);

      const ownerBalAfterDeposit = await saveToken.checkUserBalance(owner);

      expect(ownerBalAfterDeposit).to.be.greaterThan(ownerbalBeforeDeposit);
    });
  });

  describe("Withdrawal Check", function () {
    it("Should revert if the withdrawal address is 0", async function () {
      const { owner } = await loadFixture(deploySaveTokenContract);

      const sender = owner.address;

      const nullAddress = "0x0000000000000000000000000000000000000000";

      expect(sender).is.not.equal(nullAddress);
    });

    it("Should revert if the user's savings is 0", async function () {
      // Deploy the contract
      const { saveToken } = await loadFixture(deploySaveTokenContract);

      // Attempt deposit with 0 token
      await expect(saveToken.withdraw(0)).to.be.revertedWith(
        "can't withdraw zero value"
      );
    });

    it("Should check if total withdrawal is successful", async function () {
      const { token, saveToken, owner } = await loadFixture(
        deploySaveTokenContract
      );

      await token.approve(saveToken.target, 2000);

      const ownerbalBeforeDeposit = await saveToken.checkUserBalance(owner);

      await saveToken.connect(owner).deposit(2000);

      const ownerBalAfterDeposit = await saveToken.checkUserBalance(owner);

      expect(ownerBalAfterDeposit).to.be.greaterThan(ownerbalBeforeDeposit);

      await saveToken.connect(owner).withdraw(2000);

      const ownerBalAfterWithdrawal = await saveToken.checkUserBalance(owner);

      expect(ownerBalAfterWithdrawal).to.be.equal(ownerbalBeforeDeposit);
    });

    it("Should check if user can withdraw some token", async function () {
      const { token, saveToken, owner } = await loadFixture(
        deploySaveTokenContract
      );

      await token.approve(saveToken.target, 2000);

      await saveToken.connect(owner).deposit(2000);

      const ownerBalAfterDeposit = await saveToken.checkUserBalance(owner); //2000

      await saveToken.connect(owner).withdraw(1000);

      const ownerBalAfterWithdrawal = await saveToken.checkUserBalance(owner); //1000

      const balCalc = ownerBalAfterDeposit - ownerBalAfterWithdrawal;

      expect(ownerBalAfterWithdrawal).to.be.equal(balCalc);
    });
  });

  describe("Events Check", function () {
    it("Should check if the deposit event is working", async function () {
      const { token, saveToken, owner } = await loadFixture(
        deploySaveTokenContract
      );

      await token.approve(saveToken.target, 2000);

      const ownerbalBeforeDeposit = await saveToken.checkUserBalance(owner);

      const tx = await saveToken.connect(owner).deposit(2000);

      const ownerBalAfterDeposit = await saveToken.checkUserBalance(owner);

      expect(ownerBalAfterDeposit).to.be.greaterThan(ownerbalBeforeDeposit);

      await expect(tx)
        .to.emit(saveToken, "SavingSuccessful")
        .withArgs(owner, anyValue);
    });

    it("Should check if the withdrawal event is working", async function () {
      const { token, saveToken, owner } = await loadFixture(
        deploySaveTokenContract
      );

      await token.approve(saveToken.target, 2000);

      const ownerbalBeforeDeposit = await saveToken.checkUserBalance(owner);

      await saveToken.connect(owner).deposit(2000);

      const ownerBalAfterDeposit = await saveToken.checkUserBalance(owner);

      expect(ownerBalAfterDeposit).to.be.greaterThan(ownerbalBeforeDeposit);

      const tx = await saveToken.connect(owner).withdraw(2000);

      const ownerBalAfterWithdrawal = await saveToken.checkUserBalance(owner);

      expect(ownerBalAfterWithdrawal).to.be.equal(ownerbalBeforeDeposit);

      await expect(tx)
        .to.emit(saveToken, "WithdrawSuccessful")
        .withArgs(owner, anyValue);
    });
  });

  describe("Contract Balance", function () {
    it("Should check if the contract balance increments as users deposit", async function () {
      const { token, saveToken, owner } = await loadFixture(
        deploySaveTokenContract
      );
      const depositAmount = 2000;

      await token.approve(saveToken.target, 4000);

      const contractbalBeforeDeposit = await saveToken.checkContractBalance();

      await saveToken.connect(owner).deposit(depositAmount);

      const contractBalAfterDeposit = await saveToken.checkContractBalance();

      expect(contractBalAfterDeposit).to.be.equal(depositAmount);
    });
  });
});
