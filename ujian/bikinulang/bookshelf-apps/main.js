let books = []
const RENDER_EVENT = 'render-book'
const STORAGE_KEY = 'BOOKSHELF_APP'
const SAVED_EVENT = 'saved-book'
const DELETE_EVENT = 'delete-book'

//global atau satu halaman
document.addEventListener('DOMContentLoaded', function () {
    const submitForms = document.getElementById('inputBook')
    const title = document.getElementById('inputBookTitle')
    
    submitForms.addEventListener('submit', function (event) {
        event.preventDefault()
        if (books.some(book => book.title == title.value)) {
            alert("Judul buku sudah ada di rak buku !")
        } else {
            addBook()
        }
    });

    

    if (isStorageExist()) {
        loadDataFromStorage()
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const bookUnread = document.getElementById('incompleteBookshelfList')
    bookUnread.innerHTML = ''

    const bookReaded = document.getElementById('completeBookshelfList')
    bookReaded.innerHTML = ''

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem)
        if (!bookItem.isCompleted) {
            bookUnread.append(bookElement)
        } else {
            bookReaded.append(bookElement)
        }
    }
});


const generateId = () => {
    return +new Date()
}

const generateBookObject = (id, title, author, year, isCompleted = false) => {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    };
}

const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed)

        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY)
    const data = JSON.parse(serializedData)

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

const isStorageExist = () => {
    if (typeof Storage === undefined) {
        alert('Browser kamu tidak mendukung local storage')
        return false
    }
    return true
}

const findBook = (bookId) => {
    for (const bookItem of books) {
        if (bookId === bookItem.id) {
            return bookItem;
        }
    }

    return null;
}

const findBookIndex = (bookId) => {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index
        }
    }

    return -1;
}

const addBook = () => {
    const textTitle = document.getElementById('inputBookTitle').value
    const textAuthor = document.getElementById('inputBookAuthor').value
    const textYear = document.getElementById('inputBookYear').value
    const booksIsComplete = document.getElementById('inputBookIsComplete')

    let checked = false

    if (booksIsComplete.checked) {
        checked = true
    } else {
        checked = false
    }

    const id = generateId()
    const bookObject = generateBookObject(id, textTitle, textAuthor, textYear, checked)
    books.push(bookObject);

    alert('data buku berhasil ditambahkan')

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

const addBookToCompleted = (bookId) => {
    const bookTarget = findBook(bookId)
    if (bookTarget === null) {
        return
    }

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

const unreadBookFromCompleted = (bookId) => {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) {
        return
    }

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData();
}

const deleteBook = (bookId) => {
    const bookTarget = findBookIndex(bookId)

    if (bookTarget === -1) {
        return
    }

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData();
}

const createButton = (buttonClass, textContent, bgColor) => {
    const button = document.createElement('button')
    button.classList.add(buttonClass)
    button.style.backgroundColor = bgColor
    button.textContent = textContent
    return button
}

const createUnreadButton = (bookId) => {
    const unreadButton = createButton('green', 'Belum Dibaca!', 'green')
    unreadButton.addEventListener('click', function () {
        unreadBookFromCompleted(bookId)
    });
    return unreadButton;
}

const createReadButton = (bookId) => {
    const readButton = createButton('green', 'Selesai Dibaca!', 'green')
    readButton.addEventListener('click', function () {
        addBookToCompleted(bookId)
    });
    return readButton
}

const createDeleteButton = (bookId) => {
    const deleteButton = createButton('red', 'Hapus Buku', 'red')
    deleteButton.addEventListener('click', function () {
        let hapusData = confirm("Yakin data akan dihapus?")
        if (hapusData) {
            deleteBook(bookId);
            alert('Data Berhasil dihapus!');
        }
    });
    return deleteButton;
}

const makeBook = (bookObject) => {
    const textTitle = document.createElement('h3')
    textTitle.innerText = bookObject.title

    const textAuthor = document.createElement('p')
    textAuthor.innerText = `Author: ${bookObject.author}`

    const textYear = document.createElement('p')
    textYear.innerText = `Tahun: ${bookObject.year}`

    //article sedang

    const containerBook = document.createElement('article'); //correct
    containerBook.classList.add('book_item');
    containerBook.append(textTitle, textAuthor, textYear);
    containerBook.setAttribute('id', `addBook-${bookObject.id}`);

    //tombol utility

    const containerButton = document.createElement('div');
    containerButton.classList.add('action')
    containerBook.append(containerButton)

    if (bookObject.isCompleted) {
        const unreadButton = createUnreadButton(bookObject.id)

        const deleteButton = createDeleteButton(bookObject.id)

        containerButton.append(unreadButton, deleteButton)
    } else {

        const readButton = createReadButton(bookObject.id)

        const deleteButton = createDeleteButton(bookObject.id)

        containerButton.append(readButton, deleteButton)


    }

    return containerBook;

}