import { BigDecimal, BigInt, Address, store } from "@graphprotocol/graph-ts";
import { Transfer, Comp } from "../generated/Comp/Comp";
import { TokenHolder, TransferEvent } from "../generated/schema";
import {
  getOrCreateToken,
  getOrCreateGovernanceToken,
  createTokenHolder,
  correctForDecimals
} from "./helpers";

export let ZERO_BD = BigDecimal.fromString("0");
export let ZERO_BI = BigInt.fromString("0");
export let ONE_BI = BigInt.fromString("1");

function updateTokenHolders(
  tokenAddress: Address,
  holderAddress: Address,
  value: BigInt,
  blockNumber: BigInt,
  blockTime: BigInt,
  increase: boolean
): void {
  if (
    holderAddress.toHexString() == "0x0000000000000000000000000000000000000000"
  )
    return;

  // Initialize or load Token, GovernanceToken and TokenHolder
  // When a new token holder is initialized, update the token holder counter
  let token = getOrCreateToken(tokenAddress.toHex());
  let governanceToken = getOrCreateGovernanceToken(token);

  let id = holderAddress.toHex();
  let tokenHolder = TokenHolder.load(id);
  if (tokenHolder == null) {
    tokenHolder = createTokenHolder(id, governanceToken);
    governanceToken.numberOfTokenHolders = governanceToken.numberOfTokenHolders.plus(
      ONE_BI
    );
  }

  // Update balance for current TokenHolder
  // (divide transfer amount by 10**token.decimals to denominate it in the token's native units
  let valueNative = correctForDecimals(value, token.decimals);
  tokenHolder.balance = increase
    ? tokenHolder.balance.plus(valueNative)
    : tokenHolder.balance.minus(valueNative);

  // Update timestamp-related fields
  tokenHolder.updatedAtBlock = blockNumber;
  tokenHolder.updatedAtTimestamp = blockTime;

  if (tokenHolder.balance == ZERO_BD) {
    // Balance became zero so remove TokenHolder and subtract 1 from holder counter
    store.remove("TokenHolder", id);
    governanceToken.numberOfTokenHolders = governanceToken.numberOfTokenHolders.minus(
      ONE_BI
    );
  } else {
    tokenHolder.save();
  }

  token.save();
  governanceToken.save();
}

function updateTransferEvents(event: Transfer): void {
  let contractAddress = event.address.toHexString();
  let contract = Comp.bind(Address.fromString(contractAddress));
  let token = getOrCreateToken(contractAddress);

  let fromAddress = event.params.from;
  let toAddress = event.params.to;

  // Convert amounts to the token's native units
  let transferAmountNative = correctForDecimals(
    event.params.amount,
    token.decimals
  );
  let fromBalanceNative = correctForDecimals(
    contract.balanceOf(fromAddress),
    token.decimals
  );
  let toBalanceNative = correctForDecimals(
    contract.balanceOf(toAddress),
    token.decimals
  );

  // Initialize TransferEvent
  let transferEvent = new TransferEvent(event.transaction.hash.toHexString());
  transferEvent.timestamp = event.block.timestamp.toI32();
  transferEvent.block = event.block.number;
  transferEvent.fromAddress = fromAddress;
  transferEvent.toAddress = toAddress;
  transferEvent.transferAmount = transferAmountNative;
  transferEvent.fromBalance = fromBalanceNative;
  transferEvent.toBalance = toBalanceNative;
  transferEvent.token = token.id;
  transferEvent.save();
}

export function handleTransfer(event: Transfer): void {
  updateTokenHolders(
    event.address,
    event.params.from,
    event.params.amount,
    event.block.number,
    event.block.timestamp,
    false
  );
  updateTokenHolders(
    event.address,
    event.params.to,
    event.params.amount,
    event.block.number,
    event.block.timestamp,
    true
  );
  updateTransferEvents(event);
}
