/**
 * Representa un producto dentro del sistema de inventario o tienda.
 * 
 * @class
 * @exports Product
 */
export class Product {

    /**
     * Crea una nueva instancia de un producto.
     * 
     * @param {string} name - Nombre del producto (por ejemplo, "Espada del Gladiador").
     * @param {number} price - Precio del producto en céntimos (por ejemplo, 12500 representa 125,00€).
     * @param {string} rarity - Rareza del producto (por ejemplo, "Común", "Rara", "Épica", "Legendaria").
     * @param {string} type - Tipo de producto (por ejemplo, "Arma", "Armadura", "Accesorio", "Consumible").
     * @param {string} bonus - Descripción del efecto o mejora que otorga el producto.
     */
    constructor(name, price, rarity, type, bonus) {
        /**
         * Nombre del producto.
         * @type {string}
         */
        this.name = name;

        /**
         * Precio del producto en céntimos.
         * @type {number}
         */
        this.price = price;

        /**
         * Rareza del producto.
         * @type {string}
         */
        this.rarity = rarity;

        /**
         * Tipo de producto.
         * @type {string}
         */
        this.type = type;

        /**
         * Bonus o beneficio adicional del producto.
         * @type {string}
         */
        this.bonus = bonus;
    }

    /**
     * Muestra la información del producto en consola con formato legible.
     * 
     * Ejemplo de salida:
     * ```
     * Nombre: Espada del Gladiador  Precio: 125,00€  Rareza: Épica  Tipo: Arma  Bonus: +50 ATQ
     * ```
     * 
     * @returns {void}
     */
    find() {
        const formatPrice = (this.price / 100).toFixed(2).replace('.', ',') + '€';
        return `Nombre: ${this.name} Precio: ${formatPrice} Rareza: ${this.rarity} Tipo: ${this.type} Bonus: ${this.bonus}`;
    }

    /**
    * Crea una nueva instancia del producto aplicando un descuento porcentual sobre su precio.
    *
    * El porcentaje se limita entre 0% y 100%.  
    * Si el valor está fuera de rango, se ajusta automáticamente.
    *
    * @param {number} percent - Porcentaje de descuento a aplicar (por ejemplo, `20` para un 20%).
    * @returns {Product} Una nueva instancia de {@link Product} con el precio actualizado.
    *
    * @example
    * const espada = new Product("Espada del Gladiador", 12500, "Épica", "Arma", "+50 ATQ");
    * const espadaDescuento = espada.discount(20);
    * console.log(espadaDescuento.price); // → 10000
    */
    applyDiscount(percent) {
        if (percent < 0) { percent = 0 }
        if (percent > 100) { percent = 100 }
        const newPrice = Math.round(this.price * (1 - (percent / 100)));
        return new Product(this.name, newPrice, this.rarity, this.type, this.bonus);
    }
}