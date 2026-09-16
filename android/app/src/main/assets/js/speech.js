/**
 * 儿童英语启蒙乐园 - 麦克风跟读与智能发音评测引擎
 * 基于 Web Speech API (SpeechRecognition) 实现儿童语音输入识别与智能星级激励
 */

class SpeechCoach {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.targetWord = '';
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.initRecognition();
  }

  // 检测并初始化浏览器语音识别器
  initRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US'; // 识别美式英语
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        this.isListening = false;
        const results = event.results[0];
        let matched = false;
        let highestScore = 0;
        let spokenText = '';

        if (results && results.length > 0) {
          spokenText = results[0].transcript.trim().toLowerCase();
          const target = this.targetWord.trim().toLowerCase();

          // 遍历候选识别结果
          for (let i = 0; i < results.length; i++) {
            const candidate = results[i].transcript.trim().toLowerCase();
            const score = this.calculateSimilarity(candidate, target);
            if (score > highestScore) {
              highestScore = score;
            }
          }
        }

        // 计算获得的星星数量与鼓励语
        const evaluation = this.evaluateScore(highestScore, spokenText);
        if (this.onResultCallback) {
          this.onResultCallback(evaluation);
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        console.warn('Speech recognition event/error:', event.error);
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  // 判断当前浏览器是否支持原生麦克风录音识别
  isSupported() {
    return !!this.recognition;
  }

  // 开始监听指定单词的发音
  startListening(word, onResult, onError) {
    this.targetWord = word;
    this.onResultCallback = onResult;
    this.onErrorCallback = onError;

    if (!this.recognition) {
      if (onError) onError('not-supported');
      return;
    }

    try {
      if (this.isListening) {
        this.recognition.stop();
      }
      this.recognition.start();
    } catch (e) {
      console.error('Failed to start recognition:', e);
      if (onError) onError(e.message || 'start-failed');
    }
  }

  // 停止监听
  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
  }

  // 模糊匹配与相似度计算（针对儿童发音宽容度）
  calculateSimilarity(spoken, target) {
    spoken = spoken.replace(/[^a-z]/g, '');
    target = target.replace(/[^a-z]/g, '');

    if (spoken === target) return 1.0;
    if (spoken.includes(target) || target.includes(spoken)) return 0.85;

    // Levenshtein 距离算法
    const matrix = [];
    for (let i = 0; i <= target.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= spoken.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= target.length; i++) {
      for (let j = 1; j <= spoken.length; j++) {
        if (target.charAt(i - 1) === spoken.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const dist = matrix[target.length][spoken.length];
    const maxLen = Math.max(target.length, spoken.length);
    return Math.max(0, 1 - dist / maxLen);
  }

  // 评估星级与激励反馈
  evaluateScore(score, spokenText) {
    if (score >= 0.75) {
      return {
        stars: 3,
        title: '太棒了！地道发音！🌟🌟🌟',
        subtitle: `你读得非常标准！听到你说了: "${spokenText || this.targetWord}"`,
        passed: true,
        bonusStars: 3
      };
    } else if (score >= 0.45) {
      return {
        stars: 2,
        title: '很不错哦！继续加油！🌟🌟',
        subtitle: `听得很接近了！听到你说了: "${spokenText}"，再试一次拿满星吧！`,
        passed: true,
        bonusStars: 2
      };
    } else {
      return {
        stars: 1,
        title: '勇敢尝试！迈出第一步！🌟',
        subtitle: spokenText ? `听到你说了: "${spokenText}"。点击小乌龟慢速再听一次吧！` : '没听清楚哦，请离麦克风近一点再试一次！',
        passed: false,
        bonusStars: 1
      };
    }
  }
}

window.speechCoach = new SpeechCoach();
