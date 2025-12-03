/**
 * @fileoverview Módulo principal del videojuego AventuraJS.
 * Gestiona el estado global de la aplicación (state) y la navegación entre las 6 escenas.
 * @module script
 */

/* ==========================================================================
   1. IMPORTACIONES
   ========================================================================== */
import { Player } from "./modules/player.js";
import { Enemigo, JefeFinal } from "./modules/enemies.js";
import { market, applyRandomDiscount } from "./modules/market.js";
import { simulateBattle } from "./modules/battle.js";
import { categorizePlayer } from "./modules/ranking.js";
import confetti from 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/+esm';

/* ==========================================================================
   2. ESTADO DEL JUEGO
   ========================================================================== */
/**
 * @constant {object} state - Objeto de estado global del juego.
 * @property {Player} player - Instancia del jugador actual.
 * @property {Product[]} marketOffers - Lista de productos disponibles con descuentos aplicados.
 * @property {Product[]} cart - Cesta temporal de objetos antes de la compra.
 * @property {Enemigo[]|JefeFinal[]} enemies - Lista secuencial de enemigos a enfrentar.
 * @property {number} currentEnemyIndex - Índice del enemigo actual en el array `enemies`.
 */
const state = {
    player: new Player('Cazador', 'images/caballero.png'),
    marketOffers: [],
    cart: [],
    enemies: [
        new Enemigo('Goblin', 8, 30, 'images/duende.png'),
        new Enemigo('Lobo', 9, 40, 'images/lobo.png'),
        new Enemigo('Bandido', 12, 60, 'images/bandido.png'),
        new JefeFinal('Dragón', 28, 200, 'images/dragon.png', 2.0)
    ],
    currentEnemyIndex: 0
};

/* ==========================================================================
   3. GESTIÓN DE ESCENAS
   ========================================================================== */
/**
 * Muestra una escena específica mientras oculta todas las demás, basándose en el ID.
 * [cite: 130]
 * @param {string} sceneId - El ID del elemento `<section>` a mostrar (e.g., 'scene-1').
 * @returns {void}
 */
function showScene(sceneId) {
    document.querySelectorAll('.scene').forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });
    const target = document.getElementById(sceneId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
}

/* ==========================================================================
   4. INICIO Y PERFIL
   ========================================================================== */
/**
 * Función de inicialización del juego. Se ejecuta al cargar el script.
 * @returns {void}
 */
function initGame() {
    renderPlayerCard('player-profile-initial');
}

document.getElementById('btn-to-market').addEventListener('click', () => {
    initMarket();
    showScene('scene-2');
});

/**
 * Renderiza el perfil y las estadísticas del jugador en el contenedor especificado.
 * @param {string} containerId - El ID del elemento donde se inyectará la tarjeta del jugador.
 * @returns {void}
 */
function renderPlayerCard(containerId) {
    const container = document.getElementById(containerId);
    const p = state.player;
    container.innerHTML = `
        <img src="${p.avatar}" alt="${p.name}">
        <h3>${p.name}</h3>
        <div class="stats-box">
            <p>⚔️ Ataque: <strong>${p.totalAttack}</strong></p>
            <p>🛡️ Defensa: <strong>${p.totalDefense}</strong></p>
            <p>❤️ Vida Máx: <strong>${p.totalHp}</strong></p>
            <p>✨ Puntos: <strong>${p.points}</strong></p>
        </div>
    `;
}

/* ==========================================================================
   5. MERCADO
   ========================================================================== */
/**
 * Inicializa la escena del mercado aplicando descuentos aleatorios a los productos.
 * [cite: 149]
 * @returns {void}
 */
function initMarket() {
    state.marketOffers = applyRandomDiscount(market);
    renderMarketGrid();
    renderCartSummary();
}

/**
 * Renderiza la cuadrícula de productos, gestiona el estado de selección (carrito)
 * y añade los event listeners para añadir/retirar productos.
 * [cite: 146, 148]
 * @returns {void}
 */
function renderMarketGrid() {
    const grid = document.getElementById('market-grid');
    grid.innerHTML = '';

    state.marketOffers.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';
        if (state.cart.includes(prod)) card.classList.add('selected');

        const precioFormateado = prod.getFormattedPrice();

        card.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}" onerror="this.src='https://placehold.co/100?text=Item'">
            <h4>${prod.name}</h4>
            <p>${prod.type} | ${prod.rarity}</p>
            <p>Bonus: +${prod.bonus}</p>
            <p class="price"><strong>${precioFormateado}</strong></p>
            <button class="btn-action">${state.cart.includes(prod) ? 'Retirar' : 'Añadir'}</button>
        `;

        const btn = card.querySelector('.btn-action');
        btn.addEventListener('click', () => {
            if (state.cart.includes(prod)) {
                state.cart = state.cart.filter(item => item !== prod);
            } else {
                if (state.cart.length < 5) {
                    state.cart.push(prod);
                    /** @fires showAddedAnimation */
                    showAddedAnimation(card);
                } else {
                    alert("¡Cesta llena!");
                }
            }
            renderMarketGrid();
            renderCartSummary();
        });
        grid.appendChild(card);
    });
}

/**
 * Muestra una animación de feedback al añadir un producto al carrito (icono flotante).
 * [cite: 247, 248]
 * @param {HTMLElement} cardElement - El elemento tarjeta del producto al que se añade la animación.
 * @returns {void}
 */
function showAddedAnimation(cardElement) {
    const icon = document.createElement('div');
    icon.textContent = "🛒+1";
    icon.className = 'cart-feedback';
    cardElement.appendChild(icon);
    
    // Se elimina automáticamente al acabar la animación CSS
    setTimeout(() => icon.remove(), 1000); 
}

/**
 * Renderiza los slots visuales de la cesta o inventario inferior.
 * [cite: 150]
 * @returns {void}
 */
function renderCartSummary() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const box = document.createElement('div');
        box.className = 'cart-item-box';
        if (state.cart[i]) {
            const img = document.createElement('img');
            img.src = state.cart[i].image;
            img.onerror = function () { this.src = 'https://placehold.co/100?text=Item' };
            box.appendChild(img);
        }
        container.appendChild(box);
    }
}

document.getElementById('btn-buy').addEventListener('click', () => {
    state.cart.forEach(item => state.player.addItem(item));
    renderPlayerCard('player-profile-updated');
    showScene('scene-3');
});

document.getElementById('btn-to-enemies').addEventListener('click', () => {
    renderEnemiesList();
    showScene('scene-4');
});

/* ==========================================================================
   6. LISTA ENEMIGOS
   ========================================================================== */
/**
 * Renderiza la cuadrícula de enemigos y sus estadísticas para la Escena 4.
 * [cite: 174, 275]
 * @returns {void}
 */
function renderEnemiesList() {
    const grid = document.getElementById('enemies-grid');
    grid.innerHTML = '';
    state.enemies.forEach(enemy => {
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

document.getElementById('btn-start-gauntlet').addEventListener('click', () => {
    state.currentEnemyIndex = 0;
    playNextBattle();
});

/* ==========================================================================
   7. BATALLA (Con Animación de Entrada)
   ========================================================================== */
/**
 * Inicia el combate contra el enemigo actual en la secuencia.
 * Gestiona la animación de entrada, el resultado de la batalla y la navegación al siguiente enemigo.
 * [cite: 190, 255]
 * @returns {void}
 */
function playNextBattle() {
    if (state.currentEnemyIndex >= state.enemies.length) {
        finishGame();
        return;
    }
    
    // Revivir si el personaje se queda sin vida para que siga el juego
    if (state.player.totalHp <= 0) {
        state.player.hp = state.player.baseHp;
    }

    const enemy = state.enemies[state.currentEnemyIndex];
    showScene('scene-5');

    document.getElementById('battle-progress').textContent =
        `Combate ${state.currentEnemyIndex + 1} de ${state.enemies.length}`;

    // simulateBattle es una función importada de ./modules/battle.js
    const result = simulateBattle(state.player, enemy);
    const logContainer = document.getElementById('battle-log');

    // REQUISITO: Animación de entrada (Clases CSS: player-enter / enemy-enter) [cite: 255]
    let htmlContent = `
        <div class="battle-vs">
            <div class="card combatant player-enter" style="border:none; background:transparent; box-shadow:none;">
                <img src="${state.player.avatar}" style="width:120px; height:120px; border-radius:50%; border: 3px solid #333;">
                <p><strong>${state.player.name}</strong></p>
            </div>
            
            <div class="vs-text vs-pop" style="font-size:3rem; font-weight:bold; color:#d32f2f;">VS</div>
            
            <div class="card combatant enemy-enter" style="border:none; background:transparent; box-shadow:none;">
                <img src="${enemy.image}" style="width:120px; height:120px; border-radius:50%; border: 3px solid #d32f2f;">
                <p><strong>${enemy.name}</strong></p>
            </div>
        </div>
        <div class="battle-details" style="margin-top:20px; background:white; padding:15px; border-radius:8px;">
            <ul>${result.log.map(line => `<li>${line}</li>`).join('')}</ul>
        </div>
    `;

    const btnAction = document.getElementById('btn-battle-action');
    const isLastEnemy = state.currentEnemyIndex === state.enemies.length - 1;

    const handleNext = () => {
        if (isLastEnemy) {
            finishGame();
        } else {
            state.currentEnemyIndex++;
            playNextBattle();
        }
    };

    if (result.winner === 'player') {
        state.player.addPoints(result.pointsEarned);
        htmlContent += `<div style="color:green; margin-top:10px;"><h3>🏆 ¡VICTORIA! (+${result.pointsEarned} pts)</h3></div>`;
    } else {
        htmlContent += `<div style="color:red; margin-top:10px;"><h3>💀 DERROTA</h3><p>¡Pero sigues adelante!</p></div>`;
    }

    btnAction.textContent = isLastEnemy ? "Ver Resultados Finales" : "Siguiente Batalla ➡️";
    btnAction.onclick = handleNext;
    logContainer.innerHTML = htmlContent;
}

/* ==========================================================================
   8. RESULTADO FINAL (Escena 6 con Confetti)
   ========================================================================== */
/**
 * Muestra la escena final, determina el rango del jugador y activa la animación de confetti.
 * [cite: 203, 256]
 * @returns {void}
 */
function finishGame() {
    showScene('scene-6');
    const scoreDiv = document.getElementById('final-score');
    
    /** @fires triggerConfetti */
    triggerConfetti();

    // categorizePlayer es una función importada de ./modules/ranking.js
    const rango = categorizePlayer(state.player, 500); // 500 es el umbral
    const cssClass = rango === "Netherite" ? "veteran" : "rookie";

    // Modificación: Muestra imagen del jugador, rango y puntos centrados.
    scoreDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
            <div style="margin-bottom: 20px;">
                <img src="${state.player.avatar}" alt="${state.player.name}" 
                     style="width: 180px; height: 180px; object-fit: cover; border-radius: 50%; border: 5px solid #5d4037; box-shadow: 0 8px 16px rgba(0,0,0,0.2);">
            </div>
            
            <h1 class="rank-title ${cssClass}" style="margin: 10px 0;">${rango.toUpperCase()}</h1>
            <h2 style="margin: 0;">Puntos Totales: ${state.player.points}</h2>
        </div>
    `;
}

/**
 * Activa la animación de confetti en la pantalla final utilizando la librería canvas-confetti.
 * [cite: 257]
 * @returns {void}
 */
function triggerConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

document.getElementById('btn-restart').addEventListener('click', () => {
    // Mecanismo para volver a empezar desde cero [cite: 210, 279]
    location.reload(); 
});

/** @fires initGame */
initGame();