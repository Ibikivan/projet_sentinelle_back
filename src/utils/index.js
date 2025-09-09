const { ValidationError } = require("sequelize");

/**
 * @function formatUserPhoneNumber
 * @param {object} user
 * @returns {object}
 * @throws {Error}
 *
 * Comportement contrôlé par E164_ENFORCE_PLUS :
 * - 'always' : garanti que le résultat commence par '+'
 * - 'never'  : garanti que le résultat ne contient pas '+'
 * - 'auto'   : conserve le '+' tel qu'il est dans l'input
 */
function formatUserPhoneNumber(user, localIndex=237) {
    const mode = process.env.E164_ENFORCE_PLUS || 'always'; // 'auto'|'always'|'never'
    if (typeof user.phoneNumber !== 'string') {
        throw new ValidationError('Expected a string as phone number');
    }
  
    // 1) Supprimer espaces et caractères de ponctuation (sauf '+')
    let s = user.phoneNumber.trim().replace(/[\s\-().]/g, '');
  
    // 2) Gérer le plus initial
    const hasPlus = s.startsWith('+');
    s = hasPlus ? s.slice(1) : s;
  
    // 3) Ne garder que les chiffres (après avoir retiré '+')
    const digits = s.startsWith(localIndex)
        ? s.replace(/\D+/g, '')
        : localIndex + s.replace(/\D+/g, '');
  
    // 4) Construire la chaîne finale selon le mode
    let formatted;
    switch (mode) {
        case 'always':
            formatted = `+${digits}`;
            break;
        case 'never':
            formatted = digits;
            break;
        case 'auto':
            formatted = hasPlus ? `+${digits}` : digits;
            break;
        default:
            throw new ValidationError(`Invalid E164_ENFORCE_PLUS mode: ${mode}`);
    };
  
    // 5) Valider le format : on applique la regex adaptée
    const re = mode === 'never'
        ? /^[1-9]\d{1,14}$/        // sans '+'
        : /^\+[1-9]\d{1,14}$/;     // avec '+'
  
    if (!re.test(formatted)) {
        throw new ValidationError(`Invalid E.164 phone number: "${formatted}"`);
    };
  
    user.phoneNumber = formatted;
    return user;
};

/**
 * @function formatPhoneNumber
 * @param {string} input
 * @returns {string}
 * @throws {Error}
 *
 * Comportement contrôlé par E164_ENFORCE_PLUS :
 * - 'always' : garanti que le résultat commence par '+'
 * - 'never'  : garanti que le résultat ne contient pas '+'
 * - 'auto'   : conserve le '+' tel qu'il est dans l'input
 */
function formatPhoneNumber(input, localIndex=237) {
    const mode = process.env.E164_ENFORCE_PLUS || 'always'; // 'auto'|'always'|'never'
    if (typeof input !== 'string') {
        throw new ValidationError('Expected a string as phone number');
    }
  
    // 1) Supprimer espaces et caractères de ponctuation (sauf '+')
    let s = input.trim().replace(/[\s\-().]/g, '');
  
    // 2) Gérer le plus initial
    const hasPlus = s.startsWith('+');
    s = hasPlus ? s.slice(1) : s;
  
    // 3) Ne garder que les chiffres (après avoir retiré '+')
    const digits = s.startsWith(localIndex)
        ? s.replace(/\D+/g, '')
        : localIndex + s.replace(/\D+/g, '');
  
    // 4) Construire la chaîne finale selon le mode
    let formatted;
    switch (mode) {
        case 'always':
            formatted = `+${digits}`;
            break;
        case 'never':
            formatted = digits;
            break;
        case 'auto':
            formatted = hasPlus ? `+${digits}` : digits;
            break;
        default:
            throw new ValidationError(`Invalid E164_ENFORCE_PLUS mode: ${mode}`);
    }
  
    // 5) Valider le format : on applique la regex adaptée
    const re = mode === 'never'
        ? /^[1-9]\d{1,14}$/        // sans '+'
        : /^\+[1-9]\d{1,14}$/;     // avec '+'
  
    if (!re.test(formatted)) {
        throw new ValidationError(`Invalid E.164 phone number: "${formatted}"`);
    }
  
    return formatted;
};

/**
 * @function generateResetCode
 * @returns {string}
 * @description This function generates a random 6-digit reset code.
 * @example
 * const resetCode = generateResetCode();
 * console.log(resetCode); // '123456'
 */
const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    formatUserPhoneNumber,
    formatPhoneNumber,
    generateResetCode
};
