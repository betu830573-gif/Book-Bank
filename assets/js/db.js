/**
 * Relational localStorage Database for Book Bank System (FINAL FIXED VERSION)
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

    ,
{
    isbn: '978-9356061319',
    title: 'Java: The Complete Reference',
    author: 'Herbert Schildt',
    department: 'Computer Science',
    total_quantity: 10,
    available_quantity: 10,
    cover_url: 'https://via.placeholder.com/150x220?text=Java'
},
{
    isbn: '978-9355423484',
    title: 'Python Crash Course',
    author: 'Eric Matthes',
    department: 'Computer Science',
    total_quantity: 8,
    available_quantity: 8,
    cover_url: 'https://via.placeholder.com/150x220?text=Python'
},
{
    isbn: '978-0132350884',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    department: 'Computer Science',
    total_quantity: 6,
    available_quantity: 6,
    cover_url: 'https://via.placeholder.com/150x220?text=Clean+Code'
},
{
    isbn: '978-1259028641',
    title: 'Engineering Mechanics',
    author: 'R.C. Hibbeler',
    department: 'Mechanical Engineering',
    total_quantity: 5,
    available_quantity: 5,
    cover_url: 'https://via.placeholder.com/150x220?text=Mechanics'
},
{
    isbn: '978-8126562170',
    title: 'Strength of Materials',
    author: 'S.S. Bhavikatti',
    department: 'Civil Engineering',
    total_quantity: 7,
    available_quantity: 7,
    cover_url: 'https://via.placeholder.com/150x220?text=SOM'
},
{
    isbn: '978-9332542603',
    title: 'Digital Electronics',
    author: 'Morris Mano',
    department: 'Electrical Engineering',
    total_quantity: 9,
    available_quantity: 9,
    cover_url: 'https://via.placeholder.com/150x220?text=Digital+Electronics'
},
{
    isbn: '978-8120340071',
    title: 'Data Structures Using C',
    author: 'Reema Thareja',
    department: 'Computer Science',
    total_quantity: 10,
    available_quantity: 10,
    cover_url: 'https://via.placeholder.com/150x220?text=Data+Structures'
},
{
    isbn: '978-8131727633',
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    department: 'Computer Science',
    total_quantity: 8,
    available_quantity: 8,
    cover_url: 'https://via.placeholder.com/150x220?text=DBMS'
},
{
    isbn: '978-9339219669',
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    department: 'Computer Science',
    total_quantity: 7,
    available_quantity: 7,
    cover_url: 'https://via.placeholder.com/150x220?text=Networks'
},
{
    isbn: '978-9332575779',
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    department: 'Computer Science',
    total_quantity: 6,
    available_quantity: 6,
    cover_url: 'https://via.placeholder.com/150x220?text=OS'
}
];

class BookBankDB {
    constructor() {
        this.init();
    }

    // 🔥 SAFE INIT
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

        if (!localStorage.getItem('admins')) {
            localStorage.setItem('admins', JSON.stringify([
                { email: 'admin@bookbank.com', password: 'adminpassword', name: 'Admin' }
            ]));
        }
    }

    // 🔥 SAFE PARSE (CRASH FIX)
    safeGet(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (e) {
            return [];
        }
    }

    // --- GET / SAVE ---
    getStudents() { return this.safeGet('students'); }
    saveStudents(data) { localStorage.setItem('students', JSON.stringify(data)); }

    getBooks() { return this.safeGet('books'); }
    saveBooks(data) { localStorage.setItem('books', JSON.stringify(data)); }

    getCirculation() { return this.safeGet('circulation'); }
    saveCirculation(data) { localStorage.setItem('circulation', JSON.stringify(data)); }

    getAdmins() { return this.safeGet('admins'); }

    // --- AUTH ---
    signupStudent(studentId, name, email, password, department) {
        let students = this.getStudents();

        if (students.find(s => s.studentId === studentId || s.email === email)) {
            return { success: false, message: 'Already registered' };
        }

        students.push({
            studentId,
            name,
            email,
            password,
            department,
            balanceDue: 0.00
        });

        this.saveStudents(students);
        return { success: true };
    }

   loginStudent(email, password) {
    const students = this.getStudents();

    const user = students.find(
        s =>
            s.email.toLowerCase() === email.toLowerCase() &&
            s.password === password
    );

    if (!user) {
        return {
            success: false,
            message: "Invalid Email or Password"
        };
    }

    sessionStorage.setItem('currentUser', JSON.stringify({
        ...user,
        role: 'student'
    }));

    return {
        success: true,
        user
    };
}

loginAdmin(email, password) {
    const admin = this.getAdmins().find(
        a =>
            a.email.toLowerCase() === email.toLowerCase() &&
            a.password === password
    );

    if (!admin) {
        return {
            success: false,
            message: "Invalid Admin Credentials"
        };
    }

    sessionStorage.setItem('currentUser', JSON.stringify({
        ...admin,
        role: 'admin'
    }));

    return {
        success: true,
        user: admin
    };
}

    logout() {
        sessionStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        try {
            return JSON.parse(sessionStorage.getItem('currentUser'));
        } catch {
            return null;
        }
    }

    // --- BOOKS ---
    addBook(isbn, title, author, department, quantity, coverUrl) {
        let books = this.getBooks();

        if (books.find(b => b.isbn === isbn)) {
            return { success: false, message: 'ISBN exists' };
        }

        books.push({
            isbn,
            title,
            author,
            department,
            total_quantity: Number(quantity),
            available_quantity: Number(quantity),
            cover_url: coverUrl || 'https://via.placeholder.com/150'
        });

        this.saveBooks(books);
        return { success: true };
    }

    updateBookStock(isbn, inc) {
        let books = this.getBooks();
        let b = books.find(x => x.isbn === isbn);

        if (!b) return;

        b.total_quantity += inc;
        b.available_quantity += inc;

        if (b.available_quantity < 0) b.available_quantity = 0;
        if (b.total_quantity < 0) b.total_quantity = 0;

        this.saveBooks(books);
    }

    deleteBook(isbn) {
        let books = this.getBooks();
        let newBooks = books.filter(b => b.isbn !== isbn);

        if (books.length === newBooks.length) {
            return { success: false };
        }

        this.saveBooks(newBooks);
        return { success: true };
    }

    // --- ISSUE ---
     requestIssue(studentId, isbn) {

    let circs = this.getCirculation();
    let books = this.getBooks();

    let book = books.find(b => b.isbn === isbn);

    if (!book || book.available_quantity <= 0) {
        return {
            success: false,
            message: "Book unavailable"
        };
    }

    let exists = circs.find(
        c =>
            c.studentId === studentId &&
            c.isbn === isbn &&
            c.status !== "Returned"
    );

    if (exists) {
        return {
            success: false,
            message: "Already requested"
        };
    }

    circs.push({
        recordId: "REC-" + Date.now(),
        studentId,
        isbn,
        issueDate: null,
        dueDate: null,
        returnDate: null,
        fineApplied: 0,
        status: "Pending"
    });

    this.saveCirculation(circs);

    return {
        success: true,
        message: "Request submitted"
    };
}

    // --- APPROVE ---
  approveIssue(recordId) {
    let circs = this.getCirculation();
    let books = this.getBooks();

    let rec = circs.find(c => c.recordId === recordId);
    if (!rec || rec.status !== 'Pending') return { success: false };

    let book = books.find(b => b.isbn === rec.isbn);
    if (!book || book.available_quantity <= 0) return { success: false };

    book.available_quantity--;

    let today = new Date();
    let due = new Date();
    due.setDate(today.getDate() + 14);

    rec.issueDate = today.toISOString().split('T')[0];
    rec.dueDate = due.toISOString().split('T')[0];
    rec.status = 'Issued';

    this.saveBooks(books);
    this.saveCirculation(circs);

    return { success: true };
}
    // --- RETURN ---
    returnBook(recordId) {
        let circs = this.getCirculation();
        let books = this.getBooks();

        let rec = circs.find(c => c.recordId === recordId);
        if (!rec || rec.status !== 'Issued') return { success: false };

        let book = books.find(b => b.isbn === rec.isbn);
        if (book) {
            book.available_quantity++;
            if (book.available_quantity > book.total_quantity) {
                book.available_quantity = book.total_quantity;
            }
        }

        let today = new Date();
        rec.returnDate = today.toISOString().split('T')[0];
        rec.status = 'Returned';

        let due = new Date(rec.dueDate || today);
        let diff = Math.ceil((today - due) / (1000 * 60 * 60 * 24));

        if (diff > 0) {
            let fine = diff;
            rec.fineApplied = fine;

            let students = this.getStudents();
            let s = students.find(st => st.studentId === rec.studentId);

            if (s) {
                s.balanceDue += fine;
                this.saveStudents(students);
            }
        }

        this.saveBooks(books);
        this.saveCirculation(circs);

        return { success: true };
    }

    payFine(studentId, amount) {
        let students = this.getStudents();
        let s = students.find(x => x.studentId === studentId);

        if (!s) return { success: false };

        s.balanceDue -= amount;
        if (s.balanceDue < 0) s.balanceDue = 0;

        this.saveStudents(students);
        return { success: true };
    }
}

window.db = new BookBankDB(); 
