# User Profile Page Implementation Plan

## Overview

Build a User Profile Page that mirrors the Default Page layout with interactive Slider Card Stacks organized into Editorial Groupings. Cards support REBAC (Relationship-Based Access Control) permissions similar to Google Docs.

**Core Principles:**
- **Open by Default**: Card creation and publishing is unrestricted - any user can create and publish cards
- **Discoverability**: Tag Clouds and Proximity Grouping enable organic search and related content discovery
- **SEO-Ready**: Public cards include JSON-LD structured data for search engine indexing
- **Privacy Controls**: noindex/nofollow directives for cards that should not be indexed

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER PROFILE PAGE                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   COVER CARD STACK                       │   │
│  │  Title | Public/Private | Profile Image | Bio            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐│
│  │ EDITORIAL STACK 1│  │ EDITORIAL STACK 2│  │ EDITORIAL ...  ││
│  │ (Overlapping     │  │ (Overlapping     │  │                ││
│  │  Slider Cards)   │  │  Slider Cards)   │  │                ││
│  └──────────────────┘  └──────────────────┘  └────────────────┘│
│                                                                 │
│  Stack Types:                                                   │
│  • Upsell Advertising    • Featured Profiles                   │
│  • Institutional Articles • Playlists                          │
│  • Research Docs         • Document Review                     │
│  • Financial Documents   • Custom Collections                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Core Profile Page Structure

### 1.1 Profile Page Template (`src/profile.njk`)

Create main profile page that mirrors default layout:

```
src/
├── profile.njk              # Main profile page template
├── _includes/
│   ├── profile-header.njk   # Cover card section
│   ├── card-stack.njk       # Reusable card stack component
│   └── card-item.njk        # Individual card component
├── css/
│   └── profile.css          # Profile-specific styles
└── js/
│   └── profile.js           # Profile interactions + slider init
```

### 1.2 Cover Card Component

**Data Structure:**
```javascript
{
  id: "cover-{user_id}",
  type: "cover",
  title: "Student 017",
  subtitle: "Master of Human Resources",
  headline: "Researching AI Ethics in Healthcare",  // Card headline
  bio: "Profile description...",
  profile_image: "https://...",
  visibility: "public" | "private",
  social_links: [],
  webflow_url: "https://...",

  // Tags and Groups displayed on cover
  tags: [
    { id: 1, name: "ai-ethics", display_name: "AI Ethics" },
    { id: 2, name: "healthcare", display_name: "Healthcare" },
    { id: 3, name: "research", display_name: "Research" }
  ],
  groups: [
    { id: 1, name: "HR Cohort 2025", type: "class", role: "member" },
    { id: 2, name: "Ethics Committee", type: "team", role: "collaborator" }
  ],

  // Permission context for cover card
  permissions: {
    owner_id: "user_123",
    collaborators: [
      { user_id: "user_456", role: "collaborator", display_name: "Dr. Smith" }
    ],
    groups_with_access: [
      { group_id: 1, role: "view_only" }
    ]
  }
}
```

**HTML Structure (BEM):**
```html
<section class="profile-cover">
  <div class="profile-cover__header">
    <span class="profile-cover__subtitle">Master of Human Resources</span>
    <h1 class="profile-cover__title">Student 017</h1>

    <!-- Headline (prominent card title) -->
    <h2 class="profile-cover__headline">Researching AI Ethics in Healthcare</h2>

    <p class="profile-cover__bio">...</p>

    <!-- Tags -->
    <div class="profile-cover__tags">
      <a href="/tags/ai-ethics" class="profile-cover__tag">AI Ethics</a>
      <a href="/tags/healthcare" class="profile-cover__tag">Healthcare</a>
      <a href="/tags/research" class="profile-cover__tag">Research</a>
    </div>

    <!-- Groups/Affiliations -->
    <div class="profile-cover__groups">
      <span class="profile-cover__groups-label">Member of:</span>
      <a href="/groups/hr-cohort-2025" class="profile-cover__group">
        <span class="profile-cover__group-icon">Class</span>
        HR Cohort 2025
      </a>
      <a href="/groups/ethics-committee" class="profile-cover__group">
        <span class="profile-cover__group-icon">Team</span>
        Ethics Committee
      </a>
    </div>

    <!-- Visibility & Permissions Summary -->
    <div class="profile-cover__meta">
      <span class="profile-cover__visibility" data-visibility="public">
        Public
      </span>
      <span class="profile-cover__collaborators">
        <span class="profile-cover__collaborator-count">2 collaborators</span>
      </span>
    </div>
  </div>

  <div class="profile-cover__image">
    <img src="..." alt="Profile" />
  </div>

  <div class="profile-cover__nav">
    <button class="profile-cover__nav-btn" data-direction="prev">←</button>
    <button class="profile-cover__nav-btn" data-direction="next">→</button>
  </div>
</section>
```

### 1.3 Cover Card CSS

```css
.profile-cover__headline {
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin: 0.5rem 0 1rem;
  font-style: italic;
}

.profile-cover__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.profile-cover__tag {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s;
}

.profile-cover__tag:hover {
  background: #fff;
  color: #750009;
}

.profile-cover__groups {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.profile-cover__groups-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.profile-cover__group {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 0.8rem;
  text-decoration: none;
}

.profile-cover__group-icon {
  font-size: 0.65rem;
  padding: 0.125rem 0.25rem;
  background: rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
}

.profile-cover__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.profile-cover__collaborators {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}
```

---

## Phase 2: Overlapping Slider Card Stacks

### 2.1 Osmo Overlapping Slider Integration

**Dependencies:**
- GSAP 3.13.0
- GSAP Draggable Plugin
- GSAP InertiaPlugin

**CDN Links:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/Draggable.min.js"></script>
<!-- InertiaPlugin requires GSAP Club membership or self-hosted -->
```

### 2.2 Card Stack Component Structure

```html
<section class="card-stack" data-stack-id="{stack_id}" data-stack-type="{type}">
  <div class="card-stack__header">
    <h2 class="card-stack__title">Featured Profiles</h2>
    <div class="card-stack__actions">
      <button class="card-stack__action" data-action="edit">Edit</button>
      <button class="card-stack__action" data-action="share">Share</button>
    </div>
  </div>

  <div data-overlap-slider-init class="overlapping-slider__wrap">
    <div data-overlap-slider-collection class="overlapping-slider__collection">
      <div data-overlap-slider-list class="overlapping-slider__list">

        <!-- Individual Cards -->
        <div data-overlap-slider-item class="overlapping-slider__item">
          <article class="stack-card" data-card-id="{id}">
            <!-- Card Content -->
          </article>
        </div>

      </div>
    </div>
  </div>
</section>
```

### 2.3 Slider JavaScript Implementation

```javascript
// src/js/overlapping-slider.js

function initOverlappingSlider() {
  const sliders = document.querySelectorAll('[data-overlap-slider-init]');

  sliders.forEach(slider => {
    const list = slider.querySelector('[data-overlap-slider-list]');
    const items = slider.querySelectorAll('[data-overlap-slider-item]');

    // GSAP Draggable with inertia
    Draggable.create(list, {
      type: 'x',
      inertia: true,
      bounds: calculateBounds(slider),
      onDrag: function() {
        updateCardTransforms(items, this.x);
      },
      onThrowUpdate: function() {
        updateCardTransforms(items, this.x);
      },
      snap: {
        x: snapToNearestCard
      }
    });

    // Transform cards based on position
    function updateCardTransforms(items, dragX) {
      items.forEach((item, index) => {
        const offset = calculateOffset(item, dragX);
        const scale = mapRange(offset, 0, 300, 1, 0.45);
        const rotation = mapRange(offset, 0, 300, 0, -8);

        gsap.set(item, {
          scale: Math.max(scale, 0.45),
          rotation: rotation,
          zIndex: items.length - index
        });
      });
    }
  });
}
```

---

## Phase 3: Editorial Grouping Types

### 3.1 Stack Type Definitions

| Type | Description | Default Cards | Permissions |
|------|-------------|---------------|-------------|
| `cover` | Profile header | 1 | owner-only edit |
| `upsell` | Advertising/promotions | 3-5 | admin edit |
| `featured_profiles` | Highlighted users | 4-8 | view-only |
| `institutional` | Articles/announcements | 3-6 | view-only |
| `playlist` | Music/video collection | unlimited | owner + shared |
| `research` | Research documents | unlimited | owner + shared |
| `documents` | File collections | unlimited | owner + shared |
| `financial` | Private financial docs | unlimited | owner + invited |

### 3.2 Card Type Data Structures

**Base Card:**
```javascript
{
  id: "card_{uuid}",
  stack_id: "stack_{uuid}",
  type: "story" | "music_playlist" | "youtube_video" | "ticket_purchase" | "crowdfund" | "tuition" | "document" | "profile",
  title: "Card Title",
  description: "...",
  thumbnail: "https://...",
  visibility: "public" | "private" | "shared",  // Default: "public"
  created_at: "2025-01-25T...",
  updated_at: "2025-01-25T...",
  owner_id: "user_{uuid}",

  // Type-specific data
  type_data: { ... },

  // Tags for discovery (open by default)
  tags: [
    { id: 1, name: "machine-learning", display_name: "Machine Learning" },
    { id: 2, name: "research", display_name: "Research" }
  ],

  // SEO settings (indexable by default)
  seo_settings: {
    indexable: true,       // Default: true - allow search engines
    followable: true,      // Default: true - follow links
    snippet_allowed: true, // Default: true - allow snippets
    image_indexable: true, // Default: true - allow image indexing
    canonical_url: null    // Optional custom canonical
  },

  // Permissions (REBAC)
  permissions: {
    view: ["user_1", "user_2", "group:class_101"],
    edit: ["user_1"],
    comment: ["user_1", "user_2"],
    download: ["user_1"],
    share: ["user_1"]
  }
}
```

---

## Phase 4: View/Read Mode Engagement

### 4.1 Card Interaction States

```
┌─────────────────────────────────────────┐
│              CARD STATES                │
├─────────────────────────────────────────┤
│  DEFAULT     → Thumbnail + Title        │
│  HOVER       → Show actions overlay     │
│  EXPANDED    → Full content view        │
│  EDIT        → Inline editing mode      │
│  SHARING     → Permission modal         │
└─────────────────────────────────────────┘
```

### 4.2 Engagement Actions

```html
<div class="stack-card__actions">
  <button data-action="view" title="View">👁</button>
  <button data-action="read" title="Read Mode">📖</button>
  <button data-action="edit" title="Edit" data-permission="edit">✏️</button>
  <button data-action="comment" title="Comment" data-permission="comment">💬</button>
  <button data-action="download" title="Download" data-permission="download">⬇️</button>
  <button data-action="share" title="Share" data-permission="share">🔗</button>
</div>
```

### 4.3 Read Mode Implementation

```javascript
// Fullscreen read mode for documents/stories
function enterReadMode(cardId) {
  const card = document.querySelector(`[data-card-id="${cardId}"]`);
  const content = card.querySelector('.stack-card__content');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'read-mode-overlay';
  overlay.innerHTML = `
    <div class="read-mode__container">
      <button class="read-mode__close">×</button>
      <div class="read-mode__content">${content.innerHTML}</div>
      <div class="read-mode__nav">
        <button data-nav="prev">Previous</button>
        <button data-nav="next">Next</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add('read-mode-active');
}
```

---

## Phase 5: REBAC Permission System

### 5.1 Permission Roles (Granular Access)

```javascript
// Permission roles with specific capabilities
const PERMISSION_ROLES = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    description: 'Full control over card/stack and all permissions',
    capabilities: ['view', 'comment', 'edit', 'upload', 'download', 'share', 'delete', 'manage_permissions', 'invite', 'revoke', 'transfer_ownership']
  },

  COLLABORATOR: {
    label: 'Collaborator',
    description: 'Can edit content and add comments',
    capabilities: ['view', 'comment', 'edit', 'upload', 'download']
  },

  COMMENTER: {
    label: 'Commenter',
    description: 'Can view and add comments only',
    capabilities: ['view', 'comment']
  },

  CONTENT_PROVIDER: {
    label: 'Content Provider',
    description: 'Can upload and add content but not edit existing',
    capabilities: ['view', 'upload', 'comment']
  },

  VIEW_ONLY: {
    label: 'View Only',
    description: 'Can only view content, no interactions',
    capabilities: ['view']
  },

  UPLOADER: {
    label: 'Uploader',
    description: 'Can upload files/cards to stack',
    capabilities: ['view', 'upload']
  },

  SHARER: {
    label: 'Sharer',
    description: 'Can view and share with others',
    capabilities: ['view', 'share']
  }
};

// Capability definitions
const CAPABILITIES = {
  view: 'View card/stack content',
  comment: 'Add and reply to comments',
  edit: 'Modify existing content',
  upload: 'Add new cards/files to stack',
  download: 'Download files and content',
  share: 'Share with others (within their permission level)',
  delete: 'Remove cards/content',
  manage_permissions: 'Add/remove collaborators',
  invite: 'Send invitations to new users',
  revoke: 'Revoke access from users',
  transfer_ownership: 'Transfer ownership to another user'
};

// Access types
const ACCESS_TYPES = {
  user: 'Individual user access',
  group: 'Group/class access (e.g., group:class_101)',
  team: 'Team access (e.g., team:marketing)',
  role: 'Role-based access (e.g., role:instructor)',
  link: 'Anyone with link',
  public: 'Public access'
};
```

### 5.2 Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERMISSION ROLE HIERARCHY                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SUPER_ADMIN ────────────────────────────────────────────────┐ │
│    │ All capabilities + ownership transfer                   │ │
│    │                                                         │ │
│    ├── COLLABORATOR ─────────────────────────────────────┐   │ │
│    │     │ Edit + Comment + Upload + Download            │   │ │
│    │     │                                               │   │ │
│    │     ├── CONTENT_PROVIDER ───────────────────────┐   │   │ │
│    │     │     │ Upload + Comment (no edit existing) │   │   │ │
│    │     │     │                                     │   │   │ │
│    │     ├── COMMENTER ──────────────────────────┐   │   │   │ │
│    │     │     │ Comment only                    │   │   │   │ │
│    │     │     │                                 │   │   │   │ │
│    │     ├── UPLOADER ───────────────────────┐   │   │   │   │ │
│    │     │     │ Upload only (no comment)    │   │   │   │   │ │
│    │     │     │                             │   │   │   │   │ │
│    │     └── SHARER ─────────────────────┐   │   │   │   │   │ │
│    │           │ Share only              │   │   │   │   │   │ │
│    │           │                         │   │   │   │   │   │ │
│    └────────── VIEW_ONLY ────────────────┴───┴───┴───┴───┴───┘ │
│                  │ View only (base level)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Xano Permission Tables

**Table: `card_permissions`**
```
id              | int (auto)
card_id         | int (FK → support_cards.id)
stack_id        | int (FK → stacks.id, nullable)
grantee_type    | enum (user, group, team, role, link, public)
grantee_id      | text (nullable for link/public)
role            | enum (super_admin, collaborator, commenter, content_provider, view_only, uploader, sharer)
granted_by      | int (FK → users.id)
granted_at      | timestamp
expires_at      | timestamp (nullable)
is_active       | boolean (default true)
```

**Table: `invitations`**
```
id              | int (auto)
card_id         | int (FK → support_cards.id, nullable)
stack_id        | int (FK → stacks.id, nullable)
inviter_id      | int (FK → users.id)
invitee_email   | text
invitee_user_id | int (FK → users.id, nullable - populated on accept)
role            | enum (super_admin, collaborator, commenter, content_provider, view_only, uploader, sharer)
invitation_token| text (unique, secure random)
message         | text (optional personal message)
status          | enum (pending, accepted, declined, expired, revoked)
created_at      | timestamp
expires_at      | timestamp (default: +7 days)
accepted_at     | timestamp (nullable)
reminder_sent_at| timestamp (nullable)
```

**Table: `share_links`**
```
id              | int (auto)
card_id         | int (FK → support_cards.id, nullable)
stack_id        | int (FK → stacks.id, nullable)
link_token      | text (unique)
role            | enum (view_only, commenter, sharer)
created_by      | int (FK → users.id)
created_at      | timestamp
expires_at      | timestamp (nullable)
max_uses        | int (nullable)
use_count       | int (default 0)
is_active       | boolean (default true)
password_hash   | text (nullable - for password-protected links)
```

### 5.3 Permission Check API Endpoint

```javascript
// Xano endpoint: GET /api:pIN2vLYu/cards/{card_id}/permissions/check
// Returns: { can_view, can_edit, can_comment, can_download, can_share }

async function checkPermission(cardId, userId, action) {
  const response = await fetch(
    `${CONFIG.API_URL}/cards/${cardId}/permissions/check?action=${action}`,
    {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    }
  );
  return response.json();
}
```

### 5.4 Share Modal UI (Updated with Roles)

```html
<div class="share-modal" data-card-id="{id}">
  <div class="share-modal__header">
    <h3>Share "{card_title}"</h3>
    <button class="share-modal__close">×</button>
  </div>

  <div class="share-modal__body">
    <!-- Add people/groups with role selection -->
    <div class="share-modal__add">
      <input type="text" placeholder="Add people, groups, or teams"
             class="share-modal__input" id="shareSearch">
      <select class="share-modal__role" id="shareRole">
        <option value="view_only">View Only</option>
        <option value="commenter">Commenter</option>
        <option value="content_provider">Content Provider</option>
        <option value="uploader">Uploader</option>
        <option value="sharer">Sharer</option>
        <option value="collaborator">Collaborator</option>
        <option value="super_admin">Super Admin</option>
      </select>
      <button class="share-modal__send" id="sendInvite">Invite</button>
    </div>

    <!-- Role description -->
    <div class="share-modal__role-desc" id="roleDescription">
      <span class="role-desc__text">Can only view content, no interactions</span>
    </div>

    <!-- Current access list -->
    <div class="share-modal__list">
      <h4>People with access</h4>
      <ul id="accessList">
        <!-- Dynamically populated with role badges -->
        <li class="access-item">
          <img src="..." class="access-item__avatar" />
          <div class="access-item__info">
            <span class="access-item__name">Dr. Smith</span>
            <span class="access-item__email">smith@university.edu</span>
          </div>
          <select class="access-item__role">
            <option value="collaborator" selected>Collaborator</option>
            <!-- ... other options ... -->
          </select>
          <button class="access-item__remove" title="Remove access">×</button>
        </li>
      </ul>
    </div>

    <!-- Get link -->
    <div class="share-modal__link">
      <h4>Get link</h4>
      <div class="share-modal__link-row">
        <select id="linkAccess">
          <option value="restricted">Restricted</option>
          <option value="view_only">Anyone with link (View Only)</option>
          <option value="commenter">Anyone with link (Commenter)</option>
          <option value="sharer">Anyone with link (Can Share)</option>
        </select>
        <button id="copyLink">Copy link</button>
      </div>
    </div>
  </div>
</div>
```

---

## Phase 5.5: Invitation Flow

### 5.5.1 Invitation Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    INVITATION FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  INVITER                          INVITEE                       │
│     │                                │                          │
│     │  1. Enter email + select role  │                          │
│     │  ─────────────────────────►    │                          │
│     │                                │                          │
│     │  2. System creates invitation  │                          │
│     │     - Generate secure token    │                          │
│     │     - Set expiration (7 days)  │                          │
│     │     - Send email notification  │                          │
│     │                                │                          │
│     │  ◄─────────────────────────    │  3. Email received       │
│     │   Invitation sent              │     with invitation link │
│     │                                │                          │
│     │                                │  4. Click invitation     │
│     │                                │     link                 │
│     │                                │         │                │
│     │                                │         ▼                │
│     │                           ┌────┴─────────────────┐        │
│     │                           │ Has account?         │        │
│     │                           └──────┬───────┬───────┘        │
│     │                                  │       │                │
│     │                              YES │       │ NO             │
│     │                                  ▼       ▼                │
│     │                           ┌──────────┐ ┌──────────┐       │
│     │                           │ Sign In  │ │ Sign Up  │       │
│     │                           └────┬─────┘ └────┬─────┘       │
│     │                                │            │             │
│     │                                └─────┬──────┘             │
│     │                                      ▼                    │
│     │                              5. Accept/Decline            │
│     │                                      │                    │
│     │                           ┌─────────┴─────────┐           │
│     │                           │                   │           │
│     │                        ACCEPT              DECLINE        │
│     │                           │                   │           │
│     │                           ▼                   ▼           │
│     │  ◄────────────────  6. Permission      Invitation        │
│     │   Notified           granted            marked            │
│     │                                         declined          │
│     │                                                           │
└─────────────────────────────────────────────────────────────────┘
```

### 5.5.2 Invitation API Endpoints

```javascript
// Create invitation
POST /invitations
{
  card_id: 123,           // or stack_id
  invitee_email: "user@example.com",
  role: "collaborator",
  message: "Please help me review this document"  // optional
}

// Response
{
  id: 456,
  invitation_token: "inv_abc123...",
  status: "pending",
  expires_at: "2025-02-01T...",
  invitation_url: "https://app.com/invite/inv_abc123..."
}

// Accept invitation
POST /invitations/{token}/accept
// Requires authentication

// Decline invitation
POST /invitations/{token}/decline

// Revoke invitation (by inviter)
DELETE /invitations/{id}

// Resend invitation email
POST /invitations/{id}/resend

// List pending invitations (for inviter)
GET /invitations?status=pending

// List received invitations (for invitee)
GET /invitations/received?status=pending
```

### 5.5.3 Invitation Email Template

```html
<!-- Email: Invitation to Collaborate -->
<div style="font-family: 'Roboto', sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #750009; padding: 2rem; color: #fff;">
    <h1 style="margin: 0;">You've been invited!</h1>
  </div>

  <div style="padding: 2rem; background: #fff;">
    <p><strong>{{ inviter.name }}</strong> has invited you to collaborate on:</p>

    <div style="background: #f5f5f5; padding: 1rem; margin: 1rem 0;">
      <h2 style="margin: 0 0 0.5rem;">{{ card.title }}</h2>
      <p style="margin: 0; color: #666;">{{ card.description | truncate(100) }}</p>
    </div>

    <p><strong>Your role:</strong> {{ role.label }}</p>
    <p style="color: #666; font-size: 0.9rem;">{{ role.description }}</p>

    {% if message %}
    <div style="background: #fffde7; padding: 1rem; margin: 1rem 0; border-left: 3px solid #ffd600;">
      <p style="margin: 0; font-style: italic;">"{{ message }}"</p>
      <p style="margin: 0.5rem 0 0; color: #666;">— {{ inviter.name }}</p>
    </div>
    {% endif %}

    <a href="{{ invitation_url }}"
       style="display: inline-block; background: #750009; color: #fff;
              padding: 1rem 2rem; text-decoration: none; margin-top: 1rem;">
      Accept Invitation
    </a>

    <p style="color: #999; font-size: 0.8rem; margin-top: 2rem;">
      This invitation expires on {{ expires_at | date("MMMM D, YYYY") }}.
      <br>
      If you don't want to accept, you can ignore this email.
    </p>
  </div>
</div>
```

### 5.5.4 Invitation Acceptance UI

```html
<!-- Invitation Landing Page -->
<div class="invitation-page">
  <div class="invitation-card">
    <div class="invitation-card__header">
      <h1>You're Invited!</h1>
    </div>

    <div class="invitation-card__content">
      <div class="invitation-card__from">
        <img src="{{ inviter.avatar }}" class="invitation-card__avatar" />
        <div>
          <strong>{{ inviter.name }}</strong>
          <span>invited you to collaborate</span>
        </div>
      </div>

      <div class="invitation-card__item">
        <img src="{{ card.thumbnail }}" class="invitation-card__thumbnail" />
        <div>
          <h2>{{ card.title }}</h2>
          <p>{{ card.description }}</p>
          <div class="invitation-card__tags">
            {% for tag in card.tags %}
            <span class="invitation-card__tag">{{ tag.display_name }}</span>
            {% endfor %}
          </div>
        </div>
      </div>

      <div class="invitation-card__role">
        <span class="invitation-card__role-label">Your role will be:</span>
        <span class="invitation-card__role-badge">{{ role.label }}</span>
        <p class="invitation-card__role-desc">{{ role.description }}</p>
        <ul class="invitation-card__capabilities">
          {% for cap in role.capabilities %}
          <li>{{ capabilities[cap] }}</li>
          {% endfor %}
        </ul>
      </div>

      {% if message %}
      <div class="invitation-card__message">
        <p>"{{ message }}"</p>
      </div>
      {% endif %}
    </div>

    <div class="invitation-card__actions">
      <button class="invitation-btn invitation-btn--accept" onclick="acceptInvitation()">
        Accept Invitation
      </button>
      <button class="invitation-btn invitation-btn--decline" onclick="declineInvitation()">
        Decline
      </button>
    </div>

    <p class="invitation-card__expiry">
      Expires {{ expires_at | relative_time }}
    </p>
  </div>
</div>
```

### 5.5.5 Invitation JavaScript

```javascript
// Send invitation
async function sendInvitation(cardId, email, role, message = null) {
  const response = await fetch(`${CONFIG.API_URL}/invitations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({
      card_id: cardId,
      invitee_email: email,
      role: role,
      message: message
    })
  });

  const result = await response.json();

  if (result.id) {
    showNotification('Invitation sent!', 'success');
    updateAccessList();
  } else {
    showNotification(result.message || 'Failed to send invitation', 'error');
  }

  return result;
}

// Accept invitation (on invitation page)
async function acceptInvitation() {
  const token = getInvitationToken(); // from URL

  const response = await fetch(`${CONFIG.API_URL}/invitations/${token}/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  const result = await response.json();

  if (result.success) {
    // Redirect to the shared card/stack
    window.location.href = result.redirect_url;
  } else {
    showError(result.message);
  }
}

// Decline invitation
async function declineInvitation() {
  const token = getInvitationToken();

  await fetch(`${CONFIG.API_URL}/invitations/${token}/decline`, {
    method: 'POST'
  });

  showMessage('Invitation declined');
  setTimeout(() => window.location.href = '/', 2000);
}

// Revoke invitation (by inviter)
async function revokeInvitation(invitationId) {
  if (!confirm('Revoke this invitation?')) return;

  await fetch(`${CONFIG.API_URL}/invitations/${invitationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  updatePendingInvitations();
}
```

### 5.5.6 Pending Invitations List

```html
<!-- In share modal: pending invitations section -->
<div class="share-modal__pending">
  <h4>Pending Invitations</h4>
  <ul id="pendingInvitations">
    <li class="pending-item">
      <div class="pending-item__info">
        <span class="pending-item__email">newuser@example.com</span>
        <span class="pending-item__role">Collaborator</span>
        <span class="pending-item__status">Sent 2 days ago</span>
      </div>
      <div class="pending-item__actions">
        <button onclick="resendInvitation(123)" title="Resend">↺</button>
        <button onclick="revokeInvitation(123)" title="Revoke">×</button>
      </div>
    </li>
  </ul>
</div>
```

---

## Phase 6: Card Stack Management

### 6.1 Stack CRUD Operations

**Create Stack:**
```javascript
async function createStack(profileId, stackType, title) {
  return fetch(`${CONFIG.API_URL}/profiles/${profileId}/stacks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({
      type: stackType,
      title: title,
      visibility: 'private',
      sort_order: getNextSortOrder()
    })
  });
}
```

**Reorder Cards in Stack:**
```javascript
async function reorderCards(stackId, cardIds) {
  return fetch(`${CONFIG.API_URL}/stacks/${stackId}/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ card_ids: cardIds })
  });
}
```

### 6.2 Stack Sharing (Share as Set)

```javascript
async function shareStack(stackId, recipients, permissionLevel) {
  return fetch(`${CONFIG.API_URL}/stacks/${stackId}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({
      recipients: recipients, // [{type: 'user', id: '...'}, {type: 'group', id: '...'}]
      permission_level: permissionLevel,
      include_future_cards: true
    })
  });
}
```

---

## Phase 7: Xano Data Model Updates

### 7.1 New Tables Required

```
profiles
├── id (int, auto)
├── user_id (int, FK → users)
├── display_name (text)
├── subtitle (text)
├── bio (text)
├── profile_image (text)
├── cover_image (text)
├── visibility (enum: public, private)
├── webflow_id (text)
├── created_at (timestamp)
└── updated_at (timestamp)

stacks
├── id (int, auto)
├── profile_id (int, FK → profiles)
├── type (enum: cover, upsell, featured_profiles, institutional, playlist, research, documents, financial, custom)
├── title (text)
├── description (text)
├── visibility (enum: public, private, shared)
├── sort_order (int)
├── settings (json)
├── created_at (timestamp)
└── updated_at (timestamp)

stack_cards (junction)
├── id (int, auto)
├── stack_id (int, FK → stacks)
├── card_id (int, FK → support_cards)
├── sort_order (int)
├── added_at (timestamp)
└── added_by (int, FK → users)

card_permissions
├── (see Phase 5.2)

share_links
├── (see Phase 5.2)

access_groups
├── id (int, auto)
├── name (text)
├── type (enum: class, team, peer, instructor)
├── owner_id (int, FK → users)
├── created_at (timestamp)
└── settings (json)

group_members
├── id (int, auto)
├── group_id (int, FK → access_groups)
├── user_id (int, FK → users)
├── role (enum: member, admin)
├── joined_at (timestamp)
└── invited_by (int, FK → users)

tags
├── id (int, auto)
├── name (text, unique, lowercase-hyphenated)
├── display_name (text)
├── type (enum: category, topic, format, audience, custom)
├── usage_count (int, default 0)
├── created_at (timestamp)
└── created_by (int, FK → users, nullable)

card_tags (junction)
├── id (int, auto)
├── card_id (int, FK → support_cards)
├── tag_id (int, FK → tags)
├── added_at (timestamp)
└── added_by (int, FK → users)

proximity_index
├── id (int, auto)
├── card_id (int, FK → support_cards)
├── related_card_id (int, FK → support_cards)
├── score (decimal, 0-100)
├── factors (json)
└── updated_at (timestamp)
```

### 7.2 Xano API Endpoints

```
# Profiles
GET    /profiles/{id}                    # Get profile with stacks
PUT    /profiles/{id}                    # Update profile
GET    /profiles/{id}/stacks             # Get all stacks for profile

# Stacks
POST   /stacks                           # Create stack
GET    /stacks/{id}                      # Get stack with cards
PUT    /stacks/{id}                      # Update stack
DELETE /stacks/{id}                      # Delete stack
PUT    /stacks/{id}/reorder              # Reorder cards in stack
POST   /stacks/{id}/cards                # Add card to stack
DELETE /stacks/{id}/cards/{card_id}      # Remove card from stack

# Permissions
GET    /cards/{id}/permissions           # Get all permissions
POST   /cards/{id}/permissions           # Add permission
PUT    /cards/{id}/permissions/{perm_id} # Update permission
DELETE /cards/{id}/permissions/{perm_id} # Revoke permission
GET    /cards/{id}/permissions/check     # Check user's permission

# Share Links
POST   /share-links                      # Create share link
GET    /share-links/{token}              # Validate & get shared content
DELETE /share-links/{id}                 # Revoke share link

# Groups
POST   /groups                           # Create access group
GET    /groups/{id}                      # Get group details
PUT    /groups/{id}                      # Update group
POST   /groups/{id}/members              # Add member
DELETE /groups/{id}/members/{user_id}    # Remove member

# Tags
GET    /tags                             # List all tags (with usage counts)
GET    /tags/{name}                      # Get tag details
GET    /tags/{name}/cards                # Get cards by tag
POST   /tags                             # Create custom tag
GET    /tags/cloud                       # Get weighted tag cloud data
GET    /tags/suggest?q={query}           # Autocomplete suggestions

# Proximity / Related
GET    /cards/{id}/related               # Get related cards by proximity
POST   /cards/{id}/proximity/refresh     # Trigger proximity recalculation

# SEO / Sitemap
GET    /cards/sitemap                    # Get indexable cards for sitemap
PUT    /cards/{id}/seo                   # Update SEO settings
```

---

## Phase 8: Webflow CMS Sync

### 8.1 Collection Structure Updates

**Profile Collection (new fields):**
```
- display-name (Plain Text)
- subtitle (Plain Text)
- bio (Rich Text)
- profile-image (Image)
- cover-image (Image)
- visibility (Option: Public, Private)
- xano-profile-id (Plain Text)
```

**Stack Collection (new):**
```
- name (Plain Text)
- slug (Slug)
- profile (Reference → Profile)
- type (Option: cover, upsell, featured_profiles, ...)
- description (Plain Text)
- visibility (Option: Public, Private, Shared)
- sort-order (Number)
- xano-stack-id (Plain Text)
```

### 8.2 Sync Function

```javascript
// Xano background task: sync_to_webflow
async function syncProfileToWebflow(profileId) {
  const profile = await getProfile(profileId);
  const stacks = await getProfileStacks(profileId);

  // Update Webflow profile
  await webflowAPI.updateItem('profiles', profile.webflow_id, {
    'display-name': profile.display_name,
    'subtitle': profile.subtitle,
    'bio': profile.bio,
    // ...
  });

  // Sync public stacks
  for (const stack of stacks.filter(s => s.visibility === 'public')) {
    await syncStackToWebflow(stack);
  }
}
```

---

## Phase 9: Tag Clouds & Organic Discovery

### 9.1 Tag System Architecture

**Tag Types:**
```javascript
const TAG_TYPES = {
  category: 'Content category (e.g., music, research, finance)',
  topic: 'Subject matter (e.g., machine-learning, jazz, tax-planning)',
  format: 'Content format (e.g., video, document, playlist)',
  audience: 'Target audience (e.g., students, faculty, public)',
  custom: 'User-defined tags'
};
```

**Xano Table: `tags`**
```
id              | int (auto)
name            | text (unique, lowercase, hyphenated)
display_name    | text
type            | enum (category, topic, format, audience, custom)
usage_count     | int (default 0)
created_at      | timestamp
created_by      | int (FK → users, nullable for system tags)
```

**Xano Table: `card_tags` (junction)**
```
id              | int (auto)
card_id         | int (FK → support_cards)
tag_id          | int (FK → tags)
added_at        | timestamp
added_by        | int (FK → users)
```

### 9.2 Tag Cloud Component

**HTML Structure:**
```html
<section class="tag-cloud" data-context="profile|stack|global">
  <h3 class="tag-cloud__title">Explore by Topic</h3>
  <div class="tag-cloud__container">
    <!-- Tags sized by usage_count (weight) -->
    <a href="/tags/machine-learning"
       class="tag-cloud__tag"
       data-tag="machine-learning"
       data-weight="large"
       data-count="47">
      Machine Learning
    </a>
    <a href="/tags/research"
       class="tag-cloud__tag"
       data-tag="research"
       data-weight="medium"
       data-count="23">
      Research
    </a>
    <!-- More tags... -->
  </div>
</section>
```

**CSS Styling:**
```css
.tag-cloud__tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  margin: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
  transition: all 0.2s ease;
}

.tag-cloud__tag:hover {
  background: #fff;
  color: #750009;
}

/* Weight-based sizing */
.tag-cloud__tag[data-weight="small"] { font-size: 0.75rem; }
.tag-cloud__tag[data-weight="medium"] { font-size: 1rem; }
.tag-cloud__tag[data-weight="large"] { font-size: 1.25rem; font-weight: 600; }
.tag-cloud__tag[data-weight="xlarge"] { font-size: 1.5rem; font-weight: 700; }
```

**JavaScript - Weight Calculation:**
```javascript
function calculateTagWeights(tags) {
  const maxCount = Math.max(...tags.map(t => t.usage_count));
  const minCount = Math.min(...tags.map(t => t.usage_count));
  const range = maxCount - minCount || 1;

  return tags.map(tag => ({
    ...tag,
    weight: getWeightClass((tag.usage_count - minCount) / range)
  }));
}

function getWeightClass(normalized) {
  if (normalized >= 0.75) return 'xlarge';
  if (normalized >= 0.5) return 'large';
  if (normalized >= 0.25) return 'medium';
  return 'small';
}
```

### 9.3 Tag Input Component (Card Creation)

```html
<div class="tag-input" data-max-tags="10">
  <label class="tag-input__label">Tags</label>
  <div class="tag-input__selected" id="selectedTags">
    <!-- Selected tags appear here -->
  </div>
  <input type="text"
         class="tag-input__field"
         id="tagInput"
         placeholder="Add tags (press Enter)"
         autocomplete="off">
  <div class="tag-input__suggestions" id="tagSuggestions">
    <!-- Autocomplete suggestions -->
  </div>
  <p class="tag-input__hint">Separate multiple tags with commas or Enter</p>
</div>
```

---

## Phase 10: Proximity Grouping (Related Content)

### 10.1 Proximity Algorithm

Cards are grouped by proximity based on:
1. **Tag overlap** (weighted by tag specificity)
2. **Same author** (lower weight)
3. **Same stack** (medium weight)
4. **Temporal proximity** (cards created around same time)
5. **Engagement correlation** (users who viewed X also viewed Y)

**Proximity Score Calculation:**
```javascript
function calculateProximityScore(cardA, cardB) {
  let score = 0;

  // Tag overlap (primary factor)
  const sharedTags = intersection(cardA.tags, cardB.tags);
  const tagScore = sharedTags.reduce((sum, tag) => {
    // Rare tags = higher specificity = higher score
    const specificity = 1 / Math.log(tag.usage_count + 2);
    return sum + specificity;
  }, 0);
  score += tagScore * 40; // 40% weight

  // Same author
  if (cardA.owner_id === cardB.owner_id) {
    score += 15; // 15% weight
  }

  // Same stack
  if (cardA.stack_id === cardB.stack_id) {
    score += 20; // 20% weight
  }

  // Temporal proximity (within 7 days)
  const daysDiff = Math.abs(daysBetween(cardA.created_at, cardB.created_at));
  if (daysDiff <= 7) {
    score += (7 - daysDiff) * 2; // Up to 14% weight
  }

  // Engagement correlation (from analytics)
  const correlationScore = getEngagementCorrelation(cardA.id, cardB.id);
  score += correlationScore * 11; // 11% weight

  return Math.min(score, 100); // Normalize to 0-100
}
```

### 10.2 Related Cards Component

**HTML Structure:**
```html
<section class="related-cards" data-card-id="{current_card_id}">
  <h3 class="related-cards__title">Related Content</h3>

  <div class="related-cards__grid">
    <!-- Proximity-grouped cards -->
    <article class="related-card" data-proximity-score="87">
      <img src="..." alt="" class="related-card__thumbnail">
      <div class="related-card__content">
        <h4 class="related-card__title">Related Card Title</h4>
        <div class="related-card__meta">
          <span class="related-card__tags">
            <span class="shared-tag">machine-learning</span>
          </span>
        </div>
      </div>
    </article>
    <!-- More related cards... -->
  </div>
</section>
```

### 10.3 Xano Background Task: Proximity Index

```javascript
// Xano task: update_proximity_index
// Runs: Every 6 hours or on card create/update

async function updateProximityIndex(cardId) {
  const card = await getCard(cardId);
  const candidates = await getPublicCards({ limit: 1000 });

  const proximityScores = candidates
    .filter(c => c.id !== cardId)
    .map(candidate => ({
      card_id: cardId,
      related_card_id: candidate.id,
      score: calculateProximityScore(card, candidate)
    }))
    .filter(p => p.score >= 30) // Minimum threshold
    .sort((a, b) => b.score - a.score)
    .slice(0, 20); // Top 20 related cards

  // Upsert to proximity_index table
  await upsertProximityScores(proximityScores);
}
```

**Xano Table: `proximity_index`**
```
id              | int (auto)
card_id         | int (FK → support_cards)
related_card_id | int (FK → support_cards)
score           | decimal (0-100)
factors         | json (breakdown of scoring factors)
updated_at      | timestamp
```

---

## Phase 11: JSON-LD Structured Data (SEO)

### 11.1 Schema.org Types by Card Type

| Card Type | Schema.org Type | Key Properties |
|-----------|-----------------|----------------|
| `story` | `Article` | headline, author, datePublished, image |
| `music_playlist` | `MusicPlaylist` | name, numTracks, creator |
| `youtube_video` | `VideoObject` | name, description, thumbnailUrl, uploadDate |
| `ticket_purchase` | `Event` | name, startDate, location, offers |
| `crowdfund` | `MonetaryGrant` | name, description, funder |
| `tuition` | `EducationalOccupationalProgram` | name, provider, offers |
| `document` | `DigitalDocument` | name, author, dateCreated |
| `profile` | `Person` / `ProfilePage` | name, description, image |

### 11.2 JSON-LD Generation

**Nunjucks Include (`_includes/json-ld.njk`):**
```html
{% if card.visibility == 'public' and card.seo_indexable != false %}
<script type="application/ld+json">
{{ card | generateJsonLd | safe }}
</script>
{% endif %}
```

**Eleventy Filter:**
```javascript
// .eleventy.js
eleventyConfig.addFilter('generateJsonLd', function(card) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@id": `${CONFIG.BASE_URL}/cards/${card.id}`,
    "url": `${CONFIG.BASE_URL}/cards/${card.id}`,
    "name": card.title,
    "description": card.description,
    "dateCreated": card.created_at,
    "dateModified": card.updated_at,
    "author": {
      "@type": "Person",
      "name": card.author_name,
      "url": `${CONFIG.BASE_URL}/profiles/${card.owner_id}`
    },
    "keywords": card.tags.map(t => t.display_name).join(', ')
  };

  // Type-specific schema
  const typeSchemas = {
    story: () => ({
      "@type": "Article",
      "headline": card.title,
      "articleBody": card.type_data?.content_html?.replace(/<[^>]*>/g, ''),
      "image": card.thumbnail || card.type_data?.featured_image
    }),

    youtube_video: () => ({
      "@type": "VideoObject",
      "embedUrl": card.type_data?.embed_url,
      "thumbnailUrl": `https://img.youtube.com/vi/${card.type_data?.video_id}/maxresdefault.jpg`,
      "uploadDate": card.created_at,
      "contentUrl": card.type_data?.original_url
    }),

    music_playlist: () => ({
      "@type": "MusicPlaylist",
      "numTracks": card.type_data?.track_count || 1,
      "creator": {
        "@type": "Person",
        "name": card.author_name
      }
    }),

    ticket_purchase: () => ({
      "@type": "Event",
      "startDate": card.type_data?.event_date,
      "location": {
        "@type": "Place",
        "name": card.type_data?.venue
      },
      "offers": {
        "@type": "Offer",
        "url": card.type_data?.ticket_url,
        "price": card.type_data?.price_range
      }
    }),

    document: () => ({
      "@type": "DigitalDocument",
      "encodingFormat": card.type_data?.mime_type,
      "contentSize": card.type_data?.file_size
    })
  };

  const typeSchema = typeSchemas[card.type]?.() || { "@type": "CreativeWork" };

  return JSON.stringify({ ...baseSchema, ...typeSchema }, null, 2);
});
```

### 11.3 Profile Page JSON-LD

```html
<!-- Profile structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "@id": "{{ profile.url }}",
    "name": "{{ profile.display_name }}",
    "description": "{{ profile.bio }}",
    "image": "{{ profile.profile_image }}",
    "url": "{{ profile.url }}",
    "sameAs": [
      {% for link in profile.social_links %}
      "{{ link.url }}"{% if not loop.last %},{% endif %}
      {% endfor %}
    ]
  },
  "hasPart": [
    {% for stack in profile.stacks | selectattr('visibility', 'equalto', 'public') %}
    {
      "@type": "ItemList",
      "name": "{{ stack.title }}",
      "numberOfItems": {{ stack.cards | length }},
      "itemListElement": [
        {% for card in stack.cards | slice(0, 5) %}
        {
          "@type": "ListItem",
          "position": {{ loop.index }},
          "item": {
            "@type": "CreativeWork",
            "name": "{{ card.title }}",
            "url": "{{ card.url }}"
          }
        }{% if not loop.last %},{% endif %}
        {% endfor %}
      ]
    }{% if not loop.last %},{% endif %}
    {% endfor %}
  ]
}
</script>
```

### 11.4 Tag Page JSON-LD

```html
<!-- Tag/Collection page structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Cards tagged: {{ tag.display_name }}",
  "description": "Browse all public cards tagged with {{ tag.display_name }}",
  "url": "{{ CONFIG.BASE_URL }}/tags/{{ tag.name }}",
  "numberOfItems": {{ tag.usage_count }},
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {% for card in cards | slice(0, 10) %}
      {
        "@type": "ListItem",
        "position": {{ loop.index }},
        "item": {
          "@type": "CreativeWork",
          "name": "{{ card.title }}",
          "url": "{{ card.url }}",
          "author": {
            "@type": "Person",
            "name": "{{ card.author_name }}"
          }
        }
      }{% if not loop.last %},{% endif %}
      {% endfor %}
    ]
  }
}
</script>
```

---

## Phase 12: SEO Privacy Controls (noindex/nofollow)

### 12.1 Indexing Settings

**Card-Level SEO Settings:**
```javascript
{
  // Added to card data structure
  seo_settings: {
    indexable: true,      // Default: true (allow search engines)
    followable: true,     // Default: true (follow links)
    snippet_allowed: true, // Allow search result snippets
    image_indexable: true, // Allow image indexing
    canonical_url: null   // Custom canonical URL (optional)
  }
}
```

**Privacy Presets:**
```javascript
const SEO_PRESETS = {
  // Open by default - maximum discoverability
  public_open: {
    indexable: true,
    followable: true,
    snippet_allowed: true,
    image_indexable: true
  },

  // Indexed but no link following
  public_contained: {
    indexable: true,
    followable: false,
    snippet_allowed: true,
    image_indexable: true
  },

  // Not indexed, links not followed
  unlisted: {
    indexable: false,
    followable: false,
    snippet_allowed: false,
    image_indexable: false
  },

  // Completely private (visibility: private also blocks)
  private: {
    indexable: false,
    followable: false,
    snippet_allowed: false,
    image_indexable: false
  }
};
```

### 12.2 Meta Tag Implementation

**Nunjucks Include (`_includes/seo-meta.njk`):**
```html
<!-- SEO Meta Tags -->
{% if card.visibility == 'public' %}
  {% if card.seo_settings.indexable %}
    <!-- Indexable public card -->
    <meta name="robots" content="index, {% if card.seo_settings.followable %}follow{% else %}nofollow{% endif %}{% if not card.seo_settings.snippet_allowed %}, nosnippet{% endif %}{% if not card.seo_settings.image_indexable %}, noimageindex{% endif %}">
    <link rel="canonical" href="{{ card.seo_settings.canonical_url or card.url }}">

    <!-- Open Graph -->
    <meta property="og:title" content="{{ card.title }}">
    <meta property="og:description" content="{{ card.description }}">
    <meta property="og:image" content="{{ card.thumbnail }}">
    <meta property="og:url" content="{{ card.url }}">
    <meta property="og:type" content="article">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ card.title }}">
    <meta name="twitter:description" content="{{ card.description }}">
    <meta name="twitter:image" content="{{ card.thumbnail }}">
  {% else %}
    <!-- Non-indexable public card -->
    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
    <meta name="googlebot" content="noindex, nofollow">
  {% endif %}
{% else %}
  <!-- Private/Shared card - never index -->
  <meta name="robots" content="noindex, nofollow, noarchive">
  <meta name="googlebot" content="noindex, nofollow">
{% endif %}
```

### 12.3 Robots.txt Directives

```txt
# robots.txt for card platform

User-agent: *

# Allow public profiles and cards
Allow: /profiles/
Allow: /cards/
Allow: /tags/

# Block private endpoints
Disallow: /api/
Disallow: /auth/
Disallow: /share/  # Share links should not be indexed
Disallow: /*?token=  # Token-based access

# Block utility pages
Disallow: /settings/
Disallow: /admin/

# Sitemap
Sitemap: https://example.com/sitemap.xml
```

### 12.4 Sitemap Generation

**Eleventy Config for Dynamic Sitemap:**
```javascript
// .eleventy.js
eleventyConfig.addCollection('sitemapCards', async function(collectionApi) {
  // Fetch only indexable public cards
  const response = await fetch(`${XANO_API_URL}/cards/sitemap`);
  const cards = await response.json();

  return cards.filter(card =>
    card.visibility === 'public' &&
    card.seo_settings?.indexable !== false
  );
});
```

**Sitemap Template (`src/sitemap.njk`):**
```xml
---
permalink: /sitemap.xml
eleventyExcludeFromCollections: true
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>{{ CONFIG.BASE_URL }}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Public indexable cards -->
  {% for card in collections.sitemapCards %}
  <url>
    <loc>{{ CONFIG.BASE_URL }}/cards/{{ card.id }}</loc>
    <lastmod>{{ card.updated_at | dateISO }}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  {% endfor %}

  <!-- Tag pages -->
  {% for tag in collections.tags %}
  <url>
    <loc>{{ CONFIG.BASE_URL }}/tags/{{ tag.name }}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  {% endfor %}

  <!-- Public profiles -->
  {% for profile in collections.publicProfiles %}
  <url>
    <loc>{{ CONFIG.BASE_URL }}/profiles/{{ profile.id }}</loc>
    <lastmod>{{ profile.updated_at | dateISO }}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  {% endfor %}
</urlset>
```

### 12.5 SEO Settings UI

**Share Modal Extension:**
```html
<div class="share-modal__section">
  <h4>Search Engine Visibility</h4>
  <p class="share-modal__hint">Control how search engines index this card</p>

  <div class="seo-options">
    <label class="seo-option">
      <input type="radio" name="seoPreset" value="public_open" checked>
      <div class="seo-option__content">
        <strong>Open (Recommended)</strong>
        <span>Fully indexed, maximum discoverability</span>
      </div>
    </label>

    <label class="seo-option">
      <input type="radio" name="seoPreset" value="public_contained">
      <div class="seo-option__content">
        <strong>Contained</strong>
        <span>Indexed but links not followed</span>
      </div>
    </label>

    <label class="seo-option">
      <input type="radio" name="seoPreset" value="unlisted">
      <div class="seo-option__content">
        <strong>Unlisted</strong>
        <span>Not indexed, accessible via direct link only</span>
      </div>
    </label>
  </div>
</div>
```

---

## Phase 13: Open Publishing Defaults

### 13.1 Default Settings Philosophy

**Principle: Creation and publishing should be frictionless by default.**

```javascript
const DEFAULT_CARD_SETTINGS = {
  // Visibility - Public by default for maximum reach
  visibility: 'public',

  // SEO - Fully indexable by default
  seo_settings: {
    indexable: true,
    followable: true,
    snippet_allowed: true,
    image_indexable: true
  },

  // Permissions - Owner can do everything, public can view
  permissions: {
    default_public_access: 'view', // Anyone can view public cards
    allow_comments: true,
    allow_reactions: true
  },

  // Publishing - No approval required
  publish_status: 'published', // Not 'draft' or 'pending_review'
  requires_approval: false,

  // Content restrictions - None by default
  content_restrictions: {
    require_tags: false,      // Tags optional
    require_description: false,
    require_thumbnail: false,
    min_content_length: 0
  }
};
```

### 13.2 Card Creation Flow

```javascript
// No barriers to publishing
async function createCard(cardData) {
  // Apply open defaults
  const card = {
    ...DEFAULT_CARD_SETTINGS,
    ...cardData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    publish_status: 'published' // Immediately published
  };

  // No approval queue - direct publish
  const result = await xanoAPI.post('/cards', card);

  // Immediately queue for SEO indexing
  if (card.visibility === 'public' && card.seo_settings.indexable) {
    await queueForIndexing(result.id);
  }

  // Update tag cloud counts
  await updateTagCounts(card.tags);

  // Calculate proximity index
  await queueProximityUpdate(result.id);

  return result;
}
```

### 13.3 Privacy Upgrade Path

Users can restrict access at any time, but the default is open:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CARD VISIBILITY FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CREATE CARD ──────► PUBLIC (default)                          │
│       │                    │                                    │
│       │                    ▼                                    │
│       │              ┌───────────┐                              │
│       │              │ INDEXED   │ ◄── JSON-LD, Sitemap        │
│       │              │ Tag Cloud │                              │
│       │              │ Related   │                              │
│       │              └───────────┘                              │
│       │                    │                                    │
│       │         User changes visibility                         │
│       │                    ▼                                    │
│       │              ┌───────────┐                              │
│       └─────────────►│ UNLISTED  │ ◄── noindex, direct link    │
│                      └───────────┘                              │
│                            │                                    │
│                 User restricts further                          │
│                            ▼                                    │
│                      ┌───────────┐                              │
│                      │ PRIVATE   │ ◄── Auth required           │
│                      └───────────┘                              │
│                            │                                    │
│                 User adds permissions                           │
│                            ▼                                    │
│                      ┌───────────┐                              │
│                      │ SHARED    │ ◄── REBAC permissions       │
│                      └───────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 14: File Structure Summary

```
src/
├── _data/
│   ├── profiles.json          # Sample profile data
│   ├── stacks.json            # Sample stack configurations
│   └── tags.json              # Tag definitions and weights
├── _includes/
│   ├── profile-cover.njk      # Cover card component
│   ├── card-stack.njk         # Stack container component
│   ├── stack-card.njk         # Individual card component
│   ├── share-modal.njk        # Sharing modal
│   ├── read-mode.njk          # Read mode overlay
│   ├── tag-cloud.njk          # Tag cloud component
│   ├── related-cards.njk      # Proximity-based related cards
│   ├── json-ld.njk            # JSON-LD structured data
│   └── seo-meta.njk           # SEO meta tags (robots, OG, Twitter)
├── _layouts/
│   ├── profile.njk            # Profile page layout
│   └── tag.njk                # Tag/collection page layout
├── css/
│   ├── main.css               # (existing)
│   ├── profile.css            # Profile page styles
│   ├── overlapping-slider.css # Slider component styles
│   ├── share-modal.css        # Modal styles
│   └── tag-cloud.css          # Tag cloud styles
├── js/
│   ├── main.js                # (existing)
│   ├── profile.js             # Profile page logic
│   ├── overlapping-slider.js  # Slider initialization
│   ├── permissions.js         # REBAC permission handling
│   ├── share.js               # Sharing functionality
│   ├── tag-input.js           # Tag autocomplete component
│   └── related-cards.js       # Related card loading
├── profile.njk                # Profile page entry point
├── tags.njk                   # Tag listing page
├── tag.njk                    # Individual tag page template
├── sitemap.njk                # Dynamic sitemap
└── robots.txt                 # Robots directives
```

---

## Phase 16: Implementation Order

### Sprint 1: Foundation
1. [ ] Create profile page template structure
2. [ ] Implement cover card component with headline
3. [ ] Add tags and groups display to cover card
4. [ ] Set up basic CSS (BEM methodology)
5. [ ] Create Xano `profiles` and `stacks` tables
6. [ ] Implement open-by-default card creation settings

### Sprint 2: Slider Cards
7. [ ] Integrate GSAP + Draggable
8. [ ] Build overlapping slider component
9. [ ] Implement card stack containers
10. [ ] Add stack-level CRUD operations

### Sprint 3: Permission Roles & REBAC
11. [ ] Create permission tables in Xano (`card_permissions`, `invitations`)
12. [ ] Implement 7 permission roles (Super Admin → View Only)
13. [ ] Build permission check middleware with role capabilities
14. [ ] Implement share modal UI with role selector
15. [ ] Add share link generation with role-based access

### Sprint 4: Invitation Flow
16. [ ] Create `invitations` table in Xano
17. [ ] Build invitation API endpoints (create, accept, decline, revoke)
18. [ ] Implement invitation email templates
19. [ ] Create invitation landing page UI
20. [ ] Add pending invitations management
21. [ ] Implement invitation expiration and reminders
22. [ ] Add resend invitation functionality

### Sprint 5: Tag System & Discovery
23. [ ] Create `tags`, `card_tags` tables in Xano
24. [ ] Build tag input component with autocomplete
25. [ ] Implement tag cloud component
26. [ ] Create tag listing and individual tag pages
27. [ ] Add tag-based filtering to card search

### Sprint 6: Proximity & Related Content
28. [ ] Create `proximity_index` table in Xano
29. [ ] Implement proximity scoring algorithm
30. [ ] Build related cards component
31. [ ] Create background task for proximity updates
32. [ ] Add engagement correlation tracking

### Sprint 7: SEO & JSON-LD
33. [ ] Implement JSON-LD generation for all card types
34. [ ] Add SEO meta tags component
35. [ ] Create robots.txt directives
36. [ ] Build dynamic sitemap generator
37. [ ] Add SEO privacy controls UI

### Sprint 8: Engagement
38. [ ] Add view/read mode toggle
39. [ ] Implement inline editing
40. [ ] Add commenting system (optional)
41. [ ] Build download functionality

### Sprint 9: Integration & Polish
42. [ ] Connect to existing form → Xano pipeline
43. [ ] Add Webflow CMS sync
44. [ ] Implement access groups (class, team, peer, instructor)
45. [ ] Performance optimization (lazy loading, caching)
46. [ ] Testing & refinement

---

## Example Use Cases

### Playlist Stack (Public, Discoverable)
- User creates "Study Music" stack
- Adds 10 music cards (Spotify/YouTube)
- Tags: `study`, `focus`, `lo-fi`, `instrumental`
- **SEO**: Fully indexed, appears in tag clouds
- **JSON-LD**: MusicPlaylist schema for rich search results
- Shares with `group:class_101` as viewers
- Cards appear in overlapping slider on profile
- Related cards show other study playlists via proximity

### Research Documents Stack (Shared, Unlisted)
- Faculty creates "Thesis Resources" stack
- Uploads PDF documents as cards
- Tags: `thesis`, `methodology`, `literature-review`
- **SEO**: Unlisted (noindex) - accessible via direct link
- Shares with individual students (commenters)
- Students can view, add comments, download
- Tags help organize but don't appear in public tag cloud

### Financial Documents (Private)
- Parent creates "College Fund" stack
- Adds financial document cards
- **SEO**: Private, never indexed
- Shares with family members only
- Uses invitation links with expiration
- No public visibility whatsoever

### Instructor Review Stack (Shared)
- Instructor creates "Assignment Review" stack
- Students submit cards to stack
- Tags: `course:HR-101`, `assignment`, `fall-2025`
- Instructor has edit access to add feedback
- Student has view-only on feedback

### Public Article (Maximum Discoverability)
- Student publishes research summary
- Tags: `machine-learning`, `healthcare`, `research`
- **SEO**: Public, fully indexed
- **JSON-LD**: Article schema with author, date, keywords
- Appears in:
  - Tag cloud (weighted by engagement)
  - Related cards on similar articles
  - Google search results with rich snippets
  - Sitemap for crawler discovery

### Unlisted Event Promotion
- Club creates event card for members only
- **Visibility**: Public (no auth required)
- **SEO**: `noindex, nofollow` - won't appear in search
- Share via direct link to target audience
- Still gets JSON-LD for social media previews

---

## Technical Notes

### Performance Considerations
- Lazy load cards in large stacks (>20 cards)
- Use Intersection Observer for slider visibility
- Cache permission checks (5-minute TTL)
- Optimize Webflow sync with batching
- Tag cloud computed server-side, cached 1 hour
- Proximity index updated async (background task)
- JSON-LD generated at build time for static cards

### Security
- All permission checks server-side (Xano middleware)
- Share links use cryptographically secure tokens
- Rate limit permission changes
- Audit log for sensitive actions
- SEO settings validated server-side (prevent indexing private content)

### SEO Best Practices
- JSON-LD validated against Schema.org
- Canonical URLs prevent duplicate content
- Sitemap updated on card publish (max 50,000 URLs)
- robots.txt blocks authenticated/private routes
- Open Graph + Twitter Cards for social sharing
- Structured data testing via Google Rich Results Test

### Tag System
- Tags normalized to lowercase-hyphenated format
- Maximum 10 tags per card
- Tag usage counts updated on card create/delete
- Tag suggestions based on user's previous tags + popular tags
- Orphan tags (usage_count = 0) cleaned up monthly

### Accessibility
- Keyboard navigation for slider (Arrow keys)
- ARIA labels for all interactive elements
- Focus management in modals
- Screen reader announcements for state changes
- Tag cloud items have sufficient color contrast
- Related cards section has skip link

---

## Summary: Feature Matrix

| Feature | Default | User Can Override |
|---------|---------|-------------------|
| **Card Creation** | Unrestricted | N/A |
| **Publishing** | Immediate (no approval) | N/A |
| **Visibility** | Public | Private, Shared, Unlisted |
| **SEO Indexing** | Indexed | noindex, nofollow |
| **JSON-LD** | Generated for public cards | Disable via unlisted |
| **Tag Cloud** | Public cards included | Unlisted excludes |
| **Sitemap** | Included | Excluded if noindex |
| **Proximity/Related** | Calculated for all | N/A |
| **Sharing** | Owner can share | Disable in settings |

### Permission Roles

| Role | Capabilities |
|------|--------------|
| **Super Admin** | All + ownership transfer, manage permissions |
| **Collaborator** | View, Comment, Edit, Upload, Download |
| **Commenter** | View, Comment |
| **Content Provider** | View, Upload, Comment (no edit existing) |
| **View Only** | View only |
| **Uploader** | View, Upload |
| **Sharer** | View, Share |

### Invitation Flow

| Status | Description |
|--------|-------------|
| `pending` | Invitation sent, awaiting response |
| `accepted` | User accepted, permissions granted |
| `declined` | User declined invitation |
| `expired` | 7-day expiration passed |
| `revoked` | Inviter canceled invitation |

### Key Deliverables

1. **Profile Page** - Cover card with headline, tags, groups + editorial slider stacks
2. **Overlapping Slider** - GSAP-powered card carousels
3. **Tag Cloud** - Weighted discovery interface
4. **Proximity Grouping** - Related content suggestions
5. **JSON-LD** - Schema.org structured data for SEO
6. **SEO Controls** - noindex/nofollow privacy settings
7. **REBAC Permissions** - 7 granular permission roles
8. **Invitation Flow** - Email-based collaboration invites
9. **Open Publishing** - No barriers to content creation

### Data Tables (Xano)

| Table | Purpose |
|-------|---------|
| `profiles` | User profile data |
| `stacks` | Card stack containers |
| `stack_cards` | Stack ↔ Card junction |
| `tags` | Tag definitions |
| `card_tags` | Card ↔ Tag junction |
| `proximity_index` | Related card scores |
| `card_permissions` | REBAC permissions with roles |
| `invitations` | Pending/accepted invitations |
| `share_links` | Shareable link tokens |
| `access_groups` | Team/class groups |
| `group_members` | Group membership |

### API Endpoints Summary

| Category | Endpoints |
|----------|-----------|
| Profiles | GET/PUT /profiles/{id} |
| Stacks | CRUD + reorder + cards |
| Tags | List, cloud, suggest, cards-by-tag |
| Proximity | Related cards, refresh |
| Permissions | Check, grant, revoke (with roles) |
| Invitations | Create, accept, decline, revoke, resend |
| Share Links | Create, validate, revoke |
| SEO | Sitemap, update settings |
