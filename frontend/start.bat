@echo off
REM Script de démarrage rapide - Frontend Gestion des Chantiers

echo ================================================
echo.  Frontend Gestion des Chantiers
echo ================================================
echo.

REM Verifier si Node.js est installe
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js n'est pas installe
    echo   Installez Node.js depuis: https://nodejs.org
    pause
    exit /b 1
)

echo V Node.js detecte
node -v
echo V npm detecte
npm -v
echo.

REM Verifier si nous sommes dans le bon dossier
if not exist "package.json" (
    echo X Erreur: package.json non trouve
    echo   Assurez-vous d'etre dans le dossier frontend
    pause
    exit /b 1
)

echo V Dossier correct detecte
echo.

REM Verifier si node_modules existe
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo X Erreur lors de l'installation
        pause
        exit /b 1
    )
    echo V Dependances installees
) else (
    echo V Dependances deja installees
)

echo.
echo ================================================
echo  Tout est pret !
echo ================================================
echo.
echo Comptes de test:
echo    Admin:   admin@gestion.com / password
echo    Chef:    chef@gestion.com / password
echo    Ouvrier: ouvrier@gestion.com / password
echo.
echo L'application va demarrer sur: http://localhost:3000
echo.
echo ATTENTION: Assurez-vous que le backend est demarre sur le port 5000
echo.
echo Demarrage de l'application...
echo.

call npm run dev
