# node

```
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
```

# git

```
sudo apt-get install -y git
sudo git clone https://github.com/ccnuyan/starc3_resource
```

# build-essential

```
sudo apt-get install -y build-essential
```

# npm

```
sudo npm run itaobao
sudo npm run build-web
```

# web

```
docker rm -f resource-web
docker build -t resource-web:0.0.1 -f Dockerfile.web .
docker run -d -p 8500:8500 -v /root/source:/etc/source --name resource-web resource-web:0.0.1
docker logs -f resource-web
```

# api

```
docker rm -f resource-api
docker build -t resource-api:0.0.1 -f Dockerfile.api .
docker run -d -p 3500:3500 -v /root/source:/etc/source --name resource-api resource-api:0.0.1
docker logs -f resource-api
```

# nginx

```
server {
location /{
    proxy_pass http://localhost:8500/;
    }
location /api/{
    proxy_pass http://localhost:3500/;
    }
}
```
