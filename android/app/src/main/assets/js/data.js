/**
 * 儿童英语启蒙乐园 - 词汇数据库
 * 包含 6 大精选主题、丰富的词汇量、音标音节分解、生动例句与中文释义
 */

const VOCABULARY_DATA = {
  categories: [
    { id: 'animals', name: '动物世界', englishName: 'Animals', icon: '🦁', color: '#FF7B54' },
    { id: 'fruits', name: '美味果蔬', englishName: 'Fruits & Food', icon: '🍎', color: '#FF597B' },
    { id: 'colors', name: '缤纷色彩与形状', englishName: 'Colors & Shapes', icon: '🎨', color: '#9E7676' },
    { id: 'nature', name: '神奇大自然', englishName: 'Nature & Sky', icon: '🌈', color: '#4E9F3D' },
    { id: 'daily', name: '生活与玩具', englishName: 'Daily & Toys', icon: '🧸', color: '#5F85DB' },
    { id: 'actions', name: '快乐动作', englishName: 'Fun Actions', icon: '🏃‍♂️', color: '#845EC2' }
  ],

  words: [
    // 1. 动物世界 (Animals)
    {
      id: 'cat',
      word: 'Cat',
      phonics: 'C - A - T',
      ipa: '/kæt/',
      meaning: '小猫',
      category: 'animals',
      icon: '🐱',
      funFact: '猫咪睡觉时也会做美梦哦！',
      sentence: 'The cute cat loves to play with yarn.',
      sentenceCn: '可爱的小猫喜欢玩毛线球。'
    },
    {
      id: 'dog',
      word: 'Dog',
      phonics: 'D - O - G',
      ipa: '/dɒɡ/',
      meaning: '小狗',
      category: 'animals',
      icon: '🐶',
      funFact: '小狗是人类最忠诚的好朋友！',
      sentence: 'The friendly dog wags its tail happily.',
      sentenceCn: '友善的小狗欢快地摇着尾巴。'
    },
    {
      id: 'lion',
      word: 'Lion',
      phonics: 'L - I - O - N',
      ipa: '/ˈlaɪ.ən/',
      meaning: '狮子',
      category: 'animals',
      icon: '🦁',
      funFact: '狮子被称为森林与草原的百兽之王！',
      sentence: 'The strong lion has a golden mane.',
      sentenceCn: '强壮的狮子拥有一头金色的鬃毛。'
    },
    {
      id: 'elephant',
      word: 'Elephant',
      phonics: 'EL - E - PHANT',
      ipa: '/ˈel.ɪ.fənt/',
      meaning: '大象',
      category: 'animals',
      icon: '🐘',
      funFact: '大象的长鼻子可以用来喝水和抓食物！',
      sentence: 'The big elephant has huge soft ears.',
      sentenceCn: '大象有一对巨大的软耳朵。'
    },
    {
      id: 'rabbit',
      word: 'Rabbit',
      phonics: 'RAB - BIT',
      ipa: '/ˈræb.ɪt/',
      meaning: '兔子',
      category: 'animals',
      icon: '🐰',
      funFact: '小兔子最爱蹦蹦跳跳和吃胡萝卜！',
      sentence: 'The white rabbit hops across the green grass.',
      sentenceCn: '小白兔在青青的草地上欢快跳跃。'
    },
    {
      id: 'monkey',
      word: 'Monkey',
      phonics: 'MON - KEY',
      ipa: '/ˈmʌŋ.ki/',
      meaning: '猴子',
      category: 'animals',
      icon: '🐵',
      funFact: '猴子可以用尾巴把自己挂在树枝上荡秋千！',
      sentence: 'The clever monkey loves eating bananas.',
      sentenceCn: '聪明的小猴子最喜欢吃香蕉。'
    },
    {
      id: 'panda',
      word: 'Panda',
      phonics: 'PAN - DA',
      ipa: '/ˈpæn.də/',
      meaning: '大熊猫',
      category: 'animals',
      icon: '🐼',
      funFact: '大熊猫每天要花十几个小时吃竹子呢！',
      sentence: 'The lovely panda is munching on sweet bamboo.',
      sentenceCn: '可爱的大熊猫正在津津有味地吃着甜竹子。'
    },
    {
      id: 'duck',
      word: 'Duck',
      phonics: 'D - U - C - K',
      ipa: '/dʌk/',
      meaning: '鸭子',
      category: 'animals',
      icon: '🦆',
      funFact: '小鸭子的羽毛天生自带防水涂层哦！',
      sentence: 'The yellow duck says quack quack in the pond.',
      sentenceCn: '黄色的小鸭子在池塘里嘎嘎叫。'
    },

    // 2. 美味果蔬 (Fruits & Food)
    {
      id: 'apple',
      word: 'Apple',
      phonics: 'AP - PLE',
      ipa: '/ˈæp.əl/',
      meaning: '苹果',
      category: 'fruits',
      icon: '🍎',
      funFact: '一天一个红苹果，医生远远离开我！',
      sentence: 'I eat a sweet red apple every morning.',
      sentenceCn: '我每天早晨都吃一个香甜的红苹果。'
    },
    {
      id: 'banana',
      word: 'Banana',
      phonics: 'BA - NA - NA',
      ipa: '/bəˈnɑː.nə/',
      meaning: '香蕉',
      category: 'fruits',
      icon: '🍌',
      funFact: '香蕉弯弯的，像挂在天上的金色月亮！',
      sentence: 'The yellow banana is sweet and soft.',
      sentenceCn: '黄色的香蕉又香又软。'
    },
    {
      id: 'strawberry',
      word: 'Strawberry',
      phonics: 'STRAW - BER - RY',
      ipa: '/ˈstrɔː.bər.i/',
      meaning: '草莓',
      category: 'fruits',
      icon: '🍓',
      funFact: '草莓是唯一把小种子长在皮肤外面的水果！',
      sentence: 'Strawberry ice cream is super delicious!',
      sentenceCn: '草莓冰淇淋真是超级好吃！'
    },
    {
      id: 'orange',
      word: 'Orange',
      phonics: 'OR - ANGE',
      ipa: '/ˈɒr.ɪndʒ/',
      meaning: '橙子',
      category: 'fruits',
      icon: '🍊',
      funFact: '橙子不仅是一种多汁水果，也是一种灿烂的颜色！',
      sentence: 'Fresh orange juice is full of Vitamin C.',
      sentenceCn: '新鲜的橙汁富含丰富的维生素C。'
    },
    {
      id: 'watermelon',
      word: 'Watermelon',
      phonics: 'WA - TER - MEL - ON',
      ipa: '/ˈwɔː.təˌmel.ən/',
      meaning: '西瓜',
      category: 'fruits',
      icon: '🍉',
      funFact: '西瓜肚子里 90% 以上都是甘甜的水分！',
      sentence: 'We love eating chilled watermelon in summer.',
      sentenceCn: '夏天我们最喜欢吃清凉甜美的西瓜了。'
    },
    {
      id: 'milk',
      word: 'Milk',
      phonics: 'M - I - L - K',
      ipa: '/mɪlk/',
      meaning: '牛奶',
      category: 'fruits',
      icon: '🥛',
      funFact: '每天喝牛奶可以让我们的小骨头长得壮壮的！',
      sentence: 'Drinking warm milk helps me sleep well.',
      sentenceCn: '喝一杯温牛奶能帮助我睡个好觉。'
    },

    // 3. 缤纷色彩与形状 (Colors & Shapes)
    {
      id: 'red',
      word: 'Red',
      phonics: 'R - E - D',
      ipa: '/red/',
      meaning: '红色',
      category: 'colors',
      icon: '🔴',
      funFact: '红色是火焰与成熟小番茄的代表色！',
      sentence: 'Fire trucks and ripe cherries are bright red.',
      sentenceCn: '消防车和熟透的樱桃都是鲜艳的红色。'
    },
    {
      id: 'blue',
      word: 'Blue',
      phonics: 'B - L - U - E',
      ipa: '/bluː/',
      meaning: '蓝色',
      category: 'colors',
      icon: '🔵',
      funFact: '抬头看晴朗的天空和浩瀚的大海，都是蓝色！',
      sentence: 'The clear sky and deep ocean are both blue.',
      sentenceCn: '晴朗的天空和深邃的海洋都是蓝色的。'
    },
    {
      id: 'yellow',
      word: 'Yellow',
      phonics: 'YEL - LOW',
      ipa: '/ˈjel.əʊ/',
      meaning: '黄色',
      category: 'colors',
      icon: '🟡',
      funFact: '黄色就像温暖的阳光，让人感到快乐温暖！',
      sentence: 'The shining sun paints the morning yellow.',
      sentenceCn: '耀眼的太阳把清晨染成了金色温暖的黄色。'
    },
    {
      id: 'green',
      word: 'Green',
      phonics: 'G - R - E - E - N',
      ipa: '/ɡriːn/',
      meaning: '绿色',
      category: 'colors',
      icon: '🟢',
      funFact: '春天到了，大树和小草都披上了绿色的新衣！',
      sentence: 'The forest looks lovely with fresh green leaves.',
      sentenceCn: '森林里长满了翠绿欲滴的新树叶，非常美丽。'
    },
    {
      id: 'star',
      word: 'Star',
      phonics: 'S - T - A - R',
      ipa: '/stɑːr/',
      meaning: '星星 / 星形',
      category: 'colors',
      icon: '⭐',
      funFact: '夜空中的小星星其实都在千万公里外闪闪发光！',
      sentence: 'Twinkle twinkle little star in the night sky.',
      sentenceCn: '一闪一闪小星星，在夜空中眨眼睛。'
    },
    {
      id: 'circle',
      word: 'Circle',
      phonics: 'CIR - CLE',
      ipa: '/ˈsɜː.kəl/',
      meaning: '圆形',
      category: 'colors',
      icon: '⭕',
      funFact: '钟表、车轮和硬币都是圆圆的形状！',
      sentence: 'A ball is round just like a perfect circle.',
      sentenceCn: '皮球圆滚滚的，就像一个完美的圆形。'
    },

    // 4. 神奇大自然 (Nature & Sky)
    {
      id: 'sun',
      word: 'Sun',
      phonics: 'S - U - N',
      ipa: '/sʌn/',
      meaning: '太阳',
      category: 'nature',
      icon: '☀️',
      funFact: '太阳是地球光芒和温暖的超级能量站！',
      sentence: 'The warm sun rises in the east every morning.',
      sentenceCn: '温暖的太阳每天早晨从东方升起。'
    },
    {
      id: 'moon',
      word: 'Moon',
      phonics: 'M - O - O - N',
      ipa: '/muːn/',
      meaning: '月亮',
      category: 'nature',
      icon: '🌙',
      funFact: '月亮有时候像圆圆的盘子，有时候像弯弯的镰刀！',
      sentence: 'The silver moon glows softly at night.',
      sentenceCn: '银色的月亮在夜晚散发着柔和的光芒。'
    },
    {
      id: 'rainbow',
      word: 'Rainbow',
      phonics: 'RAIN - BOW',
      ipa: '/ˈreɪn.bəʊ/',
      meaning: '彩虹',
      category: 'nature',
      icon: '🌈',
      funFact: '阳光穿过小雨滴时，就会在空中架起七彩桥！',
      sentence: 'A magnificent rainbow appeared after the rain.',
      sentenceCn: '雨过天晴后，天空中出现了一道壮丽的彩虹。'
    },
    {
      id: 'flower',
      word: 'Flower',
      phonics: 'FLOW - ER',
      ipa: '/ˈflaʊ.ər/',
      meaning: '花朵',
      category: 'nature',
      icon: '🌸',
      funFact: '盛开的花朵散发花香，吸引勤劳的小蜜蜂采蜜！',
      sentence: 'The colorful flower blooms brightly in spring.',
      sentenceCn: '五彩斑斓的花朵在春天灿烂盛开。'
    },
    {
      id: 'tree',
      word: 'Tree',
      phonics: 'T - R - E - E',
      ipa: '/triː/',
      meaning: '大树',
      category: 'nature',
      icon: '🌳',
      funFact: '大树为我们制造新鲜清爽的氧气，是小鸟温暖的家！',
      sentence: 'Birds build their cozy nests high in the tree.',
      sentenceCn: '小鸟们在大树高处筑起了舒适温暖的窝。'
    },

    // 5. 生活与玩具 (Daily & Toys)
    {
      id: 'book',
      word: 'Book',
      phonics: 'B - O - O - K',
      ipa: '/bʊk/',
      meaning: '书本',
      category: 'daily',
      icon: '📖',
      funFact: '书本就像一扇神奇的任意门，带你游历奇妙世界！',
      sentence: 'Reading a story book opens up great adventures.',
      sentenceCn: '阅读一本故事书能开启无限精彩的冒险。'
    },
    {
      id: 'car',
      word: 'Car',
      phonics: 'C - A - R',
      ipa: '/kɑːr/',
      meaning: '小汽车',
      category: 'daily',
      icon: '🚗',
      funFact: '小汽车有四个圆滚滚的轮子，跑得又快又稳！',
      sentence: 'The little toy car zooms across the playroom floor.',
      sentenceCn: '小玩具车在游戏室地板上飞快地驶过。'
    },
    {
      id: 'ball',
      word: 'Ball',
      phonics: 'B - A - L - L',
      ipa: '/bɔːl/',
      meaning: '皮球',
      category: 'daily',
      icon: '⚽',
      funFact: '拍皮球的时候，弹性气压会让球高高弹起！',
      sentence: 'Children love kicking the soccer ball in the park.',
      sentenceCn: '孩子们喜欢在公园里踢足球。'
    },
    {
      id: 'clock',
      word: 'Clock',
      phonics: 'C - L - O - C - K',
      ipa: '/klɒk/',
      meaning: '时钟',
      category: 'daily',
      icon: '⏰',
      funFact: '钟表的指针滴答滴答走，提醒我们珍惜宝贵时间！',
      sentence: 'The alarm clock rings cheerful tunes to wake us up.',
      sentenceCn: '闹钟欢快地响起，叫我们早早起床。'
    },

    // 6. 快乐动作 (Fun Actions)
    {
      id: 'jump',
      word: 'Jump',
      phonics: 'J - U - M - P',
      ipa: '/dʒʌmp/',
      meaning: '跳跃',
      category: 'actions',
      icon: '🦘',
      funFact: '跳一跳能促进血液循环，让我们长得更高！',
      sentence: 'Let us jump high together with joy!',
      sentenceCn: '让我们一起开心地高高跳起来吧！'
    },
    {
      id: 'run',
      word: 'Run',
      phonics: 'R - U - N',
      ipa: '/rʌn/',
      meaning: '奔跑',
      category: 'actions',
      icon: '🏃',
      funFact: '跑步不仅能锻炼心肺，还能释放快乐荷尔蒙！',
      sentence: 'The energetic puppies run fast on the lawn.',
      sentenceCn: '活力满满的小狗在草坪上飞快地奔跑。'
    },
    {
      id: 'sing',
      word: 'Sing',
      phonics: 'S - I - N - G',
      ipa: '/sɪŋ/',
      meaning: '唱歌',
      category: 'actions',
      icon: '🎤',
      funFact: '唱歌会让心情变美妙，还能锻炼发音和语感！',
      sentence: 'We love to sing cheerful English songs every day.',
      sentenceCn: '我们每天都喜欢唱欢快的英语儿歌。'
    },
    {
      id: 'smile',
      word: 'Smile',
      phonics: 'S - M - I - L - E',
      ipa: '/smaɪl/',
      meaning: '微笑',
      category: 'actions',
      icon: '😊',
      funFact: '微笑是全世界通用的魔法超能力！',
      sentence: 'A bright smile makes everyone feel happy and warm.',
      sentenceCn: '灿烂的微笑会让每一个人感到幸福和温暖。'
    }
  ]
};

// 学习成就与贴纸定义
const BADGES_CONFIG = [
  { id: 'first_word', title: '初探小天才', desc: '学习并掌握第 1 个英语单词', icon: '🌱', reqStars: 3 },
  { id: 'animal_master', title: '森林百晓生', desc: '认识全部动物世界单词', icon: '🦁', reqStars: 15 },
  { id: 'fruit_lover', title: '果蔬美食家', desc: '学会全部美味果蔬词汇', icon: '🍉', reqStars: 25 },
  { id: 'spelling_bee', title: '拼词小神童', desc: '在拼字积木游戏中通关 5 次', icon: '🧩', reqStars: 35 },
  { id: 'super_ear', title: '听力顺风耳', desc: '在听音辨图游戏中获得 100 分', icon: '🎧', reqStars: 50 },
  { id: 'pronounce_king', title: '地道发音官', desc: '成功使用麦克风跟读 5 次满星', icon: '🎙️', reqStars: 70 },
  { id: 'galaxy_star', title: '英语小霸王', desc: '收集满 100 颗金色星星！', icon: '👑', reqStars: 100 }
];
