const gameTitle = "Bee Clicker Game";
const honeySymbol = "🍯";
const workerSymbol = "🐝";
const officeSymbol = "🏢";
const keeperSymbol = "👷";

const workerUpgrade = {
  name: "Worker Bee",
  gain: 1,
  gainUnit: "c",
  emoji: workerSymbol,
  cost: 10,
};

const officeUpgrade = {
  name: "Office Bee",
  gain: 2,
  gainUnit: "c",
  emoji: officeSymbol,
  cost: 40,
};

const keeperUpgrade = {
  name: "Beekeeper",
  gain: 1,
  gainUnit: "s",
  emoji: keeperSymbol,
  cost: 100,
};

let honey = 0;
let beeCount = 1;
let keeperCount = 0;

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

honeyDisplay.style.color = "white";
beeCounter.style.color = "white";
workerCard.style.color = "#ffde65";
officeCard.style.color = "#ffde65";
keeperCard.style.color = "#ffde65";

heading.textContent = gameTitle;
heading.style.color = "#ffde65";

function renderUpgrade(
  card: HTMLElement,
  upgrade: typeof workerUpgrade | typeof officeUpgrade | typeof keeperUpgrade,
) {
  card.querySelector("h2")!.textContent = upgrade.name;
  card.querySelector("p")!.textContent =
    `+${upgrade.gain} ${honeySymbol}/${upgrade.gainUnit}`;
  card.querySelector(".upgrade-emoji")!.textContent = upgrade.emoji;
  card.querySelector("strong")!.textContent = `${upgrade.cost} ${honeySymbol}`;
}

renderUpgrade(workerCard, workerUpgrade);
renderUpgrade(officeCard, officeUpgrade);
renderUpgrade(keeperCard, keeperUpgrade);

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

function eventTick(deltaTime: number) {
  honey += keeperCount * deltaTime;
}

let lastTime = 0;

function update(time: number) {
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  eventTick(deltaTime);

  honeyDisplay.textContent = `${Math.floor(honey)} ${honeySymbol}`;
  beeCounter.textContent = `${beeCount} ${workerSymbol}`;
  workerButton.disabled = honey < workerUpgrade.cost;
  officeButton.disabled = honey < officeUpgrade.cost;
  keeperButton.disabled = honey < keeperUpgrade.cost;

  if (honey >= officeUpgrade.cost) {
    officeCard.style.display = "";
  }
  if (honey >= keeperUpgrade.cost) {
    keeperCard.style.display = "";
  }
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
