/**
 * 儿童英语启蒙乐园 - 音频与语音合成引擎
 * 1. Web Audio API 自主合成童趣音效（气泡声、叮当金币、通关礼花、欢快按键），无需依赖外部 MP3
 * 2. Web Speech API (SpeechSynthesis) 智能朗读引擎，提供标准美式真人级发音、慢速慢拼模式
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.selectedVoice = null;
    this.initAudioContext();
    this.initSpeechSynthesis();
  }

  // 初始化 Web Audio 上下文
  initAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
    }
  }

  // 确保音频上下文在用户点击手势后激活
  resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 初始化 TTS 语音选择
  initSpeechSynthesis() {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // 优先选择美式英语高质量发音
      this.selectedVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')))
        || voices.find(v => v.lang.startsWith('en'))
        || voices[0];
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  // 播放合成音效：弹力按键音 (Boing)
  playBoing() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

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
  }

  // 播放气泡破裂音效 (Bubble Pop)
  playPop() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

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
  }

  // 播放答对/成功欢快音效 (Ding / Success)
  playCorrect() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

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
  }

  // 播放答错提示音 (Gentle Try Again) - 柔和不刺耳
  playWrong() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

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
  }

  // 播放星星收集音效 (Star Sparkle)
  playStarDing() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

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
  }

  // 播放通关/成就勋章庆祝乐曲 (Victory Fanfare)
  playFanfare() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

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
  }

  // 朗读英文文本 (TTS)
  // slowMode: true 则为小乌龟慢速音标发音 (rate: 0.6)
  speak(text, slowMode = false, onEnd = null) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // 停止上一条未放完的声音

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    if (slowMode) {
      utterance.rate = 0.6; // 慢速发音
      utterance.pitch = 1.15; // 稍微提高音调，更加清晰亲切
    } else {
      utterance.rate = 0.9; // 正常语速，稍慢于成年人以便儿童听清
      utterance.pitch = 1.05;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  // 逐字母拼读发音（自然拼读辅导，例如：C... A... T... Cat!）
  spellWord(word, onFinish = null) {
    if (!('speechSynthesis' in window) || !word) return;

    window.speechSynthesis.cancel();
    const letters = word.toUpperCase().split('');
    let index = 0;

    const speakNextLetter = () => {
      if (index < letters.length) {
        const char = letters[index];
        index++;
        const u = new SpeechSynthesisUtterance(char);
        u.lang = 'en-US';
        u.rate = 0.8;
        u.pitch = 1.2;
        if (this.selectedVoice) u.voice = this.selectedVoice;
        u.onend = () => {
          setTimeout(speakNextLetter, 200);
        };
        u.onerror = () => {
          setTimeout(speakNextLetter, 200);
        };
        window.speechSynthesis.speak(u);
      } else {
        // 最后整体朗读一遍完整单词
        setTimeout(() => {
          this.speak(word, false, onFinish);
        }, 300);
      }
    };

    speakNextLetter();
  }

  // 切换全局静音
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }
}

// 导出全局单例
window.soundEngine = new SoundEngine();
