# Reglas de Negocio y Procesos Nivel Micro - BarAI

Este documento detalla la lógica operativa, flujos técnicos de datos, validaciones y eventos (WebSockets/API) que ocurren detrás de cada funcionalidad del sistema BarAI.

---

## 1. Acceso y Apertura de Sesión (Cliente)

**Flujo de Escaneo de QR:**
1. **Petición**: El cliente escanea el QR y accede por `GET /c/<company_slug>/order/<table_id>`.
2. **Validación (Backend)**: Flask busca la `company_id` mediante el slug. Verifica si la mesa existe en la tabla `tables`.
3. **Generación de Sesión**: 
   - Comprueba si existe un `client_token` en las cookies de sesión del navegador.
   - Si no existe, genera un UUID (v4) y lo guarda en `session['client_token']`.
4. **Base de Datos (`sessions`)**: Inserta o actualiza un registro en la tabla `sessions` con `(company_id, client_token, table_id, session_start)`.
5. **Evento Socket**: Se emite `refresh_tables` a la sala `company_<id>` para que el panel de los camareros vuelva a cargar el estado de las mesas (la mesa pasa visualmente de Libre a Ocupada).
6. **Renderizado**: Se devuelve el HTML `order.html` o `menu.html` con las comandas activas previas filtradas por ese `client_token`.

---

## 2. Creación de un Pedido

**Flujo de Enviar Comanda:**
1. **Petición**: El cliente añade productos al carrito y pulsa "Pedir". Se dispara un `POST /api/order`.
2. **Validación**: El servidor comprueba que el `client_token` de la cookie coincida con una sesión activa en la base de datos.
3. **Cálculo Financiero**: El backend itera sobre los productos, busca el precio real en la configuración del menú de la empresa (para evitar inyección de precios desde el cliente) y calcula el `total`.
4. **Base de Datos (`orders`)**: Inserta un nuevo registro con:
   - `type = 'PEDIDO'`
   - `status = 'recibido'`
   - `items` = string formateado ("2x Coca Cola\n1x Patatas")
   - Timestamp actual.
5. **Evento Socket**: Emite `new_order` con la estructura del pedido hacia la sala `company_<id>`.
6. **Recepción (Frontend Kitchen)**: `kitchen.html` recibe `new_order`, genera la tarjeta HTML, la inyecta en el DOM y reproduce el archivo de audio `notification.ogg`.

---

## 3. Llamar al Camarero

**Flujo de Alerta a Mesa:**
1. **Petición**: Cliente pulsa "Llamar camarero". Dispara `POST /api/order/alert`.
2. **Base de Datos (`orders`)**: Se crea un registro idéntico a un pedido pero con `type = 'CALL WAITER'`, `status = 'recibido'` y en el campo de texto de `items` inyecta `"¡Llamada a mesa!"`.
3. **Filtro de Rol (Cocinero)**: Se emite el evento `new_order`. En `kitchen.html`, hay una comprobación micro: `if (currentRole === 'cocinero' && order.type === 'CALL WAITER') return;`. El cocinero ignora físicamente este evento.

---

## 4. Transición de Estados del Pedido

El personal avanza el pedido pulsando botones en la tarjeta.
1. **Oído (Aceptación)**:
   - Camarero pulsa "Oído". Se emite `update_order_status` por Socket.IO.
   - **BD**: Actualiza `status = 'oido'`.
   - **Trigger Asíncrono**: Se lanza un hilo en background (`auto_transition_to_preparando`) que hace un `time.sleep` y automáticamente pasará el pedido a `preparando` para descargar trabajo cognitivo al personal.
2. **Completado (Entrega)**:
   - Emite `complete_order` por Socket.IO con el ID del empleado.
   - **BD**: Actualiza `status = 'completado'` y fija `completed_at = time.time()`.
   - **Notificación al Cliente**: Emite `order_completed` a la sala de la empresa. El dispositivo del cliente intercepta esto y lanza el modal preguntando *"¿Quieres tu ticket digital?"*. (Este modal se bloquea si el `type` era `CALL WAITER`).
   - Emite `refresh_tables` para que el panel de mesas actualice sus cálculos.

---

## 5. Cancelación de Pedidos y Validaciones de Seguridad

**Anulación por el Cliente (Micro):**
1. Evento `cancel_order_customer` emitido desde el cliente.
2. **Condición estricta**: `if order['status'] != 'recibido': return`. Solo se puede si nadie lo ha tocado.
3. **BD**: `UPDATE orders SET status = 'cancelado', cancel_reason = NULL`.
4. **Sincronización**: Emite `order_cancelled` (para borrar la tarjeta) y `refresh_tables` (para recalcular la mesa).

**Anulación por el Personal (Micro):**
1. Evento `cancel_order_staff`.
2. **Validación de Rol**: `if role not in ('camarero', 'cocinero', 'admin', 'gerente'): return`.
3. **Validación de PIN**: Si el estado es distinto a `recibido`, extrae el `cancel_pin` del JSON de ajustes de la empresa (`settings.json`). Si el PIN enviado desde la interfaz no coincide (comparación string a string), emite evento de error al socket origen (`request.sid`).
4. **BD**: Si el PIN es correcto, `UPDATE orders SET status = 'cancelado', cancel_reason = ?`.
5. **Sincronización**: Emite `order_cancelled` y `refresh_tables`.

---

## 6. Lógica de Cobro de Mesas (Checkout)

El proceso de facturación es el más crítico e involucra múltiples tablas.
1. **Acción**: El camarero pulsa "Cobrar Mesa". Emite `pay_table` con el `table_id`.
2. **Query de Activos**: El servidor hace un SELECT a `orders` filtrando `status != 'pagado' AND status != 'cancelado'`.
3. **Filtrado Exclusivo**: El servidor extrae de esa lista ÚNICAMENTE los pedidos con `status == 'completado'`. Cualquier otro pedido (`recibido`, `preparando`) es ignorado matemáticamente.
4. **Cálculo Financiero**: Suma los importes de los ítems completados parseando el string `X x Nombre` frente al diccionario de precios base.
5. **Registro de Cobro (`payments`)**:
   - `INSERT INTO payments (company_id, table_id, total_amount, waiter_id, timestamp)`. Devuelve un `payment_id` autoincremental.
6. **Actualización de Pedidos (`orders`)**:
   - Para los completados: `UPDATE orders SET status = 'pagado', payment_id = ?`.
   - Para los "huérfanos" (ítems no completados en el momento de cobro): `UPDATE orders SET status = 'cancelado'`. **(Regla: No se puede facturar lo no servido).**
7. **Limpieza de Sesión (`sessions`)**:
   - `DELETE FROM sessions WHERE table_id = ?`. La mesa vuelve al estado Libre.
8. **Disparador de Tickets**: Llama a `process_pending_digital_tickets(...)` pasando el nuevo `payment_id`.
9. **Sincronización**: Emite `refresh_tables`.

---

## 7. Tickets Digitales y Cola de Envío

Para no interrumpir la experiencia, el envío de emails es asíncrono y condicionado.
1. **Ingesta (`POST /api/ticket/email`)**:
   - Si la mesa tiene un estado global "Pagado", el PDF se compila mediante `reportlab` y se envía usando un hilo de SMTP (`threading.Thread`).
   - Si la mesa sigue en curso, la petición se encola: `INSERT INTO customer_emails (table_id, email, sent=0)`.
2. **Procesado Diferido (Disparado por el Cobro)**:
   - Al generarse el cobro (`pay_table`), la función busca correos en cola: `SELECT * FROM customer_emails WHERE sent = 0`.
   - Busca los pedidos exactos asociados a ese `payment_id`.
   - Renderiza un único PDF consolidado y lo envía por correo electrónico mediante hilos.
   - Marca el registro: `UPDATE customer_emails SET sent = 1`.

---

## 8. Tarea de Fondo: Monitor de Inactividad (Idle Task)

1. **Demonio**: En `app.py`, una función `background_table_monitor` se ejecuta cada 30 segundos usando `socketio.start_background_task`.
2. **Cálculo (Micro)**:
   - Hace un SELECT de todas las `sessions`.
   - Si el tiempo de vida de la sesión (`time.time() - session_start`) supera el umbral (ej. 10 minutos):
   - Comprueba si esa sesión tiene al menos 1 registro en `orders` (`COUNT(id) > 0`).
   - Si es 0 (el cliente escaneó el QR, miró la carta, pero no pidió nada), el sistema inyecta un evento fantasma: `new_order` de tipo `CALL WAITER` con el mensaje `Atender Mesa X (Lleva 10m sin pedir)`.
   - Actualiza el `session_start` a un tiempo futuro para evitar spam de alertas cada 30 segundos.

---

## 9. Arquitectura Multi-Empresa y Aislamiento de Datos

A nivel de base de datos, **toda la información** contiene una Foreign Key lógica `company_id`.
- En cada endpoint de API y cada evento Socket, se extrae el `company_id` desde el objeto `session` o desde los argumentos HTTP.
- Toda query lleva inyectado `WHERE company_id = ?`. 
- Todas las emisiones de Socket.IO (WebSockets) se envían a "Rooms" específicas usando el formato `room=company_<id>`. Esto garantiza que un local no escuche los pedidos ni vea las alertas de inactividad de otro local, a pesar de compartir el mismo demonio y puerto físico de Python.
