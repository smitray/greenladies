#!/bin/bash

/usr/sbin/service php7.3-fpm start
/usr/sbin/service nginx start
tail -f /dev/null
