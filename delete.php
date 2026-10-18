<?php
include 'config.php';

$type = $_POST['type'] ?? 'personal';
if (!in_array($type, ['personal', 'shared'])) $type = 'personal';

$id = (int) ($_POST['id'] ?? 0);
$stmt = mysqli_prepare($conn, "DELETE FROM todos WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);

header("Location: index.php?page=" . $type);
exit;