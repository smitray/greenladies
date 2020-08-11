#!/bin/bash

echo "--- Removing files from /var/www/html ---"
find /var/www/html -name /var/www/html -o -prune -exec rm -rf -- {} +

echo "--- Adding Magento credentials to composer ---"
composer global config http-basic.repo.magento.com $MAGENTO_PUBLIC_KEY $MAGENTO_PRIVATE_KEY

echo " --- Creating Magento project ---"
composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition=2.3.5 /var/www/html

echo "--- Updating folder permissions ---"
find var generated vendor pub/static pub/media app/etc -type f -exec chmod g+w {} +
find var generated vendor pub/static pub/media app/etc -type d -exec chmod g+ws {} +
chown -R :www-data .

echo "--- Installing Magento ---"
/var/www/html/bin/magento setup:install \
  --base-url=$MAGENTO_BASE_URL \
  --db-host=magento2-db \
  --db-name=$MYSQL_DATABASE \
  --db-user=$MYSQL_USERNAME \
  --db-password=$MYSQL_PASSWORD \
  --admin-firstname=$MAGENTO_ADMIN_FIRSTNAME \
  --admin-lastname=$MAGENTO_ADMIN_LASTNAME \
  --admin-email=$MAGENTO_ADMIN_EMAIL \
  --admin-user=$MAGENTO_ADMIN_USERNAME \
  --admin-password=$MAGENTO_ADMIN_PASSWORD \
  --language=sv_SE \
  --currency=SEK \
  --timezone=Europe/Stockholm \
  --use-rewrites=1

echo "--- Enabling developer mode ---"
bin/magento deploy:mode:set developer
