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
