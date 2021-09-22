import { Address, BigDecimal } from "@graphprotocol/graph-ts"
import {
  NewVault,
  NewExperimentalVault
} from "../generated/Registry7/Registry";
import {
  Vault as VaultTemplate,
  Strategy as StrategyTemplate
} from "../generated/templates";
import {
  Vault,
  StrategyAdded,
  StrategyAdded1,
  StrategyReported,
  StrategyReported1,
  Transfer
} from '../generated/Registry7/Vault';
import { NewVaultEvent, NewExperimentalVaultEvent, StrategyAddedEvent, StrategyAdded_v0_3_0_v0_3_1Event, StrategyReportedEvent, StrategyReported_v0_3_0_v0_3_1Event, TransferEvent } from "../generated/schema"
import { getOrCreateVault, loadVault, isVault, getOrCreateStrategy, isStrategy, getOrCreateToken, getTokenDecimals, amountToDenomination, } from "./helpers";
import { EXCLUDED_TRANSACTIONS } from "./constants";

let BASIS_POINTS_BD = BigDecimal.fromString("10000");

export function handleNewVault(event: NewVault): void {
  let newVault = new NewVaultEvent(event.transaction.hash.toHexString());
  let timestamp = event.block.timestamp.toI32();
  let apiVersion = event.params.api_version;
  let deploymentId = event.params.deployment_id;
  let tokenAddress: Address = Address.fromString(event.params.token.toHexString());
  let vaultAddress: Address = Address.fromString(event.params.vault.toHexString());

  newVault.timestamp = timestamp;
  newVault.apiVersion = apiVersion;
  newVault.deploymentId = deploymentId;
  newVault.token = tokenAddress;
  newVault.vault = vaultAddress;
  newVault.save();

  VaultTemplate.create(event.params.vault);

  let token = getOrCreateToken(tokenAddress.toHexString());
  token.save();

  let vaultContract = Vault.bind(vaultAddress);
  let vault = getOrCreateVault(vaultAddress.toHexString(), token);
  
  let trySymbol = vaultContract.try_symbol();
  let tryName = vaultContract.try_name();
  let tryDecimals = vaultContract.try_decimals();
  let tryTotalAssets = vaultContract.try_totalAssets();
  let tryTotalDebt = vaultContract.try_totalDebt();
  let tryPricePerShare = vaultContract.try_pricePerShare();

  if (!trySymbol.reverted && !tryName.reverted && !tryDecimals.reverted && !tryTotalAssets.reverted && !tryTotalDebt.reverted && !tryPricePerShare.reverted) {
    vault.symbol = trySymbol.value;
    vault.name = tryName.value;
    vault.denomination = token.id;

    let pricePerShare = amountToDenomination(tryPricePerShare.value, token.decimals);
    vault.pricePerShare = pricePerShare;
    vault.totalAssets = amountToDenomination(tryTotalAssets.value, token.decimals).div(pricePerShare);;
    vault.totalDebt = amountToDenomination(tryTotalDebt.value, token.decimals).div(pricePerShare);
  }
  vault.save();
}

export function handleNewExperimentalVault(event: NewExperimentalVault): void {
  let newExperimentalVault = new NewExperimentalVaultEvent(event.transaction.hash.toHexString());
  let timestamp = event.block.timestamp.toI32();
  let apiVersion = event.params.api_version;
  let deployer: Address = Address.fromString(event.params.deployer.toHexString());
  let tokenAddress: Address = Address.fromString(event.params.token.toHexString());
  let vaultAddress: Address = Address.fromString(event.params.vault.toHexString());

  newExperimentalVault.timestamp = timestamp;
  newExperimentalVault.apiVersion = apiVersion;
  newExperimentalVault.deployer = deployer;
  newExperimentalVault.token = tokenAddress;
  newExperimentalVault.vault = vaultAddress;
  newExperimentalVault.save();

  VaultTemplate.create(vaultAddress);

  let token = getOrCreateToken(tokenAddress.toHexString());
  token.save();

  let vaultContract = Vault.bind(vaultAddress);
  let vault = getOrCreateVault(vaultAddress.toHexString(), token);

  let trySymbol = vaultContract.try_symbol();
  let tryName = vaultContract.try_name();
  let tryDecimals = vaultContract.try_decimals();
  let tryTotalAssets = vaultContract.try_totalAssets();
  let tryTotalDebt = vaultContract.try_totalDebt();
  let tryPricePerShare = vaultContract.try_pricePerShare();

  if (!trySymbol.reverted && !tryName.reverted && !tryDecimals.reverted && !tryTotalAssets.reverted && !tryTotalDebt.reverted && !tryPricePerShare.reverted) {
    vault.symbol = trySymbol.value;
    vault.name = tryName.value;
    vault.denomination = token.id;

    let pricePerShare = amountToDenomination(tryPricePerShare.value, token.decimals);
    vault.pricePerShare = pricePerShare;
    vault.totalAssets = amountToDenomination(tryTotalAssets.value, token.decimals).div(pricePerShare);;
    vault.totalDebt = amountToDenomination(tryTotalDebt.value, token.decimals).div(pricePerShare);
  }
  vault.save();
}

export function handleStrategyAdded(event: StrategyAdded1): void {
  let newStrategyAdded = new StrategyAddedEvent(event.transaction.hash.toHexString());
  let timestamp = event.block.timestamp.toI32();
  let debtRatio = event.params.debtRatio;
  let maxDebtPerHarvest = event.params.maxDebtPerHarvest;
  let minDebtPerHarvest = event.params.minDebtPerHarvest;
  let performanceFee = event.params.performanceFee;
  let strategyAddress = event.params.strategy;
  let vaultAddress = event.address;

  newStrategyAdded.timestamp = timestamp;
  newStrategyAdded.debtRatio = debtRatio;
  newStrategyAdded.maxDebtPerHarvest = maxDebtPerHarvest;
  newStrategyAdded.minDebtPerHarvest = minDebtPerHarvest;
  newStrategyAdded.performanceFee = performanceFee;
  newStrategyAdded.strategyAddress = strategyAddress;
  newStrategyAdded.save();

  let vault = loadVault(vaultAddress.toHexString());
  let strategy = getOrCreateStrategy(strategyAddress.toHexString(), vault);
  strategy.save();

  StrategyTemplate.create(strategyAddress);

}

export function handleStrategyAdded_v0_3_0_v0_3_1(event: StrategyAdded): void {
  let newStrategyAdded = new StrategyAdded_v0_3_0_v0_3_1Event(event.transaction.hash.toHexString());
  let timestamp = event.block.timestamp.toI32();
  let debtLimit = event.params.debtLimit;
  let rateLimit = event.params.rateLimit;
  let performanceFee = event.params.performanceFee;
  let strategyAddress = event.params.strategy;
  let vaultAddress = event.address;

  newStrategyAdded.timestamp = timestamp;
  newStrategyAdded.debtLimit = debtLimit;
  newStrategyAdded.rateLimit = rateLimit;
  newStrategyAdded.performanceFee = performanceFee;
  newStrategyAdded.strategyAddress = strategyAddress;
  newStrategyAdded.save();

  let vault = loadVault(vaultAddress.toHexString());
  let strategy = getOrCreateStrategy(strategyAddress.toHexString(), vault);
  strategy.save();

  StrategyTemplate.create(strategyAddress);
}

export function handleStrategyReported(event: StrategyReported1): void {
  let transactionHash = event.transaction.hash;

  if (EXCLUDED_TRANSACTIONS.includes(transactionHash.toHexString())) {
    return
  }

  let strategyReported = new StrategyReportedEvent(event.transaction.hash.toHexString());
  let timestamp = event.block.timestamp.toI32();
  let debtAdded = event.params.debtAdded;
  let gain = event.params.gain;
  let loss = event.params.loss;
  let strategyAddress: Address = Address.fromString(event.params.strategy.toHexString());
  let totalDebt = event.params.totalDebt;
  let totalGain = event.params.totalGain;
  let totalLoss = event.params.totalLoss;

  strategyReported.timestamp = timestamp;
  strategyReported.debtAdded = debtAdded;
  strategyReported.gain = gain;
  strategyReported.loss = loss;
  strategyReported.strategy = strategyAddress;
  strategyReported.totalDebt = totalDebt;
  strategyReported.totalGain = totalGain;
  strategyReported.totalLoss = totalLoss;
  strategyReported.save();

  let vaultContract = Vault.bind(event.address);
  let vault = loadVault(event.address.toHexString());
  let token = getOrCreateToken(vault.denomination);

  let yieldGenerated = amountToDenomination(gain, token.decimals);
  let performanceFeesGenerated = yieldGenerated.times(vaultContract.performanceFee().toBigDecimal().div(BASIS_POINTS_BD))

  let tryPricePerShare = vaultContract.try_pricePerShare();
  let tryTotalAssets = vaultContract.try_totalAssets();
  let tryTotalDebt = vaultContract.try_totalDebt();

  if (!tryPricePerShare && !tryTotalAssets && !tryTotalDebt) {
    vault.totalDebt = amountToDenomination(tryTotalDebt.value, token.decimals).div(amountToDenomination(tryPricePerShare.value, token.decimals));
    vault.totalAssets = amountToDenomination(tryTotalAssets.value, token.decimals).div(amountToDenomination(tryPricePerShare.value, token.decimals));
  }

  vault.totalYieldGenerated = vault.totalYieldGenerated.plus(yieldGenerated);
  vault.totalProtocolFeesGenerated = vault.totalProtocolFeesGenerated.plus(performanceFeesGenerated);
  vault.totalVaultPerformanceFeesGenerated = vault.totalVaultPerformanceFeesGenerated.plus(performanceFeesGenerated);
  vault.save()
}

export function handleStrategyReported_v0_3_0_v0_3_1(event: StrategyReported): void {
  let transactionHash = event.transaction.hash;

  if (EXCLUDED_TRANSACTIONS.includes(transactionHash.toHexString())) {
    return
  }

  let strategyReported = new StrategyReported_v0_3_0_v0_3_1Event(event.transaction.hash.toHexString());
  let timestamp = event.block.timestamp.toI32();
  let debtAdded = event.params.debtAdded;
  let debtLimit = event.params.debtLimit;
  let gain = event.params.gain;
  let loss = event.params.loss;
  let strategyAddress: Address = Address.fromString(event.params.strategy.toHexString());
  let totalDebt = event.params.totalDebt;
  let totalGain = event.params.totalGain;
  let totalLoss = event.params.totalLoss;

  strategyReported.timestamp = timestamp;
  strategyReported.debtAdded = debtAdded;
  strategyReported.debtLimit = debtLimit;
  strategyReported.gain = gain;
  strategyReported.loss = loss;
  strategyReported.strategy = strategyAddress;
  strategyReported.totalDebt = totalDebt;
  strategyReported.totalGain = totalGain;
  strategyReported.totalLoss = totalLoss;
  strategyReported.save();

  let vaultContract = Vault.bind(event.address);
  let vault = loadVault(event.address.toHexString());
  let token = getOrCreateToken(vault.denomination);

  let yieldGenerated = amountToDenomination(gain, token.decimals);
  let performanceFeesGenerated = yieldGenerated.times(vaultContract.performanceFee().toBigDecimal().div(BASIS_POINTS_BD))

  let tryPricePerShare = vaultContract.try_pricePerShare();
  let tryTotalAssets = vaultContract.try_totalAssets();
  let tryTotalDebt = vaultContract.try_totalDebt();

  if (!tryPricePerShare && !tryTotalAssets && !tryTotalDebt) {
    vault.totalDebt = amountToDenomination(tryTotalDebt.value, token.decimals).div(amountToDenomination(tryPricePerShare.value, token.decimals));
    vault.totalAssets = amountToDenomination(tryTotalAssets.value, token.decimals).div(amountToDenomination(tryPricePerShare.value, token.decimals));
  }

  vault.totalYieldGenerated = vault.totalYieldGenerated.plus(yieldGenerated);
  vault.totalProtocolFeesGenerated = vault.totalProtocolFeesGenerated.plus(performanceFeesGenerated);
  vault.totalVaultPerformanceFeesGenerated = vault.totalVaultPerformanceFeesGenerated.plus(performanceFeesGenerated);
  vault.save()
}

export function handleTransfer(event: Transfer): void {
  let transactionHash = event.transaction.hash;

  if (EXCLUDED_TRANSACTIONS.includes(transactionHash.toHexString())) {
    return
  }

  let transfer = new TransferEvent(event.transaction.hash.toHexString());
  let timestamp = event.block.timestamp.toI32();
  let sender = event.params.sender;
  let receiver = event.params.receiver;
  let amount = event.params.value;

  transfer.timestamp = timestamp;
  transfer.sender = sender;
  transfer.receiver = receiver;
  transfer.amount = amount;
  transfer.save();

  if (isVault(sender.toHexString())) {
    let vault = loadVault(sender.toHexString());
    let vaultContract = Vault.bind(sender);
    let rewards = vaultContract.rewards();

    let decimals = getTokenDecimals(vaultContract.token());
    let tryPricePerShare = vaultContract.try_pricePerShare();

    if (tryPricePerShare.reverted) {
      return;
    }

    let pricePerShare = amountToDenomination(vaultContract.pricePerShare(), decimals);

    // Check if receiver is the same as the rewards contract of the Vault.
    if (receiver == rewards) {
      let managementFeeGenerated = amountToDenomination(amount, decimals).div(pricePerShare);

      vault.totalManagementFeesGenerated = vault.totalManagementFeesGenerated.plus(managementFeeGenerated);
      vault.totalProtocolFeesGenerated = vault.totalProtocolFeesGenerated.plus(managementFeeGenerated);
      vault.save();
    }

    if (isStrategy(receiver.toHexString())) {
      let strategistFeesGenerated = amountToDenomination(amount, decimals).div(pricePerShare);

      vault.totalStrategistPerformanceFeesGenerated = vault.totalStrategistPerformanceFeesGenerated.plus(strategistFeesGenerated);
      vault.totalProtocolFeesGenerated = vault.totalProtocolFeesGenerated.plus(strategistFeesGenerated);
      vault.save();
    }
  }
}
