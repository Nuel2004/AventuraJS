/**
 * @fileoverview Sistema de ranking y categorización de jugadores
 * @module ranking
 */

/**
 * Categoriza al jugador según su puntuación
 * @param {Object} player - Objeto jugador con propiedad points
 * @param {number} [threshold=1000] - Umbral de puntos para ser Veterano
 * @returns {string} "Veterano" si supera el umbral, "Novato" en caso contrario
 * @example
 * const categoria = categorizePlayer(player, 1000);
 * console.log(categoria); // "Veterano" o "Novato"
 */
export function categorizePlayer(player, threshold = 1000) {
    return player.points >= threshold ? "Veterano" : "Novato";
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