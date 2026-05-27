/**
 * Relational localStorage Database for the Book Bank Management System
 */

const DEFAULT_BOOKS = [
    {
        isbn: '978-0131103628',
        title: 'The C Programming Language',
        author: 'Brian W. Kernighan, Dennis M. Ritchie',
        department: 'Computer Science',
        total_quantity: 10,
        available_quantity: 10,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/4106nv1g3yL._SX396_BO1,204,203,200_.jpg'
    },
    {
        isbn: '978-0262033848',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        department: 'Computer Science',
        total_quantity: 8,
        available_quantity: 8,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/41T5H8u7fUL._SX382_BO1,204,203,200_.jpg'
    },
    {
        isbn: '978-0136061694',
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell, Peter Norvig',
        department: 'Computer Science',
        total_quantity: 6,
        available_quantity: 6,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/51d654P6-WL._SX379_BO1,204,203,200_.jpg'
    },
    {
        isbn: '978-0135114049',
        title: 'Fluid Mechanics',
        author: 'Russell C. Hibbeler',
        department: 'Mechanical Engineering',
        total_quantity: 5,
        available_quantity: 5,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/51zJ86G-jNL._SX397_BO1,204,203,200_.jpg'
    },
    {
        isbn: '978-0132133357',
        title: 'Thermodynamics: An Engineering Approach',
        author: 'Yunus A. Cengel, Michael A. Boles',
        department: 'Mechanical Engineering',
        total_quantity: 5,
        available_quantity: 5,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/41-Kq3H5J7L._SX398_BO1,204,203,200_.jpg'
    },
    {
        isbn: '978-0073380575',
        title: 'Electric Circuits',
        author: 'James W. Nilsson, Susan Riedel',
        department: 'Electrical Engineering',
        total_quantity: 7,
        available_quantity: 7,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/51K3W0Jz8QL._SX389_BO1,204,203,200_.jpg'
    },
    {
        isbn: '978-0132198011',
        title: 'Principles of Geotechnical Engineering',
        author: 'Braja M. Das',
        department: 'Civil Engineering',
        total_quantity: 4,
        available_quantity: 4,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/51t2hIEX6jL._SX397_BO1,204,203,200_.jpg'
    }
];

class BookBankDB {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem('students')) {
            localStorage.setItem('students', JSON.stringify([]));
        }
        if (!localStorage.getItem('books')) {
            localStorage.setItem('books', JSON.stringify(DEFAULT_BOOKS));
        }
        if (!localStorage.getItem('circulation')) {
            localStorage.setItem('circulation', JSON.stringify([]));
        }
        // Seed default Admin if not exist
        if (!localStorage.getItem('admins')) {
            localStorage.setItem('admins', JSON.stringify([
                { email: 'admin@bookbank.com', password: 'adminpassword', name: 'Dr. Sarah Carter' }
            ]));
        }
    }

    // --- Helper Methods ---
    getStudents() { return JSON.parse(localStorage.getItem('students')); }
    saveStudents(data) { localStorage.setItem('students', JSON.stringify(data)); }

    getBooks() { return JSON.parse(localStorage.getItem('books')); }
    saveBooks(data) { localStorage.setItem('books', JSON.stringify(data)); }

    getCirculation() { return JSON.parse(localStorage.getItem('circulation')); }
    saveCirculation(data) { localStorage.setItem('circulation', JSON.stringify(data)); }

    getAdmins() { return JSON.parse(localStorage.getItem('admins')); }

    // --- Student Auth ---
    signupStudent(studentId, name, email, password, department) {
        let students = this.getStudents();
        if (students.find(s => s.studentId === studentId || s.email === email)) {
            return { success: false, message: 'Student ID or Email already registered!' };
        }
        students.push({
            studentId,
            name,
            email,
            password, // In mock, plaintext password is fine, but structurally separated
            department,
            balanceDue: 0.00
        });
        this.saveStudents(students);
        return { success: true, message: 'Signup Successful! Please Login.' };
    }

    loginStudent(email, password) {
        let students = this.getStudents();
        let student = students.find(s => s.email === email && s.password === password);
        if (student) {
            sessionStorage.setItem('currentUser', JSON.stringify({ ...student, role: 'student' }));
            return { success: true, user: student };
        }
        return { success: false, message: 'Invalid Student Email or Password.' };
    }

    // --- Admin Auth ---
    loginAdmin(email, password) {
        let admins = this.getAdmins();
        let admin = admins.find(a => a.email === email && a.password === password);
        if (admin) {
            sessionStorage.setItem('currentUser', JSON.stringify({ ...admin, role: 'admin' }));
            return { success: true, user: admin };
        }
        return { success: false, message: 'Invalid Admin Email or Password.' };
    }

    // --- Logged-In User Actions ---
    logout() {
        sessionStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('currentUser'));
    }

    // --- Inventory Management ---
    addBook(isbn, title, author, department, quantity, coverUrl) {
        let books = this.getBooks();
        if (books.find(b => b.isbn === isbn)) {
            return { success: false, message: 'Book with this ISBN already exists.' };
        }
        books.push({
            isbn,
            title,
            author,
            department,
            total_quantity: parseInt(quantity),
            available_quantity: parseInt(quantity),
            cover_url: coverUrl || 'https://via.placeholder.com/150/1d3557/ffffff?text=No+Cover'
        });
        this.saveBooks(books);
        return { success: true, message: 'Book added successfully!' };
    }

    updateBookStock(isbn, increment) {
        let books = this.getBooks();
        let idx = books.findIndex(b => b.isbn === isbn);
        if (idx !== -1) {
            books[idx].total_quantity += increment;
            books[idx].available_quantity += increment;
            if (books[idx].available_quantity < 0) books[idx].available_quantity = 0;
            if (books[idx].total_quantity < 0) books[idx].total_quantity = 0;
            this.saveBooks(books);
        }
    }

    deleteBook(isbn) {
        let books = this.getBooks();
        let filtered = books.filter(b => b.isbn !== isbn);
        if (books.length === filtered.length) {
            return { success: false, message: 'Book not found.' };
        }
        this.saveBooks(filtered);
        return { success: true, message: 'Book deleted successfully!' };
    }

    // --- Circulation Workflow ---
    requestIssue(studentId, isbn) {
        let circs = this.getCirculation();
        let books = this.getBooks();
        let book = books.find(b => b.isbn === isbn);

        if (!book || book.available_quantity <= 0) {
            return { success: false, message: 'Book is currently out of stock!' };
        }

        // Check if student already has this active or pending issue
        let existing = circs.find(c => c.studentId === studentId && c.isbn === isbn && c.status !== 'Returned');
        if (existing) {
            return { success: false, message: 'You already have an active request or loan for this book.' };
        }

        circs.push({
            recordId: 'REC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            studentId,
            isbn,
            issueDate: null, // set upon admin approval
            dueDate: null,
            returnDate: null,
            fineApplied: 0,
            status: 'Pending'
        });

        this.saveCirculation(circs);
        return { success: true, message: 'Issue request submitted! Pending Admin approval.' };
    }

    approveIssue(recordId) {
        let circs = this.getCirculation();
        let books = this.getBooks();
        let record = circs.find(c => c.recordId === recordId);

        if (!record || record.status !== 'Pending') {
            return { success: false, message: 'Invalid or completed record.' };
        }

        let book = books.find(b => b.isbn === record.isbn);
        if (!book || book.available_quantity <= 0) {
            return { success: false, message: 'Book is no longer in stock.' };
        }

        // Update book stock
        book.available_quantity -= 1;
        this.saveBooks(books);

        // Update record
        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 14); // 14 days return period

        record.issueDate = today.toISOString().split('T')[0];
        record.dueDate = dueDate.toISOString().split('T')[0];
        record.status = 'Issued';

        this.saveCirculation(circs);
        return { success: true, message: 'Book issue approved successfully!' };
    }

    returnBook(recordId) {
        let circs = this.getCirculation();
        let books = this.getBooks();
        let record = circs.find(c => c.recordId === recordId);

        if (!record || record.status !== 'Issued') {
            return { success: false, message: 'Record not active for return.' };
        }

        let book = books.find(b => b.isbn === record.isbn);
        if (book) {
            book.available_quantity += 1;
            if (book.available_quantity > book.total_quantity) {
                book.available_quantity = book.total_quantity;
            }
            this.saveBooks(books);
        }

        const today = new Date();
        record.returnDate = today.toISOString().split('T')[0];
        record.status = 'Returned';

        // Calculate dynamic fine if overdue
        const dueDateObj = new Date(record.dueDate);
        const diffTime = today - dueDateObj;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
            const fine = diffDays * 1.00; // $1 fine per day
            record.fineApplied = fine;

            // Apply fine to Student account
            let students = this.getStudents();
            let student = students.find(s => s.studentId === record.studentId);
            if (student) {
                student.balanceDue += fine;
                this.saveStudents(students);
            }
        }

        this.saveCirculation(circs);
        return { success: true, message: 'Book returned successfully!' };
    }

    payFine(studentId, amount) {
        let students = this.getStudents();
        let student = students.find(s => s.studentId === studentId);
        if (!student) return { success: false, message: 'Student not found.' };

        student.balanceDue -= amount;
        if (student.balanceDue < 0) student.balanceDue = 0;
        this.saveStudents(students);
        return { success: true, message: 'Payment recorded successfully!' };
    }
}

// Global Single Instance
window.db = new BookBankDB();
