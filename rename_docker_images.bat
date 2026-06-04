@echo off
echo ========================================================
echo   Rename and Push Docker Images (HireHub -^> TalentSphere)
echo ========================================================
echo.
echo Make sure Docker is running and you are logged into Docker Hub as 'naseeb03'.
echo You can log in using: docker login
echo.
pause

echo.
echo [1/3] Processing Node Backend Image...
docker pull docker.io/naseeb03/hirehub-node-backend:latest
docker tag docker.io/naseeb03/hirehub-node-backend:latest docker.io/naseeb03/talentsphere-node-backend:latest
docker push docker.io/naseeb03/talentsphere-node-backend:latest

echo.
echo [2/3] Processing FastAPI Service Image...
docker pull docker.io/naseeb03/hirehub-fastapi-service:latest
docker tag docker.io/naseeb03/hirehub-fastapi-service:latest docker.io/naseeb03/talentsphere-fastapi-service:latest
docker push docker.io/naseeb03/talentsphere-fastapi-service:latest

echo.
echo [3/3] Processing Frontend Image...
docker pull docker.io/naseeb03/hirehub-mern-frontend:latest
docker tag docker.io/naseeb03/hirehub-mern-frontend:latest docker.io/naseeb03/talentsphere-mern-frontend:latest
docker push docker.io/naseeb03/talentsphere-mern-frontend:latest

echo.
echo ========================================================
echo   All images have been renamed and pushed successfully!
echo ========================================================
pause
