//Modificar el poder del jugador y del enemigo en caso de que el ataque sea mayor que la defensa.
        // El poder se calcula restando a la defensa el ataque del contrincante (Ej: player.attack = 7;
        // enemy.defense = 10;
        // playerPower = 10 - 7 = 3;
        // enemy.hp = enemy.hp - 3;)

export function battle (player, enemy){
    let playerPower = enemy.defense - player.attack;
    let enemyPower = player.defense - enemy.attack;

    while(player.hp > 0 && enemy.hp > 0){
        //Ataca primero el jugador
        enemy.hp -= playerPower;
        //Despues ataca el enemigo
        player.hp -= enemyPower;
    }
    if (player.hp > 0 && enemy.hp <= 0) {
        player.points += enemyPower
        console.log(`🏆 ${player.name} ha ganado a ${enemy.name} y ha ganado ${enemyPower} puntos 🏆`);
    } else if (player.hp <= 0 && enemy.hp > 0){
        console.log(`💀 ${enemy.name} ha ganado a ${player.name} y le ha robado ${Math.floor(player.points)} puntos 💀`);
        player.points = 0;
    }
    else{
        console.log(`${player.name} y ${enemy.name} han muerto en batalla. 💀 (Empate) `);
    }
}