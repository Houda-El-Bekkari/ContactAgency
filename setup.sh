#!/bin/bash

echo "Installation des dépendances..."
npm install

echo "Configuration de la base de données..."
npx prisma generate
npx prisma db push

echo "Lancement en mode développement..."
npm run dev