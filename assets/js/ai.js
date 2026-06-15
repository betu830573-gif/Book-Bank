/**
 * AI-Based Book Recommendation Engine - Google Books API Integration
 * Author: Vivek Sen
 * Fixed: CORS handling, error fallback, proper API calls
 */

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// Department to Search Keywords
const DEPT_KEYWORDS = {
    'Computer Science': [
        'data structures algorithms', 'operating systems Tanenbaum',
        'database management systems Navathe', 'computer networks Forouzan',
        'software engineering Pressman', 'compiler design Aho',
        'artificial intelligence Russell', 'discrete mathematics Rosen'
    ],
    'Mechanical Engineering': [
        'fluid mechanics Cengel', 'thermodynamics engineering approach',
        'strength of materials Hibbeler', 'theory of machines Rattan',
        'manufacturing engineering Kalpakjian', 'heat transfer Holman',
        'engineering mechanics Meriam', 'machine design Shigley'
    ],
    'Electrical Engineering': [
        'electric circuits Nilsson', 'power systems engineering Stevenson',
        'control systems Ogata', 'electromagnetic theory Hayt',
        'digital electronics Morris Mano', 'signals systems Oppenheim',
        'electrical machines Chapman', 'power electronics Rashid'
    ],
    'Civil Engineering': [
        'structural analysis Bhavikatti', 'soil mechanics Das',
        'concrete technology Neville', 'surveying Punmia',
        'fluid mechanics civil Modi Seth', 'transportation engineering',
        'reinforced concrete design Pillai', 'environmental engineering'
    ]
};

// Fallback College Books (shown when API fails)
const FALLBACK_BOOKS = {
    'Computer Science': [
        { id: 'cs1', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', cover: 'https://covers.openlibrary.org/b/id/8739161-M.jpg', previewLink: 'https://books.google.com/books?id=aefUBQAAQBAJ', rating: 4.8 },
        { id: 'cs2', title: 'Clean Code', author: 'Robert C. Martin', cover: 'https://covers.openlibrary.org/b/id/8432182-M.jpg', previewLink: 'https://books.google.com/books?id=hjEFCAAAQBAJ', rating: 4.7 },
        { id: 'cs3', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', cover: 'https://covers.openlibrary.org/b/id/244092-M.jpg', previewLink: 'https://books.google.com/books?id=Pd-z64SJRBAC', rating: 4.5 },
        { id: 'cs4', title: 'Operating Systems Concepts', author: 'Abraham Silberschatz', cover: 'https://covers.openlibrary.org/b/id/8111070-M.jpg', previewLink: 'https://books.google.com/books?id=sJgBAAAAQBAJ', rating: 4.6 },
        { id: 'cs5', title: 'Database System Concepts', author: 'Henry F. Korth', cover: 'https://covers.openlibrary.org/b/id/7948915-M.jpg', previewLink: 'https://books.google.com/books?id=sbMkAAAAQBAJ', rating: 4.4 },
        { id: 'cs6', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', cover: 'https://covers.openlibrary.org/b/id/360724-M.jpg', previewLink: 'https://books.google.com/books?id=8jZBksh-bUMC', rating: 4.9 }
    ],
    'Mechanical Engineering': [
        { id: 'me1', title: 'Fluid Mechanics', author: 'Frank M. White', cover: 'https://covers.openlibrary.org/b/id/8395754-M.jpg', previewLink: 'https://books.google.com/books?id=qH1hk0cAWs4C', rating: 4.5 },
        { id: 'me2', title: 'Thermodynamics: An Engineering Approach', author: 'Yunus Cengel', cover: 'https://covers.openlibrary.org/b/id/8739160-M.jpg', previewLink: 'https://books.google.com/books?id=sth1rQEACAAJ', rating: 4.7 },
        { id: 'me3', title: 'Mechanics of Materials', author: 'Russell C. Hibbeler', cover: 'https://covers.openlibrary.org/b/id/8111071-M.jpg', previewLink: 'https://books.google.com/books?id=Pd-z64SJ0BAC', rating: 4.6 },
        { id: 'me4', title: 'Engineering Mechanics: Dynamics', author: 'J.L. Meriam', cover: 'https://covers.openlibrary.org/b/id/12345-M.jpg', previewLink: 'https://books.google.com/books?q=engineering+mechanics+dynamics', rating: 4.4 },
        { id: 'me5', title: 'Machine Design', author: 'V.B. Bhandari', cover: 'https://covers.openlibrary.org/b/id/23456-M.jpg', previewLink: 'https://books.google.com/books?q=machine+design+bhandari', rating: 4.5 },
        { id: 'me6', title: 'Manufacturing Engineering', author: 'Kalpakjian', cover: 'https://covers.openlibrary.org/b/id/34567-M.jpg', previewLink: 'https://books.google.com/books?q=manufacturing+engineering+kalpakjian', rating: 4.3 }
    ],
    'Electrical Engineering': [
        { id: 'ee1', title: 'Electric Circuits', author: 'James W. Nilsson', cover: 'https://covers.openlibrary.org/b/id/8111069-M.jpg', previewLink: 'https://books.google.com/books?id=51K3W0Jz8QL', rating: 4.6 },
        { id: 'ee2', title: 'Power System Analysis', author: 'Hadi Saadat', cover: 'https://covers.openlibrary.org/b/id/45678-M.jpg', previewLink: 'https://books.google.com/books?q=power+system+analysis+saadat', rating: 4.5 },
        { id: 'ee3', title: 'Digital Design', author: 'Morris Mano', cover: 'https://covers.openlibrary.org/b/id/56789-M.jpg', previewLink: 'https://books.google.com/books?q=digital+design+morris+mano', rating: 4.7 },
        { id: 'ee4', title: 'Control Engineering', author: 'Norman S. Nise', cover: 'https://covers.openlibrary.org/b/id/67890-M.jpg', previewLink: 'https://books.google.com/books?q=control+engineering+nise', rating: 4.4 },
        { id: 'ee5', title: 'Electromagnetics', author: 'William Hayt', cover: 'https://covers.openlibrary.org/b/id/78901-M.jpg', previewLink: 'https://books.google.com/books?q=engineering+electromagnetics+hayt', rating: 4.5 },
        { id: 'ee6', title: 'Power Electronics', author: 'Muhammad Rashid', cover: 'https://covers.openlibrary.org/b/id/89012-M.jpg', previewLink: 'https://books.google.com/books?q=power+electronics+rashid', rating: 4.6 }
    ],
    'Civil Engineering': [
        { id: 'ce1', title: 'Principles of Geotechnical Engineering', author: 'Braja M. Das', cover: 'https://covers.openlibrary.org/b/id/8111068-M.jpg', previewLink: 'https://books.google.com/books?id=51t2hIEX6jL', rating: 4.6 },
        { id: 'ce2', title: 'Reinforced Concrete Design', author: 'Pillai & Menon', cover: 'https://covers.openlibrary.org/b/id/90123-M.jpg', previewLink: 'https://books.google.com/books?q=reinforced+concrete+design+pillai', rating: 4.5 },
        { id: 'ce3', title: 'Structural Analysis', author: 'R.C. Hibbeler', cover: 'https://covers.openlibrary.org/b/id/12340-M.jpg', previewLink: 'https://books.google.com/books?q=structural+analysis+hibbeler', rating: 4.7 },
        { id: 'ce4', title: 'Fluid Mechanics & Hydraulics', author: 'Modi & Seth', cover: 'https://covers.openlibrary.org/b/id/23401-M.jpg', previewLink: 'https://books.google.com/books?q=fluid+mechanics+modi+seth', rating: 4.4 },
        { id: 'ce5', title: 'Surveying Vol. 1', author: 'B.C. Punmia', cover: 'https://covers.openlibrary.org/b/id/34012-M.jpg', previewLink: 'https://books.google.com/books?q=surveying+punmia', rating: 4.5 },
        { id: 'ce6', title: 'Transportation Engineering', author: 'L.R. Kadiyali', cover: 'https://covers.openlibrary.org/b/id/40123-M.jpg', previewLink: 'https://books.google.com/books?q=transportation+engineering+kadiyali', rating: 4.3 }
    ]
};

class BookRecommendationEngine {
    constructor() {
        this.cache = {};
        this.apiWorking = null; // null = not tested, true/false after test
    }

    // Test if Google Books API is accessible
    async testAPI() {
        if (this.apiWorking !== null) return this.apiWorking;
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000); // 5 sec timeout
            const resp = await fetch(`${GOOGLE_BOOKS_API}?q=test&maxResults=1`, { signal: controller.signal });
            clearTimeout(timeout);
            this.apiWorking = resp.ok;
        } catch (e) {
            this.apiWorking = false;
        }
        return this.apiWorking;
    }

    // Fetch from Google Books API
    async fetchFromGoogleBooks(department, maxResults = 6) {
        const keywords = DEPT_KEYWORDS[department] || ['engineering textbook college'];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        const cacheKey = department;

        if (this.cache[cacheKey]) return this.cache[cacheKey];

        const apiOk = await this.testAPI();
        if (!apiOk) {
            // Return fallback data
            return this.getFallbackBooks(department);
        }

        try {
            const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(keyword)}&maxResults=${maxResults}&printType=books&orderBy=relevance`;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 6000);
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);

            if (!response.ok) throw new Error('API response not ok');

            const data = await response.json();
            if (!data.items || data.items.length === 0) {
                return this.getFallbackBooks(department);
            }

            const books = data.items.map(item => {
                const info = item.volumeInfo;
                let cover = info.imageLinks
                    ? (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail)
                    : null;
                // Fix http to https for cover images
                if (cover) cover = cover.replace('http://', 'https://');

                return {
                    isbn: item.id,
                    title: info.title || 'Unknown Title',
                    author: info.authors ? info.authors.join(', ') : 'Unknown Author',
                    department: department,
                    description: info.description
                        ? info.description.substring(0, 120) + '...'
                        : 'A recommended college textbook.',
                    cover_url: cover || `https://via.placeholder.com/128x180/1d3557/ffffff?text=${encodeURIComponent(info.title ? info.title.substring(0,10) : 'Book')}`,
                    previewLink: info.previewLink || info.infoLink || `https://books.google.com/books?q=${encodeURIComponent(info.title || '')}`,
                    publishedDate: info.publishedDate || 'N/A',
                    pageCount: info.pageCount || 'N/A',
                    rating: info.averageRating || null,
                    available_quantity: 1,
                    total_quantity: 1,
                    source: 'google_books',
                    reason: `Top ${department} college textbook`
                };
            });

            this.cache[cacheKey] = books;
            return books;

        } catch (error) {
            console.warn('Google Books API unavailable, using fallback:', error.message);
            return this.getFallbackBooks(department);
        }
    }

    // Get fallback hardcoded books
    getFallbackBooks(department) {
        const books = FALLBACK_BOOKS[department] || FALLBACK_BOOKS['Computer Science'];
        return books.map(b => ({
            isbn: b.id,
            title: b.title,
            author: b.author,
            department: department,
            description: 'A highly recommended college textbook.',
            cover_url: b.cover,
            previewLink: b.previewLink,
            publishedDate: 'N/A',
            pageCount: 'N/A',
            rating: b.rating,
            available_quantity: 1,
            total_quantity: 1,
            source: 'google_books',
            reason: `Recommended ${department} textbook`
        }));
    }

    // Search Google Books
    async searchGoogleBooks(query, maxResults = 10) {
        if (!query) return [];

        const apiOk = await this.testAPI();
        if (!apiOk) {
            // Return filtered fallback across all departments
            const allFallback = Object.values(FALLBACK_BOOKS).flat();
            const q = query.toLowerCase();
            const filtered = allFallback.filter(b =>
                b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
            );
            return filtered.length > 0
                ? filtered.map(b => ({
                    isbn: b.id, title: b.title, author: b.author,
                    cover_url: b.cover, previewLink: b.previewLink,
                    rating: b.rating, source: 'google_books',
                    publishedDate: 'N/A', pageCount: 'N/A',
                    department: 'General'
                }))
                : this.getFallbackBooks('Computer Science').slice(0, 5);
        }

        try {
            const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books&orderBy=relevance`;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 6000);
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);

            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            if (!data.items) return [];

            return data.items.map(item => {
                const info = item.volumeInfo;
                let cover = info.imageLinks
                    ? (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail)
                    : null;
                if (cover) cover = cover.replace('http://', 'https://');

                return {
                    isbn: item.id,
                    title: info.title || 'Unknown Title',
                    author: info.authors ? info.authors.join(', ') : 'Unknown Author',
                    department: info.categories ? info.categories[0] : 'General',
                    cover_url: cover || `https://via.placeholder.com/128x180/1d3557/fff?text=Book`,
                    previewLink: info.previewLink || info.infoLink || `https://books.google.com/books?q=${encodeURIComponent(info.title || '')}`,
                    publishedDate: info.publishedDate || 'N/A',
                    pageCount: info.pageCount || 'N/A',
                    rating: info.averageRating || null,
                    source: 'google_books'
                };
            });

        } catch (error) {
            console.warn('Search API failed:', error.message);
            return this.getFallbackBooks('Computer Science').slice(0, 5);
        }
    }

    // AI Recommendations (Local DB + Google Books)
    async recommendForStudent(studentId) {
        let department = 'Computer Science';

        if (window.db) {
            const students = window.db.getStudents();
            const student = students.find(s => s.studentId === studentId);
            if (student) department = student.department;

            const allBooks = window.db.getBooks();
            const circulations = window.db.getCirculation();
            const studentHistory = student ? circulations.filter(c => c.studentId === studentId) : [];

            // Local DB scored books
            let localRecs = allBooks.map(book => {
                let score = 0;
                const activeRecord = studentHistory.find(c => c.isbn === book.isbn && c.status !== 'Returned');
                if (activeRecord) return null;

                if (book.department.toLowerCase() === department.toLowerCase()) score += 50;

                const pastDeptBorrows = studentHistory.filter(c => {
                    const b = allBooks.find(bk => bk.isbn === c.isbn);
                    return b && b.department === book.department;
                }).length;
                score += (pastDeptBorrows * 10);

                const globalCount = circulations.filter(c => c.isbn === book.isbn).length;
                score += (globalCount * 5);
                if (book.available_quantity > 0) score += 15;

                return { ...book, score, reason: 'Available in your college library', source: 'local' };
            }).filter(b => b !== null).sort((a, b) => b.score - a.score).slice(0, 2);

            // Google Books (6 books)
            const googleRecs = await this.fetchFromGoogleBooks(department, 6);
            return [...localRecs, ...googleRecs];
        }

        return await this.fetchFromGoogleBooks(department, 8);
    }
}

window.aiEngine = new BookRecommendationEngine();
