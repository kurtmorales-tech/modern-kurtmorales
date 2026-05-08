import { describe, expect, it } from 'bun:test'
import { DEFAULT_RSS_SOURCES, type RssSource } from './rss-sources'

describe('DEFAULT_RSS_SOURCES', () => {
  it('has at least 5 sources', () => {
    expect(DEFAULT_RSS_SOURCES.length).toBeGreaterThanOrEqual(5)
  })

  it('every source has name, url, and topic', () => {
    for (const src of DEFAULT_RSS_SOURCES) {
      expect(typeof src.name).toBe('string')
      expect(src.name.length).toBeGreaterThan(0)
      expect(typeof src.url).toBe('string')
      expect(src.url).toMatch(/^https?:\/\//)
      expect(typeof src.topic).toBe('string')
      expect(src.topic.length).toBeGreaterThan(0)
    }
  })

  it('all URLs are unique', () => {
    const urls = DEFAULT_RSS_SOURCES.map((source) => source.url)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('all names are unique', () => {
    const names = DEFAULT_RSS_SOURCES.map((source) => source.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('all URLs look like feed URLs', () => {
    const rssPattern = /\/(rss|feed|atom|rss\.xml|feed\.xml|index\.xml)\/?$/i

    for (const src of DEFAULT_RSS_SOURCES) {
      const matches = rssPattern.test(src.url)
      if (!matches) {
        const url = new URL(src.url)
        const hasFeedSegment =
          url.pathname.includes('feed') ||
          url.pathname.includes('rss') ||
          url.pathname.endsWith('.xml')
        expect(hasFeedSegment).toBe(true)
      }
    }
  })

  it('matches RssSource type shape', () => {
    const src = DEFAULT_RSS_SOURCES[0] as RssSource
    expect(src).toHaveProperty('name')
    expect(src).toHaveProperty('url')
    expect(src).toHaveProperty('topic')
  })
})
