import schedule from '/PPL2026/src/js/schedule.js';

function getNextMatches() {
    const now = new Date();

    const upcoming = schedule
        .filter(m => new Date(m.time) > now)
        .sort((a, b) => new Date(a.time) - new Date(b.time));

    if (upcoming.length === 0) return [];

    const firstMatchDate = new Date(upcoming[0].time).toDateString();

    return upcoming.filter(m => new Date(m.time).toDateString() === firstMatchDate);
}

function formatCountdown(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hrs}h ${mins}m ${secs}s`;
}

function renderNextMatches() {
    const container = document.getElementById("nextMatches");
    container.innerHTML = "";

    const nextMatches = getNextMatches();

    nextMatches.forEach((match, index) => {
        const card = document.createElement("div");
        card.className = "bg-[var(--card)] rounded-2xl p-6 text-center shadow-lg";

        card.innerHTML = `
          <div class="flex justify-center items-center gap-8 mb-6">
            <div>
              <img src="${match.team1Logo}" class="h-20 mx-auto mb-2" />
              <p class="font-bold"">${match.team1}</p>
            </div>

            <span class="text-gray-400 text-xl">vs</span>

            <div>
              <img src="${match.team2Logo}" class="h-20 mx-auto mb-2" />
              <p class="font-bold">${match.team2}</p>
            </div>
          </div>

          <p class="text-gray-400 mb-2">${new Date(match.time).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p id="countdown-${index}" class="text-yellow-400 font-semibold mb-4"></p>

          <div class="w-full bg-gray-700 rounded-full h-4 overflow-hidden flex">
            <div style="width:${match.support1}%; background:${match.team1Color}" class="h-4"></div>
            <div style="width:${100 - match.support1}%; background:${match.team2Color}" class="h-4"></div>
          </div>

          <div class="flex justify-between text-sm mt-2">
            <span>${match.team1} ${match.support1}%</span>
            <span>${match.team2} ${match.support2}%</span>
          </div>
        `;

        container.appendChild(card);
    });

    startCountdowns(nextMatches);
}

let countdownInterval;

function startCountdowns(matchesList) {
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const now = new Date();

        matchesList.forEach((match, index) => {
            const matchTime = new Date(match.time);
            const diff = matchTime - now;

            const el = document.getElementById(`countdown-${index}`);
            if (!el) return;

            el.innerText = diff <= 0
                ? "Match Started"
                : "Starts in " + formatCountdown(diff);
        });
    }, 1000);
}

export function initNextMatches() {
  renderNextMatches();
}