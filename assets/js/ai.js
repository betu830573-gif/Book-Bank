"use strict";
const API_KEY = "AIzaSyBC4DiJJUsFBoiYLOTstcURkcnpf2LqY";
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

// =====================
// DEPARTMENT KEYWORDS
// =====================
const DEPT_KEYWORDS = {
    "Computer Science": [
        "data structures algorithms",
        "operating systems",
        "computer networks",
        "database management systems",
        "artificial intelligence",
        "machine learning"
    ],
    "Mechanical Engineering": [
        "thermodynamics",
        "fluid mechanics",
        "machine design",
        "strength of materials"
    ],
    "Electrical Engineering": [
        "electric circuits",
        "power systems",
        "control systems",
        "digital electronics"
    ],
    "Civil Engineering": [
        "structural analysis",
        "soil mechanics",
        "concrete technology",
        "surveying"
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
    // GOOGLE BOOKS BY DEPARTMENT
    // =====================
    async fetchFromGoogleBooks(department, maxResults = 8) {
        try {
            const keywords = DEPT_KEYWORDS[department] || ["engineering textbook"];
            const keyword = keywords[Math.floor(Math.random() * keywords.length)];

            const cacheKey = `${department}_${keyword}`;
            if (this.cache[cacheKey]) return this.cache[cacheKey];

            const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(keyword + " textbook")}&maxResults=${maxResults}&printType=books&langRestrict=en`;

            const res = await fetch(url);
            const data = await res.json();

            if (!data.items) return [];

            const books = data.items.map(item => {
                const info = item.volumeInfo;

                return {
                    isbn: item.id,
                    title: info.title || "Unknown",
                    author: info.authors?.join(", ") || "Unknown",
                    department,
                    description: info.description?.slice(0, 150) || "",
                    cover_url:
                        info.imageLinks?.thumbnail ||
                        info.imageLinks?.smallThumbnail ||
                        "https://via.placeholder.com/150x200?text=No+Cover",
                    previewLink: info.previewLink || "#",
                    publishedDate: info.publishedDate || "N/A",
                    pageCount: info.pageCount || "N/A",
                    rating: info.averageRating || null,
                    source: "google_books"
                };
            });

            this.cache[cacheKey] = books;
            return books;

        } catch (err) {
            console.error("Google Books Error:", err);
            return [];
        }
    }

    // =====================
    // SEARCH BOOKS
    // =====================
    async searchGoogleBooks(query, maxResults = 10) {
        try {
            const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books`;

            console.log("Searching:", url);

            const res = await fetch(url);
            const data = await res.json();

            console.log("Response:", data);

            if (!data.items) return [];

            return data.items.map(item => {
                const info = item.volumeInfo;

                return {
                    isbn: item.id,
                    title: info.title || "Unknown",
                    author: info.authors?.join(", ") || "Unknown",
                    department: info.categories?.[0] || "General",
                    description: info.description?.slice(0, 200) || "",
                    cover_url:
                        info.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/150x200?text=No+Cover",
                    previewLink: info.previewLink || "#",
                    publishedDate: info.publishedDate || "N/A",
                    pageCount: info.pageCount || "N/A",
                    rating: info.averageRating || null,
                    source: "google_books"
                };
            });

        } catch (err) {
            console.error("Search Error:", err);
            return [];
        }
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
                        reason: "Trending",
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
// SAFE GLOBAL INIT (IMPORTANT FIX)
// =====================
window.addEventListener("DOMContentLoaded", () => {
    window.aiEngine = new BookRecommendationEngine();
    console.log("AI Engine Loaded Successfully");
});
