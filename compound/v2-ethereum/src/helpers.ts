import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import { ComptrollerImplementation, Market } from "../generated/schema";

export let ZERO_BD = BigDecimal.fromString("0");
export let ZERO_BI = BigInt.fromString("0");

export function createOrLoadComptrollerImplementation(id: string): ComptrollerImplementation {
  let comptroller = ComptrollerImplementation.load(id);
  if (comptroller == null) {
      comptroller = new ComptrollerImplementation(id);
  }
  return comptroller as ComptrollerImplementation;
}

export function createOrLoadMarket(id: string): Market {
  let market = Market.load(id);
  if (market == null) {
      market = new Market(id);
  }
  return market as Market;
}