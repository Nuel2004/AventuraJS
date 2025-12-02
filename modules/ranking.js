/**
 * @fileoverview Sistema de ranking y categorización de jugadores
 * @module ranking
 */

/**
 * Categoriza al jugador según su puntuación
 * @param {Object} player - Objeto jugador con propiedad points
 * @param {number} [limit=500] - Umbral de puntos para ser Netherite
 * @returns {string} "Netherite" si supera el umbral, "Madera" en caso contrario
 * @example
 * const categoria = categorizePlayer(player, 500);
 * console.log(categoria); // "Netherite" o "Madera"
 */
export function categorizePlayer(player, limit=500) {
    return player.points >= limit ? "Netherite" : "Madera";
}

/**
 * Ordena un array de jugadores por puntuación de mayor a menor
 * @param {Array<Object>} players - Array de jugadores con propiedad points
 * @returns {Array<Object>} Nuevo array ordenado por puntuación descendente
 * @example
 * const ranking = rankPlayers([player1, player2, player3]);
 */
export function rankPlayers(players) {
    return [...players].sort((a, b) => b.points - a.points);
}