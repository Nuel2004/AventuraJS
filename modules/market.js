import { Product } from "./product.js";

export const market = [
    new Product("Espada del Gladiador", 12500, "Épica", "Arma", 50, "images/espada.png"),
    new Product("Escudo del Centinela", 9900, "Rara", "Armadura", 35, "images/botas.png"),
    new Product("Armadura de Asalto", 15800, "Épica", "Armadura", 25),
    new Product("Botas del Jinete", 7200, "Común", "Armadura", 10, "images/escudo.png"),
    new Product("Anillo del Fénix", 13400, "Legendaria", "Consumible", 100),
    new Product("Poción de Furia", 450, "Común", "Consumible", 20),
    new Product("Casco del Conquistador", 11100, "Épica", "Armadura", 20),
    new Product("Guantes de Precisión", 5600, "Infrecuente", "Armadura", 10),
    new Product("Capa de Invisibilidad", 19900, "Legendaria", "Armadura", 100),
    new Product("Espada de la Aurora", 16200, "Legendaria", "Arma", 55),
    new Product("Arco del Halcón", 9500, "Rara", "Arma", 40),
    new Product("Maza del Vengador", 13700, "Épica", "Arma", 48),
    new Product("Tridente del Leviatán", 17500, "Legendaria", "Arma", 65)
];

export function filterMarket(rarity, market) {
    return market.filter(p => p.rarity === rarity);
}

export function search(market, name) {
    return market.find(p => p.name === name);
}

export function applyDiscount(market, rarity, percent) {
    return market.map(p => p.rarity === rarity ? p.applyDiscount(percent) : p);
}
