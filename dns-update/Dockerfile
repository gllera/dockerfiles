FROM mesosphere/aws-cli

RUN apk -v --update add bind-tools && rm /var/cache/apk/*

WORKDIR /app
COPY update-route53.sh entrypoint.sh ./

ENTRYPOINT [ "sh", "/app/entrypoint.sh" ]
