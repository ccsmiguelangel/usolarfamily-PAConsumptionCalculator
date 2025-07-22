import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import ConsumptionTable from './components/ConsumptionTable';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  components: {
    TextInput: {
      styles: (theme) => ({
        input: {
          backgroundColor: theme.colors.dark[6],
          borderColor: theme.colors.dark[4],
          color: theme.white,
          '&:focus': {
            borderColor: theme.colors.blue[6]
          }
        }
      })
    },
    Table: {
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colors.dark[7],
          borderColor: theme.colors.dark[4],
          '& thead tr th': {
            color: theme.colors.gray[3],
            fontWeight: 700
          }
        }
      })
    }
  }
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ConsumptionTable />
    </MantineProvider>
  );
}

export default App;