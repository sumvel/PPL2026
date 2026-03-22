// ------------------ DATA ------------------

// Player-level
const players = [
  { name: "ViratFan99", points: 980 },
  { name: "HitmanMaster", points: 920 },
  { name: "DhoniFinisher", points: 890 },
  { name: "SkyStriker", points: 860 },
  { name: "ABD_360", points: 830 },
  { name: "GillClass", points: 800 },
  { name: "BoomBoom", points: 780 },
  { name: "JadejaMagic", points: 760 },
  { name: "RinkuClutch", points: 740 },
  { name: "KLAnchor", points: 720 }
];

// Division-level (aggregated)
const center = [
  { name: "STSI", points: 5200 },
  { name: "PUTC", points: 4800 },
  { name: "PITC", points: 4500 },
  { name: "XYZ", points: 4200 },
  { name: "ABC", points: 3900 }
];

// ------------------ HELPERS ------------------

function getRankStyle(rank) {
  if (rank === 1) return "bg-yellow-500 text-black";
  if (rank === 2) return "bg-gray-300 text-black";
  if (rank === 3) return "bg-orange-400 text-black";
  return "bg-gray-800 text-white";
}

function renderLeaderboard(data, containerId) {
  const container = document.getElementById(containerId);

  // sort descending
  data.sort((a, b) => b.points - a.points);

  container.innerHTML = "";

  data.slice(0, 5).forEach((item, index) => {
    const rank = index + 1;

    const row = document.createElement("div");
    row.className = `
      flex items-center justify-between p-4 rounded-xl
      ${getRankStyle(rank)}
      transition-transform hover:scale-[1.02]
    `;

    row.innerHTML = `
      <div class="flex items-center gap-4">
        <span class="text-lg font-bold w-6">#${rank}</span>
        <span class="font-medium">${item.name}</span>
      </div>
      <span class="font-bold">${item.points} pts</span>
    `;

    container.appendChild(row);
  });
}

// ------------------ INIT ------------------
export function initLeaderboards() {
    renderLeaderboard(players, "playerLeaderboard");
    renderLeaderboard(center, "centerLeaderboard");
}
