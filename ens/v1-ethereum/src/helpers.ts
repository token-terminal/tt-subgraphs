import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import { Global, Token } from "../generated/schema";
import { ERC20 } from "../generated/EthRegistrarController/ERC20";

export let ZERO_BD = BigDecimal.fromString("0");
export let ZERO_BI = BigInt.fromString("0");

export function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function getOrCreateGlobal(token: Token): Global {
  let global = Global.load("1");
  if (global == null) {
    global = new Global("1");
    global.registrationFees = ZERO_BD;
    global.renewalFees = ZERO_BD;
    global.denomination = token.id;
  }
  return global as Global;
}

export function getOrCreateToken(id: string): Token {
  let token = Token.load(id);
  if (token == null) {
    let tokenContract = ERC20.bind(Address.fromString(id));
    token = new Token(id);
    token.address = Address.fromString(id);
    token.name = tokenContract.try_name().reverted
      ? ""
      : tokenContract.try_name().value;
    token.symbol = tokenContract.try_symbol().reverted
      ? ""
      : tokenContract.try_symbol().value;
    token.decimals = tokenContract.try_decimals().reverted
      ? 18
      : tokenContract.try_decimals().value;
    token.totalSupply = tokenContract.try_totalSupply().reverted
      ? ZERO_BI
      : tokenContract.try_totalSupply().value;
  }
  return token as Token;
}
