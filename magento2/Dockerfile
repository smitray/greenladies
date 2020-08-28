FROM ubuntu:18.04

# Prepare apt repositories
RUN apt-get update
RUN apt-get -y install software-properties-common
RUN add-apt-repository ppa:ondrej/php
RUN apt-get update

# Install php
ENV DEBIAN_FRONTEND noninteractive
RUN ln -fs /usr/share/zoneinfo/Europe/Stockholm /etc/localtime
RUN apt-get -y install php7.3

# Install php extensions
RUN apt-get install -y php7.3-zip zip unzip
RUN apt-get install -y php7.3-bcmath
RUN apt-get install -y php7.3-curl
RUN apt-get install -y php7.3-dom
RUN apt-get install -y php7.3-mbstring
RUN apt-get install -y php7.3-gd
RUN apt-get install -y php7.3-intl
RUN apt-get install -y php7.3-mysql
RUN apt-get install -y php7.3-soap

# Install nginx
RUN apt-get install -y nginx
RUN apt-get install -y php7.3-fpm php7.3-cli

COPY php.ini /etc/php/7.3/cli/php.ini
COPY php.ini /etc/php/7.3/fpm/php.ini
COPY magento /etc/nginx/sites-enabled/magento
RUN rm /etc/nginx/sites-enabled/default

WORKDIR /var/www/html

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN chmod 777 /var/lib/php/sessions

ENTRYPOINT ["/entrypoint.sh"]
