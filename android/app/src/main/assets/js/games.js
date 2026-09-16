/**
 * 儿童英语启蒙乐园 - 趣味小游戏逻辑引擎
 * 包含三大寓教于乐益智游戏：
 * 1. 听音辨图 (Listen & Pick)
 * 2. 字母积木拼字 (Spelling Blocks)
 * 3. 奇妙记忆翻牌 (Memory Match)
 */

class MiniGamesEngine {
  constructor() {
    this.currentGame = null;

    // 游戏1状态
    this.g1 = {
      round: 0,
      totalRounds: 10,
      score: 0,
      combo: 0,
      currentWord: null,
      options: []
    };

    // 游戏2状态
    this.g2 = {
      round: 0,
      totalRounds: 6,
      currentWord: null,
      lettersScrambled: [],
      userSpelled: []
    };

    // 游戏3状态
    this.g3 = {
      cards: [],
      flippedCards: [],
      matchedCount: 0,
      totalPairs: 4,
      isBusy: false
    };
  }

  // ================= 游戏 1: 听音辨图 =================
  startListenGame() {
    this.currentGame = 'listen';
    this.g1.round = 0;
    this.g1.score = 0;
    this.g1.combo = 0;
    document.getElementById('game-area-listen').style.display = 'block';
    document.getElementById('game-area-spell').style.display = 'none';
    document.getElementById('game-area-memory').style.display = 'none';
    this.nextListenRound();
  }

  nextListenRound() {
    if (this.g1.round >= this.g1.totalRounds) {
      this.finishListenGame();
      return;
    }

    this.g1.round++;
    document.getElementById('g1-round-text').textContent = `第 ${this.g1.round} / ${this.g1.totalRounds} 题`;
    document.getElementById('g1-score-text').textContent = `得分: ${this.g1.score}`;

    // 随机选出一个目标单词
    const allWords = VOCABULARY_DATA.words;
    const target = allWords[Math.floor(Math.random() * allWords.length)];
    this.g1.currentWord = target;

    // 选出 3 个干扰项
    const distractorPool = allWords.filter(w => w.id !== target.id);
    const shuffledDistractors = [...distractorPool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const roundOptions = [...shuffledDistractors, target].sort(() => 0.5 - Math.random());
    this.g1.options = roundOptions;

    // 渲染选项卡片
    const container = document.getElementById('g1-options-container');
    container.innerHTML = '';

    roundOptions.forEach(word => {
      const btn = document.createElement('button');
      btn.className = 'g1-choice-btn';
      btn.innerHTML = `
        <span class="g1-choice-icon">${word.icon}</span>
        <span class="g1-choice-word">${word.word}</span>
        <span class="g1-choice-cn">${word.meaning}</span>
      `;
      btn.onclick = () => this.handleListenChoice(btn, word);
      container.appendChild(btn);
    });

    // 延迟 400ms 自动朗读目标单词
    setTimeout(() => {
      this.playCurrentListenAudio();
    }, 400);
  }

  playCurrentListenAudio() {
    if (this.g1.currentWord) {
      window.soundEngine.speak(this.g1.currentWord.word);
      const speakerBtn = document.getElementById('g1-speaker-btn');
      if (speakerBtn) {
        speakerBtn.classList.add('pulse');
        setTimeout(() => speakerBtn.classList.remove('pulse'), 800);
      }
    }
  }

  handleListenChoice(buttonEl, selectedWord) {
    const isCorrect = selectedWord.id === this.g1.currentWord.id;

    if (isCorrect) {
      buttonEl.classList.add('correct-choice');
      window.soundEngine.playCorrect();
      this.g1.combo++;
      const bonus = this.g1.combo >= 3 ? 15 : 10;
      this.g1.score += bonus;
      window.rewardManager.addStars(1);

      // 显示夸奖动效
      const feedbackEl = document.getElementById('g1-feedback');
      feedbackEl.textContent = this.g1.combo >= 3 ? `连对 ${this.g1.combo} 次！太聪明了！🔥` : '答对啦！真棒！⭐';
      feedbackEl.className = 'g-feedback show correct';

      setTimeout(() => {
        feedbackEl.className = 'g-feedback';
        this.nextListenRound();
      }, 1000);
    } else {
      buttonEl.classList.add('wrong-choice');
      window.soundEngine.playWrong();
      this.g1.combo = 0;

      const feedbackEl = document.getElementById('g1-feedback');
      feedbackEl.textContent = '再听一次，你可以的！💪';
      feedbackEl.className = 'g-feedback show wrong';

      setTimeout(() => {
        buttonEl.classList.remove('wrong-choice');
        feedbackEl.className = 'g-feedback';
        this.playCurrentListenAudio();
      }, 900);
    }
  }

  finishListenGame() {
    window.soundEngine.playFanfare();
    window.rewardManager.recordGameStat('game1Score', this.g1.score);
    window.rewardManager.addStars(5);
    window.rewardManager.launchConfetti();

    const container = document.getElementById('g1-options-container');
    container.innerHTML = `
      <div class="game-win-card">
        <div class="win-trophy">🏆</div>
        <h3>恭喜完成听力大挑战！</h3>
        <p class="win-score">本场得分: <strong>${this.g1.score}</strong> 分</p>
        <p class="win-bonus">获得额外奖励：⭐ 5 颗闪亮金星！</p>
        <button class="btn btn-primary btn-bounce" onclick="miniGames.startListenGame()">
          🔄 再玩一次
        </button>
      </div>
    `;
  }

  // ================= 游戏 2: 拼字积木 =================
  startSpellGame() {
    this.currentGame = 'spell';
    this.g2.round = 0;
    const area = document.getElementById('game-area-spell');
    if (!this.g2InitialHtml && area) {
      this.g2InitialHtml = area.innerHTML;
    } else if (this.g2InitialHtml && area) {
      area.innerHTML = this.g2InitialHtml;
    }
    document.getElementById('game-area-listen').style.display = 'none';
    if (area) area.style.display = 'block';
    document.getElementById('game-area-memory').style.display = 'none';
    this.nextSpellRound();
  }

  nextSpellRound() {
    if (this.g2.round >= this.g2.totalRounds) {
      this.finishSpellGame();
      return;
    }

    this.g2.round++;
    document.getElementById('g2-round-text').textContent = `第 ${this.g2.round} / ${this.g2.totalRounds} 词`;

    // 选取长度 3-6 的较短基础单词，适合儿童拼读
    const suitableWords = VOCABULARY_DATA.words.filter(w => w.word.length >= 3 && w.word.length <= 6);
    const target = suitableWords[Math.floor(Math.random() * suitableWords.length)];
    this.g2.currentWord = target;
    this.g2.userSpelled = [];

    // 设置目标提示与图案
    document.getElementById('g2-target-icon').textContent = target.icon;
    document.getElementById('g2-target-meaning').textContent = target.meaning;

    // 渲染目标空槽
    const slotsContainer = document.getElementById('g2-slots-container');
    slotsContainer.innerHTML = '';
    const letters = target.word.toUpperCase().split('');
    letters.forEach((_, idx) => {
      const slot = document.createElement('div');
      slot.className = 'spell-slot empty';
      slot.id = `spell-slot-${idx}`;
      slot.textContent = '';
      slotsContainer.appendChild(slot);
    });

    // 打乱字母生成可选积木块
    const scrambled = [...letters].sort(() => 0.5 - Math.random());
    this.g2.lettersScrambled = scrambled.map((char, index) => ({ id: `letter-${index}`, char, used: false }));

    this.renderLetterBlocks();

    // 朗读单词
    setTimeout(() => {
      window.soundEngine.speak(target.word);
    }, 300);
  }

  renderLetterBlocks() {
    const blocksContainer = document.getElementById('g2-blocks-container');
    blocksContainer.innerHTML = '';

    this.g2.lettersScrambled.forEach(item => {
      const block = document.createElement('button');
      block.className = `letter-block ${item.used ? 'used' : ''}`;
      block.textContent = item.char;
      block.disabled = item.used;
      block.onclick = () => this.handleLetterClick(item);
      blocksContainer.appendChild(block);
    });
  }

  handleLetterClick(item) {
    if (item.used) return;

    const targetLetters = this.g2.currentWord.word.toUpperCase().split('');
    const nextSlotIndex = this.g2.userSpelled.length;

    if (nextSlotIndex < targetLetters.length) {
      item.used = true;
      this.g2.userSpelled.push(item);
      window.soundEngine.playPop();

      // 更新对应槽位
      const slot = document.getElementById(`spell-slot-${nextSlotIndex}`);
      slot.textContent = item.char;
      slot.classList.remove('empty');
      slot.classList.add('filled');

      this.renderLetterBlocks();

      // 检查是否拼满
      if (this.g2.userSpelled.length === targetLetters.length) {
        this.checkSpellResult();
      }
    }
  }

  undoSpell() {
    if (this.g2.userSpelled.length === 0) return;

    const lastItem = this.g2.userSpelled.pop();
    lastItem.used = false;
    window.soundEngine.playBoing();

    const slot = document.getElementById(`spell-slot-${this.g2.userSpelled.length}`);
    slot.textContent = '';
    slot.classList.add('empty');
    slot.classList.remove('filled');

    this.renderLetterBlocks();
  }

  checkSpellResult() {
    const spelledString = this.g2.userSpelled.map(i => i.char).join('');
    const targetString = this.g2.currentWord.word.toUpperCase();

    if (spelledString === targetString) {
      window.soundEngine.playCorrect();
      window.rewardManager.addStars(2);
      window.rewardManager.markWordLearned(this.g2.currentWord.id);

      const slots = document.querySelectorAll('.spell-slot');
      slots.forEach(s => s.classList.add('success'));

      setTimeout(() => {
        window.soundEngine.spellWord(this.g2.currentWord.word, () => {
          setTimeout(() => this.nextSpellRound(), 800);
        });
      }, 400);
    } else {
      window.soundEngine.playWrong();
      const slots = document.querySelectorAll('.spell-slot');
      slots.forEach(s => s.classList.add('shake'));

      setTimeout(() => {
        slots.forEach(s => s.classList.remove('shake'));
        // 自动撤回所有字母
        this.g2.userSpelled.forEach(item => (item.used = false));
        this.g2.userSpelled = [];
        slots.forEach(s => {
          s.textContent = '';
          s.className = 'spell-slot empty';
        });
        this.renderLetterBlocks();
        window.soundEngine.speak(this.g2.currentWord.word);
      }, 1000);
    }
  }

  finishSpellGame() {
    window.soundEngine.playFanfare();
    window.rewardManager.recordGameStat('game2Completions', 1);
    window.rewardManager.addStars(6);
    window.rewardManager.launchConfetti();

    const area = document.getElementById('game-area-spell');
    area.innerHTML = `
      <div class="game-win-card">
        <div class="win-trophy">🧩</div>
        <h3>太厉害了！拼词大成功！</h3>
        <p class="win-bonus">获得拼词大师奖励：⭐ 6 颗闪亮金星！</p>
        <button class="btn btn-primary btn-bounce" onclick="miniGames.startSpellGame()">
          🔄 挑战下一关
        </button>
      </div>
    `;
  }

  // ================= 游戏 3: 奇妙记忆翻牌 =================
  startMemoryGame() {
    this.currentGame = 'memory';
    this.g3.matchedCount = 0;
    this.g3.flippedCards = [];
    this.g3.isBusy = false;

    document.getElementById('game-area-listen').style.display = 'none';
    document.getElementById('game-area-spell').style.display = 'none';
    document.getElementById('game-area-memory').style.display = 'block';

    this.initMemoryCards();
  }

  initMemoryCards() {
    // 随机选择 4 个单词作为配对组 (共 8 张卡片)
    const allWords = [...VOCABULARY_DATA.words].sort(() => 0.5 - Math.random()).slice(0, this.g3.totalPairs);
    let cardDeck = [];

    allWords.forEach((word, index) => {
      // 图标卡
      cardDeck.push({
        pairId: word.id,
        type: 'icon',
        content: word.icon,
        label: word.meaning,
        word: word.word
      });
      // 单词卡
      cardDeck.push({
        pairId: word.id,
        type: 'word',
        content: word.word,
        label: word.ipa,
        word: word.word
      });
    });

    // 洗牌
    cardDeck = cardDeck.sort(() => 0.5 - Math.random());
    this.g3.cards = cardDeck;

    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';

    cardDeck.forEach((card, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card';
      cardEl.dataset.index = idx;
      cardEl.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <span class="card-question-mark">❓</span>
          </div>
          <div class="card-back">
            <span class="card-content-icon ${card.type}">${card.content}</span>
            <span class="card-content-label">${card.label}</span>
          </div>
        </div>
      `;
      cardEl.onclick = () => this.handleCardFlip(cardEl, card, idx);
      grid.appendChild(cardEl);
    });
  }

  handleCardFlip(cardEl, cardData, index) {
    if (this.g3.isBusy) return;
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    window.soundEngine.playPop();
    cardEl.classList.add('flipped');
    this.g3.flippedCards.push({ el: cardEl, data: cardData });

    // 读出单词发音
    window.soundEngine.speak(cardData.word);

    if (this.g3.flippedCards.length === 2) {
      this.checkMemoryMatch();
    }
  }

  checkMemoryMatch() {
    this.g3.isBusy = true;
    const [first, second] = this.g3.flippedCards;

    if (first.data.pairId === second.data.pairId) {
      // 配对成功
      setTimeout(() => {
        first.el.classList.add('matched');
        second.el.classList.add('matched');
        window.soundEngine.playCorrect();
        window.rewardManager.addStars(2);
        this.g3.matchedCount++;
        this.g3.flippedCards = [];
        this.g3.isBusy = false;

        if (this.g3.matchedCount >= this.g3.totalPairs) {
          this.finishMemoryGame();
        }
      }, 500);
    } else {
      // 配对失败，翻回背面
      setTimeout(() => {
        first.el.classList.remove('flipped');
        second.el.classList.remove('flipped');
        window.soundEngine.playWrong();
        this.g3.flippedCards = [];
        this.g3.isBusy = false;
      }, 1000);
    }
  }

  finishMemoryGame() {
    window.soundEngine.playFanfare();
    window.rewardManager.recordGameStat('game3Completions', 1);
    window.rewardManager.addStars(8);
    window.rewardManager.launchConfetti();

    const grid = document.getElementById('memory-grid');
    grid.innerHTML = `
      <div class="game-win-card" style="grid-column: 1 / -1;">
        <div class="win-trophy">🃏</div>
        <h3>记忆力超强！全部配对成功！</h3>
        <p class="win-bonus">恭喜获得记忆大师奖励：⭐ 8 颗金星！</p>
        <button class="btn btn-primary btn-bounce" onclick="miniGames.startMemoryGame()">
          🔄 再来一局
        </button>
      </div>
    `;
  }
}

window.miniGames = new MiniGamesEngine();
