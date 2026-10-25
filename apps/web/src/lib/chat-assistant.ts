export type ChatStage =
  | 'goal'
  | 'restaurant'
  | 'website'
  | 'priority'
  | 'budget'
  | 'timeline'
  | 'name'
  | 'email'
  | 'consultation'
  | 'complete';

export type ChatLead = {
  goal?: string;
  restaurant?: string;
  website?: string;
  priority?: string;
  budget?: string;
  timeline?: string;
  name?: string;
  email?: string;
  preferredTime?: string;
  sourcePath?: string;
};

export type ConversationState = {
  stage: ChatStage;
  lead: ChatLead;
  reply: string;
  options: string[];
};

export type ConversationResult = {
  state: ConversationState;
  error?: string;
};

const prompts: Record<ChatStage, Pick<ConversationState, 'reply' | 'options'>> = {
  goal: {
    reply:
      "Hi — I'm KM's automated project assistant. I can help shape your restaurant website request and send it to our Las Vegas team. What can we help with?",
    options: [
      'New restaurant website',
      'Redesign my current site',
      'Menu or ordering integration',
      'Something else',
    ],
  },
  restaurant: {
    reply: 'What is the name of your restaurant or hospitality business?',
    options: [],
  },
  website: {
    reply: 'Do you have a current website? Paste the address, or skip this question.',
    options: ['Skip'],
  },
  priority: {
    reply: 'What is the most important result you want from the project?',
    options: [
      'More reservations',
      'More direct orders',
      'Promote catering or events',
      'Improve local visibility',
    ],
  },
  budget: {
    reply:
      'Which investment range is the closest fit? This only helps us recommend the right scope.',
    options: ['Under $1,000', '$1,000 – $3,000', '$3,000 – $7,000', '$7,000+'],
  },
  timeline: {
    reply: 'When would you ideally like to launch?',
    options: ['As soon as practical', 'Within 1–2 months', 'Within 3–4 months', 'Still exploring'],
  },
  name: {
    reply: 'Who should our team follow up with?',
    options: [],
  },
  email: {
    reply: 'What email should we use for the project follow-up?',
    options: [],
  },
  consultation: {
    reply:
      'Would you like to request a consultation time? Enter a preferred day and time with your time zone. Our team will confirm availability by email.',
    options: ['Skip for now'],
  },
  complete: {
    reply: 'Thanks — your project brief is ready. Our team will follow up by email.',
    options: [],
  },
};

const nextStage: Record<Exclude<ChatStage, 'complete'>, ChatStage> = {
  goal: 'restaurant',
  restaurant: 'website',
  website: 'priority',
  priority: 'budget',
  budget: 'timeline',
  timeline: 'name',
  name: 'email',
  email: 'consultation',
  consultation: 'complete',
};

const skipValues = new Set(['skip', 'skip for now', 'none', 'n/a']);

function withPrompt(stage: ChatStage, lead: ChatLead): ConversationState {
  const prompt = prompts[stage];
  const reply =
    stage === 'complete' && lead.preferredTime
      ? 'Thanks — your project brief is ready. Your requested consultation time is not confirmed until our team replies by email.'
      : prompt.reply;
  return { stage, lead, reply, options: prompt.options };
}

export function createConversation(sourcePath?: string): ConversationState {
  return withPrompt('goal', sourcePath ? { sourcePath } : {});
}

export function normalizeWebsite(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) return null;
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname) return null;
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function error(state: ConversationState, message: string): ConversationResult {
  return { state, error: message };
}

export function advanceConversation(
  current: ConversationState,
  rawValue: string,
): ConversationResult {
  if (current.stage === 'complete') return { state: current };

  const value = rawValue.trim().replace(/\s+/g, ' ');
  const isSkip = skipValues.has(value.toLowerCase());
  if (!value) return error(current, 'Please enter a response before continuing.');
  if (value.length > 500) return error(current, 'Please keep this response under 500 characters.');

  const lead = { ...current.lead };
  switch (current.stage) {
    case 'goal':
      lead.goal = value;
      break;
    case 'restaurant':
      lead.restaurant = value;
      break;
    case 'website': {
      if (!isSkip) {
        const website = normalizeWebsite(value);
        if (!website) return error(current, 'Enter a valid website address or choose Skip.');
        lead.website = website;
      }
      break;
    }
    case 'priority':
      lead.priority = value;
      break;
    case 'budget':
      lead.budget = value;
      break;
    case 'timeline':
      lead.timeline = value;
      break;
    case 'name':
      if (value.length < 2)
        return error(current, 'Please enter the name we should use for follow-up.');
      lead.name = value;
      break;
    case 'email': {
      const email = value.toLowerCase();
      if (!isValidEmail(email)) return error(current, 'Please enter a valid email address.');
      lead.email = email;
      break;
    }
    case 'consultation':
      if (!isSkip) lead.preferredTime = value;
      break;
  }

  return { state: withPrompt(nextStage[current.stage], lead) };
}

export function buildContactPayload(lead: ChatLead) {
  if (!lead.name || !lead.email) {
    throw new Error('Name and email are required before submitting a chat lead.');
  }

  const project = [lead.goal || 'Website inquiry', lead.restaurant].filter(Boolean).join(' — ');
  const lines = [
    'Submitted through the KM website assistant.',
    lead.restaurant && `Restaurant: ${lead.restaurant}`,
    lead.website && `Current website: ${lead.website}`,
    lead.priority && `Primary goal: ${lead.priority}`,
    lead.timeline && `Desired launch: ${lead.timeline}`,
    lead.preferredTime && `Preferred consultation time: ${lead.preferredTime}`,
    `Consultation status: ${lead.preferredTime ? 'Requested — not confirmed' : 'Not requested'}`,
    lead.sourcePath && `Source page: ${lead.sourcePath}`,
  ].filter(Boolean);

  return {
    name: lead.name,
    email: lead.email,
    project,
    budget: lead.budget,
    message: lines.join('\n'),
  };
}
