const playerPokemon = {
    name: "Pikachu",
    hp: 100,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    moves: [
        { name: "Thunderbolt", damage: 25 },
        { name: "Quick Attack", damage: 15 },
        { name: "Iron Tail", damage: 20 },
    ]
};

const enemyPokemon = {
    name: "Charmander",
    hp: 100,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    moves: [
        { name: "Flamethrower", damage: 25 },
        { name: "Scratch", damage: 10 },
        { name: "Ember", damage: 20 },
    ]
};

let playerHP = playerPokemon.hp;
let enemyHP = enemyPokemon.hp;

document.getElementById("player-name").textContent = playerPokemon.name;
document.getElementById("enemy-name").textContent = enemyPokemon.name;
document.getElementById("player-img").src = playerPokemon.img;
document.getElementById("enemy-img").src = enemyPokemon.img;

const moveButtonsDiv = document.getElementById("move-buttons");
playerPokemon.moves.forEach((move, index) => {
    const btn = document.createElement("button");
    btn.textContent = move.name;
    btn.addEventListener("click", () => {
        attack(index);
    });
    moveButtonsDiv.appendChild(btn);
});

function attack(moveIndex) {
    const log = document.getElementById("log");

    // Player attack
    const move = playerPokemon.moves[moveIndex];
    enemyHP -= move.damage;
    if (enemyHP < 0) enemyHP = 0;
    document.getElementById("enemy-hp").textContent = enemyHP;
    log.textContent = `${playerPokemon.name} used ${move.name}!`;

    if (enemyHP <= 0) {
        log.textContent += ` ${enemyPokemon.name} fainted! You win!`;
        disableButtons();
        return;
    }

    // Enemy counterattack
    setTimeout(() => {
        const enemyMove = enemyPokemon.moves[Math.floor(Math.random() * enemyPokemon.moves.length)];
        playerHP -= enemyMove.damage;
        if (playerHP < 0) playerHP = 0;
        document.getElementById("player-hp").textContent = playerHP;
        log.textContent += ` ${enemyPokemon.name} used ${enemyMove.name}!`;

        if (playerHP <= 0) {
            log.textContent += ` ${playerPokemon.name} fainted! You lose!`;
            disableButtons();
        }
    }, 1000);
}

function disableButtons() {
    document.querySelectorAll("#move-buttons button").forEach(btn => btn.disabled = true);
}
