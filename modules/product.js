/**
 * Representa un producto dentro del sistema.
 */
export class Product {
    /**
     * @param {string} name 
     * @param {number} price (en céntimos)
     * @param {string} rarity 
     * @param {string} type 
     * @param {number} bonus 
     * @param {string} image 
     */
    constructor(name, price, rarity, type, bonus, image) {
        this.name = name;
        this.price = price;
        this.rarity = rarity;
        this.type = type;
        this.bonus = bonus; // Valor numérico [cite: 88]
        this.image = image || "https://placehold.co/100"; // Imagen por defecto
    }

    /**
     * Devuelve el precio formateado 
     * @returns {string}
     */
    getFormattedPrice() {
        return (this.price / 100).toFixed(2).replace('.', ',') + '€';
    }

    applyDiscount(percent) {
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        const newPrice = Math.round(this.price * (1 - (percent / 100)));
        return new Product(this.name, newPrice, this.rarity, this.type, this.bonus, this.image);
    }
}