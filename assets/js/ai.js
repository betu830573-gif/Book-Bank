"use strict";

// =====================
// APIs
// =====================
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
const OPEN_LIBRARY_API = "https://openlibrary.org/search.json";

// =====================
// DEPARTMENTS
// =====================
const DEPT_KEYWORDS = {
    "Computer Science": [
        "data structures", "operating systems", "computer networks",
        "database management", "machine learning"
    ],
    "Mechanical Engineering": [
        "thermodynamics", "fluid mechanics", "machine design"
    ],
    "Electrical Engineering": [
        "electric circuits", "power systems", "digital electronics"
    ],
    "Civil Engineering": [
        "structural analysis", "soil mechanics", "concrete technology"
    ]
};

// =====================
// ENGINE CLASS
// =====================
class BookRecommendationEngine {
    constructor() {
        this.cache = {};
    }

    // =====================
    // GOOGLE BOOKS
    // =====================
    async fetchFromGoogleBooks(query, maxResults = 8) {
        try {
            const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;

            const res = await fetch(url);
            const data = await res.json();

            if (!data.items || data.items.length === 0) return [];

            return data.items.map(item => {
                const info = item.volumeInfo;

                return {
                    isbn: item.id,
                    title: info.title || "Unknown",
                    author: info.authors?.join(", ") || "Unknown",
                    department: info.categories?.[0] || "General",
                    description: info.description?.slice(0, 150) || "",
                    cover_url:
                        info.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/150x200?text=No+Cover",
                    previewLink: info.previewLink || "#",
                    publishedDate: info.publishedDate || "N/A",
                    pageCount: info.pageCount || "N/A",
                    source: "google_books"
                };
            });

        } catch (err) {
            console.error("Google Books Error:", err);
            return [];
        }
    }

    // =====================
    // OPEN LIBRARY (BACKUP API)
    // =====================
    async fetchFromOpenLibrary(query, maxResults = 8) {
        try {
            const url = `${OPEN_LIBRARY_API}?q=${encodeURIComponent(query)}`;

            const res = await fetch(url);
            const data = await res.json();

            if (!data.docs || data.docs.length === 0) return [];

            return data.docs.slice(0, maxResults).map(item => {
                return {
                    isbn: item.key || "N/A",
                    title: item.title || "Unknown",
                    author: item.author_name?.join(", ") || "Unknown",
                    department: item.subject?.[0] || "General",
                    description: item.first_sentence?.[0] || "",
                    cover_url: item.cover_i
                        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
                        : "https://via.placeholder.com/150x200?text=No+Cover",
                    previewLink: `https://openlibrary.org${item.key}`,
                    publishedDate: item.first_publish_year || "N/A",
                    pageCount: "N/A",
                    source: "open_library"
                };
            });

        } catch (err) {
            console.error("OpenLibrary Error:", err);
            return [];
        }
    }

    // =====================
    // SMART HYBRID SEARCH
    // =====================
    async searchGoogleBooks(query, maxResults = 10) {
        try {
            let results = await this.fetchFromGoogleBooks(query, maxResults);

            // Fallback if empty
            if (!results || results.length === 0) {
                console.log("Google Books empty → switching to Open Library...");
                results = await this.fetchFromOpenLibrary(query, maxResults);
            }

            return results;

        } catch (err) {
            console.error("Search Error:", err);
            return [];
        }
    }

    // =====================
    // DEPARTMENT RECOMMENDATION
    // =====================
    async fetchFromGoogleBooksByDept(dept, maxResults = 8) {
        const keywords = DEPT_KEYWORDS[dept] || ["engineering books"];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];

        return await this.searchGoogleBooks(keyword, maxResults);
    }

    // =====================
    // TRENDING
    // =====================
    getLocalTrending() {
        try {
            if (!window.db) return [];

            const books = window.db.getBooks?.() || [];
            const circulations = window.db.getCirculation?.() || [];

            return books
                .map(book => {
                    const count = circulations.filter(c => c.isbn === book.isbn).length;

                    return {
                        ...book,
                        score: count * 10,
                        source: "local"
                    };
                })
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);

        } catch (err) {
            console.error("Trending Error:", err);
            return [];
        }
    }
}

// =====================
// SAFE INIT (NO CRASH)
// =====================
window.addEventListener("DOMContentLoaded", () => {
    window.aiEngine = new BookRecommendationEngine();
    console.log("AI Engine Loaded (Google + OpenLibrary)");
});
