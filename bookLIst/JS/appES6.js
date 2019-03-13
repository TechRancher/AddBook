/**
 * ES6 Of ADD BOOK
 * 
 * @author Jason Sikes
 */

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  };
};

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list')
    // Create tr element
    const row = document.createElement('tr');
    // Insert Cols
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
  };
  showAlert(message, className) {
    // Construct Div
    const div = document.createElement('div');
    // Add class
    div.className = `alert ${className}`;
    // Add Text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container');
    // Get form
    const form = document.querySelector("#book-form");
    // Insert Alert
    container.insertBefore(div, form);
    // Time out after 3 seconds
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  };
  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  };
  clearFields(){
    document.getElementById('title').value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  };
};

// Local Storage Class
class Store {
  // Getting Books from Local Storage
  static getBooks() {
    let books;
    if(localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  // Displaying Books after being retreved from Local Storage
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => {
      const ui = new UI();
      // Add book to UI
      ui.addBookToList(book);
    });
  }
  // Add new book to Local Storage
  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  // Remove book from local storage
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      const ui = new UI();
      if(book.isbn === isbn){
        books.splice(index, 1)
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
};

// Dom Load Event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

// Event Listeners for add Book
document.getElementById("book-form").addEventListener('submit', function (e) {
  // Get Form Values
  const title  = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn   = document.getElementById('isbn').value


  // Instantiate Book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI()

  // Validate
  if (title === "" || author === "" || isbn === "") {
    // error alert
    ui.showAlert("Please fill in all fields", 'error');
  } else {
    // UI add book to list
    ui.addBookToList(book);

    // Add to Local Storage
    Store.addBook(book);

    // Show success
    ui.showAlert("Book Added!", 'success');

    // Clear Fields
    ui.clearFields();
  }
  // Prevent Form Submittion
  e.preventDefault();
});

// Event Listener for Delete
document.getElementById('book-list').addEventListener("click", function (e) {
  // Instantiate UI
  const ui = new UI();

  // Delete Book
  ui.deleteBook(e.target);

  // Remove from Local Storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show Alert
  ui.showAlert("Book Deleted!", "success");


  // Prevent Form Submittion
  e.preventDefault()
});