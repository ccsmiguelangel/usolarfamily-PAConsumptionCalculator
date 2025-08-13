# Sistema de Envío de Emails - Calculadora Solar

## Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor backend
```bash
npm run server
```
El servidor se ejecutará en `http://localhost:3001`

### 3. Iniciar la aplicación frontend
```bash
npm run dev
```
La aplicación se ejecutará en `http://localhost:5173`

## Funcionalidad

### Envío de Emails
- Cuando el usuario completa el formulario de información del cliente y hace clic en "Enviar Propuesta por Email"
- Se envía un email al correo especificado en el formulario con:
  - Datos del cliente
  - Análisis de consumo
  - Análisis financiero
  - Propuesta del sistema solar

### Configuración del Email
El servidor está configurado para usar:
- **Host:** mail.usolarfamily.com
- **Puerto:** 465 (SSL)
- **Usuario:** calculatorpty@usolarfamily.com
- **Contraseña:** c@^}96ahL}8cZBiZ

### Estructura del Email
El email incluye:
1. **Datos del Cliente:** Nombre, email, teléfono, dirección
2. **Análisis de Consumo:** Consumo promedio y total
3. **Análisis Financiero:** Gastos actuales vs ahorros proyectados
4. **Propuesta del Sistema:** Tamaño del sistema y cantidad de paneles

## Endpoints del API

### POST /api/send-email
Envía el email con la propuesta solar

**Body:**
```json
{
  "clientInfo": {
    "name": "string",
    "lastname": "string", 
    "email": "string",
    "phone": "string",
    "address": "string"
  },
  "averageConsumption": "number",
  "totalConsumption": "number",
  "totalNaturgyEnsa": "number",
  "totalNewProjection": "number",
  "systemSize": "number",
  "numberOfPanels": "number"
}
```

### GET /api/test
Endpoint de prueba para verificar que el servidor funciona

## Notas de Seguridad

⚠️ **Importante:** Las credenciales del email están hardcodeadas en el servidor. Para producción, se recomienda:
- Usar variables de entorno
- Implementar autenticación
- Usar HTTPS
- Configurar rate limiting

## Solución de Problemas

### Error de conexión
- Verificar que el servidor esté corriendo en el puerto 3001
- Verificar que las credenciales del email sean correctas
- Verificar la conectividad de red

### Error de autenticación SMTP
- Verificar que el usuario y contraseña sean correctos
- Verificar que el servidor SMTP permita conexiones desde la IP del servidor
- Verificar que el puerto 465 esté abierto
