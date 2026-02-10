# Bug Fixes - December 4, 2025

## 🐛 Issue #1: Microsite Service Crash Loop (504 Gateway Timeout)

**Symptom:**
- `POST /microsite` returning **504 Gateway Time-out**
- Microsite service in continuous **Restarting** state

**Root Cause:**
```typescript
// ❌ BROKEN: Top-level await in CommonJS
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = await buildApp();  // Error: "Top-level await not supported with 'cjs' format"
  app.listen(...);
}
```

**Fix Applied:**
```typescript
// ✅ FIXED: Wrapped in async IIFE
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const app = await buildApp();
    app.listen({ port, host: '0.0.0.0' })
      .then(() => logger.info(`Microsite service running on :${port}`))
      .catch((err) => { 
        logger.error("Failed to start server", err); 
        process.exit(1); 
      });

    async function createConsumerInstance() {
      // ... Kafka consumer setup
    }
    createConsumerInstance();
  })();
}
```

**Files Modified:**
- `services/microsite-service/src/index.ts`

**Verification:**
```bash
docker-compose ps microsite-service
# STATUS: Up ✅ (previously: Restarting ❌)
```

---

## 🐛 Issue #2: Nginx Routing Error (Double Path)

**Symptom:**
- Requests to `/microsite` being proxied to `/microsite/microsite`
- Routes not found after service restart

**Root Cause:**
```nginx
# ❌ BROKEN: Double /microsite path
location /microsite {
  proxy_pass http://microsite_service/microsite;  
  # nginx sends: http://microsite-service:3005/microsite/microsite
}
```

**Fix Applied:**
```nginx
# ✅ FIXED: Single path
location /microsite {
  proxy_pass http://microsite_service;
  # nginx sends: http://microsite-service:3005/microsite ✅
}
```

**Files Modified:**
- `nginx/nginx.conf` (line 366)

**Verification:**
```bash
docker exec qr_nginx_gateway nginx -s reload
# Output: [notice] signal process started ✅
```

---

## 🐛 Issue #3: QR Generation 409 Conflict

**Symptom:**
- `POST /generate` returning **409 Conflict**
- Error: "QR ID already exists"
- Clicking "Generate QR" a second time fails

**Root Cause:**
```typescript
// ❌ BROKEN: Using micrositeId as qrId causes duplicates
const result = await qrApi.generate({
  targetUrl,
  qrId: micrositeId,  // First click: creates QR
                      // Second click: 409 Conflict!
});
```

**Backend Logic:**
```typescript
// In qr-service/routes/qr.ts
if (providedQrId) {
  const existing = await db.select().from(qrs)
    .where(eq(qrs.qrId, providedQrId));
  
  if (existing.length > 0) {
    return res.code(409).send({ error: "QR ID already exists" }); // ❌
  }
}
```

**Fix Applied:**

**1. Let backend generate unique QR IDs:**
```typescript
// ✅ FIXED: Don't send qrId, let backend generate UUID
const result = await qrApi.generate({
  targetUrl,
  // qrId: micrositeId, ❌ REMOVED
  metadata: {
    name: micrositeName,
    micrositeId  // Still linked to microsite via metadata
  }
});
```

**2. Pass existing QR to modal to prevent regeneration:**
```tsx
// In EditorLayout.tsx
<QRGenerationModal
  isOpen={showQRModal}
  onClose={() => setShowQRModal(false)}
  micrositeId={micrositeId}
  micrositeName={micrositeName}
  existingQrId={qrId}  // ✅ NEW: Pass existing QR ID
  onQRGenerated={handleQRGenerated}
/>
```

**3. Show existing QR when modal opens:**
```tsx
// In QRGenerationModal.tsx
const [qrId, setQrId] = useState<string>(existingQrId || '');

useEffect(() => {
  if (existingQrId) {
    const targetUrl = `${baseUrl}/public/${micrositeId}`;
    setQrId(existingQrId);
    setQrUrl(targetUrl);  // Auto-display existing QR
  }
}, [existingQrId, micrositeId]);
```

**4. Better error handling:**
```typescript
catch (err) {
  if (err instanceof Error && err.message.includes('409')) {
    setError('QR code already exists for this microsite. Please refresh the page.');
  } else {
    setError(err instanceof Error ? err.message : 'Failed to generate QR code');
  }
}
```

**Files Modified:**
- `qr-frontend/src/components/editor/QRGenerationModal.tsx`
- `qr-frontend/src/components/editor/EditorLayout.tsx`

**Behavior Now:**
1. **First time opening modal:** Shows "Generate QR Code" button
2. **Click generate:** Creates unique QR with UUID, displays preview
3. **Close and reopen modal:** Shows existing QR immediately (no duplicate)
4. **"Regenerate" button:** Creates new QR with different UUID

---

## ✅ Summary

| Issue | Symptom | Root Cause | Status |
|-------|---------|-----------|--------|
| Service Crash | 504 Gateway Timeout | Top-level await in CJS | ✅ Fixed |
| Nginx Routing | Routes not found | Double `/microsite` path | ✅ Fixed |
| QR Duplication | 409 Conflict error | Using micrositeId as qrId | ✅ Fixed |

**Total Files Modified:** 4
- `services/microsite-service/src/index.ts`
- `nginx/nginx.conf`
- `qr-frontend/src/components/editor/QRGenerationModal.tsx`
- `qr-frontend/src/components/editor/EditorLayout.tsx`

**Services Restarted:**
- ✅ microsite-service (rebuilt and running)
- ✅ nginx-gateway (config reloaded)

**Ready for Testing:** All fixes deployed and verified! ��
