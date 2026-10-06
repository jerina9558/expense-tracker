Add-Type -AssemblyName System.Windows.Forms

[System.Windows.Forms.MessageBox]::Show(
    "Boot process started successfully!`r`nGPU process started successfully!",
    "Boot + GPU Status",
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Information
)

Write-Host "BOOT PROCESS STARTED"
Write-Host "GPU PROCESS STARTED"