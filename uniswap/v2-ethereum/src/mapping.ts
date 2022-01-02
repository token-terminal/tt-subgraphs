import { Pair as PairTemplate } from '../generated/templates'
import { PairCreated as FactoryPairCreatedEventV1 } from '../generated/Factory/Factory'
import {
  Mint as PairMintEventV1,
  Burn as PairBurnEventV1,
  Swap as PairSwapEventV1,
  Transfer as PairTransferEventV1,
  Approval as PairApprovalEventV1,
  Sync as PairSyncEventV1,
} from '../generated/templates/Pair/Pair'
import {
  FactoryPairCreatedV1Event,
  PairMintV1Event,
  PairBurnV1Event,
  PairSwapV1Event,
  PairTransferV1Event,
  PairApprovalV1Event,
  PairSyncV1Event,
} from '../generated/schema'

export function handleFactoryPairCreatedV1Event(event: FactoryPairCreatedEventV1): void {
  let entity = new FactoryPairCreatedV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  PairTemplate.create(event.params.pair)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.pair = event.params.pair
  entity.save()
}

export function handlePairMintV1Event(event: PairMintEventV1): void {
  let entity = new PairMintV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.sender = event.params.sender
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.save()
}

export function handlePairBurnV1Event(event: PairBurnEventV1): void {
  let entity = new PairBurnV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.sender = event.params.sender
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.to = event.params.to
  entity.save()
}

export function handlePairSwapV1Event(event: PairSwapEventV1): void {
  let entity = new PairSwapV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.sender = event.params.sender
  entity.amount0In = event.params.amount0In
  entity.amount1In = event.params.amount1In
  entity.amount0Out = event.params.amount0Out
  entity.amount1Out = event.params.amount1Out
  entity.to = event.params.to
  entity.save()
}

export function handlePairApprovalV1Event(event: PairApprovalEventV1): void {
  let entity = new PairApprovalV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}

export function handlePairTransferV1Event(event: PairTransferEventV1): void {
  let entity = new PairTransferV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.save()
}

export function handlePairSyncV1Event(event: PairSyncEventV1): void {
  let entity = new PairSyncV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.reserve0 = event.params.reserve0
  entity.reserve1 = event.params.reserve1
  entity.save()
}
