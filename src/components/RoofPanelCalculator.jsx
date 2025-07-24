import { Paper, Title, NumberInput, Grid, Text, Group, Alert } from '@mantine/core';
import { IconHome, IconCheck, IconAlertTriangle } from '@tabler/icons-react';
import { useConsumption } from './ConsumptionContext';

const RoofPanelCalculator = () => {
  const {
    roofSquareMeters, setRoofSquareMeters,
    panelArea,
    numberOfPanels,
    totalPanelsArea,
    maxPanelsByRoof,
    canFitAllPanels
  } = useConsumption();

  return (
    <Grid.Col span={{ lg: 6, base: 12 }}>
      <Paper p="md" withBorder>
        <Title order={2} mb="md" c="blue.9">
          Cálculo de Paneles en el Techo
        </Title>
        <Group mb="md">
          <NumberInput
            label="Metros cuadrados del techo"
            placeholder="Ej: 40"
            leftSection={<IconHome size={18} />}
            value={roofSquareMeters}
            onChange={setRoofSquareMeters}
            min={0}
            step={0.1}
            allowDecimal
            hideControls
            style={{ maxWidth: 300 }}
          />
        </Group>
        <Grid>
          <Grid.Col span={6}>
            <Text size="md">
              <b>Área total ocupada por paneles:</b>
            </Text>
            <Text>
              {totalPanelsArea.toFixed(2)} m²
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="md">
              <b>Máximo de paneles en el techo:</b>
            </Text>
            <Text>
              {maxPanelsByRoof}
            </Text>
          </Grid.Col>
        </Grid>
        <Grid mt="md">
          <Grid.Col span={12}>
            {roofSquareMeters === 0 ? (
              <Alert color="gray" icon={<IconAlertTriangle size={18} />}>
                Ingresa los metros cuadrados del techo para ver la validación.
              </Alert>
            ) : canFitAllPanels ? (
              <Alert color="green" icon={<IconCheck size={18} />}>
                ¡Puedes instalar los {numberOfPanels} paneles necesarios para tu consumo!
              </Alert>
            ) : (
              <Alert color="red" icon={<IconAlertTriangle size={18} />}>
                Solo puedes instalar hasta {maxPanelsByRoof} paneles en tu techo. Para tu consumo se requieren {numberOfPanels} paneles.
              </Alert>
            )}
          </Grid.Col>
        </Grid>
      </Paper>
    </Grid.Col>
  );
};

export default RoofPanelCalculator; 