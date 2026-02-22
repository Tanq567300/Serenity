const RSSParser = require('rss-parser');

const parser = new RSSParser({
    timeout: 8000,
    headers: { 'User-Agent': 'Mansik-Mental-Wellness-App/1.0' },
});

// ─── RSS Feed Sources ───────────────────────────────────
const RSS_FEEDS = [
    { url: 'https://www.nimh.nih.gov/site-info/index-rss.atom', source: 'NIMH' },
    { url: 'https://mentalhealth.bmj.com/rss/mfr.xml', source: 'BMJ Mental Health' },
    { url: 'https://www.theguardian.com/society/depression/rss', source: 'The Guardian' },
];

// ─── Mood → Keyword Filter Map ──────────────────────────
const MOOD_KEYWORDS = {
    anxious: ['anxiety', 'anxious', 'panic', 'calm', 'breathing', 'worry', 'fear', 'nervous'],
    stressed: ['stress', 'burnout', 'overwhelm', 'relaxation', 'cope', 'pressure', 'exhaustion'],
    sad: ['depression', 'grief', 'sadness', 'hopeless', 'support', 'lonely', 'mood', 'sorrow'],
    happy: ['happiness', 'gratitude', 'joy', 'positive', 'thrive', 'wellbeing', 'flourish'],
    neutral: [],
};

// ─── Article Transform ──────────────────────────────────
function transformItem(item, sourceName) {
    const image =
        item.enclosure?.url ||
        item['media:content']?.$.url ||
        item['media:thumbnail']?.$.url ||
        null;

    return {
        id: item.link || item.guid,
        title: (item.title || '').trim(),
        description: (item.contentSnippet || item.summary || item.content || '')
            .replace(/<[^>]*>?/gm, '')
            .slice(0, 280)
            .trim(),
        image,
        url: item.link || item.guid || '',
        publishedAt: item.pubDate || item.isoDate || null,
        source: sourceName,
    };
}

// ─── Keyword Filter ─────────────────────────────────────
function matchesMood(item, keywords) {
    if (!keywords.length) return true;
    const haystack = `${item.title} ${item.description}`.toLowerCase();
    return keywords.some((kw) => haystack.includes(kw));
}

// ─── Core RSS Fetch ─────────────────────────────────────
async function fetchAllFeeds() {
    const results = await Promise.allSettled(
        RSS_FEEDS.map(async ({ url, source }) => {
            const feed = await parser.parseURL(url);
            return (feed.items || []).map((item) => transformItem(item, source));
        })
    );

    const allArticles = [];
    results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
            allArticles.push(...result.value);
        } else {
            console.warn(`[Articles] RSS feed "${RSS_FEEDS[i].source}" failed:`, result.reason?.message);
        }
    });

    if (allArticles.length === 0) {
        throw new Error('All RSS feeds failed.');
    }

    return allArticles;
}

// ─── Build Article List ─────────────────────────────────
function buildArticleList(allArticles, mood) {
    const keywords = MOOD_KEYWORDS[mood] || [];

    let filtered = allArticles.filter((a) => matchesMood(a, keywords));

    if (filtered.length < 5) {
        const rest = allArticles.filter((a) => !matchesMood(a, keywords));
        filtered = [...filtered, ...rest];
    }

    filtered.sort(() => 0.5 - Math.random());

    const seenUrls = new Set();
    const sourceCount = {};
    const articles = [];

    for (const article of filtered) {
        if (!article.url || seenUrls.has(article.url)) continue;

        const count = sourceCount[article.source] || 0;

        if (count >= 2) continue;

        seenUrls.add(article.url);
        sourceCount[article.source] = count + 1;
        articles.push(article);

        if (articles.length === 5) break;
    }

    return articles;
}

// ─── Main Export ────────────────────────────────────────
async function getArticles(mood) {
    const allArticles = await fetchAllFeeds();
    const articles = buildArticleList(allArticles, mood);

    return {
        articles,
        cacheStatus: 'LIVE',
    };
}

module.exports = { getArticles };