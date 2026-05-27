/**
 * AI-Based Book Recommendation Engine for Book Bank Management System
 * Uses custom heuristics: Departmental Alignment, Borrowing Frequency, and Collaborative Trends.
 */

class BookRecommendationEngine {
    constructor() {}

    /**
     * Recommends books for a specific student based on their profile and borrowing history.
     * @param {string} studentId
     * @returns {Array} List of recommended books with recommendation scores & reasoning
     */
    recommendForStudent(studentId) {
        if (!window.db) {
            console.error("DB Engine not loaded.");
            return [];
        }

        const students = window.db.getStudents();
        const student = students.find(s => s.studentId === studentId);
        if (!student) {
            return this.getGeneralRecommendations();
        }

        const allBooks = window.db.getBooks();
        const circulations = window.db.getCirculation();

        // 1. Find all active/past books borrowed by this student
        const studentHistory = circulations.filter(c => c.studentId === studentId);
        const borrowedIsbns = new Set(studentHistory.map(c => c.isbn));

        // 2. Identify the student's department interest
        const department = student.department;

        // 3. Score every book in the library
        let scoredBooks = allBooks.map(book => {
            let score = 0;
            let reasons = [];

            // Skip books they already have out or have currently requested
            const activeRecord = studentHistory.find(c => c.isbn === book.isbn && c.status !== 'Returned');
            if (activeRecord) {
                return null;
            }

            // Metric A: Department Match (High Priority)
            if (book.department.toLowerCase() === department.toLowerCase()) {
                score += 50;
                reasons.push(`Aligned with your ${department} curriculum`);
            }

            // Metric B: Past Borrow Similarity (Category-based interest)
            // If they borrowed books of the same department previously, boost
            const pastDeptBorrows = studentHistory.filter(c => {
                const b = allBooks.find(bk => bk.isbn === c.isbn);
                return b && b.department === book.department;
            }).length;
            if (pastDeptBorrows > 0) {
                score += (pastDeptBorrows * 10);
                reasons.push(`Matches your active study topics`);
            }

            // Metric C: Overall Popularity (Collaborative Filtering mock)
            const globalCheckoutCount = circulations.filter(c => c.isbn === book.isbn).length;
            if (globalCheckoutCount > 0) {
                score += (globalCheckoutCount * 5);
                reasons.push(`Highly demanded by your peers`);
            }

            // Metric D: Availability Boost
            if (book.available_quantity > 0) {
                score += 15;
            } else {
                score -= 30; // Deprioritize out of stock books
            }

            return {
                ...book,
                score,
                reason: reasons.length > 0 ? reasons[0] : "Recommended course material"
            };
        }).filter(b => b !== null);

        // Sort by score descending and take top 4 recommendations
        scoredBooks.sort((a, b) => b.score - a.score);
        return scoredBooks.slice(0, 4);
    }

    /**
     * Fallback general trending recommendations
     */
    getGeneralRecommendations() {
        const allBooks = window.db.getBooks();
        const circulations = window.db.getCirculation();

        return allBooks.map(book => {
            const checkoutCount = circulations.filter(c => c.isbn === book.isbn).length;
            return {
                ...book,
                score: checkoutCount * 10,
                reason: checkoutCount > 0 ? "Trending across branches" : "Essential reference library textbook"
            };
        }).sort((a, b) => b.score - a.score).slice(0, 4);
    }
}

// Global Single Instance
window.aiEngine = new BookRecommendationEngine();
