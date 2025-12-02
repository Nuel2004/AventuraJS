import { Product } from './product.js';

export const market = [
    new Product("Espada del Gladiador", 12500, "Épica", "Arma", 50, "images/espada.png"),
    new Product("Escudo del Centinela", 9900, "Rara", "Armadura", 35, "images/escudo.png"), // Cambiado tipo a Armadura para consistencia
    new Product("Manzana", 4000, "Común", "Consumible", 10, "images/manzana.png"),
    new Product("Armadura de Cuero", 18000, "Común", "Armadura", 6, "images/armadura.png"),
    new Product("Hacha", 12000, "Común", "Arma", 8, "images/hacha.png"),
    new Product("Poción Mayor", 5000, "Rara", "Consumible", 50, "images/pocion.png"),
];

export function applyRandomDiscount(marketList) {
    const rarities = ["Común", "Rara", "Épica", "Legendaria"];
    const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
    const discount = Math.floor(Math.random() * 30) + 10; // Entre 10% y 40%

    console.log(`Aplicando descuento del ${discount}% a rareza: ${randomRarity}`); // Solo para depuración interna
    
    return marketList.map(p => 
        p.rarity === randomRarity ? p.applyDiscount(discount) : p
    );
}