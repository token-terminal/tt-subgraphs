import { NameRegistered, NameRenewed } from '../generated/EthRegistrarController/EthRegistrarController'
import { getOrCreateGlobal, getOrCreateToken, exponentToBigDecimal } from './helpers'
import { WEI_DECIMALS, WETH_TOKEN_ADDRESS } from './constants'

export function handleNameRegistered(event: NameRegistered): void {
  let token = getOrCreateToken(WETH_TOKEN_ADDRESS)
  token.save()
  let global = getOrCreateGlobal(token)
  let registrationCost = event.params.cost

  global.registrationFees = global.registrationFees.plus(
    registrationCost.toBigDecimal().div(exponentToBigDecimal(WEI_DECIMALS))
  )
  global.denomination = token.id
  global.save()
}

export function handleNameRenewed(event: NameRenewed): void {
  let token = getOrCreateToken(WETH_TOKEN_ADDRESS)
  token.save()
  let global = getOrCreateGlobal(token)
  let renewalCost = event.params.cost

  global.renewalFees = global.renewalFees.plus(renewalCost.toBigDecimal().div(exponentToBigDecimal(WEI_DECIMALS)))
  global.denomination = token.id
  global.save()
}
