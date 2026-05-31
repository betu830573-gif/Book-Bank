/**
 * AI-Based Book Recommendation Engine for Book Bank System
 * Clean + Fixed + Production Safe Version
 * Author: Vivek Sen (Upgraded)
 */

"use strict";

// =====================
// GOOGLE BOOKS API
// =====================
const API_KEY = "AIzaSyBC4DiJJUsFBoiYLOTstcURkcnpf2LqY";
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

// =====================
// DEPARTMENT KEYWORDS
// =====================
const DEPT_KEYWORDS = {
    'Computer Science': [
        'data structures algorithms', 'operating systems', 'computer networks',
        'database management systems', 'software engineering', 'artificial intelligence',
        'machine learning', 'compiler design', 'computer organization'
    ],
    'Mechanical Engineering': [
        'fluid mechanics engineering', 'thermodynamics engineering', 'machine design',
        'manufacturing technology', 'strength of materials', 'theory of machines',
        'heat transfer engineering', 'engineering mechanics'
    ],
    'Electrical Engineering': [
        'electric circuits engineering', 'power systems engineering', 'control systems',
        'electromagnetic theory', 'digital electronics', 'signals systems',
        'electrical machines', 'power electronics'
    ],
    'Civil Engineering': [
        'structural analysis civil', 'soil mechanics geotechnical', 'concrete technology',
        'surveying engineering', 'fluid mechanics civil', 'transportation engineering',
        'environmental engineering', 'construction management'
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
    // FETCH GOOGLE BOOKS (BY DEPT)
    // =====================
    async fetchFromGoogleBooks(department, maxResults = 8) {
        const keywords = DEPT_KEYWORDS[department] || ['engineering textbook'];
        const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

        const cacheKey = `${department}_${randomKeyword}`;

        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        try {
            const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(
                randomKeyword + " textbook college"
            )}&maxResults=${maxResults}&printType=books&langRestrict=en&orderBy=relevance&key=${API_KEY}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Google API Error: ${response.status}`);
            }

            const data = await response.json();
            if (!data.items) return [];

            const books = data.items.map(item => {
                const info = item.volumeInfo;

                return {
                    isbn: item.id,
                    title: info.title || "Unknown Title",
                    author: info.authors?.join(", ") || "Unknown Author",
                    department,
                    description: info.description?.substring(0, 150) || "",
                    cover_url: info.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/128x192?text=No+Cover",
                    previewLink: info.previewLink || "#",
                    publishedDate: info.publishedDate || "N/A",
                    pageCount: info.pageCount || "N/A",
                    rating: info.averageRating || null,
                    source: "google_books",
                    available_quantity: 1,
                    total_quantity: 1,
                    reason: `Recommended for ${department}`
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
    // SEARCH GOOGLE BOOKS
    // =====================
    async searchGoogleBooks(query, maxResults = 10) {
        try {
            const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books&langRestrict=en&key=${API_KEY}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Search API Error: ${response.status}`);
            }

            const data = await response.json();
            if (!data.items) return [];

            return data.items.map(item => {
                const info = item.volumeInfo;

                return {
                    isbn: item.id,
                    title: info.title || "Unknown Title",
                    author: info.authors?.join(", ") || "Unknown Author",
                    department: info.categories?.[0] || "General",
                    description: info.description?.substring(0, 200) || "",
                    cover_url: info.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/128x192?text=No+Cover",
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
    // AI RECOMMENDATIONS
    // =====================
    async recommendForStudent(studentId) {
        try {
            if (!window.db) return [];

            const students = window.db.getStudents();
            const student = students.find(s => s.studentId === studentId);

            const department = student?.department || "Computer Science";

            const books = window.db.getBooks();
            const circulations = window.db.getCirculation();
            const history = circulations.filter(c => c.studentId === studentId);

            // =====================
            // LOCAL RECOMMENDATION
            // =====================
            let local = books.map(book => {
                let score = 0;

                const active = history.find(c =>
                    c.isbn === book.isbn && c.status !== "Returned"
                );

                if (active) return null;

                if (book.department === department) score += 50;

                const count = circulations.filter(c => c.isbn === book.isbn).length;
                score += count * 5;

                if (book.available_quantity > 0) score += 10;

                return {
                    ...book,
                    score,
                    source: "local",
                    reason: "Recommended based on your department"
                };
            }).filter(Boolean)
              .sort((a, b) => b.score - a.score)
              .slice(0, 3);

            // =====================
            // GOOGLE BOOKS
            // =====================
            const google = await this.fetchFromGoogleBooks(department, 5);

            // =====================
            // COMBINE RESULTS
            // =====================
            return [...local, ...google];

        } catch (err) {
            console.error("Recommendation Error:", err);
            return [];
        }
    }

    // =====================
    // TRENDING BOOKS
    // =====================
    getLocalTrending() {
        if (!window.db) return [];

        const books = window.db.getBooks();
        const circulations = window.db.getCirculation();

        return books.map(book => {
            const count = circulations.filter(c => c.isbn === book.isbn).length;

            return {
                ...book,
                score: count,
                source: "local",
                reason: "Trending in college"
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    }
}

// =====================
// GLOBAL ENGINE
// =====================
window.aiEngine = new BookRecommendationEngine();
