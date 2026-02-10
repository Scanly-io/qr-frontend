# Real-Time Collaboration Implementation Plan

## 🎯 Goal
Enable multiple users to edit the same microsite simultaneously with live cursor tracking, presence indicators, and conflict-free editing.

---

## 🏗️ Architecture Overview

### Current State: ❌ **No Real-Time Infrastructure**
- No WebSocket server
- No presence system
- No conflict resolution
- Placeholder "Invite Team" button exists in UI

### What We Need to Build:

```
┌─────────────────┐         WebSocket          ┌─────────────────┐
│   User A        │ ←─────────────────────────→ │  Collaboration  │
│   (Browser)     │                             │     Server      │
└─────────────────┘                             │  (Socket.io)    │
                                                 └─────────────────┘
┌─────────────────┐         WebSocket                    ↕
│   User B        │ ←─────────────────────────→    CRDT Engine
│   (Browser)     │                             │   (Y.js/Redis)  │
└─────────────────┘                             └─────────────────┘
```

---

## 🧩 Required Components

### 1. **WebSocket Server** (Backend)

**Options:**
- **Socket.io** - Most popular, battle-tested
- **Partykit** - Simpler, serverless option
- **Ably/Pusher** - Managed service (no server needed)

**Recommended: Socket.io**

```typescript
// services/collaboration-service/src/index.ts
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Room = Microsite ID
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join microsite editing room
  socket.on('join-microsite', ({ micrositeId, userId }) => {
    socket.join(`microsite:${micrositeId}`);
    
    // Broadcast user joined
    io.to(`microsite:${micrositeId}`).emit('user-joined', {
      userId,
      socketId: socket.id,
      timestamp: Date.now()
    });
  });

  // Broadcast block changes
  socket.on('block-update', ({ micrositeId, blockId, changes }) => {
    socket.to(`microsite:${micrositeId}`).emit('block-updated', {
      blockId,
      changes,
      userId: socket.data.userId
    });
  });

  // Broadcast cursor position
  socket.on('cursor-move', ({ micrositeId, x, y }) => {
    socket.to(`microsite:${micrositeId}`).emit('cursor-moved', {
      userId: socket.data.userId,
      x,
      y,
      socketId: socket.id
    });
  });

  // User disconnected
  socket.on('disconnect', () => {
    // Broadcast to all rooms
    socket.rooms.forEach(room => {
      if (room.startsWith('microsite:')) {
        io.to(room).emit('user-left', {
          userId: socket.data.userId,
          socketId: socket.id
        });
      }
    });
  });
});

httpServer.listen(3005, () => {
  console.log('Collaboration server running on port 3005');
});
```

---

### 2. **CRDT for Conflict-Free Editing**

**Problem:** Two users edit the same block simultaneously → Who wins?

**Solution:** Use **Y.js** (Conflict-free Replicated Data Type)

```typescript
// Y.js automatically merges changes without conflicts
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// Create shared document
const ydoc = new Y.Doc();

// Connect to collaboration server
const provider = new WebsocketProvider(
  'ws://localhost:3005', 
  `microsite:${micrositeId}`, 
  ydoc
);

// Shared blocks array (auto-synced)
const yBlocks = ydoc.getArray('blocks');

// When local user edits
yBlocks.push([{
  id: 'block-1',
  type: 'headline',
  content: 'Hello World'
}]);

// Changes automatically propagate to all users
yBlocks.observe((event) => {
  console.log('Blocks updated by another user:', event.changes);
  updateCanvas(yBlocks.toJSON());
});
```

**Why Y.js?**
- ✅ True real-time sync (like Google Docs)
- ✅ Works offline (stores locally, syncs when reconnected)
- ✅ No merge conflicts
- ✅ Undo/Redo across users
- ✅ Production-ready (used by Figma, Notion, etc.)

---

### 3. **Presence System** (Who's Online)

**Frontend:**

```typescript
// src/hooks/usePresence.ts
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  cursor?: { x: number; y: number };
}

export function usePresence(micrositeId: string) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Join room
    socket.emit('join-microsite', { 
      micrositeId, 
      userId: currentUser.id 
    });

    // Listen for users joining
    socket.on('user-joined', (user: User) => {
      setUsers(prev => [...prev, user]);
    });

    // Listen for users leaving
    socket.on('user-left', ({ userId }) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
    });

    // Listen for cursor moves
    socket.on('cursor-moved', ({ userId, x, y }) => {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, cursor: { x, y } } : u
      ));
    });

    return () => {
      socket.emit('leave-microsite', { micrositeId });
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('cursor-moved');
    };
  }, [micrositeId]);

  return { users };
}
```

**UI Component:**

```tsx
// src/components/editor/PresenceAvatars.tsx
export function PresenceAvatars({ users }: { users: User[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">
        {users.length} {users.length === 1 ? 'person' : 'people'} editing
      </span>
      <div className="flex -space-x-2">
        {users.map(user => (
          <div
            key={user.id}
            className="relative w-8 h-8 rounded-full border-2 border-white bg-violet-500 flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="rounded-full" />
            ) : (
              user.name[0].toUpperCase()
            )}
            {/* Active indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 4. **Live Cursor Tracking**

```tsx
// src/components/editor/RemoteCursors.tsx
export function RemoteCursors({ users }: { users: User[] }) {
  return (
    <>
      {users.map(user => (
        user.cursor && (
          <motion.div
            key={user.id}
            className="absolute pointer-events-none z-50"
            style={{
              left: user.cursor.x,
              top: user.cursor.y,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {/* Cursor SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: user.color }}
            >
              <path
                d="M5.65376 12.3673L11.6538 3.16731C12.1384 2.39991 13.3022 2.39991 13.7868 3.16731L19.7868 12.3673C20.2714 13.1347 19.7263 14.1673 18.8539 14.1673H12.854"
                fill="currentColor"
              />
            </svg>

            {/* User name label */}
            <div
              className="absolute left-6 top-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap font-medium shadow-lg"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </motion.div>
        )
      ))}
    </>
  );
}
```

**Track local cursor:**

```typescript
// In Canvas.tsx
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    // Throttle to avoid spam
    throttle(() => {
      socket.emit('cursor-move', {
        micrositeId,
        x: e.clientX,
        y: e.clientY
      });
    }, 50);
  };

  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, [micrositeId]);
```

---

### 5. **Conflict Resolution UI**

**Show who's editing what:**

```tsx
// src/components/editor/BlockEditIndicator.tsx
export function BlockEditIndicator({ 
  blockId, 
  editingUsers 
}: { 
  blockId: string; 
  editingUsers: User[] 
}) {
  if (editingUsers.length === 0) return null;

  return (
    <div className="absolute -top-8 left-0 bg-amber-100 border border-amber-300 rounded-md px-2 py-1 text-xs text-amber-900 flex items-center gap-2">
      <svg className="w-3 h-3 animate-pulse" /* warning icon */ />
      <span>
        {editingUsers.map(u => u.name).join(', ')} editing this block
      </span>
    </div>
  );
}
```

---

## 📦 Required Technologies

### Backend:
```bash
# New microservice: collaboration-service
cd services
mkdir collaboration-service
cd collaboration-service
npm init -y

# Install dependencies
npm install socket.io express cors yjs y-websocket redis
npm install -D @types/node typescript ts-node
```

### Frontend:
```bash
cd qr-frontend

# Install Socket.io client
npm install socket.io-client

# Install Y.js for CRDT
npm install yjs y-websocket

# Optional: React bindings for Y.js
npm install @syncedstore/core @syncedstore/react
```

---

## 🚀 Implementation Phases

### **Phase 1: Basic WebSocket** (Week 1)
- [ ] Create collaboration-service
- [ ] Set up Socket.io server
- [ ] Implement join/leave room logic
- [ ] Add presence system (who's online)
- [ ] Display presence avatars in UI

### **Phase 2: Live Cursor Tracking** (Week 2)
- [ ] Broadcast cursor positions
- [ ] Render remote cursors with user colors
- [ ] Add user name labels to cursors
- [ ] Throttle cursor updates (performance)

### **Phase 3: Block Editing Sync** (Week 3)
- [ ] Integrate Y.js CRDT
- [ ] Sync block create/update/delete
- [ ] Handle concurrent edits
- [ ] Add "User X is editing" indicators
- [ ] Test conflict resolution

### **Phase 4: Advanced Features** (Week 4)
- [ ] Permissions (owner, editor, viewer)
- [ ] Real-time comments/annotations
- [ ] Activity history ("User X added headline")
- [ ] Offline support (local-first)
- [ ] Version history / snapshots

### **Phase 5: Polish** (Week 5)
- [ ] Handle network disconnections gracefully
- [ ] Optimize bandwidth (delta updates only)
- [ ] Add loading states
- [ ] Accessibility (announce user joins/leaves)
- [ ] Rate limiting & security

---

## ⚠️ Challenges & Solutions

### Challenge 1: **Bandwidth**
- **Problem:** 10 users = 10x cursor updates/second
- **Solution:** Throttle updates, use binary protocol (MessagePack)

### Challenge 2: **Scale**
- **Problem:** 1000s of concurrent users
- **Solution:** Use Redis adapter for Socket.io, horizontal scaling

### Challenge 3: **Security**
- **Problem:** Unauthorized users join editing session
- **Solution:** JWT authentication on WebSocket connection

### Challenge 4: **Offline Editing**
- **Problem:** User loses internet, loses work
- **Solution:** Y.js stores locally, syncs when reconnected

---

## 💰 Cost Comparison

### Self-Hosted (Socket.io + Y.js):
- **Cost:** $0 (runs on your servers)
- **Control:** Full control
- **Effort:** High (build everything)

### Managed Service (Ably/Pusher):
- **Cost:** ~$29-99/month
- **Control:** Limited
- **Effort:** Low (just API calls)

### Hybrid (Partykit):
- **Cost:** Free tier + $20/month
- **Control:** Medium
- **Effort:** Medium

**Recommendation:** Start with **Socket.io + Y.js** for full control and zero cost.

---

## 🎯 When to Build Collaboration?

### Build It If:
- ✅ You have a team plan/feature
- ✅ Users share access to microsites
- ✅ You want to differentiate from competitors

### Skip It If:
- ❌ Most users work solo
- ❌ Limited development resources
- ❌ Analytics is higher priority

---

## 📊 Collaboration vs Analytics

| Feature | Complexity | Time | Value |
|---------|-----------|------|-------|
| **Analytics Dashboard** | 🟢 Low | 2 weeks | 🔥 High (immediate insights) |
| **Real-Time Collaboration** | 🔴 High | 5+ weeks | 🌟 Medium (nice-to-have) |

**Recommendation:** Build Analytics first, then Collaboration.

---

## ✅ Next Steps (If You Want Collaboration)

```bash
# 1. Set up collaboration service
cd services
mkdir collaboration-service
cd collaboration-service
npm init -y
npm install socket.io express yjs y-websocket redis

# 2. Create server
touch src/index.ts

# 3. Update docker-compose.yml
# Add collaboration-service container

# 4. Frontend integration
cd ../../qr-frontend
npm install socket.io-client yjs y-websocket

# 5. Create socket client
mkdir src/lib/socket
touch src/lib/socket/client.ts

# 6. Add presence hook
touch src/hooks/usePresence.ts
```

**Ready to collaborate in real-time? 🤝✨** But I recommend **Analytics first** for quick wins! 📊
