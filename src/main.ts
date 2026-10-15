const gameTitle = "Bee Clicker Game";
const honeySymbol = "🍯";
const workerSymbol = "🐝";
const officeSymbol = "🏢";
const keeperSymbol = "👷";

const workerUpgrade = {
  name: "Worker Bee",
  gain: 1,
  gainUnit: "c",
  gainSymbol: honeySymbol,
  emoji: workerSymbol,
  cost: 10,
};

const officeUpgrade = {
  name: "Office Bee",
  gain: 2,
  gainSymbol: honeySymbol,
  gainUnit: "c",
  emoji: officeSymbol,
  cost: 40,
};

const keeperUpgrade = {
  name: "Beekeeper",
  gain: 1,
  gainSymbol: honeySymbol,
  gainUnit: "s",
  emoji: keeperSymbol,
  cost: 100,
};

const queenUpgrade = {
  name: "Queen Bee",
  gain: 1,
  gainSymbol: workerSymbol,
  gainUnit: "10s",
  emoji: "👑",
  cost: 100,
};

let honey = 0;
let beeCount = 1;
let keeperCount = 0;
let queenCount = 0;

let queenTimer = 0;

const heading = document.querySelector<HTMLHeadingElement>("#game-title")!;
const beeButton = document.querySelector<HTMLButtonElement>("#bee-button")!;
const honeyDisplay = document.querySelector<HTMLParagraphElement>(
  "#honey-display",
)!;
const beeCounter = document.querySelector<HTMLParagraphElement>(
  "#bee-display",
)!;
const workerCard = document.querySelector<HTMLElement>("#worker-card")!;
const workerButton = workerCard.querySelector("button")!;
const officeCard = document.querySelector<HTMLElement>("#office-card")!;
const officeButton = officeCard.querySelector("button")!;
const keeperCard = document.querySelector<HTMLElement>("#keeper-card")!;
const keeperButton = keeperCard.querySelector("button")!;
const queenCard = document.querySelector<HTMLElement>("#queen-card")!;
const queenButton = queenCard.querySelector("button")!;

honeyDisplay.style.color = "white";
beeCounter.style.color = "white";
workerCard.style.color = "#ffde65";
officeCard.style.color = "#ffde65";
keeperCard.style.color = "#ffde65";
queenCard.style.color = "#ffde65";

heading.textContent = gameTitle;
heading.style.color = "#ffde65";

function renderUpgrade(
  card: HTMLElement,
  upgrade:
    | typeof workerUpgrade
    | typeof officeUpgrade
    | typeof keeperUpgrade
    | typeof queenUpgrade,
) {
  card.querySelector("h2")!.textContent = upgrade.name;
  card.querySelector("p")!.textContent =
    `+${upgrade.gain} ${upgrade.gainSymbol}/${upgrade.gainUnit}`;
  card.querySelector(".upgrade-emoji")!.textContent = upgrade.emoji;
  card.querySelector("strong")!.textContent = `${upgrade.cost} ${honeySymbol}`;
}

renderUpgrade(workerCard, workerUpgrade);
renderUpgrade(officeCard, officeUpgrade);
renderUpgrade(keeperCard, keeperUpgrade);
renderUpgrade(queenCard, queenUpgrade);

beeButton.addEventListener("click", () => {
  honey += beeCount;
});

workerButton.addEventListener("click", () => {
  if (honey >= workerUpgrade.cost) {
    honey -= workerUpgrade.cost;
    beeCount += workerUpgrade.gain;
  }
});

officeButton.addEventListener("click", () => {
  if (honey >= officeUpgrade.cost) {
    honey -= officeUpgrade.cost;
    beeCount += officeUpgrade.gain;
  }
});

keeperButton.addEventListener("click", () => {
  if (honey >= keeperUpgrade.cost) {
    honey -= keeperUpgrade.cost;
    keeperCount += keeperUpgrade.gain;
  }
});

queenButton.addEventListener("click", () => {
  if (honey >= queenUpgrade.cost) {
    honey -= queenUpgrade.cost;
    queenCount += queenUpgrade.gain;
  }
});

function eventTick(deltaTime: number) {
  honey += keeperCount * deltaTime;

  if (queenCount > 0) {
    queenTimer += deltaTime;
    while (queenTimer >= 10) {
      beeCount += queenCount;
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

  honeyDisplay.textContent = `${Math.floor(honey)} ${honeySymbol}`;
  beeCounter.textContent = `${beeCount} ${workerSymbol}`;
  workerButton.disabled = honey < workerUpgrade.cost;
  officeButton.disabled = honey < officeUpgrade.cost;
  keeperButton.disabled = honey < keeperUpgrade.cost;
  queenButton.disabled = honey < queenUpgrade.cost;

  if (honey >= officeUpgrade.cost) {
    officeCard.style.display = "";
  }
  if (honey >= keeperUpgrade.cost) {
    keeperCard.style.display = "";
  }
  if (honey >= queenUpgrade.cost) {
    queenCard.style.display = "";
  }
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
