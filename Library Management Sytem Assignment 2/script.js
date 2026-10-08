const bookForm = document.getElementById("bookForm");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const yearInput = document.getElementById("year");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

const bookList = document.getElementById("bookList");
const message = document.getElementById("message");

let editId = null;


// ===============================
// GET - Load all books
// ===============================

async function loadBooks() {

    try {

        const response = await fetch("/api/books");

        const books = await response.json();

        bookList.innerHTML = "";

        if (books.length === 0) {

            bookList.innerHTML =
                "<p>No books available.</p>";

            return;
        }

        books.forEach(book => {

            const card = document.createElement("div");

            card.className = "book-card";

            card.innerHTML = `
                <div class="book-info">

                    <h3>${book.title}</h3>

                    <p>
                        <strong>Author:</strong>
                        ${book.author}
                    </p>

                    <p>
                        <strong>Year:</strong>
                        ${book.year}
                    </p>

                </div>

                <div class="actions">

                    <button
                        class="edit"
                        onclick="editBook(${book.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete"
                        onclick="deleteBook(${book.id})"
                    >
                        Delete
                    </button>

                </div>
            `;

            bookList.appendChild(card);
        });

    } catch (error) {

        showMessage("Unable to load books.", "red");
    }
}


// ===============================
// POST - Add new book
// ===============================

bookForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const bookData = {

        title: titleInput.value,

        author: authorInput.value,

        year: yearInput.value

    };


    // PUT - Update existing book
    if (editId !== null) {

        try {

            const response = await fetch(
                `/api/books/${editId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(bookData)
                }
            );

            const result = await response.json();

            showMessage(result.message, "green");

            resetForm();

            loadBooks();

        } catch (error) {

            showMessage("Error updating book.", "red");
        }

        return;
    }


    // POST
    try {

        const response = await fetch(
            "/api/books",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(bookData)
            }
        );

        const result = await response.json();

        showMessage(result.message, "green");

        resetForm();

        loadBooks();

    } catch (error) {

        showMessage("Error adding book.", "red");
    }

});


// ===============================
// Edit Book
// ===============================

async function editBook(id) {

    const response = await fetch("/api/books");

    const books = await response.json();

    const book = books.find(book => book.id === id);

    if (!book) return;

    editId = id;

    titleInput.value = book.title;

    authorInput.value = book.author;

    yearInput.value = book.year;

    submitBtn.innerText = "Update Book";

    cancelBtn.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// DELETE - Delete book
// ===============================

async function deleteBook(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `/api/books/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        showMessage(result.message, "green");

        loadBooks();

    } catch (error) {

        showMessage("Error deleting book.", "red");
    }
}


// ===============================
// Cancel Edit
// ===============================

function cancelEdit() {

    resetForm();
}


// ===============================
// Reset Form
// ===============================

function resetForm() {

    bookForm.reset();

    editId = null;

    submitBtn.innerText = "Add Book";

    cancelBtn.style.display = "none";
}


// ===============================
// Message
// ===============================

function showMessage(text, color) {

    message.innerText = text;

    message.style.color = color;

    setTimeout(() => {

        message.innerText = "";

    }, 3000);
}


// Load books when page opens

loadBooks();