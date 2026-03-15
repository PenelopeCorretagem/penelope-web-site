import { cleanCEP } from '@shared/utils/CEP/formatCEPUtil'

export function getCleanedCEP(cep) {
  return cleanCEP(cep)
}

export function isCEPValid(cleanedCEP) {
  return cleanedCEP.length === 8
}

export function isCEPAlreadySearched(cleanedCEP, lastSearchedCEP) {
  return cleanedCEP === lastSearchedCEP
}
