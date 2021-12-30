import {
    IncreaseLiquidity,
    DecreaseLiquidity,
    Collect
} from "../../generated/NonfungiblePositionManager/NonfungiblePositionManager"
import {
    IncreaseLiquidityV0Event,
    DecreaseLiquidityV0Event,
    CollectV1Event,
} from "../../generated/schema"

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
    let transactionHash = event.transaction.hash
    let contractAddress = event.address
    let blockNumber = event.block.number
    let blockTime = event.block.timestamp
    let logIndex = event.logIndex
    let IncreaseLiquidityEntity = new IncreaseLiquidityV0Event(`${transactionHash.toHexString()}-${logIndex}`)
    let tokenId = event.params.tokenId
    let liquidity = event.params.liquidity
    let amount0 = event.params.amount0
    let amount1 = event.params.amount1

    IncreaseLiquidityEntity.transactionHash = transactionHash
    IncreaseLiquidityEntity.contractAddress = contractAddress
    IncreaseLiquidityEntity.blockNumber = blockNumber
    IncreaseLiquidityEntity.blockTime = blockTime
    IncreaseLiquidityEntity.logIndex = logIndex
    IncreaseLiquidityEntity.tokenId = tokenId
    IncreaseLiquidityEntity.liquidity = liquidity
    IncreaseLiquidityEntity.amount0 = amount0
    IncreaseLiquidityEntity.amount1 = amount1
    IncreaseLiquidityEntity.save()
}
export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
    let transactionHash = event.transaction.hash
    let contractAddress = event.address
    let blockNumber = event.block.number
    let blockTime = event.block.timestamp
    let logIndex = event.logIndex
    let DecreaseLiquidityEntity = new DecreaseLiquidityV0Event(`${transactionHash.toHexString()}-${logIndex}`)
    let tokenId = event.params.tokenId
    let liquidity = event.params.liquidity
    let amount0 = event.params.amount0
    let amount1 = event.params.amount1

    DecreaseLiquidityEntity.transactionHash = transactionHash
    DecreaseLiquidityEntity.contractAddress = contractAddress
    DecreaseLiquidityEntity.blockNumber = blockNumber
    DecreaseLiquidityEntity.blockTime = blockTime
    DecreaseLiquidityEntity.logIndex = logIndex
    DecreaseLiquidityEntity.tokenId = tokenId
    DecreaseLiquidityEntity.liquidity = liquidity
    DecreaseLiquidityEntity.amount0 = amount0
    DecreaseLiquidityEntity.amount1 = amount1
    DecreaseLiquidityEntity.save()
}
export function handleCollect(event: Collect): void {
    let transactionHash = event.transaction.hash
    let contractAddress = event.address
    let blockNumber = event.block.number
    let blockTime = event.block.timestamp
    let logIndex = event.logIndex
    let CollectEntity = new CollectV1Event(`${transactionHash.toHexString()}-${logIndex}`)
    let tokenId = event.params.tokenId
    let recipient = event.params.recipient
    let amount0 = event.params.amount0
    let amount1 = event.params.amount1

    CollectEntity.transactionHash = transactionHash
    CollectEntity.contractAddress = contractAddress
    CollectEntity.blockNumber = blockNumber
    CollectEntity.blockTime = blockTime
    CollectEntity.logIndex = logIndex
    CollectEntity.tokenId = tokenId
    CollectEntity.recipient = recipient
    CollectEntity.amount0 = amount0
    CollectEntity.amount1 = amount1
    CollectEntity.save()
}
