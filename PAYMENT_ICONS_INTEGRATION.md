# Payment Icons Integration Guide

## Overview
Real branded payment icons have been integrated throughout the platform to provide instant recognition and trust for users during checkout and payment flows.

## Available Payment Icons

### Primary Payment Methods
- **StripeIcon** - Official Stripe logo (Color: `#635BFF`)
- **PayPalIcon** - Official PayPal logo (Color: `#00457C`)
- **VenmoIcon** - Official Venmo logo (Color: `#008CFF`)
- **ApplePayIcon** - Apple Pay wordmark (NEW)
- **GooglePayIcon** - Google Pay logo (NEW)

### E-commerce Platforms
- **ShopifyIcon** - Shopify logo (Color: `#96BF48`)

## Current Implementation

### 1. Payment Context (PaymentContext.tsx)
✅ **Checkout Modal Header**
```tsx
<StripeIcon className="w-10 h-4" style={{ color: BrandColors.stripe }} />
<span className="text-xs">Secure payment</span>
```

✅ **Trust Indicators**
- Shield icon with "256-bit SSL"
- Lock icon with "PCI Compliant"
- Real Stripe branding

### 2. Cart Drawer (CartDrawer.tsx)
✅ Shows Stripe icon in checkout button
✅ Trust badge display

### 3. Payment Block (PaymentBlock.tsx)
✅ Supports multiple payment provider icons
✅ Visual provider selection

## Usage Examples

### Basic Icon Usage
```tsx
import { StripeIcon, PayPalIcon, ApplePayIcon, BrandColors } from '@/components/icons/BrandIcons';

// Stripe with official color
<StripeIcon className="w-12 h-5" style={{ color: BrandColors.stripe }} />

// PayPal with official color
<PayPalIcon className="w-12 h-5" style={{ color: BrandColors.paypal }} />

// Apple Pay
<ApplePayIcon className="w-12 h-5" />
```

### Payment Method Selector
```tsx
const paymentMethods = [
  { id: 'stripe', name: 'Credit Card', icon: StripeIcon, color: BrandColors.stripe },
  { id: 'paypal', name: 'PayPal', icon: PayPalIcon, color: BrandColors.paypal },
  { id: 'applepay', name: 'Apple Pay', icon: ApplePayIcon, color: '#000000' },
  { id: 'googlepay', name: 'Google Pay', icon: GooglePayIcon, color: '#4285F4' },
];

{paymentMethods.map(method => (
  <button key={method.id} className="flex items-center gap-2">
    <method.icon className="w-8 h-4" style={{ color: method.color }} />
    <span>{method.name}</span>
  </button>
))}
```

### Trust Badge Row
```tsx
<div className="flex items-center gap-4">
  <StripeIcon className="w-12 h-5" style={{ color: BrandColors.stripe }} />
  <span className="text-gray-400">•</span>
  <div className="flex items-center gap-1.5">
    <Shield className="w-4 h-4 text-green-500" />
    <span className="text-sm">Secure</span>
  </div>
  <span className="text-gray-400">•</span>
  <div className="flex items-center gap-1.5">
    <Lock className="w-4 h-4 text-green-500" />
    <span className="text-sm">Encrypted</span>
  </div>
</div>
```

## Brand Colors Reference

```typescript
export const BrandColors = {
  // Payments & Commerce
  stripe: '#635BFF',
  paypal: '#00457C',
  venmo: '#008CFF',
  shopify: '#96BF48',
  
  // Can also be used for consistency
  applePay: '#000000',
  googlePay: '#4285F4',
} as const;
```

## Design Guidelines

### 1. Size Recommendations
- **Mobile checkout header**: `w-10 h-4` or `w-12 h-5`
- **Desktop modal header**: `w-12 h-5` or `w-14 h-6`
- **Payment method buttons**: `w-8 h-4`
- **Footer/trust badges**: `w-10 h-4`

### 2. Color Usage
- Always use official brand colors from `BrandColors`
- For dark mode, use the same colors (they're designed to work on both)
- SVG fill is `currentColor`, so you can control via `style={{ color: ... }}`

### 3. Accessibility
- Include payment method name as text alongside icon
- Use proper ARIA labels: `aria-label="Pay with Stripe"`
- Ensure sufficient contrast for trust indicators

### 4. Trust & Security
Icons should be paired with security indicators:
- SSL/TLS badges
- PCI compliance
- "Secure" or "Protected" text
- Lock/Shield icons

## Blocks with Payment Integration

### ✅ Already Integrated
1. **ArtistBlock** - Payment via PaymentContext
2. **PaymentContext** - Stripe branding in checkout modal
3. **CartDrawer** - Stripe icon in footer

### 🚧 To Be Integrated
1. **MenuBlock** - Food ordering (add Stripe/payment icons)
2. **DealsBlock** - Deal purchases (show payment methods)
3. **ProductBlock** - Product sales (multiple payment options)
4. **ShopBlock** - E-commerce cart (payment method selector)
5. **PricingBlock** - Subscription plans (recurring payment icons)
6. **EventsBlock** - Event tickets (secure checkout badges)
7. **ScheduleBlock** - Appointment booking (pre-auth indicators)

## Best Practices

### Mobile Optimization
```tsx
// Mobile: Compact icon in header
<div className="flex items-center gap-1.5">
  <StripeIcon className="w-10 h-4" style={{ color: BrandColors.stripe }} />
  <span className="text-xs text-gray-500">Secure</span>
</div>
```

### Desktop Enhancement
```tsx
// Desktop: Larger icon with full branding
<div className="hidden md:flex items-center gap-3">
  <StripeIcon className="w-14 h-6" style={{ color: BrandColors.stripe }} />
  <div className="flex items-center gap-2 text-sm">
    <Shield className="w-4 h-4 text-green-500" />
    <span>256-bit encrypted payment</span>
  </div>
</div>
```

### Loading States
```tsx
{isLoading ? (
  <Loader2 className="w-4 h-4 animate-spin" />
) : (
  <StripeIcon className="w-10 h-4" style={{ color: BrandColors.stripe }} />
)}
```

## Future Enhancements

### Planned Icons
- [ ] American Express icon
- [ ] Mastercard icon
- [ ] Visa icon
- [ ] Discover icon
- [ ] Shop Pay icon
- [ ] Afterpay icon
- [ ] Klarna icon

### Planned Features
- [ ] Payment method selection UI component
- [ ] Animated payment success checkmarks
- [ ] Real-time payment status indicators
- [ ] Regional payment method auto-detection
- [ ] Payment method preference saving

## Testing Checklist

- [ ] Icons display correctly on light backgrounds
- [ ] Icons display correctly on dark backgrounds
- [ ] SVG paths render properly across browsers
- [ ] Brand colors match official guidelines
- [ ] Icons scale properly at different sizes
- [ ] Trust badges are visible and clear
- [ ] Mobile touch targets are adequate (min 44x44px)
- [ ] Icons load without CORS issues
- [ ] Accessibility: Screen readers announce payment methods
- [ ] RTL language support (if needed)

## Documentation Links

- [Stripe Brand Assets](https://stripe.com/en-ca/newsroom/brand-assets)
- [PayPal Brand Guide](https://www.paypal.com/us/webapps/mpp/logo-center)
- [Apple Pay Guidelines](https://developer.apple.com/apple-pay/marketing/)
- [Google Pay Branding](https://developers.google.com/pay/api/web/guides/brand-guidelines)

## Support

For questions or issues with payment icons:
1. Check `BrandIcons.tsx` for available icons
2. Verify brand colors in `BrandColors` constant
3. Test icon rendering in isolation
4. Ensure proper imports from `@/components/icons/BrandIcons`
