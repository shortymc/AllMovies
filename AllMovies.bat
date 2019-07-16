@echo off
cd C:\Users\Pierre-Marie\git\AllMovies
:debut
set /p answer="1. CMD    2.Code    3. Update    4. Build    5.Start  "
set "result=nothing"
IF /i "%answer%"=="1" (
	cmd.exe /K "cd ."
) else IF /i "%answer%"=="2" (
	code .
) else IF /i "%answer%"=="3" (
	call "AllMovies - Update.bat"
	goto debut
) else IF /i "%answer%"=="4" (
	call yarn
	call yarn build
	goto debut
) else IF /i "%answer%"=="5" (
	call live-server dist
) else (
 goto debut
)