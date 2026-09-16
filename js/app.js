/**
 * 儿童英语启蒙乐园 - 主应用控制器
 * 负责页面导航切换、单词探索卡片渲染、跟读弹窗、沉浸模式及事件监听挂载
 */

class AppController {
  constructor() {
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.isImmersionMode = false;
    this.currentPracticingWord = null;

    this.init();
  }

  init() {
    this.renderCategoryPills();
    this.renderWordCards();
    this.bindGlobalEvents();
    window.rewardManager.updateUI();
  }

  // 绑定界面全局事件
  bindGlobalEvents() {
    // 顶部主导航 Tab 切换
    const navTabs = document.querySelectorAll('.nav-tab-btn');
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        window.soundEngine.playBoing();
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetViewId = tab.dataset.view;
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        const activeSec = document.getElementById(targetViewId);
        if (activeSec) activeSec.classList.add('active');

        // 如果切换到游戏视图，默认启动第一个游戏
        if (targetViewId === 'view-games' && !window.miniGames.currentGame) {
          window.miniGames.startListenGame();
        }
      });
    });

    // 游戏内部子选项卡切换 (听音选图 / 字母积木 / 记忆翻牌)
    const gameSubTabs = document.querySelectorAll('.game-sub-tab');
    gameSubTabs.forEach(subTab => {
      subTab.addEventListener('click', () => {
        window.soundEngine.playBoing();
        gameSubTabs.forEach(t => t.classList.remove('active'));
        subTab.classList.add('active');

        const gameType = subTab.dataset.game;
        if (gameType === 'listen') window.miniGames.startListenGame();
        if (gameType === 'spell') window.miniGames.startSpellGame();
        if (gameType === 'memory') window.miniGames.startMemoryGame();
      });
    });

    // 搜索输入过滤
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderWordCards();
      });
    }

    // 纯英文沉浸模式切换
    const immersionToggle = document.getElementById('immersion-toggle');
    if (immersionToggle) {
      immersionToggle.addEventListener('change', (e) => {
        this.isImmersionMode = e.target.checked;
        window.soundEngine.playPop();
        document.body.classList.toggle('immersion-mode', this.isImmersionMode);
      });
    }

    // 静音切换按钮
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
        muteBtn.title = isMuted ? '已静音' : '音效开启';
      });
    }

    // 重置进度按钮
    const resetBtn = document.getElementById('reset-progress-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('确定要清空所有收集的星星和勋章重新开始吗？小朋友别点错哦！')) {
          window.rewardManager.resetProgress();
        }
      });
    }

    // 徽章庆祝弹窗关闭按钮
    const closeBadgeModal = document.getElementById('badge-modal-close');
    if (closeBadgeModal) {
      closeBadgeModal.addEventListener('click', () => {
        document.getElementById('badge-modal').classList.remove('active');
      });
    }

    // 麦克风跟读弹窗关闭
    const closeMicModal = document.getElementById('mic-modal-close');
    if (closeMicModal) {
      closeMicModal.addEventListener('click', () => {
        window.speechCoach.stopListening();
        document.getElementById('mic-modal').classList.remove('active');
      });
    }
  }

  // 渲染分类筛选胶囊按钮
  renderCategoryPills() {
    const pillsContainer = document.getElementById('category-pills');
    if (!pillsContainer) return;

    pillsContainer.innerHTML = '';

    // '全部' 按钮
    const allBtn = document.createElement('button');
    allBtn.className = `category-pill ${this.currentCategory === 'all' ? 'active' : ''}`;
    allBtn.innerHTML = `🌟 全部单词 (${VOCABULARY_DATA.words.length})`;
    allBtn.onclick = () => {
      window.soundEngine.playBoing();
      this.currentCategory = 'all';
      this.updatePillActiveState();
      this.renderWordCards();
    };
    pillsContainer.appendChild(allBtn);

    // 各子分类按钮
    VOCABULARY_DATA.categories.forEach(cat => {
      const count = VOCABULARY_DATA.words.filter(w => w.category === cat.id).length;
      const btn = document.createElement('button');
      btn.className = `category-pill ${this.currentCategory === cat.id ? 'active' : ''}`;
      btn.dataset.cat = cat.id;
      btn.innerHTML = `${cat.icon} ${cat.name} (${count})`;
      btn.onclick = () => {
        window.soundEngine.playBoing();
        this.currentCategory = cat.id;
        this.updatePillActiveState();
        this.renderWordCards();
      };
      pillsContainer.appendChild(btn);
    });

    // '我的收藏' 按钮
    const favBtn = document.createElement('button');
    favBtn.className = `category-pill ${this.currentCategory === 'favorite' ? 'active' : ''}`;
    favBtn.dataset.cat = 'favorite';
    favBtn.innerHTML = `❤️ 我的收藏`;
    favBtn.onclick = () => {
      window.soundEngine.playBoing();
      this.currentCategory = 'favorite';
      this.updatePillActiveState();
      this.renderWordCards();
    };
    pillsContainer.appendChild(favBtn);
  }

  updatePillActiveState() {
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(pill => {
      const cat = pill.dataset.cat || 'all';
      pill.classList.toggle('active', cat === this.currentCategory);
    });
  }

  // 渲染单词卡片网格
  renderWordCards() {
    const grid = document.getElementById('words-grid');
    if (!grid) return;

    grid.innerHTML = '';

    // 筛选单词
    let filtered = VOCABULARY_DATA.words.filter(w => {
      if (this.currentCategory === 'favorite') {
        return window.rewardManager.isFavorite(w.id);
      }
      if (this.currentCategory !== 'all') {
        return w.category === this.currentCategory;
      }
      return true;
    });

    // 关键字搜索筛选
    if (this.searchQuery) {
      filtered = filtered.filter(w =>
        w.word.toLowerCase().includes(this.searchQuery) ||
        w.meaning.includes(this.searchQuery)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>没有找到相关的单词呢~</h3>
          <p>试着换个分类，或者切换搜索词看看吧！</p>
        </div>
      `;
      return;
    }

    filtered.forEach(word => {
      const isFav = window.rewardManager.isFavorite(word.id);
      const isLearned = window.rewardManager.state.learnedWordIds.includes(word.id);

      const card = document.createElement('div');
      card.className = `word-card ${isLearned ? 'learned' : ''}`;
      card.id = `card-${word.id}`;

      card.innerHTML = `
        <div class="card-header-bar">
          <span class="learned-badge">${isLearned ? '✓ 已掌握' : '🌱 学习中'}</span>
          <button class="favorite-btn ${isFav ? 'active' : ''}" title="收藏单词" id="fav-btn-${word.id}">
            ${isFav ? '❤️' : '🤍'}
          </button>
        </div>

        <div class="card-main-visual" id="visual-${word.id}">
          <span class="word-icon bounce-hover">${word.icon}</span>
          <h2 class="word-title">${word.word}</h2>
          <div class="word-ipa">${word.ipa}</div>
          <div class="word-meaning-cn">${word.meaning}</div>
        </div>

        <div class="card-phonics-strip">
          <span class="phonics-label">自然拼读:</span>
          <span class="phonics-text">${word.phonics}</span>
        </div>

        <div class="card-sentence-box">
          <p class="sentence-en">${word.sentence}</p>
          <p class="sentence-cn">${word.sentenceCn}</p>
        </div>

        <div class="card-action-bar">
          <button class="action-btn rabbit-btn" title="标准语速朗读" id="speak-btn-${word.id}">
            🐇 朗读
          </button>
          <button class="action-btn turtle-btn" title="慢速音标拼读" id="slow-btn-${word.id}">
            🐢 慢读
          </button>
          <button class="action-btn spell-btn" title="逐字母自然拼读" id="spell-btn-${word.id}">
            🔤 拼读
          </button>
          <button class="action-btn mic-btn" title="麦克风跟读打分" id="mic-btn-${word.id}">
            🎙️ 跟读
          </button>
        </div>
      `;

      // 绑定卡片内各项交互
      const visualArea = card.querySelector(`#visual-${word.id}`);
      visualArea.addEventListener('click', () => {
        window.soundEngine.speak(word.word);
        window.rewardManager.markWordLearned(word.id);
        card.classList.add('learned');
      });

      // 收藏
      const favBtn = card.querySelector(`#fav-btn-${word.id}`);
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nowFav = window.rewardManager.toggleFavorite(word.id);
        favBtn.innerHTML = nowFav ? '❤️' : '🤍';
        favBtn.classList.toggle('active', nowFav);
        if (this.currentCategory === 'favorite' && !nowFav) {
          this.renderWordCards();
        }
      });

      // 朗读 (兔子常速)
      card.querySelector(`#speak-btn-${word.id}`).addEventListener('click', (e) => {
        e.stopPropagation();
        window.soundEngine.speak(word.word);
        window.rewardManager.markWordLearned(word.id);
        card.classList.add('learned');
      });

      // 慢读 (乌龟慢速)
      card.querySelector(`#slow-btn-${word.id}`).addEventListener('click', (e) => {
        e.stopPropagation();
        window.soundEngine.speak(word.word, true);
      });

      // 字母拆解拼读
      card.querySelector(`#spell-btn-${word.id}`).addEventListener('click', (e) => {
        e.stopPropagation();
        window.soundEngine.spellWord(word.word);
      });

      // 麦克风跟读评测
      card.querySelector(`#mic-btn-${word.id}`).addEventListener('click', (e) => {
        e.stopPropagation();
        this.openMicPracticeModal(word);
      });

      grid.appendChild(card);
    });
  }

  // 打开麦克风跟读评测弹窗
  openMicPracticeModal(word) {
    this.currentPracticingWord = word;
    const modal = document.getElementById('mic-modal');
    if (!modal) return;

    document.getElementById('mic-modal-word').textContent = word.word;
    document.getElementById('mic-modal-icon').textContent = word.icon;
    document.getElementById('mic-modal-ipa').textContent = word.ipa;
    document.getElementById('mic-modal-feedback').innerHTML = `
      <p class="mic-hint-text">点击下方麦克风，大声读出 <strong>"${word.word}"</strong> 吧！</p>
    `;

    const micTrigger = document.getElementById('mic-action-trigger');
    micTrigger.className = 'mic-pulse-circle';
    micTrigger.disabled = false;

    modal.classList.add('active');

    // 默认先示范一遍发音
    setTimeout(() => {
      window.soundEngine.speak(word.word);
    }, 300);

    micTrigger.onclick = () => {
      this.startVoiceRecording(word, micTrigger);
    };
  }

  startVoiceRecording(word, micButton) {
    micButton.classList.add('recording');
    document.getElementById('mic-modal-feedback').innerHTML = `
      <div class="mic-recording-indicator">
        <span class="mic-wave"></span><span class="mic-wave"></span><span class="mic-wave"></span>
        <p>正在认真听小朋友读... 请大声说！</p>
      </div>
    `;

    // 启动语音识别
    window.speechCoach.startListening(
      word.word,
      (evaluation) => {
        micButton.classList.remove('recording');
        window.rewardManager.recordGameStat('micPracticeCount', 1);

        if (evaluation.stars >= 2) {
          window.soundEngine.playCorrect();
          window.rewardManager.addStars(evaluation.bonusStars);
          window.rewardManager.launchConfetti(1800);
        } else {
          window.soundEngine.playWrong();
          window.rewardManager.addStars(1);
        }

        const starsHtml = '⭐'.repeat(evaluation.stars);
        document.getElementById('mic-modal-feedback').innerHTML = `
          <div class="mic-eval-result ${evaluation.passed ? 'success' : 'encourage'}">
            <div class="mic-stars">${starsHtml}</div>
            <h4>${evaluation.title}</h4>
            <p>${evaluation.subtitle}</p>
            <p class="earned-stars-notice">🎉 获得 +${evaluation.bonusStars} 颗星！</p>
          </div>
        `;
      },
      (err) => {
        micButton.classList.remove('recording');
        console.warn('Speech coach callback error:', err);

        // 针对浏览器环境不支持或无权限的儿童友好降级模式
        document.getElementById('mic-modal-feedback').innerHTML = `
          <div class="mic-eval-result encourage">
            <div class="mic-stars">⭐⭐⭐</div>
            <h4>真棒！声音真洪亮！</h4>
            <p>（若浏览器未开放麦克风权限，可点击“重新示范”跟随大声跟读）</p>
            <p class="earned-stars-notice">🎉 依然奖励你 +2 颗勇敢之星！</p>
            <button class="btn btn-sm btn-secondary" onclick="window.soundEngine.speak('${word.word}')" style="margin-top: 10px;">
              🔊 再示范一遍
            </button>
          </div>
        `;
        window.soundEngine.playStarDing();
        window.rewardManager.addStars(2);
      }
    );
  }
}

// 页面加载完毕后初始化
window.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
