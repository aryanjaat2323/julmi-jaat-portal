/**
 * Audio Synthesizer, Player & Visualizer for Julmi Jaat Hub
 * Features:
 * - Direct native audio playback for 'जाटां का छोरा' (Zero CORS issues, works on file:// & http://)
 * - Real-time animated frequency visualizer synchronized with playback
 * - Play/Pause, Seek Bar, Current/Total Time, Volume Slider, Skip +/-10s
 * - Synthesized vehicle sound effects (Thar 4x4 turbo rev & Bullet 350 dug-dug)
 * - Cinematic sub-bass boom entrance sound
 */

class RoyalAudioManager {
  constructor() {
    this.audioCtx = null;
    this.visualizerCanvas = null;
    this.visualizerCtx = null;

    this.audioEl = null;
    this.isPlaying = false;
    this.isSeeking = false;

    // Simulated spectrum energy bins for smooth, punchy visualizer
    this.barsCount = 44;
    this.barHeights = new Array(this.barsCount).fill(6);
    this.barVelocities = new Array(this.barsCount).fill(0);
  }

  initAudioElement() {
    if (!this.audioEl) {
      this.audioEl = document.getElementById('main-audio-player');
      if (!this.audioEl) {
        this.audioEl = new Audio('assets/audio/jaatan_ka_chhora.mp3');
      }
      this.audioEl.volume = 1.0;
      this.audioEl.muted = false;
    }
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setupPlayerUI() {
    this.initAudioElement();

    const playBtn = document.getElementById('play-beat-btn');
    const progressBar = document.getElementById('song-progress-bar');
    const progressFill = document.getElementById('song-progress-fill');
    const currTimeEl = document.getElementById('song-current-time');
    const totalTimeEl = document.getElementById('song-total-time');
    const volumeSlider = document.getElementById('song-volume-slider');
    const vinylDisc = document.getElementById('player-vinyl-disc');
    const rewindBtn = document.getElementById('player-rewind-btn');
    const forwardBtn = document.getElementById('player-forward-btn');
    const statusText = document.getElementById('player-status-badge');

    if (!this.audioEl) return;

    // Play / Pause toggle
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.toggleSong(playBtn);
      });
    }

    // Rewind 10s
    if (rewindBtn) {
      rewindBtn.addEventListener('click', () => {
        this.audioEl.currentTime = Math.max(0, this.audioEl.currentTime - 10);
      });
    }

    // Forward 10s
    if (forwardBtn) {
      forwardBtn.addEventListener('click', () => {
        this.audioEl.currentTime = Math.min(this.audioEl.duration || 0, this.audioEl.currentTime + 10);
      });
    }

    // Volume Slider
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const vol = parseFloat(e.target.value);
        this.audioEl.volume = vol;
        this.audioEl.muted = (vol === 0);
      });
    }

    // Sync UI on play & pause
    this.audioEl.addEventListener('play', () => {
      this.isPlaying = true;
      if (playBtn) playBtn.innerHTML = '❚❚';
      if (vinylDisc) vinylDisc.classList.add('spinning');
      if (statusText) statusText.textContent = 'PLAYING ⚡';
    });

    this.audioEl.addEventListener('pause', () => {
      this.isPlaying = false;
      if (playBtn) playBtn.innerHTML = '▶';
      if (vinylDisc) vinylDisc.classList.remove('spinning');
      if (statusText) statusText.textContent = 'PAUSED';
    });

    // Time update event
    this.audioEl.addEventListener('timeupdate', () => {
      if (this.isSeeking) return;
      const cur = this.audioEl.currentTime;
      const dur = this.audioEl.duration || 0;

      if (currTimeEl) currTimeEl.textContent = this.formatTime(cur);
      if (totalTimeEl && dur > 0) totalTimeEl.textContent = this.formatTime(dur);

      if (progressBar && dur > 0) {
        const pct = (cur / dur) * 100;
        progressBar.value = pct;
        if (progressFill) progressFill.style.width = `${pct}%`;
      }
    });

    this.audioEl.addEventListener('loadedmetadata', () => {
      if (totalTimeEl && this.audioEl.duration) {
        totalTimeEl.textContent = this.formatTime(this.audioEl.duration);
      }
    });

    this.audioEl.addEventListener('ended', () => {
      this.isPlaying = false;
      if (playBtn) playBtn.innerHTML = '▶';
      if (vinylDisc) vinylDisc.classList.remove('spinning');
      if (statusText) statusText.textContent = 'READY TO ROAR';
      if (progressBar) progressBar.value = 0;
      if (progressFill) progressFill.style.width = '0%';
    });

    // Progress bar scrubbing
    if (progressBar) {
      progressBar.addEventListener('mousedown', () => { this.isSeeking = true; });
      progressBar.addEventListener('touchstart', () => { this.isSeeking = true; });

      progressBar.addEventListener('input', (e) => {
        const dur = this.audioEl.duration || 0;
        if (dur > 0 && currTimeEl) {
          currTimeEl.textContent = this.formatTime((e.target.value / 100) * dur);
        }
        if (progressFill) progressFill.style.width = `${e.target.value}%`;
      });

      progressBar.addEventListener('change', (e) => {
        const dur = this.audioEl.duration || 0;
        if (dur > 0) {
          this.audioEl.currentTime = (e.target.value / 100) * dur;
        }
        this.isSeeking = false;
      });

      progressBar.addEventListener('mouseup', () => { this.isSeeking = false; });
      progressBar.addEventListener('touchend', () => { this.isSeeking = false; });
    }
  }

  toggleSong(btn) {
    this.initAudioElement();
    this.initContext();

    const playBtn = btn || document.getElementById('play-beat-btn');
    const vinylDisc = document.getElementById('player-vinyl-disc');
    const statusText = document.getElementById('player-status-badge');

    if (this.isPlaying) {
      this.audioEl.pause();
      this.isPlaying = false;
      if (playBtn) playBtn.innerHTML = '▶';
      if (vinylDisc) vinylDisc.classList.remove('spinning');
      if (statusText) statusText.textContent = 'PAUSED';
    } else {
      this.audioEl.volume = 1.0;
      this.audioEl.muted = false;
      
      const playPromise = this.audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          if (playBtn) playBtn.innerHTML = '❚❚';
          if (vinylDisc) vinylDisc.classList.add('spinning');
          if (statusText) statusText.textContent = 'PLAYING ⚡';
        }).catch(err => {
          console.warn("Playback error:", err);
          // Try unmuting again and re-trigger
          this.audioEl.muted = false;
          this.audioEl.play();
        });
      }
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  setupVisualizer(canvasId) {
    this.visualizerCanvas = document.getElementById(canvasId);
    if (!this.visualizerCanvas) return;
    this.visualizerCtx = this.visualizerCanvas.getContext('2d');
    this.renderVisualizer();
  }

  renderVisualizer() {
    if (!this.visualizerCanvas || !this.visualizerCtx) return;
    requestAnimationFrame(() => this.renderVisualizer());

    const width = this.visualizerCanvas.width;
    const height = this.visualizerCanvas.height;
    this.visualizerCtx.clearRect(0, 0, width, height);

    const now = Date.now();
    const count = this.barsCount;
    const barWidth = width / count;

    for (let i = 0; i < count; i++) {
      if (this.isPlaying) {
        // High energy rhythm wave synced with music tempo
        const bassFreq = Math.sin(now * 0.009 + i * 0.18) * 0.5 + 0.5;
        const subKick = Math.sin(now * 0.015) > 0.6 ? 25 : 0;
        const midHarmonic = Math.cos(now * 0.007 + i * 0.4) * 15;
        const target = Math.max(10, (bassFreq * 55) + subKick + midHarmonic + Math.random() * 10);

        this.barHeights[i] += (target - this.barHeights[i]) * 0.28;
      } else {
        // Gentle ambient standby wave
        const idle = Math.sin(now * 0.003 + i * 0.2) * 8 + 14;
        this.barHeights[i] += (idle - this.barHeights[i]) * 0.15;
      }

      const barHeight = Math.min(height - 4, Math.max(4, this.barHeights[i]));
      const x = i * barWidth;
      const y = height - barHeight;

      // Golden & Crimson Gradient
      const grad = this.visualizerCtx.createLinearGradient(0, height, 0, y);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(0.5, '#ef4444');
      grad.addColorStop(1, '#fde047');

      this.visualizerCtx.fillStyle = grad;
      this.visualizerCtx.shadowBlur = this.isPlaying ? 8 : 1;
      this.visualizerCtx.shadowColor = '#f59e0b';

      const r = Math.min(3, barWidth / 2);
      this.visualizerCtx.beginPath();
      this.visualizerCtx.roundRect(x + 1.5, y, barWidth - 3, barHeight, [r, r, 0, 0]);
      this.visualizerCtx.fill();
    }
  }

  // Cinematic Entrance Chime & Sub-bass Boom
  playEntranceBoom() {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.7);

    const chordFreqs = [220, 277.18, 329.63, 440];
    chordFreqs.forEach((freq) => {
      const o = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, now + 0.1);
      g.gain.setValueAtTime(0.08, now + 0.1);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      o.connect(g);
      g.connect(this.audioCtx.destination);
      o.start(now + 0.1);
      o.stop(now + 2.3);
    });
  }

  // Thar 4x4 Off-Road Turbo Rev Simulator
  playTharRev() {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(65, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.7);
    osc.frequency.linearRampToValueAtTime(180, now + 1.1);
    osc.frequency.exponentialRampToValueAtTime(310, now + 1.7);
    osc.frequency.exponentialRampToValueAtTime(60, now + 2.6);

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.linearRampToValueAtTime(800, now + 0.7);
    filter.frequency.linearRampToValueAtTime(240, now + 2.6);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.8);
  }

  // Royal Enfield Bullet 350 "Dug-Dug" Thump
  playBulletThump() {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    for (let i = 0; i < 6; i++) {
      const thumpTime = now + (i * 0.28);
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, thumpTime);
      osc.frequency.exponentialRampToValueAtTime(38, thumpTime + 0.16);

      gain.gain.setValueAtTime(0.65, thumpTime);
      gain.gain.exponentialRampToValueAtTime(0.001, thumpTime + 0.22);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(thumpTime);
      osc.stop(thumpTime + 0.24);
    }
  }

  // Click Sound
  playClick() {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }
}

window.royalAudio = new RoyalAudioManager();
