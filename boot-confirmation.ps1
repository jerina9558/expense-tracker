Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "Boot Confirmation"
$form.Width = 450
$form.Height = 220
$form.StartPosition = "CenterScreen"
$form.MaximizeBox = $false
$form.MinimizeBox = $false

$label = New-Object System.Windows.Forms.Label
$label.Text = "Build completed successfully.`r`nEnter 'continue' to start booting:"
$label.Location = New-Object System.Drawing.Point(30,30)
$label.Size = New-Object System.Drawing.Size(380,50)

$textBox = New-Object System.Windows.Forms.TextBox
$textBox.Location = New-Object System.Drawing.Point(30,90)
$textBox.Size = New-Object System.Drawing.Size(380,25)

$button = New-Object System.Windows.Forms.Button
$button.Text = "OK"
$button.Location = New-Object System.Drawing.Point(175,130)
$button.Size = New-Object System.Drawing.Size(90,30)

$button.Add_Click({
    if ($textBox.Text.Trim().ToLower() -eq "continue") {
        $form.Tag = "continue"
    }
    else {
        $form.Tag = "exit"
    }

    $form.Close()
})

$form.Controls.Add($label)
$form.Controls.Add($textBox)
$form.Controls.Add($button)

$form.Add_Shown({
    $textBox.Focus()
})

$form.ShowDialog() | Out-Null

if ($form.Tag -eq "continue") {
    Write-Host "continue"
    exit 0
}
else {
    Write-Host "exit"
    exit 1
}