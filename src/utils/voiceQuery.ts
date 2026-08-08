/**
 * voiceQuery.ts — turn raw speech-to-text output into a clean search query.
 *
 * Speech recognizers transcribe filler words ("please show me biryani"),
 * append trailing punctuation, and mishear proper nouns ("biriyani",
 * "dominics"). This module strips the noise and expands common aliases so the
 * downstream search only ever sees meaningful terms. The search layer then
 * applies its own `normalizeSearchText` (punctuation folding) on top.
 */

// Common English stopwords + spoken filler/hedge words. Deliberately excludes
// food vocabulary (biryani, paneer, dosa...) and stays conservative so a
// legitimate two-word query like "veg momos" is never over-stripped.
const FILLER_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'for', 'of', 'to', 'in', 'on', 'at',
  'from', 'with', 'without', 'by', 'as', 'if', 'then', 'than', 'so', 'too',
  'do', 'does', 'did', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'will', 'would', 'shall', 'should', 'can', 'could',
  'may', 'might', 'must', 'it', 'its', 'this', 'that', 'these', 'those',
  'there', 'here', 'what', 'which', 'who', 'whom', 'where', 'when', 'why',
  'how', 'more', 'most', 'very', 'just', 'some', 'any', 'all', 'every',
  'each', 'both', 'few', 'many', 'much', 'another', 'other', 'one', 'two',
  'please', 'pls', 'show', 'me', 'us', 'we', 'you', 'your', 'my', 'our',
  'their', 'i', 'want', 'like', 'love', 'prefer', 'need', 'get', 'give',
  'find', 'search', 'order', 'try', 'let', 'say', 'saying', 'tell', 'speak',
  'talk', 'hello', 'hey', 'hi', 'yeah', 'yes', 'no', 'ok', 'okay', 'um',
  'uh', 'hmm', 'well', 'actually', 'basically', 'please', 'thanks', 'thank',
]);

/** Word-boundary-safe aliases: recognized speech → catalog-friendly form. */
const SYNONYMS: Record<string, string> = {
  'mc donalds': "mcdonald's",
  mcdonalds: "mcdonald's",
  dominics: "domino's",
  dominos: "domino's",
  biriyani: 'biryani',
  briyani: 'biryani',
  'chole bhature': 'chole bhature',
  'choley bhature': 'chole bhature',
  momos: 'momos',
  shawarma: 'shawarma',
  'chowmein': 'chow mein',
};

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Expand known aliases in a cleaned query. */
export function expandSynonyms(text: string): string {
  let out = text;
  for (const [from, to] of Object.entries(SYNONYMS)) {
    out = out.replace(new RegExp(`\\b${escapeRegex(from)}\\b`, 'gi'), to);
  }
  return out.trim();
}

/**
 * Clean a raw transcript for search:
 *  - lowercase, tokenize on whitespace,
 *  - strip leading/trailing punctuation per token (trailing periods, commas),
 *  - drop tokens shorter than 2 chars and filler/hedge words,
 *  - expand synonyms.
 */
export function cleanVoiceTranscript(raw: string | null | undefined): string {
  if (!raw) return '';

  const tokens = raw
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter((token) => token.length >= 2 && !FILLER_WORDS.has(token));

  return expandSynonyms(tokens.join(' '));
}
