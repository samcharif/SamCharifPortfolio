// === TYPE CHART ===
const typeChart = {
    Electric: { Water: 2, Grass: 0.5 },
    Fire: { Grass: 2, Water: 0.5 },
    Water: { Fire: 2, Grass: 0.5 },
    Grass: { Water: 2, Fire: 0.5 },
    Normal: {},
    Steel: {},
};

// === GET MULTIPLIER FUNCTION ===
function getMultiplier(attackerType, defenderType) {
    return typeChart[attackerType]?.[defenderType] || 1;
}

// === PLAYER POKÉMON ===
const playerPokemon = {
    name: "Pikachu",
    type: "Electric",
    hp: 100,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    moves: [
        { name: "Thunderbolt", type: "Electric", damage: 25 },
        { name: "Quick Attack", type: "Normal", damage: 15 },
        { name: "Iron Tail", type: "Steel", damage: 20 },
    ]
};

// === ENEMY ROSTER ===
const enemyRoster = [
    {
        name: "Charmander",
        type: "Fire",
        hp: 100,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        moves: [
            { name: "Flamethrower", type: "Fire", damage: 25 },
            { name: "Scratch", type: "Normal", damage: 10 },
            { name: "Ember", type: "Fire", damage: 20 },
        ]
    },
    {
        name: "Squirtle",
        type: "Water",
        hp: 100,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
        moves: [
            { name: "Water Gun", type: "Water", damage: 20 },
            { name: "Tackle", type: "Normal", damage: 10 },
            { name: "Bubble", type: "Water", damage: 15 },
        ]
    },
    {
        name: "Bulbasaur",
        type: "Grass",
        hp: 100,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        moves: [
            { name: "Vine Whip", type: "Grass", damage: 20 },
            { name: "Tackle", type: "Normal", damage: 10 },
            { name: "Leech Seed", type: "Grass", damage: 15 },
        ]
    }
];

// === CHOOSE RANDOM ENEMY ===
const enemyPokemon = JSON.parse(JSON.stringify(
    enemyRoster[Math.floor(Math.random() * enemyRoster.length)]
));

// === CURRENT HP ===
let playerHP = playerPokemon.hp;
let enemyHP = enemyPokemon.hp;

// === INIT DISPLAY ===
document.getElementById("player-name").textContent = playerPokemon.name;
document.getElementById("enemy-name").textContent = enemyPokemon.name;
document.getElementById("player-img").src = playerPokemon.img;
document.getElementById("enemy-img").src = enemyPokemon.img;

// === LOG MESSAGE (WITH DELAY) ===
function logMessage(msg, delay = 0) {
    setTimeout(() => {
        document.getElementById("log").textContent = msg;
    }, delay);
}

// === DISABLE MOVE BUTTONS ===
function disableButtons() {
    document.querySelectorAll("#move-buttons button").forEach(btn => btn.disabled = true);
}

// === ENABLE MOVE BUTTONS ===
function enableButtons() {
    document.querySelectorAll("#move-buttons button").forEach(btn => btn.disabled = false);
}

// === PLAYER TURN ===
function playerTurn(moveIndex) {
    disableButtons();

    const move = playerPokemon.moves[moveIndex];
    const variation = Math.floor(Math.random() * 6) - 3;
    const multiplier = getMultiplier(move.type, enemyPokemon.type);
    const damage = Math.max(0, Math.round((move.damage + variation) * multiplier));
    enemyHP -= damage;
    if (enemyHP < 0) enemyHP = 0;

    logMessage(`${playerPokemon.name} used ${move.name}!`, 0);
    setTimeout(() => {
        logMessage(`It dealt ${damage} damage!`, 1000);
        document.getElementById("enemy-hp").textContent = enemyHP;
    }, 1000);

    if (enemyHP <= 0) {
        setTimeout(() => {
            logMessage(`${enemyPokemon.name} fainted! You win!`, 2000);
        }, 2000);
        return;
    }

    setTimeout(enemyTurn, 2500);
}

// === ENEMY TURN ===
function enemyTurn() {
    const move = enemyPokemon.moves[Math.floor(Math.random() * enemyPokemon.moves.length)];
    const variation = Math.floor(Math.random() * 6) - 3;
    const multiplier = getMultiplier(move.type, playerPokemon.type);
    const damage = Math.max(0, Math.round((move.damage + variation) * multiplier));
    playerHP -= damage;
    if (playerHP < 0) playerHP = 0;

    logMessage(`${enemyPokemon.name} used ${move.name}!`, 0);
    setTimeout(() => {
        logMessage(`It dealt ${damage} damage!`, 1000);
        document.getElementById("player-hp").textContent = playerHP;
    }, 1000);

    if (playerHP <= 0) {
        setTimeout(() => {
            logMessage(`${playerPokemon.name} fainted! You lose!`, 2000);
            disableButtons();
        }, 2000);
    } else {
        setTimeout(() => {
            enableButtons();
        }, 2500);
    }
}

// === RENDER MOVE BUTTONS ===
const moveButtonsDiv = document.getElementById("move-buttons");
playerPokemon.moves.forEach((move, index) => {
    const btn = document.createElement("button");
    btn.textContent = move.name;
    btn.addEventListener("click", () => {
        playerTurn(index);
    });
    moveButtonsDiv.appendChild(btn);
});
