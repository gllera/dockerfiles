# dockerfiles

Source code of some images on https://hub.docker.com/r/gllera/

## dns-update

Daemon to update our domain on AWS Route53 to match our public IP just a second before it has been modified by our internet operator.
Based on the docker image 'mesosphere/aws-cli' and the bash script from https://gist.github.com/phybros/827aa561a44032dd1556

**Requires the following environment variables:**
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* ZONEID
* RECORDSET
* TTL

**Example run:**
```bash
docker run -it --rm \
   -e AWS_ACCESS_KEY_ID=AAAA123123BBBB31CCCC \
   -e AWS_SECRET_ACCESS_KEY=aaaabbbbssVVVaasv2312w+3fdsdf32fewVdasAA \
   -e ZONEID=AAAAAAABBBBB11 \
   -e RECORDSET='*.example.com example.com' \
   -e TTL=150 \
   gllera/dns-update
```

## telegram-bot

Telegram bot to recieve push notifications and also to execute remote commands.
Based on the docker image 'node:10.11.0-alpine' and the telegram bot node module https://github.com/yagop/node-telegram-bot-api

**Requires the following environment variables:**
* TELEGRAM_TOKEN
* WEBHOOK_ROOT
* MONGODB_URL
* CHAT_PASSWORD

**Example run:**
```bash
docker run -it --rm \
   -e TELEGRAM_TOKEN=112233445:BBAABBAAB-11AA22AA22AA44BB33ssbb33b \
   -e WEBHOOK_ROOT=https://www.example.com \
   -e MONGODB_URL=mongodb://localhost:27017 \
   -e CHAT_PASSWORD=1234 \
   gllera/telegram-bot
```
