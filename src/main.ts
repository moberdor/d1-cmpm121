const gameTitle = "Bee Clicker Game";
const honeySymbol = "🍯";
const workerSymbol = "🐝";
const officeSymbol = "🏢";
const keeperSymbol = "👷";
document.body.style.backgroundColor = "black";
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
honeyDisplay.style.color = "white";

const workerCard = document.querySelector<HTMLElement>("#worker-card")!;
const workerButton = workerCard.querySelector("button")!;
workerCard.style.color = "yellow";
const officeCard = document.querySelector<HTMLElement>("#office-card")!;
officeCard.style.color = "yellow";
const officeButton = officeCard.querySelector("button")!;
const keeperCard = document.querySelector<HTMLElement>("#keeper-card")!;
keeperCard.style.color = "yellow";
const keeperButton = keeperCard.querySelector("button")!;

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

heading.textContent = gameTitle;
heading.style.color = "yellow";
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
