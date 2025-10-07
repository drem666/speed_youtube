@echo off
REM =======================================================
REM Batch Script to Create Folder Structure for Extension
REM Project: speed_youtube
REM =======================================================

SET ROOT=speed_youtube

REM Create root directory
mkdir %ROOT%

REM Create subfolders
mkdir %ROOT%\icons
mkdir %ROOT%\scripts
mkdir %ROOT%\styles

REM Create files
type nul > %ROOT%\manifest.json
type nul > %ROOT%\README.md
type nul > %ROOT%\scripts\content.js
type nul > %ROOT%\scripts\background.js
type nul > %ROOT%\scripts\popup.js
type nul > %ROOT%\styles\popup.css
type nul > %ROOT%\popup.html

echo Folder structure for speed_youtube created successfully.
pause
