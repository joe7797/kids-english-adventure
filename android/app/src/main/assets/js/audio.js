/**
 * 安安英语乐园 (AMBER English Adventure) - 音频与语音合成引擎 (增强移动端版)
 * 1. Web Audio API 自主合成童趣音效（气泡声、叮当金币、通关礼花、欢快按键），支持移动端轻触解锁
 * 2. 混合式语音朗读引擎 (Dual-Engine Audio & Speech)：
 *    - 优先使用纯正真人美式发音音频流 (HTML5 Audio)，彻底解决安卓手机 WebView 无法发声/静音问题
 *    - 离线时自动无缝降级为系统原生 Web Speech API (SpeechSynthesis)
 *    - 支持“常速小兔子 🐇”与“慢速小乌龟 🐢”两种语速调节与自然拼读分步拼读
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.selectedVoice = null;
    this.audioPlayer = null;
    this.isAudioUnlocked = false;

    this.initAudioContext();
    this.initSpeechSynthesis();
    this.setupMobileAudioUnlock();
  }

  // 初始化 Web Audio 上下文
  initAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      try {
        this.ctx = new AudioCtx();
      } catch (e) {
        console.warn('AudioContext creation failed:', e);
      }
    }
  }

  // 监听移动端首次触摸，解除手机浏览器对 AudioContext 的静音限制 (Autoplay Policy)
  setupMobileAudioUnlock() {
    const unlock = () => {
      this.resumeContext();
      // 预先准备 HTML5 Audio 实例以绕过移动端首次播放限制
      if (!this.audioPlayer) {
        this.audioPlayer = new Audio();
      }
      this.isAudioUnlocked = true;

      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('touchend', unlock, true);
      window.removeEventListener('click', unlock, true);
    };

    window.addEventListener('touchstart', unlock, true);
    window.addEventListener('touchend', unlock, true);
    window.addEventListener('click', unlock, true);
  }

  // 确保音频上下文激活
  resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // 初始化 TTS 语音选择（作为离线兜底备用）
  initSpeechSynthesis() {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          this.selectedVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')))
            || voices.find(v => v.lang.startsWith('en'))
            || voices[0];
        }
      } catch (e) {}
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  // 播放合成音效：弹力按键音 (Boing)
  playBoing() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  // 播放气泡破裂音效 (Bubble Pop)
  playPop() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // 播放答对/成功欢快音效 (Ding / Success)
  playCorrect() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {}
  }

  // 播放答错提示音 (Gentle Try Again) - 柔和不刺耳
  playWrong() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    try {
      const notes = [330, 293.66]; // E4, D4
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.12;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {}
  }

  // 播放星星收集音效 (Star Sparkle)
  playStarDing() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.1); // E6

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // 播放通关/成就勋章庆祝乐曲 (Victory Fanfare)
  playFanfare() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    try {
      const fanfare = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.15 }, // G5
        { f: 1046.50, d: 0.4 }  // C6
      ];

      let t = this.ctx.currentTime;
      fanfare.forEach(item => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + item.d);

        t += item.d * 0.85;
      });
    } catch (e) {}
  }

  /**
   * 核心发音方法：双模引擎智能发音
   * 1. 优先使用真人美音高清晰音频流（覆盖全系安卓手机与 WebView，不依赖手机是否安装 Google TTS）
   * 2. 弱网或断网时无缝降级为系统 SpeechSynthesis
   */
  speak(text, slowMode = false, onEnd = null) {
    if (this.isMuted || !text) {
      if (onEnd) onEnd();
      return;
    }

    this.resumeContext();

    // 格式化文本（去除多余标点与空格）
    const cleanWord = text.trim();

    // 优先尝试标准真人发音音频源 (HTML5 Audio)
    this.playAudioStream(cleanWord, slowMode, onEnd);
  }

  // 播放高清真人发音音频流
  playAudioStream(text, slowMode, onEnd) {
    try {
      if (!this.audioPlayer) {
        this.audioPlayer = new Audio();
      }

      this.audioPlayer.pause();

      // type=2 为纯正美音标准真人发音
      const encoded = encodeURIComponent(text);
      const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encoded}&type=2`;

      this.audioPlayer.src = audioUrl;
      this.audioPlayer.playbackRate = slowMode ? 0.72 : 1.0;

      let isFinished = false;
      const done = () => {
        if (!isFinished) {
          isFinished = true;
          if (onEnd) onEnd();
        }
      };

      this.audioPlayer.onended = done;

      // 若网络受限或加载超时，自动降级为系统自带 TTS 朗读
      this.audioPlayer.onerror = () => {
        console.warn('Audio stream fallback to SpeechSynthesis for:', text);
        this.speakFallbackTTS(text, slowMode, onEnd);
      };

      const playPromise = this.audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Audio playback restricted, falling back to TTS:', err);
          this.speakFallbackTTS(text, slowMode, onEnd);
        });
      }
    } catch (e) {
      this.speakFallbackTTS(text, slowMode, onEnd);
    }
  }

  // 备用兜底：Web Speech API
  speakFallbackTTS(text, slowMode = false, onEnd = null) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.rate = slowMode ? 0.6 : 0.9;
      utterance.pitch = slowMode ? 1.15 : 1.05;

      let called = false;
      const finish = () => {
        if (!called) {
          called = true;
          if (onEnd) onEnd();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      // 针对安卓 WebView 可能卡住不触发 onend 的保护超时
      setTimeout(finish, 2500);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      if (onEnd) onEnd();
    }
  }

  // 逐字母拼读发音（自然拼读辅导，例如：C... A... T... Cat!）
  spellWord(word, onFinish = null) {
    if (!word || this.isMuted) {
      if (onFinish) onFinish();
      return;
    }

    const letters = word.toUpperCase().split('');
    let index = 0;

    const playNext = () => {
      if (index < letters.length) {
        const char = letters[index];
        index++;
        this.speak(char, true, () => {
          setTimeout(playNext, 200);
        });
      } else {
        // 字母拼完后，整体以常速朗读一次完整单词
        setTimeout(() => {
          this.speak(word, false, onFinish);
        }, 350);
      }
    };

    playNext();
  }

  // 切换全局静音
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.audioPlayer) {
        this.audioPlayer.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return this.isMuted;
  }
}

// 导出全局单例
window.soundEngine = new SoundEngine();
