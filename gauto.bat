git status
git add .
@echo off
set /p ff="Enter the commit msg" 
git commit -m %ff%
git push origin master