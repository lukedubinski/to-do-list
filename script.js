const form = document.querySelector('form');
const input = form.querySelector('input');
const ul = document.querySelector('ul');
const errorMessage = form.querySelector('.error-message'); // New error message div
let listItems = JSON.parse(localStorage.getItem('listItems')) || [];

function addListItem() {
  const text = input.value.trim();
  if (text.length > 0) {
    const listItem = {
      id: Date.now(),
      value: text
    };
    listItems.push(listItem);
    localStorage.setItem('listItems', JSON.stringify(listItems));
    input.value = '';
    errorMessage.style.display = 'none'; // Hide error message if input is not empty
    renderList();
  } else {
    errorMessage.style.display = 'block'; // Show error message if input is empty
  }
}

function deleteListItem(event) {
  if (event.target.tagName === 'BUTTON') {
    const li = event.target.closest('li');
    const id = li.dataset.id;
    listItems = listItems.filter(item => item.id !== parseInt(id));
    localStorage.setItem('listItems', JSON.stringify(listItems));
    li.remove();
    renderList();
  }
}

function renderList() {
  ul.innerHTML = '';
  listItems.forEach(item => {
    const li = document.createElement('li');
    li.dataset.id = item.id;
    const span = document.createElement('span');
    span.textContent = item.value;
    const button = document.createElement('button');
    button.textContent = 'Delete';
    li.appendChild(span);
    li.appendChild(button);
    ul.appendChild(li);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addListItem();
});

listItems.forEach(item => {
  const li = document.createElement('li');
  li.dataset.id = item.id;
  const span = document.createElement('span');
  span.textContent = item.value;
  const button = document.createElement('button');
  button.textContent = 'Delete';
  li.appendChild(span);
  li.appendChild(button);
  ul.appendChild(li);
});

ul.addEventListener('click', deleteListItem);
