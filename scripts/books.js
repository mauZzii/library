//library info
const booksRead = document.querySelector('.books-read');
const booksUnread = document.querySelector('.books-unread');
const totalBooks = document.querySelector('.books-total')

//library table
const tableBody = document.querySelector('.list-body');

//add new book form
const bookForm = document.querySelector('form');
const titleInput = document.querySelector('#book-title');
const titleErr = document.querySelector('.title');
const authorInput = document.querySelector('#book-author');
const authorErr = document.querySelector('.author');
const pagesInput = document.querySelector('#book-pages');
const pagesErr = document.querySelector('.pages');
const statusCheckbox = document.querySelector('input[name="status"]');

let myLibrary = [];

function Book(title, author, pages, status) {
    //populate book info from array
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
};

if (localStorage.getItem('books') === null) {
    myLibrary = [];
  } else {
    const booksFromStorage = JSON.parse(localStorage.getItem('books'));
    myLibrary = booksFromStorage;
};

function showLibraryInfo() {
    let readCounter = 0;
    let unreadCounter = 0;

    booksRead.textContent = 0;
    booksUnread.textContent = 0;

    for (let i = 0; i < myLibrary.length; i += 1) {
        if (myLibrary[i].status === true) {
            readCounter += 1;
            booksRead.textContent = readCounter;
        } else if (myLibrary[i].status === false) {
            unreadCounter += 1;
            booksUnread.textContent = unreadCounter;
        }
    }

    totalBooks.textContent = myLibrary.length;
}

function addBookToLibrary(title, author, pages, status) {
    //add a book to library array
    const book = new Book(title, author, pages, status);
    myLibrary.push(book);
    showBooksInLibrary();
}

function showBooksInLibrary() {
    //save to localstorage
    localStorage.setItem('books', JSON.stringify(myLibrary));
    showLibraryInfo();
    tableBody.textContent = '';

    for (let i = 0; i < myLibrary.length; i += 1) {
        //create new row
        const bookRow = document.createElement('tr');
        bookRow.classList.add('book-info')
        tableBody.appendChild(bookRow);
        //book title
        const bookTitle = document.createElement('td');
        bookTitle.textContent = myLibrary[i].title;
        bookRow.appendChild(bookTitle);
        //book author
        const bookAuthor = document.createElement('td');
        bookAuthor.textContent = myLibrary[i].author;
        bookRow.appendChild(bookAuthor);
        //book pages
        const bookPages = document.createElement('td');
        bookPages.textContent = myLibrary[i].pages;
        bookRow.appendChild(bookPages);
        //book status
        const bookStatus = document.createElement('td');
        bookStatus.textContent = myLibrary[i].status;
        bookRow.appendChild(bookStatus);
        //single book delete button
        const bookDelete = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-book');
        bookDelete.appendChild(deleteButton);
        bookRow.appendChild(bookDelete);
    };
}

function validateForm(event) {
    event.preventDefault();
    if (titleInput.value === '') {
        titleErr.style.display = 'block';
    } else {
        titleErr.style.display = 'none';
    };
    if (authorInput.value === '') {
        authorErr.style.display = 'block';
    } else {
        authorErr.style.display = 'none';
    };
    if (pagesInput.value === '' || pagesInput.value.match(/[^1-9]/) || pagesInput.value <= 0) {
        pagesErr.style.display = 'block';
    } else {
        pagesErr.style.display = 'none'
    };
    if (titleInput.value !== '' && authorInput.value !== '' && pagesInput.value !== '' && pagesInput.value > 0) {
        if (statusCheckbox.checked) {
          addBookToLibrary(titleInput.value, authorInput.value, pagesInput.value, true);
        } else {
          addBookToLibrary(titleInput.value, authorInput.value, pagesInput.value, false);
        }
        bookForm.reset();
      }
}

function confirmDeleteModal() {
    const modal = document.querySelector('#modal');
    modal.style.display = 'block';
    modal.addEventListener('click', (event) => {
      const { target } = event;
      if (target.classList.contains('close')) {
        modal.style.display = 'none';
      } else if (target.classList.contains('confirm-removal')) {
        myLibrary = [];
        modal.style.display = 'none';
      }
    });
  }

function listenClicks() {
    document.addEventListener('click', (event) => {
        const { target } = event;
        const tr = target.parentNode.parentNode.rowIndex - 1;
        
        if (target.id === 'submit-book') {
            validateForm(event);
        } else if (target.classList.contains('delete-book')) {
            myLibrary.splice(tr, 1);
        } else if (target.classList.contains('delete-all')) {
            confirmDeleteModal();
        };

        showBooksInLibrary();
    });
}

showBooksInLibrary();
listenClicks();
