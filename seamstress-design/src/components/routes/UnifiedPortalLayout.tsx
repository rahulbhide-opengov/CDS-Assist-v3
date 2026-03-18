import { Outlet } from 'react-router-dom';
import { CityProvider } from '../../pages/public-portal/unified-portal/components/CityContext';
import { CartProvider } from '../../pages/public-portal/unified-portal/components/cart/CartContext';
import PageTransition from '../PageTransition';

export const UnifiedPortalLayout = () => (
  <CityProvider>
    <CartProvider>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </CartProvider>
  </CityProvider>
);
