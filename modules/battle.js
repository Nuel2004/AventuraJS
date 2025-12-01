/**
 * @fileoverview Sistema de batalla del juego
 * @module battle
 */

/**
 * Ejecuta una batalla por turnos entre el jugador y un enemigo
 * @param {Object} player - Objeto jugador con propiedades hp, getAttackTotal, getDefenseTotal y points
 * @param {Object} enemy - Objeto enemigo con propiedades hp, attack, type y multiplierDamage (opcional)
 * @returns {{winner: Object|null, points: number}} Objeto con el ganador y los puntos obtenidos
 * @example
 * const result = battle(player, enemy);
 * console.log(result.winner.name); // "Héroe"
 * console.log(result.points); // 150
 */
export function battle(player, enemy) {

    // Combate por turnos hasta que uno llegue a 0 HP
    while (player.hp > 0 && enemy.hp > 0) {

        // Turno del jugador: reduce vida del enemigo
        enemy.hp -= player.getAttackTotal();

        // Turno del enemigo: reduce vida del jugador (si sigue vivo)
        if (enemy.hp > 0) {
            player.hp = (player.hp + player.getDefenseTotal()) - enemy.attack;
        }
    }

    let winner = null;
    let points = 0;

    // Determinar ganador y calcular puntos
    if (player.hp > 0 && enemy.hp <= 0) {
        winner = player;
        points = 100 + enemy.attack;

        // Bonus si el enemigo es un jefe
        if (enemy.type === "Jefe") {
            points = Math.round(points * enemy.multiplierDamage);
        }

        player.points += points;
    } 
    else if (enemy.hp > 0) {
        winner = enemy;
        points = 0;
        player.points = 0;
    }

    return { winner, points };
}