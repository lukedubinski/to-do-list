document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const input = form.querySelector('input[type="text"]');
  const dueDateInput = document.getElementById('dueDate');
  const ul = document.querySelector('ul');
  const errorMessage = form.querySelector('.error-message');
  const tagDropdownTemplate = document.getElementById('tag-dropdown-template');
  const filterDropdown = document.getElementById('filter');
  const tagListElement = document.getElementById('tag-list');
  const newTagInput = document.getElementById('newTag');
  const addTagButton = document.getElementById('addTagButton');

  let listItems = JSON.parse(localStorage.getItem('listItems')) || [];
  let tags = JSON.parse(localStorage.getItem('tags')) || ["no tag", "internal", "yondr", "ag"];

  function initializeTags() {
    renderTags();
    updateTagDropdowns();
  }

  function renderTags() {
    tagListElement.innerHTML = '';
    tags.forEach((tag, index) => {
      const li = document.createElement('li');
      li.textContent = tag;

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => editTag(index));

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteTag(index));

      li.appendChild(editButton);
      li.appendChild(deleteButton);
      tagListElement.appendChild(li);
    });
  }

  function updateTagDropdowns() {
    document.querySelectorAll('.tag-dropdown').forEach(dropdown => {
        const currentTag = dropdown.value; // Store the currently selected tag

        dropdown.innerHTML = ''; // Clear existing options

        // Re-populate dropdown with updated tags
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            dropdown.appendChild(option);
        });

        // Ensure the dropdown reflects the previously selected tag or remains unchanged
        dropdown.value = currentTag; // Set the dropdown back to the selected tag
    });

    // Update filter dropdown as well
    filterDropdown.innerHTML = '<option value="all">all</option>';
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        filterDropdown.appendChild(option);
    });
}


  function addTag() {
    const newTag = newTagInput.value.trim();
    if (newTag && !tags.includes(newTag)) {
      tags.push(newTag); // Add the new tag to the tags array
      localStorage.setItem('tags', JSON.stringify(tags)); // Update localStorage
      renderTags();
      updateTagDropdowns(); // Ensure dropdowns are updated with the new tag
      newTagInput.value = ''; // Clear the input
      renderTags();
    }
  }

  function editTag(index) {
    const newTagName = prompt('Edit tag name:', tags[index]);
    if (newTagName && !tags.includes(newTagName)) {
      const oldTag = tags[index];
      tags[index] = newTagName;
      localStorage.setItem('tags', JSON.stringify(tags));

      // Update the tag in existing list items
      listItems.forEach(item => {
        if (item.tag === oldTag) {
          item.tag = newTagName;
        }
      });
      localStorage.setItem('listItems', JSON.stringify(listItems));

      renderTags();
      updateTagDropdowns();
      renderList(filterDropdown.value);
    }
  }

  function deleteTag(index) {
    const tagToDelete = tags[index];
    if (confirm(`Are you sure you want to delete the tag "${tagToDelete}"?`)) {
      tags.splice(index, 1);
      localStorage.setItem('tags', JSON.stringify(tags));

      // Remove the tag from existing list items
      listItems.forEach(item => {
        if (item.tag === tagToDelete) {
          item.tag = '';
        }
      });
      localStorage.setItem('listItems', JSON.stringify(listItems));

      renderTags();
      updateTagDropdowns();
      renderList(filterDropdown.value);
    }
  }

  addTagButton.addEventListener('click', addTag);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addListItem();
  });

  ul.addEventListener('click', deleteListItem);

  filterDropdown.addEventListener('change', (event) => {
    renderList(event.target.value);
  });

  function updateTag(id, tag) {
    const index = listItems.findIndex(item => item.id === id);
    if (index !== -1) {
      listItems[index].tag = tag;
      localStorage.setItem('listItems', JSON.stringify(listItems));
      renderList(filterDropdown.value);
    }
  }

  function addListItem() {
    const text = input.value.trim();
    if (text.length > 0) {
      const listItem = {
        id: Date.now(),
        value: text,
        tag: '',
        dateAdded: new Date().toISOString(),
        dueDate: dueDateInput.value
      };
      listItems.push(listItem);
      localStorage.setItem('listItems', JSON.stringify(listItems));
      input.value = '';
      dueDateInput.value = '';
      errorMessage.style.display = 'none';
      renderList(filterDropdown.value);
    } else {
      errorMessage.style.display = 'block';
    }
  }

  function deleteListItem(event) {
    if (event.target.tagName === 'BUTTON') {
      const li = event.target.closest('li');
      const id = parseInt(li.dataset.id);
      listItems = listItems.filter(item => item.id !== id);
      localStorage.setItem('listItems', JSON.stringify(listItems));
      renderList(filterDropdown.value);
    }
  }

  function renderList(filter = 'all') {
    ul.innerHTML = '';
    listItems.forEach(item => {
      if (filter === 'all' || item.tag === filter) {
        const li = document.createElement('li');
        li.dataset.id = item.id;

        const dateAdded = document.createElement('div');
        dateAdded.className = 'date-added';
        dateAdded.textContent = new Date(item.dateAdded).toLocaleDateString();

        const dueDate = document.createElement('div');
        dueDate.className = 'due-date';
        dueDate.textContent = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No due date';

        const span = document.createElement('span');
        span.textContent = item.value;

        const tagDropdown = tagDropdownTemplate.content.cloneNode(true).querySelector('select');
        tagDropdown.value = item.tag;
        tagDropdown.addEventListener('change', (event) => updateTag(item.id, event.target.value));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';

        li.appendChild(dateAdded);
        li.appendChild(dueDate);
        li.appendChild(span);
        li.appendChild(tagDropdown);
        li.appendChild(deleteButton);
        ul.appendChild(li);
      }
    });
  }

  initializeTags();
  renderList();
});
