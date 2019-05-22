# paths variables
$dir = Get-Location
Set-Variable -Name "workspace" -Value "C:\workspace\HEAD\AllMovies"
Set-Variable -Name "outputDir" -Value "C:\workspace\HEAD\Dropbox"
$isWork = Test-Path -Path $workspace
if(-not $isWork){
	Set-Variable -Name "workspace" -Value "C:\workspace\AllMovies"
	Set-Variable -Name "outputDir" -Value "C:\Utilisateur\Pierre-Marie\Dropbox"
}
$apkDir = $workspace + "\cordova\AllMovies\platforms\android\app\build\outputs\apk\debug"
cd $workspace

# build the app then build the apk
Write-Host "Build angular app" -ForegroundColor Cyan
yarn cordova
Write-Host "Finish building" -ForegroundColor Green
rm -r -fo cordova\AllMovies\www
mkdir cordova\AllMovies\www
xcopy /s dist cordova\AllMovies\www
Write-Host "Finish copying" -ForegroundColor Green
cd cordova\AllMovies
Write-Host "Build apk" -ForegroundColor Cyan
cordova build android
Write-Host "Finish generating apk" -ForegroundColor Green

# Rename, move and upload to dropbox the apk
$newName = "AllMovies_" + (Get-Date -Format FileDateTime) + ".apk"
Rename-Item -Path ($apkDir + "\app-debug.apk") -NewName $newName
Move-Item ($apkDir + "\" + $newName) -Destination $outputDir -force
if($isWork){
	Write-Host "Upload the apk to Dropbox" -ForegroundColor Cyan
	cd $outputDir
	C:\cmder\vendor\git-for-windows\bin\bash.exe dropbox.sh upload $newName "Documents/Dev"
	Write-Host "Finish uploading" -ForegroundColor Green
}

# Logging result
if((Get-Item ($outputDir + "\" + $newName)).length -lt 2400KB) {
	Write-Host "AN ERROR OCCURRED" -ForegroundColor Red
} else {
	Write-Host "APK SUCCESSFULLY GENERATED" -ForegroundColor Green
}
cd $dir
pause
