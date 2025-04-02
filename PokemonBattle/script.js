// === TYPE CHART ===
const typeChart = {
    Electric: { Water: 2, Grass: 0.5 },
    Fire: { Grass: 2, Water: 0.5 },
    Water: { Fire: 2, Grass: 0.5 },
    Grass: { Water: 2, Fire: 0.5 },
    Normal: {},
    Steel: {},
};

function getMultiplier(attackerType, defenderType) {
    return typeChart[attackerType]?.[defenderType] || 1;
}

// === PLAYER OPTIONS ===
const playerRoster = [
    {
        name: "Pikachu",
        type: "Electric",
        hp: 100,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png",
        moves: [
            { name: "Thunderbolt", type: "Electric", damage: 25 },
            { name: "Quick Attack", type: "Normal", damage: 15 },
            { name: "Iron Tail", type: "Steel", damage: 20 },
        ]
    },
    {
        name: "Charmander",
        type: "Fire",
        hp: 100,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png",
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
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png",
        moves: [
            { name: "Water Gun", type: "Water", damage: 20 },
            { name: "Tackle", type: "Normal", damage: 10 },
            { name: "Bubble", type: "Water", damage: 15 },
        ]
    }
];

// === ENEMY OPTIONS ===
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

const playerPokemon = {}; // selected by player
let playerHP = 100;
let enemyHP = enemyPokemon.hp;

// === SELECT SCREEN LOGIC ===
document.querySelectorAll('#pokemon-select-screen button').forEach(btn => {
    btn.addEventListener('click', e => {
        const choice = e.target.dataset.name;
        const selected = playerRoster.find(p => p.name === choice);
        Object.assign(playerPokemon, JSON.parse(JSON.stringify(selected)));

        document.getElementById("pokemon-select-screen").style.display = "none";
        document.querySelector(".container").style.display = "block";
        setupBattle();
    });
});

// === INITIAL SETUP ===
function setupBattle() {
    playerHP = playerPokemon.hp;
    enemyHP = enemyPokemon.hp;

    // Load sprites
    document.getElementById("player-back").src = playerPokemon.img;
    document.getElementById("enemy-front").src = enemyPokemon.img;

    // Load names
    document.getElementById("player-name").textContent = playerPokemon.name;
    document.getElementById("enemy-name").textContent = enemyPokemon.name;

    // Load HP
    updateHP();

    // Load move buttons
    const moveButtonsDiv = document.getElementById("move-buttons");
    moveButtonsDiv.innerHTML = "";
    playerPokemon.moves.forEach((move, index) => {
        const btn = document.createElement("button");
        btn.textContent = move.name;
        btn.addEventListener("click", () => {
            playerTurn(index);
        });
        moveButtonsDiv.appendChild(btn);
    });
}

// === ANIMATION FUNCTION ===
function animateHit(id) {
    const el = document.getElementById(id);
    el.classList.add("animate-hit");
    setTimeout(() => el.classList.remove("animate-hit"), 300);
}

// === UPDATE HP DISPLAY ===
function updateHP() {
    document.getElementById("player-hp").textContent = playerHP;
    document.getElementById("enemy-hp").textContent = enemyHP;

    document.getElementById("player-hp-bar").style.width = `${playerHP}%`;
    document.getElementById("enemy-hp-bar").style.width = `${enemyHP}%`;
}

// === DISABLE/ENABLE BUTTONS ===
function disableButtons() {
    document.querySelectorAll("#move-buttons button").forEach(btn => btn.disabled = true);
}

function enableButtons() {
    document.querySelectorAll("#move-buttons button").forEach(btn => btn.disabled = false);
}

// === LOG MESSAGE (W/ DELAY) ===
function logMessage(msg, delay = 0) {
    setTimeout(() => {
        document.getElementById("log").textContent = msg;
    }, delay);
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

    animateHit("enemy-front");
    logMessage(`${playerPokemon.name} used ${move.name}!`, 0);
    setTimeout(() => {
        logMessage(`It dealt ${damage} damage!`, 1000);
        updateHP();
    }, 1000);

    if (enemyHP <= 0) {
        setTimeout(() => {
            logMessage(`${enemyPokemon.name} fainted! You win!`, 2000);
            disableButtons();
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

    animateHit("player-back");
    logMessage(`${enemyPokemon.name} used ${move.name}!`, 0);
    setTimeout(() => {
        logMessage(`It dealt ${damage} damage!`, 1000);
        updateHP();
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

function animateHit(spriteId) {
    const el = document.getElementById(spriteId);
    el.classList.add("animate-hit");
    setTimeout(() => el.classList.remove("animate-hit"), 300);
}
