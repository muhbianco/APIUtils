docker swarm init
NETWORK CREATE
docker network create --driver=overlay nome_da_rede

docker stack deploy --prune --resolve-image always -c traefik.yaml traefik
docker stack deploy --prune --resolve-image always -c portainer.yaml portainer
