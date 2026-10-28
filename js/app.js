/**
 * Main Application Logic for Julmi Jaat Portal
 * Features:
 * - Amazing Cinematic Entrance with Web Speech Audio & Particle FX
 * - Julmi AI Voice Assistant & Command Hub
 * - Theme Switcher & Interactive Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
  initEntranceSequence();
  initAIAssistant();
  initThemeSwitcher();
  initVehicleInteractions();

  // Initialize gallery and audio visualizer
  if (window.galleryManager) {
    window.galleryManager.init();
  }
  if (window.quotesManager) {
    window.quotesManager.init();
  }
  if (window.royalAudio) {
    window.royalAudio.setupVisualizer('beat-canvas');
    window.royalAudio.setupPlayerUI();
  }
});

/* ==========================================================================
   1. CINEMATIC ENTRANCE LOGIC
   ========================================================================== */
function initEntranceSequence() {
  const curtain = document.getElementById('entrance-curtain');
  const enterBtn = document.getElementById('enter-kingdom-btn');
  const directUploadBtn = document.getElementById('entrance-upload-btn');
  const typingEl = document.getElementById('entrance-typing-msg');
  const soundToggleBtn = document.getElementById('entrance-sound-toggle');

  const greetingMessage = "Hii Julmi Jaat, what can I help you with today?";
  let charIdx = 0;

  // Typewriter effect
  function typeGreeting() {
    if (charIdx < greetingMessage.length) {
      typingEl.textContent += greetingMessage.charAt(charIdx);
      charIdx++;
      setTimeout(typeGreeting, 55);
    } else {
      // Speak the royal greeting using Text-to-Speech
      speakRoyalGreeting();
    }
  }

  setTimeout(typeGreeting, 700);

  // Entrance Canvas Gold Embers
  const entranceCanvas = document.getElementById('entrance-canvas');
  if (entranceCanvas) {
    setupEmbersCanvas(entranceCanvas, 50);
  }

  // Enter Portal action
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      if (window.royalAudio) window.royalAudio.playEntranceBoom();
      closeEntrance();
    });
  }

  if (directUploadBtn) {
    directUploadBtn.addEventListener('click', () => {
      closeEntrance();
      setTimeout(() => {
        const fileInput = document.getElementById('photo-file-input');
        if (fileInput) fileInput.click();
      }, 500);
    });
  }

  function closeEntrance() {
    curtain.classList.add('hide');
    setTimeout(() => {
      curtain.style.display = 'none';
    }, 850);
  }
}

// Royal Speech Synthesis Greeting
function speakRoyalGreeting(text = "Hii Julmi Jaat! What can I help you with today? Hukum kijiye!") {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 0.95;
  utterance.rate = 0.98;
  utterance.volume = 1;

  // Find a deep or clear English/Hindi voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george'));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/* ==========================================================================
   2. JULMI AI ASSISTANT & VOICE COMMAND ENGINE
   ========================================================================== */
function initAIAssistant() {
  const input = document.getElementById('ai-command-input');
  const sendBtn = document.getElementById('ai-send-btn');
  const micBtn = document.getElementById('ai-mic-btn');
  const responseBox = document.getElementById('ai-response-box');
  const responseText = document.getElementById('ai-response-text');
  const speakAgainBtn = document.getElementById('ai-speak-again-btn');

  // Process user command
  function processCommand(rawQuery) {
    const query = rawQuery.trim().toLowerCase();
    if (!query) return;

    if (window.royalAudio) window.royalAudio.playClick();

    let reply = "";
    let action = null;

    if (query.includes('photo') || query.includes('image') || query.includes('गैलरी') || query.includes('फोटो') || query.includes('pic')) {
      reply = "📸 जुल्मी भाई, आपकी रॉयल फोटो गैलरी हाजिर है! आप यहां अपनी नई तस्वीरें भी अपलोड कर सकते हैं।";
      action = () => {
        document.getElementById('gallery-section').scrollIntoView({ behavior: 'smooth' });
      };
    } 
    else if (query.includes('upload') || query.includes('add') || query.includes('जोड़ो')) {
      reply = "⚡ हुक्म सर माथे! अपनी नई फोटो सेलेक्ट करने के लिए फाइल ब्राउज़र खोला जा रहा है।";
      action = () => {
        const fileInput = document.getElementById('photo-file-input');
        if (fileInput) fileInput.click();
      };
    }
    else if (query.includes('music') || query.includes('song') || query.includes('beat') || query.includes('गाना') || query.includes('बजाओ') || query.includes('chhora') || query.includes('छोरा')) {
      reply = "🎵 जुल्मी जाट का स्पेशल गाना 'जाटां का छोरा' शुरू किया जा रहा है! पूरा भौकाल टाइट रखें!";
      action = () => {
        if (window.royalAudio) window.royalAudio.toggleSong();
        document.getElementById('music-section').scrollIntoView({ behavior: 'smooth' });
      };
    }
    else if (query.includes('thar') || query.includes('थार')) {
      reply = "🚜 काली थार 4x4 का टर्बो रेव शुरू हो रहा है! रास्ता खाली कर लो!";
      action = () => {
        if (window.royalAudio) window.royalAudio.playTharRev();
      };
    }
    else if (query.includes('bullet') || query.includes('बुलेट') || query.includes('enfield')) {
      reply = "🏍️ रॉयल एनफील्ड 350 की डग-डग की आवाज सुनो भाई!";
      action = () => {
        if (window.royalAudio) window.royalAudio.playBulletThump();
      };
    }
    else if (query.includes('shayari') || query.includes('status') || query.includes('शायरी') || query.includes('स्टेटस') || query.includes('attitude')) {
      if (window.quotesManager) window.quotesManager.nextQuote();
      reply = "👑 ताज़ा जुल्मी शायरी पेश है! आप इसे स्टोरी कार्ड बनाकर भी डाउनलोड कर सकते हैं।";
      action = () => {
        document.getElementById('shayari-section').scrollIntoView({ behavior: 'smooth' });
      };
    }
    else if (query.includes('who are you') || query.includes('कौन हो') || query.includes('who is julmi')) {
      reply = "🦁 जुल्मी जाट — नाम ही काफी है! जहां खड़े हो जाएं वहीं से लाइन शुरू होती है। शाही ठाठ, बेखौफ अंदाज और यारों के यार!";
    }
    else {
      reply = `⚡ हुक्म जुल्मी जाट जी! आपने फरमाया: "${rawQuery}". आपका हर आदेश हमारे लिए सर्वोच्च है!`;
    }

    // Display Response
    if (responseText && responseBox) {
      responseText.textContent = reply;
      responseBox.style.display = 'flex';
      speakRoyalGreeting(reply);
    }

    if (action) {
      setTimeout(action, 600);
    }

    input.value = '';
  }

  if (sendBtn && input) {
    sendBtn.addEventListener('click', () => processCommand(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') processCommand(input.value);
    });
  }

  if (speakAgainBtn && responseText) {
    speakAgainBtn.addEventListener('click', () => {
      speakRoyalGreeting(responseText.textContent);
    });
  }

  // Web Speech Recognition (Mic Input)
  if (micBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'hi-IN';

      micBtn.addEventListener('click', () => {
        try {
          recognition.start();
          micBtn.classList.add('active');
        } catch (e) {
          recognition.stop();
          micBtn.classList.remove('active');
        }
      });

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        micBtn.classList.remove('active');
        input.value = transcript;
        processCommand(transcript);
      };

      recognition.onerror = () => {
        micBtn.classList.remove('active');
      };

      recognition.onend = () => {
        micBtn.classList.remove('active');
      };
    } else {
      micBtn.title = "Voice recognition not supported in this browser";
    }
  }
}

/* ==========================================================================
   3. VEHICLE INTERACTIONS (THAR & BULLET REV ENGINE)
   ========================================================================== */
function initVehicleInteractions() {
  const revTharBtn = document.getElementById('rev-thar-btn');
  const revBulletBtn = document.getElementById('rev-bullet-btn');

  if (revTharBtn) {
    revTharBtn.addEventListener('click', () => {
      if (window.royalAudio) window.royalAudio.playTharRev();
      revTharBtn.textContent = '🔥 REVVING 4x4 TURBO...';
      setTimeout(() => {
        revTharBtn.innerHTML = '⚡ REV THAR 4x4 ENGINE';
      }, 2600);
    });
  }

  if (revBulletBtn) {
    revBulletBtn.addEventListener('click', () => {
      if (window.royalAudio) window.royalAudio.playBulletThump();
      revBulletBtn.textContent = '🔊 DUG-DUG-DUG...';
      setTimeout(() => {
        revBulletBtn.innerHTML = '⚡ START BULLET 350';
      }, 2000);
    });
  }
}

/* ==========================================================================
   4. THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const themeToggle = document.getElementById('theme-toggle-btn');
  const themes = ['gold', 'crimson', 'cyber'];
  let currentThemeIdx = 0;

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      const theme = themes[currentThemeIdx];
      document.body.setAttribute('data-theme', theme);
      if (window.royalAudio) window.royalAudio.playClick();
    });
  }
}

/* ==========================================================================
   5. FLOATING GOLD PARTICLES CANVAS
   ========================================================================== */
function initParticleBackground() {
  const canvas = document.getElementById('particles-bg');
  if (canvas) {
    setupEmbersCanvas(canvas, 70);
  }
}

function setupEmbersCanvas(canvas, count) {
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.5,
      speedY: Math.random() * 0.9 + 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.3 ? '#f59e0b' : '#ef4444'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();

      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < 0) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
    });

    requestAnimationFrame(draw);
  }

  draw();
}
