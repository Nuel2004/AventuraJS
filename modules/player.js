function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export class Player {

    constructor(name, avatar) {
        this.name = name;
        this.avatar = "images/caballero.png";
        this.points = 0;
        this.hpMax = 200;
        this.hp = this.hpMax;
        this.inventory = [];
    }

    addItem(item) {
        this.inventory.push(deepClone(item));
    }

    buyItem(name, market) {
        const item = market.find(p => p.name === name);
        if (!item) return false;

        this.addItem(item);
        return true;
    }

    getAttackTotal() {
        return this.inventory
            .filter(i => i.type === "Arma")
            .reduce((sum, item) => sum + item.bonus, 0);
    }

    getDefenseTotal() {
        return this.inventory
            .filter(i => i.type === "Armadura")
            .reduce((sum, item) => sum + item.bonus, 0);
    }

    getLifeTotal() {
        return this.inventory
            .filter(i => i.type === "Consumible")
            .reduce((sum, item) => sum + item.bonus, 0);
    }

    useConsumable(name) {
        const item = this.inventory.find(i => i.name === name && i.type === "Consumible");
        if (!item) return false;

        this.hp = Math.min(this.hp + item.bonus, this.hpMax);
        this.inventory = this.inventory.filter(i => i !== item);
        return true;
    }
}
