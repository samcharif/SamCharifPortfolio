const playerPokemon = {
    name: "Pikachu",
    hp: 100,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png",
    moves: [
        { name: "Thunderbolt", damage: 25 },
        { name: "Quick Attack", damage: 15 },
        { name: "Iron Tail", damage: 20 }
    ]
};

const enemyPokemon = {
    name: "Charmander",
    hp: 100,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    moves: [
        { name: "Flamethrower", damage: 25 },
        { name: "Scratch", damage: 10 },
        { name: "Ember", damage: 20 }
    ]
};

let playerHP = playerPokemon.hp;
let enemyHP = enemyPokemon.hp;

// Set names and sprites
document.getElementById("player-name").textContent = playerPokemon.name;
document.getElementById("enemy-name").textContent = enemyPokemon.name;
document.querySelector("#player-back").src = playerPokemon.img;
document.querySelector("#enemy-front").src = enemyPokemon.img;

// Add move buttons
const moveButtons = document.getElementById("move-buttons");
playerPokemon.moves.forEach((move, index) => {
    const btn = document.createElement("button");
    btn.textContent = move.name;
    btn.addEventListener("click", () => handleAttack(index));
    moveButtons.appendChild(btn);
});

function handleAttack(moveIndex) {
    const log = document.getElementById("log");
    const move = playerPokemon.moves[moveIndex];
    log.textContent = `${playerPokemon.name} used ${move.name}!`;

    enemyHP -= move.damage;
    if (enemyHP < 0) enemyHP = 0;
    updateHP("enemy", enemyHP);

    if (enemyHP === 0) {
        log.textContent += ` ${enemyPokemon.name} fainted! You win!`;
        disableButtons();
        return;
    }

    setTimeout(() => {
        const enemyMove = enemyPokemon.moves[Math.floor(Math.random() * enemyPokemon.moves.length)];
        log.textContent += ` ${enemyPokemon.name} used ${enemyMove.name}!`;
        playerHP -= enemyMove.damage;
        if (playerHP < 0) playerHP = 0;
        updateHP("player", playerHP);

        if (playerHP === 0) {
            log.textContent += ` ${playerPokemon.name} fainted! You lose!`;
            disableButtons();
        }
    }, 1000);
}

function updateHP(who, hp) {
    const bar = document.getElementById(`${who}-hp-bar`);
    const text = document.getElementById(`${who}-hp`);
    text.textContent = hp;
    bar.style.width = `${hp}%`;
}

function disableButtons() {
    document.querySelectorAll("#move-buttons button").forEach(btn => btn.disabled = true);
}
