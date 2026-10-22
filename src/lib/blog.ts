import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/config';
const order = ['kafka-spring-boot-production', 'monitoring-datadog-kubernetes', 'architecture-event-driven-java-kafka'];
export const postsFor = async (lang: Locale) => (await getCollection('blog', ({ data }) => data.lang === lang))
  .sort((a, b) => order.indexOf(a.data.translationKey) - order.indexOf(b.data.translationKey));
// Reading-time estimate, not a measured duration. Ignore frontmatter/code fences.
export const readingMinutes = (post: CollectionEntry<'blog'>) => Math.max(1, Math.ceil((post.body ?? '').replace(/```[\s\S]*?```/g, '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length / 200));
