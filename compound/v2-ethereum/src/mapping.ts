import { Address, BigDecimal } from "@graphprotocol/graph-ts";
import {
  NewImplementation,
  NewPriceOracle
} from "../generated/Comptroller/Comptroller";
import { CToken as CTokenTemplate } from "../generated/templates";
import { MarketListed } from "../generated/Comptroller/Comptroller";
import { AccrueInterest } from "../generated/templates/CToken/CToken";
import { CToken } from "../generated/templates/CToken/CToken";
import { ComptrollerImplementationEvent } from "../generated/schema";
import { getOrCreateComptroller, getOrCreateComptrollerImplementation, getOrCreateMarket, getMarket, isMarket, getTokenDecimals, amountToDenomination, exponentToBigDecimal } from "./helpers";
import { CETH_TOKEN_ADDRESS, WETH_TOKEN_ADDRESS, YEARLY_BORROW_RATE, MANTISSA_FACTOR } from "./constants";

let MANTISSA_FACTOR_EXP: BigDecimal = exponentToBigDecimal(MANTISSA_FACTOR);

export function handleNewImplementation(event: NewImplementation): void {
  let newComptrollerImplementationEvent = new ComptrollerImplementationEvent(event.transaction.hash.toHexString());
  
  let newImplementation = event.params.newImplementation;

  newComptrollerImplementationEvent.newImplementation = newImplementation;
  newComptrollerImplementationEvent.save();

  let comptroller = getOrCreateComptrollerImplementation(newImplementation.toHexString());
  comptroller.save();
}

export function handleNewPriceOracle(event: NewPriceOracle): void {
  let comptroller = getOrCreateComptroller();
  let priceOracle = event.params.newPriceOracle;
  comptroller.priceOracle = priceOracle;
  comptroller.save();
}

export function handleMarketListed(event: MarketListed): void {
  let ctokenAddress = event.params.cToken;

  CTokenTemplate.create(ctokenAddress);

  let ctoken = CToken.bind(ctokenAddress);

  let tryDenominaton = ctoken.try_underlying();
  let market = getOrCreateMarket(ctokenAddress.toHexString());  

  if (ctokenAddress == Address.fromString(CETH_TOKEN_ADDRESS)) {
    market.denomination = Address.fromString(WETH_TOKEN_ADDRESS);
  } else {
    if (!tryDenominaton.reverted) {
      market.denomination = tryDenominaton.value;
    }
  }
  market.save();
}

export function handleAccrueInterest(event: AccrueInterest): void {
  let interestAccumulated = event.params.interestAccumulated;
  let marketAddress = event.address.toHexString()

  if (!isMarket(marketAddress)) {
    return;
  }

  let market = getMarket(marketAddress);
  let underlyingDecimals = getTokenDecimals(market.denomination as Address);

  let ctoken = CToken.bind(Address.fromString(marketAddress));
  let tryTotalBorrows = ctoken.try_totalBorrows();
  let tryTotalSupply = ctoken.try_totalSupply();
  let tryCTokenDecimals = ctoken.try_decimals();
  let tryBorrowRatePerBlock = ctoken.try_borrowRatePerBlock();

  if (!tryTotalBorrows.reverted && !tryTotalSupply.reverted && !tryCTokenDecimals.reverted && !tryBorrowRatePerBlock.reverted) {
    let supplyRate = tryBorrowRatePerBlock
      .value
      .toBigDecimal()
      .times(BigDecimal.fromString(YEARLY_BORROW_RATE))
      .div(MANTISSA_FACTOR_EXP)
    market.totalBorrows = amountToDenomination(tryTotalBorrows.value, underlyingDecimals);
    market.supplyRate = supplyRate;
    market.totalSupply = amountToDenomination(tryTotalSupply.value, tryCTokenDecimals.value.toI32()).times(supplyRate);
  }

  let feesGenerated = amountToDenomination(interestAccumulated, underlyingDecimals);

  market.totalFeesGenerated = market.totalFeesGenerated.plus(feesGenerated);
  market.save();
}