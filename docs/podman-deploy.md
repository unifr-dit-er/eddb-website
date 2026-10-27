# Mise en ligne sur svx-web-eddb

Le site remplace `eddb-hub`, l'ancienne page d'accueil d'eddb.unifr.ch, sur
le port 8080 de la VM, vers lequel le nginx de la VM envoie
`eddb.unifr.ch/` (`svx-web-configs`). La configuration nginx de la VM ne
change pas : seul le conteneur derrière le port 8080 change.

Toutes les commandes en tant que `podman` sur svx-web-eddb
(`sudo machinectl shell --uid podman`).

## 1. Cloner le dépôt

```bash
cd ~/repos
git clone https://github.com/unifr-dit-er/eddb-website.git
```

## 2. Construire l'image

```bash
cd ~/repos/eddb-website
podman build --ulimit nofile=4096:4096 -t eddb-website:latest .
```

Test hors production, sur un port libre :

```bash
podman run -d --rm --name eddb-website-test -p 127.0.0.1:18080:8080 eddb-website:latest
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:18080/          # 200
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:18080/de/       # 200
curl -sI http://127.0.0.1:18080/projets | grep -i location               # /#projects
podman stop eddb-website-test
```

## 3. Remplacer eddb-hub

Désactiver `eddb-hub` sans supprimer ni son unité ni son image, gardées
pour revenir en arrière :

```bash
systemctl --user stop eddb-hub
mkdir -p ~/disabled-containers-config
mv ~/.config/containers/systemd/eddb-hub.container ~/disabled-containers-config/
```

Installer l'unité du site et la démarrer :

```bash
cp ~/repos/eddb-website/eddb-website.container.example \
   ~/.config/containers/systemd/eddb-website.container
systemctl --user daemon-reload
systemctl --user start eddb-website
```

## 4. Vérifier

```bash
systemctl --user status eddb-website
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/           # 200
```

Puis, depuis un navigateur : https://eddb.unifr.ch/, `/de/`, `/en/`, une
modale (`/#nocodb`), `/projets` (redirigé), et une vitrine
(`/pressearchiv`, `/nafo`) et NocoDB (`/noco/`), qui ne doivent pas avoir
bougé.

## Revenir en arrière

Mis en ligne le 27.10.2026 ; `eddb-hub` a été retiré le même jour (unité
et images) : le retour vers l'ancienne page n'est plus possible. Pour une
version précédente du site, garder l'image en place avant de reconstruire
(`podman tag eddb-website:latest eddb-website:previous`), puis, en cas de
problème : `podman tag eddb-website:previous eddb-website:latest` et
`systemctl --user restart eddb-website`.
