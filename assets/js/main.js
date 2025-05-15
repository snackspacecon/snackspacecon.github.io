/**
 * Main JavaScript for SnackSpaceCon
 * Handles general site functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Typewriter effect
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.width = '0';
        
        let i = 0;
        const typeSpeed = 50; // milliseconds per character
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                element.style.borderRight = 'none';
            }
        }
        
        setTimeout(typeWriter, 1000); // Start after 1 second
    });
    
    // Interactive console simulation
    const consoleLines = [
        "Establishing peer connection...",
        "Scanning for unauthorized monitoring...",
        "Connection secured via obfuscated channel",
        "Waiting for other nodes... Errant Packet detected...",
        "Bring your own tools",
        "Expect the unexpected",
        "Trust verification required",
        ">_"
    ];
    
    const consoleElement = document.querySelector('.interactive-console');
    
    if (consoleElement) {
        consoleElement.innerHTML = '';
        
        let lineIndex = 0;
        const lineDelay = 700; // milliseconds between lines
        
        function appendConsoleLine() {
            if (lineIndex < consoleLines.length) {
                const line = document.createElement('div');
                line.textContent = consoleLines[lineIndex];
                
                consoleElement.appendChild(line);
                consoleElement.scrollTop = consoleElement.scrollHeight;
                
                lineIndex++;
                setTimeout(appendConsoleLine, lineDelay);
            }
        }
        
        setTimeout(appendConsoleLine, 1000); // Start after 1 second
    }
    
    // Add hover effects to menu items
    const menuItems = document.querySelectorAll('li');
    menuItems.forEach(item => {
        item.addEventListener('mouseover', function() {
            this.style.color = '#ff00ff';
            this.style.textShadow = '0 0 5px #ff00ff';
        });
        
        item.addEventListener('mouseout', function() {
            this.style.color = '';
            this.style.textShadow = 'none';
        });
    });
    
    // Make the badge effects interactive
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.addEventListener('mouseover', function() {
            this.style.color = '#ff00ff';
            this.style.borderColor = '#ff00ff';
        });
        
        badge.addEventListener('mouseout', function() {
            this.style.color = '';
            this.style.borderColor = '';
        });
    });
    
    // Add some subtle random glitch effects to glitchy elements
    const glitchyElements = document.querySelectorAll('.glitchy-text');
    
    function applyRandomGlitch() {
        glitchyElements.forEach(element => {
            // Only apply glitch with 10% probability each time
            if (Math.random() < 0.1) {
                // Apply a random transform
                const glitchX = (Math.random() * 4 - 2) + 'px';
                const glitchY = (Math.random() * 4 - 2) + 'px';
                
                element.style.transform = `translate(${glitchX}, ${glitchY})`;
                
                // Reset after a short time
                setTimeout(() => {
                    element.style.transform = 'none';
                }, 100);
            }
        });
        
        // Schedule next glitch
        setTimeout(applyRandomGlitch, 2000 + Math.random() * 3000);
    }
    
    // Start the glitch effect
    setTimeout(applyRandomGlitch, 3000);
    
    // Handle the console input
    const consoleInput = document.getElementById('console-input');
    
    if (consoleInput) {
        consoleInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim();
                
                if (command) {
                    // If we have challenges.js loaded, use its console terminal
                    if (window.snackspacecon && window.snackspacecon.terminal) {
                        // Use the terminal from challenges.js
                        window.snackspacecon.terminal.processCommand(command);
                    } else {
                        // Simple fallback if challenges.js isn't loaded
                        const outputElement = document.querySelector('.interactive-console');
                        
                        if (outputElement) {
                            const line = document.createElement('div');
                            line.textContent = '> ' + command;
                            outputElement.appendChild(line);
                            
                            const responseLine = document.createElement('div');
                            
                            // Very basic command responses
                            switch(command.toLowerCase()) {
                                case 'help':
                                    responseLine.textContent = 'Available commands: help, date, location, challenge, snack';
                                    break;
                                case 'date':
                                    responseLine.textContent = 'SNACKSPACECON DATES: MAY 11-15, 2025';
                                    break;
                                case 'location':
                                    responseLine.textContent = 'ACCESS DENIED: Authorization required.';
                                    break;
                                default:
                                    responseLine.textContent = 'Command not recognized. Type "help" for available commands.';
                            }
                            
                            outputElement.appendChild(responseLine);
                            outputElement.scrollTop = outputElement.scrollHeight;
                        }
                    }
                    
                    // Clear the input
                    this.value = '';
                }
            }
        });
    }
    
    // Setup countdown timer
    function updateCountdown() {
        const countdownElement = document.querySelector('.digital-counter');
        if (!countdownElement) return;
        
        const eventDate = new Date('May 11, 2025 00:00:00').getTime();
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        if (distance < 0) {
            // Event has started
            countdownElement.innerHTML = `
                <div class="counter-segment">E</div>
                <div class="counter-segment">V</div>
                <div class="counter-segment">E</div>
                <div class="counter-segment">N</div>
                <div class="counter-segment">T</div>
                <div class="counter-segment">></div>
                <div class="counter-segment">A</div>
                <div class="counter-segment">C</div>
                <div class="counter-segment">T</div>
                <div class="counter-segment">I</div>
                <div class="counter-segment">V</div>
                <div class="counter-segment">E</div>
            `;
            return;
        }
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Format as two digits
        const daysStr = days.toString().padStart(2, '0');
        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        
        // Update the countdown display
        countdownElement.innerHTML = `
            <div class="counter-segment">D</div>
            <div class="counter-segment">-</div>
            <div class="counter-segment">${daysStr[0]}</div>
            <div class="counter-segment">${daysStr[1]}</div>
            <div class="counter-segment">:</div>
            <div class="counter-segment">${hoursStr[0]}</div>
            <div class="counter-segment">${hoursStr[1]}</div>
            <div class="counter-segment">:</div>
            <div class="counter-segment">${minutesStr[0]}</div>
            <div class="counter-segment">${minutesStr[1]}</div>
            <div class="counter-segment">:</div>
            <div class="counter-segment">${secondsStr[0]}</div>
            <div class="counter-segment">${secondsStr[1]}</div>
        `;
    }
    
    // Update countdown immediately
    updateCountdown();
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    
    // ==========================================
    // UPDATED AUDIO PLAYER FOR LOCAL FILES
    // ==========================================
    function setupAudioPlayer() {
        const toggleButton = document.getElementById('toggle-audio');
        const nextTrackButton = document.getElementById('next-track');
        const volumeSlider = document.getElementById('volume-slider');
        const audioElement = document.getElementById('background-music');
        const miniPlayer = document.getElementById('mini-player');
        const audioPlayer = document.getElementById('audio-player');
        
        if (!toggleButton || !audioElement) return;
        
        // Updated audio tracks with locally hosted files
        const tracks = [
            {
                name: '5N4CK_TUN3',
                url: 'assets/Arcade-Puzzler.mp3'
            },
            {
                name: 'P1X3L_T0WN',
                url: 'assets/Lifes-Good-in-Pixeltown.mp3'
            },
            {
                name: 'SP4C3LY_B34T',
                url: 'assets/Spiff-Spacely.mp3'
            }
        ];
        
        let currentTrackIndex = 0;
        
        // Ensure the audio element has the correct initial source
        audioElement.src = tracks[currentTrackIndex].url;
        
        // Set preload attribute for better performance
        audioElement.preload = 'auto';
        
        // Toggle play/pause with proper error handling
        toggleButton.addEventListener('click', function() {
            if (audioElement.paused) {
                // Make sure we have the right track loaded
                audioElement.src = tracks[currentTrackIndex].url;
                audioElement.load();
                
                // Try to play with error handling
                const playPromise = audioElement.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Playback started successfully
                        this.textContent = 'PAUSE ' + tracks[currentTrackIndex].name;
                    }).catch(error => {
                        // Playback failed
                        console.error('Error playing audio:', error);
                        this.textContent = 'PLAY ' + tracks[currentTrackIndex].name;
                        
                        // Log detailed error information
                        if (error.name) console.error('Error name:', error.name);
                        if (error.message) console.error('Error message:', error.message);
                        
                        // You could show a user-friendly message here if needed
                        // alert('Audio playback is not available. Please check your browser settings.');
                    });
                }
            } else {
                // Just pause if already playing
                audioElement.pause();
                this.textContent = 'PLAY ' + tracks[currentTrackIndex].name;
            }
        });
        
        // Next track with improved error handling
        if (nextTrackButton) {
            nextTrackButton.addEventListener('click', function() {
                // Move to the next track
                currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
                
                // Update the source and load
                audioElement.src = tracks[currentTrackIndex].url;
                audioElement.load();
                
                // Update button text
                toggleButton.textContent = audioElement.paused ? 
                    'PLAY ' + tracks[currentTrackIndex].name : 
                    'PAUSE ' + tracks[currentTrackIndex].name;
                
                // If we were already playing, continue with the new track
                if (!audioElement.paused) {
                    const playPromise = audioElement.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error('Error playing after track change:', error);
                            toggleButton.textContent = 'PLAY ' + tracks[currentTrackIndex].name;
                        });
                    }
                }
            });
        }
        
        // Volume control
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                audioElement.volume = this.value;
            });
            
            // Set initial volume from slider
            audioElement.volume = volumeSlider.value;
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
            
            minimizeButton.addEventListener('click', function() {
                audioPlayer.style.display = 'none';
                miniPlayer.style.display = 'flex';
            });
            
            miniPlayer.addEventListener('click', function() {
                miniPlayer.style.display = 'none';
                audioPlayer.style.display = 'flex';
            });
        }
        
        // Error handling for audio element
        audioElement.addEventListener('error', function(e) {
            console.error('Audio error:', e);
            if (audioElement.error) {
                console.error('Audio error code:', audioElement.error.code);
                console.error('Audio error message:', audioElement.error.message || 'No error message available');
            }
            
            // Try to recover by reloading after a delay
            setTimeout(() => {
                audioElement.load();
                // Update UI to show playback failed
                if (toggleButton) {
                    toggleButton.textContent = 'PLAY ' + tracks[currentTrackIndex].name;
                }
            }, 1000);
        });
        
        // Load the audio initially
        try {
            audioElement.load();
        } catch (e) {
            console.error('Initial audio load failed:', e);
        }
    }
    
    // Initialize audio player
    setupAudioPlayer();
    
    // Initialize challenges.js functionality if available
    if (window.snackspacecon) {
        console.log('SnackSpaceCon challenge system initialized');
        
        // Initialize the console terminal if challenge system is loaded
        const consoleInput = document.getElementById('console-input');
        const consoleOutput = document.querySelector('.interactive-console');
        
        if (consoleInput && consoleOutput && typeof ConsoleTerminal === 'function') {
            // Create a new terminal instance and assign it to window.snackspacecon
            const terminal = new ConsoleTerminal(consoleInput, consoleOutput);
            window.snackspacecon.terminal = terminal;
            
            // Add initial welcome message
            terminal.appendOutput('5N4CK5P4C3C0N TERMINAL v1.0');
            terminal.appendOutput('Type "help" for available commands.');
            terminal.appendOutput('>_');
        }
    }
    
    // Handle hidden hint on text selection
    document.addEventListener('selectionchange', function() {
        const selection = window.getSelection();
        if (selection.toString().length > 100) {
            console.log("Hint: Sometimes the first letters spell out the answer");
        }
    });
    
    // Easter egg - clicking items in a specific order
    let clickSequence = [];
    const secretSequence = ['F', 'E', 'E', 'D', 'C', '0', 'D', 'E'];
    
    document.addEventListener('click', function(event) {
        // Check if the clicked element has an ID that's a single character
        const id = event.target.id;
        if (id && id.length === 1) {
            clickSequence.push(id);
            
            // Check if the sequence matches our secret
            if (clickSequence.length > secretSequence.length) {
                clickSequence.shift(); // Remove the oldest click
            }
            
            if (clickSequence.length === secretSequence.length) {
                const sequenceMatches = clickSequence.every((char, index) => 
                    char === secretSequence[index]
                );
                
                if (sequenceMatches) {
                    console.log("Sequence unlocked! Check out /submit?key=FEED-C0DE-CAFE-1337");
                    
                    // Visual feedback
                    const flash = document.createElement('div');
                    flash.style.position = 'fixed';
                    flash.style.top = '0';
                    flash.style.left = '0';
                    flash.style.width = '100%';
                    flash.style.height = '100%';
                    flash.style.backgroundColor = '#FF00FF';
                    flash.style.opacity = '0.3';
                    flash.style.zIndex = '9999';
                    flash.style.pointerEvents = 'none';
                    document.body.appendChild(flash);
                    
                    setTimeout(() => {
                        document.body.removeChild(flash);
                    }, 300);
                }
            }
        }
    });
});
