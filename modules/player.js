export class Player {
    constructor(name, avatar) {
        this.name = name;
        this.avatar = avatar;
        this.points = 0; // Puntos iniciales a 0 según PDF [cite: 53]
        this.baseHp = 100;
        this.inventory = [];
    }

    /**
     * Añade un objeto clonado al inventario [cite: 57]
     */
    addItem(item) {
        // Clonamos usando JSON (deep clone simple)
        const clonedItem = JSON.parse(JSON.stringify(item));
        this.inventory.push(clonedItem);
    }

    /**
     * Calcula ataque total basado en objetos tipo 'Arma' [cite: 90]
     */
    get totalAttack() {
        return this.inventory
            .filter(i => i.type === 'Arma')
            .reduce((sum, i) => sum + i.bonus, 0);
    }

    /**
     * Calcula defensa total basado en objetos tipo 'Armadura' [cite: 91]
     */
    get totalDefense() {
        return this.inventory
            .filter(i => i.type === 'Armadura')
            .reduce((sum, i) => sum + i.bonus, 0);
    }

    /**
     * Calcula vida total. Base + bonos de 'Consumible' (interpretado como max HP pasiva o cura) [cite: 92]
     */
    get totalHp() {
        const bonusHp = this.inventory
            .filter(i => i.type === 'Consumible')
            .reduce((sum, i) => sum + i.bonus, 0);
        return this.baseHp + bonusHp;
    }
    /**
     * Añade la puntuación obtenida al jugador
     * @param {number} points - Puntos a añadir
     */
    addPoints(points) {
        this.points += points;
    }
}