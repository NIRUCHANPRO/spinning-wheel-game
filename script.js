class SpinningWheel {
    constructor() {
        this.wheel = document.querySelector('.wheel');
        this.spinButton = document.getElementById('spinButton');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        
        this.score = 0;
        this.isSpinning = false;
        this.currentRotation = 0;
        this.timeLeft = 5 * 60 + 34; // 5:34 in seconds
        
        // Add new elements
        this.menuButton = document.querySelector('.menu-button');
        this.menuDropdown = document.querySelector('.menu-dropdown');
        this.backButton = document.querySelector('.back-button');
        
        this.init();
    }
    
    init() {
        // Initialize wheel segments
        const segments = document.querySelectorAll('.segment');
        segments.forEach((segment, index) => {
            segment.style.transform = `rotate(${index * 45}deg)`;
            segment.style.backgroundColor = this.getSegmentColor(index);
        });
        
        // Add event listeners
        this.spinButton.addEventListener('click', () => this.spin());
        
        // Start the timer
        this.startTimer();
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Add menu toggle
        this.menuButton.addEventListener('click', () => {
            this.menuDropdown.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-button') && 
                !e.target.closest('.menu-dropdown')) {
                this.menuDropdown.classList.remove('show');
            }
        });
        
        // Back button
        this.backButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to exit the game?')) {
                window.history.back();
            }
        });
        
        // Get sound elements
        this.spinSound = document.getElementById('spinSound');
        this.winSound = document.getElementById('winSound');
    }
    
    getSegmentColor(index) {
        const colors = ['#e9c46a', '#f4a261', '#e76f51', '#2a9d8f', 
                       '#264653', '#e9c46a', '#f4a261', '#e76f51'];
        return colors[index];
    }
    
    spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.spinButton.disabled = true;
        this.spinSound.play();
        
        // Calculate random rotation (5-10 full spins plus random segment)
        const spins = 5 + Math.random() * 5;
        const extraDegrees = Math.random() * 360;
        const totalRotation = spins * 360 + extraDegrees;
        
        this.currentRotation += totalRotation;
        this.wheel.style.transform = `rotate(${this.currentRotation}deg)`;
        
        setTimeout(() => this.handleSpinComplete(), 3000);
    }
    
    handleSpinComplete() {
        this.isSpinning = false;
        this.spinButton.disabled = false;
        
        // Calculate which segment landed on top
        const normalizedRotation = this.currentRotation % 360;
        const segmentIndex = Math.floor((360 - (normalizedRotation % 360)) / 45);
        const points = (segmentIndex + 1) * 10;
        
        this.score += points;
        this.scoreElement.textContent = this.score;
        
        this.winSound.play();
        this.showWinningMessage(points);
    }
    
    showWinningMessage(points) {
        const message = document.createElement('div');
        message.innerHTML = `
            <i class="fas fa-coins"></i>
            <span>+${points}</span>
        `;
        message.className = 'winning-message';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 32px;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 10px;
            animation: fadeOut 1s forwards;
        `;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 1000);
    }
    
    startTimer() {
        const timer = setInterval(() => {
            this.timeLeft--;
            
            if (this.timeLeft <= 0) {
                clearInterval(timer);
                this.endGame();
            }
            
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            this.timerElement.textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }
    
    endGame() {
        this.spinButton.disabled = true;
        alert(`Game Over! Final Score: ${this.score}`);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new SpinningWheel();
}); 