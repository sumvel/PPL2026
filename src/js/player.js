import schedule from '/PPL2026/src/js/schedule.js';

/* ---------------- PLAYER DATA ---------------- */

const PLAYERS = [
  {
    name: "You",
    rank: 12,
    centerRank: 3,
    points: 245,
    last5: [
      { match: "RCB vs SRH", pick: "RCB", result: "RCB" },
      { match: "MI vs KKR", pick: "MI", result: "KKR" },
      { match: "RR vs CSK", pick: "CSK", result: "CSK" },
      { match: "PBKS vs GT", pick: "GT", result: "GT" },
      { match: "LSG vs DC", pick: "LSG", result: "DC" }
    ]
  },
  {
    name: "Player A",
    rank: 5,
    centerRank: 1,
    points: 260,
    last5: [
      { match: "RCB vs SRH", pick: "SRH", result: "RCB" },
      { match: "MI vs KKR", pick: "KKR", result: "KKR" },
      { match: "RR vs CSK", pick: "RR", result: "CSK" },
      { match: "PBKS vs GT", pick: "GT", result: "GT" },
      { match: "LSG vs DC", pick: "DC", result: "DC" }
    ]
  },
  {
    name: "Player B",
    rank: 18,
    centerRank: 6,
    points: 230,
    last5: [
      { match: "RCB vs SRH", pick: "RCB", result: "RCB" },
      { match: "MI vs KKR", pick: "MI", result: "KKR" },
      { match: "RR vs CSK", pick: "CSK", result: "CSK" },
      { match: "PBKS vs GT", pick: "GT", result: "GT" },
      { match: "LSG vs DC", pick: "LSG", result: "DC" }
    ]
  },
  {
    name: "Player C",
    rank: 25,
    centerRank: 9,
    points: 210,
    last5: [
      { match: "RCB vs SRH", pick: "SRH", result: "RCB" },
      { match: "MI vs KKR", pick: "KKR", result: "KKR" },
      { match: "RR vs CSK", pick: "RR", result: "CSK" },
      { match: "PBKS vs GT", pick: "GT", result: "GT" },
      { match: "LSG vs DC", pick: "DC", result: "DC" }
    ]
  }
];

const ALL_PLAYERS = PLAYERS.map(p => ({
  name: p.name,
  points: p.points
}));

function getTeamLogoMap() {
  const map = {};

  schedule.forEach(match => {
    map[match.team1] = match.team1Logo;
    map[match.team2] = match.team2Logo;
  });

  return map;
}

const TEAM_LOGOS = getTeamLogoMap();

let currentPlayer = PLAYERS[0];
let selectedPlayers = [currentPlayer.name];
let chartInstance = null;


/* ---------------- LAST 5 ---------------- */

function renderLast5(results) {
  const container = document.getElementById("last5");

  container.innerHTML = results.map(r => {
    const isCorrect = r.pick === r.result;

    const logo = TEAM_LOGOS[r.pick] || "";

    return `
      <div class="flex flex-col items-center text-xs" title="${r.match} | Pick: ${r.pick} | Winner: ${r.result}">

        <!-- Logo Circle -->
        <div class="w-12 h-12 flex items-center justify-center rounded-full
          ${isCorrect ? "bg-green-500/20" : "bg-red-500/20"}
          border ${isCorrect ? "border-green-500" : "border-red-500"}">

          <img src="${logo}" class="h-7 object-contain"/>
        </div>

        <!-- Result -->
        <span class="mt-1 ${isCorrect ? "text-green-400" : "text-red-400"}">
          ${isCorrect ? "✔" : "✖"}
        </span>

      </div>
    `;
  }).join("");
}


/* ---------------- PREDICTIONS ---------------- */

function renderPredictions() {
  const container = document.getElementById("predictions");
  const now = new Date();

  const upcoming = schedule
    .filter(m => new Date(m.time) > now)
    .slice(0, 6);

  container.innerHTML = upcoming.map(match => {

    // Temporary random prediction (replace later with real data)
    const predictedWinner = Math.random() > 0.5
      ? match.team1
      : match.team2;

    return `
      <div class="p-4 rounded-xl border border-white/10
        bg-gradient-to-r from-[#0f172a] to-[#1e293b]">

        <div class="flex items-center justify-between">

          <div class="flex items-center gap-3">
            <img src="${match.team1Logo}" class="h-8"/>
            <span>${match.team1}</span>
          </div>

          <span class="text-gray-400">vs</span>

          <div class="flex items-center gap-3">
            <span>${match.team2}</span>
            <img src="${match.team2Logo}" class="h-8"/>
          </div>

        </div>

        <div class="mt-3 text-center">
          <span class="text-sm text-gray-400">Prediction:</span>
          <span class="ml-2 font-bold"
            style="color: ${
              predictedWinner === match.team1
                ? match.team1Color
                : match.team2Color
            }">
            ${predictedWinner}
          </span>
        </div>

      </div>
    `;
  }).join("");
}


/* ---------------- PLAYER DROPDOWN ---------------- */

function initPlayerDropdown() {
  const dropdown = document.getElementById("playerDropdown");

  dropdown.innerHTML = PLAYERS.map(p =>
    `<option value="${p.name}">${p.name}</option>`
  ).join("");

  dropdown.addEventListener("change", (e) => {
    const selected = PLAYERS.find(p => p.name === e.target.value);
    currentPlayer = selected;

    updatePlayerUI();
  });
}


/* ---------------- UPDATE PLAYER UI ---------------- */

function updatePlayerUI() {
  document.getElementById("playerName").innerText = currentPlayer.name;
  document.getElementById("rank").innerText = `#${currentPlayer.rank}`;
  document.getElementById("centerRank").innerText = `#${currentPlayer.centerRank}`;
  document.getElementById("points").innerText = currentPlayer.points;

  renderLast5(currentPlayer.last5);

  // Reset comparison baseline
  selectedPlayers = [currentPlayer.name];

  // Reset selector options
  const select = document.getElementById("playerSelect");
  select.innerHTML = `<option value="">Select player</option>` +
    ALL_PLAYERS
      .filter(p => p.name !== currentPlayer.name)
      .map(p => `<option value="${p.name}">${p.name}</option>`)
      .join("");

  renderSelectedPlayers();
  updateChart();

  // Refresh predictions
  renderPredictions();
}


/* ---------------- COMPARISON SELECTOR ---------------- */

function initPlayerSelector() {
  const select = document.getElementById("playerSelect");

  select.addEventListener("change", (e) => {
    const value = e.target.value;

    if (!value) return;
    if (selectedPlayers.includes(value)) return;

    if (selectedPlayers.length >= 4) {
      alert("You can compare up to 3 players only");
      return;
    }

    selectedPlayers.push(value);

    renderSelectedPlayers();
    updateChart();
  });
}


/* ---------------- SELECTED PLAYER CHIPS ---------------- */

function renderSelectedPlayers() {
  const container = document.getElementById("selectedPlayers");

  container.innerHTML = selectedPlayers.map(name => `
    <div class="px-3 py-1 rounded-full bg-gray-700 text-sm flex items-center gap-2">
      ${name}
      ${name !== currentPlayer.name
        ? `<button data-name="${name}" class="removeBtn">✖</button>`
        : ""}
    </div>
  `).join("");

  document.querySelectorAll(".removeBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const name = e.target.dataset.name;

      selectedPlayers = selectedPlayers.filter(p => p !== name);

      renderSelectedPlayers();
      updateChart();
    });
  });
}


/* ---------------- CHART ---------------- */

function updateChart() {
  const ctx = document.getElementById("comparisonChart");

  const playersData = ALL_PLAYERS.filter(p =>
    selectedPlayers.includes(p.name)
  );

  const labels = playersData.map(p => p.name);
  const data = playersData.map(p => p.points);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Points",
        data
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body)
              .getPropertyValue('--text')
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.body)
              .getPropertyValue('--text')
          }
        },
        y: {
          ticks: {
            color: getComputedStyle(document.body)
              .getPropertyValue('--text')
          }
        }
      }
    }
  });
}


/* ---------------- INIT ---------------- */

renderPredictions();
initPlayerDropdown();
initPlayerSelector();
updatePlayerUI();