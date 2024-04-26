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

It will build the application using the environment variable VITE_API_ENDPOINT. However, this environment variable 
is not "overridable" at runtime. Therefore, even if you pass an environment variable in your docker-compose file, 
it will have no effect. There is a trick that involves replacing the variable at runtime of the 
application using a bash entrypoint script.

### Script necessary to change variables:

```
#!/bin/sh
ROOT_DIR=/usr/share/nginx/html/assets
# Replace env vars in files served by NGINX
for file in $ROOT_DIR/*.js;

do
sed -i "s|VITE_API_ENDPOINT_PLACEHOLDER|${VITE_API_ENDPOINT}|g" $file
sed -i "s|VITE_IMAGE_BASE_URL_PLACEHOLDER|${VITE_IMAGE_BASE_URL}|g" $file
sed -i "s|VITE_STRIPE_KEY_PLACEHOLDER|${VITE_STRIPE_KEY}|g" $file
sed -i "s|VITE_STRIPE_SECRET_PLACEHOLDER|${VITE_STRIPE_SECRET}|g" $file
echo "Processing $file"
done
# Let container execution proceed
exec "$@"
```

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


# Manual deployment

### Steps to manually deploy database, frontend and backend app:

### Structure 

- Login to server 
- Create following folders: `database`, `frontend`, `backend`, `traefik`
- Pull necessary images from Docker repo:
- `docker image pull adrewkirts/crafted-by_frontend:latest`
- `docker image pull adrewkirts/crafted-by_backend:latest`
- Create a `docker-compose.yml` in each created folder and copy the following content:

### Docker compose files 

#### Database
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
    volumes:
      - mariadb_data:/var/lib/mysql

networks:
  common_network:
    external: true

volumes:
  mariadb_data:
```

#### Frontend
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
    environment:
      - VITE_API_ENDPOINT=https://api.fabriquepar.com/api
      - VITE_IMAGE_BASE_URL=https://api.fabriquepar.com
      - VITE_STRIPE_KEY=SECRET!
      - VITE_STRIPE_SECRET=SECRET!

networks:
  common_network:
    external: true
```

#### Backend 
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

#### Traefik
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
      - "traefik.http.middlewares.test-auth.basicauth.users=user:$$2y$$05$$oCRG5Ho1bS6JXS1ZzY9BI.wRIRbbrY1WhsQIwLLHrZfFKaqaCuaGS"

      - "traefik.http.routers.dashboard.rule=Host(`dashboard.fabriquepar.com`)"
      - "traefik.http.routers.dashboard.entrypoints=https"
      - "traefik.http.routers.dashboard.tls=true"
      - "traefik.http.routers.dashboard.tls.certresolver=le"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.middlewares=test-auth@docker"

    networks:
      - common_network

networks:
  common_network:
    external: true

volumes:
  traefik-public-certificates:
```

### Launching containers 

In each folder use the following command:

`docker compose up --build -d`

To launch the containers and check if all are running by using:

`docker ps`

The website is now accessible at `https://fabriquepar.com`


# CI / CD

## General structure

### How many branches will be used in the GitHub repository?
There will be two main branches: dev for ongoing development and prod for stable releases that go into production. 
Additionally, feature branches can be created for specific features or fixes that can be merged into dev once they are 
complete.

### Which branch will contain the development code?
The dev branch will contain the development code. It's where all the integration of new features, experiments, 
and testing pre-production happens.

### Which branch will contain the final code?
The prod branch will contain the final, stable code that is ready for production deployment.

### How to manage application versions?
Versions will be managed by tagging the releases in the prod branch. Each time there's a merge from dev to prod and the 
state is stable enough for production, a new Git tag (e.g., v1.1.0) will be created. This helps in tracking versions 
historically and assists in rollback scenarios if needed.

### Which branch will be used for building Docker images?
The prod branch will be used for building Docker images, ensuring that only production-ready code is deployed in 
your Docker containers.

### Which branch will be used for deploying my application?
The prod branch will be used for deploying the application.

### When should I build my Docker images?
Build your Docker images whenever there are changes merged into the prod branch. This process will be automated using 
GitHub Actions that triggers a build and pushes the Docker image to a registry every time changes 
are pushed to prod.

### How is the relationship between frontend and backend versions managed?
To keep frontend and backend versions aligned, the same versioning scheme is used and both parts will be updated 
simultaneously where necessary. If you release a new version of the backend, ensure the frontend is compatible and vice 
versa. Automated tests will be used to verify that the frontend and backend work together before merging changes into prod.


### GHA Workflow

#### How to push to live server

Steps to follow:

- Commit and push new feature to dev branch
- Update version in version.txt
- Commit and push to production branch ("prod")
- GHA will run when version is updated

![](https://i.ibb.co/B3Rs2Tk/gha-workflow-drawio.png)

```

name: CraftedBy Frontend server deploy

on:
  push:
    branches: [ "prod" ]
    paths:
      - 'version.txt'

jobs:
  build:

    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
      name: Checkout code
    
    - name: Read Version
      id: version
      run: echo "VERSION=$(cat version.txt)" >> $GITHUB_ENV

    - name: Build Docker image
      run: docker build . -t adrewkirts/crafted-by_frontend:latest -t adrewkirts/crafted-by_frontend:${{ env.VERSION }}

    - name: Log in to Docker Hub
      uses: docker/login-action@v1
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Push Docker Image
      run: docker push adrewkirts/crafted-by_frontend:${{ env.VERSION }}

    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.4
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd dockerfiles/frontend/
          sed -i "s|adrewkirts/crafted-by_frontend:.*|adrewkirts/crafted-by_frontend:${{ env.VERSION }}|g" docker-compose.yml
          sudo docker pull adrewkirts/crafted-by_frontend:${{ env.VERSION }}
          sudo docker compose up -d

```