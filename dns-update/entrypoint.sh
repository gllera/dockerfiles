#!/bin/sh

export IPFILE="/app/last-ip"
export RECORDS=$(echo $RECORDSET | tr " " "\n")
touch "$IPFILE"

counter=0

while true; do
   if [[ $counter -ge 600 ]]; then
      counter=0
      isAlive="TRUE"
   else
      counter=$((counter+1))
      isAlive=
   fi

   sh /app/update-route53.sh $isAlive
   sleep 1
done
