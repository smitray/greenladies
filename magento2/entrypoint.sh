#!/bin/bash

/var/www/html/bin/magento cron:install --force

/usr/sbin/service php7.3-fpm start
/usr/sbin/service nginx start
tail -f /dev/null
