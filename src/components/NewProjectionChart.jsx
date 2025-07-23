import { useConsumption } from './ConsumptionContext';
import { 
  NumberInput,
  Select, 
  Paper, 
  Title, 
  Grid,
  Group,
  NumberFormatter ,
} from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { IconChartLine } from '@tabler/icons-react';

const NewProjectionChart = () => {
  const {
    initialPrice, setInitialPrice,
    growthRate, setGrowthRate,
    projectionData
  } = useConsumption();

  return(
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
  )
}

export default NewProjectionChart;