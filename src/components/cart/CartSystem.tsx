import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FloatingCartButton } from './FloatingCartButton';
import { CartDrawer } from './CartDrawer';
import { usePayment } from '@/contexts/PaymentContext';

interface CartSystemProps {
  theme?: {
    primaryColor?: string;
    isDark?: boolean;
  };
  creatorId: string;
  micrositeId?: string;
}

/**
 * Complete cart system with floating button and drawer
 * Place this once at the microsite level
 */
export function CartSystem({ theme, creatorId, micrositeId }: CartSystemProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { initiateCheckout, cartCount } = usePayment();

  const handleCheckout = async () => {
    setIsDrawerOpen(false);
    await initiateCheckout({
      creatorId,
      micrositeId: micrositeId || creatorId,
      successUrl: `${window.location.origin}/payment/success`,
      cancelUrl: window.location.href,
    });
  };

  return (
    <>
      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <FloatingCartButton 
            onClick={() => setIsDrawerOpen(true)}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCheckout={handleCheckout}
        theme={theme}
      />
    </>
  );
}
