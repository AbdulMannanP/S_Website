#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Production Build Pipeline..."

echo "1. Installing exact dependencies..."
npm ci

echo "2. Running automated test suite..."
npm test

echo "Build Pipeline Successful! Ready for deployment."
