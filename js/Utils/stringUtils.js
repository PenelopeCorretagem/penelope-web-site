/**
 * Valida se uma string é um CPF válido.
 * @param {string} cpf - O CPF a ser validado (com ou sem formatação).
 * @returns {boolean} true se válido, false caso contrário.
 * @example
 * validarCPF("123.456.789-09"); // true ou false
 */
export function validarCPF(cpf) {
    // Remove tudo que não é número
    cpf = cpf.replace(/[^\d]+/g, '');


    if (cpf.length !== 11) return false;

    // Verifica se todos os números são iguais
    if (/^(.)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10), 10)) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.substring(10, 11), 10);
}

/**
 * Formata um número de telefone brasileiro.
 * @param {string} tel - Número do telefone sem formatação.
 * @returns {string} Telefone formatado no padrão (XX) XXXXX-XXXX.
 * @example
 * formatarTelefone("11987654321"); // "(11) 98765-4321"
 */
export function formatarTelefone(tel) {
    tel = tel.replace(/\D/g, '');
    return tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

/**
 * Gera um link do WhatsApp com mensagem pronta.
 * @param {string} telefone - Número do WhatsApp.
 * @param {string} mensagem - Mensagem a ser enviada.
 * @returns {string} URL do WhatsApp.
 * @example
 * gerarLinkWhatsApp("11987654321", "Olá, tenho interesse no imóvel!");
 * // "https://wa.me/11987654321?text=Olá%2C%20tenho%20interesse%20no%20imóvel%21"
 */
export function gerarLinkWhatsApp(telefone, mensagem) {
    return `https://wa.me/${telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Valida se uma string é um email válido.
 * @param {string} email - Email a ser validado.
 * @returns {boolean} true se válido, false caso contrário.
 * @example
 * validarEmail("exemplo@email.com"); // true
 */
export function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Gera um slug (URL amigável) a partir de um texto.
 * @param {string} texto - Texto a ser transformado em slug.
 * @returns {string} Texto formatado como slug.
 * @example
 * gerarSlug("Apartamento Luxo na Vila Mariana"); 
 * // "apartamento-luxo-na-vila-mariana"
 */
export function gerarSlug(texto) {
    return texto
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
}
