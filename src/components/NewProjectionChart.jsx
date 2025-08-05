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
    comparisonProjectionData,
    systemTotalPriceAdjusted,
    totalNewProjectionSelectedPeriod,
    selectedPeriod, setSelectedPeriod,
  } = useConsumption();

  // Función para obtener el texto del período
  const getPeriodText = (months) => {
    if (months === 12) return '12 Meses (1 Año)';
    if (months === 24) return '24 Meses (2 Años)';
    if (months === 72) return '72 Meses (6 Años)';
    if (months === 96) return '96 Meses (8 Años)';
    if (months === 120) return '120 Meses (10 Años)';
    if (months === 150) return '150 Meses (12.5 Años)';
    return `${months} Meses`;
  };

  return (
    <Grid.Col span={{ lg: 6, base: 12 }}>
      <Paper p="md" withBorder>
        <Title order={2} mb="md" c="blue.9">
          Comparación a {getPeriodText(selectedPeriod)}
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
          <Select
            label="Período de tiempo"
            value={selectedPeriod.toString()}
            onChange={(value) => setSelectedPeriod(parseInt(value))}
            data={[
              { value: '150', label: '150 Meses (12.5 Años)' },
              { value: '120', label: '120 Meses (10 Años)' },
              { value: '96', label: '96 Meses (8 Años)' },
              { value: '72', label: '72 Meses (6 Años)' },
              { value: '24', label: '24 Meses (2 Años)' },
              { value: '12', label: '12 Meses (1 Año)' },
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

        <div style={{ width: '100%', marginTop: '2rem' }}>
          <AreaChart
            h={400}
            data={comparisonProjectionData}
            dataKey="month"
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
              tickFormatter: (value) => `Mes ${value}`
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
                      Mes {label}
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