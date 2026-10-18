const todoForm = document.querySelector('.todo-form');
const submitBtn = document.querySelector('.btn-submit');

document.querySelectorAll('.btn-edit').forEach(function (btn) {
    btn.addEventListener('click', function () {
        document.getElementById('todo-id').value = btn.dataset.id;
        document.getElementById('todo-title').value = btn.dataset.title;
        document.getElementById('todo-description').value = btn.dataset.description;
        document.getElementById('todo-priority').value = btn.dataset.priority;

        document.getElementById('detail-title').textContent = btn.dataset.title;
        document.getElementById('detail-description').textContent = btn.dataset.description;
        document.getElementById('detail-priority').textContent = btn.dataset.priority;

        todoForm.action = 'update.php';
        submitBtn.textContent = 'Update Todo';
    });
});

document.getElementById('darkModeToggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
});