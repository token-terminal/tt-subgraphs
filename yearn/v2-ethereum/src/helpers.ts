import { BigDecimal, BigInt, Address } from '@graphprotocol/graph-ts'
import { Vault, Strategy, Token } from '../generated/schema'
import { ERC20 } from '../generated/templates/Vault/ERC20'

export let ZERO_BD = BigDecimal.fromString('0')
export let ZERO_BI = BigInt.fromString('0')

export function getOrCreateVault(id: string, token: Token): Vault {
  let vault = Vault.load(id)
  if (vault == null) {
    vault = new Vault(id)
    vault.totalYieldGenerated = ZERO_BD
    vault.totalProtocolFeesGenerated = ZERO_BD
    vault.totalVaultPerformanceFeesGenerated = ZERO_BD
    vault.totalManagementFeesGenerated = ZERO_BD
    vault.totalStrategistPerformanceFeesGenerated = ZERO_BD
    vault.totalAssets = ZERO_BD
    vault.totalDebt = ZERO_BD
    vault.denomination = token.id
  }
  return vault as Vault
}

export function getOrCreateToken(id: string): Token {
  let token = Token.load(id)
  if (token == null) {
    let tokenContract = ERC20.bind(Address.fromString(id))
    token = new Token(id)
    token.address = Address.fromString(id)
    token.name = tokenContract.try_name().reverted ? '' : tokenContract.try_name().value
    token.symbol = tokenContract.try_symbol().reverted ? '' : tokenContract.try_symbol().value
    token.decimals = tokenContract.try_decimals().reverted ? 18 : tokenContract.try_decimals().value
    token.totalSupply = tokenContract.try_totalSupply().reverted ? ZERO_BI : tokenContract.try_totalSupply().value
  }
  return token as Token
}

export function getOrCreateStrategy(id: string, vault: Vault): Strategy {
  let strategy = Strategy.load(id)
  if (strategy == null) {
    strategy = new Strategy(id)
    strategy.vault = vault.id
  }
  return strategy as Strategy
}

export function amountToDenomination(amount: BigInt, decimals: i32): BigDecimal {
  return amount.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(decimals as u8)
      .toBigDecimal()
  )
}

export function getTokenDecimals(tokenAddress: Address): i32 {
  let token = ERC20.bind(tokenAddress)
  let result = token.try_decimals()
  return result.reverted ? 0 : result.value
}
