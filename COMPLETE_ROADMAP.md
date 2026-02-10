# 🚀 Complete Frontend Overhaul + ML + WebSocket Plan

## 🎯 The 3 Big Priorities

### 1. **Frontend Overhaul** 🎨
Industry-specific templates that create beautiful pages in 2 minutes

### 2. **ML Template Generator** 🤖
AI auto-generates microsites from minimal input (like HighLevel's AI)

### 3. **WebSocket Live Collaboration** 👥
Real-time multiplayer editing (like Figma/Google Docs)

---

## 📊 Strategic Priority Order

Based on **impact vs effort**, here's the recommended sequence:

### **Phase 1: Frontend Overhaul** (Week 1-2) 
**Why First:** Foundation for everything else  
**Impact:** 🔥🔥🔥 (Makes product usable)  
**Effort:** Medium (2 weeks)

### **Phase 2: ML Template Generator** (Week 3-4)
**Why Second:** Leverages new frontend templates  
**Impact:** 🔥🔥🔥 (Unique differentiator)  
**Effort:** High (2 weeks + training)

### **Phase 3: WebSocket Live Collab** (Week 5-6)
**Why Third:** Advanced feature, needs stable base  
**Impact:** 🔥🔥 (Nice-to-have for teams)  
**Effort:** High (2-3 weeks)

---

## 🎨 PHASE 1: Frontend Overhaul (WEEKS 1-2)

### **Goals**
- ✅ Industry templates (Real Estate, Restaurant, Retail, Events, Support)
- ✅ Clean, modern UI (beat Linktree's aesthetics)
- ✅ 2-minute setup time (vs 30 minutes currently)
- ✅ Mobile-first responsive design

### **What to Build**

#### 1. **Template Library Screen** (3 days)

**File:** `src/pages/TemplateLibrary.tsx`

```typescript
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TEMPLATES = [
  {
    id: 'real-estate',
    name: 'Property Showcase',
    icon: '🏠',
    description: 'Perfect for real estate agents',
    thumbnail: '/templates/real-estate-preview.png',
    setupTime: '2 min',
    blocks: 6,
    category: 'Business',
  },
  {
    id: 'restaurant',
    name: 'Digital Menu',
    icon: '🍕',
    description: 'Beautiful menus for restaurants',
    thumbnail: '/templates/restaurant-preview.png',
    setupTime: '3 min',
    blocks: 5,
    category: 'Hospitality',
  },
  // ... 3 more templates
];

export function TemplateLibrary() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Choose Your Template</h1>
        <p className="text-gray-600">Beautiful landing pages in minutes</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map(template => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
              <Badge className="absolute top-2 right-2">{template.setupTime}</Badge>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{template.icon}</span>
                <h3 className="text-xl font-semibold">{template.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{template.blocks} blocks</span>
                <Button onClick={() => selectTemplate(template.id)}>
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

#### 2. **Template Wizard** (5 days)

**File:** `src/components/TemplateWizard.tsx`

Multi-step form that collects industry-specific data:

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Real Estate Wizard Example
export function RealEstateWizard({ onComplete }) {
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1);

  const onSubmit = async (data) => {
    // Call backend to create microsite from template
    const microsite = await api.post('/microsites/from-template', {
      templateId: 'real-estate-property',
      data: {
        propertyAddress: data.address,
        price: data.price,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        sqft: data.sqft,
        photos: data.photos, // Uploaded files
        floorPlans: data.floorPlans,
      }
    });

    onComplete(microsite);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6">
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Property Details</h2>
          
          <div>
            <Label>Property Address</Label>
            <Input {...register('address')} placeholder="123 Main St, City, State" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price</Label>
              <Input {...register('price')} type="number" placeholder="650000" />
            </div>
            <div>
              <Label>Square Feet</Label>
              <Input {...register('sqft')} type="number" placeholder="1850" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Bedrooms</Label>
              <Input {...register('bedrooms')} type="number" placeholder="3" />
            </div>
            <div>
              <Label>Bathrooms</Label>
              <Input {...register('bathrooms')} type="number" placeholder="2" />
            </div>
          </div>

          <Button onClick={() => setStep(2)} className="w-full">
            Next: Upload Photos
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Upload Photos</h2>
          
          <div>
            <Label>Property Photos (up to 10)</Label>
            <Input {...register('photos')} type="file" multiple accept="image/*" />
            <p className="text-xs text-gray-500 mt-1">Hero image will be first photo</p>
          </div>

          <div>
            <Label>Floor Plans (optional)</Label>
            <Input {...register('floorPlans')} type="file" multiple accept="image/*,application/pdf" />
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button type="submit" className="flex-1">Create Property Page</Button>
          </div>
        </div>
      )}
    </form>
  );
}
```

---

#### 3. **Backend Template API** (3 days)

**File:** `services/microsite-service/src/routes/templates.ts`

```typescript
import { FastifyInstance } from 'fastify';
import { db } from '../db.js';
import { microsites } from '../schema.js';
import { verifyJWT } from '@qr/common';

// Template definitions
const TEMPLATE_CONFIGS = {
  'real-estate-property': {
    name: 'Property Showcase',
    industry: 'real-estate',
    requiredFields: ['propertyAddress', 'price', 'bedrooms', 'bathrooms', 'sqft'],
    generateLayout: (data) => [
      // Profile block (agent info)
      {
        id: 'profile-1',
        type: 'profile',
        content: {
          displayName: data.agentName || 'Real Estate Agent',
          bio: data.agentBio || 'Your trusted real estate professional',
          avatarUrl: data.agentPhoto,
          showLocation: true,
          showWebsite: true,
        }
      },
      
      // Hero image
      {
        id: 'image-1',
        type: 'image',
        content: {
          url: data.photos[0], // First photo = hero
          alt: data.propertyAddress,
          width: '100%',
          aspectRatio: '16:9',
        }
      },
      
      // Property stats
      {
        id: 'stats-1',
        type: 'stats',
        content: {
          items: [
            { label: 'Bedrooms', value: data.bedrooms },
            { label: 'Bathrooms', value: data.bathrooms },
            { label: 'Sq Ft', value: data.sqft.toLocaleString() },
          ],
          columns: 3,
        }
      },
      
      // Gallery (floor plans + photos)
      {
        id: 'gallery-1',
        type: 'gallery',
        content: {
          images: [
            ...data.floorPlans?.map(url => ({ url, caption: 'Floor Plan' })) || [],
            ...data.photos.slice(1).map(url => ({ url, caption: 'Property Photo' })),
          ],
          layout: 'grid',
          columns: 3,
          aspectRatio: 'square',
        }
      },
      
      // CTA buttons
      {
        id: 'button-1',
        type: 'link-button',
        content: {
          label: 'Schedule Showing',
          url: data.schedulingLink || '#',
          variant: 'fill',
          icon: 'calendar',
        }
      },
      {
        id: 'button-2',
        type: 'link-button',
        content: {
          label: 'Calculate Mortgage',
          url: data.mortgageLink || '#',
          variant: 'outline',
          icon: 'calculator',
        }
      },
    ]
  },
  
  'restaurant-menu': {
    name: 'Digital Menu',
    industry: 'restaurant',
    requiredFields: ['restaurantName', 'cuisine'],
    generateLayout: (data) => [
      // Restaurant header
      {
        id: 'profile-1',
        type: 'profile',
        content: {
          displayName: data.restaurantName,
          bio: `${data.cuisine} Cuisine`,
          avatarUrl: data.logo,
        }
      },
      
      // Food carousel
      {
        id: 'gallery-1',
        type: 'gallery',
        content: {
          images: data.photos?.map(url => ({ url })) || [],
          layout: 'carousel',
          aspectRatio: 'landscape',
        }
      },
      
      // Menu items (rich text)
      {
        id: 'richtext-1',
        type: 'rich-text',
        content: {
          html: generateMenuHTML(data.menuItems),
        }
      },
      
      // Order button
      {
        id: 'button-1',
        type: 'link-button',
        content: {
          label: 'Order Online',
          url: data.orderingLink,
          variant: 'fill',
          icon: 'shopping-cart',
        }
      },
    ]
  },
  
  // ... other templates
};

export default async function templateRoutes(app: FastifyInstance) {
  // List all templates
  app.get('/templates', async (req, reply) => {
    return {
      templates: Object.entries(TEMPLATE_CONFIGS).map(([id, config]) => ({
        id,
        name: config.name,
        industry: config.industry,
        requiredFields: config.requiredFields,
      }))
    };
  });

  // Create microsite from template
  app.post('/microsites/from-template', {
    preHandler: [verifyJWT]
  }, async (req: any, reply: any) => {
    const { templateId, data } = req.body;
    const user = req.user;

    const template = TEMPLATE_CONFIGS[templateId];
    if (!template) {
      return reply.code(400).send({ error: 'Invalid template ID' });
    }

    // Validate required fields
    const missingFields = template.requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return reply.code(400).send({ 
        error: 'Missing required fields', 
        fields: missingFields 
      });
    }

    // Generate layout from template
    const layout = template.generateLayout(data);

    // Create microsite
    const [microsite] = await db.insert(microsites).values({
      title: data.propertyAddress || data.restaurantName || 'My Page',
      description: `Generated from ${template.name} template`,
      templateId,
      industry: template.industry,
      templateData: data,
      layout,
      createdBy: user.id,
    }).returning();

    return microsite;
  });
}

// Helper to generate menu HTML
function generateMenuHTML(menuItems: any[]) {
  return `
    <div class="space-y-6">
      ${menuItems.map(item => `
        <div class="border-b pb-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold text-lg">${item.name}</h3>
              <p class="text-sm text-gray-600">${item.description}</p>
            </div>
            <span class="text-lg font-bold">$${item.price}</span>
          </div>
          ${item.dietary ? `<span class="text-xs text-gray-500 mt-1">${item.dietary}</span>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}
```

---

#### 4. **Database Migration** (1 day)

**File:** `services/microsite-service/src/schema.ts`

Add template fields to microsites table:

```typescript
export const microsites = pgTable("microsites", {
  // ... existing fields
  
  // NEW: Template metadata
  templateId: text("template_id"), // 'real-estate-property', 'restaurant-menu'
  industry: text("industry"), // 'real-estate', 'restaurant', 'retail'
  templateData: jsonb("template_data"), // Raw user input
});
```

Run migration:
```bash
cd services/microsite-service
npm run db:generate
npm run db:push
```

---

### **Frontend Overhaul Deliverables**

✅ Template Library UI (browse 5 templates)  
✅ Template Wizard (multi-step forms for each industry)  
✅ Backend API (`POST /microsites/from-template`)  
✅ Database schema updated  
✅ 5 template configs (Real Estate, Restaurant, Retail, Events, Support)

**Timeline:** 2 weeks  
**Result:** Users create beautiful pages in 2 minutes

---

## 🤖 PHASE 2: ML Template Generator (WEEKS 3-4)

### **Goals**
- ✅ AI auto-generates microsites from minimal input
- ✅ Competes with HighLevel's AI page builder
- ✅ Upload 1 image → get full page with copy, layout, CTAs

### **How It Works**

```
User uploads property photo
    ↓
GPT-4 Vision analyzes image
    ↓
Extracts: style, colors, room types
    ↓
Generates: title, description, CTAs
    ↓
ML Service creates microsite layout
    ↓
User gets complete property page in 30 seconds
```

### **What to Build**

#### 1. **Train ML Model on Existing Templates** (5 days)

**File:** `services/ml-service/src/lib/template-generator.ts`

```typescript
import OpenAI from 'openai';
import { db } from '../db.js';
import { ai_generations } from '../schema.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * AI Template Generator
 * 
 * Given minimal input (1 image + industry), generates complete microsite
 */
export async function generateMicrositeFromImage(
  imageUrl: string,
  industry: 'real-estate' | 'restaurant' | 'retail' | 'event' | 'support',
  additionalContext?: string
) {
  // Step 1: Analyze image with GPT-4 Vision
  const imageAnalysis = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this ${industry} image and extract:
            1. Visual style (modern, traditional, luxury, etc.)
            2. Color palette (3-5 dominant colors)
            3. Key features visible
            4. Suggested title
            5. Suggested description (2-3 sentences)
            6. Recommended CTAs (3-5 action buttons)
            
            ${additionalContext || ''}
            
            Return as JSON.`
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    max_tokens: 1000,
  });

  const analysis = JSON.parse(imageAnalysis.choices[0].message.content);

  // Step 2: Generate microsite layout based on analysis
  const layout = generateLayoutFromAnalysis(analysis, industry);

  // Step 3: Generate theme based on color palette
  const theme = {
    branding: {
      primaryColor: analysis.colorPalette[0],
      secondaryColor: analysis.colorPalette[1],
    },
    background: {
      type: 'gradient',
      gradient: `linear-gradient(135deg, ${analysis.colorPalette[0]}, ${analysis.colorPalette[1]})`,
    },
    font: {
      title: analysis.style === 'luxury' ? 'Playfair Display' : 'Inter',
      body: 'Inter',
    }
  };

  // Step 4: Save generation to database
  await db.insert(ai_generations).values({
    organizationId: 'temp', // TODO: Get from user
    prompt: additionalContext || `Generate ${industry} page from image`,
    imageUrl,
    generatedContent: { layout, theme, analysis },
    model: 'gpt-4-vision',
    tokensUsed: imageAnalysis.usage.total_tokens,
  });

  return {
    title: analysis.title,
    description: analysis.description,
    layout,
    theme,
    analysis,
  };
}

// Helper: Convert AI analysis to block layout
function generateLayoutFromAnalysis(analysis: any, industry: string) {
  const blocks: any[] = [];

  // Hero image block
  blocks.push({
    id: 'hero-1',
    type: 'image',
    content: {
      url: analysis.imageUrl,
      alt: analysis.title,
      width: '100%',
      aspectRatio: '16:9',
    }
  });

  // Heading block
  blocks.push({
    id: 'heading-1',
    type: 'heading',
    content: {
      text: analysis.title,
      level: 1,
      gradient: 'violet', // From color palette
    }
  });

  // Description
  blocks.push({
    id: 'richtext-1',
    type: 'rich-text',
    content: {
      html: `<p>${analysis.description}</p>`,
    }
  });

  // Industry-specific blocks
  if (industry === 'real-estate') {
    // Add stats block
    blocks.push({
      id: 'stats-1',
      type: 'stats',
      content: {
        items: analysis.features.map((feature: string) => ({
          label: feature,
          value: '3', // Placeholder
        })),
        columns: 3,
      }
    });
  }

  // CTA buttons from AI recommendations
  analysis.ctas.forEach((cta: string, idx: number) => {
    blocks.push({
      id: `button-${idx + 1}`,
      type: 'link-button',
      content: {
        label: cta,
        url: '#',
        variant: idx === 0 ? 'fill' : 'outline',
      }
    });
  });

  return blocks;
}
```

---

#### 2. **API Endpoint for AI Generation** (2 days)

**File:** `services/ml-service/src/routes/ai-generator.ts`

```typescript
export default async function aiGeneratorRoutes(app: FastifyInstance) {
  // Generate microsite from image
  app.post('/api/ml/generate-microsite', {
    preHandler: [verifyJWT]
  }, async (req: any, reply: any) => {
    const { imageUrl, industry, context } = req.body;

    if (!imageUrl || !industry) {
      return reply.code(400).send({ error: 'imageUrl and industry required' });
    }

    const result = await generateMicrositeFromImage(imageUrl, industry, context);

    return {
      success: true,
      ...result,
      message: 'Microsite generated successfully. Review and customize as needed.',
    };
  });
}
```

---

#### 3. **Frontend AI Upload Flow** (3 days)

**File:** `src/components/AITemplateWizard.tsx`

```typescript
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

export function AITemplateWizard() {
  const [image, setImage] = useState<File | null>(null);
  const [industry, setIndustry] = useState('real-estate');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    // Upload image first
    const formData = new FormData();
    formData.append('file', image);
    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const { url } = await uploadRes.json();

    // Generate microsite with AI
    const aiRes = await fetch('http://localhost:3016/api/ml/generate-microsite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        imageUrl: url,
        industry,
        context: 'Generate a professional landing page',
      }),
    });

    const microsite = await aiRes.json();
    setLoading(false);

    // Navigate to editor with pre-filled content
    router.push(`/editor/${microsite.id}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">AI Page Generator</h2>
      <p className="text-gray-600 mb-6">
        Upload 1 image and let AI create your entire landing page in 30 seconds.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Industry</label>
          <Select value={industry} onChange={e => setIndustry(e.target.value)}>
            <option value="real-estate">Real Estate</option>
            <option value="restaurant">Restaurant</option>
            <option value="retail">Retail</option>
            <option value="event">Event</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Upload Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-violet-500 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files[0])}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {image ? image.name : 'Click to upload or drag and drop'}
              </p>
            </label>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!image || loading}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Generate Page with AI'}
        </Button>
      </div>
    </div>
  );
}
```

---

### **ML Generator Deliverables**

✅ GPT-4 Vision image analysis  
✅ AI layout generation  
✅ Color palette extraction  
✅ Auto-generated copy (title, description, CTAs)  
✅ Frontend upload UI

**Timeline:** 2 weeks  
**Result:** Users upload 1 photo, get complete page in 30 seconds

---

## 👥 PHASE 3: WebSocket Live Collaboration (WEEKS 5-6)

### **Goals**
- ✅ Real-time multiplayer editing (like Figma)
- ✅ See collaborators' cursors
- ✅ Instant sync across users
- ✅ Conflict resolution

### **Architecture**

```
User A edits block → WebSocket → Server broadcasts → User B sees change
   ↓                     ↓                              ↓
Browser            Socket.IO Server                   Browser
```

### **What to Build**

#### 1. **WebSocket Server** (4 days)

**File:** `services/microsite-service/src/websocket/collaboration.ts`

```typescript
import { Server as SocketServer } from 'socket.io';
import { verifyJWT } from '@qr/common';
import { db } from '../db.js';
import { microsites } from '../schema.js';
import { eq } from 'drizzle-orm';

// In-memory store of active sessions
const activeSessions = new Map<string, Set<string>>(); // micrositeId → Set of socket IDs

export function setupCollaborationSocket(httpServer: any) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Middleware: Verify JWT on connection
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = await verifyJWT(token);
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user.id}`);

    // Join microsite editing room
    socket.on('join-microsite', async ({ micrositeId }) => {
      // Verify user has access to this microsite
      const [microsite] = await db
        .select()
        .from(microsites)
        .where(eq(microsites.id, micrositeId))
        .limit(1);

      if (!microsite || microsite.createdBy !== socket.data.user.id) {
        socket.emit('error', { message: 'Access denied' });
        return;
      }

      // Join room
      socket.join(micrositeId);

      // Track active user
      if (!activeSessions.has(micrositeId)) {
        activeSessions.set(micrositeId, new Set());
      }
      activeSessions.get(micrositeId).add(socket.id);

      // Broadcast to other users in room
      socket.to(micrositeId).emit('user-joined', {
        userId: socket.data.user.id,
        userName: socket.data.user.email,
      });

      console.log(`User ${socket.data.user.id} joined microsite ${micrositeId}`);
    });

    // Block update (real-time editing)
    socket.on('block-update', async ({ micrositeId, blockId, changes }) => {
      // Update database
      const [microsite] = await db
        .select()
        .from(microsites)
        .where(eq(microsites.id, micrositeId))
        .limit(1);

      if (!microsite) return;

      const layout = microsite.layout as any[];
      const blockIndex = layout.findIndex(b => b.id === blockId);
      
      if (blockIndex !== -1) {
        layout[blockIndex] = { ...layout[blockIndex], ...changes };
        
        await db
          .update(microsites)
          .set({ layout, updatedAt: new Date() })
          .where(eq(microsites.id, micrositeId));

        // Broadcast to all other users in room
        socket.to(micrositeId).emit('block-updated', {
          blockId,
          changes,
          userId: socket.data.user.id,
        });
      }
    });

    // Cursor position (for showing other users' cursors)
    socket.on('cursor-move', ({ micrositeId, x, y }) => {
      socket.to(micrositeId).emit('cursor-update', {
        userId: socket.data.user.id,
        userName: socket.data.user.email,
        x,
        y,
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      // Remove from active sessions
      activeSessions.forEach((users, micrositeId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          socket.to(micrositeId).emit('user-left', {
            userId: socket.data.user.id,
          });
        }
      });

      console.log(`User disconnected: ${socket.data.user.id}`);
    });
  });

  return io;
}
```

---

#### 2. **Enable WebSocket in Microsite Service** (1 day)

**File:** `services/microsite-service/src/index.ts`

```typescript
import { setupCollaborationSocket } from './websocket/collaboration.js';

// After app.listen()
const server = await app.listen({ port, host: '0.0.0.0' });

// Setup WebSocket server
setupCollaborationSocket(server.server);

console.log(`Microsite Service listening on ${port}`);
console.log(`WebSocket collaboration enabled`);
```

---

#### 3. **Frontend WebSocket Client** (5 days)

**File:** `src/hooks/useCollaboration.ts`

```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useCollaboration(micrositeId: string, token: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [cursors, setCursors] = useState<Map<string, { x: number, y: number }>>(new Map());

  useEffect(() => {
    const newSocket = io('http://localhost:3005', {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('Connected to collaboration server');
      newSocket.emit('join-microsite', { micrositeId });
    });

    newSocket.on('user-joined', (data) => {
      console.log('User joined:', data);
      setActiveUsers(prev => [...prev, data]);
    });

    newSocket.on('user-left', (data) => {
      setActiveUsers(prev => prev.filter(u => u.userId !== data.userId));
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.delete(data.userId);
        return newCursors;
      });
    });

    newSocket.on('block-updated', (data) => {
      console.log('Block updated by another user:', data);
      // Update local state (handled by parent component)
    });

    newSocket.on('cursor-update', (data) => {
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.set(data.userId, { x: data.x, y: data.y });
        return newCursors;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [micrositeId, token]);

  // Send block update
  const updateBlock = (blockId: string, changes: any) => {
    socket?.emit('block-update', { micrositeId, blockId, changes });
  };

  // Send cursor position
  const moveCursor = (x: number, y: number) => {
    socket?.emit('cursor-move', { micrositeId, x, y });
  };

  return {
    activeUsers,
    cursors,
    updateBlock,
    moveCursor,
  };
}
```

---

#### 4. **Cursor Overlay Component** (2 days)

**File:** `src/components/CollaboratorCursors.tsx`

```typescript
import { useCollaboration } from '@/hooks/useCollaboration';

export function CollaboratorCursors({ micrositeId, token }) {
  const { cursors, activeUsers } = useCollaboration(micrositeId, token);

  return (
    <>
      {/* Active users indicator */}
      <div className="fixed top-4 right-4 flex gap-2">
        {activeUsers.map(user => (
          <div
            key={user.userId}
            className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center text-xs font-bold"
            title={user.userName}
          >
            {user.userName[0].toUpperCase()}
          </div>
        ))}
      </div>

      {/* Cursors */}
      {Array.from(cursors.entries()).map(([userId, pos]) => {
        const user = activeUsers.find(u => u.userId === userId);
        return (
          <div
            key={userId}
            className="fixed pointer-events-none"
            style={{ left: pos.x, top: pos.y }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M5.5 3.21V20.8l7.58-7.58 4.37 7.58 2.55-1.48-4.37-7.58h8.09L5.5 3.21z"
                fill="#8b5cf6"
              />
            </svg>
            <span className="ml-6 mt-1 text-xs bg-violet-500 text-white px-2 py-1 rounded">
              {user?.userName}
            </span>
          </div>
        );
      })}
    </>
  );
}
```

---

### **WebSocket Deliverables**

✅ Socket.IO server with JWT auth  
✅ Real-time block updates  
✅ Cursor tracking  
✅ Active users indicator  
✅ Conflict resolution

**Timeline:** 2-3 weeks  
**Result:** Team members can edit microsites together in real-time

---

## 📊 Complete Roadmap Summary

### **Week 1-2: Frontend Overhaul**
- Template Library UI
- Template Wizard (Real Estate, Restaurant)
- Backend template API
- Database migration

### **Week 3-4: ML Generator**
- GPT-4 Vision integration
- AI layout generation
- Frontend upload UI
- Train on existing templates

### **Week 5-6: WebSocket Collab**
- Socket.IO server setup
- Real-time editing
- Cursor tracking
- Active users UI

---

## 🎯 Final Priority Recommendation

**If you can only do ONE thing first:**

**Choose: Frontend Overhaul (Templates)**

**Why:**
- ✅ Biggest user impact (2 min vs 30 min setup)
- ✅ Foundation for ML generator (needs templates to learn from)
- ✅ Can launch MVP without ML/WebSocket
- ✅ Competes directly with Linktree, Bitly, Flowcode

**Then add ML (differentiator), then WebSocket (nice-to-have for teams).**

---

Want me to:
1. **Start building the Template Library UI** right now?
2. **Create the Real Estate Wizard** component?
3. **Build the backend template API** endpoints?

Let's ship this! 🚀
