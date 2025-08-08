import { Stack, Text, PrimaryButton } from '@fluentui/react';

const Dashboard = () => {
  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 24 } }}>
      <Text variant="xxLarge">Dashboard Principal</Text>
      <Text variant="large">Bienvenido al sistema de gestión de vacaciones</Text>
      
      <Stack horizontal tokens={{ childrenGap: 16 }}>
        <PrimaryButton text="Nueva Solicitud" />
        <PrimaryButton text="Ver Historial" />
      </Stack>

      <Stack tokens={{ childrenGap: 12 }}>
        <Text variant="mediumPlus">Resumen de solicitudes</Text>
        <Text>• Solicitudes pendientes: 3</Text>
        <Text>• Solicitudes aprobadas: 12</Text>
        <Text>• Días disponibles: 15</Text>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
