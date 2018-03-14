SET errorhandler=^|^| ^(PAUSE ^&^& EXIT /B 1^)

cd C:\DEV\workspace\AllMovies %errorhandler%
yarn cordova %errorhandler%
RD /S /Q cordova\AllMovies\www %errorhandler%
mkdir cordova\AllMovies\www %errorhandler%
xcopy /s dist cordova\AllMovies\www %errorhandler%
cd cordova\AllMovies %errorhandler%
cordova build android %errorhandler%
copy /Y C:\DEV\workspace\AllMovies\cordova\AllMovies\platforms\android\app\build\outputs\apk\debug\app-debug.apk C:\Users\PBR\Dropbox %errorhandler%
