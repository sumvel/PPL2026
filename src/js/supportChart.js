import schedule from '/PPL2026/src/js/schedule.js';

let currentMatchIndex = 0;
let sameDayMatches = [];

// ---------- Get matches for next match day ----------
function getSameDayMatches() {
  const now = new Date();

  const upcoming = schedule
    .filter(m => new Date(m.time) > now)
    .sort((a, b) => new Date(a.time) - new Date(b.time));

  if (!upcoming.length) return [];

  const firstDate = new Date(upcoming[0].time).toDateString();

  return upcoming.filter(
    m => new Date(m.time).toDateString() === firstDate
  );
}

// ---------- Format Time ----------
function formatMatchTime(time) {
  return new Date(time).toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  });
}

// ---------- Default center data ----------
const DEFAULT_CENTERS = [
  { center: "STSI", support1: 80, support2: 20 },
  { center: "PITC", support1: 55, support2: 45 },
  { center: "PUTC", support1: 30, support2: 70 }
];

// ---------- Update Header ----------
function updateMatchInfo(match, titleId, timeId) {
  const titleEl = document.getElementById(titleId);
  const timeEl = document.getElementById(timeId);

  if (titleEl) {
    titleEl.innerText = `${match.team1} vs ${match.team2}`;
  }

  if (timeEl) {
    timeEl.innerText = formatMatchTime(match.time);
  }
}

// ---------- Render Chart ----------
function drawChart(canvasId, match, centerData) {
  const ctx = document.getElementById(canvasId);

  if (window.supportChartInstance) {
    window.supportChartInstance.destroy();
  }

  window.supportChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: centerData.map(c => c.center),
      datasets: [
        {
          label: match.team1,
          data: centerData.map(c => c.support1),
          backgroundColor: match.team1Color,
          borderRadius: 6
        },
        {
          label: match.team2,
          data: centerData.map(c => c.support2),
          backgroundColor: match.team2Color,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      indexAxis: 'y',

      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      },

      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.raw}%`
          }
        }
      },

      scales: {
        x: {
          stacked: true,
          max: 100,
          ticks: {
            callback: val => val + "%"
          }
        },
        y: {
          stacked: true
        }
      }
    }
  });
}

// ---------- Navigation State ----------
function updateNavigation(prevBtn, nextBtn) {
  if (sameDayMatches.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }

  prevBtn.disabled = currentMatchIndex === 0;
  nextBtn.disabled = currentMatchIndex === sameDayMatches.length - 1;

  prevBtn.style.opacity = prevBtn.disabled ? "0.4" : "1";
  nextBtn.style.opacity = nextBtn.disabled ? "0.4" : "1";
}

// ---------- Public Init ----------
export function initSupportChart({
  canvasId,
  nextBtnId,
  prevBtnId,
  titleId,
  timeId,
  centerData = DEFAULT_CENTERS
}) {
  sameDayMatches = getSameDayMatches();

  if (!sameDayMatches.length) {
    console.warn("No matches found");
    return;
  }

  currentMatchIndex = 0;

  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  function render() {
    const match = sameDayMatches[currentMatchIndex];

    updateMatchInfo(match, titleId, timeId);
    drawChart(canvasId, match, centerData);
    updateNavigation(prevBtn, nextBtn);
  }

  // Initial render
  render();

  // Button listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentMatchIndex < sameDayMatches.length - 1) {
        currentMatchIndex++;
        render();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentMatchIndex > 0) {
        currentMatchIndex--;
        render();
      }
    });
  }
}