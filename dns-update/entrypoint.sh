#!/bin/sh

export IPFILE="/app/last-ip"
touch "$IPFILE"

counter=0

while true; do
   if [[ $counter -ge 600 ]]; then
      sh /app/update-route53.sh isAlive
      counter=0
   else
      sh /app/update-route53.sh
      counter=$((counter+1))
   fi
   sleep 1
done
