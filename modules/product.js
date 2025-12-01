export class Product {

    constructor(name, price, rarity, type, bonus, img) {

        // Validación de tipo del enunciado
        const validTypes = ["Arma", "Armadura", "Consumible"];
        if (!validTypes.includes(type)) {
            throw new Error(`Tipo inválido: ${type}. Tipos válidos: ${validTypes.join(", ")}`);
        }

        this.name = name;
        this.price = price;
        this.rarity = rarity;
        this.type = type;
        this.bonus = Number(bonus);
        this.img = img;

    }

    formatPrice() {
        return (this.price / 100).toFixed(2).replace(".", ",") + "€";
    }

    info() {
        return `Nombre: ${this.name} | Precio: ${this.formatPrice()} | Rareza: ${this.rarity} | Tipo: ${this.type} | Bonus: ${this.bonus}`;
    }

    applyDiscount(percent) {
        percent = Math.min(Math.max(percent, 0), 100);
        const newPrice = Math.round(this.price * (1 - percent / 100));
        return new Product(this.name, newPrice, this.rarity, this.type, this.bonus);
    }
}
