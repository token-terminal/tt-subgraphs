import { Pool as PoolTemplate } from '../../generated/templates'
import {
  FeeAmountEnabled,
  OwnerChanged,
  PoolCreated
} from "../../generated/UniswapV3Factory/UniswapV3Factory"
import { IncreaseObservationCardinalityNext, Initialize, Mint, Collect, Burn, Swap, Flash, SetFeeProtocol, CollectProtocol } from "../../generated/templates/Pool/UniswapV3Pool"
import {
  FeeAmountEnabledV0Event,
  OwnerChangedV0Event,
  PoolCreatedV0Event,
  IncreaseObservationCardinalityNextV0Event,
  InitializeV0Event,
  MintV0Event,
  CollectV0Event,
  BurnV0Event,
  SwapV0Event,
  FlashV0Event,
  SetFeeProtocolV0Event,
  CollectProtocolV0Event,
} from "../../generated/schema"
export function handlePoolCreated(event: PoolCreated): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let PoolCreatedEntity = new PoolCreatedV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let token0 = event.params.token0
  let token1 = event.params.token1
  let fee = event.params.fee
  let tickSpacing = event.params.tickSpacing
  let pool = event.params.pool

  PoolTemplate.create(pool)

  PoolCreatedEntity.transactionHash = transactionHash
  PoolCreatedEntity.contractAddress = contractAddress
  PoolCreatedEntity.blockNumber = blockNumber
  PoolCreatedEntity.blockTime = blockTime
  PoolCreatedEntity.logIndex = logIndex
  PoolCreatedEntity.token0 = token0
  PoolCreatedEntity.token1 = token1
  PoolCreatedEntity.fee = fee
  PoolCreatedEntity.tickSpacing = tickSpacing
  PoolCreatedEntity.pool = pool
  PoolCreatedEntity.save()
}
export function handleFeeAmountEnabled(event: FeeAmountEnabled): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let FeeAmountEnabledEntity = new FeeAmountEnabledV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let fee = event.params.fee
  let tickSpacing = event.params.tickSpacing

  FeeAmountEnabledEntity.transactionHash = transactionHash
  FeeAmountEnabledEntity.contractAddress = contractAddress
  FeeAmountEnabledEntity.blockNumber = blockNumber
  FeeAmountEnabledEntity.blockTime = blockTime
  FeeAmountEnabledEntity.logIndex = logIndex
  FeeAmountEnabledEntity.fee = fee
  FeeAmountEnabledEntity.tickSpacing = tickSpacing
  FeeAmountEnabledEntity.save()
}
export function handleOwnerChanged(event: OwnerChanged): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let OwnerChangedEntity = new OwnerChangedV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let oldOwner = event.params.oldOwner
  let newOwner = event.params.newOwner

  OwnerChangedEntity.transactionHash = transactionHash
  OwnerChangedEntity.contractAddress = contractAddress
  OwnerChangedEntity.blockNumber = blockNumber
  OwnerChangedEntity.blockTime = blockTime
  OwnerChangedEntity.logIndex = logIndex
  OwnerChangedEntity.oldOwner = oldOwner
  OwnerChangedEntity.newOwner = newOwner
  OwnerChangedEntity.save()
}
export function handleInitialize(event: Initialize): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let InitializeEntity = new InitializeV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let sqrtPriceX96 = event.params.sqrtPriceX96
  let tick = event.params.tick

  InitializeEntity.transactionHash = transactionHash
  InitializeEntity.contractAddress = contractAddress
  InitializeEntity.blockNumber = blockNumber
  InitializeEntity.blockTime = blockTime
  InitializeEntity.logIndex = logIndex
  InitializeEntity.sqrtPriceX96 = sqrtPriceX96
  InitializeEntity.tick = tick
  InitializeEntity.save()
}
export function handleMint(event: Mint): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let MintEntity = new MintV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let sender = event.params.sender
  let owner = event.params.owner
  let tickLower = event.params.tickLower
  let tickUpper = event.params.tickUpper
  let amount = event.params.amount
  let amount0 = event.params.amount0
  let amount1 = event.params.amount1

  MintEntity.transactionHash = transactionHash
  MintEntity.contractAddress = contractAddress
  MintEntity.blockNumber = blockNumber
  MintEntity.blockTime = blockTime
  MintEntity.logIndex = logIndex
  MintEntity.sender = sender
  MintEntity.owner = owner
  MintEntity.tickLower = tickLower
  MintEntity.tickUpper = tickUpper
  MintEntity.amount = amount
  MintEntity.amount0 = amount0
  MintEntity.amount1 = amount1
  MintEntity.save()
}
export function handleCollect(event: Collect): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let CollectEntity = new CollectV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let owner = event.params.owner
  let recipient = event.params.recipient
  let tickLower = event.params.tickLower
  let tickUpper = event.params.tickUpper
  let amount0 = event.params.amount0
  let amount1 = event.params.amount1

  CollectEntity.transactionHash = transactionHash
  CollectEntity.contractAddress = contractAddress
  CollectEntity.blockNumber = blockNumber
  CollectEntity.blockTime = blockTime
  CollectEntity.logIndex = logIndex
  CollectEntity.owner = owner
  CollectEntity.recipient = recipient
  CollectEntity.tickLower = tickLower
  CollectEntity.tickUpper = tickUpper
  CollectEntity.amount0 = amount0
  CollectEntity.amount1 = amount1
  CollectEntity.save()
}
export function handleBurn(event: Burn): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let BurnEntity = new BurnV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let owner = event.params.owner
  let tickLower = event.params.tickLower
  let tickUpper = event.params.tickUpper
  let amount = event.params.amount
  let amount0 = event.params.amount0
  let amount1 = event.params.amount1

  BurnEntity.transactionHash = transactionHash
  BurnEntity.contractAddress = contractAddress
  BurnEntity.blockNumber = blockNumber
  BurnEntity.blockTime = blockTime
  BurnEntity.logIndex = logIndex
  BurnEntity.owner = owner
  BurnEntity.tickLower = tickLower
  BurnEntity.tickUpper = tickUpper
  BurnEntity.amount = amount
  BurnEntity.amount0 = amount0
  BurnEntity.amount1 = amount1
  BurnEntity.save()
}
export function handleSwap(event: Swap): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let SwapEntity = new SwapV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let sender = event.params.sender
  let recipient = event.params.recipient
  let amount0 = event.params.amount0
  let amount1 = event.params.amount1
  let sqrtPriceX96 = event.params.sqrtPriceX96
  let liquidity = event.params.liquidity
  let tick = event.params.tick

  SwapEntity.transactionHash = transactionHash
  SwapEntity.contractAddress = contractAddress
  SwapEntity.blockNumber = blockNumber
  SwapEntity.blockTime = blockTime
  SwapEntity.logIndex = logIndex
  SwapEntity.sender = sender
  SwapEntity.recipient = recipient
  SwapEntity.amount0 = amount0
  SwapEntity.amount1 = amount1
  SwapEntity.sqrtPriceX96 = sqrtPriceX96
  SwapEntity.liquidity = liquidity
  SwapEntity.tick = tick
  SwapEntity.save()
}
export function handleFlash(event: Flash): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let FlashEntity = new FlashV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let sender = event.params.sender
  let recipient = event.params.recipient
  let amount0 = event.params.amount0
  let amount1 = event.params.amount1
  let paid0 = event.params.paid0
  let paid1 = event.params.paid1


  FlashEntity.transactionHash = transactionHash
  FlashEntity.contractAddress = contractAddress
  FlashEntity.blockNumber = blockNumber
  FlashEntity.blockTime = blockTime
  FlashEntity.logIndex = logIndex
  FlashEntity.sender = sender
  FlashEntity.recipient = recipient
  FlashEntity.amount0 = amount0
  FlashEntity.amount1 = amount1
  FlashEntity.paid0 = paid0
  FlashEntity.paid1 = paid1
  FlashEntity.save()
}
export function handleSetFeeProtocol(event: SetFeeProtocol): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let SetFeeProtocolEntity = new SetFeeProtocolV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let feeProtocol0Old = event.params.feeProtocol0Old
  let feeProtocol1Old = event.params.feeProtocol1Old
  let feeProtocol0New = event.params.feeProtocol0New
  let feeProtocol1New = event.params.feeProtocol1New

  SetFeeProtocolEntity.transactionHash = transactionHash
  SetFeeProtocolEntity.contractAddress = contractAddress
  SetFeeProtocolEntity.blockNumber = blockNumber
  SetFeeProtocolEntity.blockTime = blockTime
  SetFeeProtocolEntity.logIndex = logIndex
  SetFeeProtocolEntity.feeProtocol0Old = feeProtocol0Old
  SetFeeProtocolEntity.feeProtocol1Old = feeProtocol1Old
  SetFeeProtocolEntity.feeProtocol0New = feeProtocol0New
  SetFeeProtocolEntity.feeProtocol1New = feeProtocol1New
  SetFeeProtocolEntity.save()
}
export function handleIncreaseObservationCardinalityNext(event: IncreaseObservationCardinalityNext): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let IncreaseObservationCardinalityNextEntity = new IncreaseObservationCardinalityNextV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let observationCardinalityNextOld = event.params.observationCardinalityNextOld
  let observationCardinalityNextNew = event.params.observationCardinalityNextNew

  IncreaseObservationCardinalityNextEntity.transactionHash = transactionHash
  IncreaseObservationCardinalityNextEntity.contractAddress = contractAddress
  IncreaseObservationCardinalityNextEntity.blockNumber = blockNumber
  IncreaseObservationCardinalityNextEntity.blockTime = blockTime
  IncreaseObservationCardinalityNextEntity.logIndex = logIndex
  IncreaseObservationCardinalityNextEntity.observationCardinalityNextOld = observationCardinalityNextOld
  IncreaseObservationCardinalityNextEntity.observationCardinalityNextNew = observationCardinalityNextNew
  IncreaseObservationCardinalityNextEntity.save()
}
export function handleCollectProtocol(event: CollectProtocol): void {
  let transactionHash = event.transaction.hash
  let contractAddress = event.address
  let blockNumber = event.block.number
  let blockTime = event.block.timestamp
  let logIndex = event.logIndex
  let CollectProtocolEntity = new CollectProtocolV0Event(`${transactionHash.toHexString()}-${logIndex}`)
  let sender = event.params.sender
  let recipient = event.params.recipient
  let amount0 = event.params.amount0
  let amount1 = event.params.amount1

  CollectProtocolEntity.transactionHash = transactionHash
  CollectProtocolEntity.contractAddress = contractAddress
  CollectProtocolEntity.blockNumber = blockNumber
  CollectProtocolEntity.blockTime = blockTime
  CollectProtocolEntity.logIndex = logIndex
  CollectProtocolEntity.sender = sender
  CollectProtocolEntity.recipient = recipient
  CollectProtocolEntity.amount0 = amount0
  CollectProtocolEntity.amount1 = amount1
  CollectProtocolEntity.save()
}
