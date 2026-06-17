$files = Get-ChildItem -Path "d:\Saeed Furniture\frontend" -Recurse -Filter "*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # 1. Strip the updatedAt param if it already exists to normalize
    $content = $content.Replace("https://ik.imagekit.io/de7qvcvqv/images/logo.png?updatedAt=1779608592778", "https://ik.imagekit.io/de7qvcvqv/images/logo.png")
    
    # 2. Replace all local /images/logo.png with the base ImageKit URL
    $content = $content.Replace("/images/logo.png", "https://ik.imagekit.io/de7qvcvqv/images/logo.png")
    
    # 3. Add the updatedAt param to all ImageKit URLs
    $content = $content.Replace("https://ik.imagekit.io/de7qvcvqv/images/logo.png", "https://ik.imagekit.io/de7qvcvqv/images/logo.png?updatedAt=1779608592778")
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -Encoding UTF8
        Write-Host "Updated $($file.Name)"
    }
}
