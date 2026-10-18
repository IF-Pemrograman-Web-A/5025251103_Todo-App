<?php include 'config.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo List - Style Warrior</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="site-header">
        <h1>My Todo List</h1>
        <p class="subtitle">Rafifah Nabil Rahmadian</p>
        <button id="darkModeToggle">🌙</button>
    </header>

    <?php include 'menu-bar.php'; ?>
    <?php include 'content.php'; ?>
    <footer class="site-footer">
        <p>&copy;initugaspweb</p>
    </footer>
    <script src="script.js"></script>
</body>


</html>