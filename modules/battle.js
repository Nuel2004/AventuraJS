/**
 * Simula combate turno a turno
 * @returns {Object} Resultado del combate { winner, log, pointsEarned }
 */
export function simulateBattle(player, enemy) {
    let log = [];
    let playerCurrentHp = player.totalHp; // Usamos la vida calculada
    let enemyCurrentHp = enemy.hp;
    
    log.push(`Inicio del combate: ${player.name} vs ${enemy.name}`);

    // Bucle de turnos [cite: 110]
    while (playerCurrentHp > 0 && enemyCurrentHp > 0) {
        
        // Turno Jugador
        enemyCurrentHp -= player.totalAttack;
        
        // Turno Enemigo
        // Fórmula del PDF: Vida = (VidaActual + Defensa) - AtaqueEnemigo [cite: 111]
        // Interpretación lógica: Daño = AtaqueEnemigo - Defensa (min 0)
        let damageToPlayer = Math.max(0, enemy.levelAtaque - player.totalDefense);
        playerCurrentHp -= damageToPlayer;
    }

    let winner = null;
    let pointsEarned = 0;

    if (playerCurrentHp > 0) {
        winner = "player";
        // Cálculo de puntos [cite: 114-116]
        let basePoints = 100;
        let bonusPoints = enemy.levelAtaque;
        
        let total = basePoints + bonusPoints;
        
        // Si es jefe, multiplicar
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