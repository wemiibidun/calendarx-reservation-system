// === MODULE IMPORTS === //
import { Reservation } from "./reservation.js";
import { saveToLocal, loadFromLocal } from "./storage.js";
import { drawChart } from "./chart.js";
import { getBootstrapColorForName } from "./utils.js";
import "./utils.js"; // for any prototypes or helper extensions

// Load reservations from localStorage and convert to Reservation instances
let reservations = loadFromLocal().map(
  (r) => new Reservation(r.name, r.date, r.start, r.end)
);

let editingIndex = null; // Used to track when editing an existing reservation

$(function () {
  $("#date").datepicker(); // Initialize jQuery UI date picker
  updateUI(); // Initial render
});

// Format 24-hour value to 12-hour string
function formatHour(hour) {
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:00 ${ampm}`;
}

// Convert 24-hour format to [hour, AM/PM] for populating form
function convertFrom24Hour(hour24) {
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour = hour24 % 12 || 12;
  return [hour, ampm];
}

function renderCalendar() {
  $("#calendar").empty(); // Clear previous reservations

  reservations.forEach((res, index) => {
    const color = getBootstrapColorForName(res.name); // Get user-based color
    const bgClass = `bg-${color}`;
    const textClass = color === "warning" ? "text-dark" : "text-white";

    // Create reservation card
    const div = $(`
      <div class="reservation border rounded p-2 mb-2 mb-sm-4 ${bgClass} ${textClass} d-flex flex-wrap justify-content-between align-items-start gap-2">
        <span>${res.name} - ${res.date} (${formatHour(res.start)}–${formatHour(res.end)})</span>
        <div>
          <button class="btn btn-sm btn-light me-2 edit-btn" data-index="${index}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-dark delete-btn" data-index="${index}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `);

    $("#calendar").append(div);
  });

  // Delete handler
  $(".delete-btn").click(function () {
    const i = $(this).data("index");
    reservations.splice(i, 1);
    updateUI();
  });

  // Edit handler, populate form with existing data
  $(".edit-btn").click(function () {
    const i = $(this).data("index");
    const r = reservations[i];

    $("#name").val(r.name);
    $("#date").val(r.date);

    const [startHour, startAMPM] = convertFrom24Hour(r.start);
    const [endHour, endAMPM] = convertFrom24Hour(r.end);

    $("#startHour").val(startHour);
    $("#startAMPM").val(startAMPM);
    $("#endHour").val(endHour);
    $("#endAMPM").val(endAMPM);

    editingIndex = i;
    $("#reserve-btn").text("Update Reservation"); // Updating Reservation
  });
}

// Functn to check if a new reservation time is available
// skipIndex is used to ignore the current reservation when editing
// (to avoid false conflicts)
function isAvailable(newRes, skipIndex = null) {
  return !reservations.some((res, i) => {
    if (i === skipIndex) return false;
    return (
      res.date === newRes.date &&
      ((newRes.start >= res.start && newRes.start < res.end) ||
        (newRes.end > res.start && newRes.end <= res.end))
    );
  });
}

// Update UI and chart after any change
// This function is called after adding, updating, or deleting reservations
// It re-renders the calendar, updates counts, and redraws the chart
// It also persists the data to localStorage
// and updates the global reservationCounts variable for charting
// This is the main function that ties everything together
// It handles rendering the calendar, updating counts, and saving to localStorage
// It also redraws the chart if Google Charts is loaded
// This function is called whenever the reservations change
// It ensures the UI is always in sync with the data
function updateUI() {
  renderCalendar();

  // Count reservations by name (relies on countBy prototype)
  const counts = reservations.countBy((r) => r.name);
  window.reservationCounts = counts; // store globally

  saveToLocal(reservations); // persist data

  // Draw chart if loaded
  if (google.visualization && google.visualization.ColumnChart) {
    drawChart(counts);
  }
}

// reserve and update button handler
// This function handles both reserving a new slot and updating an existing one
$("#reserve-btn").on("click", () => {
  const name = $("#name").val().trim();
  const date = $("#date").val();

  // Converts 12h to 24h for logic comparison
  function convertTo24Hour(hour, ampm) {
    hour = parseInt(hour);
    if (ampm === "PM" && hour !== 12) return hour + 12;
    if (ampm === "AM" && hour === 12) return 0;
    return hour;
  }

  const startHour = $("#startHour").val();
  const startAMPM = $("#startAMPM").val();
  const endHour = $("#endHour").val();
  const endAMPM = $("#endAMPM").val();

  if (!name || !date || !startHour || !endHour) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const start = convertTo24Hour(startHour, startAMPM);
  const end = convertTo24Hour(endHour, endAMPM);

  if (!name || !date || isNaN(start) || isNaN(end) || start >= end) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const newRes = new Reservation(name, date, start, end);

  // Save or update
  if (isAvailable(newRes, editingIndex)) {
    if (editingIndex !== null) {
      reservations[editingIndex] = newRes;
      editingIndex = null;
    } else {
      reservations.push(newRes);
    }

    updateUI();

    // Reset form
    $("#name").val("");
    $("#date").val("");
    $("#startHour").val("");
    $("#startAMPM").val("AM");
    $("#endHour").val("");
    $("#endAMPM").val("AM");
    $("#reserve-btn").text("Reserve");
  } else {
    alert("Time conflict! Please choose another time.");
  }
});

// redraw chart on window resize
// This ensures the chart is responsive and fits the container
window.addEventListener("resize", () => {
  const counts = reservations.countBy((r) => r.name);
  drawChart(counts);
});