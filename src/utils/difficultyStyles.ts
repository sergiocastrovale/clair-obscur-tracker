export const difficultyMappings = [
  {
    key: 'extremely hard',
    styles: {
      badge: 'bg-red-700 text-white',
      pill: 'bg-red-700',
      text: 'text-red-500',
    },
  },
  {
    key: 'very hard',
    styles: {
      badge: 'bg-red-500 text-white',
      pill: 'bg-red-500',
      text: 'text-red-400',
    },
  },
  {
    key: 'hard',
    styles: {
      badge: 'bg-orange-500 text-white',
      pill: 'bg-orange-500',
      text: 'text-orange-400',
    },
  },
  {
    key: 'medium',
    styles: {
      badge: 'bg-sky-500 text-white',
      pill: 'bg-sky-500',
      text: 'text-sky-400',
    },
  },
];

export const defaultStylesForUndefinedDifficulty = {
  badge: 'bg-zinc-600 text-zinc-100',
  pill: 'bg-zinc-500',
  text: 'text-zinc-100',
};

export const defaultStylesForUnmatchedDifficulty = {
  badge: 'bg-zinc-500 text-zinc-100',
  pill: 'bg-zinc-500',
  text: 'text-zinc-100',
};

export const getDifficultyStyles = (styleType: 'badge' | 'pill' | 'text', difficulty?: string): string => {
  if (!difficulty) {
    return defaultStylesForUndefinedDifficulty[styleType];
  }

  for (const mapping of difficultyMappings) {
    if (difficulty.toLowerCase().includes(mapping.key)) {
      return mapping.styles[styleType];
    }
  }

  return defaultStylesForUnmatchedDifficulty[styleType];
};
