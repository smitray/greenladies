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

# Install composer
RUN apt-get install -y curl
RUN curl -Ss https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer

COPY installer.sh /installer.sh
RUN chmod +x /installer.sh

WORKDIR /var/www/html

ENTRYPOINT ["/installer.sh"]
