document.addEventListener('DOMContentLoaded', function () {
  const titleInput = document.getElementById('titleInput');
  const authorInput = document.getElementById('authorInput');
  const yearInput = document.getElementById('yearInput');
  const rackSelect = document.getElementById('rackSelect');
  const unfinishedList = document.getElementById('unfinishedList');
  const finishedList = document.getElementById('finishedList');
  const tambahBukuButton = document.getElementById('tambahBukuButton');

  tambahBukuButton.addEventListener('click', addBook);

// Fungsi untuk membuat ID unik
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
} 

  function addBook() {
    const title = titleInput.value;
    const author = authorInput.value;
    const year = parseInt(yearInput.value, 10);
    const rack = rackSelect.value;
  
    if (title === '' || author === '' || year === '') {
      alert('Mohon isi semua kolom!');
      return;
    }
  
    const book = {
      id: generateId(),
      title: title,
      author: author,
      year: year,
      isComplete: rack === 'finished',
    };
  
    if (rack === 'unfinished') {
      addToRack(book, unfinishedList, 'finished');
    } else {
      addToRack(book, finishedList, 'unfinished');
    }
  
    saveToLocalStorage();
    clearInputFields();
  }

  function addToRack(book, rackList, oppositeRack) {
    // Check if the book is already in the list to avoid duplication
    const existingBook = Array.from(rackList.children).find((item) => {
      const titleElement = item.querySelector('.title');
      return titleElement && titleElement.innerText === book.title;
    });
  
    if (existingBook) {
      alert('Buku sudah ada dalam daftar!');
      return;
    }
  
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="book-details">
        <span class="title">${book.title}</span>
        <span class="info">${book.author}</span>
        <span class="info">${book.year}</span>
      </div>
      <div class="button-container">
        <button class="selesai-button">Pindah</button>
        <button class="delete-button">Hapus</button>
      </div>
    `;
    rackList.appendChild(li);
  
    // Pasang event listener pada tombol "Selesai"
    const selesaiButton = li.querySelector('.selesai-button');
    selesaiButton.addEventListener('click', function () {
      moveToRack(this, oppositeRack);
    });

    // Pasang event listener pada tombol "Hapus"
    const deleteButton = li.querySelector('.delete-button');
    deleteButton.addEventListener('click', function () {
      deleteBook(this);
    });
  }

  window.moveToRack = function (button, targetRack) {
    const bookItem = button.parentNode.parentNode;
    const targetList = targetRack === 'finished' ? finishedList : unfinishedList;

    targetList.appendChild(bookItem);
    saveToLocalStorage();
  }

  window.deleteBook = function (button) {
    const bookItem = button.parentNode.parentNode;
    bookItem.remove();
    saveToLocalStorage();
  }

  function saveToLocalStorage() {
    try {
      const unfinishedBooks = getBookDataFromList(unfinishedList);
      const finishedBooks = getBookDataFromList(finishedList);
  
      console.log('Saving to local storage...');
      console.log('Unfinished Books:', unfinishedBooks);
      console.log('Finished Books:', finishedBooks);
  
      localStorage.setItem('unfinishedBooks', JSON.stringify(unfinishedBooks));
      localStorage.setItem('finishedBooks', JSON.stringify(finishedBooks));
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  }

  function getBookDataFromList(bookList) {
    const books = [];
    const bookItems = bookList.children;

    for (const bookItem of bookItems) {
      const title = bookItem.querySelector('.title').innerText;
      const author = bookItem.querySelector('span:nth-child(2)').innerText;
      const year = bookItem.querySelector('span:nth-child(3)').innerText;

      books.push({ title, author, year });
    }

    return books;
  }

  function loadFromLocalStorage() {
    const unfinishedBooks = JSON.parse(localStorage.getItem('unfinishedBooks')) || [];
    const finishedBooks = JSON.parse(localStorage.getItem('finishedBooks')) || [];
  
    unfinishedList.innerHTML = '';
    finishedList.innerHTML = '';
  
    unfinishedBooks.forEach((book) => addToRack(book, unfinishedList, 'finished'));
    finishedBooks.forEach((book) => addToRack(book, finishedList, 'unfinished'));
  
    // Pasang event listener menggunakan event delegation
    unfinishedList.addEventListener('click', function (event) {
      const selesaiButton = event.target.closest('.selesai-button');
      if (selesaiButton) {
        moveToRack(selesaiButton, 'finished');
      }
  
      const deleteButton = event.target.closest('.delete-button');
      if (deleteButton) {
        deleteBook(deleteButton);
      }
    });
  
    finishedList.addEventListener('click', function (event) {
      const selesaiButton = event.target.closest('.selesai-button');
      if (selesaiButton) {
        moveToRack(selesaiButton, 'unfinished');
      }
  
      const deleteButton = event.target.closest('.delete-button');
      if (deleteButton) {
        deleteBook(deleteButton);
      }
    });
  }

  function clearInputFields() {
    titleInput.value = '';
    authorInput.value = '';
    yearInput.value = '';
  }

  loadFromLocalStorage();
});
