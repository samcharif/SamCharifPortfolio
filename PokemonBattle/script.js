const pokeAPIBase = "https://pokeapi.co/api/v2/pokemon/";
let allPokemon = [];
let enemyPokemon = null;
let playerPokemon = null;
let playerHP, enemyHP;

// === Step 1: Load All Gen 1 Pokémon ===
async function fetchAllPokemon() {
    for (let i = 1; i <= 150; i++) {
        const res = await fetch(`${pokeAPIBase}${i}`);
        const data = await res.json();

        allPokemon.push({
            id: data.id,
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            type: data.types[0].type.name,
            hp: data.stats.find(stat => stat.stat.name === "hp").base_stat,
            front: data.sprites.front_default,
            back: data.sprites.back_default
        });
    }

    renderPokemonSelection();
}

// === Step 2: Show Select Screen ===
function renderPokemonSelection() {
    const list = document.getElementById("pokemon-list");

    allPokemon.forEach(poke => {
        const card = document.createElement("div");
        card.className = "pokemon-card";
        card.innerHTML = `
            <img src="${poke.front}" alt="${poke.name}" />
            <span>${poke.name}</span>
        `;
        card.addEventListener("click", () => selectPokemon(poke));
        list.appendChild(card);
    });
}

// === Step 3: On Pokémon Select ===
function selectPokemon(selected) {
    playerPokemon = selected;

    do {
        enemyPokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];
    } while (enemyPokemon.id === playerPokemon.id);

    document.getElementById("pokemon-select-screen").style.display = "none";
    document.querySelector(".container").style.display = "block";

    startBattle();
}

// === Step 4: Battle Setup ===
function startBattle() {
    // Show VS screen
    document.getElementById("vs-screen").style.display = "flex";
    document.getElementById("vs-player").src = playerPokemon.front;
    document.getElementById("vs-enemy").src = enemyPokemon.front;

    vsAudio.play();

    setTimeout(() => {
        document.getElementById("vs-screen").style.display = "none";
        document.querySelector(".container").style.display = "block";

        document.getElementById("player-name").textContent = playerPokemon.name;
        document.getElementById("enemy-name").textContent = enemyPokemon.name;

        document.getElementById("player-back").src = playerPokemon.back;
        document.getElementById("enemy-front").src = enemyPokemon.front;

        playerHP = playerPokemon.hp;
        enemyHP = enemyPokemon.hp;

        updateHP("player", playerHP);
        updateHP("enemy", enemyHP);

        setupMoves();
    }, 2000);
}

function setupMoves() {
    const moveButtons = document.getElementById("move-buttons");
    moveButtons.innerHTML = "";

    const genericMoves = [
        { name: "Tackle", damage: 20, type: "normal" },
        { name: "Bite", damage: 25, type: "dark" },
        { name: "Headbutt", damage: 30, type: "normal" }
    ];

    playerPokemon.moves = genericMoves;

    genericMoves.forEach((move, index) => {
        const btn = document.createElement("button");
        btn.textContent = move.name;
        btn.addEventListener("click", () => handleAttack(index));
        moveButtons.appendChild(btn);
    });
}

// === Damage & Turn Logic ===
function getMultiplier(attackingType, defendingType) {
    const typeChart = {
        electric: { water: 2, grass: 0.5 },
        fire: { grass: 2, water: 0.5 },
        water: { fire: 2, grass: 0.5 },
        grass: { water: 2, fire: 0.5 }
    };
    return typeChart[attackingType]?.[defendingType] || 1;
}

function handleAttack(index) {
    const log = document.getElementById("log");
    const move = playerPokemon.moves[index];

    const variation = Math.floor(Math.random() * 6) - 3;
    const multiplier = getMultiplier(move.type, enemyPokemon.type);
    const total = Math.round((move.damage + variation) * multiplier);
    enemyHP = Math.max(0, enemyHP - total);

    attackSound.play(); // 🔊 Play attack sound

    updateHP("enemy", enemyHP);
    flash("enemy-front");

    let effectiveness = "";
    if (multiplier > 1) effectiveness = "It’s super effective!";
    else if (multiplier < 1) effectiveness = "It’s not very effective...";

    log.textContent = `${playerPokemon.name} used ${move.name}! ${effectiveness}`;

    if (enemyHP === 0) {
        faintSound.play(); // 🔊 Enemy faints
        log.textContent += ` ${enemyPokemon.name} fainted! You win!`;
        disableButtons();
        return;
    }

    setTimeout(() => {
        const enemyMove = { name: "Enemy Tackle", damage: 20, type: "normal" };
        const enemyMult = getMultiplier(enemyMove.type, playerPokemon.type);
        const enemyDmg = Math.round((enemyMove.damage + variation) * enemyMult);

        playerHP = Math.max(0, playerHP - enemyDmg);

        attackSound.play(); // 🔊 Enemy attack sound
        updateHP("player", playerHP);
        flash("player-back");

        let eff = "";
        if (enemyMult > 1) eff = "It’s super effective!";
        else if (enemyMult < 1) eff = "It’s not very effective...";

        log.textContent += ` ${enemyPokemon.name} used ${enemyMove.name}! ${eff}`;

        if (playerHP === 0) {
            faintSound.play(); // 🔊 Player faints
            log.textContent += ` ${playerPokemon.name} fainted! You lose!`;
            disableButtons();
        }
    }, 1000);
}


    // Only proceed if enemy is still alive
    setTimeout(() => {
        if (enemyHP <= 0) return;

        const enemyMove = { name: "Enemy Tackle", damage: 20, type: "normal" };
        const enemyMult = getMultiplier(enemyMove.type, playerPokemon.type);
        const enemyVariation = Math.floor(Math.random() * 6) - 3;
        const enemyDmg = Math.round((enemyMove.damage + enemyVariation) * enemyMult);

        playerHP = Math.max(0, playerHP - enemyDmg);
        updateHP("player", playerHP);
        flash("player-back");

        let eff = "";
        if (enemyMult > 1) eff = "It’s super effective!";
        else if (enemyMult < 1) eff = "It’s not very effective...";

        log.textContent += ` ${enemyPokemon.name} used ${enemyMove.name}! ${eff}`;

        if (playerHP === 0) {
            log.textContent += ` ${playerPokemon.name} fainted! You lose!`;
            disableButtons();
        }
    }, 1000);
}

function updateHP(who, hp) {
    document.getElementById(`${who}-hp`).textContent = hp;
    document.getElementById(`${who}-hp-bar`).style.width = `${hp}%`;
}

function flash(spriteId) {
    const el = document.getElementById(spriteId);
    el.classList.add("animate-hit");
    setTimeout(() => el.classList.remove("animate-hit"), 300);
}

function disableButtons() {
    document.querySelectorAll("#move-buttons button").forEach(btn => btn.disabled = true);
}

// === Load All Pokémon on Page Load ===
window.addEventListener("DOMContentLoaded", fetchAllPokemon);

const vsAudio = new Audio("vs-intro.mp3");
const attackSound = new Audio("attack.mp3");
const faintSound = new Audio("faint.mp3");
