FROM php:8.2-fpm

# Install necessary packages
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    unzip \
    zip \
    git \
 && docker-php-ext-install pdo_mysql \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Installing composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy source code of the Laravel application
COPY backend_code /var/www/html

RUN mkdir -p /var/log/nginx /var/log/php-fpm /run/php \
 && chown -R www-data:www-data /var/www /var/log/nginx /var/log/php-fpm /run/php /var/www/html/storage /var/www/html/bootstrap/cache \
 && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

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