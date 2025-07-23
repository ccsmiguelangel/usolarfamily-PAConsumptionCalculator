import { useState } from 'react';
import { useConsumption } from './ConsumptionContext';
import {
  Paper,
  Title,
  TextInput,
  Grid,
  Button,
  Table,
  Text,
  Center
} from '@mantine/core';
import { IconUser, IconMail, IconPhone, IconHome } from '@tabler/icons-react';
import { NumberFormatter } from '@mantine/core';

const ClientInfoForm = () => {
  const {
    clientInfo, setClientInfo,
    averageConsumption,
    totalConsumption,
    totalNaturgyEnsa,
    totalNewProjection,
    systemSize,
    numberOfPanels
  } = useConsumption();
  const [form, setForm] = useState({
    name: clientInfo.name || '',
    lastname: clientInfo.lastname || '',
    email: clientInfo.email || '',
    phone: clientInfo.phone || '',
    address: clientInfo.address || ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientInfo(form);
    setSubmitted(true);
  };

  return (
    <Grid.Col span={{ base: 12 }}>
      <Paper p="md" withBorder>
        <Title order={2} mb="md" c="blue.9">
          Datos del Cliente
        </Title>
        {submitted ? (
          <>
            <Center my="md">
              <Text size="xl" c="green.7" fw={700}>
                ¡Gracias por enviar sus datos!
              </Text>
            </Center>
            <Table striped highlightOnHover withColumnBorders mt="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Campo</Table.Th>
                  <Table.Th>Valor</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Nombre</Table.Td>
                  <Table.Td>{clientInfo.name}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Apellido</Table.Td>
                  <Table.Td>{clientInfo.lastname}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Email</Table.Td>
                  <Table.Td>{clientInfo.email}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Teléfono</Table.Td>
                  <Table.Td>{clientInfo.phone}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Dirección</Table.Td>
                  <Table.Td>{clientInfo.address}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Consumo Promedio</Table.Td>
                  <Table.Td>
                    <NumberFormatter value={averageConsumption} thousandSeparator suffix=" kWh" decimals={2} />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Consumo Total</Table.Td>
                  <Table.Td>
                    <NumberFormatter value={totalConsumption.toFixed(2)} thousandSeparator suffix=" kWh" />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Total Gastado en Naturgy | Ensa</Table.Td>
                  <Table.Td>
                    <NumberFormatter value={totalNaturgyEnsa.toFixed(2)} thousandSeparator prefix="$ " />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Total Ahorrado en Nueva Proyección</Table.Td>
                  <Table.Td>
                    <NumberFormatter value={totalNewProjection.toFixed(2)} thousandSeparator prefix="$ " />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Tamaño del sistema</Table.Td>
                  <Table.Td>
                    <NumberFormatter value={systemSize} thousandSeparator suffix=" kWh" decimals={2} />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cantidad de paneles necesarios</Table.Td>
                  <Table.Td>
                    <NumberFormatter value={numberOfPanels} thousandSeparator decimals={0} />
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <TextInput
                  label="Nombre"
                  placeholder="Ingrese su Nombre"
                  leftSection={<IconUser size={18} />}
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Apellido"
                  placeholder="Ingrese su Apellido"
                  leftSection={<IconUser size={18} />}
                  value={form.lastname}
                  onChange={(e) => handleChange('lastname', e.target.value)}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Email"
                  placeholder="Ingrese su email"
                  leftSection={<IconMail size={18} />}
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  type="email"
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Teléfono"
                  placeholder="Ingrese su teléfono"
                  leftSection={<IconPhone size={18} />}
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  type="tel"
                  required
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Dirección"
                  placeholder="Ingrese su dirección"
                  leftSection={<IconHome size={18} />}
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                />
              </Grid.Col>
              <Grid.Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" color="blue" size='lg'>
                  Imprimir Propuesta
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        )}
      </Paper>
    </Grid.Col>
  );
};

export default ClientInfoForm;