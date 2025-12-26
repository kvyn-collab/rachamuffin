# Cómo copiar pedidos.php a tu VM Debian

## Opción 1: SCP desde PowerShell (Más fácil)

1. Abre PowerShell en Windows
2. Navega a la carpeta donde está el archivo:
   ```powershell
   cd C:\Users\acebo\Documents\rachamuffin
   ```

3. Copia el archivo a tu VM (reemplaza USUARIO e IP):
   ```powershell
   scp pedidos.php USUARIO@IP-DE-TU-VM:/var/www/html/
   ```
   
   Ejemplo:
   ```powershell
   scp pedidos.php debian@192.168.1.100:/var/www/html/
   ```

4. Te pedirá la contraseña de tu usuario en la VM

---

## Opción 2: Crear el archivo directamente en la VM

1. Conéctate a tu VM por SSH:
   ```bash
   ssh USUARIO@IP-DE-TU-VM
   ```

2. Crea el archivo:
   ```bash
   sudo nano /var/www/html/pedidos.php
   ```

3. Copia TODO el contenido de `pedidos.php` desde Windows (Ctrl+A, Ctrl+C)

4. En la terminal de la VM, pega con: **Ctrl+Shift+V** (o botón derecho del mouse)

5. Guarda y sale:
   - Ctrl+O (guardar)
   - Enter (confirmar)
   - Ctrl+X (salir)

6. Configura los permisos:
   ```bash
   sudo chown www-data:www-data /var/www/html/pedidos.php
   sudo chmod 644 /var/www/html/pedidos.php
   ```

---

## Opción 3: Usar WinSCP o FileZilla (GUI)

1. Descarga WinSCP o FileZilla
2. Conéctate a tu VM con:
   - Protocolo: SFTP
   - Host: IP de tu VM
   - Usuario: tu usuario
   - Contraseña: tu contraseña
3. Arrastra `pedidos.php` desde Windows a `/var/www/html/` en la VM

---

## Después de copiar el archivo (SERVIDOR CADDY):

1. Verifica que PHP está instalado:
   ```bash
   php -v
   ```

2. Verifica que Caddy está corriendo:
   ```bash
   sudo systemctl status caddy
   ```

3. Si Caddy no está corriendo, inícialo:
   ```bash
   sudo systemctl start caddy
   sudo systemctl enable caddy  # Para iniciar automáticamente
   ```

4. **IMPORTANTE para Caddy**: Verifica tu Caddyfile para ver dónde está el root:
   ```bash
   sudo cat /etc/caddy/Caddyfile
   ```
   
   El archivo debe estar en el directorio que Caddy está sirviendo (comúnmente `/var/www/html` o `/srv/http`)

5. Si tu Caddyfile no tiene soporte para PHP, necesitas agregarlo. Ejemplo de Caddyfile:
   ```
   localhost {
       root * /var/www/html
       php_fastcgi unix//run/php/php-fpm.sock
       file_server
   }
   ```

6. Si usas PHP-FPM, reinicia Caddy:
   ```bash
   sudo systemctl restart caddy
   ```

7. Accede desde el navegador:
   - Desde la VM: `http://localhost/pedidos.php`
   - Desde otra máquina: `http://IP-DE-TU-VM/pedidos.php`

---

## Si tienes problemas:

### Verificar permisos:
```bash
ls -la /var/www/html/pedidos.php
```

### Ver errores de Caddy:
```bash
sudo journalctl -u caddy -f
# o
sudo tail -f /var/log/caddy/access.log
```

### Probar PHP directamente:
```bash
php /var/www/html/pedidos.php
```

