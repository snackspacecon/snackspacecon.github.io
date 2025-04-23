/**
 * SnackSpaceCon Challenges
 * Main JavaScript file for challenge functionality
 */

// Configuration
const CHALLENGES = {
    // Challenge 1: Snack Cryptography
    snackCrypto: {
        key: 'FEED-C0DE-CAFE-1337',
        submissionUrl: '/submit.html',
        completed: false
    },
    
    // Challenge 2: Shadow CTF
    shadowCTF: {
        key: 'SH4D0W-FL4G-XDR-8675',
        hiddenData: 'U2VjcmV0IGtleSBmb3IgU2hhZG93IENURjogVVhCTFIxSkZRdz09', // Base64 encoded
        completed: false
    },
    
    // Challenge 3: DNS Challenge
    dnsChallenge: {
        key: 'E-WASTE-P1R4CY-2025',
        startingDomain: 'start.hunt.snackspacecon.com',
        completed: false
    },
    
    // Master Key Challenge
    masterKey: {
        key: '5N4CK-H4CK-SP4CE-C0N-M45T3R-K3Y-2025',
        completed: false,
        location: "The abandoned warehouse at coordinates 38.7749° N, 90.6661° W. Enter through the loading dock and follow the blinking LEDs."
    }
};

// Storage for challenge progress
class ChallengeStorage {
    constructor() {
        this.storageKey = 'snackspacecon_progress';
        this.progress = this.loadProgress();
    }
    
    loadProgress() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {
            challenges: {
                snackCrypto: { completed: false, timestamp: null },
                shadowCTF: { completed: false, timestamp: null },
                dnsChallenge: { completed: false, timestamp: null },
                masterKey: { completed: false, timestamp: null }
            },
            discoveredHints: [],
            konami: false
        };
    }
    
    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }
    
    completeChallenge(challengeName) {
        if (this.progress.challenges[challengeName]) {
            this.progress.challenges[challengeName].completed = true;
            this.progress.challenges[challengeName].timestamp = new Date().toISOString();
            this.saveProgress();
            return true;
        }
        return false;
    }
    
    addDiscoveredHint(hint) {
        if (!this.progress.discoveredHints.includes(hint)) {
            this.progress.discoveredHints.push(hint);
            this.saveProgress();
        }
    }
    
    resetProgress() {
        localStorage.removeItem(this.storageKey);
        this.progress = this.loadProgress();
    }
    
    isKonamiActivated() {
        return this.progress.konami;
    }
    
    activateKonami() {
        this.progress.konami = true;
        this.saveProgress();
    }
}

// Initialize storage
const storage = new ChallengeStorage();

// Console functionality 
class ConsoleTerminal {
    constructor(inputElement, outputElement) {
        this.inputElement = inputElement;
        this.outputElement = outputElement;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.commands = {
            'help': this.cmdHelp.bind(this),
            'date': this.cmdDate.bind(this),
            'location': this.cmdLocation.bind(this),
            'challenge': this.cmdChallenge.bind(this),
            'snack': this.cmdSnack.bind(this),
            'konami': this.cmdKonami.bind(this),
            'masterkey': this.cmdMasterKey.bind(this),
            'decrypt': this.cmdDecrypt.bind(this),
            'clear': this.cmdClear.bind(this),
            'reset': this.cmdReset.bind(this)
        };
        
        this.setupListeners();
    }
    
    setupListeners() {
        // Set up the input listeners
        if (this.inputElement) {
            this.inputElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const command = this.inputElement.value.trim();
                    if (command) {
                        this.processCommand(command);
                        this.commandHistory.push(command);
                        this.historyIndex = this.commandHistory.length;
                        this.inputElement.value = '';
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (this.historyIndex > 0) {
                        this.historyIndex--;
                        this.inputElement.value = this.commandHistory[this.historyIndex];
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (this.historyIndex < this.commandHistory.length - 1) {
                        this.historyIndex++;
                        this.inputElement.value = this.commandHistory[this.historyIndex];
                    } else {
                        this.historyIndex = this.commandHistory.length;
                        this.inputElement.value = '';
                    }
                }
            });
        }
    }
    
    processCommand(input) {
        // Parse the command and arguments
        const parts = input.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Output the command to the console
        this.appendOutput(`> ${input}`);
        
        // Check if command exists and execute it
        if (cmd in this.commands) {
            this.commands[cmd](args);
        } else {
            this.appendOutput('Command not found. Type "help" for available commands.');
        }
    }
    
    appendOutput(text) {
        // Create a new div for the output
        const outputLine = document.createElement('div');
        outputLine.textContent = text;
        
        // Add the line to the output
        if (this.outputElement) {
            this.outputElement.appendChild(outputLine);
            // Auto-scroll to bottom
            this.outputElement.scrollTop = this.outputElement.scrollHeight;
        }
    }
    
    cmdHelp() {
        this.appendOutput('Available commands:');
        this.appendOutput('  help       - Show this help message');
        this.appendOutput('  date       - Show event dates');
        this.appendOutput('  location   - Show event location (requires key)');
        this.appendOutput('  challenge  - List active challenges');
        this.appendOutput('  snack      - Information about snack participation');
        this.appendOutput('  konami     - "Up, up, down, down, left, right, left, right, B, A"');
        this.appendOutput('  masterkey  - Test a master key (requires key parameter)');
        this.appendOutput('  decrypt    - Decrypt text with a key (requires text and key)');
        this.appendOutput('  clear      - Clear the console');
        this.appendOutput('  reset      - Reset challenge progress');
    }
    
    cmdDate() {
        this.appendOutput('SNACKSPACECON DATES: MAY 11-15, 2025');
        this.appendOutput('Running parallel to the official conference.');
        this.appendOutput('Countdown active: Check main page for exact timing.');
    }
    
    cmdLocation(args) {
        const allChallengesCompleted = Object.values(storage.progress.challenges)
            .every(challenge => challenge.completed);
            
        if (allChallengesCompleted || storage.isKonamiActivated()) {
            this.appendOutput('DECRYPTING LOCATION DATA...');
            this.appendOutput('');
            this.appendOutput(CHALLENGES.masterKey.location);
        } else {
            this.appendOutput('ACCESS DENIED: Complete all challenges to unlock location.');
            this.appendOutput('Alternatively, a master key is required.');
        }
    }
    
    cmdChallenge() {
        this.appendOutput('ACTIVE CHALLENGES:');
        this.appendOutput('');
        this.appendOutput('1. SNACK CRYPTOGRAPHY');
        const challenge1Status = storage.progress.challenges.snackCrypto.completed ? 
            'COMPLETED' : 'IN PROGRESS';
        this.appendOutput(`   Status: ${challenge1Status}`);
        this.appendOutput('   Hint: Not all pages are meant to be found through normal navigation.');
        this.appendOutput('');
        
        this.appendOutput('2. SHADOW CTF');
        const challenge2Status = storage.progress.challenges.shadowCTF.completed ? 
            'COMPLETED' : 'IN PROGRESS';
        this.appendOutput(`   Status: ${challenge2Status}`);
        this.appendOutput('   Hint: Shadows exist in the paths between rendered pixels.');
        this.appendOutput('');
        
        this.appendOutput('3. DNS TREASURE HUNT');
        const challenge3Status = storage.progress.challenges.dnsChallenge.completed ? 
            'COMPLETED' : 'IN PROGRESS';
        this.appendOutput(`   Status: ${challenge3Status}`);
        this.appendOutput('   Hint: The journey begins at start.hunt.snackspacecon.com');
    }
    
    cmdSnack() {
        this.appendOutput('SNACK PARTICIPATION REQUIREMENTS:');
        this.appendOutput('');
        this.appendOutput('1. Each participant must contribute open-source snack recipes');
        this.appendOutput('2. Snack concepts must incorporate tech/hacker wordplay');
        this.appendOutput('3. All submissions require justification of hacker culture relevance');
        this.appendOutput('4. Entries judged on creativity, technical merit, and taste potential');
        this.appendOutput('');
        this.appendOutput('Submit your concept through Challenge 01 (Snack Cryptography)');
    }
    
    cmdKonami() {
        if (storage.isKonamiActivated()) {
            this.appendOutput('Konami code already activated!');
            this.appendOutput('HINT: The first fragment of the master key is "5N4CK-H4CK"');
        } else {
            this.appendOutput('Hmm, that command name sounds familiar...');
            this.appendOutput('Perhaps a certain sequence of inputs might reveal something?');
        }
    }
    
    cmdMasterKey(args) {
        if (args.length === 0) {
            this.appendOutput('Usage: masterkey [key]');
            return;
        }
        
        const attemptedKey = args.join(' ');
        
        if (attemptedKey === CHALLENGES.masterKey.key) {
            this.appendOutput('MASTER KEY VERIFIED!');
            this.appendOutput('ACCESS GRANTED TO ALL SYSTEMS');
            storage.completeChallenge('masterKey');
            
            // Unlock location
            this.appendOutput('');
            this.appendOutput('LOCATION DATA DECRYPTED:');
            this.appendOutput(CHALLENGES.masterKey.location);
        } else {
            this.appendOutput('INVALID MASTER KEY');
            this.appendOutput('Access denied.');
        }
    }
    
    cmdDecrypt(args) {
        if (args.length < 2) {
            this.appendOutput('Usage: decrypt [text] [key]');
            return;
        }
        
        const encryptedText = args[0];
        const key = args[1];
        
        // This is a simulated decryption - in reality it just checks for specific
        // combinations that reveal hints
        if (encryptedText === 'location.dat' && key === CHALLENGES.snackCrypto.key) {
            this.appendOutput('Partial decryption successful.');
            this.appendOutput('Fragment revealed: "SP4CE-C0N"');
            storage.addDiscoveredHint('SP4CE-C0N');
        } else if (encryptedText === 'shadow.bin' && key === CHALLENGES.shadowCTF.key) {
            this.appendOutput('Partial decryption successful.');
            this.appendOutput('Fragment revealed: "M45T3R-K3Y"');
            storage.addDiscoveredHint('M45T3R-K3Y');
        } else if (encryptedText === 'dns.dat' && key === CHALLENGES.dnsChallenge.key) {
            this.appendOutput('Partial decryption successful.');
            this.appendOutput('Fragment revealed: "2025"');
            storage.addDiscoveredHint('2025');
        } else {
            this.appendOutput('Decryption failed. Invalid text/key combination.');
        }
    }
    
    cmdClear() {
        if (this.outputElement) {
            this.outputElement.innerHTML = '';
        }
    }
    
    cmdReset() {
        this.appendOutput('WARNING: This will reset all challenge progress.');
        this.appendOutput('To confirm, type "reset confirm"');
    }
}

// DNS Challenge Simulator
class DNSChallengeSimulator {
    constructor() {
        this.dnsRecords = {
            // TXT records
            'start.hunt.snackspacecon.com': {
                TXT: 'Begin your quest. What type of record points to other names? Follow the CNAME path.'
            },
            'sixth.clue.snackspacecon.com': {
                TXT: 'The mail must flow. Who\'s responsible for mail exchange?'
            },
            'mail.puzzle.snackspacecon.com': {
                TXT: 'RS1XQVNURSBpcyBvbmx5IHRoZSBiZWdpbm5pbmc=' // Base64: "E-WASTE is only the beginning"
            },
            
            // CNAME records
            'start.hunt.snackspacecon.com': {
                CNAME: 'first.clue.snackspacecon.com'
            },
            'first.clue.snackspacecon.com': {
                CNAME: 'second.clue.snackspacecon.com'
            },
            'second.clue.snackspacecon.com': {
                CNAME: 'third.clue.snackspacecon.com'
            },
            'third.clue.snackspacecon.com': {
                CNAME: 'fourth.clue.snackspacecon.com'
            },
            'fourth.clue.snackspacecon.com': {
                CNAME: 'fifth.clue.snackspacecon.com'
            },
            'fifth.clue.snackspacecon.com': {
                CNAME: 'sixth.clue.snackspacecon.com'
            },
            
            // MX records
            'sixth.clue.snackspacecon.com': {
                MX: 'mail.puzzle.snackspacecon.com'
            },
            
            // A records (IP addresses that convert to ASCII)
            'pieces.puzzle.snackspacecon.com': {
                A: ['192.80.73.82', '65.67.89.45', '50.48.50.53'] // ASCII: P1R4CY-2025
            },
            
            // PTR record for the final confirmation
            'e-waste-p1r4cy-2025.final.snackspacecon.com': {
                PTR: 'E-WASTE-P1R4CY-2025'
            }
        };
    }
    
    lookupRecord(domain, recordType) {
        if (this.dnsRecords[domain] && this.dnsRecords[domain][recordType]) {
            return this.dnsRecords[domain][recordType];
        }
        return null;
    }
    
    // A simple interface to simulate DNS queries for the challenge
    simulateDNSQuery(domain, recordType) {
        const result = this.lookupRecord(domain, recordType);
        
        if (result) {
            return {
                success: true,
                domain: domain,
                recordType: recordType,
                result: result
            };
        } else {
            return {
                success: false,
                domain: domain,
                recordType: recordType,
                error: 'NXDOMAIN or no records of that type'
            };
        }
    }
}

// Initialize DNS Challenge
const dnsChallenge = new DNSChallengeSimulator();

// Konami Code detector
class KonamiCode {
    constructor(callback) {
        this.callback = callback;
        this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.currentIndex = 0;
        
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
    
    handleKeydown(event) {
        // Get the key that was pressed
        const key = event.key.toLowerCase();
        
        // Check if it's the expected key in the sequence
        if (key === this.sequence[this.currentIndex].toLowerCase()) {
            this.currentIndex++;
            
            // If we've reached the end of the sequence, execute the callback
            if (this.currentIndex === this.sequence.length) {
                this.callback();
                this.currentIndex = 0; // Reset for next time
            }
        } else {
            // Reset if the wrong key is pressed
            this.currentIndex = 0;
        }
    }
}

// Initialize Konami code
const konamiHandler = new KonamiCode(() => {
    if (!storage.isKonamiActivated()) {
        storage.activateKonami();
        
        // Show a notification
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'rgba(0, 255, 255, 0.8)';
        notification.style.color = 'black';
        notification.style.padding = '15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.fontFamily = "'VCR', monospace";
        notification.textContent = 'KONAMI CODE ACTIVATED! Master key fragment revealed: 5N4CK-H4CK';
        
        document.body.appendChild(notification);
        
        // Remove after a few seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 1s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 1000);
        }, 5000);
    }
});

// Audio player functionality
function setupAudioPlayer() {
    const toggleButton = document.getElementById('toggle-audio');
    const nextTrackButton = document.getElementById('next-track');
    const volumeSlider = document.getElementById('volume-slider');
    const audioElement = document.getElementById('background-music');
    const miniPlayer = document.getElementById('mini-player');
    const audioPlayer = document.getElementById('audio-player');
    
    if (!toggleButton || !audioElement) return;
    
    // Audio tracks
    const tracks = [
        {
            name: '5N4CK_TUN3',
            url: 'https://soundimage.org/wp-content/uploads/2017/07/Arcade-Puzzler.mp3'
        },
        {
            name: 'CYPH3R_B34T',
            url: 'https://soundimage.org/wp-content/uploads/2020/02/EKM-Like-That-Also.mp3'
        },
        {
            name: 'H4CK_W4V3',
            url: 'https://soundimage.org/wp-content/uploads/2016/01/Puzzle-Game-3.mp3'
        }
    ];
    
    let currentTrackIndex = 0;
    
    // Toggle play/pause
    toggleButton.addEventListener('click', () => {
        if (audioElement.paused) {
            audioElement.play();
            toggleButton.textContent = 'PAUSE ' + tracks[currentTrackIndex].name;
        } else {
            audioElement.pause();
            toggleButton.textContent = 'PLAY ' + tracks[currentTrackIndex].name;
        }
    });
    
    // Next track
    if (nextTrackButton) {
        nextTrackButton.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            audioElement.src = tracks[currentTrackIndex].url;
            toggleButton.textContent = audioElement.paused ? 
                'PLAY ' + tracks[currentTrackIndex].name : 
                'PAUSE ' + tracks[currentTrackIndex].name;
            
            if (!audioElement.paused) {
                audioElement.play();
            }
        });
    }
    
    // Volume control
    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            audioElement.volume = volumeSlider.value;
        });
    }
    
    // Mini player toggle
    if (miniPlayer && audioPlayer) {
        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = '_';
        minimizeButton.style.background = 'transparent';
        minimizeButton.style.border = 'none';
        minimizeButton.style.color = 'white';
        minimizeButton.style.cursor = 'pointer';
        minimizeButton.style.padding = '5px';
        minimizeButton.style.marginLeft = '5px';
        
        const windowControls = document.querySelector('.window-controls');
        if (windowControls) {
            windowControls.appendChild(minimizeButton);
        }
        
        minimizeButton.addEventListener('click', () => {
            audioPlayer.style.display = 'none';
            miniPlayer.style.display = 'flex';
        });
        
        miniPlayer.addEventListener('click', () => {
            miniPlayer.style.display = 'none';
            audioPlayer.style.display = 'flex';
        });
    }
}

// Helper function to decode base64
function decodeBase64(str) {
    try {
        return atob(str);
    } catch (e) {
        console.error('Error decoding Base64:', e);
        return null;
    }
}

// Helper function to convert ASCII values to characters
function asciiToString(asciiValues) {
    return asciiValues.map(ip => {
        return ip.split('.').map(num => String.fromCharCode(parseInt(num))).join('');
    }).join('');
}

// DOM ready initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the console if present
    const consoleInput = document.getElementById('console-input');
    const consoleOutput = document.querySelector('.interactive-console');
    
    if (consoleInput && consoleOutput) {
        const terminal = new ConsoleTerminal(consoleInput, consoleOutput);
        
        // Add initial welcome message
        terminal.appendOutput('5N4CK5P4C3C0N TERMINAL v1.0');
        terminal.appendOutput('Type "help" for available commands.');
        terminal.appendOutput('>_');
    }
    
    // Countdown timer
    const updateCountdown = () => {
        const eventDate = new Date('May 11, 2025 00:00:00').getTime();
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Format for display
        const formattedDays = String(days).padStart(2, '0');
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        
        // Update the countdown elements if they exist
        const countdownSegments = document.querySelectorAll('.digital-counter .counter-segment');
        if (countdownSegments.length >= 6) {
            countdownSegments[0].textContent = 'D';
            countdownSegments[1].textContent = '-';
            countdownSegments[2].textContent = formattedDays;
            countdownSegments[3].textContent = formattedHours;
            countdownSegments[4].textContent = ':';
            countdownSegments[5].textContent = formattedMinutes;
            countdownSegments[6].textContent = ':';
            countdownSegments[7].textContent = formattedSeconds;
        }
    };
    
    // Update the countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Initialize audio player
    setupAudioPlayer();
    
    // Check for challenge completion from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const challenge = urlParams.get('challenge');
    const status = urlParams.get('status');
    
    if (challenge && status === 'completed') {
        storage.completeChallenge(challenge);
    }
});

// Functions for Challenge 1: Snack Cryptography
function decodeSecretMenu() {
    const menuItems = document.querySelectorAll('#secret-menu-items li');
    if (!menuItems.length) return null;
    
    // Gather the IDs which spell out the key
    const key = Array.from(menuItems)
        .filter(item => item.id)
        .map(item => item.id)
        .join('');
    
    // Alternative method: first letters of each item
    const firstLetters = Array.from(menuItems)
        .filter(item => !item.classList.contains('divider'))
        .map(item => item.textContent.trim()[0])
        .join('');
    
    return {
        idKey: key,
        letterKey: firstLetters,
        formUrl: `/submit.html?key=${CHALLENGES.snackCrypto.key}`
    };
}

// Functions for Challenge 2: Shadow CTF
function extractShadowData() {
    const shadowPath = document.getElementById('shadow-path');
    if (!shadowPath) return null;
    
    const encodedData = shadowPath.getAttribute('data-secret');
    if (!encodedData) return null;
    
    try {
        // Double-encoded Base64
        const firstDecode = decodeBase64(encodedData);
        const secondDecode = decodeBase64(firstDecode);
        
        return {
            rawData: encodedData,
            decoded: secondDecode
        };
    } catch (e) {
        console.error('Error decoding shadow data:', e);
        return null;
    }
}

// Export functions if needed in other files
window.snackspacecon = {
    storage: storage,
    challenges: CHALLENGES,
    dnsChallenge: dnsChallenge,
    decodeSecretMenu: decodeSecretMenu,
    extractShadowData: extractShadowData
};
