cd C:\DEV\workspace\AllMovies

$content = Get-Content("C:\DEV\workspace\AllMovies\src\app\service\dropbox.service.ts")
$content = $content.replace("import Dropbox = require('dropbox');","import Dropbox from 'dropbox';")
$content | out-file "C:\DEV\workspace\AllMovies\src\app\service\dropbox.service.ts"

yarn cordova
rm -r -fo cordova\AllMovies\www
mkdir cordova\AllMovies\www
xcopy /s dist cordova\AllMovies\www
cd cordova\AllMovies
cordova build android
Copy-Item "C:\DEV\workspace\AllMovies\cordova\AllMovies\platforms\android\app\build\outputs\apk\debug\app-debug.apk" -Destination "C:\Users\PBR\Dropbox" -force

$content = Get-Content("C:\DEV\workspace\AllMovies\src\app\service\dropbox.service.ts")
$content = $content.replace("import Dropbox from 'dropbox';","import Dropbox = require('dropbox');")
$content | out-file "C:\DEV\workspace\AllMovies\src\app\service\dropbox.service.ts"

echo APK SUCCESSFULLY GENERATED
pause