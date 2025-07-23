import { useConsumption } from './ConsumptionContext';
import {
  Paper,
  Title,
  Grid,
  NumberFormatter,
} from '@mantine/core';
import { BarChart } from '@mantine/charts';



const NaturgyProjectionChart = () => {
  const { chartData, selectedRate } = useConsumption();

  return (
    <>
      <Grid.Col span={{ lg: 6, base: 12 }}>
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
    </>
  )
}

export default NaturgyProjectionChart;