/**
 * AI-Based Book Recommendation Engine for Book Bank Management System
 * Upgraded with Google Books API Integration
 * Author: Vivek Sen
 */

// ===== GOOGLE BOOKS API =====
const API_KEY = "AIzaSyBC4DiJJUsHQFBoiYLOTstcURkcnpf2LqY";
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

// Department to Search Keywords Mapping for College Books
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

class BookRecommendationEngine {
    constructor() {
        this.googleBooksCache = {};
    }

    /**
     * Fetch real college books from Google Books API based on department
     * @param {string} department
     * @param {number} maxResults
     * @returns {Promise<Array>}
     */
    async fetchFromGoogleBooks(department, maxResults = 8) {
        const keywords = DEPT_KEYWORDS[department] || ['engineering textbook'];

        // Pick a random keyword for variety
        const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
        const cacheKey = department + '_' + randomKeyword;

        // Use cache if available
        if (this.googleBooksCache[cacheKey]) {
            return this.googleBooksCache[cacheKey];
        }

        try {
            const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(randomKeyword + ' textbook college')}&maxResults=${maxResults}&printType=books&langRestrict=en&orderBy=relevance&key=${API_KEY}`;
             console.log("Request URL:", url);

const response = await fetch(url);

console.log("Status:", response.status);

if (!response.ok) {
    const errorText = await response.text();
    console.error(errorText);
    throw new Error(`HTTP Error: ${response.status}`);
}

const data = await response.json();
console.log(data);
            if (!data.items) return [];

            const books = data.items.map(item => {
                const info = item.volumeInfo;
                return {
                    isbn: item.id,
                    title: info.title || 'Unknown Title',
                    author: info.authors ? info.authors.join(', ') : 'Unknown Author',
                    department: department,
                    description: info.description ? info.description.substring(0, 150) + '...' : 'No description available.',
                    cover_url: info.imageLinks ? info.imageLinks.thumbnail : 'https://via.placeholder.com/128x192/1d3557/ffffff?text=No+Cover',
                    previewLink: info.previewLink || '#',
                    publishedDate: info.publishedDate || 'N/A',
                    pageCount: info.pageCount || 'N/A',
                    rating: info.averageRating || null,
                    available_quantity: 1,
                    total_quantity: 1,
                    source: 'google_books',
                    reason: `Top ${department} college textbook`
                };
            });

            this.googleBooksCache[cacheKey] = books;
            return books;

        } catch (error) {
            console.error('Google Books API Error:', error);
            return [];
        }
    }

    /**
     * Search Google Books API by query
     * @param {string} query
     * @param {number} maxResults
     * @returns {Promise<Array>}
     */
    async searchGoogleBooks(query, maxResults = 10) {
        try {
            const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books&langRestrict=en&key=${API_KEY}`;
             console.log("Request URL:", url);

const response = await fetch(url);

console.log("Status:", response.status);

if (!response.ok) {
    const errorText = await response.text();
    console.error(errorText);
    throw new Error(`HTTP Error: ${response.status}`);
}

const data = await response.json();
console.log(data);

            if (!data.items) return [];

            return data.items.map(item => {
                const info = item.volumeInfo;
                return {
                    isbn: item.id,
                    title: info.title || 'Unknown Title',
                    author: info.authors ? info.authors.join(', ') : 'Unknown Author',
                    department: info.categories ? info.categories[0] : 'General',
                    description: info.description ? info.description.substring(0, 200) + '...' : 'No description available.',
                    cover_url: info.imageLinks ? info.imageLinks.thumbnail : 'https://via.placeholder.com/128x192/1d3557/ffffff?text=No+Cover',
                    previewLink: info.previewLink || '#',
                    publishedDate: info.publishedDate || 'N/A',
                    pageCount: info.pageCount || 'N/A',
                    rating: info.averageRating || null,
                    available_quantity: 1,
                    total_quantity: 1,
                    source: 'google_books'
                };
            });
        } catch (error) {
            console.error('Google Books Search Error:', error);
            return [];
        }
    }

    /**
     * Get AI Recommendations for Student (Local DB + Google Books)
     * @param {string} studentId
     * @param {Function} callback - called with recommendations array
     */
    async recommendForStudent(studentId, callback) {
        if (!window.db) {
            console.error("DB Engine not loaded.");
            if (callback) callback([]);
            return;
        }

        const students = window.db.getStudents();
        const student = students.find(s => s.studentId === studentId);

        const department = student ? student.department : 'Computer Science';
        const allBooks = window.db.getBooks();
        const circulations = window.db.getCirculation();
        const studentHistory = student ? circulations.filter(c => c.studentId === studentId) : [];

        // --- Local DB Recommendations (scored) ---
        let localRecs = allBooks.map(book => {
            let score = 0;
            let reasons = [];

            const activeRecord = studentHistory.find(c => c.isbn === book.isbn && c.status !== 'Returned');
            if (activeRecord) return null;

            if (book.department.toLowerCase() === department.toLowerCase()) {
                score += 50;
                reasons.push(`Aligned with your ${department} curriculum`);
            }

            const pastDeptBorrows = studentHistory.filter(c => {
                const b = allBooks.find(bk => bk.isbn === c.isbn);
                return b && b.department === book.department;
            }).length;
            if (pastDeptBorrows > 0) {
                score += (pastDeptBorrows * 10);
                reasons.push(`Matches your active study topics`);
            }

            const globalCheckoutCount = circulations.filter(c => c.isbn === book.isbn).length;
            if (globalCheckoutCount > 0) {
                score += (globalCheckoutCount * 5);
                reasons.push(`Highly demanded by your peers`);
            }

            if (book.available_quantity > 0) score += 15;
            else score -= 30;

            return { ...book, score, reason: reasons.length > 0 ? reasons[0] : "Recommended course material", source: 'local' };
        }).filter(b => b !== null).sort((a, b) => b.score - a.score).slice(0, 2);

        // --- Google Books Recommendations ---
        const googleRecs = await this.fetchFromGoogleBooks(department, 6);

        // Combine: Local (top 2) + Google Books (top 6)
        const combined = [...localRecs, ...googleRecs];

        if (callback) callback(combined);
        return combined;
    }

    /**
     * Fallback general trending from local DB
     */
    getLocalTrending() {
        if (!window.db) return [];
        const allBooks = window.db.getBooks();
        const circulations = window.db.getCirculation();
        return allBooks.map(book => {
            const checkoutCount = circulations.filter(c => c.isbn === book.isbn).length;
            return {
                ...book,
                score: checkoutCount * 10,
                reason: checkoutCount > 0 ? "Trending across branches" : "Essential library textbook",
                source: 'local'
            };
        }).sort((a, b) => b.score - a.score).slice(0, 4);
    }
}

// Global Single Instance
window.aiEngine = new BookRecommendationEngine(); improvment delte nhoi
