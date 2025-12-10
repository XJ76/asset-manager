# PowerShell Script to Deploy to Linux Server
# This script uploads files and connects you to the server

$SERVER = "server20.eport.ws"
$SERVER_USER = "root"
$SERVER_PASSWORD = "3P0rt2025xyz"
$REMOTE_PATH = "/opt/warranty-register"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  E-Port Dev Task 2 - Windows Deploy" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the project directory
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "Error: docker-compose.yml not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Checking for SSH/SCP tools..." -ForegroundColor Green

# Check for SCP (usually comes with Git for Windows or OpenSSH)
$scpPath = $null
if (Get-Command scp -ErrorAction SilentlyContinue) {
    $scpPath = "scp"
} elseif (Test-Path "C:\Program Files\Git\usr\bin\scp.exe") {
    $scpPath = "C:\Program Files\Git\usr\bin\scp.exe"
} elseif (Test-Path "C:\Windows\System32\OpenSSH\scp.exe") {
    $scpPath = "C:\Windows\System32\OpenSSH\scp.exe"
} else {
    Write-Host "SCP not found. Please install one of:" -ForegroundColor Yellow
    Write-Host "  1. Git for Windows (includes SCP)" -ForegroundColor Yellow
    Write-Host "  2. OpenSSH for Windows" -ForegroundColor Yellow
    Write-Host "  3. Or use WinSCP (GUI tool)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternatively, you can:" -ForegroundColor Yellow
    Write-Host "  1. Use Git to push your code" -ForegroundColor Yellow
    Write-Host "  2. Clone on the server: git clone <your-repo>" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found SCP at: $scpPath" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Uploading files to server..." -ForegroundColor Green
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

# Create a temporary file with the password for SCP
$tempPassFile = [System.IO.Path]::GetTempFileName()

# Upload files using SCP
# Note: SCP will prompt for password, or you can use SSH keys
Write-Host "Uploading project files..." -ForegroundColor Cyan
Write-Host "You will be prompted for the server password: $SERVER_PASSWORD" -ForegroundColor Yellow
Write-Host ""

# Use SSH to create directory first
Write-Host "Creating remote directory..." -ForegroundColor Cyan
$sshCommand = "ssh $SERVER_USER@$SERVER 'mkdir -p $REMOTE_PATH'"
Write-Host "Run this command:" -ForegroundColor Yellow
Write-Host "  $sshCommand" -ForegroundColor White
Write-Host "Password: $SERVER_PASSWORD" -ForegroundColor Yellow
Write-Host ""

# Upload files
Write-Host "To upload files, run this command:" -ForegroundColor Yellow
Write-Host "  scp -r . $SERVER_USER@${SERVER}:$REMOTE_PATH" -ForegroundColor White
Write-Host "Password: $SERVER_PASSWORD" -ForegroundColor Yellow
Write-Host ""

# Alternative: Use Git
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Alternative: Use Git (Recommended)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If your code is in Git, you can:" -ForegroundColor Green
Write-Host "  1. Push your code to GitHub/GitLab" -ForegroundColor Yellow
Write-Host "  2. SSH to server: ssh root@$SERVER" -ForegroundColor Yellow
Write-Host "  3. Run: cd /opt && git clone <your-repo-url> warranty-register" -ForegroundColor Yellow
Write-Host "  4. Run: cd warranty-register && chmod +x deploy.sh && sudo ./deploy.sh" -ForegroundColor Yellow
Write-Host ""

# Connect to server
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Next Steps" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After uploading files, connect to server:" -ForegroundColor Green
Write-Host "  ssh root@$SERVER" -ForegroundColor White
Write-Host "  Password: $SERVER_PASSWORD" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then run:" -ForegroundColor Green
Write-Host "  cd $REMOTE_PATH" -ForegroundColor White
Write-Host "  chmod +x deploy.sh" -ForegroundColor White
Write-Host "  sudo ./deploy.sh" -ForegroundColor White
Write-Host ""

# Cleanup
Remove-Item $tempPassFile -ErrorAction SilentlyContinue

Write-Host "Press any key to open SSH connection..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Try to open SSH connection
Write-Host ""
Write-Host "Connecting to server..." -ForegroundColor Green
Start-Process "ssh" -ArgumentList "$SERVER_USER@$SERVER"

