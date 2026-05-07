Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Baki\Desktop\final-year-project-\code_sourse\public\icons\icon-1024x1024.jpg"
$resDir = "C:\Users\Baki\Desktop\final-year-project-\code_sourse\android\app\src\main\res"

$src = [System.Drawing.Image]::FromFile($srcPath)

$sizes = @{
    "mdpi" = 48
    "hdpi" = 72
    "xhdpi" = 96
    "xxhdpi" = 144
    "xxxhdpi" = 192
}

foreach ($key in $sizes.Keys) {
    $size = $sizes[$key]
    
    # Create launcher icon
    $dest = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($src, 0, 0, $size, $size)
    $g.Dispose()
    
    $launcherPath = Join-Path $resDir "mipmap-$key\ic_launcher.png"
    $roundPath = Join-Path $resDir "mipmap-$key\ic_launcher_round.png"
    $fgPath = Join-Path $resDir "mipmap-$key\ic_launcher_foreground.png"
    
    $dest.Save($launcherPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Save($roundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Create foreground (adaptive icon) - slightly larger canvas
    $fgSize = [int]($size * 1.5)
    $fg = New-Object System.Drawing.Bitmap($fgSize, $fgSize)
    $gf = [System.Drawing.Graphics]::FromImage($fg)
    $gf.Clear([System.Drawing.Color]::Transparent)
    $gf.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $offset = [int](($fgSize - $size) / 2)
    $gf.DrawImage($src, $offset, $offset, $size, $size)
    $gf.Dispose()
    $fg.Save($fgPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $dest.Dispose()
    $fg.Dispose()
    
    Write-Host "Created icons for mipmap-$key ($size px)"
}

$src.Dispose()
Write-Host "All icons generated successfully!"
