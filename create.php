<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
include 'config.php';

$type = 'personal';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title       = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $priority    = $_POST['priority'] ?? 'medium';
    $type        = $_POST['type'] ?? 'personal';

    if (!in_array($priority, ['low', 'medium', 'high'])) $priority = 'medium';
    if (!in_array($type, ['personal', 'shared'])) $type = 'personal';

    if ($title !== '') {
        $stmt = mysqli_prepare($conn, "INSERT INTO todos (title, description, priority, type) VALUES (?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, "ssss", $title, $description, $priority, $type);
        mysqli_stmt_execute($stmt);
    }
}

header("Location: index.php?page=" . $type);
exit;