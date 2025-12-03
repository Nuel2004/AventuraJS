/**
 * Simula combate turno a turno
 * @returns {Object} Resultado del combate { winner, log, pointsEarned }
 */
export function simulateBattle(player, enemy) {
    let log = [];
    let playerCurrentHp = player.totalHp; // Usamos la vida calculada
    let enemyCurrentHp = enemy.hp;

    while (playerCurrentHp > 0 && enemyCurrentHp > 0) {
        
        enemyCurrentHp -= player.totalAttack;

        let damageToPlayer = Math.max(0, enemy.levelAtaque - player.totalDefense);
        playerCurrentHp -= damageToPlayer;
    }

    let winner = null;
    let pointsEarned = 0;

    if (playerCurrentHp > 0) {
        winner = "player";
        let basePoints = 100;
        let bonusPoints = enemy.levelAtaque;
        
        let total = basePoints + bonusPoints;
        if (enemy.multiplierDamage) {
            total = total * enemy.multiplierDamage;
        }
        
        pointsEarned = Math.floor(total);
        log.push(`¡${player.name} ha ganado!`);
    } else {
        winner = "enemy";
        log.push(`¡${player.name} ha sido derrotado!`);
    }

    return { winner, log, pointsEarned };
}