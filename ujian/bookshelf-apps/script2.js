const books = []
const RENDER_EVENT = 'render-addbook'
const STORAGE_KEY = 'BOOK_APPS';
const SAVED_EVENT = 'saved-book';


document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      book();
    });
  });

  function book(){
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;

    const id = generateId();
    const bookObject = generateBookObject(id, title, author, year, isDone = false) 
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  document.addEventListener(RENDER_EVENT, function () {
    // console.log(books ); //debug in console browser

    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = addBook(bookItem);
        if(!bookItem.isDone)
            uncompletedBookList.append(bookElement);
        else
            completedBookList.append(bookElement);
      }
  });


  function generateId() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isDone) {
    return {
      id,
      title,
      author,
      year,
      isDone,
    }
  }

  function addBook (bookObject){
    const textTitle = document.createElement('h3')
    textTitle.innerText = bookObject.title

    const textAuthor = document.createElement('p')
    textAuthor.innerText =`Author: ${bookObject.author}`

    const textYear = document.createElement('p')
    textYear.innerText = `Tahun: ${bookObject.year}`

    //article sedang



    const container = document.createElement('article');//correct
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear);
    container.setAttribute('id', `addBook-${bookObject.id}`);

    //tombol utility

   const containerUtility = document.createElement('div');
   containerUtility.classList.add('action')


   const doneButton = document.createElement('button');
   doneButton.classList.add('green')
   doneButton.textContent = "selesai dibaca"
   doneButton.addEventListener('click', function(){
    //    console.log(bookObject)
    addTaskToCompleted(bookObject.id)
    // console.log(bookObject.isDone)
    // console.log(addTaskToCompleted(bookObject.id)) //undefined
   })

   const deleteButton = document.createElement('button');
   deleteButton.classList.add('red')
   deleteButton.textContent = 'hapus buku'
   deleteButton.addEventListener('click', function(){
    removeTaskFromCompleted(bookObject.id);
    
    
   })


   containerUtility.append(doneButton, deleteButton)
   container.append(containerUtility)
    return container;

  }

 

  function addTaskToCompleted (bookId) {
    const bookTarget = findBook(bookId); //null
//    console.log(findBook(bookId))
    if (bookTarget == null) return;
   
    bookTarget.isDone = true;
    document.dispatchEvent(new Event(RENDER_EVENT)); //check the truth
    saveData();
  }

  function findBook(bookId) {
    
    for (const bookItem of books) {
      if (bookItem.id == bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function removeTaskFromCompleted(addBookId) {
    const booktarget = findBookIndex(addBookId);
   
    if (booktarget === -1) return;
   
    books.splice(booktarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBookIndex(bookId) {
        for (const index in books) {
          if (books[index].id === bookId) {
            return index;
          }
        }
    }

    function  saveData() {
     if  (isStorageExist()){
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT))
    }
  }

  function isStorageExist(){
    if (typeof (Storage) === undefined){
      alert("Browser kamu tidak mendukung local storage");
      return false
    }
    return true
  }

  document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY))
  })

 