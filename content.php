<main class="layout">
    <section class="panel todo-panel">
        <h2>Todo List</h2>
        <?php
        $page = $_GET['page'] ?? 'personal';
        if (!in_array($page, ['personal', 'shared'])) $page = 'personal';

        $stmt = mysqli_prepare($conn, "SELECT * FROM todos WHERE type = ? ORDER BY created_at DESC");
        mysqli_stmt_bind_param($stmt, "s", $page);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        ?>
        <ul id="todo-list">
            <?php while ($todo = mysqli_fetch_assoc($result)): ?>
                <li class="todo-item">
                    <span class="task"><?= htmlspecialchars($todo['title']) ?></span>
                    <span class="task-description"><?= htmlspecialchars($todo['description']) ?></span>
                    <button type="button" class="btn-edit"
                            data-id="<?= $todo['id'] ?>"
                            data-title="<?= htmlspecialchars($todo['title'], ENT_QUOTES) ?>"
                            data-description="<?= htmlspecialchars($todo['description'], ENT_QUOTES) ?>"
                            data-priority="<?= $todo['priority'] ?>">Edit</button>
                    <form method="post" action="delete.php" style="display:inline"
                          onsubmit="return confirm('Hapus todo ini?')">
                        <input type="hidden" name="id" value="<?= $todo['id'] ?>">
                        <input type="hidden" name="type" value="<?= $page ?>">
                        <button type="submit" class="btn-delete">Delete</button>
                    </form>
                </li>
            <?php endwhile; ?>
        </ul>
    </section>

    <aside class="panel editor-panel">
        <h2>Todo Detail</h2>

        <form class="todo-form" method="post" action="create.php">
            <input type="hidden" name="type" value="<?= $page ?>">
            <input type="hidden" name="id" id="todo-id">

            <label for="todo-title">Title</label>
            <input type="text" id="todo-title" name="title" placeholder="Judul todo...." required>

            <label for="todo-description">Description</label>
            <textarea id="todo-description" name="description" rows="3" placeholder="Deskripsi todo...."></textarea>

            <label for="todo-priority">Priority</label>
            <select id="todo-priority" name="priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <button type="submit" class="btn-submit">Save Todo</button>
        </form>

        <div class="todo-detail">
            <h3>Details</h3>
            <p><strong>Title:</strong> <span id="detail-title">-</span></p>
            <p><strong>Description:</strong> <span id="detail-description">-</span></p>
            <p><strong>Priority:</strong> <span id="detail-priority">-</span></p>
        </div>
    </aside>
</main>