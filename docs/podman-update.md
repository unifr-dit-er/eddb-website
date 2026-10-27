# Mise à jour du site

En tant que `podman` sur svx-web-eddb (`sudo machinectl shell --uid podman`).

```bash
cd ~/repos/eddb-website
git pull
podman build --ulimit nofile=4096:4096 -t eddb-website:latest .
systemctl --user restart eddb-website
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/   # 200
```

Une fois la nouvelle version vérifiée, retirer les images sans nom laissées
par la construction (jamais `-a`, voir `docs/podman.md` de
`svx-web-configs`) :

```bash
podman image prune -f
```
