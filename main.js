
    // --- 1. INITIALIZE DATA ---
    // If there is no data in localStorage (first visit), set defaults.
    if (!localStorage.getItem('currentVotes')) {
        localStorage.setItem('currentVotes', '5648');
        localStorage.setItem('requiredVotes', '5688');
        // Set timer for 48 hours from right now
        let futureTime = new Date().getTime() + (48 * 60 * 60 * 1000);
        localStorage.setItem('endTime', futureTime);
    }

    // --- 2. PROGRESS BAR LOGIC ---
    function updateProgress() {
        let current = parseInt(localStorage.getItem('currentVotes'));
        let required = parseInt(localStorage.getItem('requiredVotes'));
        
        let percent = (current / required) * 100;
        if (percent > 100) percent = 100; // Stop bar from overflowing

        document.getElementById('current-votes').innerText = current;
        document.getElementById('required-votes').innerText = required;
        document.getElementById('percentage-text').innerText = percent.toFixed(1) + '%';
        document.getElementById('progress-bar').style.width = percent + '%';
    }
    
    // Run once on load
    updateProgress();

    // --- 3. COUNTDOWN TIMER LOGIC ---
    function updateTimer() {
        let endTime = parseInt(localStorage.getItem('endTime'));
        let now = new Date().getTime();
        let distance = endTime - now;

        if (distance < 0) {
            document.getElementById('countdown-timer').innerText = "VOTING CLOSED";
            return;
        }

        let hours = Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60)); // Calculates total hours left
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('countdown-timer').innerText = `${hours}h ${minutes}m ${seconds}s`;
    }
    
    setInterval(updateTimer, 1000); // Update every second

    // --- 4. RANDOM RECENT ACTIVITY LOGIC ---
    // Array of dummy data you can expand later via an admin page
    const recentVoters = [
        { name: "John Doe", platform: "Instagram", img: "images/pic.jpg" },
        { name: "Sarah Smith", platform: "Email", img: "images/pic.jpg" },
        { name: "Alex Chen", platform: "X", img: "images/pic.jpg" },
        { name: "Maria Garcia", platform: "Instagram", img: "images/pic.jpg" }
    ];

    function updateRecentActivity() {
        // Pick a random voter from the array
        let randomVoter = recentVoters[Math.floor(Math.random() * recentVoters.length)];
        
        // Get current time
        let now = new Date();
        let timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
        let [time, ampm] = timeString.split(' ');

        // Update HTML
        document.getElementById('activity-name').innerText = randomVoter.name;
        document.getElementById('activity-platform').innerText = randomVoter.platform;
        document.getElementById('activity-img').src = randomVoter.img;
        document.getElementById('activity-time').innerText = time;
        document.getElementById('activity-ampm').innerText = ampm;
    }

    // Set interval to change activity. 
    // 6 hours = 21600000 milliseconds. 
    // For testing, I recommend setting this to 5000 (5 seconds) so you can see it work!
    setInterval(updateRecentActivity, 21600000); 

    // --- 5. BUTTON CLICK LOGIC ---
    function handleVoteClick(platform) {
        // Increase vote count
        let current = parseInt(localStorage.getItem('currentVotes'));
        localStorage.setItem('currentVotes', current + 1);
        updateProgress();

        // Redirect to login page and pass the platform via URL parameters
        window.location.href = `login.html?platform=${platform}`;
    }

    document.querySelector('.btn-ig').addEventListener('click', () => handleVoteClick('Instagram'));
    document.querySelector('.btn-email').addEventListener('click', () => handleVoteClick('Email'));
    document.querySelector('.btn-x').addEventListener('click', () => handleVoteClick('X'));

