import { Pool as PoolTemplate } from '../generated/templates'

import {
  FeeAmountEnabled as FactoryFeeAmountEnabledEventV1,
  OwnerChanged as FactoryOwnerChangedEventV1,
  PoolCreated as FactoryPoolCreatedEventV1,
} from '../generated/Factory/Factory'

import {
  IncreaseObservationCardinalityNext as PoolIncreaseObservationCardinalityNextEventV1,
  Initialize as PoolInitializeEventV1,
  Mint as PoolMintEventV1,
  Collect as PoolCollectEventV1,
  Burn as PoolBurnEventV1,
  Swap as PoolSwapEventV1,
  Flash as PoolFlashEventV1,
  SetFeeProtocol as PoolSetFeeProtocolEventV1,
  CollectProtocol as PoolCollectProtocolEventV1,
} from '../generated/templates/Pool/Pool'

import {
  FactoryFeeAmountEnabledV1Event,
  FactoryOwnerChangedV1Event,
  FactoryPoolCreatedV1Event,
  PoolIncreaseObservationCardinalityNextV1Event,
  PoolInitializeV1Event,
  PoolMintV1Event,
  PoolCollectV1Event,
  PoolBurnV1Event,
  PoolSwapV1Event,
  PoolFlashV1Event,
  PoolSetFeeProtocolV1Event,
  PoolCollectProtocolV1Event,
} from '../generated/schema'

import {
  IncreaseLiquidity as NonfungiblePositionManagerIncreaseLiquidityEventV1,
  DecreaseLiquidity as NonfungiblePositionManagerDecreaseLiquidityEventV1,
  Collect as NonfungiblePositionManagerCollectEventV1,
} from '../generated/NonfungiblePositionManager/NonfungiblePositionManager'
import {
  NonfungiblePositionManagerIncreaseLiquidityV1Event,
  NonfungiblePositionManagerDecreaseLiquidityV1Event,
  NonfungiblePositionManagerCollectV1Event,
} from '../generated/schema'

export function handleFactoryPoolCreatedV1Event(event: FactoryPoolCreatedEventV1): void {
  let entity = new FactoryPoolCreatedV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  PoolTemplate.create(event.params.pool)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.fee = event.params.fee
  entity.tickSpacing = event.params.tickSpacing
  entity.pool = event.params.pool
  entity.save()
}

export function handleFactoryFeeAmountEnabledV1Event(event: FactoryFeeAmountEnabledEventV1): void {
  let entity = new FactoryFeeAmountEnabledV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.fee = event.params.fee
  entity.tickSpacing = event.params.tickSpacing
  entity.save()
}

export function handleFactoryOwnerChangedV1Event(event: FactoryOwnerChangedEventV1): void {
  let entity = new FactoryOwnerChangedV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.oldOwner = event.params.oldOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handlePoolInitializeV1Event(event: PoolInitializeEventV1): void {
  let entity = new PoolInitializeV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.sqrtPriceX96 = event.params.sqrtPriceX96
  entity.tick = event.params.tick
  entity.save()
}

export function handlePoolMintV1Event(event: PoolMintEventV1): void {
  let entity = new PoolMintV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.sender = event.params.sender
  entity.owner = event.params.owner
  entity.tickLower = event.params.tickLower
  entity.tickUpper = event.params.tickUpper
  entity.amount = event.params.amount
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.save()
}

export function handlePoolCollectV1Event(event: PoolCollectEventV1): void {
  let entity = new PoolCollectV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.owner = event.params.owner
  entity.recipient = event.params.recipient
  entity.tickLower = event.params.tickLower
  entity.tickUpper = event.params.tickUpper
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.save()
}

export function handlePoolBurnV1Event(event: PoolBurnEventV1): void {
  let entity = new PoolBurnV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.owner = event.params.owner
  entity.tickLower = event.params.tickLower
  entity.tickUpper = event.params.tickUpper
  entity.amount = event.params.amount
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.save()
}

export function handlePoolSwapV1Event(event: PoolSwapEventV1): void {
  let entity = new PoolSwapV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.sender = event.params.sender
  entity.recipient = event.params.recipient
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.sqrtPriceX96 = event.params.sqrtPriceX96
  entity.liquidity = event.params.liquidity
  entity.tick = event.params.tick
  entity.save()
}

export function handlePoolFlashV1Event(event: PoolFlashEventV1): void {
  let entity = new PoolFlashV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.sender = event.params.sender
  entity.recipient = event.params.recipient
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.paid0 = event.params.paid0
  entity.paid1 = event.params.paid1
  entity.save()
}

export function handlePoolSetFeeProtocolV1Event(event: PoolSetFeeProtocolEventV1): void {
  let entity = new PoolSetFeeProtocolV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.feeProtocol0Old = event.params.feeProtocol0Old
  entity.feeProtocol1Old = event.params.feeProtocol1Old
  entity.feeProtocol0New = event.params.feeProtocol0New
  entity.feeProtocol1New = event.params.feeProtocol1New
  entity.save()
}

export function handlePoolIncreaseObservationCardinalityNextV1Event(
  event: PoolIncreaseObservationCardinalityNextEventV1
): void {
  let entity = new PoolIncreaseObservationCardinalityNextV1Event(
    `${event.transaction.hash.toHexString()}-${event.logIndex}`
  )
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.observationCardinalityNextOld = event.params.observationCardinalityNextOld
  entity.observationCardinalityNextNew = event.params.observationCardinalityNextNew
  entity.save()
}

export function handlePoolCollectProtocolV1Event(event: PoolCollectProtocolEventV1): void {
  let entity = new PoolCollectProtocolV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.sender = event.params.sender
  entity.recipient = event.params.recipient
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.save()
}

export function handleNonfungiblePositionManagerIncreaseLiquidityV1Event(
  event: NonfungiblePositionManagerIncreaseLiquidityEventV1
): void {
  let entity = new NonfungiblePositionManagerIncreaseLiquidityV1Event(
    `${event.transaction.hash.toHexString()}-${event.logIndex}`
  )
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.tokenId = event.params.tokenId
  entity.liquidity = event.params.liquidity
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.save()
}

export function handleNonfungiblePositionManagerDecreaseLiquidityV1Event(
  event: NonfungiblePositionManagerDecreaseLiquidityEventV1
): void {
  let entity = new NonfungiblePositionManagerDecreaseLiquidityV1Event(
    `${event.transaction.hash.toHexString()}-${event.logIndex}`
  )
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.tokenId = event.params.tokenId
  entity.liquidity = event.params.liquidity
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.save()
}

export function handleNonfungiblePositionManagerCollectV1Event(event: NonfungiblePositionManagerCollectEventV1): void {
  let entity = new NonfungiblePositionManagerCollectV1Event(`${event.transaction.hash.toHexString()}-${event.logIndex}`)
  entity.transactionHash = event.transaction.hash
  entity.address = event.address
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.logIndex = event.logIndex
  entity.tokenId = event.params.tokenId
  entity.recipient = event.params.recipient
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.save()
}
