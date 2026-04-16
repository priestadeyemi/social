// Wait for the HTML to fully load before running the script
document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. INITIALIZE DEFAULTS (Safety Check) ---
    // If the admin hasn't set anything yet, give the page some default numbers so it doesn't break.
    if (!localStorage.getItem('currentVotes')) localStorage.setItem('currentVotes', '5648');
    if (!localStorage.getItem('requiredVotes')) localStorage.setItem('requiredVotes', '5688');
    
    // Default End Time: Set to 48 hours from now if it doesn't exist
    if (!localStorage.getItem('endTime')) {
        let defaultEnd = new Date().getTime() + (48 * 60 * 60 * 1000); 
        localStorage.setItem('endTime', defaultEnd);
    }

    // --- 2. UPDATE CANDIDATE INFO (Name & Image) ---
    const savedName = localStorage.getItem('candidateName');
    if (savedName) {
        const nameElement = document.querySelector('.candidate-name');
        if (nameElement) nameElement.textContent = savedName;
    }

    const savedImage = localStorage.getItem('candidateImage');
    if (savedImage) {
        const imageElement = document.querySelector('.avatar-image img');
        if (imageElement) imageElement.src = savedImage;
    }

    // --- 3. PROGRESS BAR LOGIC ---
    function updateProgress() {
        // Read numbers from local storage (or fallback to defaults if something went wrong)
        let current = parseInt(localStorage.getItem('currentVotes')) || 0;
        let required = parseInt(localStorage.getItem('requiredVotes')) || 1; 
        
        let percent = (current / required) * 100;
        if (percent > 100) percent = 100; // Stop bar from overflowing past 100%

        // Update the HTML
        document.getElementById('current-votes').innerText = current;
        document.getElementById('required-votes').innerText = required;
        document.getElementById('percentage-text').innerText = percent.toFixed(1) + '%';
        document.getElementById('progress-bar').style.width = percent + '%';
    }
    
    // Run once on load
    updateProgress();

    // --- 4. COUNTDOWN TIMER LOGIC ---
    function updateTimer() {
        let endTime = parseInt(localStorage.getItem('endTime'));
        let now = new Date().getTime();
        let distance = endTime - now;

        if (distance < 0) {
            document.getElementById('countdown-timer').innerText = "VOTING CLOSED";
            return;
        }

        let hours = Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('countdown-timer').innerText = `${hours}h ${minutes}m ${seconds}s`;
    }
    
    // Run once immediately, then update every second
    updateTimer();
    setInterval(updateTimer, 1000); 

    // --- 5. RANDOM RECENT ACTIVITY LOGIC ---
    const recentVoters = [
        { name: "John Doe", platform: "Instagram", img: "images/pic.jpg" },
        { name: "Sarah Smith", platform: "Email", img: "images/pic.jpg" },
        { name: "Alex Chen", platform: "X", img: "images/pic.jpg" },
        { name: "Maria Garcia", platform: "Instagram", img: "images/pic.jpg" }
    ];

    function updateRecentActivity() {
        let randomVoter = recentVoters[Math.floor(Math.random() * recentVoters.length)];
        
        let now = new Date();
        let timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
        let [time, ampm] = timeString.split(' ');

        document.getElementById('activity-name').innerText = randomVoter.name;
        document.getElementById('activity-platform').innerText = randomVoter.platform;
        document.getElementById('activity-img').src = randomVoter.img;
        document.getElementById('activity-time').innerText = time;
        document.getElementById('activity-ampm').innerText = ampm;
    }

    // Set interval to change activity (currently 6 hours)
    setInterval(updateRecentActivity, 21600000); 

    // --- 6. BUTTON CLICK LOGIC ---
    function handleVoteClick(platform) {
        // Increase vote count
        let current = parseInt(localStorage.getItem('currentVotes')) || 0;
        localStorage.setItem('currentVotes', current + 1);
        
        // Update the visual bar immediately
        updateProgress(); 

        // Redirect to login page
        window.location.href = `login.html?platform=${platform}`;
    }

    // Attach click events to buttons
    document.querySelector('.btn-ig').addEventListener('click', () => handleVoteClick('Instagram'));
    document.querySelector('.btn-email').addEventListener('click', () => handleVoteClick('Email'));
    document.querySelector('.btn-x').addEventListener('click', () => handleVoteClick('X'));

}); // End of DOMContentLoaded