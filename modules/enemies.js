export class Enemigo {
    type;
    name;
    levelAtaque;
    hp; 

    constructor(type,name,levelAtaque,hp){
        this.type='Enemigo';
        this.name=name;
        this.levelAtaque=levelAtaque;
        this.hp=hp;
    }
    action(){
        return `Tipo: ${this.type} | Nombre: ${this.name} | Nivel de ataque: ${this.levelAtaque} | Puntos de vida: ${this.hp}`;    
    }
}

export class JefeFinal extends Enemigo {
    specialSkill;
    multiplierDamage;
    constructor(name,levelAtaque,hp,specialSkill,multiplierDamage=1.3 ){
        super(name,levelAtaque,hp)
        this.type= 'Jefe';
        this.specialSkill=specialSkill;
        this.multiplierDamage=this.multiplierDamage;
    }

    action(){
        return `Soy ${this.name}. Habilidad especial: ${this.specialSkill}. Daño multiplicado por ${this.multiplierDamage}.`;
    }
}