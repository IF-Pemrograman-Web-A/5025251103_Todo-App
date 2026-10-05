const STORE = 'todos';

const dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open('todo-db', 1);
    req.onupgradeneeded = () => {
        req.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
});

async function dbRequest(mode, action) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const request = action(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(request.result);
        tx.onerror = () => reject(tx.error);
    });
}

const getAllTodos = () => dbRequest('readonly', store => store.getAll());
const saveTodo = todo => dbRequest('readwrite', store => store.put(todo)); // add + update, mengembalikan id
const deleteTodo = id => dbRequest('readwrite', store => store.delete(id));