import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export const useLoginController = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    try {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error('Ingresa un email válido.');
      }
      if (!password || password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }
      setLoading(true);

      await login(email, password);

      const redirectTo = location.state?.from?.pathname ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/solicitar-vacaciones', { replace: true });
  }, [isAuthenticated, navigate]);

  return { email, setEmail, password, setPassword, loading, error, onSubmit };
};
