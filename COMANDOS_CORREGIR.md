# Comandos para corregir el error

## El problema:
Estás usando `/var/wwww/html/` (4 "w") - la ruta correcta es `/var/www/html/` (3 "w")

## Solución:

### 1. Sal de nano (si aún estás dentro):
Presiona `Ctrl+X`

### 2. Crea el directorio correcto (si no existe):
```bash
sudo mkdir -p /var/www/html
```

### 3. Verifica dónde está sirviendo Caddy realmente:
```bash
sudo cat /etc/caddy/Caddyfile
```

Busca la línea que dice `root *` - esa es la ruta que Caddy está usando.

### 4. Crea el archivo en la ruta CORRECTA:

**Si Caddy usa `/var/www/html`:**
```bash
sudo nano /var/www/html/pedidos.php
```
(¡Nota: 3 "w", no 4!)

**Si Caddy usa otra ruta (ej: `/srv/http`):**
```bash
sudo nano /srv/http/pedidos.php
```

### 5. Pega el contenido completo del archivo pedidos.php

### 6. Guarda: Ctrl+O, Enter, Ctrl+X

### 7. Configura permisos:
```bash
sudo chown -R www-data:www-data /var/www/html
# o
sudo chown -R $USER:$USER /var/www/html
```

### 8. Reinicia Caddy:
```bash
sudo systemctl restart caddy
```





