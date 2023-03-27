class todo {
	constructor(title, checkbox) {
		this.id = -1;
		this.title = title;
		this.checkbox = checkbox;
	}
}

let notCompletedTodo = 0;

let todo_count = document.querySelector('.todo-count');
let glob = 0;
const todo_list = document.querySelector('.todo-list');
let user = localStorage.account ? localStorage.getItem('account') : "guest";
let currentFilter = document.querySelector('.filters a.selected');
let listName = document.querySelector('#list-name');
let new_todo = document.querySelector('.new-todo');
let todos = localStorage.todos ? JSON.parse(localStorage.getItem('todos')) : [];
let clearAll = document.querySelector('.clear-completed');

if (user != 'guest') {
	h1 = document.createElement('h1');
	but = document.createElement('button');
	but.className = 'saveToDB';
	but.innerText = 'Save Todo list in database';
	h1.appendChild(but);
	document.querySelector('.info').appendChild(h1);
}

const updateCompletedTodo = (count) => {
	todo_count.innerText = `${count} item left`;
	if (notCompletedTodo < todos.length) {
		clearAll.className = 'clear-completed';
	} else {
		clearAll.className += ' hidden';
	}
}

const createTemplate = (todo) => {
	return `
	<li list-id=${todo.id} ${todo.checkbox == true ? 'class="completed"' : ''}>
		<div class="view">
			<input onclick="checkTodo(${todo.id})" class="toggle" type="checkbox" ${todo.checkbox == true ? 'checked' : ''}>
			<label>${todo.title}</label>
			<button onclick="deleteTodo(${todo.id})" class="destroy"></button>
		</div>
	</li>
	`;
}

const deleteTodo = (index) => {
	todos.splice(index, 1);
	updateLocalStorage();
	updateTodoList();
}

const updateTodoList = () => {
	todo_list.innerHTML = "";
	notCompletedTodo = 0;
	if (todos.length > 0) {
		todos.forEach((item, index) => {
			item.id = index;
			if (currentFilter.text == "All") {
				todo_list.innerHTML += createTemplate(item);
			} else if (currentFilter.text == "Active" && item.checkbox == false) {
				todo_list.innerHTML += createTemplate(item);
			} else if (currentFilter.text == "Completed" && item.checkbox == true) {
				todo_list.innerHTML += createTemplate(item);
			}
			notCompletedTodo += item.checkbox == false ? 1 : 0;
			
		});
		document.querySelectorAll('[list-id]').forEach((item) => {
			let input;
			let todo_index = item.getAttribute('list-id');
			item.addEventListener('dblclick', function() {
				item.classList.add('editing');
				
				input = document.createElement('input');
				input.className = 'edit';
				input.addEventListener("focusout", function() {
					item.classList.remove('editing');
					item.removeChild(input);
				});
				item.appendChild(input);
				input.focus();
				input.value = todos[todo_index].title;
			});

			item.addEventListener("keyup", function(event) {
				if (event.key === 'Enter' || event.keyCode === 13) {
					todos[todo_index].title = input.value;
					updateLocalStorage();
					updateTodoList();
				} else if (event.key == 'Escape') {
					item.classList.remove('editing');
				}
			});
		});
	}
	updateCompletedTodo(notCompletedTodo);
}

const updateLocalStorage = () => {
	localStorage.setItem('todos', JSON.stringify(todos));
}

if (user == 'guest') {
	listName.innerText = "Guest";
} else {
	listName.innerText = user;
	$.ajax({
		type: "GET",
		url: 'php/todo_list.php',
		data: {author: user},
		success: function(response) {
			var jsonData = JSON.parse(response); 

			if (jsonData.success == "1") {
				todos = jsonData.todos;
				updateLocalStorage();
				updateTodoList();
				//alert('Download completed');
			} else {
				alert('Download failed. Please fill todo list and save it or again later');
			}
	   }
   });
}
	
new_todo.addEventListener('keypress', function(event) {
	if (event.key === 'Enter' || event.keyCode === 13) {
		curr_todo = new todo(new_todo.value, false);
 		todos.unshift(curr_todo);
		new_todo.value = '';
		updateLocalStorage();
		updateTodoList();
		
	}
});

const checkTodo = index => {
	todos[index].checkbox = !todos[index].checkbox;
	updateLocalStorage();
	updateTodoList();
}

updateTodoList();

document.querySelectorAll('.filters a').forEach((item) => {
	item.addEventListener(('click'), function() {
		if (this.text != currentFilter.text) {
			currentFilter.classList.toggle('selected');
			this.classList.toggle('selected');
			currentFilter = this;
			updateTodoList();
		}
	});	
});

clearAll.addEventListener('click', function() {
	for (let i = 0; i < todos.length; i++) {
		if (todos[i].checkbox == true)  {
			deleteTodo(i);
			i--;
		}
	}
});

document.querySelector('.toggle-all').addEventListener('click', function() {
	if (notCompletedTodo > 0) {
		todos.forEach((item) => {
			item.checkbox = true;
		});
	} else {
		todos.forEach((item) => {
			item.checkbox = false;
		});
	}
	updateLocalStorage();
	updateTodoList();
});

document.querySelector('.saveToDB').addEventListener('click', function(event) {
	event.preventDefault();
        $.ajax({
            type: "POST",
            url: 'php/todo_list.php',
            data: {author: user, todos:todos},
            success: function(response) {
                var jsonData = JSON.parse(response); 

                if (jsonData.success == "1") {
					alert('Save completed');
                } else {
                    alert('Saved failed. Please again later');
                }
           }
       });
});


