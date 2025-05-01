#!/usr/bin/env bash
# test-sendAlert.sh - send a test alert to Functions emulator or production endpoint
if [ $# -lt 2 ]; then
  echo "Usage: $0 CHILD_ID API_KEY [GLUCOSE]"
  exit 1
fi
CHILD_ID=$1
API_KEY=$2
GLUCOSE=${3:-100}
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
# Endpoint for Functions emulator
URL="http://localhost:5001/glucogotchi-45193/us-central1/api/sendAlert"

echo "Sending test alert to $URL"
curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d "{\"childId\":\"$CHILD_ID\",\"eventType\":\"test\",\"glucose\":$GLUCOSE,\"timestamp\":\"$TIMESTAMP\",\"apiKey\":\"$API_KEY\"}"
echo
