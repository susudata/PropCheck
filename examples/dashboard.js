/**
 * PropCheck Dashboard - Interactive Features
 */

let properties = [];
let issues = [];
let itemToDelete = null;
let deleteCallback = null;
let currentPropertyId = null;

// Skrypt jest ładowany na końcu body, więc DOM jest już gotowy
initAddPropertyModal();
initAddIssueModal();
initPropertyIssuesModal();
initDeleteModal();
loadProperties();
loadIssues();

function initAddIssueModal() {
    const modal = document.getElementById('addIssueModal');
    const form = document.getElementById('addIssueForm');
    const closeBtn = document.getElementById('closeIssueModal');
    const cancelBtn = document.getElementById('cancelAddIssue');
    const openBtn = document.getElementById('addIssueBtn');
    const photoPlaceholder = document.getElementById('photoUploadPlaceholder');
    
    let currentPropertyId = null;
    
    window.openAddIssueModal = function(propertyId) {
        currentPropertyId = propertyId;
        
        const propertyGroup = document.getElementById('issuePropertyGroup');
        const propertySelect = document.getElementById('issueProperty');
        
        if (propertyId) {
            propertyGroup.style.display = 'none';
        } else {
            propertyGroup.style.display = 'block';
            propertySelect.innerHTML = '<option value="">Wybierz nieruchomość...</option>';
            properties.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = p.name;
                propertySelect.appendChild(option);
            });
        }
        
        modal.classList.add('active');
        document.getElementById('issueName').focus();
    };
    
    function closeModal() {
        modal.classList.remove('active');
        form.reset();
        currentPropertyId = null;
    }
    
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.openAddIssueModal(null);
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    if (photoPlaceholder) {
        photoPlaceholder.addEventListener('click', () => {
            // Placeholder - funkcja dodawana później
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('issueName').value.trim();
        const location = document.getElementById('issueLocation').value.trim();
        const description = document.getElementById('issueDescription').value.trim();
        const propertyIdToUse = currentPropertyId || document.getElementById('issueProperty').value;
        const isCritical = document.getElementById('issueCritical').checked;
        
        if (name && location && propertyIdToUse) {
            addIssue(propertyIdToUse, name, location, description, isCritical);
            closeModal();
        } else if (!propertyIdToUse) {
            document.getElementById('issueProperty').focus();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function initPropertyIssuesModal() {
    const modal = document.getElementById('propertyIssuesModal');
    const closeBtn = document.getElementById('closePropertyIssuesModal');
    const closeActionBtn = document.getElementById('closePropertyIssues');
    const addIssueBtn = document.getElementById('addIssueFromPropertyBtn');
    const title = document.getElementById('propertyIssuesTitle');
    const listContainer = document.getElementById('propertyIssuesList');
    const emptyState = document.getElementById('propertyIssuesEmpty');
    
    let currentPropertyId = null;
    
    window.openPropertyIssuesModal = function(propertyId) {
        currentPropertyId = propertyId;
        const property = properties.find(p => p.id === propertyId);
        
        if (!property) {
            return;
        }
        
        title.textContent = `Usterki: ${property.name}`;
        window.renderPropertyIssues(propertyId);
        
        modal.classList.add('active');
    };
    
    window.renderPropertyIssues = function(propertyId) {
        const propertyIssues = issues.filter(i => parseInt(i.propertyId) === propertyId);
        
        if (propertyIssues.length === 0) {
            listContainer.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }
        
        listContainer.style.display = 'flex';
        emptyState.style.display = 'none';
        
        const existingItems = listContainer.querySelectorAll('.issue-item');
        existingItems.forEach(item => item.remove());
        
        const sortedIssues = [...propertyIssues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        sortedIssues.forEach(issue => {
            const item = document.createElement('div');
            item.className = `issue-item issue-${issue.status}`;
            
            const statusBadge = issue.status === 'inProgress' ? 'warning' : issue.status;
            
            item.innerHTML = `
                <div class="issue-status-indicator"></div>
                <div class="issue-content">
                    <div class="issue-title">${escapeHtml(issue.name)}</div>
                    <div class="issue-property">${escapeHtml(issue.location)}</div>
                </div>
                <div class="issue-meta">
                    <span class="issue-badge badge-${statusBadge}">${issue.status === 'inProgress' ? 'W realizacji' : issue.status === 'critical' ? 'Krytyczne' : 'Rozwiązane'}</span>
                     <button class="issue-delete-btn" data-issue-id="${issue.id}" data-issue-name="${encodeURIComponent(issue.name)}" title="Usuń usterkę">
                         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                             <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                         </svg>
                     </button>
                </div>
            `;
            
            item.addEventListener('click', (e) => {
                if (e.target.closest('.issue-delete-btn')) return;
                openEditIssueModal(issue.id);
                window.renderPropertyIssues(propertyId);
            });
            
            listContainer.appendChild(item);
        });
        
        listContainer.querySelectorAll('.issue-delete-btn').forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                const id = Number(this.dataset.issueId);
                const name = decodeURIComponent(this.dataset.issueName);
                window.showDeleteConfirmation(id, name, () => {
                    deleteIssue(id);
                    window.renderPropertyIssues(propertyId);
                }, 'issue');
            };
        });
    };
    
    function closeModal() {
        modal.classList.remove('active');
        currentPropertyId = null;
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (closeActionBtn) {
        closeActionBtn.addEventListener('click', closeModal);
    }
    
    if (addIssueBtn) {
        addIssueBtn.addEventListener('click', () => {
            closeModal();
            openAddIssueModal(currentPropertyId);
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function initAddPropertyModal() {
    const modal = document.getElementById('addPropertyModal');
    const form = document.getElementById('addPropertyForm');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelAddProperty');
    const emptyAddBtn = document.getElementById('emptyAddPropertyBtn');
    const headerAddBtn = document.querySelector('.header-actions .btn-primary');
    
    function openModal() {
        modal.classList.add('active');
        document.getElementById('propertyName').focus();
    }
    
    function closeModal() {
        modal.classList.remove('active');
        form.reset();
    }
    
    if (headerAddBtn) {
        headerAddBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }
    
    if (emptyAddBtn) {
        emptyAddBtn.addEventListener('click', openModal);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('propertyName').value.trim();
        const address = document.getElementById('propertyAddress').value.trim();
        
        if (name && address) {
            addProperty(name, address);
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function initDeleteModal() {
    const modal = document.getElementById('deleteModal');
    const closeBtn = document.getElementById('closeDeleteModal');
    const cancelBtn = document.getElementById('cancelDelete');
    const confirmBtn = document.getElementById('confirmDelete');
    const title = document.querySelector('#deleteModal .modal-title');
    const confirmText = document.getElementById('deleteConfirmText');
    
    window.showDeleteConfirmation = (itemId, itemName, callback, itemType) => {
        itemToDelete = itemId;
        deleteCallback = callback;
        title.textContent = itemType === 'issue' ? 'Usuń usterkę' : 'Usuń nieruchomość';
        confirmText.textContent = `Czy na pewno chcesz usunąć ${itemType === 'issue' ? 'usterkę' : 'nieruchomość'} "${itemName}"?`;
        modal.classList.add('active');
    };
    
    function closeModal() {
        modal.classList.remove('active');
        itemToDelete = null;
        deleteCallback = null;
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (itemToDelete && deleteCallback) {
                deleteCallback(itemToDelete);
                closeModal();
            }
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function addProperty(name, address) {
    const property = {
        id: Date.now(),
        name: name,
        address: address,
        issues: { critical: 0, inProgress: 0, resolved: 0 }
    };
    
    properties.push(property);
    saveProperties();
    renderProperties();
    updateStats();
}

function deleteProperty(id) {
    properties = properties.filter(p => p.id !== id);
    saveProperties();
    renderProperties();
    updateStats();
}

function saveProperties() {
    localStorage.setItem('propcheck_properties', JSON.stringify(properties));
}

function loadProperties() {
    const saved = localStorage.getItem('propcheck_properties');
    if (saved) {
        properties = JSON.parse(saved);
    }
    renderProperties();
    updateStats();
}

function renderProperties() {
    const grid = document.getElementById('propertiesGrid');
    const emptyState = document.getElementById('emptyPropertiesState');
    
    const existingCards = grid.querySelectorAll('.property-card');
    existingCards.forEach(card => card.remove());
    
    if (properties.length === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    properties.forEach(property => {
        const card = createPropertyCard(property);
        grid.appendChild(card);
    });
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.dataset.propertyId = property.id;
    
     card.innerHTML = `
         <div class="property-header">
             <div class="property-info">
                 <h3 class="property-name">${escapeHtml(property.name)}</h3>
                 <p class="property-address">${escapeHtml(property.address)}</p>
             </div>
             <button class="property-delete-btn" data-property-delete="${property.id}" title="Usuń nieruchomość">
                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                     <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                 </svg>
             </button>
         </div>
        <div class="property-preview">
            <svg viewBox="0 0 200 120" class="property-floorplan">
                <rect x="10" y="10" width="180" height="100" fill="#FAF7F2" stroke="#D4C4B0" stroke-width="1"/>
                <rect x="10" y="10" width="85" height="55" fill="none" stroke="#D4C4B0" stroke-width="0.5"/>
                <rect x="95" y="10" width="95" height="55" fill="none" stroke="#D4C4B0" stroke-width="0.5"/>
                <rect x="10" y="65" width="180" height="45" fill="none" stroke="#D4C4B0" stroke-width="0.5"/>
            </svg>
        </div>
        <div class="property-stats">
            <div class="property-stat">
                <span class="issue-count critical">${property.issues.critical}</span>
                <span class="issue-label">krytyczne</span>
            </div>
            <div class="property-stat">
                <span class="issue-count warning">${property.issues.inProgress}</span>
                <span class="issue-label">w realizacji</span>
            </div>
            <div class="property-stat">
                <span class="issue-count ok">${property.issues.resolved}</span>
                <span class="issue-label">rozwiązane</span>
            </div>
        </div>
        <div class="property-actions">
            <button class="btn btn-sm btn-outline" data-view-issues="${property.id}">Zobacz usterki</button>
            <button class="btn btn-sm btn-primary" data-add-issue="${property.id}">Dodaj usterkę</button>
        </div>
    `;
    
     const deleteBtn = card.querySelector('[data-property-delete]');
     deleteBtn.addEventListener('click', (e) => {
         e.stopPropagation();
         window.showDeleteConfirmation(property.id, property.name, () => deleteProperty(property.id), 'property');
     });
    
    const viewIssuesBtn = card.querySelector('[data-view-issues]');
    viewIssuesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.openPropertyIssuesModal(property.id);
    });

    const addIssueBtn = card.querySelector('[data-add-issue]');
    addIssueBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.openAddIssueModal(property.id);
    });

    card.addEventListener('click', (e) => {
        if (e.target.closest('.property-menu-btn') || e.target.closest('.property-actions')) return;
        window.openPropertyIssuesModal(property.id);
    });
    
    return card;
}

function updateStats() {
    const totalProperties = properties.length;
    let totalIssues = 0;
    let inProgress = 0;
    let resolved = 0;
    
    properties.forEach(p => {
        totalIssues += p.issues.critical + p.issues.inProgress + p.issues.resolved;
        inProgress += p.issues.inProgress;
        resolved += p.issues.resolved;
    });
    
    document.getElementById('statProperties').textContent = totalProperties;
    document.getElementById('statIssues').textContent = totalIssues;
    document.getElementById('statInProgress').textContent = inProgress;
    document.getElementById('statResolved').textContent = resolved;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addIssue(propertyId, name, location, description, isCritical = false) {
    const propertyIdNum = parseInt(propertyId);
    
    const issue = {
        id: Date.now(),
        propertyId: propertyIdNum,
        name: name,
        location: location,
        description: description,
        status: isCritical ? 'critical' : 'inProgress',
        createdAt: new Date().toISOString()
    };
    
    issues.push(issue);
    saveIssues();
    updatePropertyIssueCounts();
    updateStats();
    renderIssuesList();
}

function saveIssues() {
    localStorage.setItem('propcheck_issues', JSON.stringify(issues));
}

function loadIssues() {
    const saved = localStorage.getItem('propcheck_issues');
    if (saved) {
        issues = JSON.parse(saved);
    }
    renderIssuesList();
}

function updatePropertyIssueCounts() {
    properties = properties.map(p => {
        const propertyId = parseInt(p.id);
        const propertyIssues = issues.filter(i => parseInt(i.propertyId) === propertyId);
        return {
            ...p,
            id: propertyId,
            issues: {
                critical: propertyIssues.filter(i => i.status === 'critical').length,
                inProgress: propertyIssues.filter(i => i.status === 'inProgress').length,
                resolved: propertyIssues.filter(i => i.status === 'resolved').length
            }
        };
    });
    saveProperties();
    renderProperties();
}

function renderIssuesList() {
    const list = document.getElementById('issuesList');
    const emptyState = document.getElementById('emptyIssuesState');
    if (!list) return;
    
    const existingItems = list.querySelectorAll('.issue-item');
    existingItems.forEach(item => item.remove());
    
    if (issues.length === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    const sortedIssues = [...issues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
    
    sortedIssues.forEach(issue => {
        const property = properties.find(p => p.id === issue.propertyId);
        const item = document.createElement('div');
        item.className = `issue-item issue-${issue.status}`;
        
        const statusBadge = issue.status === 'inProgress' ? 'warning' : issue.status;
        const issueId = issue.id;
        const issueName = issue.name;
        
        item.innerHTML = `
            <div class="issue-status-indicator"></div>
            <div class="issue-content">
                <div class="issue-title">${escapeHtml(issue.name)}</div>
                <div class="issue-property">${property ? escapeHtml(property.name) : 'Nieznana nieruchomość'}</div>
            </div>
            <div class="issue-meta">
                <span class="issue-badge badge-${statusBadge}">${issue.status === 'inProgress' ? 'W realizacji' : issue.status === 'critical' ? 'Krytyczne' : 'Rozwiązane'}</span>
                <span class="issue-date">${formatDate(issue.createdAt)}</span>
                 <button class="issue-delete-btn" data-issue-id="${issue.id}" data-issue-name="${encodeURIComponent(issue.name)}" title="Usuń usterkę">
                     <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                         <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                     </svg>
                 </button>
            </div>
        `;
        
        item.addEventListener('click', (e) => {
            if (e.target.closest('.issue-delete-btn')) return;
            openEditIssueModal(issueId);
        });
        
        list.appendChild(item);
    });
    
    document.querySelectorAll('.issue-delete-btn').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            const id = Number(this.dataset.issueId);
            const name = decodeURIComponent(this.dataset.issueName);
            window.showDeleteConfirmation(id, name, deleteIssue, 'issue');
        };
    });
}

function deleteIssue(id) {
    issues = issues.filter(i => i.id !== Number(id));
    saveIssues();
    updatePropertyIssueCounts();
    updateStats();
    renderIssuesList();
    renderProperties();
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function openEditIssueModal(issueId) {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;
    
    const property = properties.find(p => p.id === issue.propertyId);
    const propertyIssuesModal = document.getElementById('propertyIssuesModal');
    const isInPropertyModal = propertyIssuesModal && propertyIssuesModal.classList.contains('active');
    
    document.getElementById('issuePropertyGroup').style.display = 'none';
    document.getElementById('issueProperty').value = issue.propertyId;
    document.getElementById('issueName').value = issue.name;
    document.getElementById('issueLocation').value = issue.location;
    document.getElementById('issueDescription').value = issue.description || '';
    document.getElementById('issueCritical').checked = issue.status === 'critical';
    
    document.getElementById('addIssueModal').classList.add('active');
    currentPropertyId = issue.propertyId;
    
    const form = document.getElementById('addIssueForm');
    const originalSubmit = form.onsubmit;
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const name = document.getElementById('issueName').value.trim();
        const location = document.getElementById('issueLocation').value.trim();
        const description = document.getElementById('issueDescription').value.trim();
        const isCritical = document.getElementById('issueCritical').checked;
        
        if (name && location) {
            updateIssue(issueId, name, location, description, isCritical);
            document.getElementById('addIssueModal').classList.remove('active');
            document.getElementById('addIssueForm').reset();
            form.onsubmit = null;
            currentPropertyId = null;
            
            if (isInPropertyModal) {
                window.renderPropertyIssues(issue.propertyId);
            }
        }
    };
    
    document.getElementById('closeIssueModal').onclick = function() {
        document.getElementById('addIssueModal').classList.remove('active');
        document.getElementById('addIssueForm').reset();
        form.onsubmit = null;
        currentPropertyId = null;
    };
    
    document.getElementById('cancelAddIssue').onclick = function() {
        document.getElementById('addIssueModal').classList.remove('active');
        document.getElementById('addIssueForm').reset();
        form.onsubmit = null;
        currentPropertyId = null;
    };
    
    document.getElementById('issueName').focus();
}

function updateIssue(issueId, name, location, description, isCritical) {
    const index = issues.findIndex(i => i.id === issueId);
    if (index === -1) return;
    
    issues[index] = {
        ...issues[index],
        name: name,
        location: location,
        description: description,
        status: isCritical ? 'critical' : 'inProgress',
        updatedAt: new Date().toISOString()
    };
    
    saveIssues();
    updatePropertyIssueCounts();
    updateStats();
    renderIssuesList();
    renderProperties();
}
