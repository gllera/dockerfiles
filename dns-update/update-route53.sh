#!/bin/sh

# Change this if you want
COMMENT="Auto updating @ `date`"

# Change to AAAA if using an IPv6 address
TYPE="A"

# Get the external IP address from OpenDNS (more reliable than other providers)
IP=`dig +short myip.opendns.com @resolver1.opendns.com`

ISVALID=`echo "$IP" | grep -E '^([0-9]{1,3}\.?){4}$'`

if [ -z "$ISVALID" ]; then 
    echo "Invalid readed '$IP'. Exiting"
    exit 1
fi

print_changes() {
   RESULT=""
   for NAME in $RECORDS; do
      [ ! -z "$RESULT" ] && RESULT="$RESULT,"
      
      RESULT="$RESULT$(cat << EOF 
      {
        "Action":"UPSERT",
        "ResourceRecordSet":{
          "ResourceRecords":[
            {
              "Value":"$IP"
            }
          ],
          "Name":"$NAME",
          "Type":"$TYPE",
          "TTL":$TTL
        }
      }
EOF
)"
   done

   echo "$RESULT"
}

if grep -Fxq "$IP" "$IPFILE"; then
    [ -z "$1" ] || echo "IP is still $IP. Exiting"
    exit 0
else
    printf "IP has changed to $IP. Updating...."
    # Fill a temp file with valid JSON
    TMPFILE=$(mktemp /tmp/temporary-file.XXXXXXXX)
    cat > ${TMPFILE} << EOF
    {
      "Comment":"$COMMENT",
      "Changes":[ `print_changes` ]
    }
EOF

    # Update the Hosted Zone record
    aws route53 change-resource-record-sets \
        --hosted-zone-id $ZONEID \
        --change-batch file://"$TMPFILE" &> /dev/null

    if [ $? == 0 ]; then
       echo "DONE"
    else
       echo "ERROR"
    fi

    # Clean up
    rm $TMPFILE
fi

# All Done - cache the IP address for next time
echo "$IP" > "$IPFILE"
