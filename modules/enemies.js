
export class Enemigo {
    constructor(name, levelAtaque, hp, image) {
        this.name = name;
        this.levelAtaque = levelAtaque;
        this.hp = hp;
        this.maxHp = hp;
        this.image = image;
    }
}

export class JefeFinal extends Enemigo {
    /**
     * @param {number} multiplierDamage - Multiplicador de puntos 
     */
    constructor(name, levelAtaque, hp, image, multiplierDamage = 1.2) {
        super(name, levelAtaque, hp, image);
        this.multiplierDamage = multiplierDamage;
    }
}