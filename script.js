const todoForm = document.querySelector('.todo-form');
const todoList = document.getElementById('todo-list');

let todos = [];
let editId = null;

const video = document.getElementById('camera-preview');
const btnStart = document.getElementById('btn-start-camera');
const btnCapture = document.getElementById('btn-capture');
const photoStatus = document.getElementById('photo-status');
const canvas = document.getElementById('photo-canvas');
const photoPreview = document.getElementById('photo-preview');
const btnRemove = document.getElementById('btn-remove-photo');

let currentImage = null; // Blob foto yang sedang dipilih
let previewUrl = null;
let cameraStream = null;

function setStatus(message) {
    photoStatus.textContent = message;
}

async function startCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = cameraStream;
        video.hidden = false;
        btnCapture.hidden = false;
        btnStart.hidden = true;
        setStatus('Kamera aktif.');
    } catch (err) {
        setStatus('Kamera tidak bisa dibuka: ' + err.message);
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    video.srcObject = null;
    video.hidden = true;
    btnCapture.hidden = true;
    btnStart.hidden = false;
}

function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(function (blob) {
        if (!blob) {
            setStatus('Gagal mengambil foto, coba lagi.');
            return;
        }
        currentImage = blob;

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(blob);
        photoPreview.src = previewUrl;
        photoPreview.hidden = false;
        btnRemove.hidden = false;

        stopCamera();
        setStatus('Foto berhasil diambil.');
    }, 'image/jpeg', 0.85);
}

function removePhoto() {
    currentImage = null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    photoPreview.removeAttribute('src');
    photoPreview.hidden = true;
    btnRemove.hidden = true;
    setStatus('Foto dihapus.');
}

btnStart.addEventListener('click', startCamera);
btnCapture.addEventListener('click', capturePhoto);
btnRemove.addEventListener('click', removePhoto);

function renderTodos(){
    //console.log('renderTodos jalan, jumlah todos:', todos.length);
    todoList.innerHTML = '';

    todos.forEach(function(todo){
        //console.log('Bikin li untuk:', todo.title);
        const li = document.createElement('li');
        li.classList.add('todo-item', todo.completed ? 'done' : 'active');
        li.innerHTML = `<input type="checkbox" class="complete-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="task"></span>
            <span class="task-description"></span>
            <button type="button" class="btn-edit">Edit</button>
            <button type="button" class="btn-delete">Delete</button>`;
    
    li.querySelector('.task').textContent = todo.title;
    li.querySelector('.task-description').textContent = todo.description;

        if (todo.image) {
    const img = document.createElement('img');
    img.className = 'todo-thumb';
    img.alt = 'Gambar untuk todo: ' + todo.title;
    img.src = URL.createObjectURL(todo.image);
    img.onload = () => URL.revokeObjectURL(img.src);
    li.insertBefore(img, li.querySelector('.task'));
}

    if (todo.notifyAt) {
    const time = document.createElement('span');
    time.className = 'task-time';
    time.textContent = 'Pengingat: ' + new Date(todo.notifyAt).toLocaleString('id-ID');
    li.insertBefore(time, li.querySelector('.btn-edit'));
}

    li.querySelector('.complete-checkbox').addEventListener('change', async function(){
        todo.completed = !todo.completed;
        await saveTodo(todo);
        renderTodos();
    });

    li.querySelector('.btn-delete').addEventListener('click', async function(){
        await deleteTodo(todo.id);
        todos = todos.filter(t => t.id !== todo.id);
        renderTodos();
    });

    li.querySelector('.btn-edit').addEventListener('click', function(){
        document.getElementById('todo-title').value = todo.title;
        document.getElementById('todo-description').value = todo.description;
        document.getElementById('todo-priority').value = todo.priority;
        document.getElementById('todo-notify').value = todo.notifyAt || '';

        editId = todo.id;

        removePhoto();
        if (todo.image) {
            currentImage = todo.image;
            previewUrl = URL.createObjectURL(todo.image);
            photoPreview.src = previewUrl;
            photoPreview.hidden = false;
            btnRemove.hidden = false;
        }
        setStatus('');

        document.getElementById('detail-title').textContent = todo.title;
        document.getElementById('detail-description').textContent = todo.description;
        document.getElementById('detail-priority').textContent = todo.priority;
    });
    todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', async function(event){
    event.preventDefault();
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;
    const priority = document.getElementById('todo-priority').value;
    const notifyAt = document.getElementById('todo-notify').value;

    //console.log('Submit jalan, title:', title);

    if (editId === null) {
    const todo = { title, description, priority, completed: false, image: currentImage, notifyAt, notified: false };
    todo.id = await saveTodo(todo);
    todos.push(todo);
} else {
    const todo = todos.find(t => t.id === editId);
    todo.title = title;
    todo.description = description;
    todo.priority = priority;
    todo.image = currentImage;
    if (todo.notifyAt !== notifyAt) todo.notified = false;
    todo.notifyAt = notifyAt; 
    await saveTodo(todo);
    editId = null;
}
    
    //console.log('Isi todos sekarang:', todos);
    
    removePhoto();
    setStatus('');
    renderTodos();
    todoForm.reset();
});

const btnNotif = document.getElementById('btn-notif');
const notifStatus = document.getElementById('notif-status');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

function updateNotifStatus() {
    if (!('Notification' in window)) {
        notifStatus.textContent = 'Browser ini tidak mendukung notifikasi.';
        btnNotif.hidden = true;
    } else if (Notification.permission === 'granted') {
        notifStatus.textContent = 'Notifikasi aktif.';
        btnNotif.hidden = true;
    } else if (Notification.permission === 'denied') {
        notifStatus.textContent = 'Notifikasi diblokir. Aktifkan lewat pengaturan situs di browser.';
        btnNotif.hidden = true;
    }
}

btnNotif.addEventListener('click', async function () {
    await Notification.requestPermission();
    updateNotifStatus();
});

async function checkReminders() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const reg = await navigator.serviceWorker.ready;
    const now = new Date();

    for (const todo of todos) {
        if (todo.notifyAt && !todo.notified && !todo.completed && new Date(todo.notifyAt) <= now) {
            await reg.showNotification('Pengingat: ' + todo.title, {
                body: todo.description || 'Waktunya mengerjakan todo ini.',
                tag: 'todo-' + todo.id
            });
            todo.notified = true;
            await saveTodo(todo);
        }
    }
}

setInterval(checkReminders, 30000);

(async function init() {
    todos = await getAllTodos();
    renderTodos();
    updateNotifStatus();
    checkReminders();
})();


const darkModeToggle = document.getElementById('darkModeToggle');

function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    darkModeToggle.setAttribute('aria-pressed', String(isDark));
};

applyTheme(localStorage.getItem('theme') === 'dark');

darkModeToggle.addEventListener('click', function() {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});