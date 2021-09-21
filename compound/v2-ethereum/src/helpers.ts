import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import { Comptroller, ComptrollerImplementation, Market } from "../generated/schema";
import { ERC20 } from "../generated/templates/CToken/ERC20";

export let ZERO_BD = BigDecimal.fromString("0");
export let ZERO_BI = BigInt.fromString("0");

export function getOrCreateComptrollerImplementation(id: string): ComptrollerImplementation {
  let comptroller = ComptrollerImplementation.load(id);
  if (comptroller == null) {
      comptroller = new ComptrollerImplementation(id);
  }
  return comptroller as ComptrollerImplementation;
}

export function getOrCreateComptroller(): Comptroller {
  let comptroller = Comptroller.load("1");
  if (comptroller == null) {
      comptroller = new Comptroller("1");
  }
  return comptroller as Comptroller;
}

export function getOrCreateMarket(id: string): Market {
  let market = Market.load(id);
  if (market == null) {
      market = new Market(id);
      market.totalFeesGenerated = ZERO_BD;
      market.totalBorrows = ZERO_BD;
      market.totalSupply = ZERO_BD;
      market.supplyRate = ZERO_BD;
      market.denomination = null;
  }
  return market as Market;
}

export function getMarket(id: string): Market {
  return Market.load(id) as Market;
}

export function isMarket(id: string): boolean {
  return getMarket(id) !== null;
}

export function amountToDenomination(amount: BigInt, decimals: i32): BigDecimal {
  return amount.toBigDecimal().div(BigInt.fromI32(10).pow(decimals as u8).toBigDecimal());
}

export function getTokenDecimals(tokenAddress: Address): i32 {
  let token = ERC20.bind(tokenAddress);
  let result = token.try_decimals();
  return result.reverted ? 0 : result.value;
}

export function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}
