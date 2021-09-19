import { Address } from "@graphprotocol/graph-ts"
import {
  NewImplementation,
} from "../generated/Comptroller/Comptroller"
import { ComptrollerImplementationEvent } from "../generated/schema"

export function handleNewImplementation(event: NewImplementation): void {
  let newComptrollerImplementationEvent = new ComptrollerImplementationEvent(event.transaction.hash.toHexString());
  
  let newImplementation = event.params.newImplementation;

  newComptrollerImplementationEvent.newImplementation = newImplementation;
  newComptrollerImplementationEvent.save();
}
