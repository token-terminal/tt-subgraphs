import { Address, BigDecimal } from '@graphprotocol/graph-ts'
import { NewPriceOracle } from '../generated/Comptroller/Comptroller'
import { CToken as CTokenTemplate } from '../generated/templates'
import { MarketListed } from '../generated/Comptroller/Comptroller'
import { AccrueInterest, NewReserveFactor } from '../generated/templates/CToken/CToken'
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
import { MANTISSA_FACTOR, QIAVAX_TOKEN_ADDRESS, WAVAX_TOKEN_ADDRESS } from './constants'

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
  let tryName = ctoken.try_name()
  let trySymbol = ctoken.try_symbol()
  let tryReserveFactorMantissa = ctoken.try_reserveFactorMantissa()

  if (ctokenAddress == Address.fromString(QIAVAX_TOKEN_ADDRESS) && !tryReserveFactorMantissa.reverted) {
    let token = getOrCreateToken(WAVAX_TOKEN_ADDRESS)
    token.save()

    let market = getOrCreateMarket(ctokenAddress.toHexString(), token)
    market.denomination = token.id
    market.name = 'Benqi AVAX'
    market.symbol = 'qiAVAX'
    market.reserveFactor = amountToDenomination(tryReserveFactorMantissa.value, MANTISSA_FACTOR)
    market.save()
    return
  }

  if (!tryDenomination.reverted && !tryName.reverted && !trySymbol.reverted && !tryReserveFactorMantissa.reverted) {
    let token = getOrCreateToken(tryDenomination.value.toHexString())
    token.save()

    let market = getOrCreateMarket(ctokenAddress.toHexString(), token)
    market.denomination = token.id
    market.name = tryName.value
    market.symbol = trySymbol.value
    market.reserveFactor = amountToDenomination(tryReserveFactorMantissa.value, MANTISSA_FACTOR)
    market.save()
  }
}

export function handleAccrueInterest(event: AccrueInterest): void {
  let interestAccumulated = event.params.interestAccumulated
  let marketAddress = event.address.toHexString()

  if (!isMarket(marketAddress)) {
    return
  }

  let market = getMarket(marketAddress)
  let token = getOrCreateToken(market.denomination)

  let ctoken = CToken.bind(Address.fromString(marketAddress))
  let tryTotalBorrows = ctoken.try_totalBorrows()
  let tryTotalSupply = ctoken.try_totalSupply()
  let tryCTokenDecimals = ctoken.try_decimals()
  let tryBorrowRatePerTimestamp = ctoken.try_borrowRatePerTimestamp()
  let tryExchangeRateStored = ctoken.try_exchangeRateStored()

  if (
    !tryTotalBorrows.reverted &&
    !tryTotalSupply.reverted &&
    !tryCTokenDecimals.reverted &&
    !tryBorrowRatePerTimestamp.reverted &&
    !tryExchangeRateStored.reverted
  ) {
    let supplyRate = tryBorrowRatePerTimestamp.value.toBigDecimal().div(MANTISSA_FACTOR_EXP)

    let exchangeRate = tryExchangeRateStored.value
      .toBigDecimal()
      .div(exponentToBigDecimal(token.decimals))
      .div(MANTISSA_FACTOR_EXP)

    market.totalBorrows = amountToDenomination(tryTotalBorrows.value, token.decimals)
    market.supplyRate = supplyRate
    market.exchangeRate = exchangeRate
    market.totalSupply = amountToDenomination(tryTotalSupply.value, tryCTokenDecimals.value).times(exchangeRate)
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
