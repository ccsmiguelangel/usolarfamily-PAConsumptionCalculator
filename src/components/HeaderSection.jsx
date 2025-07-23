import { 
  Paper, 
} from '@mantine/core';
import logo from '../assets/Logotipo-2.png';

const HeaderSection = () => {
  return(
    <Paper pb="md" style={{ display: 'flex', justifyContent: 'center', background: 'transparent' }}>
      <img src={logo} alt="Logo de la empresa" style={{ height: '150px' }} />
    </Paper>
  )
}

export default HeaderSection;