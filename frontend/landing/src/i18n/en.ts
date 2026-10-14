// English copy. `Dict` (the type of this object) is the contract es.ts must satisfy.
// Strings that sit around a <cite> are split in two: [before, after].
export type PolicySection = { heading: string; text?: string; items?: { label: string; text: string }[] };
export type StageText = { name: string; line: string; goal: string; obstacles: string[]; skills: string[]; mastery: string; why: string };
const en = {
  self: { short: 'EN', name: 'English', switchLabel: 'Switch to English' },
  meta: {
    title: 'TenStages | Meditation training in ten stages',
    description:
      'A meditation app that guides you through the ten stages of The Mind Illuminated, from your first sit to deep peace and insight, with certified teachers.',
  },
  skip: 'Skip to content',
  logoLabel: 'TenStages, home',
  mainNav: 'Main',
  nav: { path: 'The path', app: 'The app', download: 'Download' },
  counter: { label: 'Position on the path', stage: 'Stage', of: 'of 10', off: 'Off the path' },
  stores: { appStore: 'Download on the', googlePlay: 'Get it on' },
  groups: { novice: 'Novice', skilled: 'Skilled', transition: 'Transition', adept: 'Adept' },
  home: {
    heroTitle: 'Ten stages from your first sit to a still mind.',
    lede: [
      'TenStages is a meditation trainer built on ',
      '. It shows which stage you are in, what to practice next and why it works, from your first sit to the deepest states of peace and insight.',
    ],
    statementLabel: 'Why a map',
    statement: 'Most meditation apps hand you a timer. TenStages hands you a map.',
    statementSub:
      'Where you are on the path, which obstacle is in the way, and the skill that gets you past it. Each session builds on the one before.',
    appTitle: 'Inside the app',
    shots: [
      { alt: 'The TenStages app on iPhone showing the stage 10 map: a winding path where a monk leads an elephant that turns from dark to white.', title: 'A map for every stage', text: 'Each of the ten stages has its own map, drawn from the traditional elephant path. You always see where you are and what lies ahead.' },
      { alt: 'The app explaining the mind system: conscious mind, sensory minds and the discriminating mind, drawn as a diagram.', title: 'How your mind works', text: 'Every stage adds a piece to a model of attention and awareness grounded in neuroscience. The model grows as your practice does.' },
      { alt: 'A guided meditation playing in the app: Awakening from mind wandering, the aha moment.', title: 'Guided by certified teachers', text: 'Guided meditations from certified teachers of The Mind Illuminated. Bring your doubts to them, and practice alongside the community.' },
    ],
    pathTitle: 'The ten stages',
    pathIntro: [
      '',
      ' divides meditation into ten stages in four groups: novice, skilled, transition and adept. Every stage has a clear goal, the obstacles you will meet, and the skills that carry you through. Walk it below.',
    ],
    stageMore: (n: number) => `Stage ${n} in detail`,
    stageSr: (n: number) => `Stage ${n}: `,
    letterTitle: 'Why we built it',
    letter: [
      'We wanted an app that explains what meditation really is: how your brain behaves while you sit, why the mind wanders, and how you can become happier with what you already have.',
      'We learn as much from the people practicing with us as they learn from the app. If it brings a little more peace into the world, it has done its job.',
    ],
    signOff: 'Attentively,',
    signName: 'The TenStages team',
  },
  stage: {
    title: (n: number, name: string) => `Stage ${n}: ${name}`,
    description: (n: number, goal: string, mastery: string) => `Stage ${n} of The Mind Illuminated in TenStages. Goal: ${goal} ${mastery}`,
    kicker: (group: string, n: number) => `${group}, stage ${n} of 10`,
    mapLabel: (n: number) => `Stage ${n} highlighted on the ten stage path`,
    goal: 'Goal',
    why: 'Why it works',
    obstacles: 'Obstacles you will meet',
    skills: 'Skills you will build',
    mastery: 'Ready for the next stage when',
    navLabel: 'Stages',
    prev: (n: number) => `Previous, stage ${n}`,
    next: (n: number) => `Next, stage ${n}`,
    backTo: 'Back to',
    allStages: 'The ten stages',
  },
  footer: {
    begin: 'Begin at stage one.',
    arrive: (n: number) => `Start at one. Arrive at ${n}.`,
    lede: 'Free to download on iPhone, iPad and Android.',
    questions: 'Questions, or something not working?',
    method: ['Method from ', ' by Culadasa (John Yates, PhD), Matthew Immergut and Jeremy Graves.'],
    privacy: 'Privacy policy',
    support: 'Support',
  },
  support: {
    title: 'Support',
    description: 'Get help with the TenStages meditation app: how to contact the team and what to tell us.',
    intro: 'Something not working in the app, or a question about how it works? Write to us.',
    write: 'Write to us',
    helpTitle: 'What helps us help you',
    help: [
      'The device and operating system you use (for example, iPhone 15 with iOS 18).',
      'The version of the app.',
      'What you were doing, what you expected and what happened instead.',
      'A screenshot, if you can.',
    ],
    dataTitle: 'Your data',
    data: 'How we collect and protect your information is explained in our',
    privacyLink: 'privacy policy',
  },
  privacy: {
    title: 'Privacy policy',
    description: 'How TenStages collects, uses, shares and protects your information when you use the TenStages meditation app.',
    contents: 'Contents',
    questions: 'Questions about this policy?',
    // Text supplied by the TenStages team. The source was cut off inside "Data security": paste the rest here.
    intro:
      'This Privacy Policy explains how TenStages (“we,” “us,” or “our”) collects, uses, shares, and protects user information when you use the TenStages Meditation App. We are committed to maintaining the privacy and confidentiality of your personal information. By accessing or using the App, you agree to the terms of this Privacy Policy.',
    sections: [
      {
        heading: 'Information we collect',
        items: [
          { label: 'Personal information', text: 'When you register and use the App, we may collect personal information, such as your name, email address, and other contact information. We may also collect payment information if you make any purchases within the App.' },
          { label: 'Usage information', text: 'We may collect information about your interactions with the App, including the meditations you complete, the features you use, and the content you access. This information may include device information, IP address, browser type, operating system, and other usage details.' },
        ],
      },
      {
        heading: 'How we use your information',
        items: [
          { label: 'Provide and improve the App', text: 'We use the collected information to deliver, personalize, and improve the functionality and user experience of the App. This includes providing you with access to meditation content, recommending relevant content, and enhancing the overall performance of the App.' },
          { label: 'Communication', text: 'We may use your contact information to communicate with you regarding the App, respond to your inquiries, provide customer support, and send you important notices or updates about the App.' },
          { label: 'Analytics and research', text: 'We may use the collected information for analytical purposes, such as understanding user behavior, usage patterns, and preferences. This helps us improve the App, develop new features, and conduct research to enhance our meditation offerings.' },
          { label: 'Legal compliance', text: 'We may use your information to comply with applicable laws, regulations, or legal processes, respond to lawful requests, and protect our rights or the rights of others.' },
        ],
      },
      {
        heading: 'Sharing of information',
        items: [
          { label: 'Service providers', text: 'We may engage trusted third-party service providers to perform certain functions on our behalf, such as hosting, data analysis, payment processing, or customer support. These providers have access to your information only to the extent necessary to perform these tasks on our behalf and are obligated to maintain the confidentiality and security of your information.' },
          { label: 'Aggregated or de-identified data', text: 'We may share aggregated or de-identified information with third parties for analytical, research, marketing, or other purposes. This information does not personally identify you.' },
          { label: 'Legal requirements', text: 'We may disclose your information if required to do so by law, or if we believe in good faith that such action is necessary to comply with legal obligations, protect our rights, investigate fraud, or respond to a government request.' },
          { label: 'Business transfers', text: 'In the event of a merger, acquisition, or any form of sale or transfer of some or all of our assets, your information may be transferred as part of the transaction. We will notify you via prominent notice on our website or within the App of any change in ownership or use of your personal information.' },
        ],
      },
      {
        heading: 'Data security',
        // TRUNCATED in the source after "unauthorized access, disclosure". Replace with the full section.
        text: 'We take reasonable measures to protect your personal information from unauthorized access and disclosure.',
      },
    ] as PolicySection[],
  },
  lost: {
    title: 'Off the path',
    description: 'This page does not exist. Return to the TenStages path and pick up where you left off.',
    heading: 'You stepped off the path.',
    text: 'It happens to everyone, usually around stage two. Notice it, and gently come back.',
    back: 'Return to the path',
  },
};
// Stage copy. Order = stage number; the group of each stage lives in i18n/index.ts.
export const stages: StageText[] = [
    {
      name: "Establishing a practice",
      line: "Sitting down every day is the whole first stage. Everything after it grows from this.",
      goal: "Build a consistent, daily meditation practice.",
      obstacles: [
        "Resistance",
        "Procrastination",
        "Fatigue",
        "Impatience",
        "Boredom"
      ],
      skills: [
        "Creating practice routines",
        "Setting specific goals",
        "Generating strong motivation",
        "Diligence"
      ],
      mastery: "You never miss a daily session.",
      why: "Most practices fail before they start. A fixed time, a fixed place and a short ritual remove the daily decision to sit, and a clear reason to practice keeps you coming back when sessions feel dull or pointless."
    },
    {
      name: "Interrupted attention",
      line: "You notice the mind has wandered, and you enjoy noticing. That small moment is the skill.",
      goal: "Shorten the periods of mind wandering and extend the time you stay with the breath.",
      obstacles: [
        "Mind wandering",
        "Monkey mind",
        "Impatience"
      ],
      skills: [
        "Reinforcing the moment you wake up from mind wandering",
        "Sustaining attention on the breath"
      ],
      mastery: "Most episodes of mind wandering last only a few seconds, while you stay with the breath for minutes.",
      why: "You cannot force the mind to stop wandering. What you can do is appreciate the moment you notice it has wandered. Rewarding that moment trains the unconscious mind to notice sooner, so each episode gets shorter on its own."
    },
    {
      name: "Extended attention",
      line: "Forgetting the breath happens less often, and drowsiness stops ending your sits.",
      goal: "Overcome forgetting and falling asleep.",
      obstacles: [
        "Distractions",
        "Forgetting",
        "Mind wandering",
        "Sleepiness"
      ],
      skills: [
        "Following and connecting the breath",
        "Labeling and checking in"
      ],
      mastery: "You rarely forget the breath or fall asleep.",
      why: "Attention keeps sliding away because it is not being checked. Labeling distractions and checking in often builds introspective awareness, the background alarm that catches forgetting before it happens."
    },
    {
      name: "Continuous attention",
      line: "The breath stays in the foreground. Pain, memories and strong dullness become things to work with.",
      goal: "Overcome gross distraction and strong dullness.",
      obstacles: [
        "Gross distraction",
        "Strong dullness",
        "Pain",
        "Emotions and memories surfacing"
      ],
      skills: [
        "Continuous introspective awareness",
        "Working with pain",
        "Purifying the mind"
      ],
      mastery: "Gross distractions no longer push the breath into the background.",
      why: "Once forgetting is gone, the remaining problem is strength. Continuous awareness lets you see a distraction or a dip in energy as it begins, and correct it early instead of after the breath has already faded."
    },
    {
      name: "Overcoming subtle dullness",
      line: "A pleasant, foggy calm is easy to mistake for depth. Here you learn to stay bright.",
      goal: "Overcome subtle dullness and increase the power of mindfulness.",
      obstacles: [
        "Subtle dullness"
      ],
      skills: [
        "Body scanning",
        "Experiencing the breath with the whole body"
      ],
      mastery: "You can sustain or even increase the vividness of the breath for a whole session.",
      why: "Subtle dullness feels pleasant, which is why it is easy to settle into. Expanding the scope of attention to the whole body, and noticing finer details of the breath, keeps the mind alert and makes perception vivid."
    },
    {
      name: "Subduing subtle distraction",
      line: "The background chatter quiets until only the breath is left in the field of attention.",
      goal: "Exclusive attention and the end of subtle distraction.",
      obstacles: [
        "Subtle distraction"
      ],
      skills: [
        "Experiencing the breath with the whole body",
        "Metacognitive introspective awareness"
      ],
      mastery: "Subtle distractions have almost disappeared, and attention stays exclusive and stable.",
      why: "When attention becomes exclusive, there is less competition for conscious awareness. Watching the state of the mind itself, not only the breath, lets you catch subtle distraction before it takes hold."
    },
    {
      name: "Exclusive attention",
      line: "Effort is no longer needed. Attention holds by itself and the mind starts to unify.",
      goal: "Effortless stable attention and introspective awareness.",
      obstacles: [
        "Boredom",
        "Restlessness",
        "Doubt",
        "Strange sensations"
      ],
      skills: [
        "Diligence",
        "Gradually letting go of effort"
      ],
      mastery: "Stable attention and awareness sustain themselves without effort.",
      why: "Up to now, stability has depended on constant effort. Here effort itself becomes the obstacle. Letting go gradually lets the unconscious parts of the mind take over the job, and the mind starts to work as one."
    },
    {
      name: "Mental pliancy",
      line: "The senses settle, the body goes quiet, and a steady meditative joy begins to arise.",
      goal: "Complete pacification of the senses and the arising of meditative joy.",
      obstacles: [
        "Strange sensations",
        "Involuntary movements",
        "Intense energy"
      ],
      skills: [
        "Sustaining effortless attention",
        "Letting energy currents run their course"
      ],
      mastery: "You reliably reach mental pliancy, pacified senses and meditative joy.",
      why: "With the mind unified, the senses stop competing for attention and quiet down. This is the ground from which pliancy and meditative joy arise, the result of the mind no longer fighting itself."
    },
    {
      name: "Mental and physical pliancy",
      line: "The excitement of joy matures into something calmer: tranquility, and a deep evenness.",
      goal: "Calm the intensity of meditative joy so tranquility and equanimity can grow.",
      obstacles: [
        "The intensity of joy itself"
      ],
      skills: [
        "Familiarity with the meditative state",
        "Patience"
      ],
      mastery: "You consistently evoke tranquility and equanimity when you sit.",
      why: "Joy is intense at first and can be destabilizing. Becoming familiar with it lets the excitement settle into a quieter happiness, with tranquility and equanimity as its natural companions."
    },
    {
      name: "Tranquility and equanimity",
      line: "The quiet does not end when the timer does. It comes with you into the rest of the day.",
      goal: "Let the qualities of the meditative state persist after you stand up.",
      obstacles: [
        "None in the usual sense: only continued practice"
      ],
      skills: [
        "Practicing in daily life",
        "Insight practice"
      ],
      mastery: "Tranquility, joy and equanimity persist between sits, in ordinary life.",
      why: "The aim was never only a good sit. When tranquility and equanimity remain after you stand up, they shape how you meet the rest of your life, and they prepare the ground for insight and awakening."
    }
  ];

export default { ...en, stages };
export type Dict = typeof en & { stages: StageText[] };
