export const pages = {
  // ── 共同幕 ──────────────────────────────────────────
  1: {
    id: 1,
    act: '第一幕',
    title: '褪色的日常',
    panels: [
      { text: '城市的色彩正在一點一點消失……', mood: 'grey', img: '/images/p1-1.png' },
      { text: '主角走在熟悉的街道上，感受著這份沉重的寂靜。', mood: 'grey', img: '/images/p1-2.png' },
    ],
    next: '2c',
  },
  2: {
    id: 2,
    act: '第二幕',
    title: '霓虹陷阱',
    panels: [
      { text: '轉進一條小巷，霓虹燈閃爍著詭異的光。', mood: 'neon', img: '/images/pC1.png' },
      { text: '他遞出一瓶發光的液體，低聲說：「喝下去，就能忘記所有煩惱。」', mood: 'neon', img: '/images/pC2.png' },
    ],
    next: '2c',
  },
  '2c': {
    id: '2c',
    act: '第二幕',
    title: '霓虹陷阱',
    isChoice: true,
    choices: [
      {
        key: 'A',
        label: '挺身而出',
        desc: '走上前，直接面對霧爵士。',
        next: 'A1',
        color: '#e05555',
        img: '/images/option1.png',
      },
      {
        key: 'B',
        label: '繼續觀察',
        desc: '退到暗處，靜靜偷聽。',
        next: 'B1',
        color: '#d4a017',
        img: '/images/option2.png',
      },
      {
        key: 'D',
        label: '走向霧爵士',
        desc: '好奇地靠近，想了解他的故事。',
        next: 'D1',
        color: '#9b59b6',
        img: '/images/option3.png',
      },
    ],
  },

  // ── 路線 A ──────────────────────────────────────────
  A1: {
    id: 'A-1',
    act: '路線 A',
    title: '覺醒',
    route: 'A',
    panels: [
      { text: '你大步走上前，擋在那個孩子面前。', mood: 'red', img: '/images/pA1.png' },
      { text: '「住手！」你的聲音在巷弄間迴響。', mood: 'red', img: '/images/pA2.png' },
    ],
    isEnding: true,
    endingKey: 'good1',
  },

  // ── 路線 B ──────────────────────────────────────────
  B1: {
    id: 'B-1',
    act: '路線 B',
    title: '偷聽',
    route: 'B',
    panels: [
      { text: '你躲在牆角，屏住呼吸。', mood: 'grey', img: '/images/pB1.png' },
      { text: '霧爵士的聲音越來越遠，那個孩子的身影也消失在霧中。', mood: 'grey', img: '/images/pB2.png' },
    ],
    isEnding: true,
    endingKey: 'bad1',
  },

  // ── 路線 D ──────────────────────────────────────────
  D1: {
    id: 'D-1',
    act: '路線 D',
    title: '追問動機',
    route: 'D',
    panels: [
      { text: '「你為什麼要這樣做？」你直視著霧爵士的眼睛。', mood: 'purple', img: '/images/pC1.png' },
      { text: '「因為……我也曾經是那個孩子。」', mood: 'purple', img: '/images/pC2.png' },
    ],
    isEnding: true,
    endingKey: 'special4',
  },
};

export const endings = {
  good1: {
    key: 'good1',
    emoji: '✨',
    badge: '好結局 1',
    title: '同理心的花',
    message: '關心的話，比指責更有力量。',
    description: '紫錐花的光芒從巷弄蔓延到整座城市，全城恢復了色彩，花瓣在空中飄落。',
    cityState: '全城恢復，花瓣飄落',
    type: 'good',
    choiceKey: 'A',
    img: '/images/pA2.png',
  },
  bad1: {
    key: 'bad1',
    emoji: '🌑',
    badge: '壞結局 1',
    title: '沉默的代價',
    message: '沉默比想的更重，但仍可以求助。',
    description: '城市大片灰暗，街燈一盞一盞熄滅。但在最深的黑暗裡，仍有一扇門微微透著光。',
    cityState: '城市大片灰暗，有出口提示',
    type: 'bad',
    choiceKey: 'B',
    img: '/images/pB1.png',
  },
  special4: {
    key: 'special4',
    emoji: '💜',
    badge: '特殊結局 4',
    title: '霧爵士的眼淚',
    message: '理解，讓改變有了可能。',
    description: '霧爵士的眼角滑落一滴淚，煙霧緩緩散去。連最暗的角落，也有了光。',
    cityState: '連最暗的角落也有光',
    type: 'special',
    choiceKey: 'D',
    img: '/images/pD1.png',
  },
};
