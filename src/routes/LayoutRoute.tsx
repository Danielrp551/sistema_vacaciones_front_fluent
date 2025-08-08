import Layout from '../components/Layout/Layout';

interface LayoutRouteProps {
  children: React.ReactNode;
}

const LayoutRoute = ({ children }: LayoutRouteProps) => {
  return <Layout>{children}</Layout>;
};

export default LayoutRoute;
