import { Player } from './player.js';
import { Enemigo, JefeFinal } from './enemies.js';
import { market, applyDiscount } from './market.js';
import { battle } from './battle.js';
import { categorizePlayer } from './ranking.js';
import { getRandomRarity } from './utils.js';
import { RARITIES } from './constants.js';

/** @type {Player} */
let player;

/** @type {Array<Object>} */
let cart = [];

/** @type {Array<Product>} */
let discountedMarket = [];

/** @type {string} */
let discountRarity = '';

/** @type {number} */
let discountPercent = 0;

/** @type {Array<Enemigo|JefeFinal>} */
let enemies = [];

/**
 * Muestra una escena y oculta las demás
 * @param {string} id - ID del elemento a mostrar
 */
function showScene(id) {
  const sceneToShow = document.getElementById(id);

  if (!sceneToShow) {
    console.warn(`Escena con id "${id}" no encontrada`);
    return;
  }

  // Oculta todas las escenas
  document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));

  // Muestra la escena seleccionada
  sceneToShow.classList.add('active');
}

/**
 * Inicializa el juego
 */
function initGame() {
  // Crear jugador
  player = new Player('Héroe', 'img/player.png');
  
  // Crear enemigos
  enemies = [
    new Enemigo('Goblin', 'img/goblin.png', 15, 80),
    new Enemigo('Orco', 'img/orc.png', 25, 120),
    new Enemigo('Troll', 'img/troll.png', 35, 150),
    new JefeFinal('Dragón Oscuro', 'img/dragon.png', 50, 200, 1.5)
  ];

  // Aplicar descuento aleatorio
  discountRarity = getRandomRarity(RARITIES);
  discountPercent = Math.floor(Math.random() * 30) + 10; // 10-40%
  discountedMarket = applyDiscount(market, discountRarity, discountPercent);

  // Reiniciar carrito
  cart = [];

  // Renderizar escena inicial
  renderInitScene();
  showScene('init');
}

/**
 * Renderiza la escena inicial con la información del jugador
 */
function renderInitScene() {
  const scene = document.getElementById('init');
  scene.innerHTML = `
    <div class="player-card">
      <img src="${player.avatar}" alt="${player.name}" class="player-avatar">
      <h2>${player.name}</h2>
      <div class="player-stats">
        <p>💰 Puntos: ${player.points}</p>
        <p>❤️ Vida: ${player.hp}/${player.hpMax}</p>
        <p>⚔️ Ataque: ${player.getAttackTotal()}</p>
        <p>🛡️ Defensa: ${player.getDefenseTotal()}</p>
      </div>
    </div>
    <button class="btn-continue" id="btn-to-market">Ir al Mercado</button>
  `;

  document.getElementById('btn-to-market').addEventListener('click', () => {
    renderMarketScene();
    showScene('market');
  });
}

/**
 * Renderiza la escena del mercado
 */
function renderMarketScene() {
  const scene = document.getElementById('market');
  
  let productsHTML = discountedMarket.map((product, index) => {
    const isInCart = cart.some(item => item.name === product.name);
    const originalProduct = market.find(p => p.name === product.name);
    const hasDiscount = product.rarity === discountRarity;
    
    return `
      <div class="product-card ${isInCart ? 'in-cart' : ''}" data-index="${index}">
        <div class="product-rarity ${product.rarity.toLowerCase()}">${product.rarity}</div>
        ${hasDiscount ? `<div class="discount-badge">-${discountPercent}%</div>` : ''}
        <h3>${product.name}</h3>
        <div class="product-type">${product.type}</div>
        <p class="product-bonus">+${product.bonus} ${getBonusIcon(product.type)}</p>
        <p class="product-price">
          ${hasDiscount ? `<span class="old-price">${originalProduct.formatPrice()}</span>` : ''}
          ${product.formatPrice()}
        </p>
        <button class="btn-add" data-name="${product.name}">
          ${isInCart ? 'Retirar' : 'Añadir'}
        </button>
      </div>
    `;
  }).join('');

  scene.innerHTML = `
    <h2>🏪 Mercado</h2>
    <div class="discount-info">¡Descuento del ${discountPercent}% en productos ${discountRarity}!</div>
    <div class="products-grid">${productsHTML}</div>
    <div class="cart-section">
      <h3>Carrito de Compras</h3>
      <div class="cart-items" id="cart-items">
        ${cart.length === 0 ? '<p>Carrito vacío</p>' : ''}
      </div>
    </div>
    <button class="btn-continue" id="btn-confirm-purchase">Confirmar Compra</button>
  `;

  // Event listeners para añadir/retirar productos
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productName = e.target.dataset.name;
      toggleCart(productName);
    });
  });

  document.getElementById('btn-confirm-purchase').addEventListener('click', () => {
    confirmPurchase();
  });

  renderCart();
}

/**
 * Obtiene el icono correspondiente al bonus según el tipo
 * @param {string} type - Tipo de producto
 * @returns {string} Icono del bonus
 */
function getBonusIcon(type) {
  const icons = {
    'Arma': '⚔️',
    'Armadura': '🛡️',
    'Consumible': '❤️'
  };
  return icons[type] || '';
}

/**
 * Alterna un producto entre el carrito y el mercado
 * @param {string} productName - Nombre del producto
 */
function toggleCart(productName) {
  const index = cart.findIndex(item => item.name === productName);
  
  if (index !== -1) {
    // Retirar del carrito
    cart.splice(index, 1);
  } else {
    // Añadir al carrito
    const product = discountedMarket.find(p => p.name === productName);
    if (product) {
      cart.push(product);
    }
  }
  
  renderMarketScene();
}

/**
 * Renderiza el carrito de compras
 */
function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Carrito vacío</p>';
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name}</span>
      <span>${item.formatPrice()}</span>
    </div>
  `).join('');
}

/**
 * Confirma la compra y añade los productos al inventario del jugador
 */
function confirmPurchase() {
  cart.forEach(product => {
    player.addItem(product);
  });
  
  renderInventoryScene();
  showScene('player-inventory');
}

/**
 * Renderiza la escena del inventario del jugador
 */
function renderInventoryScene() {
  const scene = document.getElementById('player-inventory');
  
  const inventoryHTML = player.inventory.map(item => `
    <div class="inventory-item">
      <h4>${item.name}</h4>
      <p>${item.type}: +${item.bonus}</p>
    </div>
  `).join('');

  scene.innerHTML = `
    <h2>📦 Tu Inventario</h2>
    <div class="player-card">
      <img src="${player.avatar}" alt="${player.name}" class="player-avatar">
      <h3>${player.name}</h3>
      <div class="player-stats">
        <p>❤️ Vida Total: ${player.hp + player.getLifeTotal()}</p>
        <p>⚔️ Ataque Total: ${player.getAttackTotal()}</p>
        <p>🛡️ Defensa Total: ${player.getDefenseTotal()}</p>
      </div>
    </div>
    <div class="inventory-grid">${inventoryHTML}</div>
    <button class="btn-continue" id="btn-to-enemies">Ver Enemigos</button>
  `;

  document.getElementById('btn-to-enemies').addEventListener('click', () => {
    renderEnemiesScene();
    showScene('enemies');
  });
}

/**
 * Renderiza la escena de los enemigos
 */
function renderEnemiesScene() {
  const scene = document.getElementById('enemies');
  
  const enemiesHTML = enemies.map((enemy, index) => `
    <div class="enemy-card">
      <img src="${enemy.avatar}" alt="${enemy.name}" class="enemy-avatar">
      <h3>${enemy.name}</h3>
      <div class="enemy-stats">
        <p>⚔️ Ataque: ${enemy.attack}</p>
        <p>❤️ Vida: ${enemy.hp}</p>
        ${enemy.type === 'Jefe' ? `<p>⭐ Multiplicador: x${enemy.multiplierDamage}</p>` : ''}
      </div>
    </div>
  `).join('');

  scene.innerHTML = `
    <h2>👹 Enemigos</h2>
    <div class="enemies-grid">${enemiesHTML}</div>
    <button class="btn-continue" id="btn-to-battles">Comenzar Batallas</button>
  `;

  document.getElementById('btn-to-battles').addEventListener('click', () => {
    renderBattlesScene();
    showScene('battles');
  });
}

/**
 * Renderiza la escena de las batallas
 */
function renderBattlesScene() {
  const scene = document.getElementById('battles');
  let battlesHTML = '<h2>⚔️ Batallas</h2>';
  
  // Aplicar bonus de consumibles a la vida
  player.hp = Math.min(player.hp + player.getLifeTotal(), player.hpMax + player.getLifeTotal());
  
  let currentBattle = 0;

  const executeBattle = () => {
    if (currentBattle >= enemies.length) {
      renderRankingScene();
      showScene('ranket');
      return;
    }

    const enemy = enemies[currentBattle];
    const enemyCopy = { ...enemy };
    const playerCopy = { hp: player.hp };

    const result = battle({ ...player, hp: playerCopy.hp }, enemyCopy);
    
    player.hp = result.winner === player ? player.hp : 0;
    
    const battleResult = `
      <div class="battle-result">
        <h3>Batalla ${currentBattle + 1}: ${player.name} vs ${enemy.name}</h3>
        <p class="${result.winner === player ? 'victory' : 'defeat'}">
          ${result.winner === player ? '🎉 ¡Victoria!' : '💀 Derrota'}
        </p>
        <p>Puntos ganados: ${result.points}</p>
        <p>Puntos totales: ${player.points}</p>
      </div>
    `;
    
    battlesHTML += battleResult;
    scene.innerHTML = battlesHTML;

    if (result.winner !== player) {
      scene.innerHTML += '<button class="btn-continue" id="btn-to-ranking">Ver Resultado Final</button>';
      document.getElementById('btn-to-ranking').addEventListener('click', () => {
        renderRankingScene();
        showScene('ranket');
      });
      return;
    }

    currentBattle++;
    
    if (currentBattle < enemies.length) {
      scene.innerHTML = battlesHTML + '<button class="btn-continue" id="btn-next-battle">Siguiente Batalla</button>';
      document.getElementById('btn-next-battle').addEventListener('click', executeBattle);
    } else {
      scene.innerHTML = battlesHTML + '<button class="btn-continue" id="btn-to-ranking">Ver Resultado Final</button>';
      document.getElementById('btn-to-ranking').addEventListener('click', () => {
        renderRankingScene();
        showScene('ranket');
      });
    }
  };

  executeBattle();
}

/**
 * Renderiza la escena del ranking final
 */
function renderRankingScene() {
  const scene = document.getElementById('ranket');
  const category = categorizePlayer(player);
  
  scene.innerHTML = `
    <h2>🏆 Resultado Final</h2>
    <div class="result-card">
      <img src="${player.avatar}" alt="${player.name}" class="player-avatar-large">
      <h3>${player.name}</h3>
      <p class="category ${category.toLowerCase()}">${category}</p>
      <p class="final-points">Puntuación Final: ${player.points}</p>
    </div>
    <button class="btn-continue" id="btn-restart">Jugar de Nuevo</button>
  `;

  document.getElementById('btn-restart').addEventListener('click', () => {
    initGame();
  });
}

// Iniciar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', initGame);