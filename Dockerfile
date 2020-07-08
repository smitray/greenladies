FROM ubuntu:18.04

# Prepare apt repositories
RUN apt-get update
RUN apt -y install software-properties-common
RUN add-apt-repository ppa:ondrej/php
RUN apt-get update

# Install php 7.4
ENV DEBIAN_FRONTEND noninteractive
RUN ln -fs /usr/share/zoneinfo/Europe/Stockholm /etc/localtime
RUN apt-get -y install php7.4


# Install composer
RUN apt-get install -y curl
RUN curl -Ss https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer

# Install php extensions
RUN apt-get install -y php7.4-zip zip unzip

# Create magento project
ARG MAGENTO_PUBLIC_KEY
ENV MAGENTO_PUBLIC_KEY $MAGENTO_PUBLIC_KEY

ARG MAGENTO_PRIVATE_KEY
ENV MAGENTO_PRIVATE_KEY $MAGENTO_PRIVATE_KEY

RUN ls /var/www/html
RUN rm -rf /var/www/html/*

RUN composer global config http-basic.repo.magento.com $MAGENTO_PUBLIC_KEY $MAGENTO_PRIVATE_KEY
RUN composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition /var/www/html
