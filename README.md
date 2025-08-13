# Calculadora Solar de Energía - Panamá

Una aplicación web moderna para calcular la viabilidad de instalación de paneles solares residenciales en Panamá, con proyecciones financieras a 25 años y comparaciones de costos.

## 🚀 Características

- **Cálculo de Consumo Mensual**: Ingreso y gestión de consumo eléctrico por mes
- **Proyecciones Financieras**: Análisis de costos a 25 años con tasas de inflación
- **Calculadora de Paneles Solares**: Dimensionamiento del sistema solar según consumo
- **Análisis de Techo**: Cálculo del espacio disponible para instalación
- **Comparación de Costos**: Proyección Naturgy/Ensa vs. Sistema Solar
- **Resumen de Pagos**: Cálculo de cuotas mensuales y financiamiento
- **Formulario de Cliente**: Captura de información del cliente para propuestas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + Vite
- **UI Framework**: Mantine v7
- **Gráficos**: Chart.js, Recharts
- **Estilos**: CSS Modules, PostCSS
- **Backend**: Express.js (servidor de correo)
- **Email**: Nodemailer

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes de la interfaz
│   ├── ConsumptionTable.jsx      # Tabla principal de consumo
│   ├── SolarPanelCalculator.jsx  # Calculadora de paneles
│   ├── RoofPanelCalculator.jsx   # Calculadora de espacio en techo
│   ├── PaymentSummary.jsx        # Resumen de pagos
│   ├── ClientInfoForm.jsx        # Formulario de cliente
│   └── ...                       # Otros componentes
├── hooks/               # Hooks personalizados
│   ├── useConsumptionData.js     # Gestión de datos de consumo
│   ├── useCostCalculations.js    # Cálculos de costos
│   ├── useSolarPanelCalculations.js # Cálculos de paneles
│   ├── useSystemPricing.js       # Precios del sistema
│   └── ...                       # Otros hooks
└── assets/              # Recursos estáticos
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd 2025PASolarCalculator

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar servidor de correo
npm run server
```

## 📊 Funcionalidades Principales

### 1. Gestión de Consumo
- Ingreso de consumo mensual (kWh)
- Cálculo automático de promedios
- Rellenado rápido de meses faltantes

### 2. Cálculos Solares
- Dimensionamiento del sistema según consumo
- Cálculo de número de paneles necesarios
- Estimación de producción anual
- Análisis de cobertura del sistema

### 3. Análisis Financiero
- Proyección de costos a 25 años
- Comparación con tarifas actuales
- Cálculo de ahorros potenciales
- Opciones de financiamiento

### 4. Generación de Propuestas
- Formulario de información del cliente
- Envío de propuestas por correo
- Cálculos personalizados

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
```

### Configuración del Servidor de Correo
El servidor Express está configurado para enviar propuestas por correo usando Nodemailer.

## 📈 Uso de la Aplicación

1. **Ingresar Consumo**: Completar la tabla de consumo mensual
2. **Configurar Parámetros**: Ajustar tasas de inflación y crecimiento
3. **Revisar Cálculos**: Ver proyecciones y comparaciones
4. **Generar Propuesta**: Completar formulario del cliente
5. **Enviar Propuesta**: Generar y enviar propuesta por correo

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para consultas sobre el proyecto o soporte técnico, contactar al equipo de desarrollo.

---

**Desarrollado para United Solar Family Panamá** 🌞
