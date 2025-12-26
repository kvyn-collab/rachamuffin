# Solución al error "No such file or directory"

## El problema:
El directorio `/var/www/html/` probablemente no existe en tu sistema con Caddy.

## Solución paso a paso:

### 1. Verifica si el directorio existe:
```bash
ls -la /var/www/html/
```

### 2. Si el directorio NO existe, créalo:
```bash
sudo mkdir -p /var/www/html
```

### 3. Verifica dónde está sirviendo Caddy:
```bash
sudo cat /etc/caddy/Caddyfile
```

Busca la línea que dice `root *` - esa es la ruta que Caddy está usando.

### 4. Opciones:

#### Opción A: Usar el directorio que Caddy ya está usando
Si tu Caddyfile tiene algo como:
```
root * /srv/http
```
Entonces crea el archivo ahí:
```bash
sudo nano /srv/http/pedidos.php
```

#### Opción B: Crear /var/www/html y actualizar Caddyfile
```bash
# Crear el directorio
sudo mkdir -p /var/www/html

# Crear el archivo ahí
sudo nano /var/www/html/pedidos.php

# Actualizar Caddyfile para usar ese directorio
sudo nano /etc/caddy/Caddyfile
```

Y asegúrate de que tenga:
```
root * /var/www/html
```

### 5. Después de crear el archivo, configura permisos:
```bash
sudo chown -R www-data:www-data /var/www/html
# o si usas otro usuario:
sudo chown -R $USER:$USER /var/www/html
```

### 6. Reinicia Caddy:
```bash
sudo systemctl restart caddy
```





