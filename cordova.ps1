cd C:\DEV\workspace\AllMovies

$content = Get-Content("C:\DEV\workspace\AllMovies\src\app\service\dropbox.service.ts") | Out-String
$content = $content.replace("import Dropbox = require('dropbox');","import Dropbox from 'dropbox';")
$content | out-file "C:\DEV\workspace\AllMovies\src\app\service\dropbox.service.ts"

yarn cordova
rm -r -fo cordova\AllMovies\www
mkdir cordova\AllMovies\www
xcopy /s dist cordova\AllMovies\www
cd cordova\AllMovies
cordova build android
Copy-Item "C:\DEV\workspace\AllMovies\cordova\AllMovies\platforms\android\app\build\outputs\apk\debug\app-debug.apk" -Destination "C:\Users\PBR\Dropbox" -force

git checkout HEAD -- C:\DEV\workspace\AllMovies\src\app\service\dropbox.service.ts

if((Get-Item C:\Users\PBR\Dropbox\app-debug.apk).length -lt 5MB) {
	Write-Host "AN ERROR OCCURRED" -ForegroundColor Red
} else {
	Write-Host "APK SUCCESSFULLY GENERATED" -ForegroundColor Green
}
pause