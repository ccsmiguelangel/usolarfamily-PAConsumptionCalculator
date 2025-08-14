import { useConsumption } from './ConsumptionContext';
import {
  Table,
  Text,
  NumberFormatter,
} from '@mantine/core';

const PaymentSummary = () => {
  const { 
    totalNaturgyEnsa, 
    totalNewProjection,
    totalNaturgyEnsaWithBattery,
    totalNewProjectionWithBattery,
    wantsBattery,
    systemTotalPrice,
    systemTotalPriceAdjusted,
    batteryPrice
  } = useConsumption();

  // Determinar qué totales usar basado en si la batería está activa
  const totalNaturgyEnsaToShow = wantsBattery ? totalNaturgyEnsaWithBattery : totalNaturgyEnsa;
  const totalNewProjectionToShow = wantsBattery ? totalNewProjectionWithBattery : totalNewProjection;
  
  // Determinar qué precio total usar para el cálculo del ahorro
  // Usar el precio sin impuestos (igual que arriba)
  const totalSystemPrice = wantsBattery ? 
    (systemTotalPriceAdjusted + batteryPrice) : 
    (systemTotalPriceAdjusted || systemTotalPrice);

  // Calcular el ahorro (siempre en positivo)
  const savings = Math.abs(totalNaturgyEnsaToShow - totalSystemPrice);

  // Determinar si mostrar la fila de Naturgy/Ensa
  const shouldShowNaturgyRow = totalNaturgyEnsaToShow > 0;

  // Determinar el texto del ahorro
  const getSavingsText = () => {
    if (totalNaturgyEnsaToShow > 0) {
      return "Total Ahorrado en Nueva Proyección";
    } else {
      return "Total Invertido en Proyección";
    }
  };

  return (
    <>
      <Table.ScrollContainer type="native" minWidth={500} mt="xl" >
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              {shouldShowNaturgyRow && (
                <Table.Td>
                  Total Gastado en Naturgy | Ensa
                </Table.Td>
              )}
              <Table.Td>
                {getSavingsText()}
              </Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              {shouldShowNaturgyRow && (
                <Table.Td>
                  <Text size="xl" c="red.4">
                    <NumberFormatter thousandSeparator prefix="$ " value={totalNaturgyEnsaToShow.toFixed(2)} />
                  </Text>
                </Table.Td>
              )}
              <Table.Td>
                <Text size="xl" c="green.4">
                  <NumberFormatter thousandSeparator prefix="$ " value={savings.toFixed(2)} />
                </Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  )
}

export default PaymentSummary;