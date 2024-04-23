FROM php:8.2-fpm

# Install necessary packages
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    unzip \
    zip \
    git

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions required by Laravel
RUN docker-php-ext-install pdo_mysql

# Installing composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create Supervisor log folders
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/log/php-fpm
RUN mkdir -p /var/www/html
RUN mkdir -p /run/php

# Permissions
RUN chown -R www-data:www-data /var/www /var/log/nginx /var/log/php-fpm /run/php
RUN chmod -R 755 /var/www/html/

# Copy source code of the Laravel application
COPY php_code /var/www/html

# TODO git clone from repo and copy env file from local

# Permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

WORKDIR /var/www/html

# RUN composer install --no-interaction
RUN composer install --no-interaction

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/sites-available/default

# Copy the PHP-FPM conf file
COPY zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf

# Copy Supervisor configuration file
COPY supervisor.conf /etc/supervisor/conf.d/

# Expose the port for Nginx
EXPOSE 80

# Start Supervisor to manage processes
CMD ["/usr/bin/supervisord", "-n"]