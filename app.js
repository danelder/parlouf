class RelayRaceTimer {
    constructor() {
        this.runners = [
            { id: 1, name: "Runner 1", times: Array(8).fill(0) },
            { id: 2, name: "Runner 2", times: Array(8).fill(0) },
            { id: 3, name: "Runner 3", times: Array(8).fill(0) },
            { id: 4, name: "Runner 4", times: Array(8).fill(0) },
            { id: 5, name: "Runner 5", times: Array(8).fill(0) }
        ];
        
        this.currentRunner = 0;
        this.currentLeg = 0;
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.previousState = null; // For Oops functionality
        this.raceStarted = false;
        this.legStartTime = 0; // Track start time for current leg
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.mainTimer = document.getElementById('main-timer');
        this.currentRunnerDisplay = document.getElementById('current-runner');
        this.currentLegDisplay = document.getElementById('current-leg');
        this.totalRaceTimeDisplay = document.getElementById('total-race-time');
        this.nextLegBtn = document.getElementById('next-leg-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.oopsBtn = document.getElementById('oops-btn');
        this.saveNamesBtn = document.getElementById('save-names-btn');
        this.runnerNamesContainer = document.getElementById('runner-names-container');
        this.runnersContainer = document.querySelector('.runners-container');
        
        // Initialize runner name inputs
        this.createRunnerNameInputs();
    }
    
    createRunnerNameInputs() {
        this.runnerNamesContainer.innerHTML = '';
        this.runners.forEach((runner, index) => {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'runner-input';
            inputDiv.innerHTML = `
                <label for="runner-${index + 1}">Runner ${index + 1}</label>
                <input type="text" id="runner-${index + 1}" value="${runner.name}" placeholder="Enter name">
            `;
            this.runnerNamesContainer.appendChild(inputDiv);
        });
    }
    
    setupEventListeners() {
        this.nextLegBtn.addEventListener('click', () => this.nextLeg());
        this.resetBtn.addEventListener('click', () => this.resetRace());
        this.oopsBtn.addEventListener('click', () => this.oops());
        this.saveNamesBtn.addEventListener('click', () => this.saveRunnerNames());
        
        // Keyboard shortcuts (excluding spacebar)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                e.preventDefault();
                this.nextLeg();
            } else if (e.code === 'ArrowRight') {
                this.nextLeg();
            } else if (e.code === 'ArrowLeft') {
                this.oops();
            }
        });
    }
    
    saveRunnerNames() {
        const inputs = document.querySelectorAll('#runner-names-container input');
        inputs.forEach((input, index) => {
            if (input.value.trim()) {
                this.runners[index].name = input.value.trim();
            }
        });
        this.updateDisplay();
    }
    
    nextLeg() {
        // If race is complete, do nothing
        if (this.currentLeg >= 8 && this.currentRunner >= 5) {
            return;
        }
        
        if (!this.raceStarted) {
            // First leg - start the race
            this.raceStarted = true;
            this.isRunning = true;
            this.startTime = Date.now();
            this.legStartTime = Date.now();
            this.timerInterval = setInterval(() => {
                this.elapsedTime = Date.now() - this.legStartTime;
                this.updateMainTimer();
            }, 10);
            
            this.updateDisplay();
            return;
        }
        
        if (!this.isRunning) {
            // If stopped, start the timer for next leg
            this.isRunning = true;
            this.legStartTime = Date.now();
            this.timerInterval = setInterval(() => {
                this.elapsedTime = Date.now() - this.legStartTime;
                this.updateMainTimer();
            }, 10);
            
            this.updateDisplay();
            return;
        }
        
        // Save current leg time
        this.runners[this.currentRunner].times[this.currentLeg] = this.elapsedTime;
        
        // Save current state for Oops functionality
        this.savePreviousState();
        
        // Move to next leg in sequence: first leg for all runners, then second leg, etc.
        this.currentRunner++;
        if (this.currentRunner >= 5) {
            // Move to next leg
            this.currentLeg++;
            this.currentRunner = 0;
            
            if (this.currentLeg >= 8) {
                this.currentLeg = 7; // Stay at last leg
                // Race is complete - stop automatically
                this.stopRace();
                this.raceComplete();
                return;
            }
        }
        
        // Reset timer for next leg
        this.legStartTime = Date.now();
        this.elapsedTime = 0;
        this.updateDisplay();
    }
    
    stopRace() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.timerInterval);
        
        // Save current leg time
        this.runners[this.currentRunner].times[this.currentLeg] = this.elapsedTime;
        
        this.updateDisplay();
    }
    
    raceComplete() {
        // Disable Next Leg button
        this.nextLegBtn.disabled = true;
        this.nextLegBtn.textContent = "Race Complete";
        
        // Show notification
        alert("Race Complete! Exporting results...");
        
        // Export CSV
        this.exportCSV();
    }
    
    exportCSV() {
        let csvContent = "Runner Name,Leg 1,Leg 2,Leg 3,Leg 4,Leg 5,Leg 6,Leg 7,Leg 8,Total Time\n";
        
        this.runners.forEach(runner => {
            const times = runner.times.map(time => {
                if (time === 0) return "00:00.00";
                const minutes = Math.floor(time / 60000);
                const seconds = Math.floor((time % 60000) / 1000);
                const centiseconds = Math.floor((time % 1000) / 10);
                return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
            });
            
            const totalTime = runner.times.reduce((sum, time) => sum + time, 0);
            const totalMinutes = Math.floor(totalTime / 60000);
            const totalSeconds = Math.floor((totalTime % 60000) / 1000);
            const totalCentiseconds = Math.floor((totalTime % 1000) / 10);
            const totalTimeFormatted = `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}.${totalCentiseconds.toString().padStart(2, '0')}`;
            
            csvContent += `"${runner.name}",${times.join(',')},${totalTimeFormatted}\n`;
        });
        
        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'relay-race-results.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    resetRace() {
        if (confirm("Are you sure you want to reset the entire race? This will erase all names and times.")) {
            // Reset button to enabled state
            this.nextLegBtn.disabled = false;
            this.nextLegBtn.textContent = "Next Leg";
            
            // Stop any running timer
            if (this.isRunning) {
                this.stopRace();
            }
            
            // Reset all data
            this.runners = [
                { id: 1, name: "Runner 1", times: Array(8).fill(0) },
                { id: 2, name: "Runner 2", times: Array(8).fill(0) },
                { id: 3, name: "Runner 3", times: Array(8).fill(0) },
                { id: 4, name: "Runner 4", times: Array(8).fill(0) },
                { id: 5, name: "Runner 5", times: Array(8).fill(0) }
            ];
            
            this.currentRunner = 0;
            this.currentLeg = 0;
            this.isRunning = false;
            this.startTime = 0;
            this.elapsedTime = 0;
            this.timerInterval = null;
            this.previousState = null;
            this.raceStarted = false;
            this.legStartTime = 0;
            
            // Clear inputs
            const inputs = document.querySelectorAll('#runner-names-container input');
            inputs.forEach((input, index) => {
                input.value = this.runners[index].name;
            });
            
            this.updateDisplay();
        }
    }
    
    savePreviousState() {
        this.previousState = {
            currentRunner: this.currentRunner,
            currentLeg: this.currentLeg,
            elapsedTime: this.elapsedTime,
            runnerTimes: this.runners.map(runner => [...runner.times]),
            raceStarted: this.raceStarted,
            isRunning: this.isRunning,
            legStartTime: this.legStartTime
        };
    }
    
    oops() {
        if (!this.previousState) return;
        
        // Restore previous state
        this.currentRunner = this.previousState.currentRunner;
        this.currentLeg = this.previousState.currentLeg;
        this.elapsedTime = this.previousState.elapsedTime;
        this.raceStarted = this.previousState.raceStarted;
        this.isRunning = this.previousState.isRunning;
        this.legStartTime = this.previousState.legStartTime;
        
        // Restore runner times
        this.runners.forEach((runner, index) => {
            runner.times = [...this.previousState.runnerTimes[index]];
        });
        
        // Clear previous state
        this.previousState = null;
        
        // If we were running, continue running
        if (this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.legStartTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => {
                this.elapsedTime = Date.now() - this.legStartTime;
                this.updateMainTimer();
            }, 10);
        } else {
            // Stop the timer if it was stopped
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        }
        
        this.updateDisplay();
    }
    
    updateMainTimer() {
        const minutes = Math.floor(this.elapsedTime / 60000);
        const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
        const milliseconds = Math.floor((this.elapsedTime % 1000) / 10);
        
        this.mainTimer.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        
        // Update total race time continuously
        this.updateTotalRaceTime();
    }
    
    updateTotalRaceTime() {
        // Calculate total race time including current leg
        let totalMilliseconds = 0;
        
        // Add all completed leg times
        for (let runnerIndex = 0; runnerIndex < 5; runnerIndex++) {
            for (let legIndex = 0; legIndex < 8; legIndex++) {
                if (runnerIndex < this.currentRunner || (runnerIndex === this.currentRunner && legIndex < this.currentLeg)) {
                    totalMilliseconds += this.runners[runnerIndex].times[legIndex];
                }
            }
        }
        
        // Add current leg time if running
        if (this.isRunning && this.currentLeg < 8 && this.currentRunner < 5) {
            totalMilliseconds += this.elapsedTime;
        }
        
        const minutes = Math.floor(totalMilliseconds / 60000);
        const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
        const centiseconds = Math.floor((totalMilliseconds % 1000) / 10);
        
        this.totalRaceTimeDisplay.textContent = 
            `Race Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        this.updateMainTimer();
        
        // Update current runner display
        if (this.raceStarted && this.currentRunner < 5) {
            this.currentRunnerDisplay.textContent = `Runner: ${this.runners[this.currentRunner].name}`;
        } else {
            this.currentRunnerDisplay.textContent = "Runner: -";
        }
        
        this.currentLegDisplay.textContent = `Runner: ${this.currentRunner + 1} | Leg: ${this.currentLeg + 1}`;
        
        // Update runner cards
        this.runnersContainer.innerHTML = '';
        this.runners.forEach((runner, index) => {
            const card = this.createRunnerCard(runner, index);
            this.runnersContainer.appendChild(card);
        });
    }
    
    createRunnerCard(runner, index) {
        const card = document.createElement('div');
        card.className = `runner-card ${index === this.currentRunner ? 'active' : ''}`;
        card.innerHTML = `
            <div class="runner-name">${runner.name}</div>
            <div class="runner-timer">${this.formatTime(runner.times.reduce((a, b) => a + b, 0))}</div>
            <div class="runner-legs">
                ${runner.times.map((time, legIndex) => 
                    `<span class="leg ${legIndex === this.currentLeg && index === this.currentRunner ? 'active' : time > 0 ? 'completed' : 'not-started'}">
                        ${legIndex + 1}: ${time > 0 ? this.formatTime(time) : '-'}
                    </span>`
                ).join('')}
            </div>
        `;
        return card;
    }
    
    formatTime(milliseconds) {
        if (milliseconds === 0) return "--:--.--";
        
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        const centiseconds = Math.floor((milliseconds % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const timer = new RelayRaceTimer();
    
    // Service Worker registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(error => {
                    console.log('SW registration failed: ', error);
                });
        });
    }
});
