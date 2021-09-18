import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import { Vault, Strategy, Token } from "../generated/schema";
import { ERC20 } from "../generated/templates/Vault/ERC20"

export let ZERO_BD = BigDecimal.fromString("0");
export let ZERO_BI = BigInt.fromString("0");

export function createOrLoadVault(id: string, token: Token): Vault {
  let vault = Vault.load(id);
  if (vault == null) {
      vault = new Vault(id);
      vault.totalYieldGenerated = ZERO_BD;
      vault.totalProtocolFeesGenerated = ZERO_BD;
      vault.totalVaultPerformanceFeesGenerated = ZERO_BD;
      vault.totalManagementFeesGenerated = ZERO_BD;
      vault.totalStrategistPerformanceFeesGenerated = ZERO_BD;
      vault.totalAssets = ZERO_BD;
      vault.totalDebt = ZERO_BD;
      vault.denomination = token.id;
  }
  return vault as Vault;
}

export function createOrLoadToken(id: string): Token {
  let token = Token.load(id);
  if (token == null) {
      let tokenContract = ERC20.bind(Address.fromString(id));
      token = new Token(id);
      token.address = Address.fromString(id);
      token.name = tokenContract.try_name().reverted ? null : tokenContract.try_name().value
      token.symbol = tokenContract.try_symbol().reverted ? null : tokenContract.try_symbol().value
      token.decimals = tokenContract.try_decimals().reverted ? null : tokenContract.try_decimals().value
      token.totalSupply = tokenContract.try_totalSupply().reverted ? null : tokenContract.try_totalSupply().value
  }
  return token as Token;
}

export function loadVault(id: string): Vault {
  return Vault.load(id) as Vault;
}

export function isVault(id: string): boolean {
  return loadVault(id) !== null;
}

export function createOrLoadStrategy(id: string, vault: Vault): Strategy {
  let strategy = Strategy.load(id);
  if (strategy == null) {
      strategy = new Strategy(id);
      strategy.vault = vault.id;
  }
  return strategy as Strategy;
}

export function loadStrategy(id: string): Strategy {
  return Strategy.load(id) as Strategy;
}

export function isStrategy(id: string): boolean {
  return loadStrategy(id) !== null;
}

export function amountToDenomination(amount: BigInt, decimals: i32): BigDecimal {
  return amount.toBigDecimal().div(BigInt.fromI32(10).pow(decimals as u8).toBigDecimal());
}

export function getTokenDecimals(tokenAddress: Address): i32 {
  let token = ERC20.bind(tokenAddress);
  let result = token.try_decimals();
  return result.reverted ? 0 : result.value;
}
