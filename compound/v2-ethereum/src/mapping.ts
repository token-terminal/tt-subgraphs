import { Address } from "@graphprotocol/graph-ts";
import {
  NewImplementation,
} from "../generated/Comptroller/Comptroller";
import { CToken as CTokenTemplate } from "../generated/templates";
import { MarketListed } from "../generated/Comptroller/Comptroller";
import { AccrueInterest } from "../generated/templates/CToken/CToken";
import { CToken } from "../generated/templates/CToken/CToken";
import { ComptrollerImplementationEvent } from "../generated/schema";
import { getOrCreateComptrollerImplementation, getOrCreateMarket, getMarket, isMarket, getTokenDecimals, amountToDenomination } from "./helpers";
import { CETH_TOKEN_ADDRESS, WETH_TOKEN_ADDRESS } from "./constants";

export function handleNewImplementation(event: NewImplementation): void {
  let newComptrollerImplementationEvent = new ComptrollerImplementationEvent(event.transaction.hash.toHexString());
  
  let newImplementation = event.params.newImplementation;

  newComptrollerImplementationEvent.newImplementation = newImplementation;
  newComptrollerImplementationEvent.save();

  let comptroller = getOrCreateComptrollerImplementation(newImplementation.toHexString());
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
  let totalBorrows = event.params.totalBorrows;
  let marketAddress = event.address.toHexString()

  if (!isMarket(marketAddress)) {
    return;
  }

  let market = getMarket(marketAddress);

  let underlyingDecimals = getTokenDecimals(market.denomination as Address);
  let feesGenerated = amountToDenomination(interestAccumulated, underlyingDecimals);
  let borrows = amountToDenomination(totalBorrows, underlyingDecimals);

  market.totalFeesGenerated = market.totalFeesGenerated.plus(feesGenerated);
  market.totalBorrows = borrows;
  market.save();
}