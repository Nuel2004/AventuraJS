export class Enemigo {
    name;
    avatar;
    attack;
    hp;

    constructor(name, avatar, attack, hp) {
        this.name = name;
        this.avatar = avatar;
        this.attack = attack;
        this.hp = hp;
        this.type = "Enemigo";
    }

    info() {
        return `Tipo: ${this.type} | Nombre: ${this.name} | Ataque: ${this.attack} | Vida: ${this.hp}`;
    }
}

export class JefeFinal extends Enemigo {

    constructor(name, avatar, attack, hp, multiplierDamage = 1.2) {
        super(name, avatar, attack, hp);
        this.type = "Jefe";
        this.multiplierDamage = multiplierDamage;
    }

    info() {
        return `Jefe: ${this.name} | Multiplicador: ${this.multiplierDamage}`;
    }
}
