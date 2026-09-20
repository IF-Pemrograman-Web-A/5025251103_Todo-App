const todoForm = document.querySelector('.todo-form');
const todoList = document.getElementById('todo-list');

let todos = [];
let editIndex = null;

function renderTodos(){
    console.log('renderTodos jalan, jumlah todos:', todos.length);
    todoList.innerHTML = '';

    todos.forEach(function(todo, index){
        console.log('Bikin li untuk:', todo.title);
        const li = document.createElement('li');
        li.classList.add('todo-item', todo.completed ? 'done' : 'active');
        li.innerHTML = `<input type="checkbox" class="complete-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="task">${todo.title}</span>
            <span class="task-description">${todo.description}</span>
            <button type="button" class="btn-edit">Edit</button>
            <button type="button" class="btn-delete">Delete</button>`;
    
    li.querySelector('.complete-checkbox').addEventListener('change', function(){
        todo.completed = !todo.completed;
        renderTodos();
    });

    li.querySelector('.btn-delete').addEventListener('click', function(){
        todos.splice(index, 1);
        renderTodos();
    });

    li.querySelector('.btn-edit').addEventListener('click', function(){
        document.getElementById('todo-title').value = todo.title;
        document.getElementById('todo-description').value = todo.description;
        document.getElementById('todo-priority').value = todo.priority;

        editIndex = index;

        document.getElementById('detail-title').textContent = todo.title;
        document.getElementById('detail-description').textContent = todo.description;
        document.getElementById('detail-priority').textContent = todo.priority;
    });
    todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', function(event){
    event.preventDefault();
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;
    const priority = document.getElementById('todo-priority').value;

    console.log('Submit jalan, title:', title);

    if (editIndex === null){
            todos.push({
            title: title,
            description: description,
            priority: priority,
            completed: false
        });
    } else {
        todos[editIndex].title = title;
        todos[editIndex].description = description;
        todos[editIndex].priority = priority;
        editIndex = null;
    }
    
    console.log('Isi todos sekarang:', todos);
    
    renderTodos();
    todoForm.reset();
})

const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});