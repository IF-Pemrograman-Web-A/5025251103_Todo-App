<?php
include 'config.php';

$type = $_POST['type'] ?? 'personal';
if (!in_array($type, ['personal', 'shared'])) $type = 'personal';

$id          = (int) ($_POST['id'] ?? 0);
$title       = trim($_POST['title'] ?? '');
$description = trim($_POST['description'] ?? '');
$priority    = $_POST['priority'] ?? 'medium';
if (!in_array($priority, ['low', 'medium', 'high'])) $priority = 'medium';

if ($id > 0 && $title !== '') {
    $stmt = mysqli_prepare($conn, "UPDATE todos SET title = ?, description = ?, priority = ? WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "sssi", $title, $description, $priority, $id);
    mysqli_stmt_execute($stmt);
}

header("Location: index.php?page=" . $type);
exit;