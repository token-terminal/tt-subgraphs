import { BigInt } from '@graphprotocol/graph-ts'
import { Pair as PairTemplate } from '../generated/templates'
import { JoeFactory, PairCreated } from '../generated/JoeFactory/JoeFactory'
import { Mint, Burn, Swap, Transfer, Approval, Sync } from '../generated/templates/Pair/JoePair'
import {
  PairCreatedV0Event,
  MintV0Event,
  BurnV0Event,
  SwapV0Event,
  TransferV0Event,
  ApprovalV0Event,
  SyncV0Event,
} from '../generated/schema'

export function handlePairCreated(event: PairCreated): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let PairCreatedEntity = new PairCreatedV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let token0 = event.params.token0
  let token1 = event.params.token1
  let pair = event.params.pair

  PairTemplate.create(pair)

  PairCreatedEntity.transactionHash = transactionHash
  PairCreatedEntity.contractAddress = contractAddress
  PairCreatedEntity.blockNumber = blockNumber
  PairCreatedEntity.blockTime = blockTime
  PairCreatedEntity.logIndex = logIndex
  PairCreatedEntity.token0 = token0
  PairCreatedEntity.token1 = token1
  PairCreatedEntity.pair = pair
  PairCreatedEntity.save()
}
export function handleMint(event: Mint): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let mintEntity = new MintV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let sender = event.params.sender
  let amount0 = event.params.amount0
  let amount1 = event.params.amount1

  mintEntity.transactionHash = transactionHash
  mintEntity.contractAddress = contractAddress
  mintEntity.blockNumber = blockNumber
  mintEntity.blockTime = blockTime
  mintEntity.logIndex = logIndex
  mintEntity.sender = sender
  mintEntity.amount0 = amount0
  mintEntity.amount1 = amount1
  mintEntity.save()
}
export function handleBurn(event: Burn): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let burnEntity = new BurnV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let sender = event.params.sender
  let amount0 = event.params.amount0
  let amount1 = event.params.amount1
  let to = event.params.to

  burnEntity.transactionHash = transactionHash
  burnEntity.contractAddress = contractAddress
  burnEntity.blockNumber = blockNumber
  burnEntity.blockTime = blockTime
  burnEntity.logIndex = logIndex
  burnEntity.sender = sender
  burnEntity.amount0 = amount0
  burnEntity.amount1 = amount1
  burnEntity.to = to
  burnEntity.save()
}
export function handleSwap(event: Swap): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let swapEntity = new SwapV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let sender = event.params.sender
  let amount0In = event.params.amount0In
  let amount1In = event.params.amount1In
  let amount0Out = event.params.amount0Out
  let amount1Out = event.params.amount1Out
  let to = event.params.to

  swapEntity.transactionHash = transactionHash
  swapEntity.contractAddress = contractAddress
  swapEntity.blockNumber = blockNumber
  swapEntity.blockTime = blockTime
  swapEntity.logIndex = logIndex
  swapEntity.sender = sender
  swapEntity.amount0In = amount0In
  swapEntity.amount1In = amount1In
  swapEntity.amount0Out = amount0Out
  swapEntity.amount1Out = amount1Out
  swapEntity.to = to
  swapEntity.save()
}
export function handleApproval(event: Approval): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let approvalEntity = new ApprovalV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let owner = event.params.owner
  let spender = event.params.spender
  let value = event.params.value

  approvalEntity.transactionHash = transactionHash
  approvalEntity.contractAddress = contractAddress
  approvalEntity.blockNumber = blockNumber
  approvalEntity.blockTime = blockTime
  approvalEntity.logIndex = logIndex
  approvalEntity.owner = owner
  approvalEntity.spender = spender
  approvalEntity.value = value
  approvalEntity.save()
}
export function handleTransfer(event: Transfer): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let transferEntity = new TransferV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let from = event.params.from
  let to = event.params.to
  let value = event.params.value

  transferEntity.transactionHash = transactionHash
  transferEntity.contractAddress = contractAddress
  transferEntity.blockNumber = blockNumber
  transferEntity.blockTime = blockTime
  transferEntity.logIndex = logIndex
  transferEntity.from = from
  transferEntity.to = to
  transferEntity.amount = value
  transferEntity.save()
}
export function handleSync(event: Sync): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let SyncEntity = new SyncV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let reserve0 = event.params.reserve0
  let reserve1 = event.params.reserve1

  SyncEntity.transactionHash = transactionHash
  SyncEntity.contractAddress = contractAddress
  SyncEntity.blockNumber = blockNumber
  SyncEntity.blockTime = blockTime
  SyncEntity.logIndex = logIndex
  SyncEntity.reserve0 = reserve0
  SyncEntity.reserve1 = reserve1
  SyncEntity.save()
}
