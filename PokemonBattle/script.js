const pokeAPIBase = "https://pokeapi.co/api/v2/pokemon/";
let allPokemon = [];
let enemyPokemon = null;
let playerPokemon = null;
let playerHP, enemyHP;

// === Load Audio Files ===
const vsAudio = new Audio("https://kappa.vgmsite.com/soundtracks/pokemon-firered-leafgreen-re-engineered-soundtrack-2004/rlwcxnxcyt/52.%20Final%20Battle%21%20%28Rival%29.mp3");
const victoryAudio = new Audio("https://kappa.vgmsite.com/soundtracks/pokemon-firered-leafgreen-re-engineered-soundtrack-2004/ppkxdmjzfs/10.%20Victory%21%20%28Trainer%29.mp3");
const titleAudio = new Audio("https://downloads.khinsider.com/game-soundtracks/album/pokemon-firered-leafgreen-re-engineered-soundtrack-2004/03.%2520Title%2520Screen.mp3");

const attackSound = new Audio("https://freesound.org/data/previews/341/341695_3248244-lq.mp3");
const faintSound = new Audio("https://freesound.org/data/previews/179/179300_2398400-lq.mp3");

// Optional: Adjust volume
vsAudio.volume = 0.5;
victoryAudio.volume = 0.6;
attackSound.volume = 0.7;
faintSound.volume = 0.8;

// === Handle Autoplay Restrictions ===
function playAudio(audio) {
    return new Promise((resolve, reject) => {
        audio.play().then(resolve).catch(reject);
    });
}

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

function renderPokemonSelection() {
    const list = document.getElementById("pokemon-list");

    allPokemon.forEach(poke => {
        const card = document.createElement("div");
        card.className = "pokemon-card";
        card.innerHTML = `
            <img src="${poke.front}" alt="${poke.name}" />
            <span>${poke.name}</span>
        `;
        card.addEventListener("click", () => {
            titleAudio.pause();
            titleAudio.currentTime = 0;
            selectPokemon(poke);
        });
        list.appendChild(card);
    });

    // Play title music after user interaction
    window.addEventListener("click", () => {
        if (titleAudio.paused) {
            titleAudio.loop = true;
            playAudio(titleAudio);
        }
    }, { once: true });
}

function selectPokemon(selected) {
    playerPokemon = selected;

    do {
        enemyPokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];
    } while (enemyPokemon.id === playerPokemon.id);

    document.getElementById("pokemon-select-screen").style.display = "none";

    // ✅ Delay VS screen setup until after images are set properly
    setTimeout(startBattle, 200); // slight delay ensures image src gets applied
}

function startBattle() {
    // Stop the title music and start VS screen
    titleAudio.pause();
    titleAudio.currentTime = 0;
    document.getElementById("vs-player").src = playerPokemon.front;
    document.getElementById("vs-enemy").src = enemyPokemon.front;

    const vsScreen = document.getElementById("vs-screen");
    vsScreen.style.display = "flex";

    // Start VS music
    vsAudio.currentTime = 0;
    playAudio(vsAudio).catch(err => console.warn("Autoplay blocked:", err));

    // After 2 seconds, show the battlefield
    setTimeout(() => {
        vsScreen.style.display = "none";
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

    attackSound.play();
    updateHP("enemy", enemyHP);
    flash("enemy-front");

    let effectiveness = "";
    if (multiplier > 1) effectiveness = "It’s super effective!";
    else if (multiplier < 1) effectiveness = "It’s not very effective...";

    log.textContent = `${playerPokemon.name} used ${move.name}! ${effectiveness}`;

    if (enemyHP === 0) {
        vsAudio.pause();
        vsAudio.currentTime = 0;
        faintSound.play();
        playAudio(victoryAudio).catch(err => console.warn("Autoplay blocked:", err));
        log.textContent += ` ${enemyPokemon.name} fainted! You win!`;
        disableButtons();
        return;
    }

    setTimeout(() => {
        if (enemyHP <= 0) return;

        const enemyMove = { name: "Enemy Tackle", damage: 20, type: "normal" };
        const enemyMult = getMultiplier(enemyMove.type, playerPokemon.type);
        const enemyDmg = Math.round((enemyMove.damage + variation) * enemyMult);

        playerHP = Math.max(0, playerHP - enemyDmg);

        attackSound.play();
        updateHP("player", playerHP);
        flash("player-back");

        let eff = "";
        if (enemyMult > 1) eff = "It’s super effective!";
        else if (enemyMult < 1) eff = "It’s not very effective...";

        log.textContent += ` ${enemyPokemon.name} used ${enemyMove.name}! ${eff}`;

        if (playerHP === 0) {
            vsAudio.pause();
            vsAudio.currentTime = 0;
            faintSound.play();
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

window.addEventListener("DOMContentLoaded", () => {
    fetchAllPokemon();

    // Play title music on first interaction
    window.addEventListener("click", () => {
        if (titleAudio.paused) {
            titleAudio.loop = true;
            playAudio(titleAudio).catch(err => console.warn("Autoplay blocked:", err));
        }
    }, { once: true });
});

window.addEventListener("DOMContentLoaded", () => {
    fetchAllPokemon();

    // ⏯️ Play title music ONLY after a click
    const resumeTitleMusic = () => {
        if (titleAudio.paused) {
            titleAudio.loop = true;
            titleAudio.currentTime = 0;
            titleAudio.play().catch(err => console.warn("Blocked:", err));
        }
        window.removeEventListener("click", resumeTitleMusic);
    };

    window.addEventListener("click", resumeTitleMusic);
});


