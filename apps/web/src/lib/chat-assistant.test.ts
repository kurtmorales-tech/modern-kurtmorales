import { describe, expect, test } from 'bun:test';
import {
  advanceConversation,
  buildContactPayload,
  createConversation,
  normalizeWebsite,
  type ConversationState,
} from './chat-assistant';

function advance(state: ConversationState, value: string) {
  const result = advanceConversation(state, value);
  expect(result.error).toBeUndefined();
  return result.state;
}

describe('KM site assistant conversation engine', () => {
  test('starts with a transparent scripted-assistant introduction and project choices', () => {
    const conversation = createConversation();

    expect(conversation.stage).toBe('goal');
    expect(conversation.reply.toLowerCase()).toContain('automated');
    expect(conversation.options).toEqual([
      'New restaurant website',
      'Redesign my current site',
      'Menu or ordering integration',
      'Something else',
    ]);
  });

  test('moves through the lead qualification flow without inventing booking availability', () => {
    let state = createConversation();
    state = advance(state, 'New restaurant website');
    expect(state.stage).toBe('restaurant');
    state = advance(state, 'Desert Fork');
    expect(state.stage).toBe('website');
    state = advance(state, 'desertfork.example');
    expect(state.lead.website).toBe('https://desertfork.example');
    state = advance(state, 'More reservations');
    expect(state.stage).toBe('budget');
    state = advance(state, '$3,000 – $7,000');
    state = advance(state, 'Within 1–2 months');
    state = advance(state, 'Kurt Morales');
    state = advance(state, 'kurt@example.com');
    state = advance(state, 'Tuesday afternoon');

    expect(state.stage).toBe('complete');
    expect(state.reply).toContain('requested consultation time');
    expect(state.reply).toContain('not confirmed');
  });

  test('rejects invalid email and keeps the visitor on the email step', () => {
    const state: ConversationState = {
      ...createConversation(),
      stage: 'email',
      lead: { name: 'Kurt Morales' },
    };

    const result = advanceConversation(state, 'not-an-email');

    expect(result.error).toContain('valid email');
    expect(result.state.stage).toBe('email');
  });

  test('accepts skip for optional website and preferred-time fields', () => {
    let state: ConversationState = { ...createConversation(), stage: 'website', lead: {} };
    state = advance(state, 'Skip');
    expect(state.lead.website).toBeUndefined();
    expect(state.stage).toBe('priority');

    state = {
      ...state,
      stage: 'consultation',
      lead: { ...state.lead, name: 'Kurt', email: 'kurt@example.com' },
    };
    state = advance(state, 'Skip for now');
    expect(state.stage).toBe('complete');
    expect(state.lead.preferredTime).toBeUndefined();
    expect(state.reply).not.toContain('requested consultation time');
  });

  test('normalizes website addresses and rejects unsafe schemes', () => {
    expect(normalizeWebsite('restaurant.example')).toBe('https://restaurant.example');
    expect(normalizeWebsite('https://restaurant.example/menu')).toBe(
      'https://restaurant.example/menu',
    );
    expect(normalizeWebsite('javascript:alert(1)')).toBeNull();
  });

  test('builds the existing contact API payload with a readable structured summary', () => {
    const payload = buildContactPayload({
      goal: 'Restaurant redesign',
      restaurant: 'Desert Fork',
      website: 'https://desertfork.example',
      priority: 'More reservations',
      budget: '$3,000 – $7,000',
      timeline: 'Within 1–2 months',
      name: 'Kurt Morales',
      email: 'kurt@example.com',
      preferredTime: 'Tuesday afternoon',
      sourcePath: '/services',
    });

    expect(payload.name).toBe('Kurt Morales');
    expect(payload.email).toBe('kurt@example.com');
    expect(payload.project).toBe('Restaurant redesign — Desert Fork');
    expect(payload.budget).toBe('$3,000 – $7,000');
    expect(payload.message).toContain('Preferred consultation time: Tuesday afternoon');
    expect(payload.message).toContain('Source page: /services');
  });
});
