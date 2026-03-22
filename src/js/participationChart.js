// participationChart.js

// ---------- Sample Data ----------
const DEFAULT_DATA = {
  rounds: ["R1", "R2", "R3", "R4", "R5"],
  centers: [
    {
      name: "STSI",
      data: [120, 150, 180, 200, 220]
    },
    {
      name: "PUTC",
      data: [100, 130, 160, 170, 190]
    },
    {
      name: "PITC",
      data: [90, 110, 140, 160, 180]
    }
  ]
};

// ---------- Color Generator ----------
function getColor(index) {
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4CAF50",
    "#9C27B0"
  ];
  return colors[index % colors.length];
}

// ---------- Main Render ----------
export function renderParticipationChart(canvasId, chartData = DEFAULT_DATA) {
  const ctx = document.getElementById(canvasId);

  if (!ctx) {
    console.error("Canvas not found");
    return;
  }

  if (window.participationChartInstance) {
    window.participationChartInstance.destroy();
  }

  const datasets = chartData.centers.map((center, i) => ({
    label: center.name,
    data: center.data,
    borderColor: getColor(i),
    backgroundColor: getColor(i),
    tension: 0.4, // smooth curves
    fill: false,
    pointRadius: 4,
    pointHoverRadius: 6
  }));

  window.participationChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.rounds,
      datasets: datasets
    },
    options: {
      responsive: true,

      interaction: {
        mode: 'nearest',
        intersect: false
      },

      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: "#ffffff"
          },
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.raw}`
          }
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Participants",
            color: "#ffffff"
          },
          ticks: {
            color: "#ffffff"   // X-axis values
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)"
          },
        },
        x: {
          title: {
            display: true,
            text: "Rounds",
            color: "#ffffff"
          },
          ticks: {
            color: "#ffffff"   // X-axis values
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)"
          },
        }
      }
    }
  });
}