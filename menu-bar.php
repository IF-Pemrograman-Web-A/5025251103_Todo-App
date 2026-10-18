<?php $page = $_GET['page'] ?? 'personal'; ?>
<nav class="menu-bar">
  <a href="index.php?page=personal" class="<?= $page == 'personal' ? 'active' : '' ?>">Personal</a>
  <a href="index.php?page=shared" class="<?= $page == 'shared' ? 'active' : '' ?>">Shared</a>
</nav>