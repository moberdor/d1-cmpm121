const gameTitle = "Bee Clicker Game";
const honeySymbol = "🍯";
const workerSymbol = "🐝";
const officeSymbol = "🏢";
const keeperSymbol = "👷";
const queenSymbol = "👑";
const constructSymbol = "🏗️";
const paperWorkSymbol = "📄";
const deliverySymbol = "🚚";
const saxSymbol = "🎷";
const trophySymbol = "🏆";

const costMultiplier = 1.15;
const queenInterval = 10;
const jazzInterval = 25;
const msPerSecond = 1000;

let honey = 0;
let beeCount = 1;
let queenTimer = 0;
let jazzTimer = 0;

// ----------------------------------------------------------------
type UpgradeKind = "click" | "rate" | "interval";

interface Upgrade {
  name: string;
  emoji: string;
  gain: number;
  kind: UpgradeKind;
  gainUnit: string;
  gainSymbol: string;
  cost: number;
  owned: number;
  startHidden: boolean;
}

const upgrades: Upgrade[] = [
  {
    name: "Worker Bee",
    emoji: workerSymbol,
    gain: 1,
    kind: "click",
    gainUnit: "👆",
    gainSymbol: honeySymbol,
    cost: 10,
    owned: 0,
    startHidden: false,
  },
  {
    name: "Office Bee",
    emoji: officeSymbol,
    gain: 3,
    kind: "click",
    gainUnit: "👆",
    gainSymbol: honeySymbol,
    cost: 40,
    owned: 0,
    startHidden: true,
  },
  {
    name: "Beekeeper",
    emoji: keeperSymbol,
    gain: 3,
    kind: "rate",
    gainUnit: "s",
    gainSymbol: honeySymbol,
    cost: 75,
    owned: 0,
    startHidden: true,
  },
  {
    name: "Queen Bee",
    emoji: queenSymbol,
    gain: 1,
    kind: "interval",
    gainUnit: `${queenInterval}s`,
    gainSymbol: workerSymbol,
    cost: 300,
    owned: 0,
    startHidden: true,
  },
  {
    name: "Accountant Bee",
    emoji: paperWorkSymbol,
    gain: 2.5,
    kind: "rate",
    gainUnit: "s",
    gainSymbol: honeySymbol,
    cost: 700,
    owned: 0,
    startHidden: true,
  },
  {
    name: "Construction Site",
    emoji: constructSymbol,
    gain: 4,
    kind: "rate",
    gainUnit: "s",
    gainSymbol: honeySymbol,
    cost: 1250,
    owned: 0,
    startHidden: true,
  },
  {
    name: "Jazz Bee",
    emoji: saxSymbol + workerSymbol,
    gain: 3,
    kind: "interval",
    gainUnit: `${jazzInterval}s`,
    gainSymbol: workerSymbol,
    cost: 2200,
    owned: 0,
    startHidden: true,
  },
  {
    name: "Honey Delivery",
    emoji: deliverySymbol,
    gain: 8,
    kind: "rate",
    gainUnit: "s",
    gainSymbol: honeySymbol,
    cost: 2500,
    owned: 0,
    startHidden: true,
  },
];

// ----------------------------------------------------------------
interface UpgradeView {
  card: HTMLElement;
  button: HTMLButtonElement;
}

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
const views: UpgradeView[] = [];
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

  const button = card.querySelector("button")!;
  views.push({ card, button });
  button.addEventListener("click", () => {
    if (honey < upgrade.cost) return;
    honey -= upgrade.cost;
    upgrade.owned++;
    if (upgrade.kind === "click") {
      beeCount += upgrade.gain;
    }
    upgrade.cost = Math.ceil(upgrade.cost * costMultiplier);
  });
}

// ----------------------------------------------------------------

function ownedOf(kind: UpgradeKind) {
  let total = 0;
  for (const upgrade of upgrades) {
    if (upgrade.kind === kind) {
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
  honey += ownedOf("rate") * deltaTime;

  if (ownedOf("interval") > 0) {
    // Queen produces bees on a fixed interval
    queenTimer += deltaTime;
    jazzTimer += deltaTime;
    while (queenTimer >= queenInterval) {
      beeCount += ownedOf("interval");
      queenTimer -= queenInterval;
    }
    while (jazzTimer >= jazzInterval) {
      beeCount += ownedOf("interval");
      jazzTimer -= jazzInterval;
    }
  }
}

// Run the game simulation on a fixed timer, independent of rendering
const tickIntervalMs = 100;
let lastTick = performance.now();
setInterval(() => {
  const now = performance.now();
  eventTick((now - lastTick) / msPerSecond);
  lastTick = now;
}, tickIntervalMs);

function update() {
  // Update Stats
  honeyDisplay.textContent = `${Math.floor(honey)} ${honeySymbol}`;
  beeCounter.textContent = `${beeCount} ${workerSymbol}`;
  rateDisplay.textContent = `+${beeCount} ${honeySymbol}/👆 · +${
    ownedOf("rate")
  } ${honeySymbol}/s`;

  upgrades.forEach((upgrade, i) => {
    // Update Upgrade UI
    const view = views[i];
    view.card.querySelector("h2")!.textContent = upgrade.name;
    view.card.querySelector("p")!.textContent =
      `+${upgrade.gain} ${upgrade.gainSymbol}/${upgrade.gainUnit}`;
    view.card.querySelector(".upgrade-emoji")!.textContent = upgrade.emoji;
    view.card.querySelector(".upgrade-owned")!.textContent =
      `×${upgrade.owned}`;
    view.card.querySelector("strong")!.textContent =
      `${upgrade.cost} ${honeySymbol}`;

    view.button.disabled = honey < upgrade.cost;

    if (honey >= upgrade.cost) {
      view.card.style.display = "";
    }
  });

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
