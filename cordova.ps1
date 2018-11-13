$dir = Get-Location
Set-Variable -Name "workspace" -Value "C:\DEV\workspace\AllMovies"
$dropbox = $workspace + "\src\app\shared\service\dropbox.service.ts"
$apkDir = $workspace + "\cordova\AllMovies\platforms\android\app\build\outputs\apk\debug"
Set-Variable -Name "outputDir" -Value "C:\Users\PBR\Dropbox\Documents\Dev Perso"

cd $workspace

# $content = Get-Content($dropbox) | Out-String
# $content = $content.replace("import Dropbox = require('dropbox');","import Dropbox from 'dropbox';")
# $content | out-file $dropbox

yarn cordova
rm -r -fo cordova\AllMovies\www
mkdir cordova\AllMovies\www
xcopy /s dist cordova\AllMovies\www
cd cordova\AllMovies
cordova build android

$newName = "app-debug_" + (Get-Date -Format FileDateTime) + ".apk"
Rename-Item -Path ($apkDir + "\app-debug.apk") -NewName $newName
Copy-Item ($apkDir + "\" + $newName) -Destination $outputDir -force

# git checkout HEAD -- $dropbox

if((Get-Item ($outputDir + "\" + $newName)).length -lt 2400KB) {
	Write-Host "AN ERROR OCCURRED" -ForegroundColor Red
} else {
	Write-Host "APK SUCCESSFULLY GENERATED" -ForegroundColor Green
}
cd $dir
pause
