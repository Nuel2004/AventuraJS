import { Product } from './product.js';

/**
 * Lista de productos disponibles en la tienda.
 * @type {Product[]}
 */
export const market = [
    new Product("Espada del Gladiador", 12500, "Épica", "Arma", 50),
    new Product("Escudo del Centinela", 9900, "Rara", "Defensa", 35),
    new Product("Armadura de Asalto", 15800, "Épica", "Armadura", 25),
    new Product("Botas del Jinete", 7200, "Común", "Armadura", 10),
    new Product("Anillo del Fénix", 13400, "Legendaria", "Consumible", 100),
    new Product("Poción de Furia", 450, "Común", "Consumible", 20),
    new Product("Amuleto del Asesino", 8700, "Rara", "Consumible", 15),
    new Product("Casco del Conquistador", 11100, "Épica", "Armadura", 20),
    new Product("Guantes de Precisión", 5600, "Infrecuente", "Armadura", 10),
    new Product("Capa de Invisibilidad", 19900, "Legendaria", "Armadura", 100),
    new Product("Espada de la Aurora", 16200, "Legendaria", "Arma", 55),
    new Product("Arco del Halcón", 9500, "Rara", "Arma", 40),
    new Product("Maza del Vengador", 13700, "Épica", "Arma", 48),
    new Product("Tridente del Leviatán", 17500, "Legendaria", "Arma", 65)
];

/**
 * Filtra los productos por rareza.
 * 
 * @param {string} rarity - Rareza del producto (por ejemplo, "Común", "Rara", "Épica", "Legendaria").
 * @param {Product[]} market - Lista de productos a filtrar.
 * @returns {Product[]} Lista de productos que coinciden con la rareza especificada.
 */
export function filterMarket(rarity, market) {
    return market.filter(product => product.rarity === rarity);
}

/**
 * Busca un producto por su nombre.
 * 
 * @param {Product[]} market - Lista de productos en los que buscar.
 * @param {string} name - Nombre del producto que se desea encontrar.
 * @returns {Product|undefined} El producto encontrado o `undefined` si no existe.
 */
export function search(market, name) {
    return market.find(product => product.name === name);
}

/**
 * Aplica un descuento del 10% a todos los productos de un tipo específico.
 * 
 * @param {Product[]} market - Lista de productos a los que aplicar el descuento.
 * @param {string} type - Tipo de producto (por ejemplo, "Arma", "Armadura", "Accesorio").
 */
export function applyDiscount(market, rarity, percent) {
    return market.map(product => product.rarity === rarity ? product.applyDiscount(percent) : product);
}

/**
 * Muestra la información de un producto.
 * 
 * @param {Product} name - Instancia del producto a presentar.
 * @returns {string} Representación textual del producto.
 */
export function show(product) {
    return product.find();
}