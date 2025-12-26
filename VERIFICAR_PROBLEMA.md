# Verificar por qué aparece MariaDB

## El archivo pedidos.php está correcto ✅
Pero cuando accedes ves el mensaje de MariaDB. Esto significa que se está ejecutando OTRO archivo.

## Pasos para verificar:

### 1. Verifica la URL EXACTA que estás usando:
Debe ser exactamente:
```
http://localhost:8080/pedidos.php
```

### 2. Verifica qué archivos PHP hay en el directorio:
```bash
ls -la /var/www/proyecto_imagenes/*.php
```

### 3. Verifica si hay un index.php que se ejecuta primero:
```bash
cat /var/www/proyecto_imagenes/index.php
# o
cat /var/www/proyecto_imagenes/pe.php
```

### 4. Prueba acceder directamente al archivo:
Asegúrate de escribir la URL completa:
```
http://localhost:8080/pedidos.php
```

### 5. Si sigue apareciendo MariaDB, verifica el contenido real del archivo en la VM:
```bash
head -20 /var/www/proyecto_imagenes/pedidos.php
```

Debería mostrar exactamente:
```
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
```

### 6. Limpia la caché del navegador:
- Presiona Ctrl+Shift+R (o Ctrl+F5)
- O abre una ventana de incógnito

### 7. Verifica los logs de Caddy por si hay algún error:
```bash
sudo journalctl -u caddy -n 50
```





