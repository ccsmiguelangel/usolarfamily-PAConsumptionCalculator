import { useConsumption } from './ConsumptionContext';
import {
  Paper,
  Title,
  Grid,
  NumberFormatter,
  Select,
  Group,
  Text
} from '@mantine/core';
import { BarChart } from '@mantine/charts';

const NewProjectionChart = () => {
  const {
    loanRateFactor, setLoanRateFactor,
    loanMonthlyPayment,
    loanTotalPaid,
    loanProjectionData,
    systemTotalPriceAdjusted
  } = useConsumption();

  return (
    <Grid.Col span={{ lg: 6, base: 12 }}>
      <Paper p="md" withBorder>
        <Title order={2} mb="md" c="blue.9">
          Nueva Proyección (Crédito)
        </Title>
        <Group mb="md">
          <Select
            label="Tipo de crédito"
            value={loanRateFactor}
            onChange={setLoanRateFactor}
            data={[
              { value: '6.5', label: 'Crédito 6.5%' },
              { value: '10.5', label: 'Crédito 10.5%' },
            ]}
            style={{ minWidth: 250 }}
          />
        </Group>
        <Group>
          <Text size="md">
            <b>Precio total del sistema:</b>
          </Text>
          <Text>
            <NumberFormatter thousandSeparator prefix="$ " value={systemTotalPriceAdjusted.toFixed(2)} />
          </Text>
        </Group>
        <Group>
          <Text size="md">
            <b>Pago mensual estimado:</b>
          </Text>
          <Text>
            <NumberFormatter thousandSeparator prefix="$ " value={loanMonthlyPayment.toFixed(2)} />
          </Text>
        </Group>
        <Group>
          <Text size="md">
            <b>Total pagado en 12.5 años:</b>
          </Text>
          <Text>
            <NumberFormatter thousandSeparator prefix="$ " value={loanTotalPaid.toFixed(2)} />
          </Text>
        </Group>
        <div style={{ width: '100%', marginTop: '2rem' }}>
          <BarChart
            h={300}
            data={loanProjectionData}
            dataKey="month"
            orientation="vertical"
            barProps={{ radius: 6 }}
            series={[{
              name: 'payment',
              label: `Pago mensual a ${loanRateFactor}%`,
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
  );
};

export default NewProjectionChart;