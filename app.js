document.addEventListener('DOMContentLoaded', function () {
    var newTodoInput = document.querySelector('.new-todo');
    var todoList = document.querySelector('.todo-list');
    var toggleAll = document.querySelector('#toggle-all');
    var clearCompletedButton = document.querySelector('.clear-completed');
    var filters = document.querySelectorAll('.filters a');
    var todoCount = document.querySelector('.todo-count strong');
    
    var todos = JSON.parse(localStorage.getItem('todos')) || [];

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(function (todo, index) {
            var li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            li.innerHTML = `
                <div class="view">
                    <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <label>${todo.title}</label>
                    <button class="destroy"></button>
                </div>
                <input class="edit" value="${todo.title}">
            `;
            todoList.appendChild(li);

            li.querySelector('.toggle').addEventListener('change', function () {
                toggleTodoCompleted(index);
            });

            li.querySelector('.destroy').addEventListener('click', function () {
                deleteTodo(index);
            });

            li.querySelector('label').addEventListener('dblclick', function () {
                editTodoMode(li);
            });

            li.querySelector('.edit').addEventListener('blur', function () {
                updateTodoTitle(index, this.value);
                li.classList.remove('editing');
            });

            li.querySelector('.edit').addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    this.blur();
                }
            });
        });

        updateTodoCount();
        toggleAll.checked = todos.length && todos.every(function (todo) {
            return todo.completed;
        });
    }

    function addTodo(title) {
        todos.push({ title: title, completed: false });
        saveTodos();
        renderTodos();
    }

    function toggleTodoCompleted(index) {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }

    function editTodoMode(li) {
        li.classList.add('editing');
        li.querySelector('.edit').focus();
    }

    function updateTodoTitle(index, title) {
        todos[index].title = title;
        saveTodos();
        renderTodos();
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function updateTodoCount() {
        var activeTodos = todos.filter(function (todo) {
            return !todo.completed;
        }).length;
        todoCount.textContent = activeTodos;
    }

    newTodoInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter' && this.value.trim()) {
            addTodo(this.value.trim());
            this.value = '';
        }
    });

    toggleAll.addEventListener('change', function () {
        var checked = this.checked;
        todos.forEach(function (todo) {
            todo.completed = checked;
        });
        saveTodos();
        renderTodos();
    });

    clearCompletedButton.addEventListener('click', function () {
        todos = todos.filter(function (todo) {
            return !todo.completed;
        });
        saveTodos();
        renderTodos();
    });

    filters.forEach(function (filter) {
        filter.addEventListener('click', function (event) {
            event.preventDefault();
            filters.forEach(function (filter) {
                filter.classList.remove('selected');
            });
            this.classList.add('selected');
            var filterType = this.getAttribute('href').substring(2);
            renderFilteredTodos(filterType);
        });
    });

    function renderFilteredTodos(filter) {
        todoList.innerHTML = '';
        var filteredTodos;
        switch (filter) {
            case 'active':
                filteredTodos = todos.filter(function (todo) {
                    return !todo.completed;
                });
                break;
            case 'completed':
                filteredTodos = todos.filter(function (todo) {
                    return todo.completed;
                });
                break;
            default:
                filteredTodos = todos;
                break;
        }
        filteredTodos.forEach(function (todo, index) {
            var li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            li.innerHTML = `
                <div class="view">
                    <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <label>${todo.title}</label>
                    <button class="destroy"></button>
                </div>
                <input class="edit" value="${todo.title}">
            `;
            todoList.appendChild(li);

            li.querySelector('.toggle').addEventListener('change', function () {
                toggleTodoCompleted(index);
            });

            li.querySelector('.destroy').addEventListener('click', function () {
                deleteTodo(index);
            });

            li.querySelector('label').addEventListener('dblclick', function () {
                editTodoMode(li);
            });

            li.querySelector('.edit').addEventListener('blur', function () {
                updateTodoTitle(index, this.value);
                li.classList.remove('editing');
            });

            li.querySelector('.edit').addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    this.blur();
                }
            });
        });
        updateTodoCount();
    }

    renderTodos();
});
