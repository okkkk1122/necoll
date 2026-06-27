# گواهی SSL را اینجا قرار دهید:
#   fullchain.pem
#   privkey.pem
#
# مثال Let's Encrypt روی سرور:
#   certbot certonly --webroot -w /var/www/certbot -d necoll.ir
#   cp /etc/letsencrypt/live/necoll.ir/fullchain.pem ./nginx/ssl/
#   cp /etc/letsencrypt/live/necoll.ir/privkey.pem ./nginx/ssl/
#
# یا SSL را در Nginx بیرونی terminate کنید و فقط پورت 80 را به Docker بدهید.
