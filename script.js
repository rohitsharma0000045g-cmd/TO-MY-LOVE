// ===== JS PART 1: IMPROVED CURSOR, TIMERS & CORE FUNCTIONALITY =====

// Global Variables
let currentPage = 1;
let valentineUnlocked = false;
let cursorTimeout;
let lastCursorTime = 0;

// Important Dates
const firstMeeting = new Date('2020-03-31');
const confessionNight = new Date('2022-12-15');
const trueLoveDate = new Date('2023-01-06');
const valentineDay = new Date('2026-02-13T00:00:00');

// ===== CHAT CONVERSATION DATA =====
const chatMessages = [
    // Initial messages
    { type: 'her', text: 'Hlo', time: '7:45 PM' },
    { type: 'her', text: 'Abe na msg na kuch', time: '7:45 PM' },
    { type: 'her', text: 'Kaha h', time: '7:45 PM' },
    { type: 'my', text: 'Ha', time: '8:12 PM' },
    { type: 'her', text: 'Kya kar rha h', time: '8:13 PM' },
    { type: 'my', text: 'Kuch nhi', time: '8:13 PM' },
    { type: 'her', text: 'Acha mujhe pta chala kuch', time: '8:14 PM' },

    // Blur section 1 - 50 messages with some photos
    { type: 'blur', count: 50, includePhotos: true },

    // Important confession messages
    { type: 'her', text: 'Kuch ni bol rhi thi ki tumko pyar ho gya mujhse esa kuch', time: '8:44 PM' },
    { type: 'my', text: 'Agar sach me ho gya ho to', time: '8:45 PM' },
    { type: 'her', text: 'Iska mujhe ni pta', time: '8:45 PM' },
    { type: 'her', text: 'Kahi sach to ni ye', time: '8:46 PM' },
    { type: 'my', text: 'Haa', time: '8:46 PM', important: true },
    { type: 'her', text: 'Meri ksm', time: '8:47 PM' },
    { type: 'my', text: 'Haa', time: '8:47 PM', important: true },


    // Blur section 2 - 30 messages
    { type: 'blur', count: 30 },

    // Final confession
    { type: 'my', text: 'I really love you', time: '9:08 PM', confession: true },

    // Blur section 3 - 10 messages
    { type: 'blur', count: 10 },

    // The moment
    { type: 'her', text: 'Love you too 😍', time: '9:17 PM', final: true }
];

// ===== IMPROVED CURSOR TRAIL EFFECT =====
const cursorTrail = document.getElementById('cursorTrail');
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;

    const currentTime = Date.now();

    // Reduced frequency: Only create heart every 150ms (less crowded)
    if (currentTime - lastCursorTime > 150) {
        lastCursorTime = currentTime;
        createCursorHeart(cursorX, cursorY);
    }
});

function createCursorHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-cursor';

    // Change cursor based on current page
    const currentPageEl = document.querySelector('.page.active');
    if (currentPageEl && currentPageEl.classList.contains('heartbreak-page')) {
        heart.textContent = '💔'; // Broken heart for sad page
    } else {
        heart.textContent = '💕'; // Regular heart for other pages
    }

    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    cursorTrail.appendChild(heart);

    // Remove after animation (2.5 seconds)
    setTimeout(() => {
        heart.remove();
    }, 2500);
}

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
    const now = new Date();
    const timeLeft = valentineDay - now;

    if (timeLeft <= 0) {
        valentineUnlocked = true;
        document.getElementById('unlockBtn').classList.remove('locked');
        document.getElementById('countdown').innerHTML = '<div class="countdown-text">Valentine\'s Day is here! 💕</div>';
        return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// ===== UNLOCK BUTTON =====
document.getElementById('unlockBtn').addEventListener('click', function () {
    if (!valentineUnlocked) {
        const waitMsg = document.getElementById('waitMessage');
        waitMsg.classList.remove('hidden');

        setTimeout(() => {
            waitMsg.classList.add('hidden');
        }, 3000);
    } else {
        nextPage(2);
    }
});

// ===== TIME AGO CALCULATOR =====
function calculateTimeAgo(dateString) {
    const targetDate = new Date(dateString);
    const now = new Date();
    const timeDiff = now - targetDate;

    const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
    const remainingAfterYears = timeDiff % (1000 * 60 * 60 * 24 * 365);
    const months = Math.floor(remainingAfterYears / (1000 * 60 * 60 * 24 * 30));
    const remainingAfterMonths = remainingAfterYears % (1000 * 60 * 60 * 24 * 30);
    const days = Math.floor(remainingAfterMonths / (1000 * 60 * 60 * 24));

    return `${years} years, ${months} months, ${days} days ago`;
}

function updateTimeAgo() {
    const timeAgoElements = document.querySelectorAll('.time-ago');

    timeAgoElements.forEach(element => {
        const dateString = element.getAttribute('data-date');
        if (dateString) {
            element.textContent = calculateTimeAgo(dateString);
        }
    });
}

// ===== PAGE NAVIGATION =====
function nextPage(pageNum) {
    const currentPageEl = document.querySelector('.page.active');
    const nextPageEl = document.getElementById(`page${pageNum}`);

    if (!nextPageEl) return;

    // Slide out current page
    currentPageEl.classList.add('slide-out-left');

    setTimeout(() => {
        currentPageEl.classList.remove('active', 'slide-out-left');
        nextPageEl.classList.add('active', 'slide-in-right');
        currentPage = pageNum;

        // Update time ago displays
        updateTimeAgo();

        // Update body class for cursor styling
        updateBodyClass(pageNum);

        // Initialize page-specific animations
        initPageAnimations(pageNum);

        setTimeout(() => {
            nextPageEl.classList.remove('slide-in-right');
        }, 500);
    }, 500);
}

// Update body class based on page
function updateBodyClass(pageNum) {
    document.body.classList.remove('sad-page');

    if (pageNum === 4) {
        document.body.classList.add('sad-page');
    }
}

// ===== PAGE-SPECIFIC ANIMATIONS =====
function initPageAnimations(pageNum) {
    switch (pageNum) {
        case 3:
            animateChatConversation();
            break;
        case 4:
            createRainEffect();
            break;
        case 8:
            initGiftBox();
            break;
        case 10:
            initLockedCard();
            break;
        case 12:
            initProposalPage();
            break;
    }
}

// ===== PAGE 3: CHAT CONVERSATION WITH PROPER SEQUENCING =====
function animateChatConversation() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = ''; // Clear any existing content
    chatContainer.scrollTop = 0;

    let currentDelay = 0;
    let messageIndex = 0;

    function addNextMessage() {
        if (messageIndex >= chatMessages.length) {
            // All messages done, add heart burst
            setTimeout(() => createHeartBurst(), 10000);
            return;
        }

        const msg = chatMessages[messageIndex];

        if (msg.type === 'blur') {
            // Add blur section
            addBlurSection(msg.count, msg.includePhotos || false, () => {
                messageIndex++;
                addNextMessage();
            });
        } else {
            // Add regular message
            const bubble = createChatBubble(msg);
            chatContainer.appendChild(bubble);

            // Trigger animation
            setTimeout(() => {
                bubble.style.opacity = '1';

                // Smooth scroll to bottom
                chatContainer.scrollTo({
                    top: chatContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }, 50);

            messageIndex++;

            // Wait before next message (slower for important messages)
            const delay = msg.important || msg.confession || msg.final ? 3200 : 2700;
            setTimeout(addNextMessage, delay);
        }
    }

    // Start the sequence
    addNextMessage();
}

function createChatBubble(msg) {
    const bubble = document.createElement('div');

    if (msg.type === 'my') {
        bubble.className = 'chat-bubble my-message';
    } else {
        bubble.className = 'chat-bubble her-message';
    }

    // Add special classes
    if (msg.important) bubble.classList.add('important-message');
    if (msg.confession) bubble.classList.add('final-confession');
    if (msg.final) {
        bubble.classList.add('final-message');
        // Add heart burst container
        const heartBurst = document.createElement('div');
        heartBurst.className = 'heart-burst';
        bubble.appendChild(heartBurst);
    }

    const content = document.createElement('div');
    content.className = 'bubble-content';
    content.textContent = msg.text;

    const time = document.createElement('div');
    time.className = 'bubble-time';
    time.textContent = msg.time;

    bubble.appendChild(content);
    bubble.appendChild(time);

    return bubble;
}

function addBlurSection(count, includePhotos, callback) {
    const chatContainer = document.getElementById('chatContainer');
    let added = 0;

    const addBlurMessage = () => {
        if (added >= count) {
            // Blur section complete
            if (callback) callback();
            return;
        }

        const bubble = document.createElement('div');

        // Alternate between my and her messages
        const isMy = added % 2 === 0;
        bubble.className = isMy ? 'blur-bubble blur-my-message' : 'blur-bubble blur-her-message';

        // Add photos occasionally if includePhotos is true
        if (includePhotos && added % 7 === 0) {
            bubble.classList.add('blur-photo');
            bubble.innerHTML = '<div class="blur-content"></div>';
        } else {
            bubble.innerHTML = '<div class="blur-content">Lorem ipsum dolor sit</div>';
        }

        chatContainer.appendChild(bubble);

        // Fast scroll
        chatContainer.scrollTop = chatContainer.scrollHeight;

        added++;

        // Continue adding blur messages quickly
        setTimeout(addBlurMessage, 25); // Very fast - 25ms between blur messages
    };

    addBlurMessage();
}

function createHeartBurst() {
    const finalBubble = document.querySelector('.final-message');
    if (!finalBubble) return;

    const chatContainer = document.getElementById('chatContainer');
    const burstContainer = finalBubble.querySelector('.heart-burst');

    // Scroll to final message slowly
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
    });

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('span');
            heart.textContent = '💕';
            heart.style.position = 'absolute';
            heart.style.fontSize = '2.5rem';
            heart.style.left = '50%';
            heart.style.top = '0';
            heart.style.animation = `burstOut ${1 + Math.random() * 0.5}s ease-out forwards`;
            heart.style.animationDelay = `${i * 0.1}s`;
            heart.style.transform = `translate(-50%, 0) rotate(${i * 24}deg)`;
            heart.style.pointerEvents = 'none';
            burstContainer.appendChild(heart);

            setTimeout(() => heart.remove(), 2000);
        }, i * 100);
    }
}

// Add burst animation dynamically
const burstStyle = document.createElement('style');
burstStyle.textContent = `
    @keyframes burstOut {
        0% {
            transform: translate(-50%, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -100px) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(burstStyle);

// ===== PAGE 4: RAIN EFFECT =====
function createRainEffect() {
    const rainContainer = document.querySelector('.rain-container');
    rainContainer.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.width = '2px';
        drop.style.height = '100px';
        drop.style.background = 'linear-gradient(transparent, rgba(255, 255, 255, 0.6))';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animation = `rain ${2 + Math.random() * 2}s linear infinite`;
        drop.style.animationDelay = Math.random() * 2 + 's';
        rainContainer.appendChild(drop);
    }
}

// Add rain animation
const rainStyle = document.createElement('style');
rainStyle.textContent = `
    @keyframes rain {
        0% { transform: translateY(-100px); }
        100% { transform: translateY(100vh); }
    }
`;
document.head.appendChild(rainStyle);

// ===== PAGE 8: GIFT BOX =====
function initGiftBox() {
    const giftBox = document.getElementById('giftBox');
    const mangalsutra = giftBox.querySelector('.mangalsutra');

    giftBox.addEventListener('click', () => {
        giftBox.classList.add('opened');
        mangalsutra.classList.remove('hidden');

        // Golden sparkle effect
        createSparkles(giftBox);
    });
}

function createSparkles(container) {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.textContent = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.fontSize = '1.5rem';
            sparkle.style.left = '50%';
            sparkle.style.top = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.animation = `sparkleOut ${1 + Math.random() * 0.5}s ease-out forwards`;
            sparkle.style.transform = `translate(-50%, -50%) rotate(${i * 18}deg)`;
            container.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 1500);
        }, i * 50);
    }
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleOut {
        to {
            transform: translate(-50%, -50%) translateY(-80px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// ===== PAGE 10: LOCKED CARD =====
function initLockedCard() {
    const lockContainer = document.getElementById('lockContainer');
    const unlockedContent = document.getElementById('unlockedContent');

    lockContainer.addEventListener('click', () => {
        lockContainer.classList.add('hidden');
        unlockedContent.classList.remove('hidden');

        // Create rose petals
        createRosePetals();
    });
}

function createRosePetals() {
    const petalsContainer = document.querySelector('.rose-petals');

    const petalInterval = setInterval(() => {
        const petal = document.createElement('div');
        petal.textContent = '🌹';
        petal.style.position = 'absolute';
        petal.style.fontSize = '2rem';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.top = '-50px';
        petal.style.animation = 'petalFall 4s linear forwards';
        petalsContainer.appendChild(petal);

        setTimeout(() => petal.remove(), 4000);
    }, 500);

    // Stop after 10 seconds
    setTimeout(() => clearInterval(petalInterval), 10000);
}

// Add petal fall animation
const petalStyle = document.createElement('style');
petalStyle.textContent = `
    @keyframes petalFall {
        0% {
            top: -50px;
            opacity: 1;
            transform: rotate(0deg);
        }
        100% {
            top: 100%;
            opacity: 0;
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(petalStyle);

// ===== JS PART 2: PROPOSAL PAGE, EASTER EGGS & MOBILE =====

// ===== PAGE 12: PROPOSAL PAGE =====
function initProposalPage() {
    // Animate roses appearing one by one
    setTimeout(() => {
        animateRoses();
    }, 500);

    // Initialize No button behavior
    setTimeout(() => {
        initNoButton();
    }, 5000);
}

// Animate 10 roses appearing
function animateRoses() {
    const rosesContainer = document.getElementById('rosesContainer');
    rosesContainer.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const rose = document.createElement('div');
            rose.className = 'rose';
            rose.textContent = '🌹';
            rose.style.animationDelay = '0s';
            rosesContainer.appendChild(rose);
        }, i * 300);
    }
}

// ===== NO BUTTON - RUNNING AWAY EFFECT =====
function initNoButton() {
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');

    let attempts = 0;
    const messages = [
        "Are you sure? 🥺",
        "Really? 💔",
        "Think again... 😢",
        "Please? 🙏",
        "Pretty please? 💕",
        "I'll disappear! 👻"
    ];

    noBtn.addEventListener('mouseenter', () => {
        attempts++;

        // Change button text
        if (attempts < messages.length) {
            noBtn.textContent = messages[attempts - 1];
        }

        // Move button to random position
        const container = document.querySelector('.proposal-container');
        const containerRect = container.getBoundingClientRect();

        const maxX = containerRect.width - noBtn.offsetWidth - 50;
        const maxY = containerRect.height - noBtn.offsetHeight - 50;

        const randomX = Math.floor(Math.random() * Math.max(maxX, 100));
        const randomY = Math.floor(Math.random() * Math.max(maxY, 100));

        noBtn.style.position = 'absolute';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
        noBtn.style.transition = 'all 0.3s ease';

        // After 6 attempts, make it disappear
        if (attempts >= 6) {
            noBtn.style.opacity = '0';
            noBtn.style.transform = 'scale(0)';

            setTimeout(() => {
                noBtn.style.display = 'none';

                // Show message
                const msg = document.createElement('div');
                msg.textContent = "I knew you'd say YES! 💕";
                msg.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 2rem;
                    color: #FFD700;
                    font-weight: 700;
                    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
                    z-index: 1000;
                    animation: fadeIn 1s ease-out;
                    background: rgba(0, 0, 0, 0.5);
                    padding: 20px 40px;
                    border-radius: 20px;
                `;
                document.body.appendChild(msg);

                setTimeout(() => msg.remove(), 3000);
            }, 300);
        }
    });

    // For mobile - also trigger on click
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        noBtn.dispatchEvent(new Event('mouseenter'));
    });

    // YES BUTTON - CELEBRATION
    yesBtn.addEventListener('click', () => {
        startCelebration();
    });
}

// ===== CELEBRATION EFFECTS =====
function startCelebration() {
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');

    // Create fireworks
    createFireworks();

    // Create confetti
    createConfetti();

    // Create floating hearts
    createFloatingHearts();

    // Show love letter after 2 seconds
    setTimeout(() => {
        showLoveLetter();
    }, 2000);
}

// Fireworks effect
function createFireworks() {
    const fireworks = document.querySelector('.fireworks');

    const colors = ['#ff0844', '#ff6b9d', '#FFD700', '#FF69B4', '#FFA500'];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;

            for (let j = 0; j < 8; j++) {
                const firework = document.createElement('div');
                firework.style.cssText = `
                    position: absolute;
                    left: ${x}%;
                    top: ${y}%;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    animation: explode 1s ease-out forwards;
                    transform: rotate(${j * 45}deg);
                `;
                fireworks.appendChild(firework);

                setTimeout(() => firework.remove(), 1000);
            }
        }, i * 300);
    }
}

// Add explode animation
const explodeStyle = document.createElement('style');
explodeStyle.textContent = `
    @keyframes explode {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--x, 100px), var(--y, 100px)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(explodeStyle);

// Confetti effect
function createConfetti() {
    const confetti = document.querySelector('.confetti');

    const colors = ['#ff0844', '#ff6b9d', '#FFD700', '#FF69B4', '#FFA500', '#FF1493', '#FF6347'];

    for (let i = 0; i < 100; i++) {
        const piece = document.createElement('div');
        piece.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confettiFall ${3 + Math.random() * 2}s linear forwards;
            animation-delay: ${Math.random() * 3}s;
        `;
        confetti.appendChild(piece);

        setTimeout(() => piece.remove(), 6000);
    }
}

// Add confetti fall animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(${Math.random() * 720}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Floating hearts upward
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts-up');

    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                bottom: -50px;
                font-size: ${1.5 + Math.random() * 1.5}rem;
                animation: floatUp 3s ease-out forwards;
            `;
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heartsContainer.appendChild(heart);

            setTimeout(() => heart.remove(), 3000);
        }, i * 100);
    }
}

// Add float up animation
const floatUpStyle = document.createElement('style');
floatUpStyle.textContent = `
    @keyframes floatUp {
        to {
            bottom: 100vh;
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatUpStyle);

// ===== LOVE LETTER =====
function showLoveLetter() {
    const loveLetter = document.getElementById('loveLetter');
    const envelope = document.getElementById('envelope');
    const letter = document.getElementById('letter');
    const finalCounter = document.getElementById('finalCounter');

    loveLetter.classList.remove('hidden');

    // Click envelope to open
    envelope.addEventListener('click', () => {
        envelope.classList.add('opened');

        setTimeout(() => {
            envelope.style.display = 'none';
            letter.classList.remove('hidden');

            // Show final counter after letter
            setTimeout(() => {
                finalCounter.classList.remove('hidden');
                calculateFinalStats();
            }, 2000);
        }, 800);
    });
}

// Calculate final statistics
function calculateFinalStats() {
    const now = new Date();
    const timeDiff = now - firstMeeting;

    const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));

    // Calculate heartbeats (assuming 70 bpm average)
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));
    const heartbeats = totalMinutes * 70;

    // Animated counting
    animateCounter('yearsCount', years);
    animateCounter('monthsCount', months);
    animateCounter('daysCount', days);
    animateCounter('heartbeatsCount', heartbeats, true);
}

function animateCounter(elementId, targetValue, isLarge = false) {
    const element = document.getElementById(elementId);
    let current = 0;
    const duration = 2000;
    const steps = 100;
    const stepValue = Math.ceil(targetValue / steps);

    const interval = setInterval(() => {
        current += stepValue;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(interval);
        }
        element.textContent = isLarge ? current.toLocaleString() : current;
    }, duration / steps);
}

// ===== EASTER EGGS =====

// Easter Egg 1: Double-click on hearts
document.addEventListener('dblclick', (e) => {
    if (e.target.textContent && (e.target.textContent.includes('❤️') || e.target.textContent.includes('💕'))) {
        showEasterEggMessage("You found a secret! Double the love! 💕💕");
    }
});

// Easter Egg 2: Type "DIKSHA"
let typedSequence = '';
const secretWord = 'DIKSHA';

document.addEventListener('keypress', (e) => {
    typedSequence += e.key.toUpperCase();

    if (typedSequence.length > secretWord.length) {
        typedSequence = typedSequence.slice(-secretWord.length);
    }

    if (typedSequence === secretWord) {
        triggerDikshaAnimation();
        typedSequence = '';
    }
});

function triggerDikshaAnimation() {
    showEasterEggMessage("Diksha is the most beautiful name! 💖");

    // Create massive heart explosion
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '💖';
            heart.style.cssText = `
                position: fixed;
                left: 50%;
                top: 50%;
                font-size: 3rem;
                pointer-events: none;
                z-index: 9999;
                animation: explodeHeart ${1 + Math.random()}s ease-out forwards;
            `;
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 2000);
        }, i * 50);
    }
}

// Add explode heart animation
const explodeHeartStyle = document.createElement('style');
explodeHeartStyle.textContent = `
    @keyframes explodeHeart {
        to {
            transform: translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px) 
                       rotate(${Math.random() * 720}deg) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(explodeHeartStyle);

function showEasterEggMessage(message) {
    const msgEl = document.getElementById('easterEggMessage');
    msgEl.textContent = message;
    msgEl.classList.remove('hidden');

    setTimeout(() => {
        msgEl.classList.add('hidden');
    }, 3000);
}

// ===== SWIPE GESTURE FOR MOBILE =====
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next page
        if (currentPage < 12) {
            nextPage(currentPage + 1);
        }
    }

    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous page
        if (currentPage > 1) {
            nextPage(currentPage - 1);
        }
    }
}

// ===== SHAKE DETECTION FOR MOBILE =====
if (window.DeviceMotionEvent) {
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeThreshold = 15;

    window.addEventListener('devicemotion', (e) => {
        const acc = e.accelerationIncludingGravity;
        if (!acc) return;

        const deltaX = Math.abs(acc.x - lastX);
        const deltaY = Math.abs(acc.y - lastY);
        const deltaZ = Math.abs(acc.z - lastZ);

        if (deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold) {
            createHeartsRain();
        }

        lastX = acc.x;
        lastY = acc.y;
        lastZ = acc.z;
    });
}

function createHeartsRain() {
    const secretHearts = document.getElementById('secretHearts');

    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.style.cssText = `
            position: absolute;
            font-size: 2rem;
            left: ${Math.random() * 100}%;
            top: -50px;
            animation: secretHeartFall 3s ease-out forwards;
            animation-delay: ${Math.random() * 1}s;
        `;
        heart.textContent = ['❤️', '💕', '💖', '💗'][Math.floor(Math.random() * 4)];
        secretHearts.appendChild(heart);

        setTimeout(() => heart.remove(), 4000);
    }
}

// Add secret heart fall animation
const secretHeartStyle = document.createElement('style');
secretHeartStyle.textContent = `
    @keyframes secretHeartFall {
        0% {
            top: -50px;
            opacity: 1;
        }
        100% {
            top: 100vh;
            opacity: 0;
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(secretHeartStyle);

// ===== FLOATING HEARTS BACKGROUND (PAGE 1) =====
function createFloatingHeartsBackground() {
    const container = document.querySelector('#page1 .floating-hearts');
    if (!container) return;

    setInterval(() => {
        const heart = document.createElement('div');
        heart.textContent = ['💕', '❤️', '💖', '💗'][Math.floor(Math.random() * 4)];
        heart.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            bottom: -50px;
            font-size: ${20 + Math.random() * 20}px;
            animation: floatBackground ${8 + Math.random() * 4}s linear forwards;
            pointer-events: none;
        `;
        container.appendChild(heart);

        setTimeout(() => heart.remove(), 12000);
    }, 800);
}

// Add float background animation
const floatBackgroundStyle = document.createElement('style');
floatBackgroundStyle.textContent = `
    @keyframes floatBackground {
        0% {
            bottom: -50px;
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            bottom: 100vh;
            opacity: 0;
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(floatBackgroundStyle);

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('💕 Valentine Website Loaded! 💕');
    console.log('Made with infinite love for Diksha ∞');

    // Start floating hearts on page 1
    createFloatingHeartsBackground();

    // Update time ago on page 1 load
    updateTimeAgo();
});

// Smooth scroll
document.documentElement.style.scrollBehavior = 'smooth';