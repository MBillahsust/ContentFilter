document.addEventListener('DOMContentLoaded', function () {
  const filterInput = document.getElementById('filterInput');
  const addBtn = document.getElementById('addBtn');
  const clearBtn = document.getElementById('clearBtn');
  const filtersList = document.getElementById('filtersList');
  const statusMessage = document.getElementById('statusMessage');

  let filtersSet = new Set(); // Using a Set to ensure uniqueness

  filterInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
          addFilter();
      }
  });

  addBtn.addEventListener('click', addFilter);
  clearBtn.addEventListener('click', clearFilters);

  function addFilter() {
      const filterToSave = filterInput.value.trim();
      if (filterToSave) {
          if (!filtersSet.has(filterToSave)) {
              filtersSet.add(filterToSave);
              saveFilters();
              displaySavedFilters();
              statusMessage.textContent = 'Filter saved!';
              setTimeout(() => {
                  statusMessage.textContent = '';
              }, 3000);
              filterInput.value = ''; // Clear input field after adding
          } else {
              statusMessage.textContent = 'Duplicate filter!';
              setTimeout(() => {
                  statusMessage.textContent = '';
              }, 3000);
          }
      }
  }

  function clearFilters() {
      filtersSet.clear();
      saveFilters();
      displaySavedFilters();
      statusMessage.textContent = 'All filters cleared!';
      setTimeout(() => {
          statusMessage.textContent = '';
      }, 3000);
  }

  // Function to save filters to chrome.storage
  function saveFilters() {
      chrome.storage.local.set({ filters: Array.from(filtersSet) });
  }

  // Function to load filters from chrome.storage
  function loadFilters() {
      chrome.storage.local.get(['filters'], function (result) {
          if (result.filters) {
              filtersSet = new Set(result.filters);
              displaySavedFilters();
          }
      });
  }

  function displaySavedFilters() {
      filtersList.innerHTML = '';
      filtersSet.forEach(function (filter) {
          const listItem = document.createElement('li');
          listItem.textContent = filter;

          const clearButton = document.createElement('button');
          clearButton.textContent = 'Clear';
          clearButton.style.display = 'none';
          clearButton.addEventListener('click', function () {
              filtersSet.delete(filter);
              saveFilters(); // Save filters after deletion
              displaySavedFilters();
          });

          listItem.appendChild(clearButton);
          listItem.addEventListener('mouseover', function () {
              clearButton.style.display = 'inline';
          });
          listItem.addEventListener('mouseout', function () {
              clearButton.style.display = 'none';
          });

          filtersList.appendChild(listItem);
      });
  }

  // Call loadFilters when the popup is opened
  loadFilters();

  // Initial display of saved filters
  displaySavedFilters();
});