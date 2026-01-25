# Story Form Updates

Enhancements to the card creation form for profile pages with permission roles, invitation flow, tags, and SEO settings.

---

## 1. Cover Card Fields

### New Fields to Add

```javascript
// Cover card data structure
{
  // Existing fields
  title: "Card Title",
  description: "Description...",
  card_type: "story",

  // NEW: Headline (prominent display text)
  headline: "Researching AI Ethics in Healthcare",

  // NEW: Tags for discovery
  tags: ["ai-ethics", "healthcare", "research"],

  // NEW: Group affiliations
  groups: [
    { group_id: 1, name: "HR Cohort 2025", type: "class" },
    { group_id: 2, name: "Ethics Committee", type: "team" }
  ],

  // NEW: SEO settings
  seo_settings: {
    indexable: true,       // Allow search engines (default: true)
    followable: true,      // Follow links (default: true)
    snippet_allowed: true  // Allow snippets (default: true)
  },

  // NEW: Initial permissions
  initial_permissions: {
    visibility: "public",  // public | private | shared
    default_role: "view_only"
  }
}
```

### Form HTML - Headline Field

```html
<!-- Add after title field -->
<div class="scf-field-group">
  <label class="scf-label" for="scfHeadline">
    Headline <span class="optional">(optional)</span>
  </label>
  <input type="text"
         id="scfHeadline"
         class="scf-input"
         placeholder="A brief statement or tagline for your card"
         maxlength="150">
  <p class="scf-field-hint">Displayed prominently on your profile cover</p>
</div>
```

---

## 2. Tags Input Component

### HTML Structure

```html
<div class="scf-field-group">
  <label class="scf-label">Tags <span class="optional">(up to 10)</span></label>

  <!-- Selected tags display -->
  <ul id="scfTagList" class="scf-tag-list">
    <!-- Tags added dynamically -->
  </ul>

  <!-- Tag input with autocomplete -->
  <div class="scf-tag-input-wrap">
    <input type="text"
           id="scfTagInput"
           class="scf-input"
           placeholder="Add tags (press Enter or comma to add)"
           autocomplete="off">
    <div id="scfTagSuggestions" class="scf-tag-suggestions">
      <!-- Popular/suggested tags -->
      <div class="scf-tag-suggestion" data-value="research">Research</div>
      <div class="scf-tag-suggestion" data-value="tutorial">Tutorial</div>
      <div class="scf-tag-suggestion" data-value="case-study">Case Study</div>
      <div class="scf-tag-suggestion" data-value="analysis">Analysis</div>
      <div class="scf-tag-suggestion" data-value="review">Review</div>
    </div>
  </div>
  <p class="scf-field-hint">Tags help others discover your content</p>
</div>
```

### CSS Styles

```css
/* Tag list */
.scf-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0 0 0.5rem 0;
}

.scf-tag-list li {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #000;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 500;
}

.scf-tag-remove {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  opacity: 0.8;
  padding: 0;
}

.scf-tag-remove:hover {
  opacity: 1;
}

/* Tag suggestions dropdown */
.scf-tag-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 0.0625rem solid #ccc;
  box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.15);
  max-height: 12.5rem;
  overflow-y: auto;
  z-index: 10;
  display: none;
}

.scf-tag-suggestions.visible {
  display: block;
}

.scf-tag-suggestion {
  padding: 0.625rem 0.875rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #000;
}

.scf-tag-suggestion:hover {
  background: #f5f5f5;
}

/* Field hint */
.scf-field-hint {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
}
```

### JavaScript

```javascript
// Tag management state
const tagState = {
  tags: [],
  maxTags: 10
};

// Initialize tag input
function setupTagInput() {
  const input = document.getElementById('scfTagInput');
  const suggestions = document.getElementById('scfTagSuggestions');
  const tagList = document.getElementById('scfTagList');

  if (!input || !suggestions) return;

  // Show suggestions on focus
  input.addEventListener('focus', () => {
    if (tagState.tags.length < tagState.maxTags) {
      suggestions.classList.add('visible');
    }
  });

  // Hide suggestions on blur (with delay for click)
  input.addEventListener('blur', () => {
    setTimeout(() => suggestions.classList.remove('visible'), 200);
  });

  // Filter suggestions as user types
  input.addEventListener('input', () => {
    const val = input.value.toLowerCase().trim();
    suggestions.querySelectorAll('.scf-tag-suggestion').forEach(s => {
      const match = s.textContent.toLowerCase().includes(val);
      const notAdded = !tagState.tags.includes(s.dataset.value);
      s.style.display = (match && notAdded) ? 'block' : 'none';
    });
    suggestions.classList.add('visible');
  });

  // Add tag on Enter or comma
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.value.trim().replace(/,/g, '');
      if (val) {
        addTag(normalizeTag(val), val);
        input.value = '';
        suggestions.classList.remove('visible');
      }
    }
  });

  // Click to add suggestion
  suggestions.querySelectorAll('.scf-tag-suggestion').forEach(s => {
    s.addEventListener('click', () => {
      addTag(s.dataset.value, s.textContent);
      input.value = '';
      suggestions.classList.remove('visible');
    });
  });
}

// Normalize tag (lowercase, hyphenated)
function normalizeTag(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

// Add tag to list
function addTag(value, label) {
  if (tagState.tags.length >= tagState.maxTags) {
    showMessage('error', `Maximum ${tagState.maxTags} tags allowed`);
    return;
  }
  if (tagState.tags.includes(value)) return;

  tagState.tags.push(value);
  renderTags();
}

// Remove tag
function removeTag(value) {
  tagState.tags = tagState.tags.filter(t => t !== value);
  renderTags();
}

// Render tag list
function renderTags() {
  const list = document.getElementById('scfTagList');
  if (!list) return;

  list.innerHTML = tagState.tags.map(tag => `
    <li>
      <span>${tag}</span>
      <button type="button" class="scf-tag-remove" data-value="${tag}">×</button>
    </li>
  `).join('');

  list.querySelectorAll('.scf-tag-remove').forEach(btn => {
    btn.onclick = () => removeTag(btn.dataset.value);
  });
}

// Get tags for submission
function getTags() {
  return tagState.tags;
}
```

---

## 3. Group Selection Component

### HTML Structure

```html
<div class="scf-field-group">
  <label class="scf-label">Groups <span class="optional">(optional)</span></label>

  <!-- Selected groups -->
  <ul id="scfGroupList" class="scf-group-list">
    <!-- Groups added dynamically -->
  </ul>

  <!-- Group selector -->
  <div class="scf-group-selector">
    <select id="scfGroupSelect" class="scf-select">
      <option value="">Select a group to add...</option>
      <!-- Populated from user's groups -->
    </select>
  </div>
  <p class="scf-field-hint">Associate this card with your classes, teams, or groups</p>
</div>
```

### CSS Styles

```css
.scf-group-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0 0 0.75rem 0;
}

.scf-group-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 0.85rem;
}

.scf-group-item__type {
  font-size: 0.65rem;
  padding: 0.125rem 0.375rem;
  background: rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  font-weight: 600;
}

.scf-group-item__name {
  font-weight: 500;
}

.scf-group-remove {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  opacity: 0.7;
  padding: 0;
  font-size: 1rem;
}

.scf-group-remove:hover {
  opacity: 1;
}
```

### JavaScript

```javascript
// Group state
const groupState = {
  selectedGroups: [],
  availableGroups: [] // Fetched from API
};

// Fetch user's groups
async function fetchUserGroups() {
  try {
    const response = await fetch(`${CONFIG.API_URL}/groups/mine`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    groupState.availableGroups = await response.json();
    populateGroupSelect();
  } catch (e) {
    console.error('Failed to fetch groups:', e);
  }
}

// Populate group dropdown
function populateGroupSelect() {
  const select = document.getElementById('scfGroupSelect');
  if (!select) return;

  select.innerHTML = '<option value="">Select a group to add...</option>';

  groupState.availableGroups
    .filter(g => !groupState.selectedGroups.find(s => s.id === g.id))
    .forEach(group => {
      const option = document.createElement('option');
      option.value = group.id;
      option.textContent = `[${group.type}] ${group.name}`;
      option.dataset.type = group.type;
      option.dataset.name = group.name;
      select.appendChild(option);
    });
}

// Setup group selector
function setupGroupSelector() {
  const select = document.getElementById('scfGroupSelect');
  if (!select) return;

  select.addEventListener('change', () => {
    if (!select.value) return;

    const option = select.options[select.selectedIndex];
    addGroup({
      id: parseInt(select.value),
      name: option.dataset.name,
      type: option.dataset.type
    });

    select.value = '';
  });

  fetchUserGroups();
}

// Add group
function addGroup(group) {
  if (groupState.selectedGroups.find(g => g.id === group.id)) return;
  groupState.selectedGroups.push(group);
  renderGroups();
  populateGroupSelect();
}

// Remove group
function removeGroup(groupId) {
  groupState.selectedGroups = groupState.selectedGroups.filter(g => g.id !== groupId);
  renderGroups();
  populateGroupSelect();
}

// Render groups
function renderGroups() {
  const list = document.getElementById('scfGroupList');
  if (!list) return;

  list.innerHTML = groupState.selectedGroups.map(group => `
    <li class="scf-group-item">
      <span class="scf-group-item__type">${group.type}</span>
      <span class="scf-group-item__name">${group.name}</span>
      <button type="button" class="scf-group-remove" data-id="${group.id}">×</button>
    </li>
  `).join('');

  list.querySelectorAll('.scf-group-remove').forEach(btn => {
    btn.onclick = () => removeGroup(parseInt(btn.dataset.id));
  });
}

// Get groups for submission
function getGroups() {
  return groupState.selectedGroups.map(g => ({ group_id: g.id, type: g.type }));
}
```

---

## 4. Permission Roles

### Role Definitions

```javascript
const PERMISSION_ROLES = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full control including ownership transfer',
    capabilities: ['view', 'comment', 'edit', 'upload', 'download', 'share', 'delete', 'manage_permissions', 'invite', 'revoke', 'transfer_ownership']
  },
  collaborator: {
    label: 'Collaborator',
    description: 'Can edit content and add comments',
    capabilities: ['view', 'comment', 'edit', 'upload', 'download']
  },
  commenter: {
    label: 'Commenter',
    description: 'Can view and add comments only',
    capabilities: ['view', 'comment']
  },
  content_provider: {
    label: 'Content Provider',
    description: 'Can upload and add content but not edit existing',
    capabilities: ['view', 'upload', 'comment']
  },
  view_only: {
    label: 'View Only',
    description: 'Can only view content',
    capabilities: ['view']
  },
  uploader: {
    label: 'Uploader',
    description: 'Can upload files/cards',
    capabilities: ['view', 'upload']
  },
  sharer: {
    label: 'Sharer',
    description: 'Can view and share with others',
    capabilities: ['view', 'share']
  }
};
```

### Initial Sharing Step (Add to Form)

```html
<!-- Step: Sharing & Permissions (add as new step or in Review step) -->
<div class="scf-step-content" data-step-content="sharing">
  <h2 class="scf-step-title">Sharing & Permissions</h2>
  <p class="scf-step-subtitle">Control who can access this card</p>

  <!-- Visibility -->
  <div class="scf-field-group">
    <label class="scf-label">Visibility</label>
    <div class="scf-visibility-options">
      <label class="scf-visibility-option active" onclick="setVisibility('public', this)">
        <input type="radio" name="visibility" value="public" checked>
        <div class="scf-visibility-label">Public</div>
        <div class="scf-visibility-desc">Anyone can view</div>
      </label>
      <label class="scf-visibility-option" onclick="setVisibility('unlisted', this)">
        <input type="radio" name="visibility" value="unlisted">
        <div class="scf-visibility-label">Unlisted</div>
        <div class="scf-visibility-desc">Only with direct link</div>
      </label>
      <label class="scf-visibility-option" onclick="setVisibility('private', this)">
        <input type="radio" name="visibility" value="private">
        <div class="scf-visibility-label">Private</div>
        <div class="scf-visibility-desc">Only you and collaborators</div>
      </label>
    </div>
  </div>

  <!-- Initial collaborators -->
  <div class="scf-field-group" id="scfCollaboratorsSection">
    <label class="scf-label">Invite Collaborators <span class="optional">(optional)</span></label>

    <div class="scf-collaborator-add">
      <input type="email"
             id="scfCollaboratorEmail"
             class="scf-input"
             placeholder="Enter email address"
             style="flex: 1;">
      <select id="scfCollaboratorRole" class="scf-select" style="width: auto;">
        <option value="view_only">View Only</option>
        <option value="commenter">Commenter</option>
        <option value="content_provider">Content Provider</option>
        <option value="collaborator">Collaborator</option>
      </select>
      <button type="button" class="scf-upload-btn" onclick="addCollaborator()">Add</button>
    </div>

    <ul id="scfCollaboratorList" class="scf-collaborator-list">
      <!-- Added collaborators -->
    </ul>
  </div>

  <!-- SEO Settings (for public/unlisted) -->
  <div class="scf-field-group" id="scfSeoSection">
    <label class="scf-label">Search Engine Visibility</label>
    <div class="scf-checkbox-wrap">
      <input type="checkbox" id="scfSeoIndexable" checked>
      <label for="scfSeoIndexable">Allow search engines to index this card</label>
    </div>
    <p class="scf-field-hint">Uncheck to prevent this card from appearing in search results</p>
  </div>
</div>
```

### CSS for Collaborators

```css
.scf-collaborator-add {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.scf-collaborator-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.scf-collaborator-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
}

.scf-collaborator-item__email {
  flex: 1;
  font-size: 0.9rem;
}

.scf-collaborator-item__role {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
}

.scf-collaborator-remove {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  opacity: 0.7;
  font-size: 1.25rem;
}

.scf-collaborator-remove:hover {
  opacity: 1;
  color: #ff6b6b;
}
```

### JavaScript for Collaborators

```javascript
// Collaborator state
const collaboratorState = {
  collaborators: []
};

// Add collaborator
function addCollaborator() {
  const emailInput = document.getElementById('scfCollaboratorEmail');
  const roleSelect = document.getElementById('scfCollaboratorRole');

  const email = emailInput.value.trim();
  const role = roleSelect.value;

  if (!email || !isValidEmail(email)) {
    showMessage('error', 'Please enter a valid email address');
    return;
  }

  if (collaboratorState.collaborators.find(c => c.email === email)) {
    showMessage('error', 'This email has already been added');
    return;
  }

  collaboratorState.collaborators.push({
    email,
    role,
    role_label: PERMISSION_ROLES[role].label
  });

  emailInput.value = '';
  renderCollaborators();
}

// Remove collaborator
function removeCollaborator(email) {
  collaboratorState.collaborators = collaboratorState.collaborators.filter(c => c.email !== email);
  renderCollaborators();
}

// Render collaborators
function renderCollaborators() {
  const list = document.getElementById('scfCollaboratorList');
  if (!list) return;

  list.innerHTML = collaboratorState.collaborators.map(c => `
    <li class="scf-collaborator-item">
      <span class="scf-collaborator-item__email">${c.email}</span>
      <span class="scf-collaborator-item__role">${c.role_label}</span>
      <button type="button" class="scf-collaborator-remove" data-email="${c.email}">×</button>
    </li>
  `).join('');

  list.querySelectorAll('.scf-collaborator-remove').forEach(btn => {
    btn.onclick = () => removeCollaborator(btn.dataset.email);
  });
}

// Email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Get collaborators for submission
function getCollaborators() {
  return collaboratorState.collaborators;
}
```

---

## 5. SEO Settings

### HTML (in Review/Submit step)

```html
<div class="scf-field-group" id="scfSeoSettings">
  <label class="scf-label">Search Visibility</label>

  <div class="scf-seo-options">
    <label class="scf-seo-option active" data-preset="open">
      <input type="radio" name="seoPreset" value="open" checked>
      <div class="scf-seo-option__content">
        <strong>Open</strong>
        <span>Fully indexed, maximum discoverability</span>
      </div>
    </label>

    <label class="scf-seo-option" data-preset="unlisted">
      <input type="radio" name="seoPreset" value="unlisted">
      <div class="scf-seo-option__content">
        <strong>Unlisted</strong>
        <span>Not indexed, accessible via link only</span>
      </div>
    </label>
  </div>
</div>
```

### CSS

```css
.scf-seo-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scf-seo-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.scf-seo-option:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

.scf-seo-option.active {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.scf-seo-option input {
  margin-top: 0.25rem;
}

.scf-seo-option__content strong {
  display: block;
  margin-bottom: 0.25rem;
}

.scf-seo-option__content span {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}
```

---

## 6. Updated Payload Structure

### Submit Function Updates

```javascript
function buildPayload() {
  return {
    // Existing fields
    card_title: getVal('scfTitle'),
    description: getVal('scfDescription'),
    card_type: state.type,
    type_specific_data: buildTypeData(),
    category: state.categoryTags.map(t => t.value),
    card_images: state.imageData?.url ? [state.imageData.url] : null,
    author_photo: state.authorPhoto || null,

    // NEW: Headline
    headline: getVal('scfHeadline') || null,

    // NEW: Tags (array of tag strings)
    tags: getTags(),

    // NEW: Groups (array of group objects)
    groups: getGroups(),

    // NEW: Visibility with SEO
    visibility: getVal('scfVisibility') || 'public',
    seo_settings: {
      indexable: document.getElementById('scfSeoIndexable')?.checked !== false,
      followable: true,
      snippet_allowed: true
    },

    // NEW: Initial collaborators (will trigger invitations)
    initial_collaborators: getCollaborators(),

    // Metadata
    _origin: window.location.origin,
    _timestamp: Date.now()
  };
}
```

---

## 7. Xano API Updates

### Card Creation Endpoint Changes

```javascript
// POST /api:pIN2vLYu/support-cards
// Updated request body:

{
  // Existing fields...

  // New fields
  "headline": "Card headline text",
  "tags": ["tag1", "tag2", "tag3"],
  "groups": [
    { "group_id": 1, "type": "class" }
  ],
  "seo_settings": {
    "indexable": true,
    "followable": true
  },
  "initial_collaborators": [
    { "email": "user@example.com", "role": "collaborator" }
  ]
}

// Backend should:
// 1. Create/link tags in card_tags table
// 2. Link groups in card_groups table
// 3. Create invitations for initial_collaborators
// 4. Send invitation emails
```

### New Tables Required

```
card_groups (junction)
├── id (int, auto)
├── card_id (int, FK → support_cards)
├── group_id (int, FK → access_groups)
├── added_at (timestamp)
└── added_by (int, FK → users)

invitations
├── id (int, auto)
├── card_id (int, FK → support_cards)
├── inviter_id (int, FK → users)
├── invitee_email (text)
├── role (enum: super_admin, collaborator, commenter, content_provider, view_only, uploader, sharer)
├── invitation_token (text, unique)
├── message (text, nullable)
├── status (enum: pending, accepted, declined, expired, revoked)
├── created_at (timestamp)
├── expires_at (timestamp)
└── accepted_at (timestamp, nullable)
```

---

## 8. Integration Checklist

- [ ] Add headline field to form
- [ ] Implement tag input component
- [ ] Implement group selector component
- [ ] Add collaborator invitation section
- [ ] Add SEO visibility options
- [ ] Update form state management
- [ ] Update payload builder
- [ ] Create Xano tables (card_groups, invitations)
- [ ] Update Xano card creation endpoint
- [ ] Implement invitation email sending
- [ ] Test end-to-end flow
