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
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 36, fontWeight: 700 }}>Integrity</span>
              <span style={{ color: '#FFEB3B', fontSize: 36, fontWeight: 700 }}>+</span>
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
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};

export default Login;
