# Book Bank Management System: Academic Documentation

---

## 1. Problem Statement

In most higher education institutions, particularly engineering and degree colleges, students rely heavily on textbooks for their semester curriculum. Buying 5 to 8 expensive textbooks every semester is a significant financial burden on students. To mitigate this, colleges establish a **Book Bank**—a library sub-facility where students can borrow a set of standard textbook packages for the entire semester and return them after the semester exams end.

### Legacy/Manual System Bottlenecks:
1. **Inefficient Inventory Tracking**: Paper registers or legacy spreadsheets make it difficult to search, locate, or update the status of book stock.
2. **Long Queue Times**: Issuing and returning books manually takes hours, causing students to miss lectures.
3. **Lack of Transparency**: Students have no clear visibility on book availability, outstanding fines, or system rules until they wait in queue.
4. **Calculations & Fine Disputes**: Manual calculation of overdue days and fines often leads to human errors and arguments.
5. **No Personalization**: Students have to search blindly for recommendations without AI recommendations matching their specific syllabus or interest fields.

---

## 2. Software Requirements Specification (SRS)

### 2.1 Introduction
The **Book Bank Management System (BBMS)** is an interactive, web-based platform tailored for college students and library administrators. It automates inventory, book circulation (issue/return), automated fine systems, and leverages client-side AI algorithms to recommend relevant textbooks based on branches, departments, and borrowing behavior.

### 2.2 Overall Description
- **Product Perspective**: BBMS functions as an autonomous client-side application featuring custom relational databases managed inside `localStorage` for immediate offline demonstration and high reliability, backed up by a clean exportable `schema.sql` database schema for enterprise scale.
- **User Classes**:
  - **Student**: Can view, search, request book issuance, view fine ledgers, and receive tailored AI textbook lists.
  - **Admin**: Has absolute authority over inventory, issuing approvals, recording returns, fine collections, and real-time analytic tracking.

### 2.3 Functional Requirements (FRs)
- **FR-1: Authentication & Profiles**: Dual registration and login portal supporting secure sessions for student identifiers and admin keys.
- **FR-2: Dynamic Inventory Search**: Search books dynamically by Title, Author, ISBN, or Department/Course category, with real-time stock levels.
- **FR-3: Automated Circular Workflow**: Students request books; Admins verify availability and approve with one click.
- **FR-4: Active Fine Engine**: Real-time evaluation of overdue days ($1 per day rule) with simulated payment transactions.
- **FR-5: AI Recommendation Engine**: Multi-factor matching engine analyzing branch (CS, EE, ME, etc.) and global demand trends.

### 2.4 Non-Functional Requirements (NFRs)
- **NFR-1: Performance**: Searches and updates must happen in sub-50 milliseconds via indexed structures.
- **NFR-2: Usability**: Modern, highly polished Blue and White responsive theme (Bootstrap 5) adapting to desktop, tablet, and mobile screens seamlessly.
- **NFR-3: Reliability**: State perseverance; reloading or closing the browser must not result in data loss due to synchronized local storage checks.

---

## 3. System Diagrams

### 3.1 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    STUDENT {
        string student_id PK
        string name
        string email
        string password
        string department
        float balance_due
    }
    BOOK {
        string isbn PK
        string title
        string author
        string department
        int total_quantity
        int available_quantity
        string cover_url
    }
    CIRCULATION_RECORD {
        string record_id PK
        string student_id FK
        string isbn FK
        date issue_date
        date due_date
        date return_date
        float fine_applied
        string status
    }
    STUDENT ||--o{ CIRCULATION_RECORD : "borrows"
    BOOK ||--o{ CIRCULATION_RECORD : "is_borrowed"
```

### 3.2 Use Case Diagram

```mermaid
left_to_right_direction
actor Student
actor Admin

rectangle "Book Bank Management System" {
    Student --> (Sign Up & Login)
    Student --> (Search Catalog)
    Student --> (Request Book Issue)
    Student --> (Check Outstanding Fines)
    Student --> (Get AI Recommendations)

    (Sign Up & Login) <-- Admin
    (Manage Inventory) <-- Admin
    (Approve Issue Request) <-- Admin
    (Process Book Return) <-- Admin
    (Collect / Waive Fines) <-- Admin
}
```

### 3.3 Data Flow Diagram (DFD)

#### Level 0 DFD (System Context)
```mermaid
graph TD
    Student[Student User] -->|Search, Request & Return Book| BBMS(Book Bank Management System)
    BBMS -->|Status & Recommendations| Student
    Admin[Admin User] -->|Manage Inventory & Issues| BBMS
    BBMS -->|Circulation Audits & Analytics| Admin
```

#### Level 1 DFD (Process Decomposition)
```mermaid
graph TD
    subgraph System Processes
        P1(1.0 Auth & Profile Manager)
        P2(2.0 Inventory Search Engine)
        P3(3.0 Circulation & Fine Calculator)
        P4(4.0 AI Recommendation Core)
    end

    subgraph Data Stores
        D1[(Students DB)]
        D2[(Books DB)]
        D3[(Circulation DB)]
    end

    Student -->|Credentials| P1
    P1 <-->|Read/Write| D1

    Student -->|Search Terms| P2
    P2 <-->|Query Stock| D2

    Admin -->|Modify Books| P2

    Student & Admin -->|Issue/Return Requests| P3
    P3 <-->|Update Status| D3
    P3 <-->|Deduct Stock| D2
    P3 <-->|Increment Fines| D1

    Student -->|View Recommendations| P4
    P4 <-->|Read Interests| D1
    P4 <-->|Read Catalog| D2
```

### 3.4 UML Sequence Diagram (Issue Request Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Student
    actor Admin
    participant System as BBMS Interface
    participant DB as Relational Database (localStorage)

    Student->>System: Search and Request Book (ISBN)
    System->>DB: Check Availability Stock
    DB-->>System: Stock Available (Qty > 0)
    System-->>Student: Update Request Status to "Pending Admin Approval"
    System->>Admin: Alert Pending Request in Admin Dashboard
    Admin->>System: Click "Approve Issue"
    System->>DB: Update Book Quantity & Create Issue Record
    DB-->>System: Success Acknowledgement
    System-->>Student: Book Issued Status and set Due Date
```

---

## 4. Test Suite and Case Studies

### 4.1 Black Box Testing (Functional Checks)

| Test ID | Test Category | Input / Trigger | Expected Output | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-BB-01** | Boundary Value Analysis | Student Signup with short password (< 6 chars) | Validation error: "Password must be at least 6 characters long." | Verified |
| **TC-BB-02** | Equivalence Partitioning | Search with author name containing non-alphabetic chars | Graceful feedback or filtering matching literal characters correctly | Verified |
| **TC-BB-03** | Boundary Value Analysis | Borrow book when remaining stock is `0` | "Borrow Request" button disabled, status displays "Out of Stock" | Verified |
| **TC-BB-04** | State Transition | Admin returns a book 5 days past due date | Calculate fine of $5.00 automatically; assign to student profile | Verified |

### 4.2 White Box Testing (Logic Flow Checks)

#### Path Coverage: AI Recommendation Filtering Logic (`ai.js`)
- **Path A**: Student has no borrowing history and no department set $\rightarrow$ Return trending general textbooks.
- **Path B**: Student has a department set but no history $\rightarrow$ Filter and return trending textbooks matching that department.
- **Path C**: Student has department and rich history $\rightarrow$ Rank books by matching department first, then order by matching category frequency from past records.

#### Branch Coverage: Fine Calculation Function
```javascript
function calculateFine(dueDate, returnDate) {
    if (!returnDate) returnDate = new Date();
    let diffTime = returnDate - dueDate;
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
        return diffDays * FINE_RATE_PER_DAY;
    }
    return 0;
}
```
- **Branch 1 (True - Overdue)**: `diffDays > 0` returns fine based on days.
- **Branch 2 (False - On Time)**: `diffDays <= 0` returns fine of `0`.
