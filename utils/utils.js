/**
 * @fileoverview Funciones de utilidad para el juego
 * @module utils
 */

/**
 * Obtiene una rareza aleatoria de un array de rarezas
 * @param {Array<string>} rarities - Array de rarezas disponibles
 * @returns {string} Rareza aleatoria
 */
export function getRandomRarity(rarities) {
    return rarities[Math.floor(Math.random() * rarities.length)];
}

/**
 * Genera un número aleatorio entre min y max (inclusive)
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Número aleatorio
 */
export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//eliminar precio en cents
/**
 * Formatea un precio en céntimos a euros
 * @param {number} cents - Precio en céntimos
 * @returns {string} Precio formateado
 */
export function formatPrice(cents) {
    return (cents / 100).toFixed(2).replace(".", ",") + "€";
}

/**
 * Clona profundamente un objeto
 * @param {Object} obj - Objeto a clonar
 * @returns {Object} Copia del objeto
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}