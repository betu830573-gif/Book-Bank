/**
 * AI-Based Book Recommendation Engine (STABLE VERSION)
 * Google Books API + Local DB Hybrid
 */

const API_KEY = "AIzaSyBC4DiJJUsHQFBoiYLOTstcURkcnpf2LqY";
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

const DEPT_KEYWORDS = {
    'Computer Science': [
        'data structures algorithms', 'operating systems', 'computer networks',
        'database management systems', 'software engineering', 'artificial intelligence',
        'machine learning', 'compiler design', 'computer organization'
    ],
    'Mechanical Engineering': [
        'fluid mechanics engineering', 'thermodynamics engineering', 'machine design',
        'manufacturing technology', 'strength of materials'
    ],
    'Electrical Engineering': [
        'electric circuits engineering', 'power systems', 'control systems',
        'digital electronics', 'signals systems'
    ],
    'Civil Engineering': [
        'structural analysis', 'soil mechanics', 'concrete technology',
        'surveying engineering', 'transportation engineering'
    ]
};

class BookRecommendationEngine {
    constructor() {
        this.cache = {};
    }

    async fetchFromGoogleBooks(department, maxResults = 6) {
        const keywords = DEPT_KEYWORDS[department] || ['engineering textbook'];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        const cacheKey = `${department}_${keyword}`;

        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        try {
            const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(keyword + " college textbook")}&maxResults=${maxResults}&printType=books&langRestrict=en&key=${API_KEY}`;

            const res = await fetch(url);

            if (!res.ok) {
                console.warn("Google Books API failed:", res.status);
                return [];
            }

            const data = await res.json();

            if (!data || !data.items) return [];

            const books = data.items.map(item => {
                const info = item.volumeInfo || {};

                return {
                    isbn: item.id || "N/A",
                    title: info.title || "Unknown Title",
                    author: (info.authors || ["Unknown"]).join(", "),
                    department,
                    description: (info.description || "No description").substring(0, 120),
                    cover_url: info.imageLinks?.thumbnail || "https://via.placeholder.com/128x192",
                    previewLink: info.previewLink || "#",
                    publishedDate: info.publishedDate || "N/A",
                    pageCount: info.pageCount || 0,
                    rating: info.averageRating || 0,
                    available_quantity: 1,
                    total_quantity: 1,
                    source: "google_books",
                    reason: `Recommended ${department} textbook`
                };
            });

            this.cache[cacheKey] = books;
            return books;

        } catch (err) {
            console.error("Google Books Error:", err.message);
            return [];
        }
    }

    async recommendForStudent(studentId, callback) {
        if (!window.db) {
            callback?.([]);
            return [];
        }

        const students = window.db.getStudents() || [];
        const books = window.db.getBooks() || [];
        const circs = window.db.getCirculation() || [];

        const student = students.find(s => s.studentId === studentId);
        const dept = student?.department || "Computer Science";

        const history = circs.filter(c => c.studentId === studentId);

        // LOCAL RECOMMENDATION
        let local = books.map(book => {
            let score = 0;

            if (history.some(h => h.isbn === book.isbn && h.status !== "Returned")) {
                return null;
            }

            if (book.department === dept) score += 50;

            const popular = circs.filter(c => c.isbn === book.isbn).length;
            score += popular * 5;

            if (book.available_quantity > 0) score += 10;

            return {
                ...book,
                score,
                reason: "Matched with your department",
                source: "local"
            };
        }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 2);

        // GOOGLE BOOKS
        const google = await this.fetchFromGoogleBooks(dept, 5);

        const combined = [...local, ...google];

        callback?.(combined);
        return combined;
    }

    getLocalTrending() {
        if (!window.db) return [];

        const books = window.db.getBooks() || [];
        const circs = window.db.getCirculation() || [];

        return books.map(b => ({
            ...b,
            score: circs.filter(c => c.isbn === b.isbn).length,
            source: "local",
            reason: "Trending in library"
        })).sort((a, b) => b.score - a.score).slice(0, 5);
    }
}

window.aiEngine = new BookRecommendationEngine();
