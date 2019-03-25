$dir = Get-Location
Set-Variable -Name "workspace" -Value "C:\DEV\workspace\AllMovies"
$apkDir = $workspace + "\cordova\AllMovies\platforms\android\app\build\outputs\apk\debug"
Set-Variable -Name "outputDir" -Value "C:\Users\PBR\Dropbox\Documents\Dev Perso"

cd $workspace

yarn cordova
rm -r -fo cordova\AllMovies\www
mkdir cordova\AllMovies\www
xcopy /s dist cordova\AllMovies\www
cd cordova\AllMovies
cordova build android

$newName = "AllMovies_" + (Get-Date -Format FileDateTime) + ".apk"
Rename-Item -Path ($apkDir + "\app-debug.apk") -NewName $newName
Copy-Item ($apkDir + "\" + $newName) -Destination $outputDir -force

if((Get-Item ($outputDir + "\" + $newName)).length -lt 2400KB) {
	Write-Host "AN ERROR OCCURRED" -ForegroundColor Red
} else {
	Write-Host "APK SUCCESSFULLY GENERATED" -ForegroundColor Green
}
cd $dir
pause
