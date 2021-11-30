import { BigDecimal, BigInt, Address } from '@graphprotocol/graph-ts'
import { Comptroller, Market, Token } from '../generated/schema'
import { ERC20 } from '../generated/templates/CToken/ERC20'

export let ZERO_BD = BigDecimal.fromString('0')
export let ZERO_BI = BigInt.fromString('0')

export function getOrCreateComptroller(): Comptroller {
  let comptroller = Comptroller.load('1')
  if (comptroller == null) {
    comptroller = new Comptroller('1')
  }
  return comptroller as Comptroller
}

export function getOrCreateMarket(id: string, token: Token): Market {
  let market = Market.load(id)
  if (market == null) {
    market = new Market(id)
    market.symbol = ''
    market.totalFeesGenerated = ZERO_BD
    market.totalProtocolFeesGenerated = ZERO_BD
    market.totalBorrows = ZERO_BD
    market.totalReserves = ZERO_BD
    market.totalSupply = ZERO_BD
    market.supplyRate = ZERO_BD
    market.exchangeRate = ZERO_BD
    market.reserveFactor = ZERO_BD
    market.denomination = token.id
  }
  return market as Market
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

export function getMarket(id: string): Market {
  return Market.load(id) as Market
}

export function isMarket(id: string): boolean {
  return getMarket(id) !== null
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

export function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}
