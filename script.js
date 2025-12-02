/* ==========================================================================
   1. IMPORTACIONES
   ========================================================================== */
import { Player } from "./modules/player.js";
import { Enemigo, JefeFinal } from "./modules/enemies.js";
import { market, applyRandomDiscount } from "./modules/market.js";
import { simulateBattle } from "./modules/battle.js";
// Importamos la función de ranking del archivo ranking.js
import { categorizePlayer } from "./modules/ranking.js"; 

/* ==========================================================================
   2. ESTADO DEL JUEGO
   ========================================================================== */
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
   4. INICIO Y PERFIL (Escena 1)
   ========================================================================== */
function initGame() {
    renderPlayerCard('player-profile-initial');
}

document.getElementById('btn-to-market').addEventListener('click', () => {
    initMarket();
    showScene('scene-2');
});

function renderPlayerCard(containerId) {
    const container = document.getElementById(containerId);
    const p = state.player;
    
    // Aquí se usan implícitamente los Getters de la clase Player (.totalAttack, etc.)
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
   5. MERCADO (Escena 2)
   ========================================================================== */
function initMarket() {
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
        if (state.cart.includes(prod)) card.classList.add('selected');

        // USO DE MÉTODO DE CLASE: prod.getFormattedPrice()
        const precioFormateado = prod.getFormattedPrice();

        card.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}">
            <h4>${prod.name}</h4>
            <p>${prod.type} | ${prod.rarity}</p>
            <p>Bonus: +${prod.bonus}</p>
            <p class="price"><strong>${precioFormateado}</strong></p>
            <button class="btn-action">${state.cart.includes(prod) ? 'Retirar' : 'Añadir'}</button>
        `;

        card.querySelector('.btn-action').addEventListener('click', () => {
            if (state.cart.includes(prod)) {
                state.cart = state.cart.filter(item => item !== prod);
            } else {
                if (state.cart.length < 5) state.cart.push(prod);
                else alert("¡Cesta llena!");
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
    for (let i = 0; i < 5; i++) {
        const box = document.createElement('div');
        box.className = 'cart-item-box';
        if (state.cart[i]) {
            const img = document.createElement('img');
            img.src = state.cart[i].image;
            img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
            box.appendChild(img);
        }
        container.appendChild(box);
    }
}

document.getElementById('btn-buy').addEventListener('click', () => {
    // Esto asegura que se clonen los objetos correctamente al inventario
    state.cart.forEach(item => state.player.addItem(item));
    
    renderPlayerCard('player-profile-updated');
    showScene('scene-3');
});

document.getElementById('btn-to-enemies').addEventListener('click', () => {
    renderEnemiesList();
    showScene('scene-4');
});

/* ==========================================================================
   6. LISTA ENEMIGOS (Escena 4)
   ========================================================================== */
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
   7. BATALLA SECUENCIAL (Escena 5)
   ========================================================================== */
function playNextBattle() {
    // Si ya no quedan enemigos, terminamos
    if (state.currentEnemyIndex >= state.enemies.length) {
        finishGame();
        return;
    }

    const enemy = state.enemies[state.currentEnemyIndex];
    showScene('scene-5');
    
    document.getElementById('battle-progress').textContent = 
        `Combate ${state.currentEnemyIndex + 1} de ${state.enemies.length}`;

    //EL JUGADOR SIEMPRE EMPIEZA CON VIDA MAXIMA 
    const result = simulateBattle(state.player, enemy);
    
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

    const btnAction = document.getElementById('btn-battle-action');
    const isLastEnemy = state.currentEnemyIndex === state.enemies.length - 1;

    // Función para avanzar independientemente del resultado
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
        
        htmlContent += `
            <div class="battle-result win">
                <h3>🏆 ¡VICTORIA!</h3>
                <p>Puntos ganados: <strong>${result.pointsEarned}</strong></p>
            </div>
        `;
    } else {
        htmlContent += `
            <div class="battle-result loss">
                <h3>💀 DERROTA</h3>
                <p>Has sido derrotado por ${enemy.name}.</p>
                <p>¡Pero tu espíritu de lucha te permite continuar al siguiente reto!</p>
            </div>
        `;
    }

    btnAction.textContent = isLastEnemy ? "Ver Resultados Finales" : "Siguiente Batalla ➡️";
    btnAction.onclick = handleNext;
    
    logContainer.innerHTML = htmlContent;
}

/* ==========================================================================
   8. RESULTADO FINAL (Escena 6)
   ========================================================================== */
function finishGame() {
    showScene('scene-6');
    const scoreDiv = document.getElementById('final-score');
    
    // Umbral de 500 puntos para ser Netherite
    const rango = categorizePlayer(state.player, 500);
    
    // Definimos estilos según el resultado de la función
    const cssClass = rango === "Netherite" ? "netherite" : "madera";
    const mensaje = rango === "Netherite" 
        ? "¡Increíble! Eres la cabra del reino." 
        : "Casi crack, la próxima hechale más ganas.";

    scoreDiv.innerHTML = `
        <h1 class="rank-title ${cssClass}">${rango.toUpperCase()}</h1>
        <h2>Puntos Totales: ${state.player.points}</h2>
        <p>${mensaje}</p>
        <div class="final-inventory">
            <h3>Objetos recolectados:</h3>
            <p>${state.player.inventory.map(i => i.name).join(', ') || "Ninguno"}</p>
        </div>
    `;
}

document.getElementById('btn-restart').addEventListener('click', () => {
    location.reload();
});

// Arrancar
initGame();