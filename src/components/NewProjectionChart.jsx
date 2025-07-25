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
import { AreaChart } from '@mantine/charts';
import PaymentSummary from './PaymentSummary';
const NewProjectionChart = () => {
  const {
    loanRateFactor, setLoanRateFactor,
    loanMonthlyPayment,
    loanTotalPaid,
    comparisonProjectionData,
    systemTotalPriceAdjusted
  } = useConsumption();

  return (
    <Grid.Col span={{ lg: 6, base: 12 }}>
      <Paper p="md" withBorder>
        <Title order={2} mb="md" c="blue.9">
          Comparación a 25 Años
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
        {/* <Group>
          <Text size="md">
            <b>Total pagado en 12.5 años:</b>
          </Text>
          <Text>
            <NumberFormatter thousandSeparator prefix="$ " value={loanTotalPaid.toFixed(2)} />
          </Text>
        </Group> */}
        <div style={{ width: '100%', marginTop: '2rem' }}>
          <AreaChart
            h={400}
            data={comparisonProjectionData}
            dataKey="year"
            type="linear"
            curveType="linear"
            connectNulls
            series={[
              {
                name: 'naturgy',
                label: 'Naturgy | Ensa',
                color: 'red.6',
                strokeWidth: 1
              },
              {
                name: 'newProjection',
                label: `Nueva Proyección (${loanRateFactor}%)`,
                color: 'blue.6',
                strokeWidth: 1
              }
            ]}
            valueFormatter={(value) => `$${value.toFixed(2)}`}
            gridAxis="x"
            tooltipAnimationDuration={300}
            yAxisProps={{
              tickFormatter: (value) => `$${value.toFixed(0)}`
            }}
            xAxisProps={{
              tickFormatter: (value) => `Año ${value}`
            }}
            tooltipProps={{
              content: ({ label, payload }) => {
                // Filtrar payload para evitar duplicados
                const uniquePayload = payload?.filter((item, index, self) => 
                  index === self.findIndex(p => p.name === item.name)
                );
                
                return (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '8px 12px',
                    background: 'var(--mantine-color-white)',
                    borderRadius: 'var(--mantine-radius-default)',
                    border: '1px solid var(--mantine-color-gray-3)',
                    boxShadow: 'var(--mantine-shadow-md)'
                  }}>
                    <div style={{
                      fontWeight: 600,
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}>
                      Año {label}
                    </div>
                    {uniquePayload?.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ 
                          fontWeight: 500,
                          color: item.color,
                          fontSize: '13px'
                        }}>
                          {item.name === 'naturgy' ? 'Naturgy | Ensa' : `Nueva Proyección (${loanRateFactor}%)`}:
                        </span>
                        <span style={{ fontWeight: 600 }}>
                          <NumberFormatter thousandSeparator prefix="$ " value={item.value.toFixed(2)} />
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
            }}
          />
        </div>
        <PaymentSummary />
      </Paper>
    </Grid.Col>
  );
};

export default NewProjectionChart;