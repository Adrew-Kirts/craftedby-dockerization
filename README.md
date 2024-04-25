# craftedby-dockerization
Dockerization of CraftedBy DB / Frontend / BackEnd

## Production server configuration

### Login to server 
ssh ezra@163.172.177.241

Change one time usable password 

### Add public key to server

ssh-copy-id -i  ~/.ssh/ezra.pub ezra@163.172.177.241

#### optional: remove password authentification

You can have both authentication modes active at the same time with SSH, by password and by keys.

You may want to disable password authentication for security reasons, to do this you need to modify the configuration file /etc/ssh/sshd_config as follows:

- On the line PasswordAuthentication, set it to no.

### Install Docker

Following https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository

#### Install Docker by using:

 Add Docker's official GPG key:
```
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

 Add the repository to Apt sources:

```
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
#### Launch nginx container to verify Docker and server functionality

`
sudo docker run --name mynginx1 -p 82:80 -d nginx
`
When visiting `http://163.172.177.241/` I now see the "Welcome to nginx" page which means it is working

## DNS server configuration

### DNS redirection 

Cloudflare DNS servers are used to redirect the registered domain name "fabriquepar.com" to the IP address of the server 

To do so, the following was done:

#### Create account on Cloudflare

#### Add DNS records
- Add type A record for fabriquepar.com
- Add wildcard type A record for *.fabriquepar.com

#### Copy the given nameservers by Cloudflare 
- Cloudflare typically assigns two random name servers e.g. `rob.ns.cloudflare.com`
- Add nameservers to the list of the registrar (in our case Scaleway)

#### Test if everything is working
By using the `dig fabriquepar.com` command we can see the response shows us the domain name is linked to the IP address of the server

```
$ dig fabriquepar.com                                                                                                                                                              ✔

; <<>> DiG 9.10.6 <<>> fabriquepar.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 31223
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;fabriquepar.com.		IN	A

;; ANSWER SECTION:
fabriquepar.com.	300	IN	A	163.172.177.241

;; Query time: 40 msec
;; SERVER: 1.1.1.1#53(1.1.1.1)
;; WHEN: Wed Apr 24 09:09:54 CEST 2024
;; MSG SIZE  rcvd: 60
```


### Advantages of using Cloudflare services

- **Performance**: Cloudflare's global network improves website performance by caching content closer to end-users.

- **Security**: Cloudflare provides DDoS protection and security features to safeguard websites from attacks.

- **Reliability**: Anycast network architecture enhances reliability and redundancy for website availability.

- **Analytics**: Cloudflare offers insights into website traffic, performance, and security events.

#### Cloudflare Services:

- **Web Application Firewall (WAF)**: Protects websites from web application vulnerabilities.

- **Content Delivery Network (CDN)**: Improves performance by caching and serving content globally.

- **SSL/TLS Encryption**: Secures communications with SSL/TLS encryption.

- **Load Balancing**: Distributes traffic across servers for scalability and availability.

- **DNS Management**: Provides advanced DNS management features for performance and security optimization.

## Traefik

### Usage of Traefik



### How to setup

docker-compose.yml to launch latest Traefik image and configure secure redirection 

```
services:
traefik:
image: traefik:latest
restart: always
labels:
- "traefik.enable=true"
- "traefik.docker.network=traefik-public"
- "traefik.http.middlewares.https-redirect.redirectscheme.scheme=https"
- "traefik.http.middlewares.https-redirect.redirectscheme.permanent=true"
- "traefik.http.routers.api.rule=Host(`fabriquepar.com`)"
- "traefik.http.routers.api.entrypoints=http,https"
- "traefik.http.routers.api.service=api@internal"
- "traefik.http.middlewares.https-redirect.redirectscheme.scheme=https"
- "traefik.http.middlewares.https-redirect.redirectscheme.permanent=true"
command:
- --providers.docker
- --providers.docker.exposedbydefault=false
- --entrypoints.http.address=:80
- --entrypoints.https.address=:443
- --certificatesresolvers.le.acme.email=ezra.strikwerda@le-campus-numerique.fr
- --certificatesresolvers.le.acme.storage=/certificates/acme.json
- --certificatesresolvers.le.acme.tlschallenge=true
- --accesslog
- --log
- --api.insecure=true
- --api.dashboard=true
ports:
- "80:80"
- "443:443"
- "8080:8080"
volumes:
- /var/run/docker.sock:/var/run/docker.sock:ro
- traefik-public-certificates:/certificates
networks:
- traefik-public

volumes:
traefik-public-certificates:

networks:
traefik-public:
external: true
```

### Add authentification for traefik dashboard:

#### Create password hash for user 

ex. user:password:

`echo $(htpasswd -nB user) | sed -e s/\\$/\\$\\$/g
`

It will ask for a new password which will be hashed and returned as:

`user:$$2y$$05$$oCRG5Ho1bS6JXS1ZzY9BI.wRIRbbrY1WhsQIwLLHrZfFKaqaCuaGS
`
```
labels:
- "traefik.http.middlewares.test-auth.basicauth.users=user:$$2y$$05$$oCRG5Ho1bS6JXS1ZzY9BI.wRIRbbrY1WhsQIwLLHrZfFKaqaCuaGS"
```
Redirect all traffic from nginx to secure HTTPS:

```
  
  TRAEFIK:
  
services:
  traefik:
    image: traefik:latest
    command:
      - --providers.docker
      - --providers.docker.exposedbydefault=false
      - --entrypoints.http.address=:80
      - --entrypoints.https.address=:443
      - --certificatesresolvers.le.acme.email=ezra.strikwerda@le-campus-numerique.fr
      - --certificatesresolvers.le.acme.storage=/certificates/acme.json
      - --certificatesresolvers.le.acme.tlschallenge=true
      - --accesslog
      - --log.level=DEBUG
#      - --api.insecure=true
      - --api.dashboard=true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik-public-certificates:/certificates
    ports:
      - "80:80"
      - "443:443"
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=traefik-public"
      - "traefik.http.middlewares.https-redirect.redirectscheme.scheme=https"
      - "traefik.http.middlewares.https-redirect.redirectscheme.permanent=true"
      - "traefik.http.routers.dashboard.middlewares=test-auth@docker"
      - "traefik.http.middlewares.test-auth.basicauth.users=user:$$2y$$05$$oCRG5Ho1bS6JXS1ZzY9BI.wRIRbbrY1WhsQIwLLHrZfFKaqaCuaGS"

#      - "traefik.http.routers.api.rule=Host(`api.fabriquepar.com`)"
#      - "traefik.http.routers.api.entrypoints=https"
#      - "traefik.http.routers.api.tls=true"
#      - "traefik.http.routers.api.tls.certresolver=le"
#      - "traefik.http.routers.api.service=api@internal"

      - "traefik.http.routers.dashboard.rule=Host(`dashboard.fabriquepar.com`)"
      - "traefik.http.routers.dashboard.entrypoints=https"
      - "traefik.http.routers.dashboard.tls=true"
      - "traefik.http.routers.dashboard.tls.certresolver=le"
      - "traefik.http.routers.dashboard.service=api@internal"

    networks:
      - traefik-public

networks:
  traefik-public:
    external: true

volumes:
  traefik-public-certificates:
  
  
  NGINX:
  
services:
  nginx:
    image: nginx:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nginx.rule=Host(`fabriquepar.com`)"
      - "traefik.http.routers.nginx.entrypoints=http"

      - "traefik.docker.network=traefik-public"

      - "traefik.http.routers.nginx.middlewares=https-redirect@docker"
      - "traefik.http.routers.nginx-secure.rule=Host(`fabriquepar.com`)"
      - "traefik.http.routers.nginx-secure.entrypoints=https"
      - "traefik.http.routers.nginx-secure.tls=true"
      - "traefik.http.routers.nginx-secure.tls.certresolver=le"
      - "traefik.http.routers.nginx-secure.service=nginx"

      - "traefik.http.services.nginx.loadbalancer.server.port=80"
    networks:
      - traefik-public

networks:
  traefik-public:
    external: true

```

#### Environment variables for containerized Vue app 

Before:
```
VITE_API_ENDPOINT="http://localhost:8000/api"
VITE_IMAGE_BASE_URL="http://localhost:8000"

VITE_STRIPE_KEY=pk_test_PZ5P8UpDWL0CqulY6YJjRzGo00vQtn1Ff3
VITE_STRIPE_SECRET=sk_test_sgFQbF0KnQt7Me5J852syFSJ00GklPEL7C
```

After:
```
VITE_API_ENDPOINT="VITE_API_ENDPOINT_PLACEHOLDER"
VITE_IMAGE_BASE_URL="VITE_IMAGE_BASE_URL_PLACEHOLDER"

VITE_STRIPE_KEY=VITE_STRIPE_KEY_PLACEHOLDER
VITE_STRIPE_SECRET=VITE_STRIPE_SECRET_PLACEHOLDER
```


# Into production

## Docker compose files 

### MariaDB
```
services:

  db:
    image: mariadb
    restart: always
    environment:
      MARIADB_DATABASE: craftedby_db
      MARIADB_USER: crafted_admin
      MARIADB_PASSWORD: password
      MARIADB_ROOT_PASSWORD: secret-password
    ports:
      - "3306:3306"
    networks:
      - common_network

networks:
  common_network:
    external: true
```

### Frontend
```
services:
  frontend:
    image: adrewkirts/crafted-by_frontend:latest
    restart: always
    container_name: craftedby-frontend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`fabriquepar.com`)"
      - "traefik.http.routers.frontend.entrypoints=https"
      - "traefik.http.routers.frontend.tls=true"
      - "traefik.http.routers.frontend.tls.certresolver=le"
      - "traefik.http.services.frontend.loadbalancer.server.port=80"
    ports:
      - "8081:80"
    networks:
      - common_network

networks:
  common_network:
    external: true
```

### Backend 
```
services:
  backend:
    image: adrewkirts/crafted-by_backend:latest
    restart: always
    container_name: craftedby-backend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`api.fabriquepar.com`)"
      - "traefik.http.routers.backend.entrypoints=https"
      - "traefik.http.routers.backend.tls=true"
      - "traefik.http.routers.backend.tls.certresolver=le"
      - "traefik.http.services.backend.loadbalancer.server.port=80"
    ports:
      - "8000:80"
    networks:
      - common_network

networks:
  common_network:
    external: true
```

### Traefic
```
services:
  traefik:
    image: traefik:latest
    command:
      - --providers.docker
      - --providers.docker.exposedbydefault=false
      - --entrypoints.http.address=:80
      - --entrypoints.https.address=:443
      - --certificatesresolvers.le.acme.email=ezra.strikwerda@le-campus-numerique.fr
      - --certificatesresolvers.le.acme.storage=/certificates/acme.json
      - --certificatesresolvers.le.acme.tlschallenge=true
      - --accesslog
      - --log.level=DEBUG
#      - --api.insecure=true
      - --api.dashboard=true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik-public-certificates:/certificates
    ports:
      - "80:80"
      - "443:443"
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=common_network"
      - "traefik.http.middlewares.https-redirect.redirectscheme.scheme=https"
      - "traefik.http.middlewares.https-redirect.redirectscheme.permanent=true"
      - "traefik.http.routers.dashboard.middlewares=test-auth@docker"
      - "traefik.http.middlewares.test-auth.basicauth.users=user:$$2y$$05$$oCRG5Ho1bS6JXS1ZzY9BI.wRIRbbrY1WhsQIwLLHrZfFKaqaCuaGS"

#      - "traefik.http.routers.api.rule=Host(`api.fabriquepar.com`)"
#      - "traefik.http.routers.api.entrypoints=https"
#      - "traefik.http.routers.api.tls=true"
#      - "traefik.http.routers.api.tls.certresolver=le"
#      - "traefik.http.routers.api.service=api@internal"

      - "traefik.http.routers.dashboard.rule=Host(`dashboard.fabriquepar.com`)"
      - "traefik.http.routers.dashboard.entrypoints=https"
      - "traefik.http.routers.dashboard.tls=true"
      - "traefik.http.routers.dashboard.tls.certresolver=le"
      - "traefik.http.routers.dashboard.service=api@internal"

    networks:
      - common_network

networks:
  common_network:
    external: true

volumes:
  traefik-public-certificates:
```



