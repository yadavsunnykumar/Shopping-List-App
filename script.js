const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const formBtn = itemForm.querySelector('button')

const clear = document.getElementById('clear')
const filter = document.getElementById('filter')

let isEditMode = false

function displayItems() {
  const itemsFromStorage = getItemsFromStorage()
  itemsFromStorage.forEach((item) => addItemToDOM(item))
  checkUI()
}

//addItem function
function addItem(e) {
  e.preventDefault()

  const newItem = itemInput.value

  // validation
  if (newItem === '') {
    alert('Please add an item')
    return
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode')
    removeItemFromStorage(itemToEdit.textContent)
    itemToEdit.classList.remove('edit-mode')
    itemToEdit.remove()
    isEditMode = false
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
    formBtn.style.backgroundColor = '#333'
  }
  //Check for Duplicate
  if (checkIfItemExists(newItem)) {
    alert('Item already exists')
  } else {
    // create item DOM element
    addItemToDOM(newItem)
  }

  //Add item to localstorage
  addItemToStorage(newItem)

  checkUI()
  itemInput.value = ''

  //   filter.style.display = 'block'
  // clear.style.display = 'block'
}

function addItemToDOM(item) {
  //create list
  const li = document.createElement('li')
  li.appendChild(document.createTextNode(item))
  const button = createButton('remove-item btn-link text-red')
  li.appendChild(button)
  itemList.appendChild(li)
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage()

  // add new item to array
  itemsFromStorage.push(item)

  //convert to JSON string and set to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function getItemsFromStorage() {
  let itemsFromStorage
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = []
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'))
  }
  return itemsFromStorage
}

function createButton(classes) {
  const button = document.createElement('button')
  button.className = classes
  const icon = createIcon('fa-solid fa-xmark')
  button.appendChild(icon)
  return button
}

function createIcon(classes) {
  const i = document.createElement('i')
  i.className = classes
  return i
}
function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement)
  } else {
    setItemToEdit(e.target)
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage()
  return itemsFromStorage.includes(item)
}

function setItemToEdit(item) {
  isEditMode = true

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'))

  item.classList.add('edit-mode')
  formBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> Update Item'
  formBtn.style.backgroundColor = '#228B22'
  itemInput.value = item.textContent
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    //Remove Item from DOM
    item.remove()
    // Remove Item from LocalStoreage
    removeItemFromStorage(item.textContent)

    checkUI()
  }
}
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage()

  // Filter Out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item)

  // Re-set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild)
    localStorage.clear()
  }
  // Clear from LocalStorage
  localStorage.clear()

  checkUI()
}
function filterItem(e) {
  const items = itemList.querySelectorAll('li')
  const values = e.target.value.toLowerCase()
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLocaleLowerCase()
    if (itemName.indexOf(values) != -1) {
      item.style.display = 'flex'
    } else {
      item.style.display = 'none'
    }
  })
}

function checkUI() {
  const items = itemList.querySelectorAll('li')
  if (items.length === 0) {
    filter.style.display = 'none'
    clear.style.display = 'none'
  } else {
    filter.style.display = 'block'
    clear.style.display = 'block'
  }
}
//Initial function
function Init() {
  // Add Event listener
  itemForm.addEventListener('submit', addItem)
  itemList.addEventListener('click', onClickItem)
  clear.addEventListener('click', clearItems)
  filter.addEventListener('input', filterItem)
  document.addEventListener('DOMContentLoaded', displayItems)

  checkUI()
}
Init()
// clear.style.display = "block"
