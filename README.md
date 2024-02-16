# SaveToken Smart Contract

## Overview

SaveToken is a Solidity smart contract developed using Hardhat that enables users to deposit and withdraw tokens, tracking their savings balance securely on the Ethereum blockchain.

## Features

- **Deposit:** Users can deposit tokens into the contract, with the deposited amount added to their savings balance.
- **Withdraw:** Users can withdraw tokens from their savings balance at any time, ensuring they have sufficient funds available.
- **Owner Management:** The contract owner has the ability to withdraw tokens from the contract, providing an additional layer of control.

## Contract Details

- **Saving Token:** The contract accepts deposits and withdrawals in a specific ERC20 token specified during deployment.
- **Mapping:** User savings balances are stored in a mapping, associating each user's address with their corresponding balance.
- **Events:** Events are emitted upon successful deposit and withdrawal operations for transparency and tracking purposes.

## Functions

- `deposit(uint256 _amount)`: Allows users to deposit tokens into the contract.
- `withdraw(uint256 _amount)`: Allows users to withdraw tokens from their savings balance.
- `checkUserBalance(address _user)`: Returns the savings balance of a specific user.
- `checkContractBalance()`: Returns the balance of the contract.
- `ownerWithdraw(uint256 _amount)`: Allows the contract owner to withdraw tokens from the contract.

## Usage

To use the SaveToken contract, follow these steps:

1. Deploy the contract to the Ethereum blockchain using Hardhat.
2. Interact with the contract through the provided functions to deposit, withdraw, and manage savings balances.
3. Monitor events emitted by the contract for transaction tracking and transparency.
