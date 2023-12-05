// index.js
function addBook() {
  const titleInput = document.getElementById('titleInput');
  const rackSelect = document.getElementById('rackSelect');
  const unfinishedList = document.getElementById('unfinishedList');
  const finishedList = document.getElementById('finishedList');

  const title = titleInput.value.trim();
  const rack = rackSelect.value;

  if (title) {
    const liElement = document.createElement('li');
    liElement.textContent = title;

    if (rack === 'unfinished') {
      unfinishedList.appendChild(liElement);
    } else if (rack === 'finished') {
      finishedList.appendChild(liElement);
    }

    saveDataToStorage();
    titleInput.value = '';
  }
}

function saveDataToStorage() {
  const unfinishedData = Array.from(document.getElementById('unfinishedList').children).map(book => book.textContent);
  const finishedData = Array.from(document.getElementById('finishedList').children).map(book => book.textContent);

  localStorage.setItem('unfinishedData', JSON.stringify(unfinishedData));
  localStorage.setItem('finishedData', JSON.stringify(finishedData));
}

function loadAndDisplayData() {
  const unfinishedList = document.getElementById('unfinishedList');
  const finishedList = document.getElementById('finishedList');

  const unfinishedData = JSON.parse(localStorage.getItem('unfinishedData')) || [];
  const finishedData = JSON.parse(localStorage.getItem('finishedData')) || [];

  unfinishedList.innerHTML = '';
  finishedList.innerHTML = '';

  unfinishedData.forEach(book => {
    const liElement = document.createElement('li');
    liElement.textContent = book;
    unfinishedList.appendChild(liElement);
  });

  finishedData.forEach(book => {
    const liElement = document.createElement('li');
    liElement.textContent = book;
    finishedList.appendChild(liElement);
  });
}

function clearData() {
  localStorage.removeItem('unfinishedData');
  localStorage.removeItem('finishedData');
  loadAndDisplayData();
}

window.onload = loadAndDisplayData;
