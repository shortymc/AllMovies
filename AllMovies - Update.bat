@ECHO OFF
call git stash
call git pull
call git stash pop
call yarn
call yarn build
pause