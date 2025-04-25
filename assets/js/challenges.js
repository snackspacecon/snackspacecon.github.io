/**
 * SnackSpaceCon Challenges
 */

function _s1(arr) {
    return arr.map(c => String.fromCharCode(c)).join('');
}

function _s2(str, shift = 3) {
    const decoded = atob(str);
    return decoded.split('').map(char => {
        if (char.match(/[A-Za-z0-9]/)) {
            const code = char.charCodeAt(0);
            if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
                return String.fromCharCode(((code - (code <= 90 ? 65 : 97) + shift) % 26) + (code <= 90 ? 65 : 97));
            } else if (code >= 48 && code <= 57) {
                return String.fromCharCode(((code - 48 + shift) % 10) + 48);
            }
        }
        return char;
    }).join('');
}

function _s3(encoded, key = "5N4CK5P4C3") {
    const bytes = atob(encoded).split('').map(char => char.charCodeAt(0));
    const keyBytes = key.split('').map(char => char.charCodeAt(0));

    return bytes.map((byte, i) => {
        return String.fromCharCode(byte ^ keyBytes[i % keyBytes.length]);
    }).join('');
}

function _s4(str) {
    let decoded = atob(str);

    const substitution = {
        'a': 'n', 'b': 'o', 'c': 'p', 'd': 'q', 'e': 'r', 'f': 's', 'g': 't',
        'h': 'u', 'i': 'v', 'j': 'w', 'k': 'x', 'l': 'y', 'm': 'z', 'n': 'a',
        'o': 'b', 'p': 'c', 'q': 'd', 'r': 'e', 's': 'f', 't': 'g', 'u': 'h',
        'v': 'i', 'w': 'j', 'x': 'k', 'y': 'l', 'z': 'm', 'A': 'N', 'B': 'O',
        'C': 'P', 'D': 'Q', 'E': 'R', 'F': 'S', 'G': 'T', 'H': 'U', 'I': 'V',
        'J': 'W', 'K': 'X', 'L': 'Y', 'M': 'Z', 'N': 'A', 'O': 'B', 'P': 'C',
        'Q': 'D', 'R': 'E', 'S': 'F', 'T': 'G', 'U': 'H', 'V': 'I', 'W': 'J',
        'X': 'K', 'Y': 'L', 'Z': 'M', '0': '5', '1': '6', '2': '7', '3': '8',
        '4': '9', '5': '0', '6': '1', '7': '2', '8': '3', '9': '4', '-': '_',
        '_': '-'
    };

    return decoded.split('').map(char => substitution[char] || char).join('');
}

const CHALLENGES = {
    snackCrypto: {
        key: () => _s1([70, 69, 69, 68, 45, 67, 48, 68, 69, 45, 67, 65, 70, 69, 45, 49, 51, 51, 55]),
        submissionUrl: '/submit.html',
        completed: false
    },

    shadowCTF: {
        key: () => _s2("U0g0RDBXLUZMNEctWERSLTg2NzU="),
        hiddenData: 'U2VjcmV0IGtleSBmb3IgU2hhZG93IENURjogVVhCTFIxSkZRdz09',
        completed: false
    },

    dnsChallenge: {
        key: () => _s3("RVRWQVVFVldLVkl5UXpsdFNGRlJQUT09"),
        startingDomain: 'start.hunt.snackspacecon.com',
        completed: false
    },

    masterKey: {
        key: () => _s4("TlU0UEtzVTRRMGxmVUZSSFJVOVBUa3RUTlUxVE0xSWZVemxaV1ZzeVJGRXdNakE9"),
        completed: false,
        location: () => {
            const p1 = _s1([84, 104, 101, 32, 97, 98, 97, 110, 100, 111, 110, 101, 100, 32, 119, 97, 114, 101, 104, 111, 117, 115, 101, 32, 97, 116]);
            const p2 = _s2("Y29vcmRpbmF0ZXMgMzguNzc0OcKwIE4sIDkwLjY2NjHCsCBXLg==");
            const p3 = _s3("RldaelhsUWdiM1Z1SUhSb2NtOTFaMmdnZEdobElHeHZZV1JwYm1jZ1pHOWpheUJoYm1RZ1ptOXNiRzkzSUhSb1pTQmliR2x1YTJsdVp5QkZSRk11");
            return `${p1} ${p2} ${p3}`;
        }
    }
};

const _keyVerifiers = {
    verifySnackCrypto: (input) => {
        const key = CHALLENGES.snackCrypto.key();

        const inputSum = input.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const keySum = key.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

        return inputSum === keySum && input === key;
    },

    verifyShadowCTF: (input) => {
        const salt = "5n4ck";
        const key = CHALLENGES.shadowCTF.key();

        return input === key &&
        (salt + input).length === (salt + key).length;
    },

    verifyDNSChallenge: (input) => {
        const key = CHALLENGES.dnsChallenge.key();

        const hash = (str) => {
            return str.split('').reduce((hash, char, i) => {
                return ((hash << 5) - hash) + char.charCodeAt(0) + i;
            }, 0);
        };

        return hash(input) === hash(key) && input === key;
    },

    verifyMasterKey: (input) => {
        const key = CHALLENGES.masterKey.key();

        const parts = key.split('-');
        const inputParts = input.split('-');

        if (parts.length !== inputParts.length) return false;

        for (let i = 0; i < parts.length; i++) {
            if (parts[i] !== inputParts[i]) return false;
        }

        return true;
    }
};

class ChallengeStorage {
    constructor() {
        this.storageKey = 'snackspacecon_progress';
        this.progress = this.loadProgress();

        this._validateStorage();
    }

    _validateStorage() {
        const getChecksum = (obj) => {
            const str = JSON.stringify(obj);
            return str.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);
        };

        this.progress._checksum = getChecksum(this.progress.challenges);
    }

    loadProgress() {
        try {
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
        } catch (e) {
            console.error('Error loading progress:', e);
            return {
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
    }

    saveProgress() {
        this._validateStorage();
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
        this._validateStorage();
    }

    isKonamiActivated() {
        return this.progress.konami;
    }

    activateKonami() {
        this.progress.konami = true;
        this.saveProgress();
    }
}

const storage = new ChallengeStorage();

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

        this._commandAttempts = {};

        this.setupListeners();
    }

    setupListeners() {
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

    _isRateLimited(cmd) {
        const now = Date.now();
        const ratelimitCommands = ['masterkey', 'decrypt'];

        if (ratelimitCommands.includes(cmd)) {
            if (!this._commandAttempts[cmd]) {
                this._commandAttempts[cmd] = { lastAttempt: now, attempts: 1 };
                return false;
            }

            const commandData = this._commandAttempts[cmd];

            if (now - commandData.lastAttempt > 30000) {
                commandData.attempts = 1;
                commandData.lastAttempt = now;
                return false;
            }

            if (commandData.attempts >= 5) {
                return true;
            }

            commandData.attempts++;
            commandData.lastAttempt = now;
        }

        return false;
    }

    processCommand(input) {
        const parts = input.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        this.appendOutput(`> ${input}`);

        if (this._isRateLimited(cmd)) {
            this.appendOutput('RATE LIMITED: Too many attempts. Please wait 30 seconds.');
            return;
        }

        if (cmd in this.commands) {
            this.commands[cmd](args);
        } else {
            const responses = [
                'Command not found. Type "help" for available commands.',
                'Unknown command. Try "help" to see what\'s available.',
                'Error: Unrecognized input. Use "help" for command list.'
            ];
            this.appendOutput(responses[Math.floor(Math.random() * responses.length)]);
        }
    }

    appendOutput(text) {
        const outputLine = document.createElement('div');
        outputLine.textContent = text;

        if (this.outputElement) {
            this.outputElement.appendChild(outputLine);
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
            this.appendOutput(CHALLENGES.masterKey.location());
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

        if (_keyVerifiers.verifyMasterKey(attemptedKey)) {
            this.appendOutput('MASTER KEY VERIFIED!');
            this.appendOutput('ACCESS GRANTED TO ALL SYSTEMS');
            storage.completeChallenge('masterKey');

            this.appendOutput('');
            this.appendOutput('LOCATION DATA DECRYPTED:');
            this.appendOutput(CHALLENGES.masterKey.location());
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

        if (encryptedText === 'location.dat' && _keyVerifiers.verifySnackCrypto(key)) {
            this.appendOutput('Partial decryption successful.');
            this.appendOutput('Fragment revealed: "SP4CE-C0N"');
            storage.addDiscoveredHint('SP4CE-C0N');
        } else if (encryptedText === 'shadow.bin' && _keyVerifiers.verifyShadowCTF(key)) {
            this.appendOutput('Partial decryption successful.');
            this.appendOutput('Fragment revealed: "M45T3R-K3Y"');
            storage.addDiscoveredHint('M45T3R-K3Y');
        } else if (encryptedText === 'dns.dat' && _keyVerifiers.verifyDNSChallenge(key)) {
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

        if (arguments[0] && arguments[0][0] === 'confirm') {
            storage.resetProgress();
            this.appendOutput('Challenge progress has been reset.');
        }
    }
}

class DNSChallengeSimulator {
    constructor() {
        const encodedRecords = "eyIgVFhUIHJlY29yZHMiOnsic3RhcnQuaHVudC5zbmFja3NwYWNlY29uLmNvbSI6eyJUWFQiOiJCZWdpbiB5b3VyIHF1ZXN0LiBXaGF0IHR5cGUgb2YgcmVjb3JkIHBvaW50cyB0byBvdGhlciBuYW1lcz8gRm9sbG93IHRoZSBDTkFNRSBwYXRoLiJ9LCJzaXh0aC5jbHVlLnNuYWNrc3BhY2Vjb24uY29tIjp7IlRYVCI6IlRoZSBtYWlsIG11c3QgZmxvdy4gV2hvJ3MgcmVzcG9uc2libGUgZm9yIG1haWwgZXhjaGFuZ2U/In0sIm1haWwucHV6emxlLnNuYWNrc3BhY2Vjb24uY29tIjp7IlRYVCI6IlJTMVhRVk5VUlNCcGN5QnZibXg1SUhSb1pTQmlaV2RwYm01cGJtYz0ifX0sIiBDTkFNRSByZWNvcmRzIjp7InN0YXJ0Lmh1bnQuc25hY2tzcGFjZWNvbi5jb20iOnsiQ05BTUUiOiJmaXJzdC5jbHVlLnNuYWNrc3BhY2Vjb24uY29tIn0sImZpcnN0LmNsdWUuc25hY2tzcGFjZWNvbi5jb20iOnsiQ05BTUUiOiJzZWNvbmQuY2x1ZS5zbmFja3NwYWNlY29uLmNvbSJ9LCJzZWNvbmQuY2x1ZS5zbmFja3NwYWNlY29uLmNvbSI6eyJDTkFNRSI6InRoaXJkLmNsdWUuc25hY2tzcGFjZWNvbi5jb20ifSwidGhpcmQuY2x1ZS5zbmFja3NwYWNlY29uLmNvbSI6eyJDTkFNRSI6ImZvdXJ0aC5jbHVlLnNuYWNrc3BhY2Vjb24uY29tIn0sImZvdXJ0aC5jbHVlLnNuYWNrc3BhY2Vjb24uY29tIjp7IkNOQU1FIjoiZmlmdGguY2x1ZS5zbmFja3NwYWNlY29uLmNvbSJ9LCJmaWZ0aC5jbHVlLnNuYWNrc3BhY2Vjb24uY29tIjp7IkNOQU1FIjoic2l4dGguY2x1ZS5zbmFja3NwYWNlY29uLmNvbSJ9fSwiIE1YIHJlY29yZHMiOnsic2l4dGguY2x1ZS5zbmFja3NwYWNlY29uLmNvbSI6eyJNWCI6Im1haWwucHV6emxlLnNuYWNrc3BhY2Vjb24uY29tIn19LCIgQSByZWNvcmRzIjp7InBpZWNlcy5wdXp6bGUuc25hY2tzcGFjZWNvbi5jb20iOnsiQSI6WyIxOTIuODAuNzMuODIiLCI2NS42Ny44OS40NSIsIjUwLjQ4LjUwLjUzIl19fSwiIFBUUiByZWNvcmQiOnsiZS13YXN0ZS1wMXI0Y3ktMjAyNS5maW5hbC5zbmFja3NwYWNlY29uLmNvbSI6eyJQVFIiOiJFLVdBU1RFLVBDWU9QWSAyMDI1In19fQ==";

        this._getRecords = () => {
            try {
                return JSON.parse(atob(encodedRecords));
            } catch (e) {
                console.error('Error loading DNS records:', e);
                return {};
            }
        };
    }

    lookupRecord(domain, recordType) {
        const records = this._getRecords();

        let category = null;
        if (recordType === 'TXT') category = ' TXT records';
        else if (recordType === 'CNAME') category = ' CNAME records';
        else if (recordType === 'MX') category = ' MX records';
        else if (recordType === 'A') category = ' A records';
        else if (recordType === 'PTR') category = ' PTR record';

        if (!category || !records[category] || !records[category][domain]) {
            return null;
        }

        return records[category][domain][recordType];
    }

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

const dnsChallenge = new DNSChallengeSimulator();

const _debugDetection = (() => {
    let isDebuggerPresent = false;

    const startTime = performance.now();

    function checkDebugger() {
        const functionString = checkDebugger.toString();
        return functionString.length !== checkDebugger.toString().length;
    }

    const timeCheckInterval = setInterval(() => {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime > 2000 && !isDebuggerPresent) {
            isDebuggerPresent = true;
            console.warn("This challenge is designed to be solved through inspection, but direct manipulation is not part of the game. Let's play fair!");

            for (const challenge in CHALLENGES) {
                const original = CHALLENGES[challenge].key;
                CHALLENGES[challenge].key = () => {
                    if (isDebuggerPresent) {
                        return "NICE-TRY-H4CK3R-" + Math.floor(Math.random() * 10000);
                    }
                    return original();
                };
            }
        }
    }, 1000);

    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error
    };

    function checkConsoleOverrides() {
        return console.log !== originalConsole.log ||
        console.warn !== originalConsole.warn ||
        console.error !== originalConsole.error;
    }

    function hasDebugProperties() {
        return window.hasOwnProperty('Firebug') ||
        window.hasOwnProperty('__REACT_DEVTOOLS_GLOBAL_HOOK__') ||
        document.documentElement.hasAttribute('data-debug');
    }

    return {
        isPresent: () => isDebuggerPresent || checkDebugger() || checkConsoleOverrides() || hasDebugProperties(),
                         startDetection: () => {
                             setInterval(() => {
                                 if (checkDebugger() || checkConsoleOverrides() || hasDebugProperties()) {
                                     isDebuggerPresent = true;
                                 }
                             }, 2000);
                         }
    };
})();

_debugDetection.startDetection();

class KonamiCode {
    constructor(callback) {
        this._sequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65].map(code =>
        String.fromCharCode(code === 66 ? 98 : code === 65 ? 97 : code));
        this._currentIndex = 0;
        this._callback = callback;

        this._listener = this._handleKeydown.bind(this);
        document.addEventListener('keydown', this._listener);

        this._attempts = 0;
        this._lastAttempt = Date.now();
    }

    _handleKeydown(event) {
        const now = Date.now();
        if (now - this._lastAttempt > 60000) {
            this._attempts = 0;
        }

        if (++this._attempts > 100) {
            document.removeEventListener('keydown', this._listener);
            return;
        }

        this._lastAttempt = now;

        const key = event.key.toLowerCase();

        const expectedKey = this._sequence[this._currentIndex];
        const isCorrect = (key === expectedKey) ||
        (expectedKey === 'ArrowUp' && event.keyCode === 38) ||
        (expectedKey === 'ArrowDown' && event.keyCode === 40) ||
        (expectedKey === 'ArrowLeft' && event.keyCode === 37) ||
        (expectedKey === 'ArrowRight' && event.keyCode === 39);
        if (isCorrect) {
            this._currentIndex++;

            if (this._currentIndex === this._sequence.length) {
                setTimeout(() => {
                    this._callback();
                }, 500 + Math.random() * 1000);

                this._currentIndex = 0;
            }
        } else {
            if (Math.random() < 0.8) {
                this._currentIndex = 0;
            }
        }
    }
}

const konamiHandler = new KonamiCode(() => {
    if (!storage.isKonamiActivated()) {
        storage.activateKonami();

        setTimeout(() => {
            const notificationStyles = [
                'position: fixed',
                'top: 20px',
                'left: 50%',
                'transform: translateX(-50%)',
                   'background-color: rgba(0, 255, 255, 0.8)',
                   'color: black',
                   'padding: 15px',
                   'border-radius: 5px',
                   'z-index: 9999',
                   'font-family: \'VCR\', monospace',
                   'box-shadow: 0 0 10px rgba(0, 255, 255, 0.5)'
            ].join(';');

            const notification = document.createElement('div');
            notification.style = notificationStyles;
            notification.textContent = 'KONAMI CODE ACTIVATED! Master key fragment revealed: 5N4CK-H4CK';

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 1s';
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 1000);
            }, 5000);
        }, 1000);
    }
});

function decodeSecretMenu() {
    const menuItems = document.querySelectorAll('#secret-menu-items li') ||
    document.querySelectorAll('.secret-menu li') ||
    document.querySelectorAll('li[id]');

    if (!menuItems || menuItems.length === 0) return null;

    const approaches = {
        idMethod: () => {
            return Array.from(menuItems)
            .filter(item => item.id && item.id.length === 1)
            .map(item => item.id)
            .join('');
        },

        letterMethod: () => {
            return Array.from(menuItems)
            .filter(item => !item.classList.contains('divider'))
            .map(item => item.textContent.trim()[0])
            .join('');
        },

        dataMethod: () => {
            return Array.from(menuItems)
            .filter(item => item.dataset && item.dataset.key)
            .map(item => item.dataset.key)
            .join('');
        }
    };

    const idKey = approaches.idMethod();
    const letterKey = approaches.letterMethod();
    const dataKey = approaches.dataMethod();

    const keyParts = CHALLENGES.snackCrypto.key().split('-');
    const formUrl = `/submit.html?key=${keyParts.join('-')}`;

    return {
        idKey: idKey,
        letterKey: letterKey,
        dataKey: dataKey,
        formUrl: formUrl
    };
}

function extractShadowData() {
    const dataSources = [
        document.getElementById('shadow-path'),
        document.querySelector('path[data-secret]'),
        document.querySelector('svg [data-secret]')
    ];

    const validSource = dataSources.find(source => source && source.getAttribute('data-secret'));

    if (!validSource) return null;

    const encodedData = validSource.getAttribute('data-secret');
    if (!encodedData) return null;

    try {
        let decoded = '';

        if (encodedData.length % 2 === 0) {
            let stage1 = atob(encodedData);

            stage1 = stage1.split('').map(char => {
                const code = char.charCodeAt(0);
                if (code >= 65 && code <= 90) {
                    return String.fromCharCode(((code - 65 + 13) % 26) + 65);
                } else if (code >= 97 && code <= 122) {
                    return String.fromCharCode(((code - 97 + 13) % 26) + 97);
                }
                return char;
            }).join('');

            decoded = atob(stage1);
        } else {
            const parts = [];

            for (let i = 0; i < encodedData.length; i += 4) {
                parts.push(encodedData.substring(i, i + 4));
            }

            const decodedParts = parts.map(part => {
                try {
                    return atob(part.padEnd(4, '='));
                } catch (e) {
                    return part;
                }
            });

            decoded = atob(btoa(decodedParts.join('')));
        }

        return {
            rawData: encodedData,
            decoded: decoded
        };
    } catch (e) {
        console.error('Error processing shadow data:', e);

        return {
            rawData: encodedData,
            decoded: "Error: Data corrupted, but key format is: SH4D0W-FL4G-???"
        };
    }
}

function decodeBase64(str) {
    try {
        return atob(str);
    } catch (e) {
        console.error('Error decoding Base64:', e);
        return null;
    }
}

function asciiToString(asciiValues) {
    return asciiValues.map(ip => {
        return ip.split('.').map(num => String.fromCharCode(parseInt(num))).join('');
    }).join('');
}

function _decoyFunction1() {
    return "This function does nothing useful";
}

function _decoyFunction2(input) {
    return Array.from(input).reverse().join('');
}

function _decoyFunction3() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const consoleInput = document.getElementById('console-input');
        const consoleOutput = document.querySelector('.interactive-console');

        if (consoleInput && consoleOutput) {
            const terminal = new ConsoleTerminal(consoleInput, consoleOutput);

            Object.defineProperty(window.snackspacecon, 'terminal', {
                get: function() {
                    if (_debugDetection.isPresent()) {
                        const limitedTerminal = Object.create(terminal);
                        limitedTerminal.cmdMasterKey = function() {
                            this.appendOutput('Nice try! Debug mode detected.');
                        };
                        limitedTerminal.cmdDecrypt = function() {
                            this.appendOutput('Debug mode active - command disabled.');
                        };
                        return limitedTerminal;
                    }
                    return terminal;
                },
                enumerable: false,
                configurable: false
            });

            terminal.appendOutput('5N4CK5P4C3C0N TERMINAL v1.0');
            terminal.appendOutput('Type "help" for available commands.');
            terminal.appendOutput('>_');
        }
    }, 100 + Math.random() * 500);
});

window.snackspacecon = (function() {
    let _internalState = {
        initialized: false,
        accessCount: 0,
        lastAccess: Date.now()
    };

    const secureProxy = {
        snackCrypto: {
            get key() {
                _internalState.accessCount++;
                _internalState.lastAccess = Date.now();

                if (_internalState.accessCount > 10) {
                    const delay = Math.min(_internalState.accessCount * 10, 1000);
                    const startTime = Date.now();
                    while (Date.now() - startTime < delay) {
                        // Busy wait to prevent easy bypassing
                    }
                }

                return CHALLENGES.snackCrypto.key();
            },
            submissionUrl: '/submit.html'
        },
        shadowCTF: {
            get key() {
                return CHALLENGES.shadowCTF.key();
            },
            hiddenData: CHALLENGES.shadowCTF.hiddenData
        },
        dnsChallenge: {
            get key() {
                return CHALLENGES.dnsChallenge.key();
            },
            startingDomain: CHALLENGES.dnsChallenge.startingDomain
        },
        masterKey: {
            get key() {
                return CHALLENGES.masterKey.key();
            },
            get location() {
                return CHALLENGES.masterKey.location();
            }
        }
    };

    return {
        storage: storage,
        challenges: secureProxy,
        dnsChallenge: dnsChallenge,
        decodeSecretMenu: decodeSecretMenu,
        extractShadowData: extractShadowData,
        version: "1.0.0-secure",
        utils: {
            formatDate: _decoyFunction3,
                reverseString: _decoyFunction2,
                checkStatus: () => "OPERATIONAL"
        }
    };
})();

(function() {
    const functionNames = [
        '_s1', '_s2', '_s3', '_s4',
        'decodeBase64', 'asciiToString',
        '_decoyFunction1', '_decoyFunction2', '_decoyFunction3'
    ];

    functionNames.forEach(name => {
        if (typeof window[name] === 'function') {
            const newName = '_' + Math.random().toString(36).substring(2, 8);
            window[newName] = window[name];
            delete window[name];
        }
    });

    setInterval(() => {
        if (document.hidden && Math.random() < 0.1) {
            console.log("%cCONGRATULATIONS! You found a secret!", "color: #00FFFF; font-size: 16px;");
            console.log("%cThe key is: NOT-THE-REAL-KEY-KEEP-LOOKING", "color: #FF00FF;");
        }
    }, 30000);
})();
