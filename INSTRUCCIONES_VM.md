# Instrucciones para configurar en VM Debian

## 1. Copiar el archivo a la VM

### Opción A: Desde Windows con SCP
```powershell
scp index.php usuario@IP-VM:/var/www/html/
```

### Opción B: Crear el archivo directamente en la VM
```bash
# Conectarse a la VM
ssh usuario@IP-VM

# Crear el archivo
sudo nano /var/www/html/index.php
# Pegar el contenido completo del index.php
```

## 2. Configurar permisos
```bash
sudo chown www-data:www-data /var/www/html/index.php
sudo chmod 644 /var/www/html/index.php
```

## 3. Verificar que PHP está instalado
```bash
php -v
```

## 4. Iniciar/Asegurar que el servidor web está corriendo

### Si usas Apache:
```bash
sudo systemctl status apache2
sudo systemctl start apache2  # Si no está corriendo
sudo systemctl enable apache2  # Para iniciar automáticamente
```

### Si usas Nginx:
```bash
sudo systemctl status nginx
sudo systemctl start nginx  # Si no está corriendo
sudo systemctl enable nginx  # Para iniciar automáticamente
```

### Si usas el servidor PHP integrado (para pruebas):
```bash
cd /var/www/html
php -S localhost:8000
# Luego accede a: http://localhost:8000
```

## 5. Acceder a la aplicación

- Desde la VM: `http://localhost/index.php` o `http://localhost/`
- Desde otra máquina: `http://IP-DE-TU-VM/index.php`

## 6. Si tienes problemas

### Verificar que PHP está habilitado en Apache:
```bash
sudo a2enmod php
sudo systemctl restart apache2
```

### Ver logs de errores:
```bash
# Apache
sudo tail -f /var/log/apache2/error.log

# Nginx
sudo tail -f /var/log/nginx/error.log
```







