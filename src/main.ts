const gameTitle = "Bee Clicker Game";
const honeySymbol = "🍯";
const workerSymbol = "🐝";
const officeSymbol = "🏢";
const keeperSymbol = "👷";
const queenSymbol = "👑";

const costMultiplier = 1.15;

let honey = 0;
let beeCount = 1;
let queenTimer = 0;

// ----------------------------------------------------------------
interface Upgrade {
  name: string;
  emoji: string;
  gain: number;
  gainUnit: "👆" | "s" | "10s";
  gainSymbol: string;
  cost: number;
  owned: number;
  startHidden: boolean;
  card: HTMLElement;
  button: HTMLButtonElement;
}

const upgrades: Upgrade[] = [
  {
    name: "Worker Bee",
    emoji: workerSymbol,
    gain: 1,
    gainUnit: "👆",
    gainSymbol: honeySymbol,
    cost: 10,
    owned: 0,
    startHidden: false,
    card: null!,
    button: null!,
  },
  {
    name: "Office Bee",
    emoji: officeSymbol,
    gain: 3,
    gainUnit: "👆",
    gainSymbol: honeySymbol,
    cost: 40,
    owned: 0,
    startHidden: true,
    card: null!,
    button: null!,
  },
  {
    name: "Beekeeper",
    emoji: keeperSymbol,
    gain: 3,
    gainUnit: "s",
    gainSymbol: honeySymbol,
    cost: 75,
    owned: 0,
    startHidden: true,
    card: null!,
    button: null!,
  },
  {
    name: "Queen Bee",
    emoji: queenSymbol,
    gain: 1,
    gainUnit: "10s",
    gainSymbol: workerSymbol,
    cost: 300,
    owned: 0,
    startHidden: true,
    card: null!,
    button: null!,
  },
];

// ----------------------------------------------------------------
const heading = document.querySelector<HTMLHeadingElement>("#game-title")!;
const beeButton = document.querySelector<HTMLButtonElement>("#bee-button")!;
const honeyDisplay = document.querySelector<HTMLParagraphElement>(
  "#honey-display",
)!;
const beeCounter = document.querySelector<HTMLParagraphElement>(
  "#bee-display",
)!;
const rateDisplay = document.querySelector<HTMLParagraphElement>(
  "#rate-display",
)!;
const upgradeList = document.querySelector<HTMLElement>("#upgrades")!;

honeyDisplay.style.color = "white";
beeCounter.style.color = "white";
rateDisplay.style.color = "white";

heading.textContent = gameTitle;
heading.style.color = "#ffde65";

// Create html cards for each upgrade
for (const upgrade of upgrades) {
  const card = document.createElement("div");
  card.className = "upgrade";
  card.style.color = "#ffde65";
  card.innerHTML = `
    <h2></h2>
    <p></p>
    <div class="upgrade-emoji"></div>
    <p class="upgrade-owned"></p>
    <p>Cost: <strong></strong></p>
    <button>Buy</button>
  `;
  if (upgrade.startHidden) {
    card.style.display = "none";
  }
  upgradeList.append(card);

  upgrade.card = card;
  upgrade.button = card.querySelector("button")!;
  upgrade.button.addEventListener("click", () => {
    if (honey < upgrade.cost) return;
    honey -= upgrade.cost;
    upgrade.owned++;
    if (upgrade.gainUnit === "👆") {
      beeCount += upgrade.gain;
    }
    upgrade.cost = Math.ceil(upgrade.cost * costMultiplier);
  });
}

// ----------------------------------------------------------------

// Calculate number of beekeepers
function keeperCount() {
  let total = 0;
  for (const upgrade of upgrades) {
    if (upgrade.gainUnit === "s") {
      total += upgrade.owned * upgrade.gain;
    }
  }
  return total;
}

// Calculate number of queens
function queenCount() {
  let total = 0;
  for (const upgrade of upgrades) {
    if (upgrade.gainUnit === "10s") {
      total += upgrade.owned * upgrade.gain;
    }
  }
  return total;
}

// Handle Clicking Bee
beeButton.addEventListener("click", () => {
  honey += beeCount;

  // Animated effect
  const rect = beeButton.getBoundingClientRect();
  const popup = document.createElement("span");
  popup.className = "honey-popup";
  popup.textContent = `+${beeCount} ${honeySymbol}`;
  popup.style.left = `${rect.left + Math.random() * rect.width}px`;
  popup.style.top = `${rect.top}px`;
  document.body.append(popup);
  popup.addEventListener("animationend", () => popup.remove());
});

// Handle time based events
function eventTick(deltaTime: number) {
  honey += keeperCount() * deltaTime;

  if (queenCount() > 0) {
    // Queen produces bees every 10s
    queenTimer += deltaTime;
    while (queenTimer >= 10) {
      beeCount += queenCount();
      queenTimer -= 10;
    }
  }
}

let lastTime: number | undefined;

function update(time: number) {
  if (lastTime !== undefined) {
    const deltaTime = (time - lastTime) / 1000;
    eventTick(deltaTime);
  }
  lastTime = time;

  // Update Stats
  honeyDisplay.textContent = `${Math.floor(honey)} ${honeySymbol}`;
  beeCounter.textContent = `${beeCount} ${workerSymbol}`;
  rateDisplay.textContent =
    `+${beeCount} ${honeySymbol}/👆 · +${keeperCount()} ${honeySymbol}/s`;

  for (const upgrade of upgrades) {
    // Update Upgrade UI
    upgrade.card.querySelector("h2")!.textContent = upgrade.name;
    upgrade.card.querySelector("p")!.textContent =
      `+${upgrade.gain} ${upgrade.gainSymbol}/${upgrade.gainUnit}`;
    upgrade.card.querySelector(".upgrade-emoji")!.textContent = upgrade.emoji;
    upgrade.card.querySelector(".upgrade-owned")!.textContent =
      `×${upgrade.owned}`;
    upgrade.card.querySelector("strong")!.textContent =
      `${upgrade.cost} ${honeySymbol}`;

    upgrade.button.disabled = honey < upgrade.cost;

    if (honey >= upgrade.cost) {
      upgrade.card.style.display = "";
    }
  }

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
