/* ==========================================================================
   1. IMPORTACIONES
   ========================================================================== */
import { Player } from "./modules/player.js";
import { Enemigo, JefeFinal } from "./modules/enemies.js";
import { market, applyRandomDiscount } from "./modules/market.js";
import { simulateBattle } from "./modules/battle.js";

/* ==========================================================================
   2. ESTADO DEL JUEGO
   ========================================================================== */
const state = {
    // Inicializamos al jugador (los puntos empiezan en 0)
    player: new Player('Cazador', 'images/caballero.png'),

    // Aquí se guardarán los productos con el descuento aplicado
    marketOffers: [],

    // Cesta de la compra temporal
    cart: [],

    // Lista de enemigos en orden secuencial
    enemies: [
        new Enemigo('Goblin', 8, 30, 'images/duende.png'),
        new Enemigo('Lobo', 9, 40, 'images/lobo.png'),
        new Enemigo('Bandido', 12, 60, 'images/bandido.png'),
        // El Dragón es el Jefe Final (Multiplicador de daño/puntos)
        new JefeFinal('Dragón', 28, 200, 'images/dragon.png', 2.0)
    ],

    // Índice para controlar contra qué enemigo toca pelear (0 = primero)
    currentEnemyIndex: 0
};

/* ==========================================================================
   3. GESTIÓN DE ESCENAS (Navegación)
   ========================================================================== */

function showScene(sceneId) {
    // Ocultar todas las escenas
    document.querySelectorAll('.scene').forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });
    
    // Mostrar la escena objetivo
    const target = document.getElementById(sceneId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
}

/* ==========================================================================
   4. LÓGICA DE INICIO (Escena 1)
   ========================================================================== */

function initGame() {
    renderPlayerCard('player-profile-initial');
}

// Botón para ir al mercado
document.getElementById('btn-to-market').addEventListener('click', () => {
    initMarket();
    showScene('scene-2');
});

function renderPlayerCard(containerId) {
    const container = document.getElementById(containerId);
    const p = state.player;
    
    // Mostramos estadísticas dinámicas calculadas en la clase Player
    container.innerHTML = `
        <img src="${p.avatar}" alt="${p.name}">
        <h3>${p.name}</h3>
        <div class="stats-box">
            <p>⚔️ Ataque: <strong>${p.totalAttack}</strong></p>
            <p>🛡️ Defensa: <strong>${p.totalDefense}</strong></p>
            <p>❤️ Vida: <strong>${p.totalHp}</strong></p>
            <p>✨ Puntos: <strong>${p.points}</strong></p>
        </div>
    `;
}

/* ==========================================================================
   5. LÓGICA DE MERCADO (Escena 2)
   ========================================================================== */

function initMarket() {
    // Aplicamos descuentos aleatorios al entrar
    state.marketOffers = applyRandomDiscount(market);
    renderMarketGrid();
    renderCartSummary();
}

function renderMarketGrid() {
    const grid = document.getElementById('market-grid');
    grid.innerHTML = '';

    state.marketOffers.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Verificar si ya está en la cesta
        const inCart = state.cart.includes(prod);
        if (inCart) card.classList.add('selected');

        card.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}">
            <h4>${prod.name}</h4>
            <p>${prod.type} | ${prod.rarity}</p>
            <p>Bonus: +${prod.bonus}</p>
            <p class="price"><strong>${prod.getFormattedPrice()}</strong></p>
            <button class="btn-action">${inCart ? 'Retirar' : 'Añadir'}</button>
        `;

        // Evento Añadir/Retirar
        card.querySelector('.btn-action').addEventListener('click', () => {
            if (state.cart.includes(prod)) {
                state.cart = state.cart.filter(item => item !== prod);
            } else {
                if (state.cart.length < 5) {
                    state.cart.push(prod);
                } else {
                    alert("¡Tu cesta está llena!");
                }
            }
            renderMarketGrid();
            renderCartSummary();
        });

        grid.appendChild(card);
    });
}

function renderCartSummary() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    
    // Crear 5 huecos visuales
    for (let i = 0; i < 5; i++) {
        const box = document.createElement('div');
        box.className = 'cart-item-box';
        
        if (state.cart[i]) {
            const img = document.createElement('img');
            img.src = state.cart[i].image;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            box.appendChild(img);
        }
        container.appendChild(box);
    }
}

// Botón Comprar
document.getElementById('btn-buy').addEventListener('click', () => {
    // Mover items al inventario
    state.cart.forEach(item => state.player.addItem(item));
    renderPlayerCard('player-profile-updated');
    showScene('scene-3');
});

// Botón Ver Enemigos (Escena 3 -> Escena 4)
document.getElementById('btn-to-enemies').addEventListener('click', () => {
    renderEnemiesList();
    showScene('scene-4');
});

/* ==========================================================================
   6. LISTA DE ENEMIGOS (Escena 4)
   ========================================================================== */

function renderEnemiesList() {
    const grid = document.getElementById('enemies-grid');
    grid.innerHTML = '';
    
    state.enemies.forEach((enemy) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${enemy.image}" alt="${enemy.name}">
            <h4>${enemy.name}</h4>
            <p>⚔️ Ataque: ${enemy.levelAtaque}</p>
            <p>❤️ Vida: ${enemy.hp}</p>
        `;
        grid.appendChild(card);
    });
}

// Botón Comenzar Batallas
document.getElementById('btn-start-gauntlet').addEventListener('click', () => {
    state.currentEnemyIndex = 0; 
    playNextBattle();
});

/* ==========================================================================
   7. SISTEMA DE BATALLA (Escena 5)
   ========================================================================== */

function playNextBattle() {
    // 1. Si no quedan enemigos, fin del juego
    if (state.currentEnemyIndex >= state.enemies.length) {
        finishGame();
        return;
    }
    
    // 2. MODIFICACIÓN: Si el jugador llega muerto al combate, lo "revivimos" 
    // para que pueda luchar contra el siguiente, si no, la batalla duraría 0 segundos.
    if (state.player.totalHp <= 0) {
        // Le damos una vida base para continuar (puedes ajustar esto)
        state.player.hp = state.player.baseHp; 
        alert("¡Has sido revivido por la magia del guion para la siguiente batalla!");
    }

    // 3. Preparar escenario
    const enemy = state.enemies[state.currentEnemyIndex];
    showScene('scene-5');
    
    document.getElementById('battle-progress').textContent = 
        `Combate ${state.currentEnemyIndex + 1} de ${state.enemies.length}`;

    // 4. Simular batalla
    const result = simulateBattle(state.player, enemy);
    
    // 5. Mostrar log
    const logContainer = document.getElementById('battle-log');
    let htmlContent = `
        <div class="battle-vs">
            <div class="combatant">
                <img src="${state.player.avatar}" style="width:50px">
                <p>${state.player.name}</p>
            </div>
            <div class="vs-text">VS</div>
            <div class="combatant">
                <img src="${enemy.image}" style="width:50px">
                <p>${enemy.name}</p>
            </div>
        </div>
        <div class="battle-details">
            <ul>${result.log.map(line => `<li>${line}</li>`).join('')}</ul>
        </div>
    `;

    // 6. Gestionar resultado
    const btnAction = document.getElementById('btn-battle-action');

    // Lógica común para determinar qué hace el botón (Siguiente o Finalizar)
    const isLastEnemy = state.currentEnemyIndex === state.enemies.length - 1;
    
    const nextStep = () => {
        if (isLastEnemy) {
            finishGame();
        } else {
            state.currentEnemyIndex++; 
            playNextBattle();
        }
    };

    if (result.winner === 'player') {
        state.player.addPoints(result.pointsEarned);
        htmlContent += `
            <div class="battle-result win">
                <h3>🏆 ¡VICTORIA!</h3>
                <p>Puntos ganados: <strong>${result.pointsEarned}</strong></p>
                <p>Vida restante: ${state.player.totalHp}</p>
            </div>
        `;
    } else {
        // MODIFICACIÓN: Mensaje de derrota, pero permitiendo continuar
        htmlContent += `
            <div class="battle-result loss">
                <h3>💀 DERROTA</h3>
                <p>Has caído ante ${enemy.name}, pero tu viaje continúa.</p>
            </div>
        `;
    }

    // Configurar el botón (ahora funciona igual ganes o pierdas)
    btnAction.textContent = isLastEnemy ? "Ver Resultados Finales" : "Siguiente Batalla ➡️";
    btnAction.onclick = nextStep;

    logContainer.innerHTML = htmlContent;
}

/* ==========================================================================
   8. RESULTADOS FINAL (Escena 6)
   ========================================================================== */

function finishGame() {
    showScene('scene-6');
    const scoreDiv = document.getElementById('final-score');
    
    const THRESHOLD_VETERAN = 500; 
    const isVeteran = state.player.points >= THRESHOLD_VETERAN;
    const rankTitle = isVeteran ? "VETERANO" : "NOVATO";

    scoreDiv.innerHTML = `
        <h1 class="rank-title ${isVeteran ? 'veteran' : 'rookie'}">${rankTitle}</h1>
        <h2>Puntos Totales: ${state.player.points}</h2>
        <div class="final-inventory">
            <h3>Objetos recolectados:</h3>
            <p>${state.player.inventory.map(i => i.name).join(', ') || "Ninguno"}</p>
        </div>
    `;
}

document.getElementById('btn-restart').addEventListener('click', () => {
    location.reload();
});

// Iniciar juego al cargar
initGame();