$roots = @(
  "pages/student",
  "pages/teacher",
  "pages/admin"
)

$scripts = @(
  '<script defer src="../../js/store.js"></script>',
  '<script defer src="../../js/data.js"></script>',
  '<script defer src="../../js/guard.js"></script>',
  '<script defer src="../../js/modal.js"></script>',
  '<script defer src="../../js/toast.js"></script>'
)

foreach ($root in $roots) {
  foreach ($html in Get-ChildItem -Path $root -Filter *.html) {
    $text = Get-Content -Path $html.FullName -Raw
    if ($text -match 'js/guard.js') { continue }
    if ($text -match '</body>') {
      $replacement = "`n" + ($scripts -join "`n") + "`n</body>"
      $updated = $text -replace '</body>', $replacement
      Set-Content -Path $html.FullName -Value $updated -Encoding utf8
    }
  }
}
