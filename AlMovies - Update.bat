@ECHO OFF
cd C:\Users\Pierre-Marie\git\AllMovies
call git stash
call git pull
call git stash pop
call yarn
call yarn build
pause