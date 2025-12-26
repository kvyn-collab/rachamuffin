# Corregir la ruta del archivo

## El problema:
Tienes el archivo en `/var/wwww/proyecto_imagenes/` (4 "w") ❌
Pero Caddy busca en `/var/www/proyecto_imagenes/` (3 "w") ✅

## Solución:

### Opción 1: Copiar el archivo a la ruta correcta
```bash
sudo cp /var/wwww/proyecto_imagenes/pedidos.php /var/www/proyecto_imagenes/pedidos.php
```

### Opción 2: Mover el archivo (si quieres eliminarlo de la ruta incorrecta)
```bash
sudo mv /var/wwww/proyecto_imagenes/pedidos.php /var/www/proyecto_imagenes/pedidos.php
```

### Opción 3: Verificar qué hay en la ruta correcta primero
```bash
ls -la /var/www/proyecto_imagenes/
```

### Después de copiar/mover, configura permisos:
```bash
sudo chown www-data:www-data /var/www/proyecto_imagenes/pedidos.php
sudo chmod 644 /var/www/proyecto_imagenes/pedidos.php
```

### Verifica que ahora está en la ruta correcta:
```bash
head -5 /var/www/proyecto_imagenes/pedidos.php
```

### Accede desde el navegador:
```
http://localhost:8080/pedidos.php
```






