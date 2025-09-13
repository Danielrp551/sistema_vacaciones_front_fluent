import {
  Stack,
  Image,
  ImageFit,
  TextField,
  PrimaryButton,
  MessageBar,
  MessageBarType,
} from '@fluentui/react';
import { useLoginController } from './Login.controller';
import { styles } from './Login.styles';

const BACKGROUND_URL = '/image_fondo_login.webp'; 

const Login = () => {
  const { email, setEmail, password, setPassword, loading, error, onSubmit } = useLoginController();

  return (
    <Stack styles={styles.root} horizontal>
      {/* Panel izquierdo: imagen */}
      <Stack grow styles={styles.leftPane}>
        <Image
          src={BACKGROUND_URL}
          alt="Login background"
          width="100%"
          height="100%"
          imageFit={ImageFit.cover}
        />
      </Stack>

      {/* Panel derecho: formulario */}
      <Stack grow styles={styles.rightPane}>
        <form onSubmit={onSubmit} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Stack styles={styles.form} tokens={{ childrenGap: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <img 
                src="/marsh-icon.png" 
                alt="Marsh McLennan" 
                style={{ width: 42, height: 42, objectFit: 'contain' }}
              />
              <span style={{ fontSize: 36, fontWeight: 700 }}>Marsh McLennan</span>
            </div>

            {error && (
              <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>
            )}

            <TextField
              label="Email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(_, v) => setEmail(v ?? '')}
            />

            <TextField
              label="Contraseña"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(_, v) => setPassword(v ?? '')}
            />

            <PrimaryButton type="submit" text="Login" disabled={loading} />
            
            {/* Footer discreto */}
            <div style={{ 
              marginTop: '24px', 
              textAlign: 'center', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px',
              opacity: 0.7,
              fontSize: '12px',
              color: '#666'
            }}>
              <span>Desarrollado por</span>
              <img 
                src="/logo-vacapp.jpeg" 
                alt="VacApp" 
                style={{ width: 16, height: 16, objectFit: 'contain', borderRadius: '2px' }}
              />
              <span style={{ fontWeight: 500 }}>VacApp</span>
            </div>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};

export default Login;
