const form = document.getElementById("myform");
const addInput = document.getElementById("todo");
const editInput = document.getElementById("edit-input");
const todoContainer = document.getElementById("container");

//global variables to know status of task i.e if edit or add
let isEdited = false;
let editableItem = {};

//localstorage operation utility methods
const itemInLocalStorage = JSON.parse(localStorage.getItem("items")) || [];
const saveLocalStorage = (items) => {
  localStorage.setItem("items", JSON.stringify(items));
};
const filterLocalstorage = (editid) => {
  const filteredItem = itemInLocalStorage.filter(
    (items) => items.id === editid
  )[0];
  return filteredItem;
};

//main functions

//create list node
const createListElement = (item) => {
  const li = document.createElement("li");
  li.setAttribute("data-id", item.id);
  li.innerHTML = `
        <span>
            <span class="todo-text">${item.todo}</span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </span>
        `;
  return li;
};

//render the todos from localstorage on page load
const renderElementOnRefresh = () => {
  itemInLocalStorage.forEach((item) => {
    const li = createListElement(item);
    todoContainer.appendChild(li);
  });
};

//save the edited item to localstorage
const saveEdited = (id, newvalue) => {
  const itemToEdit = itemInLocalStorage.filter((item) => item.id === id)[0];
  itemToEdit.todo = newvalue;
  saveLocalStorage(itemInLocalStorage);
  location.reload();
};

//add/edit function that runs on form submit
const addTodo = (e) => {
  e.preventDefault();
  //(!isEdited && addInput.value === "") -> check addInput filed only if isEdited flag is not true i.e if we are not editing
  if (!isEdited && addInput.value === "") {
    alert("Field cannot be empty");
    return;
  }

  //if we are editing, we call the saveEdited function with the id of editableItem and the newvalue that we updated
  if (isEdited) {
    if (editInput.value === "") {
      lert("Field cannot be empty");
      return;
    }
    saveEdited(editableItem, editInput.value);
    return;
  }
  //generating random ids for todo items
  const id = Math.floor(Math.random() * 100);
  const todoItem = {
    id,
    todo: addInput.value,
  };

  const li = createListElement(todoItem);
  todoContainer.appendChild(li);
  addInput.value = "";
  itemInLocalStorage.push(todoItem);
  saveLocalStorage(itemInLocalStorage);
};

//delete an item based on id passed
const deleteItem = (id) => {
  //filter method returns all the array elements except the element with the given id
  const filteredItem = itemInLocalStorage.filter((items) => items.id !== id);
  saveLocalStorage(filteredItem);
  location.reload();
};

//function to detect if we clicked an edit button or delete button
const deleteUpdate = (e) => {
  if (e.target.classList.contains("delete")) {
    const li = e.target.parentElement.parentElement;
    const id = parseInt(li.getAttribute("data-id"));
    deleteItem(id);
  } else if (e.target.classList.contains("edit")) {
    const li = e.target.parentElement.parentElement;
    const id = parseInt(li.getAttribute("data-id"));
    const filteredItem = filterLocalstorage(id);
    editInput.type = "text";
    addInput.type = "hidden";
    editInput.value = filteredItem.todo;
    isEdited = true;
    editableItem = id;
  } else {
    //do nothing if neither edit nor delete button is clicked
    return;
  }
};
//call the renderElementOnRefresh() function to show list of todos saved in localstorage on page load
renderElementOnRefresh();
//handled click events on container to decide if either edit or todo is clicked
todoContainer.addEventListener("click", deleteUpdate);
//form submission handler -> when we press enter on the input field, form gets submitted
form.addEventListener("submit", addTodo);