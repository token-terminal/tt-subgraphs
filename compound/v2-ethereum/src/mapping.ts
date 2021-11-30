import { Address, BigDecimal } from '@graphprotocol/graph-ts'
import { NewImplementation, NewPriceOracle } from '../generated/Comptroller/Comptroller'
import { CToken as CTokenTemplate } from '../generated/templates'
import { MarketListed } from '../generated/Comptroller/Comptroller'
import {
  AccrueInterest as AccrueInterest0,
  AccrueInterest1,
  NewReserveFactor,
} from '../generated/templates/CToken/CToken'
import { CToken } from '../generated/templates/CToken/CToken'
import {
  getOrCreateComptroller,
  getOrCreateMarket,
  getOrCreateToken,
  getMarket,
  isMarket,
  amountToDenomination,
  exponentToBigDecimal,
} from './helpers'
import { CETH_TOKEN_ADDRESS, WETH_TOKEN_ADDRESS, YEARLY_BORROW_RATE, MANTISSA_FACTOR } from './constants'

let MANTISSA_FACTOR_EXP: BigDecimal = exponentToBigDecimal(MANTISSA_FACTOR)

export function handleNewPriceOracle(event: NewPriceOracle): void {
  let comptroller = getOrCreateComptroller()
  let priceOracle = event.params.newPriceOracle
  comptroller.priceOracle = priceOracle
  comptroller.save()
}

export function handleMarketListed(event: MarketListed): void {
  let ctokenAddress = event.params.cToken

  CTokenTemplate.create(ctokenAddress)

  let ctoken = CToken.bind(ctokenAddress)

  let tryDenomination = ctoken.try_underlying()
  let trySymbol = ctoken.try_symbol()

  if (ctokenAddress == Address.fromString(CETH_TOKEN_ADDRESS)) {
    let token = getOrCreateToken(WETH_TOKEN_ADDRESS)
    token.save()

    let market = getOrCreateMarket(ctokenAddress.toHexString(), token)
    market.denomination = token.id
    market.symbol = 'cETH'
    market.save()
  } else {
    if (!tryDenomination.reverted && !trySymbol.reverted) {
      let token = getOrCreateToken(tryDenomination.value.toHexString())
      token.save()

      let market = getOrCreateMarket(ctokenAddress.toHexString(), token)
      market.denomination = token.id
      market.symbol = trySymbol.value
      market.save()
    }
  }
}

export function handleAccrueInterest0(event: AccrueInterest0): void {
  let interestAccumulated = event.params.interestAccumulated
  let marketAddress = event.address.toHexString()

  if (!isMarket(marketAddress)) {
    return
  }

  let market = getMarket(marketAddress)
  let token = getOrCreateToken(market.denomination)

  let ctoken = CToken.bind(Address.fromString(marketAddress))
  let tryTotalBorrows = ctoken.try_totalBorrows()
  let tryTotalReserves = ctoken.try_totalReserves()
  let tryTotalSupply = ctoken.try_totalSupply()
  let tryCTokenDecimals = ctoken.try_decimals()
  let tryBorrowRatePerBlock = ctoken.try_borrowRatePerBlock()
  let tryExchangeRateStored = ctoken.try_exchangeRateStored()

  if (
    !tryTotalBorrows.reverted &&
    !tryTotalReserves.reverted &&
    !tryTotalSupply.reverted &&
    !tryCTokenDecimals.reverted &&
    !tryBorrowRatePerBlock.reverted &&
    !tryExchangeRateStored.reverted
  ) {
    let supplyRate = tryBorrowRatePerBlock.value
      .toBigDecimal()
      .times(BigDecimal.fromString(YEARLY_BORROW_RATE))
      .div(MANTISSA_FACTOR_EXP)

    let exchangeRate = tryExchangeRateStored.value
      .toBigDecimal()
      .div(exponentToBigDecimal(token.decimals))
      .times(exponentToBigDecimal(tryCTokenDecimals.value.toI32()))
      .div(MANTISSA_FACTOR_EXP)

    market.totalBorrows = amountToDenomination(tryTotalBorrows.value, token.decimals)
    market.totalReserves = amountToDenomination(tryTotalReserves.value, token.decimals)
    market.supplyRate = supplyRate
    market.exchangeRate = exchangeRate
    market.totalSupply = amountToDenomination(tryTotalSupply.value, tryCTokenDecimals.value.toI32()).times(exchangeRate)
  }

  let reserveFactor = market.reserveFactor

  let feesGenerated = amountToDenomination(interestAccumulated, token.decimals)
  let protocolFeesGenerated = feesGenerated.times(reserveFactor)

  market.totalFeesGenerated = market.totalFeesGenerated.plus(feesGenerated)
  market.totalProtocolFeesGenerated = market.totalProtocolFeesGenerated.plus(protocolFeesGenerated)
  market.save()
}

export function handleAccrueInterest1(event: AccrueInterest1): void {
  let interestAccumulated = event.params.interestAccumulated
  let marketAddress = event.address.toHexString()

  if (!isMarket(marketAddress)) {
    return
  }

  let market = getMarket(marketAddress)
  let token = getOrCreateToken(market.denomination)

  let ctoken = CToken.bind(Address.fromString(marketAddress))
  let tryTotalBorrows = ctoken.try_totalBorrows()
  let tryTotalReserves = ctoken.try_totalReserves()
  let tryTotalSupply = ctoken.try_totalSupply()
  let tryCTokenDecimals = ctoken.try_decimals()
  let tryBorrowRatePerBlock = ctoken.try_borrowRatePerBlock()
  let tryExchangeRateStored = ctoken.try_exchangeRateStored()

  if (
    !tryTotalBorrows.reverted &&
    !tryTotalReserves.reverted &&
    !tryTotalSupply.reverted &&
    !tryCTokenDecimals.reverted &&
    !tryBorrowRatePerBlock.reverted &&
    !tryExchangeRateStored.reverted
  ) {
    let supplyRate = tryBorrowRatePerBlock.value
      .toBigDecimal()
      .times(BigDecimal.fromString(YEARLY_BORROW_RATE))
      .div(MANTISSA_FACTOR_EXP)

    let exchangeRate = tryExchangeRateStored.value
      .toBigDecimal()
      .div(exponentToBigDecimal(token.decimals))
      .times(exponentToBigDecimal(tryCTokenDecimals.value.toI32()))
      .div(MANTISSA_FACTOR_EXP)

    market.totalBorrows = amountToDenomination(tryTotalBorrows.value, token.decimals)
    market.totalReserves = amountToDenomination(tryTotalReserves.value, token.decimals)
    market.supplyRate = supplyRate
    market.exchangeRate = exchangeRate
    market.totalSupply = amountToDenomination(tryTotalSupply.value, tryCTokenDecimals.value.toI32()).times(exchangeRate)
  }

  let reserveFactor = market.reserveFactor

  let feesGenerated = amountToDenomination(interestAccumulated, token.decimals)
  let protocolFeesGenerated = feesGenerated.times(reserveFactor)

  market.totalFeesGenerated = market.totalFeesGenerated.plus(feesGenerated)
  market.totalProtocolFeesGenerated = market.totalProtocolFeesGenerated.plus(protocolFeesGenerated)
  market.save()
}

export function handleNewReserveFactor(event: NewReserveFactor): void {
  let reserveFactorMantissa = event.params.newReserveFactorMantissa
  let marketAddress = event.address.toHexString()

  if (!isMarket(marketAddress)) {
    return
  }

  let market = getMarket(marketAddress)

  market.reserveFactor = amountToDenomination(reserveFactorMantissa, MANTISSA_FACTOR)
  market.save()
}
