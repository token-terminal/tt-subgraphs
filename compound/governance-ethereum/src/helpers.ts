import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import { Token, TokenHolder, GovernanceToken } from "../generated/schema";
import { ERC20 } from "../generated/Comp/ERC20";

export let ZERO_BD = BigDecimal.fromString("0");
export let ZERO_BI = BigInt.fromString("0");
export let ONE_BI = BigInt.fromString("1");

export function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function correctForDecimals(value: BigInt, decimals: i32): BigDecimal {
  let valueNative = value.toBigDecimal().div(exponentToBigDecimal(decimals));
  return valueNative as BigDecimal;
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
      ? ZERO_BD
      : correctForDecimals(
          tokenContract.try_totalSupply().value,
          token.decimals
        );
  }
  return token as Token;
}

export function getOrCreateGovernanceToken(token: Token): GovernanceToken {
  let governanceToken = GovernanceToken.load(token.address.toHexString());
  if (governanceToken == null) {
    governanceToken = new GovernanceToken(token.address.toHexString());
    governanceToken.numberOfTokenHolders = ZERO_BI;
    governanceToken.token = token.id;
  }
  return governanceToken as GovernanceToken;
}

export function createTokenHolder(
  id: string,
  governanceToken: GovernanceToken
): TokenHolder {
  let tokenHolder = new TokenHolder(id);
  tokenHolder.address = Address.fromString(id);
  tokenHolder.balance = ZERO_BD;
  tokenHolder.governanceToken = governanceToken.id;
  tokenHolder.updatedAtBlock = ZERO_BI;
  tokenHolder.updatedAtTimestamp = ZERO_BI;

  return tokenHolder as TokenHolder;
}
