# API URL Update Script
# This PowerShell script updates all hardcoded localhost URLs to use the centralized API configuration

$files = @(
    "src\routes\UpdatePassword\UpdatePassword.js",
    "src\routes\UpdateEmail\UpdateEmail.js", 
    "src\routes\RankingPage\RankingPage.js",
    "src\routes\OtpEntry\OtpEntry.js",
    "src\routes\NewPassword\NewPassword.js",
    "src\routes\ForgotAccount\ForgotAccount.js",
    "src\routes\EmailConfirmed\EmailConfirmed.js",
    "src\routes\AdminPage\UserManagement.js",
    "src\routes\AdminPage\PartsManagement.js",
    "src\routes\AdminPage\AdminPage.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Updating $file..."
        
        # Read content
        $content = Get-Content $file -Raw
        
        # Add import if not present
        if ($content -notmatch 'import.*API_BASE_URL.*from.*config/api') {
            # Find the last import line and add our import after it
            $lines = Get-Content $file
            $lastImportIndex = -1
            for ($i = 0; $i -lt $lines.Length; $i++) {
                if ($lines[$i] -match '^import') {
                    $lastImportIndex = $i
                }
            }
            
            if ($lastImportIndex -ge 0) {
                $newLines = @()
                $newLines += $lines[0..$lastImportIndex]
                $newLines += 'import { API_BASE_URL } from "../../config/api";'
                $newLines += $lines[($lastImportIndex + 1)..($lines.Length - 1)]
                $newLines | Set-Content $file
            }
        }
        
        # Replace URLs
        (Get-Content $file -Raw) -replace 'http://localhost:8080', '${API_BASE_URL}' | Set-Content $file
        
        Write-Host "✓ Updated $file"
    } else {
        Write-Host "⚠ File not found: $file"
    }
}

Write-Host "🎉 All API URLs updated to use production backend!"
