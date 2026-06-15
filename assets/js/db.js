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
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/4106nv1g3yL._SX396_BO1,204,203,200_.jpg',
        read_url: '',
        download_url: 'https://openlibrary.org/works/OL20940766W'
    },
    {
        isbn: '978-0262033848',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        department: 'Computer Science',
        total_quantity: 8,
        available_quantity: 8,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/41T5H8u7fUL._SX382_BO1,204,203,200_.jpg',
        read_url: '',
        download_url: 'https://openlibrary.org/search?isbn=9780262033848'
    },
    {
        isbn: '978-0136061694',
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell, Peter Norvig',
        department: 'Computer Science',
        total_quantity: 6,
        available_quantity: 6,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/51d654P6-WL._SX379_BO1,204,203,200_.jpg',
        read_url: '',
        download_url: 'https://openlibrary.org/search?isbn=9780136061694'
    },
    {
        isbn: '978-0135114049',
        title: 'Fluid Mechanics',
        author: 'Russell C. Hibbeler',
        department: 'Mechanical Engineering',
        total_quantity: 5,
        available_quantity: 5,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/51zJ86G-jNL._SX397_BO1,204,203,200_.jpg',
        read_url: '',
        download_url: 'https://openlibrary.org/search?q=fluid+mechanics+hibbeler'
    },
    {
        isbn: '978-0132133357',
        title: 'Thermodynamics: An Engineering Approach',
        author: 'Yunus A. Cengel, Michael A. Boles',
        department: 'Mechanical Engineering',
        total_quantity: 5,
        available_quantity: 5,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/41-Kq3H5J7L._SX398_BO1,204,203,200_.jpg',
        read_url: '',
        download_url: 'https://openlibrary.org/search?q=thermodynamics+cengel+boles'
    },
    {
        isbn: '978-0073380575',
        title: 'Electric Circuits',
        author: 'James W. Nilsson, Susan Riedel',
        department: 'Electrical Engineering',
        total_quantity: 7,
        available_quantity: 7,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/51K3W0Jz8QL._SX389_BO1,204,203,200_.jpg',
        read_url: '',
        download_url: 'https://openlibrary.org/search?isbn=9780073380575'
    },
    {
        isbn: '978-0132198011',
        title: 'Principles of Geotechnical Engineering',
        author: 'Braja M. Das',
        department: 'Civil Engineering',
        total_quantity: 4,
        available_quantity: 4,
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/51t2hIEX6jL._SX397_BO1,204,203,200_.jpg',
        read_url: '',
        download_url: 'https://openlibrary.org/search?q=geotechnical+engineering+das'
    }
];

class BookBankDB {
    constructor() {
        this.firebaseEnabled = false;
        this.firestore = null;
        this.initFirebase();
        this.init();
    }

    initFirebase() {
        if (window.firebase && window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.apiKey && window.FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY") {
            try {
                window.firebase.initializeApp(window.FIREBASE_CONFIG);
                this.firestore = window.firebase.firestore();
                this.firebaseEnabled = true;
                console.log("Firebase Cloud Sync initialized successfully!");
                this.syncFromCloud();
            } catch (e) {
                console.error("Failed to initialize Firebase:", e);
            }
        } else {
            console.log("Firebase Config not set or invalid. Running in offline/localStorage mode.");
        }
    }

    async syncFromCloud() {
        if (!this.firebaseEnabled) return;
        try {
            // 1. Fetch Students
            const studentsSnap = await this.firestore.collection('students').get();
            const students = [];
            studentsSnap.forEach(doc => students.push(doc.data()));
            if (students.length > 0) this.saveStudents(students);

            // 2. Fetch Books
            const booksSnap = await this.firestore.collection('books').get();
            const books = [];
            booksSnap.forEach(doc => books.push(doc.data()));
            if (books.length > 0) this.saveBooks(books);

            // 3. Fetch Circulation
            const circsSnap = await this.firestore.collection('circulation').get();
            const circs = [];
            circsSnap.forEach(doc => circs.push(doc.data()));
            if (circs.length > 0) this.saveCirculation(circs);
            
            // Notify UI to refresh
            window.dispatchEvent(new CustomEvent('dbSyncComplete'));
        } catch (e) {
            console.warn("Failed to sync from Firebase:", e);
        }
    }

    async saveStudentToCloud(student) {
        if (!this.firebaseEnabled) return;
        try {
            await this.firestore.collection('students').doc(student.studentId).set(student);
        } catch(e) { console.error("Cloud student write failed:", e); }
    }

    async saveBookToCloud(book) {
        if (!this.firebaseEnabled) return;
        try {
            await this.firestore.collection('books').doc(book.isbn).set(book);
        } catch(e) { console.error("Cloud book write failed:", e); }
    }

    async saveCirculationToCloud(record) {
        if (!this.firebaseEnabled) return;
        try {
            await this.firestore.collection('circulation').doc(record.recordId).set(record);
        } catch(e) { console.error("Cloud circulation write failed:", e); }
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
        const student = {
            studentId,
            name,
            email,
            password,
            department,
            balanceDue: 0.00
        };
        students.push(student);
        this.saveStudents(students);
        this.saveStudentToCloud(student);
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
    addBook(isbn, title, author, department, quantity, coverUrl, readUrl, downloadUrl) {
        let books = this.getBooks();
        if (books.find(b => b.isbn === isbn)) {
            return { success: false, message: 'Book with this ISBN already exists.' };
        }
        const book = {
            isbn,
            title,
            author,
            department,
            total_quantity: parseInt(quantity),
            available_quantity: parseInt(quantity),
            cover_url: coverUrl || 'https://via.placeholder.com/150/1d3557/ffffff?text=No+Cover',
            read_url: readUrl || '',
            download_url: downloadUrl || ''
        };
        books.push(book);
        this.saveBooks(books);
        this.saveBookToCloud(book);
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
            this.saveBookToCloud(books[idx]);
        }
    }

    deleteBook(isbn) {
        let books = this.getBooks();
        let filtered = books.filter(b => b.isbn !== isbn);
        if (books.length === filtered.length) {
            return { success: false, message: 'Book not found.' };
        }
        this.saveBooks(filtered);
        if (this.firebaseEnabled) {
            try { this.firestore.collection('books').doc(isbn).delete(); } catch(e){}
        }
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

        const record = {
            recordId: 'REC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            studentId,
            isbn,
            issueDate: null, // set upon admin approval
            dueDate: null,
            returnDate: null,
            fineApplied: 0,
            status: 'Pending'
        };
        circs.push(record);

        this.saveCirculation(circs);
        this.saveCirculationToCloud(record);
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
        this.saveBookToCloud(book);

        // Update record
        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 14); // 14 days return period

        record.issueDate = today.toISOString().split('T')[0];
        record.dueDate = dueDate.toISOString().split('T')[0];
        record.status = 'Issued';

        this.saveCirculation(circs);
        this.saveCirculationToCloud(record);
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
            this.saveBookToCloud(book);
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
                this.saveStudentToCloud(student);
            }
        }

        this.saveCirculation(circs);
        this.saveCirculationToCloud(record);
        return { success: true, message: 'Book returned successfully!' };
    }

    payFine(studentId, amount) {
        let students = this.getStudents();
        let student = students.find(s => s.studentId === studentId);
        if (!student) return { success: false, message: 'Student not found.' };

        student.balanceDue -= amount;
        if (student.balanceDue < 0) student.balanceDue = 0;
        this.saveStudents(students);
        this.saveStudentToCloud(student);
        return { success: true, message: 'Payment recorded successfully!' };
    }

    // --- Cross-Device Sync: Export/Import ---

    // Export only the logged-in student's data (for device sync)
    exportStudentData(studentId) {
        const students = this.getStudents();
        const student = students.find(s => s.studentId === studentId);
        const circulation = this.getCirculation().filter(c => c.studentId === studentId);
        const exportObj = {
            version: '1.0',
            type: 'student_backup',
            exportDate: new Date().toISOString(),
            student,
            circulation
        };
        return JSON.stringify(exportObj, null, 2);
    }

    // Import student data (restores account on a new device)
    importStudentData(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            if (!data.student) return { success: false, message: 'Invalid backup file. Student data not found.' };

            // Restore student account
            let students = this.getStudents();
            const existingIdx = students.findIndex(s => s.studentId === data.student.studentId);
            if (existingIdx !== -1) {
                students[existingIdx] = data.student; // Update existing
            } else {
                students.push(data.student); // Add new
            }
            this.saveStudents(students);

            // Restore circulation records (merge, avoid duplicates)
            if (data.circulation && data.circulation.length > 0) {
                let circs = this.getCirculation();
                circs = circs.filter(c => c.studentId !== data.student.studentId);
                circs.push(...data.circulation);
                this.saveCirculation(circs);
            }
            return { success: true, message: 'Account restored successfully! Ab login karo.' };
        } catch(e) {
            return { success: false, message: 'Invalid or corrupted backup file.' };
        }
    }

    // Export ALL data (for Admin full backup)
    exportAllData() {
        return JSON.stringify({
            version: '1.0',
            type: 'full_backup',
            exportDate: new Date().toISOString(),
            students: this.getStudents(),
            books: this.getBooks(),
            circulation: this.getCirculation(),
            admins: this.getAdmins()
        }, null, 2);
    }

    // Import ALL data (Admin restore)
    importAllData(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            if (data.students)   this.saveStudents(data.students);
            if (data.books)      this.saveBooks(data.books);
            if (data.circulation) this.saveCirculation(data.circulation);
            if (data.admins)     localStorage.setItem('admins', JSON.stringify(data.admins));
            return { success: true, message: 'Full data restored successfully!' };
        } catch(e) {
            return { success: false, message: 'Invalid backup file.' };
        }
    }
}

// Global Single Instance
window.db = new BookBankDB();
