/**
 * @fileoverview Constantes utilizadas en el juego
 * @module constants
 */

/**
 * Puntos necesarios para ser considerado Pro/Veterano
 * @constant {number}
 */
export const PROPLAYER_POINTS = 1000;

/**
 * Rarezas disponibles para productos
 * @constant {Array<string>}
 */
export const RARITIES = ["Común", "Infrecuente", "Rara", "Épica", "Legendaria"];

/**
 * Tipos válidos de productos
 * @constant {Array<string>}
 */
export const PRODUCT_TYPES = ["Arma", "Armadura", "Consumible"];

/**
 * Puntos base por victoria en batalla
 * @constant {number}
 */
export const BASE_BATTLE_POINTS = 100;

/**
 * Vida inicial del jugador
 * @constant {number}
 */
export const PLAYER_INITIAL_HP = 200;

/**
 * IDs de las escenas del juego
 * @constant {Object}
 */
export const SCENES = {
    INIT: 'init',
    MARKET: 'market',
    INVENTORY: 'player-inventory',
    ENEMIES: 'enemies',
    BATTLES: 'battles',
    RANKING: 'ranket'
};