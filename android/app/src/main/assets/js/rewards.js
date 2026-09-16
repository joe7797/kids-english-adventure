/**
 * 儿童英语启蒙乐园 - 激励成就与手帐贴纸系统
 * 负责星星计算、学习进度持久化 (LocalStorage)、勋章解锁与 Canvas 庆祝彩带礼花
 */

class RewardManager {
  constructor() {
    this.STORAGE_KEY = 'kids_english_adventure_data';
    this.state = {
      stars: 0,
      learnedWordIds: [],
      favoriteWordIds: [],
      unlockedBadges: [],
      stats: {
        game1Score: 0,
        game2Completions: 0,
        game3Completions: 0,
        micPracticeCount: 0
      }
    };

    this.load();
  }

  // 从本地存储读取状态
  load() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.state = Object.assign(this.state, JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load progress from localStorage', e);
    }
  }

  // 保存状态至本地存储
  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save progress to localStorage', e);
    }
    this.updateUI();
  }

  // 获得星星并检测勋章解锁
  addStars(amount, sourceMessage = '') {
    this.state.stars += amount;
    window.soundEngine.playStarDing();
    this.checkBadges();
    this.save();
    return this.state.stars;
  }

  // 标记已掌握单词
  markWordLearned(wordId) {
    if (!this.state.learnedWordIds.includes(wordId)) {
      this.state.learnedWordIds.push(wordId);
      this.addStars(2); // 每个新词学会获得 2 颗星
      this.save();
    }
  }

  // 切换收藏单词
  toggleFavorite(wordId) {
    const idx = this.state.favoriteWordIds.indexOf(wordId);
    if (idx > -1) {
      this.state.favoriteWordIds.splice(idx, 1);
    } else {
      this.state.favoriteWordIds.push(wordId);
      window.soundEngine.playPop();
    }
    this.save();
    return this.isFavorite(wordId);
  }

  isFavorite(wordId) {
    return this.state.favoriteWordIds.includes(wordId);
  }

  // 记录游戏/麦克风数据
  recordGameStat(key, value) {
    if (key === 'game1Score') {
      if (value > this.state.stats.game1Score) this.state.stats.game1Score = value;
    } else {
      this.state.stats[key] = (this.state.stats[key] || 0) + (value || 1);
    }
    this.checkBadges();
    this.save();
  }

  // 检测勋章解锁逻辑
  checkBadges() {
    BADGES_CONFIG.forEach(badge => {
      if (this.state.unlockedBadges.includes(badge.id)) return;

      let unlocked = false;
      if (badge.id === 'first_word' && this.state.learnedWordIds.length >= 1) unlocked = true;
      if (badge.id === 'animal_master') {
        const animalWords = VOCABULARY_DATA.words.filter(w => w.category === 'animals').map(w => w.id);
        if (animalWords.every(id => this.state.learnedWordIds.includes(id))) unlocked = true;
      }
      if (badge.id === 'fruit_lover') {
        const fruitWords = VOCABULARY_DATA.words.filter(w => w.category === 'fruits').map(w => w.id);
        if (fruitWords.every(id => this.state.learnedWordIds.includes(id))) unlocked = true;
      }
      if (badge.id === 'spelling_bee' && this.state.stats.game2Completions >= 5) unlocked = true;
      if (badge.id === 'super_ear' && this.state.stats.game1Score >= 100) unlocked = true;
      if (badge.id === 'pronounce_king' && this.state.stats.micPracticeCount >= 5) unlocked = true;
      if (this.state.stars >= badge.reqStars) unlocked = true;

      if (unlocked) {
        this.state.unlockedBadges.push(badge.id);
        this.triggerBadgeCelebration(badge);
      }
    });
  }

  // 触发徽章解锁庆祝浮窗与音效
  triggerBadgeCelebration(badge) {
    window.soundEngine.playFanfare();
    this.launchConfetti();

    // 显示全局弹窗
    const modal = document.getElementById('badge-modal');
    if (modal) {
      document.getElementById('badge-modal-icon').textContent = badge.icon;
      document.getElementById('badge-modal-title').textContent = badge.title;
      document.getElementById('badge-modal-desc').textContent = badge.desc;
      modal.classList.add('active');
    }
  }

  // 更新顶部栏与贴纸手帐界面
  updateUI() {
    const starCountEl = document.getElementById('header-star-count');
    if (starCountEl) {
      starCountEl.textContent = this.state.stars;
    }

    const learnedCountEl = document.getElementById('header-learned-count');
    if (learnedCountEl) {
      learnedCountEl.textContent = `${this.state.learnedWordIds.length} / ${VOCABULARY_DATA.words.length}`;
    }

    // 刷新贴纸徽章列表
    const badgesContainer = document.getElementById('stickers-container');
    if (badgesContainer) {
      badgesContainer.innerHTML = '';
      BADGES_CONFIG.forEach(badge => {
        const isUnlocked = this.state.unlockedBadges.includes(badge.id);
        const card = document.createElement('div');
        card.className = `sticker-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
          <div class="sticker-badge-icon">${badge.icon}</div>
          <div class="sticker-info">
            <h4 class="sticker-name">${badge.title}</h4>
            <p class="sticker-condition">${badge.desc}</p>
            <div class="sticker-status">
              ${isUnlocked ? '✨ 已收集' : `⭐ 需达 ${badge.reqStars} 颗星`}
            </div>
          </div>
        `;
        badgesContainer.appendChild(card);
      });
    }
  }

  // 重置学习进度
  resetProgress() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.state = {
      stars: 0,
      learnedWordIds: [],
      favoriteWordIds: [],
      unlockedBadges: [],
      stats: {
        game1Score: 0,
        game2Completions: 0,
        game3Completions: 0,
        micPracticeCount: 0
      }
    };
    this.save();
    window.location.reload();
  }

  // 原生 Canvas 炫彩礼花撒花效果（零外部依赖）
  launchConfetti(duration = 2500) {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9999';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FF597B', '#FFD166', '#06D6A0', '#118AB2', '#8338EC', '#FF9F45'];
    const particles = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.45 + (Math.random() - 0.5) * 100,
        w: Math.random() * 12 + 6,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 1.2) * 16,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        opacity: 1
      });
    }

    const startTime = Date.now();
    function render() {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.vx *= 0.98;

        if (elapsed > duration - 800) {
          p.opacity = Math.max(0, 1 - (elapsed - (duration - 800)) / 800);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (elapsed < duration) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  }
}

window.rewardManager = new RewardManager();
