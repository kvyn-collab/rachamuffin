# Ruta correcta según tu Caddyfile

## Tu configuración de Caddy:
- **Puerto:** 8080
- **Directorio raíz:** `/var/www/proyecto_imagenes`
- **PHP:** PHP 8.4 con PHP-FPM

## Solución:

### 1. Crea el archivo en la ruta CORRECTA:
```bash
sudo nano /var/www/proyecto_imagenes/pedidos.php
```

### 2. Pega todo el contenido de pedidos.php

### 3. Guarda: Ctrl+O, Enter, Ctrl+X

### 4. Configura permisos:
```bash
sudo chown -R www-data:www-data /var/www/proyecto_imagenes
```

### 5. Reinicia Caddy (si es necesario):
```bash
sudo systemctl restart caddy
```

### 6. Accede desde el navegador:
- `http://localhost:8080/pedidos.php`
- `http://IP-DE-TU-VM:8080/pedidos.php`

**IMPORTANTE:** Tu servidor está en el puerto **8080**, no en el puerto 80 estándar.





