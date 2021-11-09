import { Global } from "../generated/schema";
import { BigDecimal } from "@graphprotocol/graph-ts";

export let ZERO_BD = BigDecimal.fromString("0");

export function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = 0; i < decimals; i++) {
      bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function getOrCreateGlobal(): Global {
  let global = Global.load("1");
  if (global == null) {
      global = new Global("1");
      global.registrationFees = ZERO_BD;
      global.renewalFees = ZERO_BD;
  }
  return global as Global;
}
