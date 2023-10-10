class Book {
    constructor(title, author, pages, status) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
    }
}

class Library {
    constructor() {
        this.books = [];
    }
    addBook(title, author, pages, status) {
        const book = new Book(title, author, pages, status);
        this.books.push(book);
    }
    removeBook(index) {
        if (index >= 0 && index < this.books.length) {
            this.books.splice(index, 1);
        }
    }
    toggleStatus(index) {
        if (index >= 0 && index < this.books.length) {
            this.books[index].status = !this.books[index].status;
        }
    }

}

class LibraryManager {
    constructor() {
        this.library = new Library();
        this.elements = {
            booksRead: document.querySelector('.books-read'),
            booksUnread: document.querySelector('.books-unread'),
            totalBooks: document.querySelector('.books-total'),
            tableBody: document.querySelector('.list-body'),
            bookForm: document.querySelector('form'),
            titleInput: document.querySelector('#book-title'),
            titleErr: document.querySelector('.title'),
            authorInput: document.querySelector('#book-author'),
            authorErr: document.querySelector('.author'),
            pagesInput: document.querySelector('#book-pages'),
            pagesErr: document.querySelector('.pages'),
            statusCheckbox: document.querySelector('input[name="status"]'),
            deleteAllButton: document.querySelector('.delete-all'),
            modal: document.querySelector('#modal'),
        };
        //bind events
        this.elements.bookForm.addEventListener('submit', this.validateForm.bind(this));
        document.addEventListener('click', this.handleTableClick.bind(this));
        this.elements.deleteAllButton.addEventListener('click', this.confirmDeleteModal.bind(this));

        this.loadBooksFromStorage();
        this.updateLibraryInfo();
        this.showBooksInLibrary();
    }
    loadBooksFromStorage() {
        const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
        this.library.books = storedBooks;
    }
    saveBooksToStorage() {
        localStorage.setItem('books', JSON.stringify(this.library.books));
    }
    updateLibraryInfo() {
        const readCounter = this.library.books.filter(book => book.status).length;
        const unreadCounter = this.library.books.filter(book => !book.status).length;

        this.elements.booksRead.textContent = readCounter;
        this.elements.booksUnread.textContent = unreadCounter;
        this.elements.totalBooks.textContent = this.library.books.length;
    }
    createTableCell(textContent) {
        const cell = document.createElement('td');
        cell.textContent = textContent;
        return cell;
    }
    createStatusSymbol(status) {
        const statusSymbol = document.createElement('img');
        //set status symbol based off true or false
        statusSymbol.src = status ? '../img/check.png' : '../img/close.png';
        statusSymbol.alt = status ? 'read symbol' : 'unread symbol';
        statusSymbol.classList.add('status-symbol', status ? 'read' : 'unread');
        return statusSymbol;
    }
    createDeleteButton() {
        const deleteButton = document.createElement('img');
        deleteButton.src = '../img/trash.png';
        deleteButton.classList.add('delete-book');
        return deleteButton;
    }
    addBookToLibrary(title, author, pages, status) {
        this.library.addBook(title, author, pages, status);
        this.saveBooksToStorage();
        this.updateLibraryInfo();
        this.showBooksInLibrary();
    }
    confirmDeleteModal() {
        const modal = document.querySelector('#modal');
        modal.style.display = 'block';
        modal.addEventListener('click', (event) => {
            const { target } = event;
            if (target.classList.contains('close')) {
                modal.style.display = 'none';
            } else if (target.classList.contains('confirm-removal')) {
                this.library.books = []; //clear the library
                this.saveBooksToStorage(); //save the changes to local storage
                modal.style.display = 'none';
                this.updateLibraryInfo();
                this.showBooksInLibrary();
            }
        });
    }
    validateForm(event) {
        event.preventDefault();

        //set title and author error to display if values are empty
        this.elements.titleErr.style.display = this.elements.titleInput.value === '' ? 'block' : 'none';
        this.elements.authorErr.style.display = this.elements.authorInput.value === '' ? 'block' : 'none';
        //set pages error to display if value is NaN or <=0
        const pagesInputValue = parseInt(this.elements.pagesInput.value);
        this.elements.pagesErr.style.display =
        isNaN(pagesInputValue) || pagesInputValue <= 0 ? 'block' : 'none';

        //validation check of all input fields
        if (this.elements.titleInput.value !== '' && this.elements.authorInput.value !== '' && !isNaN(pagesInputValue) && pagesInputValue > 0) {
                this.addBookToLibrary(
                    this.elements.titleInput.value,
                    this.elements.authorInput.value,
                    pagesInputValue,
                    this.elements.statusCheckbox.checked
                );
            this.elements.bookForm.reset();
        }
    }
    handleTableClick(event) {
        const { target } = event;
        //delete single book
        if (target.classList.contains('delete-book')) {
            const rowIndex = target.parentNode.parentNode.rowIndex - 1;
            this.library.removeBook(rowIndex);
        } 
        //changes status icon
        else if (target.classList.contains('read') || target.classList.contains('unread')) {
            const rowIndex = target.parentNode.parentNode.rowIndex - 1;
            this.library.toggleStatus(rowIndex);
        }
        this.saveBooksToStorage();
        this.updateLibraryInfo();
        this.showBooksInLibrary();
    }
    showBooksInLibrary() {
        this.elements.tableBody.textContent = '';
    
        this.library.books.forEach((book) => {
            const bookRow = document.createElement('tr');
            bookRow.classList.add('book-info');
            this.elements.tableBody.appendChild(bookRow);
        
            bookRow.appendChild(this.createTableCell(book.title));
            bookRow.appendChild(this.createTableCell(book.author));
            bookRow.appendChild(this.createTableCell(book.pages));
            
            //create status cell
            const statusCell = document.createElement('td');
            statusCell.appendChild(this.createStatusSymbol(book.status));
            bookRow.appendChild(statusCell);

            //create delete cell
            const deleteCell = document.createElement('td');
            deleteCell.appendChild(this.createDeleteButton());
            bookRow.appendChild(deleteCell);
        });
    }
}

const libraryManager = new LibraryManager();