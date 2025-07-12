// step 1 - initialize our list of todos && display the todos

let mainContainer = document.querySelector('main');
let addBtn = document.getElementById('addBtn');
let todoInput = document.getElementById('todoInput');

let todo_list = localStorage.getItem('todo-list')
  ? JSON.parse(localStorage.getItem('todo-list')).todo_list
  : []; //I use a ternary conditional statement to create a special statement that will read the current todos from the local storage if they exist. And otherwise, (? if false) it will return an empty array

// This function creates a new DOM element for each todo item. The older version would repaint the whole list after each item was added or deleted. The objective here is to make it so those functions append themselves instead of repeating 
function createTodoElement(todo, index) {
  const todoDiv = document.createElement('div');
  todoDiv.className = 'todoItem';
  todoDiv.setAttribute('data-index', index);

  const p = document.createElement('p');
  p.textContent = todo.text;

  const descP = document.createElement('p');
  descP.style.fontSize = '0.8em';
  descP.style.color = '#555';
  descP.textContent = todo.description || 'Loading description...';

  const img = document.createElement('img'); //This is the A.I generated image
  img.className = 'todoImage';
  if (todo.image_url) {
    img.src = todo.image_url;
    img.alt = `Image for ${todo.text}`;
  }

  const actions = document.createElement('div'); //this is the A.I generated description
  actions.className = 'actionsContainer';

  const editBtn = document.createElement('button');
  editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editBtn.onclick = () => editTodo(index);

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  deleteBtn.onclick = () => deleteTodo(index);

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  todoDiv.appendChild(p);
  todoDiv.appendChild(descP);
  if (todo.image_url) todoDiv.appendChild(img);
  todoDiv.appendChild(actions);

  return todoDiv;
}

// step 2 - write a function that allows us to add a new todo

function addTodo() {
  let current_todo = todoInput.value;
  if (!current_todo) { return } //this is a guard clause. It makes it so if there´s no to do input the code will jump out of the function and not get any further

  const index = todo_list.length;
  const newTodo = {
    text: current_todo,
    description: '',
    image_url: ''
  };

  todo_list.push(newTodo); //if we do have an input, it´ll be pushed to the list
  const newItem = createTodoElement(newTodo, index);
  mainContainer.appendChild(newItem); // we append the new todo DOM node directly - thus making this function O(1) !!!
  todoInput.value = ''; //this cleans the input bar after an input has been added to the list
  saveData();
  fetchAIGeneratedContent(index);
}

addBtn.addEventListener('click', addTodo); //then we assign this function to a button

// step 3 - write a function that allows us to delete a todo

function deleteTodo(index) {
  todo_list.splice(index, 1); // removes the item from the data list
  saveData();
  renderAll(); // now we re-render all to reassign the indexes
}

// step 4 - write a function that allows us to edit a todo

function editTodo(index) {
  let current_todo = todo_list[index]; //1: this gets the current todo we want to edit and brings it to the input bar where we can edit it
  todoInput.value = current_todo.text;
  deleteTodo(index); //2 - we conjure the delete function to delete the current index running through the edit function. Leaving only the edited input behind
}

// step 5 - persist all information

function saveData() {
  localStorage.setItem('todo-list', JSON.stringify({ todo_list })); //this utilizes the browsers local database to save the info and we use the object literal syntax so that we don´t have to write the key and the value
}

// repaint entire list — used when reloading or after deletions
function renderAll() {
  mainContainer.innerHTML = '';
  todo_list.forEach((todo, i) => {
    mainContainer.appendChild(createTodoElement(todo, i));
  });
}

renderAll(); // Initial UI paint from localStorage

//Step: 6 Now let´s fetch an AI-generated description and image

async function fetchAIGeneratedContent(index) {  
  const todo = todo_list[index]; //we´re going to get the current todo object and with the try function we´re going to get the A.I´s response 
  const OPENAI_API_KEY = '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'; // Replace with your API key

  try {
    // this fetches the description
    const descRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: `Write a casual two sentences (no more than 10 words long) description of the item but do it like you actually hate me and doubt I will do anything in the list: "${todo.text}"` }
        ],
        max_tokens: 60
      })
    });
    const descData = await descRes.json();
    todo.description = descData.choices[0].message.content.trim();

    //Same thing wIth the image
    const imgRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({ //we then translate the JS object into a JSON string so the A.P.I can read it properly and return with a response for us
        prompt: todo.text,
        n: 1,
        size: '256x256'
      })
    });
    const imgData = await imgRes.json();
    todo.image_url = imgData.data[0].url;

    saveData(); //Then we save data and renderall again to persist the image and the description
    renderAll();
  } catch (err) {
    console.error('AI generation failed:', err);
  }
}