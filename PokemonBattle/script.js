const typeChart = {
    Electric: { Water: 2, Grass: 0.5 },
    Fire: { Grass: 2, Water: 0.5, Fire: 0.5 },
    Water: { Fire: 2, Grass: 0.5, Electric: 0.5 },
    Grass: { Water: 2, Fire: 0.5 }
};

const playerPokemon = {
    name: "Pikachu",
    type: "Electric",
    hp: 100,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png",
    moves: [
        { name: "Thunderbolt", damage: 25, type: "Electric" },
        { name: "Quick Attack", damage: 15, type: "Normal" },
        { name: "Iron Tail", damage: 20, type: "Steel" }
    ]
};

const enemyPokemon = {
    name: "Charmander",
    type: "Fire",
    hp: 100,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    moves: [
        { name: "Flamethrower", damage: 25, type: "Fire" },
        { name: "Scratch", damage: 10, type: "Normal" },
        { name: "Ember", damage: 20, type: "Fire" }
    ]
};

let playerHP = playerPokemon.hp;
let enemyHP = enemyPokemon.hp;

document.getElementById("player-name").textContent = playerPokemon.name;
document.getElementById("enemy-name").textContent = enemyPokemon.name;
document.querySelector("#player-back").src = playerPokemon.img;
document.querySelector("#enemy-front").src = enemyPokemon.img;

const moveButtons = document.getElementById("move-buttons");
playerPokemon.moves.forEach((move, index) => {
    const btn = document.createElement("button");
    btn.textContent = move.name;
    btn.addEventListener("click", () => handleAttack(index));
    moveButtons.appendChild(btn);
});

function getMultiplier(attackingType, defendingType) {
    return typeChart[attackingType]?.[defendingType] || 1;
}

function handleAttack(moveIndex) {
    const log = document.getElementById("log");
    const move = playerPokemon.moves[moveIndex];

    const variation = Math.floor(Math.random() * 6) - 3; // ±3
    const base = move.damage + variation;
    const multiplier = getMultiplier(move.type, enemyPokemon.type);
    const total = Math.round(base * multiplier);
    enemyHP = Math.max(0, enemyHP - total);

    updateHP("enemy", enemyHP);
    flash("enemy-front");

    let effectiveness = "";
    if (multiplier > 1) effectiveness = "It’s super effective!";
    if (multiplier < 1) effectiveness = "It’s not very effective...";

    log.textContent = `${playerPokemon.name} used ${move.name}! ${effectiveness}`;

    if (enemyHP === 0) {
        log.textContent += ` ${enemyPokemon.name} fainted! You win! 🎉`;
        disableButtons();
        return;
    }

    setTimeout(() => {
        const enemyMove = enemyPokemon.moves[Math.floor(Math.random() * enemyPokemon.moves.length)];
        const enemyVariation = Math.floor(Math.random() * 6) - 3;
        const enemyBase = enemyMove.damage + enemyVariation;
        const enemyMult = getMultiplier(enemyMove.type, playerPokemon.type);
        const enemyTotal = Math.round(enemyBase * enemyMult);
        playerHP = Math.max(0, playerHP - enemyTotal);

        updateHP("player", playerHP);
        flash("player-back");

        let eff = "";
        if (enemyMult > 1) eff = "It’s super effective!";
        if (enemyMult < 1) eff = "It’s not very effective...";

        log.textContent += ` ${enemyPokemon.name} used ${enemyMove.name}! ${eff}`;

        if (playerHP === 0) {
            log.textContent += ` ${playerPokemon.name} fainted! You lose! 💀`;
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

function flash(spriteId) {
    const el = document.getElementById(spriteId);
    el.classList.add("animate-hit");
    setTimeout(() => el.classList.remove("animate-hit"), 300);
}

function disableButtons() {
    document.querySelectorAll("#move-buttons button").forEach(btn => btn.disabled = true);
}
