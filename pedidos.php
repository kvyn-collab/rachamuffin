<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Pedidos</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #b8c5d1;
            padding: 20px;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #e8eef5;
            padding: 30px;
            border-radius: 8px;
        }

        h1, h2 {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }

        .form-section {
            margin-bottom: 25px;
        }

        .form-section label {
            display: block;
            margin-bottom: 10px;
            font-weight: bold;
            color: #333;
        }

        .form-section select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
            background-color: white;
        }

        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .checkbox-item input[type="checkbox"] {
            width: 18px;
            height: 18px;
        }

        .radio-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .radio-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .radio-item input[type="radio"] {
            width: 18px;
            height: 18px;
        }

        .money-input-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .money-input-group input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
        }

        .money-input-group button {
            padding: 10px 12px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background-color: #e0e0e0;
            cursor: pointer;
            font-size: 16px;
            min-width: 40px;
        }

        .calculate-btn {
            width: 100%;
            padding: 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            margin-bottom: 30px;
        }

        .calculate-btn:hover {
            background-color: #45a049;
        }

        .order-summary {
            margin-top: 30px;
            padding: 20px;
            background-color: #f0f0f0;
            border-radius: 5px;
        }

        .order-summary h2 {
            margin-bottom: 15px;
            color: #333;
        }

        .summary-item {
            margin-bottom: 10px;
            font-size: 16px;
        }

        .summary-item strong {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Realiza tu Pedido</h2>
        
        <?php
        // Definir precios de platos
        $precios_platos = [
            'hamburguesa' => 10.00,
            'pizza' => 12.00,
            'ensalada' => 8.00
        ];

        // Definir precios de bebidas
        $precios_bebidas = [
            'agua' => 1.00,
            'refresco' => 2.00,
            'jugo' => 3.00
        ];

        // Nombres de platos para mostrar
        $nombres_platos = [
            'hamburguesa' => 'hamburguesa',
            'pizza' => 'pizza',
            'ensalada' => 'ensalada'
        ];

        // Variables para el resumen
        $mostrar_resumen = false;
        $plato_seleccionado = '';
        $total_pagar = 0;
        $dinero_recibido = 0;
        $cambio = 0;

        // Procesar el formulario cuando se envía
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $plato = $_POST['plato'] ?? '';
            $bebidas = $_POST['bebidas'] ?? [];
            $propina = floatval($_POST['propina'] ?? 0);
            $dinero = floatval($_POST['dinero'] ?? 0);

            if (!empty($plato) && isset($precios_platos[$plato])) {
                $mostrar_resumen = true;
                $plato_seleccionado = $nombres_platos[$plato];
                
                // Calcular subtotal del plato
                $subtotal = $precios_platos[$plato];
                
                // Sumar bebidas seleccionadas
                foreach ($bebidas as $bebida) {
                    if (isset($precios_bebidas[$bebida])) {
                        $subtotal += $precios_bebidas[$bebida];
                    }
                }
                
                // Calcular propina
                $monto_propina = $subtotal * $propina;
                
                // Calcular total
                $total_pagar = $subtotal + $monto_propina;
                $dinero_recibido = $dinero;
                $cambio = $dinero_recibido - $total_pagar;
            }
        }
        ?>

        <form method="post" action="">
            <!-- Platos principales (select) -->
            <div class="form-section">
                <label for="plato">Plato Principal:</label>
                <select id="plato" name="plato" required>
                    <option value="">Elige un plato --</option>
                    <option value="hamburguesa" <?php echo (isset($_POST['plato']) && $_POST['plato'] == 'hamburguesa') ? 'selected' : ''; ?>>Hamburguesa - $10</option>
                    <option value="pizza" <?php echo (isset($_POST['plato']) && $_POST['plato'] == 'pizza') ? 'selected' : ''; ?>>Pizza - $12</option>
                    <option value="ensalada" <?php echo (isset($_POST['plato']) && $_POST['plato'] == 'ensalada') ? 'selected' : ''; ?>>Ensalada - $8</option>
                </select>
            </div>

            <!-- Bebidas (checkbox) -->
            <div class="form-section">
                <label>Bebidas (puedes elegir varias):</label>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="agua" name="bebidas[]" value="agua" <?php echo (isset($_POST['bebidas']) && in_array('agua', $_POST['bebidas'])) ? 'checked' : ''; ?>>
                        <label for="agua">Agua - $1</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="refresco" name="bebidas[]" value="refresco" <?php echo (isset($_POST['bebidas']) && in_array('refresco', $_POST['bebidas'])) ? 'checked' : ''; ?>>
                        <label for="refresco">Refresco - $2</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="jugo" name="bebidas[]" value="jugo" <?php echo (isset($_POST['bebidas']) && in_array('jugo', $_POST['bebidas'])) ? 'checked' : ''; ?>>
                        <label for="jugo">Jugo - $3</label>
                    </div>
                </div>
            </div>

            <!-- Propina (radio) -->
            <div class="form-section">
                <label>¿Agregar propina?</label>
                <div class="radio-group">
                    <div class="radio-item">
                        <input type="radio" id="no-propina" name="propina" value="0" <?php echo (!isset($_POST['propina']) || $_POST['propina'] == '0') ? 'checked' : ''; ?>>
                        <label for="no-propina">No</label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" id="propina-5" name="propina" value="0.05" <?php echo (isset($_POST['propina']) && $_POST['propina'] == '0.05') ? 'checked' : ''; ?>>
                        <label for="propina-5">5%</label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" id="propina-10" name="propina" value="0.1" <?php echo (isset($_POST['propina']) && $_POST['propina'] == '0.1') ? 'checked' : ''; ?>>
                        <label for="propina-10">10%</label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" id="propina-15" name="propina" value="0.15" <?php echo (isset($_POST['propina']) && $_POST['propina'] == '0.15') ? 'checked' : ''; ?>>
                        <label for="propina-15">15%</label>
                    </div>
                </div>
            </div>

            <!-- Dinero entregado -->
            <div class="form-section">
                <label for="dinero">Dinero entregado:</label>
                <div class="money-input-group">
                    <input type="number" id="dinero" name="dinero" step="0.01" min="0" value="<?php echo isset($_POST['dinero']) ? htmlspecialchars($_POST['dinero']) : ''; ?>" required>
                    <button type="button" onclick="document.getElementById('dinero').value = ''" title="Limpiar">□</button>
                </div>
            </div>

            <input type="submit" class="calculate-btn" value="Calcular Total y Cambio">
        </form>

        <?php if ($mostrar_resumen): ?>
        <div class="order-summary">
            <h2>Resumen del Pedido:</h2>
            <div class="summary-item">
                <strong>Plato:</strong> <?php echo htmlspecialchars($plato_seleccionado); ?>
            </div>
            <div class="summary-item">
                <strong>Total a pagar:</strong> $<?php echo number_format($total_pagar, 2); ?>
            </div>
            <div class="summary-item">
                <strong>Dinero recibido:</strong> $<?php echo number_format($dinero_recibido, 2); ?>
            </div>
            <div class="summary-item">
                <strong>Cambio:</strong> $<?php echo number_format($cambio, 2); ?>
            </div>
        </div>
        <?php endif; ?>
    </div>
</body>
</html>







