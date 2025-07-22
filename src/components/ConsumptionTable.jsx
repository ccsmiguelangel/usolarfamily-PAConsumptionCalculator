import { useState, useEffect, useMemo } from 'react';
import { 
  Table, 
  NumberInput,
  Select, 
  Paper, 
  Title, 
  Container, 
  Grid,
  Group,
  Text,
  NumberFormatter ,
  useMantineTheme,
} from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { IconBolt, IconChartLine } from '@tabler/icons-react';
import logo from '../assets/Logotipo-2.png'; // Importar el logo

const ConsumptionTable = () => {
  const theme = useMantineTheme();
  const [consumptions, setConsumptions] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      month: `Mes ${i + 1}`,
      consumption: '',
      price: '',
      cost: 0
    }))
  );

  const [selectedRate, setSelectedRate] = useState('4');
  const [averageCost, setAverageCost] = useState(0);
  const [initialPrice, setInitialPrice] = useState(0);
  const [growthRate, setGrowthRate] = useState('2.99');
  const [panelWatts, setPanelWatts] = useState(0); // Estado para Panel Watts

  // Calcular promedios
  const averageConsumption = useMemo(() => {
    const validEntries = consumptions.filter(c => !isNaN(c.consumption) && c.consumption !== '');
    return validEntries.length > 0
      ? validEntries.reduce((acc, curr) => acc + curr.consumption, 0) / validEntries.length
      : 0;
  }, [consumptions]);

  const averagePrice = useMemo(() => {
    const validEntries = consumptions.filter(c => !isNaN(c.price) && c.price !== '');
    return validEntries.length > 0
      ? validEntries.reduce((acc, curr) => acc + curr.price, 0) / validEntries.length
      : 0;
  }, [consumptions]);

    // Rellenar consumos faltantes con el promedio
    const filledConsumptions = useMemo(() => {
      const validEntries = consumptions.filter(c => !isNaN(c.consumption) && c.consumption !== '');
      const average = validEntries.length > 0
        ? validEntries.reduce((acc, curr) => acc + curr.consumption, 0) / validEntries.length
        : 0;
  
      // Rellenar los consumos faltantes con el promedio
      return consumptions.map(c => ({
        ...c,
        consumption: !isNaN(c.consumption) && c.consumption !== '' ? c.consumption : average,
      }));
    }, [consumptions]);
  
    // Calcular totalConsumption basado en filledConsumptions
    const totalConsumption = useMemo(() => {
      return filledConsumptions.reduce((acc, curr) => acc + curr.consumption, 0);
    }, [filledConsumptions]);
  
  const totalMonthlyCost = useMemo(() => {
    const validEntries = consumptions.filter(c => !isNaN(c.cost) && c.cost !== 0);
    return validEntries.reduce((acc, curr) => acc + curr.cost, 0);
  }, [consumptions]);

  const projectionData = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      year: `Año ${i + 1}`,
      value: initialPrice * 12 * Math.pow(1 + (Number(growthRate) / 100), i),
    }));
  }, [initialPrice, growthRate]);

  // Actualizar promedio de costos
  useEffect(() => {
    const validEntries = consumptions.filter(c => c.cost > 0);
    
    if (validEntries.length === 0) {
      setAverageCost(0);
      return;
    }
  
    const total = validEntries.reduce((acc, curr) => acc + curr.cost, 0);
    const avg = total / validEntries.length;
    
    // Forzar actualización si es NaN
    setAverageCost(isNaN(avg) ? 0 : avg);
  }, [consumptions]);


  // Calcular promedio de costos mensuales
  const averageMonthlyCost = useMemo(() => {
    const validEntries = consumptions.filter(c => c.cost > 0);
    return validEntries.length > 0 
      ? validEntries.reduce((acc, curr) => acc + curr.cost, 0) / validEntries.length
      : 0;
  }, [consumptions]);

  // Datos para el gráfico
  const chartData = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      year: `Año ${i + 1}`,
      value: averageMonthlyCost * 12 * Math.pow(1 + (selectedRate / 100), i)
    }));
  }, [averageMonthlyCost, selectedRate]);

  const totalNaturgyEnsa = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);
  
  const totalNewProjection = useMemo(() => {
    return projectionData.reduce((acc, curr) => acc + curr.value, 0);
  }, [projectionData]);



  // Calcular el tamaño del sistema
  const systemSize = useMemo(() => {
    if (!filledConsumptions ) return 0; // Si faltan meses, no calcular
    return totalConsumption / 1250;
  }, [totalConsumption, filledConsumptions ]);

  // Calcular la cantidad de paneles
  const numberOfPanels = useMemo(() => {
    if (!panelWatts || panelWatts === 0 || !filledConsumptions ) return 0; // Si no hay Panel Watts o faltan meses, no calcular
    return Math.ceil((systemSize * 1000) / panelWatts);
  }, [systemSize, panelWatts, filledConsumptions ]);

  // Manejar cambios en los inputs
  const handleInputChange = (id, field, value) => {
    // Reemplazar comas por puntos y convertir a número decimal
    const numericValue = parseFloat(value) || 0;
  
    const newData = consumptions.map(item => {
      if (item.id !== id) return item;
  
      const newItem = {
        ...item,
        [field]: numericValue
      };
  
      // Calcular costo mensual solo si ambos valores son numéricos
      if (!isNaN(newItem.consumption) && !isNaN(newItem.price)) {
        newItem.cost = newItem.consumption * newItem.price;
      } else {
        newItem.cost = 0;
      }
  
      return newItem;
    });
  
    setConsumptions(newData);
  };

  return (
    <Container size="xl" p="md">
      {/* Header con el logo */}
      <Paper pb="md" style={{ display: 'flex', justifyContent: 'center', background: 'transparent' }}>
        <img src={logo} alt="Logo de la empresa" style={{ height: '150px' }} />
      </Paper>
      <Grid gutter="xl">
        <Grid.Col span={12}>
          <Paper p="md"b withBorder>
            <Grid justify="space-between" align="center">
              <Grid.Col span="auto">
                <Title order={1} c="blue.9" display={{lg: 'block', base: 'none'}}>
                  <IconBolt size={28} style={{ marginRight: 10 }} />
                  Calculadora Energética
                </Title>
                <Title order={2} c="blue.9" display={{lg: 'none', base: 'block'}}>
                  <IconBolt size={14} style={{ marginRight: 10 }} />
                  Calculadora Energética
                </Title>
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Escenario de inflación"
                  value={selectedRate}
                  onChange={setSelectedRate}
                  data={[
                    { value: '4', label: 'Inflación PA 4%' }
                  ]}
                  defaultValue={[{ value: '4', label: 'Inflación PA 4%' }]}
                  leftSection={<IconChartLine size={18} />}
                />
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>

        <Grid.Col span={12}>
          <Paper p="md" withBorder>
            <Table.ScrollContainer type="native" minWidth={500} >
            <Table striped highlightOnHover withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Mes</Table.Th>
                  <Table.Th>Consumo</Table.Th>
                  <Table.Th>Precio</Table.Th>
                  <Table.Th>Costo Mensual</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {consumptions.map((row) => (
                  <Table.Tr key={row.id}>
                    <Table.Td>{row.month}</Table.Td>
                    <Table.Td>
                      <NumberInput
                        value={row.consumption}
                        onChange={(e) => handleInputChange(row.id, 'consumption', Number(e))}
                        rightSection="kWh"
                        hideControls 
                        placeholder="Ingrese consumo"
                        allowDecimal={false}
                      />
                    </Table.Td>
                    <Table.Td>
                      { /* Error en e.target.value */ }
                      <NumberInput
                        value={row.price}
                        onChange={(e) => handleInputChange(row.id, 'price', Number(e))}
                        placeholder="Ingrese precio"
                        allowDecimal={true}
                        leftSection="$"
                        hideControls 
                        type="number"
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberFormatter thousandSeparator prefix="$ " value={row.cost.toFixed(2)}/>
                    </Table.Td>
                  </Table.Tr>
                ))}
                 {/* Fila de promedios */}
                  <Table.Tr style={{ fontWeight: 'bold' }}>
                    <Table.Td>PROMEDIO</Table.Td>
                    <Table.Td><NumberFormatter thousandSeparator suffix=" kWh" value={averageConsumption.toFixed(2)}/></Table.Td>
                    <Table.Td><NumberFormatter thousandSeparator prefix="$ " value={averagePrice.toFixed(2)}/></Table.Td>
                    <Table.Td><NumberFormatter thousandSeparator prefix="$ " value={averageMonthlyCost.toFixed(2)} /></Table.Td>
                  </Table.Tr>
                   {/* Fila de totales */}
                  <Table.Tr style={{ fontWeight: 'bold' }}>
                    <Table.Td>TOTAL</Table.Td>
                    <Table.Td><NumberFormatter thousandSeparator suffix=" kWh" value={totalConsumption.toFixed(2)} /></Table.Td>
                    <Table.Td>-</Table.Td> {/* No se suma el precio */}
                    <Table.Td><NumberFormatter thousandSeparator prefix="$ " value={totalMonthlyCost.toFixed(2)} /></Table.Td>
                  </Table.Tr>
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{lg: 6, base: 12}}>
          <Paper p="md" withBorder>
            <Title order={2} mb="md" c="blue.9">
              Proyección a 25 años con Naturgy | Ensa
            </Title>
            <BarChart
              h={400}
              data={chartData}
              dataKey="year"
              orientation="vertical"
              barProps={{ radius: 10 }}
              series={[{ 
                name: 'value', 
                label: `Proyección a ${selectedRate}% anual`,
              }]}
              valueFormatter={(value) => `$${value.toFixed(2)}`}
              gridAxis="none"
              tooltipAnimationDuration={300}
              tooltipProps={{
                content: ({ label, payload }) => (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    padding: '4px 8px',
                    background: 'var(--mantine-color-white)',
                    borderRadius: 'var(--mantine-radius-default)'
                  }}>
                    <div style={{ 
                      fontWeight: 600, 
                      marginBottom: '4px',
                      background: 'var(--mantine-color-white)',
                      fontWeigth: 'bold'
                    }}>
                      {label}
                    </div>
                    {payload?.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: item.color,
                          borderRadius: '2px'
                        }} />
                        <span style={{ fontWeight: 500 }}>
                        <NumberFormatter thousandSeparator prefix="$ " value={item.value.toFixed(2)} />
                        </span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ lg: 6, base: 12 }}>
          <Paper p="md" withBorder>
            <Title order={2} mb="md" c="blue.9">
              Nueva Proyección
            </Title>
            <Group>
              {/* NumberInput para el precio inicial */}
              <NumberInput
                label="Precio inicial"
                placeholder="Ingrese el precio inicial"
                leftSection="$"
                allowDecimal
                hideControls
                value={initialPrice}
                onChange={(value) => setInitialPrice(value)}
                mb="md"
              />

              {/* Select para la tasa de crecimiento */}
              <Select
                label="Tasa de crecimiento anual"
                placeholder="Seleccione una tasa"
                value={growthRate}
                onChange={(value) => setGrowthRate(value)}
                data={[
                  { value: '0', label: '0% (Fijo)' },
                  { value: '2.99', label: '2.99%' },
                ]}
                leftSection={<IconChartLine size={18} />}
                mb="md"
              />
            </Group>
            <div style={{ width: '100%', marginTop: '2rem' }}>
              <BarChart
                h={400}
                data={projectionData}
                dataKey="year"
                orientation="vertical"
                barProps={{ radius: 10 }}
                series={[{ 
                  name: 'value', 
                  label: `Proyección a ${growthRate}% anual`,
                }]}
                valueFormatter={(value) => `$${value.toFixed(2)}`}
                gridAxis="none"
                tooltipAnimationDuration={300}
                tooltipProps={{
                  content: ({ label, payload }) => (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      padding: '4px 8px',
                      background: 'var(--mantine-color-white)',
                      borderRadius: 'var(--mantine-radius-default)'
                    }}>
                      <div style={{ 
                        fontWeight: 600, 
                        marginBottom: '4px',
                        fontWeigth: 'bold'
                      }}>
                        {label}
                      </div>
                      {payload?.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: 'var(--mantine-color-white)',
                          gap: '8px'
                        }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: item.color,
                            borderRadius: '2px'
                          }} />
                          <span style={{ fontWeight: 500 }}>
                          <NumberFormatter thousandSeparator prefix="$ " value={item.value.toFixed(2)} />
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
            </div>
          </Paper>
        </Grid.Col>
        {/* Resumen de pagos */}
        {(totalNaturgyEnsa > 0 || totalNewProjection > 0) && (
          <Grid.Col span={{ lg: 6, base: 12 }}>

          <Paper p="md" withBorder>
            <Title order={2} mb="md" c="blue.9">Resumen de Pagos en 25 años</Title>
            <Table.ScrollContainer type="native" minWidth={500} >
              <Table striped highlightOnHover withColumnBorders>
                <Table.Thead>                
                  <Table.Tr>
                    <Table.Td>
                      Total Gastado en Naturgy | Ensa
                    </Table.Td>
                    <Table.Td>
                    Total Ahorrado en Nueva Proyección
                    </Table.Td>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>
                      <Text size="xl" c="red.4">
                        <NumberFormatter thousandSeparator prefix="$ " value={totalNaturgyEnsa.toFixed(2)} />
                      </Text>
                    </Table.Td>
                    <Table.Td>
                    <Text size="xl" c="green.4">
                      <NumberFormatter thousandSeparator prefix="$ " value={totalNewProjection.toFixed(2)} />
                    </Text>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Paper>
          </Grid.Col>
        )}
        <Grid.Col span={{ lg: 6, base: 12 }}>
          <Paper p="md" withBorder>
              <Title order={2} mb="md" c="blue.9">
                Cálculo de Paneles Solares
              </Title>
              <NumberInput
                label="Ingrese los Watts por Panel (200W - 1000W)"
                placeholder="Watts por Panel"
                value={panelWatts}
                onChange={(value) => setPanelWatts(value)}
                min={200}
                max={1000}
                step={50}
                allowDecimal={false}
                hideControls
                rightSection="W"
                my="md"
              />
            {(!panelWatts || (panelWatts === 0) || !filledConsumptions ) ? ( 
            <Text c="red" size="xl">
              Añade valor de mes faltante y los watts por panel.
            </Text>
            ) : (
            <Table.ScrollContainer type="native" minWidth={500} >
              <Table striped highlightOnHover withColumnBorders>
                <Table.Thead>                
                  <Table.Tr>
                    <Table.Td>
                      Tamaño del sistema
                    </Table.Td>
                    <Table.Td>
                      Cantidad de paneles necesarios
                    </Table.Td>
                  </Table.Tr>                
                </Table.Thead>
                <Table.Tbody>                
                  <Table.Tr>
                    <Table.Td>
                      <Text size="lg" c="blue.4">
                        <NumberFormatter thousandSeparator suffix=" kWh" value={systemSize.toFixed(2)} />
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xl" c="green.4">
                        <NumberFormatter thousandSeparator value={numberOfPanels} />
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ConsumptionTable;