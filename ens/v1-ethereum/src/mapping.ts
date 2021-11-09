import {
  NameRegistered,
  NameRenewed
} from "../generated/EthRegistrarController/EthRegistrarController"
import { getOrCreateGlobal, exponentToBigDecimal } from "./helpers";
import { WEI_DECIMALS } from "./constants";

export function handleNameRegistered(event: NameRegistered): void {
  let global = getOrCreateGlobal();
  let registrationCost = event.params.cost;

  global.registrationFees = global.registrationFees
    .plus(registrationCost.toBigDecimal().div(exponentToBigDecimal(WEI_DECIMALS)));
  global.save();
}

export function handleNameRenewed(event: NameRenewed): void {
  let global = getOrCreateGlobal();
  let renewalCost = event.params.cost;

  global.renewalFees = global.renewalFees
    .plus(renewalCost.toBigDecimal().div(exponentToBigDecimal(WEI_DECIMALS)));
  global.save();
}
