#!/bin/bash
# Script pour démarrer vite preview avec le PORT de Railway

# Railway fournit la variable PORT
if [ -z "$PORT" ]; then
  PORT=4173
fi

echo "🚀 Starting Vite preview on port $PORT..."
npx vite preview --host 0.0.0.0 --port $PORT
