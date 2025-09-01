/**
 * Como usar:  import { NumberUtils, PasswordUtils, StringUtils } from './utils/index.js';

 * Exemplos:
 * console.log(NumberUtils.formatarMoeda(1500)); Saida esperada: "R$ 1.500,00"
 * PasswordUtils.toggleSenha('senha'); // alterna visibilidade do input de senha
 * console.log(StringUtils.gerarSlug('Apartamento Luxo na Vila Mariana')); Saida esperada:"apartamento-luxo-na-vila-mariana"
 */

import * as NumberUtils from './numberUtils.js';
import * as PasswordUtils from './passwordUtils.js';
import * as StringUtils from './stringUtils.js';

export { NumberUtils, PasswordUtils, StringUtils };
