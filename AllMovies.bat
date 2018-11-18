@echo off
cd C:\Users\workspace\git\AllMovies
:debut
set /p answer="1. CMD    2. Update    3.Start  "
set "result=nothing"
IF /i "%answer%"=="1" (
	call "AllMovies - CMD.bat"
) else IF /i "%answer%"=="2" (
	call "AllMovies - Update.bat"
) else IF /i "%answer%"=="3" (
	call "AllMovies - Start.bat"
) else (
 goto debut
)