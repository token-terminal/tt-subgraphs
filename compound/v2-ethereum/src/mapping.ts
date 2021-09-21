import { Address } from "@graphprotocol/graph-ts";
import {
  NewImplementation,
} from "../generated/Comptroller/Comptroller";
import {
  ComptrollerImplementation as ComptrollerTemplate
} from "../generated/templates";
import { MarketListed } from "../generated/templates/ComptrollerImplementation/Comptroller"
import { ComptrollerImplementationEvent } from "../generated/schema";
import { createOrLoadComptrollerImplementation, createOrLoadMarket } from "./helpers";

export function handleNewImplementation(event: NewImplementation): void {
  let newComptrollerImplementationEvent = new ComptrollerImplementationEvent(event.transaction.hash.toHexString());
  
  let newImplementation = event.params.newImplementation;

  newComptrollerImplementationEvent.newImplementation = newImplementation;
  newComptrollerImplementationEvent.save();

  ComptrollerTemplate.create(newImplementation);

  let comptroller = createOrLoadComptrollerImplementation(newImplementation.toHexString());
  comptroller.save();
}

export function handleMarketListed(event: MarketListed): void {
  let ctokenAddress = event.params.cToken;

  let market = createOrLoadMarket(ctokenAddress.toHexString());
  market.save();
}