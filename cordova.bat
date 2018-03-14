cd C:\DEV\workspace\AllMovies
yarn cordova
RD /S /Q cordova\AllMovies\www
mkdir cordova\AllMovies\www
xcopy /s dist cordova\AllMovies\www
cd cordova\AllMovies
cordova build android
copy /Y C:\DEV\workspace\AllMovies\cordova\AllMovies\platforms\android\app\build\outputs\apk\debug\app-debug.apk C:\Users\PBR\Dropbox
