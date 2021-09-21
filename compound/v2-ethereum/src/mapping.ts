import { Address, BigDecimal } from "@graphprotocol/graph-ts";
import {
  NewImplementation,
  NewPriceOracle
} from "../generated/Comptroller/Comptroller";
import { CToken as CTokenTemplate } from "../generated/templates";
import { MarketListed } from "../generated/Comptroller/Comptroller";
import { AccrueInterest } from "../generated/templates/CToken/CToken";
import { CToken } from "../generated/templates/CToken/CToken";
import { getOrCreateComptroller, getOrCreateMarket, getOrCreateToken, getMarket, isMarket, amountToDenomination, exponentToBigDecimal } from "./helpers";
import { CETH_TOKEN_ADDRESS, WETH_TOKEN_ADDRESS, YEARLY_BORROW_RATE, MANTISSA_FACTOR } from "./constants";

let MANTISSA_FACTOR_EXP: BigDecimal = exponentToBigDecimal(MANTISSA_FACTOR);

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

  let tryDenomination = ctoken.try_underlying();

  if (ctokenAddress == Address.fromString(CETH_TOKEN_ADDRESS)) {
    let token = getOrCreateToken(WETH_TOKEN_ADDRESS);
    token.save();

    let market = getOrCreateMarket(ctokenAddress.toHexString(), token);
    market.denomination = token.id;
    market.save();
  } else {
    if (!tryDenomination.reverted) {
      let token = getOrCreateToken(tryDenomination.value.toHexString());
      token.save();

      let market = getOrCreateMarket(ctokenAddress.toHexString(), token);
      market.denomination = token.id;
      market.save();
    }
  }
}

export function handleAccrueInterest(event: AccrueInterest): void {
  let interestAccumulated = event.params.interestAccumulated;
  let marketAddress = event.address.toHexString()

  if (!isMarket(marketAddress)) {
    return;
  }

  let market = getMarket(marketAddress);
  let token = getOrCreateToken(market.denomination);

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
    market.totalBorrows = amountToDenomination(tryTotalBorrows.value, token.decimals);
    market.supplyRate = supplyRate;
    market.totalSupply = amountToDenomination(tryTotalSupply.value, tryCTokenDecimals.value.toI32()).times(supplyRate);
  }

  let feesGenerated = amountToDenomination(interestAccumulated, token.decimals);

  market.totalFeesGenerated = market.totalFeesGenerated.plus(feesGenerated);
  market.save();
}