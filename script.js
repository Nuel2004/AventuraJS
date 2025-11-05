import { Enemigo, JefeFinal } from "./modules/enemies.js";
import { market, show, applyDiscount, filterMarket, search } from "./modules/market.js";
import { Product } from "./modules/product.js"; 
import { Player } from "./modules/player.js";


//creación de jugadores
const player1 = new Player('Gabino el Guardián');
const player2 = new Player('Rodas el Inquebrantable');
const player3 = new Player('Dama Amina la Valiente');
const player4 = new Player('Sir Angel el Justo');
const player5 = new Player('Sir Miguel de la Espada Dorada');


// creacion de enemigos
const Enemigos =[
    new Enemigo('enemigo', 'Goblin', 3, 30),
    new Enemigo('enemigo', 'Orco', 5, 50),
    new Enemigo('enemigo', 'Bandido', 6, 60)
]


//crear const enemigo va ser una lista 
const JefeFinales=[
    new JefeFinal('Dragón', 10, 200, 'Aliento de fuego'),
    new JefeFinal('Nigromante', 8, 150, 'Invocación de esqueletos', 3)

];

// mostart datos
Enemigos.forEach(e => console.log(e.action()));
JefeFinales.forEach(j => console.log(j.action()));



//enseñar mercado
console.log("Inicio Mercado");
market.forEach(product => {
    console.log(show(product)); // usamos la función show() para mostrar info
});

//descuento a legendarios
console.log("\n=== Aplicando 10% de descuento a productos Legendarios ===");
const discountedMarket = applyDiscount(market, "Legendaria", 10);
discountedMarket.forEach(product => console.log(show(product)));

// Filtrar por rareza legendaria
const epicProducts = filterMarket("Legendaria", market);
console.log("\n=== Productos Legendarios ===");
epicProducts.forEach(product => console.log(show(product)));

// Buscar un producto especifico
const espada = search(market, "Espada del Gladiador");
console.log("\n=== Buscando Espada del Gladiador ===");
if (espada) {
    console.log(show(espada));
} else {
    console.log("Producto no encontrado");
}

// Compras para player1: un producto de cada tipo y 3 armas 
player1.BuyItem("Escudo del Centinela", market); 
player1.BuyItem("Armadura de Asalto", market);   
player1.BuyItem("Anillo del Fénix", market);     
player1.BuyItem("Espada del Gladiador", market); 
player1.BuyItem("Espada de la Aurora", market);  
player1.BuyItem("Arco del Halcón", market);      

console.log(player1.useAttackItem("Espada del Gladiador"));
console.log(player1.useDefenseItem("Escudo del Centinela"));
console.log(player1.useDefenseItem("Armadura de Asalto"));
console.log(player1.useHpItem("Anillo del Fénix"));

console.log(`\n=== Estado de ${player1.name} después de compras ===`);
console.log(player1.playerToString());



// Compras para player2: un producto de cada tipo y 3 armas 
player2.BuyItem("Escudo del Centinela", market);
player2.BuyItem("Botas del Jinete", market);    
player2.BuyItem("Poción de Furia", market);      
player2.BuyItem("Maza del Vengador", market);    
player2.BuyItem("Tridente del Leviatán", market);
player2.BuyItem("Espada del Gladiador", market); 

console.log(player2.useAttackItem("Maza del Vengador"));
console.log(player2.useAttackItem("Tridente del Leviatán"));
console.log(player2.useDefenseItem("Botas del Jinete"));
console.log(player2.useHpItem("Poción de Furia"));

console.log(`\n=== Estado de ${player2.name} después de compras ===`);
console.log(player2.playerToString());

// Compras para player3: un producto de cada tipo y 2 armas 
player3.BuyItem("Escudo del Centinela", market); 
player3.BuyItem("Casco del Conquistador", market);
player3.BuyItem("Amuleto del Asesino", market);  
player3.BuyItem("Arco del Halcón", market);      
player3.BuyItem("Maza del Vengador", market);   

console.log(player3.useAttackItem("Arco del Halcón"));
console.log(player3.useDefenseItem("Escudo del Centinela"));
console.log(player3.useHpItem("Amuleto del Asesino"));

console.log(`\n=== Estado de ${player3.name} después de compras ===`);
console.log(player3.playerToString());

// Compras para player4: un producto de cada tipo y 3 armas 
player4.BuyItem("Escudo del Centinela", market); 
player4.BuyItem("Guantes de Precisión", market); 
player4.BuyItem("Anillo del Fénix", market);     
player4.BuyItem("Tridente del Leviatán", market);
player4.BuyItem("Espada de la Aurora", market);  
player4.BuyItem("Arco del Halcón", market);     

console.log(player4.useAttackItem("Tridente del Leviatán"));
console.log(player4.useAttackItem("Espada de la Aurora"));
console.log(player4.useDefenseItem("Guantes de Precisión"));

console.log(`\n=== Estado de ${player4.name} después de compras ===`);
console.log(player4.playerToString());

// Compras para player5: un producto de cada tipo y 2 armas 
player5.BuyItem("Escudo del Centinela", market); 
player5.BuyItem("Capa de Invisibilidad", market);
player5.BuyItem("Poción de Furia", market);      
player5.BuyItem("Espada del Gladiador", market); 
player5.BuyItem("Tridente del Leviatán", market);

console.log(player5.useAttackItem("Espada del Gladiador"));
console.log(player5.useDefenseItem("Escudo del Centinela"));
console.log(player5.useDefenseItem("Capa de Invisibilidad"));

console.log(`\n=== Estado de ${player5.name} después de compras ===`);
console.log(player5.playerToString());