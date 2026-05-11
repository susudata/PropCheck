/**
 * PropCheck Dashboard - Interactive Features
 */

let properties = [];
let issues = [];
let itemToDelete = null;
let deleteCallback = null;
let currentPropertyId = null;
let currentPhotos = []; // Global photo storage for issue form
let isEditMode = false; // Flag to prevent addIssue firing during edit
let returnToMapAfterEditPropertyId = null; // Set when edit modal was opened from map

// ── IndexedDB for photos storage ────────────────────────────────────────────
let photoDB = null;

async function initPhotoDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('PropCheckDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            photoDB = request.result;
            resolve(photoDB);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('photos')) {
                db.createObjectStore('photos', { keyPath: 'id' });
            }
        };
    });
}

async function savePhotoToIndexedDB(photoId, photoData) {
    if (!photoDB) return false;
    return new Promise((resolve) => {
        try {
            const transaction = photoDB.transaction(['photos'], 'readwrite');
            const store = transaction.objectStore('photos');
            store.put({ id: photoId, data: photoData });
            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => resolve(false);
        } catch (e) {
            console.error('Error saving photo to IndexedDB:', e);
            resolve(false);
        }
    });
}

async function getPhotoFromIndexedDB(photoId) {
    if (!photoDB) return null;
    return new Promise((resolve) => {
        try {
            const transaction = photoDB.transaction(['photos'], 'readonly');
            const store = transaction.objectStore('photos');
            const request = store.get(photoId);
            request.onsuccess = () => resolve(request.result?.data || null);
            request.onerror = () => resolve(null);
        } catch (e) {
            console.error('Error getting photo from IndexedDB:', e);
            resolve(null);
        }
    });
}

async function deletePhotoFromIndexedDB(photoId) {
    if (!photoDB) return false;
    return new Promise((resolve) => {
        try {
            const transaction = photoDB.transaction(['photos'], 'readwrite');
            const store = transaction.objectStore('photos');
            store.delete(photoId);
            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => resolve(false);
        } catch (e) {
            resolve(false);
        }
    });
}

// Compress image to reduce localStorage size
async function compressImageToBase64(file, maxWidth = 1024, maxHeight = 1024, quality = 0.7) {
    const originalSize = (file.size / 1024).toFixed(1);
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to compressed base64
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                const compressedSize = (compressedBase64.length / 1024).toFixed(1);
                console.log(`Image compressed: ${originalSize}KB → ${compressedSize}KB (ratio: ${(compressedSize / originalSize).toFixed(2)}x)`);
                resolve(compressedBase64);
            };
            img.onerror = () => {
                console.warn('Failed to compress image, using original');
                resolve(e.target.result); // Fallback to original if error
            };
            img.src = e.target.result;
        };
        reader.onerror = () => {
            console.error('Failed to read file');
            resolve(null);
        };
        reader.readAsDataURL(file);
    });
}

// ── Modal management (global) ───────────────────────────────────────────────
let activeModalId = null; // Currently active modal ID for tracking

/**
 * Open a modal and automatically close the previously active modal.
 * @param {string} modalId - ID of the modal element to open
 * @param {Function} onOpen - Optional callback after opening
 */
function openModalWithAutoClose(modalId, onOpen) {
    // Close previously active modal if it exists and is different
    if (activeModalId && activeModalId !== modalId) {
        const prevModal = document.getElementById(activeModalId);
        if (prevModal && prevModal.classList.contains('active')) {
            prevModal.classList.remove('active');
        }
    }
    
    // Open the new modal
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        activeModalId = modalId;
        
        // Execute callback if provided
        if (typeof onOpen === 'function') {
            onOpen();
        }
    }
}

/**
 * Close a modal and clear it from active tracking.
 * @param {string} modalId - ID of the modal element to close
 */
function closeModalTracked(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        if (activeModalId === modalId) {
            activeModalId = null;
        }
    }
}

// ── Floorplan map state ──────────────────────────────────────────────────────
let mapMode = 'edit';           // 'edit' | 'view'
let activePinIssueId = null;    // issueId being placed after form save
let isDraggingPin = false;      // true while a pin is being dragged
let currentMapPropertyId = null; // propertyId currently shown in map modal

// Global photo utility functions
function getPhotoData() {
    return currentPhotos.length > 0 ? currentPhotos : null;
}

function clearPhotoPreview() {
    currentPhotos = [];
    renderPhotoPreviews();
    const photoInput = document.getElementById('photoInput');
    if (photoInput) photoInput.value = '';
}

function renderPhotoPreviews() {
    const grid = document.getElementById('photoPreviewsGrid');
    const counter = document.getElementById('photoCounter');
    const addBtn = document.getElementById('photoAddBtn');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Add photo previews
    currentPhotos.forEach((photoData, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'photo-preview-item';
        previewItem.innerHTML = `
            <img src="${photoData}" alt="Zdjęcie ${index + 1}">
            <button type="button" class="photo-remove-btn" data-index="${index}" title="Usuń zdjęcie">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        `;
        grid.appendChild(previewItem);
    });
    
    grid.querySelectorAll('.photo-remove-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            currentPhotos.splice(index, 1);
            renderPhotoPreviews();
        });
    });
    
    // Update counter
    counter.textContent = `${currentPhotos.length}/10`;
    counter.style.display = currentPhotos.length > 0 ? 'block' : 'none';
    
    // Show/hide add button
    if (addBtn) {
        addBtn.style.display = currentPhotos.length < 10 ? 'flex' : 'none';
    }
}

// Wait for DOM to be fully ready
document.addEventListener('DOMContentLoaded', async function() {
     // Initialize IndexedDB for photos
     try {
         await initPhotoDB();
     } catch (err) {
         console.warn('IndexedDB not available, will use localStorage with compression');
     }
     
     initAddPropertyModal();
     initAddIssueModal();
     initPropertyIssuesModal();
     initDeleteModal();
     initReportModal();
     initFloorplanMapModal();
     initSettingsModal();
     loadProperties();
     loadIssues();
    
    // Mobile menu initialization (simplified, inline)
    const menuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (menuBtn && sidebar && overlay) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('active');
                }
            });
        });
    }

    initImageViewerModal();
    initBottomNav();
    initIssuesPage();
    initIssuesNavigation();
});

// Bottom navigation & speed-dial FAB wiring (mobile)
function initBottomNav() {

    // ---- Speed-dial FAB ----
    const fabToggle   = document.getElementById('fabToggle');
    const fabActions  = document.getElementById('fabActions');
    const fabBackdrop = document.getElementById('fabBackdrop');

    function openFab() {
        if (!fabToggle) return;
        fabToggle.classList.add('open');
        fabToggle.setAttribute('aria-expanded', 'true');
        fabActions.classList.add('open');
        fabBackdrop.classList.add('open');
    }

    function closeFab() {
        if (!fabToggle) return;
        fabToggle.classList.remove('open');
        fabToggle.setAttribute('aria-expanded', 'false');
        fabActions.classList.remove('open');
        fabBackdrop.classList.remove('open');
    }

    if (fabToggle) {
        fabToggle.addEventListener('click', () => {
            fabToggle.classList.contains('open') ? closeFab() : openFab();
        });
    }

    if (fabBackdrop) {
        fabBackdrop.addEventListener('click', closeFab);
    }

    // Speed-dial: "Zgłoś usterkę"
    const fabAddIssue = document.getElementById('fabAddIssue');
    if (fabAddIssue) {
        fabAddIssue.addEventListener('click', () => {
            closeFab();
            if (typeof window.openAddIssueModal === 'function') {
                window.openAddIssueModal(null);
            }
        });
    }

    // Speed-dial: "Dodaj nieruchomość"
    const fabAddProperty = document.getElementById('fabAddProperty');
    if (fabAddProperty) {
        fabAddProperty.addEventListener('click', () => {
            closeFab();
            openModalWithAutoClose('addPropertyModal', () => {
                const nameInput = document.getElementById('propertyName');
                if (nameInput) nameInput.focus();
            });
        });
    }

    // ---- Section header inline buttons ----
    const sectionAddPropertyBtn = document.getElementById('sectionAddPropertyBtn');
    if (sectionAddPropertyBtn) {
        sectionAddPropertyBtn.addEventListener('click', () => {
            openModalWithAutoClose('addPropertyModal', () => {
                const nameInput = document.getElementById('propertyName');
                if (nameInput) nameInput.focus();
            });
        });
    }

    const sectionAddIssueBtn = document.getElementById('sectionAddIssueBtn');
    if (sectionAddIssueBtn) {
        sectionAddIssueBtn.addEventListener('click', () => {
            if (typeof window.openAddIssueModal === 'function') {
                window.openAddIssueModal(null);
            }
        });
    }

    // ---- Bottom nav: "Raport" opens PDF modal ----
    const reportNavItem = document.querySelector('.bottom-nav-item[data-section="reports"]');
    if (reportNavItem) {
        reportNavItem.addEventListener('click', (e) => {
            e.preventDefault();
            const btn = document.getElementById('openReportModalBtn');
            if (btn) btn.click();
        });
    }

    // ---- Bottom nav: "Więcej/Ustawienia" opens settings modal ----
    const settingsNavItem = document.querySelector('.bottom-nav-item[data-section="settings"]');
    if (settingsNavItem) {
        settingsNavItem.addEventListener('click', (e) => {
            e.preventDefault();
            openModalWithAutoClose('settingsModal');
        });
    }

    // ---- Bottom nav active state (visual) ----
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const section = item.dataset.section;
            if (section === 'reports' || section === 'settings') return; // modal only, no active change
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function initAddIssueModal() {
    const modal = document.getElementById('addIssueModal');
    const form = document.getElementById('addIssueForm');
    const closeBtn = document.getElementById('closeIssueModal');
    const cancelBtn = document.getElementById('cancelAddIssue');
    const openBtn = document.getElementById('addIssueBtn');
    const photoAddBtn = document.getElementById('photoAddBtn');
    const photoInput = document.getElementById("photoInput");
    const submitBtn = document.getElementById('submitIssueBtn');

     if (photoInput) {
         photoInput.addEventListener('change', async function(e) {
             const files = Array.from(e.target.files);
             const maxPhotos = 10;
             const maxSize = 5 * 1024 * 1024; // 5MB
             
             if (currentPhotos.length + files.length > maxPhotos) {
                 alert(`Możesz dodać maksymalnie ${maxPhotos} zdjęć. Aktualnie masz ${currentPhotos.length}.`);
                 photoInput.value = '';
                 return;
             }
             
             let processedCount = 0;
             
             for (const file of files) {
                 if (!file.type.startsWith('image/')) {
                     alert('Proszę wybrać plik obrazu (JPG, PNG, itp.)');
                     continue;
                 }
                 if (file.size > maxSize) {
                     alert('Zdjęcie "' + file.name + '" nie może być większe niż 5MB');
                     continue;
                 }
                 
                 // Compress image before adding
                 try {
                     const compressedBase64 = await compressImageToBase64(file, 800, 800, 0.6);
                     if (compressedBase64) {
                         currentPhotos.push(compressedBase64);
                         renderPhotoPreviews();
                     }
                 } catch (err) {
                     console.error('Error compressing image:', err);
                 }
                 
                 processedCount++;
             }
             
             photoInput.value = '';
         });
     }

     if (photoAddBtn) {
         photoAddBtn.addEventListener('click', () => {
             photoInput.click();
         });
     }

      // "Gotowe + Umieść" button: save issue and go to map placement mode (add mode only)
      // In edit mode, handler is set in openEditIssueModal() separately
      const submitAndPlaceBtn = document.getElementById('submitAndPlaceIssueBtn');
      if (submitAndPlaceBtn) {
          submitAndPlaceBtn.addEventListener('click', (e) => {
              // Skip in edit mode (handled by openEditIssueModal) - check BEFORE preventDefault
              if (isEditMode) return;
              
              e.preventDefault();

              const name = document.getElementById('issueName').value.trim();
              const location = document.getElementById('issueLocation').value.trim();
              const description = document.getElementById('issueDescription').value.trim();
              const propertyIdToUse = currentPropertyId
                  ? parseInt(currentPropertyId)
                  : parseInt(document.getElementById('issueProperty').value);
              const isCritical = document.getElementById('issueCritical').checked;
              const photos = getPhotoData();

              if (name && location && propertyIdToUse) {
                  const newId = addIssue(propertyIdToUse, name, location, description, isCritical, photos);
                  closeModal();
                  if (newId) {
                      // Immediately open map in single-pin placement mode
                      activePinIssueId = newId;
                      openFloorplanMapModal(propertyIdToUse, newId);
                  }
              } else if (!propertyIdToUse) {
                  document.getElementById('issueProperty').focus();
              }
          });
      }

     window.openAddIssueModal = function(propertyId) {
        currentPropertyId = propertyId;
        currentPhotos = [];
        clearPhotoPreview();

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

        if (submitBtn) {
            submitBtn.textContent = 'Dodaj usterkę';
        }

        // Update visibility of "Gotowe + Umieść" button based on floorplan
        updateSubmitAndPlaceVisibility(propertyId);

        // If property select changes, update visibility
        propertySelect.onchange = function() {
            const selId = parseInt(propertySelect.value) || null;
            updateSubmitAndPlaceVisibility(selId);
        };

        openModalWithAutoClose('addIssueModal', () => {
            document.getElementById('issueName').focus();
        });
    };
    
      function closeModal() {
          const handleTransitionEnd = (e) => {
              if (e.target === modal && e.propertyName === 'opacity') {
                  modal.removeEventListener('transitionend', handleTransitionEnd);
                  const submitBtn = document.getElementById('submitIssueBtn');
                  const toggleResolvedBtn = document.getElementById('toggleResolvedBtn');
                  if (submitBtn) {
                      submitBtn.textContent = 'Dodaj usterkę';
                  }
                  if (toggleResolvedBtn) {
                      toggleResolvedBtn.style.display = 'none';
                  }
              }
          };
          modal.addEventListener('transitionend', handleTransitionEnd);
          closeModalTracked('addIssueModal');
          form.reset();
          const submitAndPlaceBtn = document.getElementById('submitAndPlaceIssueBtn');
          if (submitAndPlaceBtn) {
              submitAndPlaceBtn.style.display = 'none';
          }
           currentPropertyId = null;
           currentPhotos = [];
           clearPhotoPreview();
           // Clear any pending pin placement if modal is cancelled
           window._pendingPinPosition = null;
           // If edit was opened from map, reopen the map
          const mapPropId = returnToMapAfterEditPropertyId;
          returnToMapAfterEditPropertyId = null;
          isEditMode = false;
          form.onsubmit = null;
          if (mapPropId) {
              openFloorplanMapModal(mapPropId);
          }
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
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    form.addEventListener('submit', (e) => {
         e.preventDefault();
         
         // When editing an existing issue, form.onsubmit handles everything — skip addIssue
         if (isEditMode) return;
         
         const name = document.getElementById('issueName').value.trim();
         const location = document.getElementById('issueLocation').value.trim();
         const description = document.getElementById('issueDescription').value.trim();
         const propertyIdToUse = currentPropertyId
             ? parseInt(currentPropertyId)
             : parseInt(document.getElementById('issueProperty').value);
         const isCritical = document.getElementById('issueCritical').checked;
         const photos = getPhotoData();
         
         if (name && location && propertyIdToUse) {
             // If a pending pin position exists (from clicking map → open form), apply it directly
             if (window._pendingPinPosition) {
                 addIssueWithPin(propertyIdToUse, name, location, description, isCritical, photos, window._pendingPinPosition);
                 window._pendingPinPosition = null;
                 closeModal();
             } else {
                 addIssue(propertyIdToUse, name, location, description, isCritical, photos);
                 closeModal();
             }
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

function initAddPropertyModal() {
    const modal = document.getElementById('addPropertyModal');
    const form = document.getElementById('addPropertyForm');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelAddProperty');
    const emptyAddBtn = document.getElementById('emptyAddPropertyBtn');
    const headerAddBtn = document.querySelector('.header-actions .btn-primary');
    const floorplanInput = document.getElementById('floorplanInput');
    const floorplanAddBtn = document.getElementById('floorplanAddBtn');
    const floorplanRemoveBtn = document.getElementById('floorplanRemoveBtn');
    const floorplanPreviewWrapper = document.getElementById('floorplanPreviewWrapper');
    const floorplanPreviewImg = document.getElementById('floorplanPreviewImg');

    let currentFloorplanPhoto = null;

    function setFloorplanPreview(dataUrl) {
        currentFloorplanPhoto = dataUrl;
        floorplanPreviewImg.src = dataUrl;
        floorplanPreviewWrapper.style.display = 'block';
        floorplanAddBtn.style.display = 'none';
    }

    function clearFloorplanPreview() {
        currentFloorplanPhoto = null;
        floorplanPreviewImg.src = '';
        floorplanPreviewWrapper.style.display = 'none';
        floorplanAddBtn.style.display = 'flex';
        if (floorplanInput) floorplanInput.value = '';
    }

    if (floorplanInput) {
        floorplanInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                alert('Proszę wybrać plik obrazu (JPG, PNG, itp.)');
                floorplanInput.value = '';
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Zdjęcie nie może być większe niż 5MB');
                floorplanInput.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(ev) {
                setFloorplanPreview(ev.target.result);
                floorplanInput.value = '';
            };
            reader.readAsDataURL(file);
        });
    }

    if (floorplanAddBtn) {
        floorplanAddBtn.addEventListener('click', () => {
            floorplanInput.click();
        });
    }

    if (floorplanRemoveBtn) {
        floorplanRemoveBtn.addEventListener('click', () => {
            clearFloorplanPreview();
        });
    }

    function openModal() {
        clearFloorplanPreview();
        openModalWithAutoClose('addPropertyModal', () => {
            document.getElementById('propertyName').focus();
        });
    }
    
    function closeModal() {
        closeModalTracked('addPropertyModal');
        form.reset();
        clearFloorplanPreview();
        currentPropertyId = null;
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
            addProperty(name, address, currentFloorplanPhoto);
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
         if (itemType === 'issue') {
             title.textContent = 'Usuń usterkę';
             confirmBtn.textContent = 'Usuń';
         } else if (itemType === 'data' || itemType === 'import') {
             title.textContent = itemType === 'import' ? 'Potwierdzenie importu' : 'Wyczyść dane';
             confirmBtn.textContent = itemType === 'import' ? 'Potwierdź' : 'Usuń';
         } else {
             title.textContent = 'Usuń nieruchomość';
             confirmBtn.textContent = 'Usuń';
         }
         if (itemType === 'data') {
             confirmText.textContent = `Czy na pewno chcesz wyczyścić ${itemName}? Tej operacji nie można cofnąć.`;
         } else if (itemType === 'import') {
             confirmText.textContent = `Czy na pewno chcesz zaimportować ${itemName}? Tej operacji nie można cofnąć.`;
         } else {
             confirmText.textContent = `Czy na pewno chcesz usunąć ${itemType === 'issue' ? 'usterkę' : 'nieruchomość'} "${itemName}"?`;
         }
         openModalWithAutoClose('deleteModal');
     };
     
     function closeModal() {
         closeModalTracked('deleteModal');
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
             if (deleteCallback) {
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
        
        openModalWithAutoClose('propertyIssuesModal');
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
            
            const photosHtml = issue.photos && issue.photos.length > 0 
                ? `<div class="issue-photos-grid">
                     ${issue.photos.map((photo, idx) => `
                       <img src="${escapeHtml(photo)}" class="issue-photo-preview" alt="Zdjęcie usterki ${idx + 1}" data-photo-index="${idx}">
                     `).join('')}
                   </div>`
                : '';
            
            const pinHtml = issue.pinPosition
                ? `<span title="Na mapie" style="color: var(--color-primary); font-size: 13px; line-height:1; flex-shrink:0;">
                       <svg width="13" height="13" viewBox="0 0 20 20" fill="none" style="vertical-align:middle">
                           <circle cx="10" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/>
                           <path d="M10 2C6.69 2 4 4.69 4 8c0 5 6 10 6 10s6-5 6-10c0-3.31-2.69-6-6-6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                       </svg>
                   </span>`
                : '';

            item.innerHTML = `
                <div class="issue-status-indicator"></div>
                <div class="issue-content">
                    <div class="issue-title">${escapeHtml(issue.name)}</div>
                    <div class="issue-property">${escapeHtml(issue.location)}</div>
                    ${photosHtml}
                </div>
                <div class="issue-meta">
                    ${pinHtml}
                    <span class="issue-badge badge-${statusBadge}">${issue.status === 'inProgress' ? 'Usterka' : issue.status === 'critical' ? 'Krytyczne' : 'Rozwiązane'}</span>
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
            });

            // Photo click handler
            const photoImgs = item.querySelectorAll('.issue-photo-preview');
            photoImgs.forEach(photoImg => {
                const index = parseInt(photoImg.dataset.photoIndex);
                photoImg.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (issue.photos && issue.photos[index]) {
                        window.openImageViewerModal(issue.photos[index]);
                    }
                });
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
        closeModalTracked('propertyIssuesModal');
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

function initImageViewerModal() {
    const overlay = document.getElementById('imageViewerOverlay');
    const closeBtn = document.getElementById('imageViewerClose');
    const img = document.getElementById('imageViewerImg');

    window.openImageViewerModal = function(imageSrc) {
        if (img && overlay) {
            img.src = imageSrc;
            openModalWithAutoClose('imageViewerOverlay');
        }
    };

    function closeModal() {
        closeModalTracked('imageViewerOverlay');
        if (img) img.src = '';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function addProperty(name, address, floorplanPhoto) {
    const property = {
        id: Date.now(),
        name: name,
        address: address,
        floorplanPhoto: floorplanPhoto || null,
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
            ${property.floorplanPhoto
                ? `<img src="${property.floorplanPhoto}" alt="Plan mieszkania" class="property-floorplan-img">`
                : `<svg viewBox="0 0 200 120" class="property-floorplan">
                <rect x="10" y="10" width="180" height="100" fill="#FAF7F2" stroke="#D4C4B0" stroke-width="1"/>
                <rect x="10" y="10" width="85" height="55" fill="none" stroke="#D4C4B0" stroke-width="0.5"/>
                <rect x="95" y="10" width="95" height="55" fill="none" stroke="#D4C4B0" stroke-width="0.5"/>
                <rect x="10" y="65" width="180" height="45" fill="none" stroke="#D4C4B0" stroke-width="0.5"/>
            </svg>`
            }
        </div>
        <div class="property-stats">
            <div class="property-stat">
                <span class="issue-count critical">${property.issues.critical}</span>
                <span class="issue-label">krytyczne</span>
            </div>
            <div class="property-stat">
                <span class="issue-count warning">${property.issues.critical + property.issues.inProgress}</span>
                <span class="issue-label">usterki</span>
            </div>
            <div class="property-stat">
                <span class="issue-count ok">${property.issues.resolved}</span>
                <span class="issue-label">rozwiązane</span>
            </div>
        </div>
        <div class="property-actions">
            <button class="btn btn-sm btn-outline" data-view-issues="${property.id}">Zobacz usterki</button>
            ${property.floorplanPhoto ? `<button class="btn btn-sm btn-outline" data-open-map="${property.id}" title="Mapa usterek">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style="flex-shrink:0">
                    <circle cx="10" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M10 2C6.69 2 4 4.69 4 8c0 5 6 10 6 10s6-5 6-10c0-3.31-2.69-6-6-6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
                Mapa</button>` : ''}
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

    const openMapBtn = card.querySelector('[data-open-map]');
    if (openMapBtn) {
        openMapBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openFloorplanMapModal(property.id);
        });
    }

    card.addEventListener('click', (e) => {
        if (e.target.closest('.property-menu-btn') || e.target.closest('.property-actions')) return;
        if (property.floorplanPhoto && e.target.closest('.property-preview')) {
            openFloorplanMapModal(property.id);
            return;
        }
        window.openPropertyIssuesModal(property.id);
    });
    
    return card;
}

function updateStats() {
    const totalProperties = properties.length;
    let totalIssues = 0;
    let resolved = 0;
    
    properties.forEach(p => {
        totalIssues += p.issues.critical + p.issues.inProgress + p.issues.resolved;
        resolved += p.issues.resolved;
    });
    
    document.getElementById('statProperties').textContent = totalProperties;
    document.getElementById('statIssues').textContent = totalIssues;
    document.getElementById('statResolved').textContent = resolved;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addIssue(propertyId, name, location, description, isCritical = false, photos = null) {
    const propertyIdNum = parseInt(propertyId);
    
    const issue = {
        id: Date.now(),
        propertyId: propertyIdNum,
        name: name,
        location: location,
        description: description,
        status: isCritical ? 'critical' : 'inProgress',
        createdAt: new Date().toISOString(),
        photos: photos || [],
        pinPosition: null
    };
    
    issues.push(issue);
    saveIssues();
    updatePropertyIssueCounts();
    updateStats();
    renderIssuesList();
    return issue.id; // return id for pin-after-save flow
}

/** Add issue with a pre-set pin position (from clicking map before filling form) */
function addIssueWithPin(propertyId, name, location, description, isCritical, photos, pinPosition) {
    const propertyIdNum = parseInt(propertyId);
    const issue = {
        id: Date.now(),
        propertyId: propertyIdNum,
        name: name,
        location: location,
        description: description,
        status: isCritical ? 'critical' : 'inProgress',
        createdAt: new Date().toISOString(),
        photos: photos || [],
        pinPosition: {
            x: Math.max(1, Math.min(99, pinPosition.x)),
            y: Math.max(1, Math.min(99, pinPosition.y))
        }
    };
    issues.push(issue);
    saveIssues();
    updatePropertyIssueCounts();
    updateStats();
    renderIssuesList();
    return issue.id;
}

/** Show/hide "Gotowe + Umieść" button based on whether property has a floorplan */
function updateSubmitAndPlaceVisibility(propertyId) {
    const btn = document.getElementById('submitAndPlaceIssueBtn');
    if (!btn) return;
    const pid = parseInt(propertyId);
    const prop = pid ? properties.find(p => parseInt(p.id) === pid) : null;
    const hasFloorplan = !!(prop && prop.floorplanPhoto);
    btn.style.display = hasFloorplan ? 'block' : 'none';
}

function saveIssues() {
     try {
         const json = JSON.stringify(issues);
         const sizeInMB = (new Blob([json]).size / (1024 * 1024)).toFixed(2);
         console.log(`Saving issues (${sizeInMB}MB) to localStorage...`);
         localStorage.setItem('propcheck_issues', json);
         console.log('Issues saved successfully');
     } catch (e) {
         if (e.name === 'QuotaExceededError') {
              console.error('localStorage quota exceeded - photos are too large');
              alert('Błąd: Magazyn przeglądarki jest pełny. Spróbuj usunąć niektóre zdjęcia lub wyczyścić starsze usterki.');
              // Try to save at least without photos as fallback
              const issuesWithoutPhotos = issues.map(issue => ({
                  ...issue,
                  photos: [] // Strip photos to fit in storage
              }));
              try {
                  const jsonWithoutPhotos = JSON.stringify(issuesWithoutPhotos);
                  const sizeWithoutPhotos = (new Blob([jsonWithoutPhotos]).size / (1024 * 1024)).toFixed(2);
                  console.log(`Saving issues without photos (${sizeWithoutPhotos}MB)...`);
                  localStorage.setItem('propcheck_issues', jsonWithoutPhotos);
                  console.log('Saved issues without photos due to storage quota');
              } catch (e2) {
                  console.error('Even without photos failed to save:', e2);
              }
         } else {
              throw e;
         }
     }
}

function loadIssues() {
    const saved = localStorage.getItem('propcheck_issues');
    if (saved) {
        issues = JSON.parse(saved);
        // Backward compatibility: convert old single photo to photos array
        issues = issues.map(issue => {
            if (issue.photo && (!issue.photos || !Array.isArray(issue.photos))) {
                return {
                    ...issue,
                    photos: issue.photo ? [issue.photo] : [],
                    photo: undefined // Remove old field
                };
            }
            return issue;
        });
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
    
    // Refresh map if currently open
    if (currentMapPropertyId) {
        renderMapPins(currentMapPropertyId, activePinIssueId);
    }
    
    // Odśwież Issues Page jeśli jest widoczna
    const issuesPageSection = document.getElementById('issuesPageSection');
    if (issuesPageSection && issuesPageSection.style.display !== 'none') {
        renderIssuesPage();
    }
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
        
        item.innerHTML = `
            <div class="issue-status-indicator"></div>
            <div class="issue-content">
                <div class="issue-title">${escapeHtml(issue.name)}</div>
                <div class="issue-property">${property ? escapeHtml(property.name) : 'Nieznana nieruchomość'}</div>
                ${issue.photos && issue.photos.length > 0 
                  ? `<div class="issue-photos-grid">
                       ${issue.photos.map((photo, idx) => `
                         <img src="${escapeHtml(photo)}" class="issue-photo-preview" alt="Zdjęcie usterki ${idx + 1}" data-photo-index="${idx}">
                       `).join('')}
                     </div>`
                  : ''}
            </div>
            <div class="issue-meta">
                <span class="issue-badge badge-${statusBadge}">${issue.status === 'inProgress' ? 'Usterka' : issue.status === 'critical' ? 'Krytyczne' : 'Rozwiązane'}</span>
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

        // Photo click handler
        const photoImgs = item.querySelectorAll('.issue-photo-preview');
        photoImgs.forEach(photoImg => {
            const index = parseInt(photoImg.dataset.photoIndex);
            photoImg.addEventListener('click', (e) => {
                e.stopPropagation();
                if (issue.photos && issue.photos[index]) {
                    window.openImageViewerModal(issue.photos[index]);
                }
            });
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

function openEditIssueModal(issueId, returnToMapPropertyId) {
     const issue = issues.find(i => i.id === issueId);
     if (!issue) return;

     isEditMode = true;
     returnToMapAfterEditPropertyId = returnToMapPropertyId || null;

     const property = properties.find(p => p.id === issue.propertyId);
     const propertyIssuesModal = document.getElementById('propertyIssuesModal');
     const isInPropertyModal = propertyIssuesModal && propertyIssuesModal.classList.contains('active');

     document.getElementById('issuePropertyGroup').style.display = 'none';
     document.getElementById('issueProperty').value = issue.propertyId;
     document.getElementById('issueName').value = issue.name;
     document.getElementById('issueLocation').value = issue.location;
     document.getElementById('issueDescription').value = issue.description || '';
     document.getElementById('issueCritical').checked = issue.status === 'critical';

     // Load multiple photos
     currentPhotos = issue.photos || [];
     renderPhotoPreviews();
     // Reset file input to avoid stale selection
     const photoInputEl = document.getElementById('photoInput');
     if (photoInputEl) photoInputEl.value = '';

      // Ustaw tekst przycisku na "Gotowe" i pokaż "Gotowe + Umieść" w edit mode
      const submitBtn = document.getElementById('submitIssueBtn');
      const submitAndPlaceBtn = document.getElementById('submitAndPlaceIssueBtn');
      if (submitBtn) {
          submitBtn.textContent = 'Gotowe';
      }
       if (submitAndPlaceBtn) {
           submitAndPlaceBtn.textContent = 'Umieść pinezkę';
       }

      // Setup toggle resolved button
     const toggleResolvedBtn = document.getElementById('toggleResolvedBtn');
     if (toggleResolvedBtn) {
         toggleResolvedBtn.style.display = 'block';
         const isResolved = issue.status === 'resolved';
         toggleResolvedBtn.textContent = isResolved ? 'Oznacz jako nierozwiązane' : 'Oznacz jako rozwiązane';
         toggleResolvedBtn.onclick = function(e) {
             e.preventDefault();
             const newStatus = isResolved ? 'inProgress' : 'resolved';
             updateIssueStatus(issueId, newStatus);
             // Refresh the button state
             const updatedIssue = issues.find(i => i.id === issueId);
             if (updatedIssue) {
                 const updated = updatedIssue.status === 'resolved';
                 toggleResolvedBtn.textContent = updated ? 'Oznacz jako nierozwiązane' : 'Oznacz jako rozwiązane';
             }
         };
     }

     openModalWithAutoClose('addIssueModal');
     currentPropertyId = issue.propertyId;

     // Show/hide "Gotowe + Umieść" button for the issue's property
     updateSubmitAndPlaceVisibility(issue.propertyId);

    const form = document.getElementById('addIssueForm');
    const originalSubmit = form.onsubmit;
    form.onsubmit = function(e) {
        e.preventDefault();

         const name = document.getElementById('issueName').value.trim();
         const location = document.getElementById('issueLocation').value.trim();
         const description = document.getElementById('issueDescription').value.trim();
         const isCritical = document.getElementById('issueCritical').checked;
         const photos = getPhotoData();

        if (name && location) {
            updateIssueEdit(issueId, name, location, description, isCritical, photos);
            const modalEl = document.getElementById('addIssueModal');
            const handleTransitionEnd = (ev) => {
                if (ev.target === modalEl && ev.propertyName === 'opacity') {
                    modalEl.removeEventListener('transitionend', handleTransitionEnd);
                    const submitBtn = document.getElementById('submitIssueBtn');
                    const toggleResolvedBtn = document.getElementById('toggleResolvedBtn');
                    if (submitBtn) {
                        submitBtn.textContent = 'Dodaj usterkę';
                    }
                    if (toggleResolvedBtn) {
                        toggleResolvedBtn.style.display = 'none';
                    }
                }
            };
          modalEl.addEventListener('transitionend', handleTransitionEnd);
          modalEl.classList.remove('active');
          document.getElementById('addIssueForm').reset();
          const submitAndPlaceBtn = document.getElementById('submitAndPlaceIssueBtn');
          if (submitAndPlaceBtn) {
              submitAndPlaceBtn.style.display = 'none';
          }
          clearPhotoPreview();
          form.onsubmit = null;
          currentPropertyId = null;
          isEditMode = false;

          if (isInPropertyModal) {
              window.renderPropertyIssues(issue.propertyId);
          }

          const mapPropId = returnToMapAfterEditPropertyId;
          returnToMapAfterEditPropertyId = null;
          if (mapPropId) {
              openFloorplanMapModal(mapPropId);
          }
        }
    };

      // "Gotowe + Umieść" button in edit mode: save and go to map
       if (submitAndPlaceBtn) {
           // Create a handler function for this edit session
           const handleEditSubmitAndPlace = function(e) {
               e.preventDefault();
               const name = document.getElementById('issueName').value.trim();
               const location = document.getElementById('issueLocation').value.trim();
               const description = document.getElementById('issueDescription').value.trim();
               const isCritical = document.getElementById('issueCritical').checked;
               const photos = getPhotoData();

               if (name && location) {
                   updateIssueEdit(issueId, name, location, description, isCritical, photos);
                   const modalEl = document.getElementById('addIssueModal');
                    const handleTransitionEnd = (ev) => {
                        if (ev.target === modalEl && ev.propertyName === 'opacity') {
                            modalEl.removeEventListener('transitionend', handleTransitionEnd);
                            const submitBtn = document.getElementById('submitIssueBtn');
                            if (submitBtn) {
                                submitBtn.textContent = 'Dodaj usterkę';
                            }
                        }
                    };
                   modalEl.addEventListener('transitionend', handleTransitionEnd);
                   modalEl.classList.remove('active');
                   document.getElementById('addIssueForm').reset();
                   clearPhotoPreview();
                   form.onsubmit = null;
                   currentPropertyId = null;
                   isEditMode = false;

                   if (isInPropertyModal) {
                       window.renderPropertyIssues(issue.propertyId);
                   }

                   returnToMapAfterEditPropertyId = null;
                   // Open map in single-pin placement mode for this issue
                   activePinIssueId = issueId;
                   openFloorplanMapModal(issue.propertyId, issueId);
               }
           };
           
           // Clear existing onclick handler and set the new one
           submitAndPlaceBtn.onclick = handleEditSubmitAndPlace;
       }

      document.getElementById('closeIssueModal').onclick = function() {
          const modalEl = document.getElementById('addIssueModal');
          const handleTransitionEnd = (e) => {
              if (e.target === modalEl && e.propertyName === 'opacity') {
                  modalEl.removeEventListener('transitionend', handleTransitionEnd);
                  const submitBtn = document.getElementById('submitIssueBtn');
                  const toggleResolvedBtn = document.getElementById('toggleResolvedBtn');
                  if (submitBtn) {
                      submitBtn.textContent = 'Dodaj usterkę';
                  }
                  if (toggleResolvedBtn) {
                      toggleResolvedBtn.style.display = 'none';
                  }
              }
          };
          modalEl.addEventListener('transitionend', handleTransitionEnd);
          modalEl.classList.remove('active');
          document.getElementById('addIssueForm').reset();
          form.onsubmit = null;
          currentPropertyId = null;
          isEditMode = false;
          returnToMapAfterEditPropertyId = null;
          clearPhotoPreview();
          if (returnToMapPropertyId) {
              openFloorplanMapModal(returnToMapPropertyId);
          }
      };

      document.getElementById('cancelAddIssue').onclick = function() {
          const modalEl = document.getElementById('addIssueModal');
          const handleTransitionEnd = (e) => {
              if (e.target === modalEl && e.propertyName === 'opacity') {
                  modalEl.removeEventListener('transitionend', handleTransitionEnd);
                  const submitBtn = document.getElementById('submitIssueBtn');
                  const toggleResolvedBtn = document.getElementById('toggleResolvedBtn');
                  if (submitBtn) {
                      submitBtn.textContent = 'Dodaj usterkę';
                  }
                  if (toggleResolvedBtn) {
                      toggleResolvedBtn.style.display = 'none';
                  }
              }
          };
          modalEl.addEventListener('transitionend', handleTransitionEnd);
          modalEl.classList.remove('active');
          document.getElementById('addIssueForm').reset();
          const submitAndPlaceBtn = document.getElementById('submitAndPlaceIssueBtn');
          if (submitAndPlaceBtn) {
              submitAndPlaceBtn.style.display = 'none';
          }
          form.onsubmit = null;
          currentPropertyId = null;
          isEditMode = false;
          returnToMapAfterEditPropertyId = null;
          clearPhotoPreview();
          if (returnToMapPropertyId) {
              openFloorplanMapModal(returnToMapPropertyId);
          }
      };

     document.getElementById('issueName').focus();
 }

function updateIssue(issueId, name, location, description, isCritical, photos) {
     const index = issues.findIndex(i => i.id === issueId);
     if (index === -1) return;
     
     issues[index] = {
         ...issues[index],
         name: name,
         location: location,
         description: description,
         status: isCritical ? 'critical' : 'inProgress',
         photos: photos || [],
         updatedAt: new Date().toISOString()
     };
     
     saveIssues();
     updatePropertyIssueCounts();
     updateStats();
     renderIssuesList();
     renderProperties();
}

/**
 * Update issue while preserving "resolved" status if it was set via toggle button.
 * Only recalculate status to 'critical' or 'inProgress' if currently not 'resolved'.
 */
function updateIssueEdit(issueId, name, location, description, isCritical, photos) {
     const index = issues.findIndex(i => i.id === issueId);
     if (index === -1) return;
     
     const currentIssue = issues[index];
     // Preserve 'resolved' status; otherwise update based on isCritical flag
     const newStatus = currentIssue.status === 'resolved' 
         ? 'resolved' 
         : (isCritical ? 'critical' : 'inProgress');
     
     issues[index] = {
         ...issues[index],
         name: name,
         location: location,
         description: description,
         status: newStatus,
         photos: photos || [],
         updatedAt: new Date().toISOString()
     };
     
     saveIssues();
     updatePropertyIssueCounts();
     updateStats();
     renderIssuesList();
     renderProperties();
}

/** Update issue status (resolved/unresolved) */
function updateIssueStatus(issueId, newStatus) {
     const index = issues.findIndex(i => i.id === issueId);
     if (index === -1) return;
     
     issues[index] = {
         ...issues[index],
         status: newStatus,
         updatedAt: new Date().toISOString()
     };
     
     saveIssues();
     updatePropertyIssueCounts();
     updateStats();
     renderIssuesList();
     renderProperties();
}

// ─── Floorplan Map ────────────────────────────────────────────────────────────

/**
 * Open the map modal for a given property.
 * If activePinIssueId is already set (post-save flow), the modal opens in
 * single-pin placement mode — other pins are dimmed.
 */
function openFloorplanMapModal(propertyId, pinIssueId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property || !property.floorplanPhoto) {
        alert('Dodaj plan mieszkania, aby korzystać z mapy usterek.');
        return;
    }

    currentMapPropertyId = propertyId;
    if (pinIssueId !== undefined) activePinIssueId = pinIssueId;

    const modal        = document.getElementById('floorplanMapModal');
    const titleEl      = document.getElementById('floorplanMapTitle');
    const mapImg       = document.getElementById('floorplanMapImg');
    const noImage      = document.getElementById('mapNoImage');
    const container    = document.getElementById('floorplanMapContainer');
    const modeToggle   = document.getElementById('mapModeToggle');
    const modeLabel    = document.getElementById('mapModeLabel');
    const hint         = document.getElementById('mapPinHint');

    titleEl.textContent = `Mapa usterek — ${property.name}`;

    // Default to view mode; switch to edit mode when placing a new pin
    if (activePinIssueId !== null) {
        mapMode = 'edit';
        modeToggle.checked = true;
        modeLabel.textContent = 'Tryb edycji';
        container.classList.remove('view-mode');
        hint.classList.add('visible');
    } else {
        mapMode = 'view';
        modeToggle.checked = false;
        modeLabel.textContent = 'Tryb widoku';
        container.classList.add('view-mode');
        hint.classList.remove('visible');
    }

    openModalWithAutoClose('floorplanMapModal');

    // Load image and render pins after load
    noImage.style.display = 'none';
    mapImg.style.display = 'block';

    // Remove previous handlers
    mapImg.onload  = null;
    mapImg.onerror = null;

    mapImg.onload = function() {
        renderMapPins(propertyId, activePinIssueId);
    };
    mapImg.onerror = function() {
        mapImg.style.display = 'none';
        noImage.style.display = 'flex';
    };

    // Set src AFTER attaching handlers
    mapImg.src = property.floorplanPhoto;

    // If image was already cached, onload won't fire — call manually
    if (mapImg.complete && mapImg.naturalWidth > 0) {
        renderMapPins(propertyId, activePinIssueId);
    }
}

/**
 * Render all pins for a property onto the map container.
 * @param {number} propertyId
 * @param {number|null} highlightIssueId — if set, this pin is bright, others dimmed
 */
function renderMapPins(propertyId, highlightIssueId) {
    const container = document.getElementById('floorplanMapContainer');
    if (!container) return;

    // Remove old pins (but keep tooltip and hint)
    container.querySelectorAll('.map-pin').forEach(el => el.remove());

    const propertyIssues = issues.filter(i =>
        parseInt(i.propertyId) === parseInt(propertyId) &&
        i.pinPosition &&
        typeof i.pinPosition.x === 'number' &&
        typeof i.pinPosition.y === 'number'
    );

    propertyIssues.forEach(issue => {
        const pin = document.createElement('div');

        let colorClass = 'pin-normal';
        if (issue.status === 'critical')  colorClass = 'pin-critical';
        if (issue.status === 'resolved')  colorClass = 'pin-resolved';

        pin.className = `map-pin ${colorClass}`;
        pin.dataset.issueId = issue.id;
        pin.style.left = `${issue.pinPosition.x}%`;
        pin.style.top  = `${issue.pinPosition.y}%`;

        if (highlightIssueId !== null && issue.id !== highlightIssueId) {
            pin.classList.add('dimmed');
        }

        // Tooltip: mouseenter / mouseleave
        pin.addEventListener('mouseenter', (e) => {
            showPinTooltip(issue, pin, container, pin);
        });
        pin.addEventListener('mouseleave', () => {
            hidePinTooltip();
        });

        // View mode: click opens issue edit form
        pin.addEventListener('click', (e) => {
            if (isDraggingPin) return;
            if (mapMode === 'view') {
                e.stopPropagation();
                const mapPropId = currentMapPropertyId;
                openEditIssueModal(issue.id, mapPropId);
            }
        });

        // Edit mode: drag with pointer events
        if (mapMode === 'edit' && !pin.classList.contains('dimmed')) {
            attachPinDrag(pin, issue, container);
        }

        container.appendChild(pin);
    });

    // Render reserve sidebar
    renderReservePins(propertyId);
}

/**
 * Render reserve sidebar with unpinned issues for current property
 */
function renderReservePins(propertyId) {
    const list = document.getElementById('mapReserveList');
    const count = document.getElementById('mapReserveCount');
    if (!list) return;

    // Clear old items
    list.innerHTML = '';

    // Get issues without pinPosition
    const unpinnedIssues = issues.filter(i =>
        parseInt(i.propertyId) === parseInt(propertyId) &&
        (!i.pinPosition || typeof i.pinPosition.x !== 'number')
    );

    // Update counter
    if (count) count.textContent = unpinnedIssues.length;

    if (unpinnedIssues.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'map-reserve-empty';
        emptyState.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
                <path d="M16 6L8 14L4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Wszystkie usterki<br>umieszczone</span>
        `;
        list.appendChild(emptyState);
        return;
    }

    // Sort by creation date (newest first)
    const sortedIssues = [...unpinnedIssues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedIssues.forEach((issue, index) => {
        const reservePin = document.createElement('div');
        
        let colorClass = 'pin-normal';
        if (issue.status === 'critical')  colorClass = 'pin-critical';
        if (issue.status === 'resolved')  colorClass = 'pin-resolved';

        reservePin.className = 'map-reserve-pin';
        reservePin.dataset.issueId = issue.id;
        reservePin.dataset.reserveIndex = index;

        reservePin.innerHTML = `
            <div class="map-reserve-pin-indicator ${colorClass}"></div>
            <div class="map-reserve-pin-text" title="${escapeHtml(issue.name)}">${escapeHtml(issue.name)}</div>
        `;

        // Only attach drag in edit mode
        if (mapMode === 'edit') {
            reservePin.draggable = true;
            attachReservePinDrag(reservePin, issue);
        } else {
            reservePin.draggable = false;
        }

        // Click to edit issue (in view mode)
        reservePin.addEventListener('click', (e) => {
            if (mapMode === 'view' && !isDraggingPin) {
                const mapPropId = currentMapPropertyId;
                openEditIssueModal(issue.id, mapPropId);
            }
        });

        list.appendChild(reservePin);
    });

    // Enable reordering within reserve list
    if (mapMode === 'edit') {
        enableReserveListReordering(list);
    }
}

/**
 * Attach drag handlers to a reserve pin to move it onto the map
 */
function attachReservePinDrag(reservePin, issue) {
    reservePin.addEventListener('dragstart', (e) => {
        if (mapMode !== 'edit') {
            e.preventDefault();
            return;
        }
        isDraggingPin = true;
        reservePin.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', issue.id.toString());
        e.dataTransfer.setData('issueId', issue.id.toString());
        e.dataTransfer.setData('source', 'reserve');
    });

    reservePin.addEventListener('dragend', (e) => {
        reservePin.classList.remove('dragging');
        setTimeout(() => { isDraggingPin = false; }, 50);
    });
}

/**
 * Enable reordering reserve pins by dragging within the list
 */
function enableReserveListReordering(list) {
    let draggedElement = null;

    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = list.querySelector('.map-reserve-pin.dragging');
        if (!draggingItem) return;

        const siblings = [...list.querySelectorAll('.map-reserve-pin:not(.dragging)')];
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            return e.clientY < box.top + box.height / 2;
        });

        if (nextSibling) {
            list.insertBefore(draggingItem, nextSibling);
        } else {
            list.appendChild(draggingItem);
        }
    });
}

/** Show tooltip near pin */
function showPinTooltip(issue, pin, container, pinEl) {
    const tooltip  = document.getElementById('pinTooltip');
    const nameEl   = document.getElementById('pinTooltipName');
    const statEl   = document.getElementById('pinTooltipStatus');
    const dotEl    = document.getElementById('pinTooltipDot');
    if (!tooltip || !nameEl) return;

    const dotColor = issue.status === 'critical' ? '#C45C3E'
                   : issue.status === 'resolved'  ? '#7A9E7A'
                   : '#D4A24C';

    if (dotEl) dotEl.style.background = dotColor;
    nameEl.textContent = escapeHtml(issue.name);

    // Only show status text for critical issues
    if (issue.status === 'critical') {
        statEl.textContent = 'Krytyczne';
        statEl.style.display = 'block';
    } else {
        statEl.style.display = 'none';
    }

    // Read the pin's current CSS position (reflects drag, not stale saved data)
    const xPct = pinEl ? parseFloat(pinEl.style.left) : issue.pinPosition.x;
    const yPct = pinEl ? parseFloat(pinEl.style.top)  : issue.pinPosition.y;

    // If pin is in the right half, anchor tooltip to the right edge
    const leftOffset  = xPct > 60 ? 'auto'                          : `calc(${xPct}% + 18px)`;
    const rightOffset = xPct > 60 ? `calc(${100 - xPct}% + 18px)` : 'auto';
    // If pin is near the top, show tooltip below it; near the bottom, shift it higher
    let topOffset;
    if (yPct < 20) {
        topOffset = `calc(${yPct}% + 20px)`;
    } else if (yPct > 75) {
        topOffset = `calc(${yPct}% - 66px)`;
    } else {
        topOffset = `calc(${yPct}% - 54px)`;
    }

    tooltip.style.left   = leftOffset;
    tooltip.style.right  = rightOffset;
    tooltip.style.top    = topOffset;
    tooltip.style.bottom = 'auto';

    tooltip.classList.add('visible');
}

function hidePinTooltip() {
    const tooltip = document.getElementById('pinTooltip');
    if (tooltip) tooltip.classList.remove('visible');
}

/**
 * Attach pointer-based drag to a pin element.
 */
function attachPinDrag(pin, issue, container) {
    pin.addEventListener('pointerdown', (e) => {
        if (mapMode !== 'edit') return;
        e.stopPropagation();
        e.preventDefault();

        isDraggingPin = false; // will be set true after first move
        let didMove = false;

        pin.setPointerCapture(e.pointerId);
        pin.classList.add('dragging');
        hidePinTooltip();

        function onMove(ev) {
            didMove = true;
            isDraggingPin = true;
            const rect = container.getBoundingClientRect();
            const img  = container.querySelector('.floorplan-map-img');
            const imgRect = img ? img.getBoundingClientRect() : rect;

            let x = ((ev.clientX - imgRect.left) / imgRect.width)  * 100;
            let y = ((ev.clientY - imgRect.top)  / imgRect.height) * 100;

            // Clamp to image bounds
            x = Math.max(1, Math.min(99, x));
            y = Math.max(1, Math.min(99, y));

            pin.style.left = `${x}%`;
            pin.style.top  = `${y}%`;
        }

        function onUp(ev) {
            pin.classList.remove('dragging');
            pin.removeEventListener('pointermove', onMove);
            pin.removeEventListener('pointerup',   onUp);

            if (didMove) {
                const rect   = container.getBoundingClientRect();
                const img    = container.querySelector('.floorplan-map-img');
                const imgRect = img ? img.getBoundingClientRect() : rect;

                const reserveSidebar = document.getElementById('mapReserveSidebar');
                const sidebarRect = reserveSidebar ? reserveSidebar.getBoundingClientRect() : null;

                // Check if dropped onto reserve sidebar
                if (sidebarRect && 
                    ev.clientX >= sidebarRect.left && 
                    ev.clientX <= sidebarRect.right &&
                    ev.clientY >= sidebarRect.top && 
                    ev.clientY <= sidebarRect.bottom) {
                    // Remove pin from map (clear pinPosition)
                    const idx = issues.findIndex(i => i.id === issue.id);
                    if (idx !== -1) {
                        issues[idx] = { ...issues[idx], pinPosition: null };
                        saveIssues();
                        renderMapPins(currentMapPropertyId, activePinIssueId);
                    }
                } else {
                    // Update pin position on map
                    let x = ((ev.clientX - imgRect.left) / imgRect.width)  * 100;
                    let y = ((ev.clientY - imgRect.top)  / imgRect.height) * 100;
                    x = Math.max(1, Math.min(99, x));
                    y = Math.max(1, Math.min(99, y));

                    // Persist
                    const idx = issues.findIndex(i => i.id === issue.id);
                    if (idx !== -1) {
                        issues[idx] = { ...issues[idx], pinPosition: { x, y } };
                        saveIssues();
                    }
                }
            }

            // Reset global flag after a short delay (prevents click handler firing)
            setTimeout(() => { isDraggingPin = false; }, 50);
        }

        pin.addEventListener('pointermove', onMove);
        pin.addEventListener('pointerup',   onUp);
    });
}

/**
 * Handle click on the map image in edit mode to place a new pin.
 */
function handleMapClick(e) {
    if (mapMode !== 'edit') return;
    if (isDraggingPin) return;
    if (e.target.classList.contains('map-pin')) return; // handled by pin itself

    const container = document.getElementById('floorplanMapContainer');
    const img       = document.getElementById('floorplanMapImg');
    if (!img || img.naturalWidth === 0) return;

    const imgRect = img.getBoundingClientRect();
    let x = ((e.clientX - imgRect.left) / imgRect.width)  * 100;
    let y = ((e.clientY - imgRect.top)  / imgRect.height) * 100;
    x = Math.max(1, Math.min(99, x));
    y = Math.max(1, Math.min(99, y));

    if (activePinIssueId !== null) {
        // Place pin for the pre-selected issue
        const idx = issues.findIndex(i => i.id === activePinIssueId);
        if (idx !== -1) {
            issues[idx] = { ...issues[idx], pinPosition: { x, y } };
            saveIssues();
        }
        activePinIssueId = null;

        // Hide hint
        const hint = document.getElementById('mapPinHint');
        if (hint) hint.classList.remove('visible');

        // Re-render all pins normally
        renderMapPins(currentMapPropertyId, null);
    } else {
        // Open add issue modal pre-bound to this property
        // Store pending pin coords for after save
        const mapPropertyId = currentMapPropertyId;
        window._pendingPinPosition = { x, y };
        returnToMapAfterEditPropertyId = mapPropertyId;
        window.openAddIssueModal(mapPropertyId);
    }
}

function closeFloorplanMapModal() {
    closeModalTracked('floorplanMapModal');
    activePinIssueId = null;
    currentMapPropertyId = null;
    isDraggingPin = false;
}

/** Initialize map modal close/toggle handlers (called once on DOMContentLoaded) */
function initFloorplanMapModal() {
    const modal       = document.getElementById('floorplanMapModal');
    const closeBtn    = document.getElementById('closeFloorplanMapModal');
    const closeActBtn = document.getElementById('closeFloorplanMapBtn');
    const modeToggle  = document.getElementById('mapModeToggle');
    const modeLabel   = document.getElementById('mapModeLabel');
    const container   = document.getElementById('floorplanMapContainer');
    const reserveSidebar = document.getElementById('mapReserveSidebar');

    if (!modal) return;

    // Enable reserve sidebar as drop target
    if (reserveSidebar) {
        reserveSidebar.addEventListener('dragover', (e) => {
            if (mapMode === 'edit') {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                reserveSidebar.classList.add('drag-over');
            }
        });

        reserveSidebar.addEventListener('dragleave', (e) => {
            // Only remove if we're actually leaving the sidebar (not entering a child)
            if (!reserveSidebar.contains(e.relatedTarget)) {
                reserveSidebar.classList.remove('drag-over');
            }
        });

        reserveSidebar.addEventListener('drop', (e) => {
            e.preventDefault();
            reserveSidebar.classList.remove('drag-over');
            // Handled by pin drag logic
        });
    }

    // Close buttons
    function doClose() {
        closeFloorplanMapModal();
    }

    if (closeBtn)    closeBtn.addEventListener('click', doClose);
    if (closeActBtn) closeActBtn.addEventListener('click', doClose);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) doClose();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) doClose();
    });

    // Mode toggle
    if (modeToggle) {
        modeToggle.addEventListener('change', () => {
            mapMode = modeToggle.checked ? 'edit' : 'view';
            modeLabel.textContent = mapMode === 'edit' ? 'Tryb edycji' : 'Tryb widoku';
            if (container) container.classList.toggle('view-mode', mapMode === 'view');
            const hint = document.getElementById('mapPinHint');
            if (hint && mapMode === 'view') hint.classList.remove('visible');
            // Re-render to update drag/click behaviour
            if (currentMapPropertyId) renderMapPins(currentMapPropertyId, activePinIssueId);
        });
    }

    // Map click (for placing new pins)
    if (container) {
        container.addEventListener('click', handleMapClick);
        
        // Enable drop from reserve sidebar
        container.addEventListener('dragover', (e) => {
            if (mapMode === 'edit') {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }
        });

        container.addEventListener('drop', (e) => {
            if (mapMode !== 'edit') return;
            e.preventDefault();

            const source = e.dataTransfer.getData('source');
            const issueId = parseInt(e.dataTransfer.getData('issueId'));
            
            if (source === 'reserve' && issueId) {
                const img = document.getElementById('floorplanMapImg');
                if (!img || img.naturalWidth === 0) return;

                const imgRect = img.getBoundingClientRect();
                let x = ((e.clientX - imgRect.left) / imgRect.width)  * 100;
                let y = ((e.clientY - imgRect.top)  / imgRect.height) * 100;
                x = Math.max(1, Math.min(99, x));
                y = Math.max(1, Math.min(99, y));

                // Update issue with pin position
                const idx = issues.findIndex(i => i.id === issueId);
                if (idx !== -1) {
                    issues[idx] = { ...issues[idx], pinPosition: { x, y } };
                    saveIssues();
                    renderMapPins(currentMapPropertyId, activePinIssueId);
                }
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ISSUES PAGE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function initIssuesPage() {
    const sortDropdown = document.getElementById('issuesSortDropdown');
    const statusFilters = document.querySelectorAll('.status-filter');

    // Zmiana sortu
    if (sortDropdown) {
        sortDropdown.addEventListener('change', () => renderIssuesPage());
    }

    // Zmiana filtrów statusów
    statusFilters.forEach(filter => {
        filter.addEventListener('change', () => renderIssuesPage());
    });

    // Klik na nagłówek grupy (złożenie/rozwinięcie)
    document.addEventListener('click', (e) => {
        const groupHeader = e.target.closest('.issues-group-header');
        if (groupHeader) {
            toggleIssueGroup(groupHeader);
        }
    });

    // Akcje usterek (edycja, usunięcie, mapa)
    document.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.issue-action-btn');
        if (actionBtn && actionBtn.closest('.issues-group-list')) {
            const action = actionBtn.dataset.action;
            const issueItem = actionBtn.closest('.issue-item');
            const issueId = issueItem ? parseInt(issueItem.dataset.issueId) : null;
            
            if (!issueId) return;
            
            if (action === 'edit') {
                openEditIssueModal(issueId);
            } else if (action === 'delete') {
                const issue = issues.find(i => i.id === issueId);
                if (issue) {
                    window.showDeleteConfirmation(issueId, issue.name, () => {
                        deleteIssue(issueId);
                        renderIssuesPage();
                    }, 'issue');
                }
            } else if (action === 'map') {
                const issue = issues.find(i => i.id === issueId);
                if (issue) {
                    openFloorplanMapModal(issue.propertyId);
                }
            }
        }
    });

    // Klik na zdjęcie
    document.addEventListener('click', (e) => {
        const photoPreview = e.target.closest('.issue-photo-preview');
        if (photoPreview && photoPreview.closest('.issues-group-list')) {
            e.stopPropagation();
            const issueItem = photoPreview.closest('.issue-item');
            const issueId = issueItem ? parseInt(issueItem.dataset.issueId) : null;
            if (!issueId) return;
            
            const issue = issues.find(i => i.id === issueId);
            if (issue && issue.photos && issue.photos.length > 0) {
                window.openImageViewerModal(issue.photos[0]);
            }
        }
    });

    // Klik na usterkę aby edytować
    document.addEventListener('click', (e) => {
        const issueItem = e.target.closest('.issues-group-list .issue-item');
        if (issueItem && !e.target.closest('.issue-action-btn') && !e.target.closest('.issue-photo-preview')) {
            const issueId = parseInt(issueItem.dataset.issueId);
            if (issueId) {
                openEditIssueModal(issueId);
            }
        }
    });
}

function renderIssuesPage() {
    const sortValue = document.getElementById('issuesSortDropdown')?.value || 'date-desc';
    const activeFilters = Array.from(document.querySelectorAll('.status-filter:checked'))
        .map(el => el.value);

    // Filtruj usterki
    let filtered = issues.filter(issue => activeFilters.includes(issue.status));

    // Sortuj
    filtered = sortIssues(filtered, sortValue);

    // Grupuj po nieruchomościach
    const grouped = groupIssuesByProperty(filtered);

    // Render
    const container = document.getElementById('issuesListGrouped');
    const emptyState = document.getElementById('issuesPageEmpty');
    const countEl = document.getElementById('issuesCountTotal');
    
    if (!container) return;
    
    container.innerHTML = '';

    if (filtered.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (countEl) countEl.textContent = '0';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (countEl) countEl.textContent = filtered.length;

    for (const propertyId in grouped) {
        const property = properties.find(p => p.id === parseInt(propertyId));
        if (!property) continue;
        
        const groupIssues = grouped[propertyId];

        const groupEl = createIssueGroupElement(property, groupIssues);
        container.appendChild(groupEl);
    }
}

function groupIssuesByProperty(issuesList) {
    const grouped = {};
    issuesList.forEach(issue => {
        const propId = parseInt(issue.propertyId);
        if (!grouped[propId]) {
            grouped[propId] = [];
        }
        grouped[propId].push(issue);
    });
    return grouped;
}

function sortIssues(issuesList, sortBy) {
    const sorted = [...issuesList];

    switch (sortBy) {
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name, 'pl'));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name, 'pl'));
            break;
        case 'date-asc':
            sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'date-desc':
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'status':
            const statusOrder = { 'critical': 0, 'inProgress': 1, 'resolved': 2 };
            sorted.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));
            break;
        default:
            break;
    }

    return sorted;
}

function createIssueGroupElement(property, groupIssues) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'issues-group';
    groupDiv.dataset.propertyId = property.id;
    groupDiv.dataset.collapsed = 'false';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'issues-group-header';
    headerDiv.setAttribute('aria-expanded', 'true');
    
    const countText = groupIssues.length === 1 ? 'usterka' 
                    : groupIssues.length < 5 ? 'usterki' 
                    : 'usterek';
    
    headerDiv.innerHTML = `
        <button class="group-toggle-btn" aria-expanded="true">
            <svg class="toggle-icon" width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M5 7L10 12L15 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
        <div class="group-header-content">
            <h3 class="group-title">${escapeHtml(property.name)}</h3>
            <span class="group-count">(${groupIssues.length} ${countText})</span>
        </div>
    `;

    const listDiv = document.createElement('div');
    listDiv.className = 'issues-group-list';

    groupIssues.forEach(issue => {
        const itemEl = createIssueItemElement(issue);
        listDiv.appendChild(itemEl);
    });

    groupDiv.appendChild(headerDiv);
    groupDiv.appendChild(listDiv);

    return groupDiv;
}

function createIssueItemElement(issue) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'issue-item';
    itemDiv.dataset.issueId = issue.id;

    const statusColor = getStatusColor(issue.status);
    const statusLabel = getStatusLabel(issue.status);
    const badgeClass = `badge-${issue.status}`;

    const createdDate = new Date(issue.createdAt);
    const dateStr = createdDate.toLocaleDateString('pl-PL', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });

    const hasPhotos = issue.photos && issue.photos.length > 0;
    const photoCountStr = hasPhotos ? `${issue.photos.length}` : '';
    const photoLabel = hasPhotos ? (issue.photos.length === 1 ? 'zdjęcie' : 'zdjęcia') : '';

    itemDiv.innerHTML = `
        <div class="issue-status-dot" style="background: ${statusColor};"></div>
        
        <div class="issue-content">
            <div class="issue-header">
                <h4 class="issue-title">${escapeHtml(issue.name)}</h4>
                <span class="issue-badge ${badgeClass}">${statusLabel}</span>
            </div>
            <div class="issue-meta">
                <span class="issue-location">${escapeHtml(issue.location || 'Brak lokalizacji')}</span>
                <span class="issue-date">${dateStr}</span>
            </div>
            ${issue.description ? `<p class="issue-description">${escapeHtml(issue.description)}</p>` : ''}
        </div>

        ${hasPhotos ? `
            <div class="issue-photo-preview" title="${photoCountStr} ${photoLabel}">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M3 14L7 10L10 13L17 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="7.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
            </div>
        ` : ''}

        <div class="issue-actions">
            <button class="issue-action-btn" title="Mapa" data-action="map">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="10" cy="10" r="2" fill="currentColor"/>
                </svg>
            </button>
            <button class="issue-action-btn" title="Edytuj" data-action="edit">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M3 17L13 7L15 5L19 1M3 17L5 19L3 17Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </button>
            <button class="issue-action-btn" title="Usuń" data-action="delete">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M6 3V15H14V3M4 3H16M8 3V1H12V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `;

    return itemDiv;
}

function toggleIssueGroup(headerEl) {
    const groupEl = headerEl.closest('.issues-group');
    if (!groupEl) return;
    
    const isExpanded = headerEl.getAttribute('aria-expanded') === 'true';
    
    headerEl.setAttribute('aria-expanded', !isExpanded);
    groupEl.dataset.collapsed = isExpanded;
}

function getStatusColor(status) {
    switch (status) {
        case 'critical':
            return 'var(--color-critical)';
        case 'inProgress':
            return 'var(--color-warning)';
        case 'resolved':
            return 'var(--color-success)';
        default:
            return 'var(--color-border)';
    }
}

function getStatusLabel(status) {
    switch (status) {
        case 'critical':
            return 'KRYTYCZNE';
        case 'inProgress':
            return 'W TRAKCIE';
        case 'resolved':
            return 'GOTOWE';
        default:
            return status.toUpperCase();
    }
}

function initIssuesNavigation() {
    // Sidebar link "Przegląd"
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        if (link.textContent.trim().includes('Przegląd')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showSection('overview');
            });
        } else if (link.textContent.trim().includes('Usterki')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showSection('issuesPage');
            });
        }
    });

    // Bottom nav "Przegląd"
    const overviewBottomNavItem = document.querySelector('.bottom-nav-item[data-section="overview"]');
    if (overviewBottomNavItem) {
        overviewBottomNavItem.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('overview');
        });
    }

    // Bottom nav "Usterki"
    const issuesBottomNavItem = document.querySelector('.bottom-nav-item[data-section="issues"]');
    if (issuesBottomNavItem) {
        issuesBottomNavItem.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('issuesPage');
        });
    }
}

function showSection(sectionName) {
    // Ukryj wszystkie główne sekcje
    const overviewSection = document.getElementById('overviewSection');
    const issuesPageSection = document.getElementById('issuesPageSection');
    const dashboardHeader = document.querySelector('.dashboard-header');
    
    if (overviewSection) overviewSection.style.display = 'none';
    if (issuesPageSection) issuesPageSection.style.display = 'none';
    
    // Pokaż wybraną sekcję
    if (sectionName === 'issuesPage') {
        // Ukryj header dashboardu, Issues Page ma własny
        if (dashboardHeader) dashboardHeader.style.display = 'none';
        if (issuesPageSection) {
            issuesPageSection.style.display = 'block';
            renderIssuesPage();
        }
    } else if (sectionName === 'overview') {
        // Pokaż header dashboardu
        if (dashboardHeader) dashboardHeader.style.display = 'flex';
        if (overviewSection) overviewSection.style.display = 'block';
    }
    
    // Aktualizuj active state w nawigacji
    updateActiveNavigation(sectionName);
}

function updateActiveNavigation(sectionName) {
    // Sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (sectionName === 'issuesPage' && link.textContent.trim().includes('Usterki')) {
            link.classList.add('active');
        } else if (sectionName === 'overview' && link.textContent.trim().includes('Przegląd')) {
            link.classList.add('active');
        }
    });

    // Bottom nav
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeBottomNav = document.querySelector(
        `.bottom-nav-item[data-section="${sectionName === 'issuesPage' ? 'issues' : 'overview'}"]`
    );
    if (activeBottomNav) activeBottomNav.classList.add('active');
}

// ─── Settings Modal ───────────────────────────────────────────────────────────

function applyTheme(theme) {
    if (theme === 'default' || !theme) {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

function updateThemeCards(activeTheme) {
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.toggle('active', card.dataset.theme === activeTheme);
    });
}

function initSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;

    // Apply saved theme on startup
    let savedTheme = 'default';
    try {
        savedTheme = localStorage.getItem('propcheck_theme') || 'default';
    } catch(e) {}
    applyTheme(savedTheme);
    updateThemeCards(savedTheme);

    // Open from sidebar [data-open-settings] links
    document.querySelectorAll('[data-open-settings]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openModalWithAutoClose('settingsModal');
        });
    });

    function closeSettingsModal() {
        closeModalTracked('settingsModal');
    }

    // Close button
    const closeBtn = document.getElementById('closeSettingsModal');
    if (closeBtn) closeBtn.addEventListener('click', closeSettingsModal);

    // Close action button
    const closeActionBtn = document.getElementById('closeSettingsBtn');
    if (closeActionBtn) closeActionBtn.addEventListener('click', closeSettingsModal);

    // Backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSettingsModal();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeSettingsModal();
    });

    // Theme card selection
    document.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', () => {
            const theme = card.dataset.theme;
            applyTheme(theme);
            updateThemeCards(theme);
            try {
                localStorage.setItem('propcheck_theme', theme);
            } catch(e) {}
        });
    });

    // Purge button
    const purgeBtn = document.getElementById('devPurgeBtn');
    if (purgeBtn) {
        purgeBtn.addEventListener('click', () => {
            window.showDeleteConfirmation(
                null,
                'wszystkie dane (mieszkania i usterki)',
                () => {
                    try {
                        localStorage.removeItem('propcheck_properties');
                        localStorage.removeItem('propcheck_issues');
                    } catch(e) {}
                    properties = [];
                    issues = [];
                    renderProperties();
                    renderIssuesList();
                    updateStats();
                    closeSettingsModal();
                },
                'data'
            );
        });
    }

     // Populate button
     const populateBtn = document.getElementById('devPopulateBtn');
     if (populateBtn) {
         populateBtn.addEventListener('click', async () => {
             const originalText = populateBtn.textContent;
             populateBtn.disabled = true;
             populateBtn.textContent = 'Ładowanie grafik...';
             
             try {
                 await populateDemoData();
                 console.log('[Demo] Demo data populated successfully');
                 closeSettingsModal();
             } catch (err) {
                 console.error('[Demo] Failed to populate demo data:', err);
                 alert('Błąd podczas ładowania danych demo. Sprawdź konsolę.');
             } finally {
                 populateBtn.disabled = false;
                 populateBtn.textContent = originalText;
             }
         });
     }

    // Export button
    const exportBtn = document.getElementById('devExportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportData();
        });
    }

    // Import input
    const importInput = document.getElementById('devImportInput');
    if (importInput) {
        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            importData(file, closeSettingsModal);
            // Reset so the same file can be re-selected if needed
            importInput.value = '';
        });
    }
}

/**
 * Convert an image URL to data URI by loading it into an Image element and using Canvas
 * This avoids CORS issues with local files and fetch()
 * @param {string} url - Image URL/path
 * @returns {Promise<string|null>} Data URI or null
 */
function imageUrlToDataUri(url) {
    return new Promise((resolve) => {
        console.log(`[Demo] Loading ${url}...`);
        
        const img = new Image();
        
        // Timeout after 5 seconds
        const timeoutId = setTimeout(() => {
            console.error(`[Demo] Timeout loading ${url}`);
            img.onload = null;
            img.onerror = null;
            resolve(null);
        }, 5000);
        
        img.onload = function() {
            clearTimeout(timeoutId);
            console.log(`[Demo] Image loaded: ${url} (${img.width}x${img.height})`);
            
            try {
                // Create canvas and draw image
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error(`[Demo] Failed to get canvas context for ${url}`);
                    resolve(null);
                    return;
                }
                
                ctx.drawImage(img, 0, 0);
                
                // Convert to data URI (same format as manual upload)
                const dataUri = canvas.toDataURL('image/png');
                console.log(`[Demo] Converted ${url} to data URI (${Math.round(dataUri.length/1024)}KB)`);
                resolve(dataUri);
                
            } catch (err) {
                console.error(`[Demo] Canvas conversion failed for ${url}:`, err);
                resolve(null);
            }
        };
        
        img.onerror = function(err) {
            clearTimeout(timeoutId);
            console.error(`[Demo] Failed to load ${url}:`, err);
            resolve(null);
        };
        
        // Start loading - browser will load from same origin
        img.src = url;
    });
}

async function populateDemoData() {
     console.log('[Demo] Starting demo data population...');
     
     // Clear existing data
     properties = [];
     issues = [];

     // PNG floorplan paths (relative to dashboard.html location)
     const floorplanPaths = [
         'floorplans/floorplan-1.png',
         'floorplans/floorplan-2.png',
         'floorplans/floorplan-3.png',
         'floorplans/floorplan-4.png',
         'floorplans/floorplan-5.png'
     ];

     console.log('[Demo] Converting floorplan images to data URIs...');
     
     // Convert all images to data URIs in parallel
     const dataUris = await Promise.all(
         floorplanPaths.map(path => imageUrlToDataUri(path))
     );
     
     console.log('[Demo] Conversion complete. Results:', dataUris.map((uri, i) => 
         uri ? `${i+1}: ✓ (${Math.round(uri.length/1024)}KB)` : `${i+1}: ✗ failed`
     ));
     
     // Check if any conversions failed
     const failedCount = dataUris.filter(uri => !uri).length;
     if (failedCount > 0) {
         console.warn(`[Demo] Warning: ${failedCount} out of ${dataUris.length} floorplan images failed to load`);
         console.warn('[Demo] This may happen if files are missing or if you need to run this from a web server (not file://)');
     }

     // Demo properties with data URI floorplans (or null if conversion failed)
     properties = [
          { id: 1001, name: 'Apartament Wiśniowa 12/3', address: 'ul. Wiśniowa 12/3, Warszawa', floorplanPhoto: dataUris[0], issues: { critical: 1, inProgress: 4, resolved: 0 } },
          { id: 1002, name: 'Kawalerka Zielona 7', address: 'ul. Zielona 7, Kraków', floorplanPhoto: dataUris[1], issues: { critical: 1, inProgress: 4, resolved: 0 } },
          { id: 1003, name: 'Studio Słoneczna 23/A', address: 'ul. Słoneczna 23A, Gdańsk', floorplanPhoto: dataUris[2], issues: { critical: 0, inProgress: 4, resolved: 1 } },
          { id: 1004, name: 'Mieszkanie Lipowa 5/11', address: 'ul. Lipowa 5/11, Wrocław', floorplanPhoto: dataUris[3], issues: { critical: 1, inProgress: 3, resolved: 1 } },
          { id: 1005, name: 'Lokal Różana 18', address: 'ul. Różana 18, Poznań', floorplanPhoto: dataUris[4], issues: { critical: 1, inProgress: 3, resolved: 1 } }
     ];

     // Demo issues with pinPosition coordinates from the template
     issues = [
         // Wiśniowa 12/3
         { id: 2001, propertyId: 1001, name: 'Cieknący kran', location: 'Łazienka', description: 'Kran cieknie od tygodnia, wymaga wymiany uszczelki.', status: 'critical', createdAt: '2026-05-06T14:49:51.966Z', photos: [], pinPosition: { x: 7.601551983529971, y: 68.6407853109015 }, updatedAt: '2026-05-11T15:29:24.690Z' },
         { id: 2002, propertyId: 1001, name: 'Pęknięta płytka', location: 'Przedpokój', description: 'Płytka ceramiczna przy wejściu popękana.', status: 'inProgress', createdAt: '2026-05-01T14:49:51.966Z', photos: [], pinPosition: { x: 84.123841951065, y: 52.934567280683595 } },
         { id: 2003, propertyId: 1001, name: 'Skrzypiące drzwi', location: 'Sypialnia', description: 'Drzwi do sypialni skrzypią przy otwieraniu.', status: 'inProgress', createdAt: '2026-04-27T14:49:51.966Z', photos: [], pinPosition: { x: 54.90009765882756, y: 44.04068478164454 } },
         { id: 2004, propertyId: 1001, name: 'Zatkany odpływ', location: 'Łazienka', description: 'Odpływ w wannie zatkany, woda stoi.', status: 'inProgress', createdAt: '2026-05-08T14:49:51.966Z', photos: [], pinPosition: { x: 93.92139784094809, y: 77.34543626740782 }, updatedAt: '2026-05-11T16:23:16.100Z' },
         { id: 2005, propertyId: 1001, name: 'Uszkodzony kontakt', location: 'Kuchnia', description: 'Gniazdko elektryczne oderwane od ściany.', status: 'inProgress', createdAt: '2026-05-04T14:49:51.966Z', photos: [], pinPosition: { x: 90.20508353788898, y: 5.058987019898879 } },
         // Zielona 7
         { id: 2006, propertyId: 1002, name: 'Brak ciepłej wody', location: 'Łazienka', description: 'Bojler nie nagrzewa wody, wymaga serwisu.', status: 'critical', createdAt: '2026-05-09T14:49:51.966Z', photos: [], pinPosition: null },
         { id: 2007, propertyId: 1002, name: 'Odpadający tynk', location: 'Salon', description: 'Tynk odpada przy oknie, widoczne zawilgocenie.', status: 'inProgress', createdAt: '2026-04-21T14:49:51.966Z', photos: [], pinPosition: { x: 90.10554089709763, y: 87.78195488721805 } },
         { id: 2008, propertyId: 1002, name: 'Zepsuta żaluzja', location: 'Sypialnia', description: 'Żaluzja zewnętrzna nie chodzi na silniku.', status: 'inProgress', createdAt: '2026-05-03T14:49:51.966Z', photos: [], pinPosition: { x: 93.7994722955145, y: 22.36842105263158 } },
         { id: 2009, propertyId: 1002, name: 'Wilgoć na ścianie', location: 'Łazienka', description: 'Pleśń przy futrynie drzwi, konieczne osuszanie.', status: 'inProgress', createdAt: '2026-04-26T14:49:51.966Z', photos: [], pinPosition: { x: 9.102902374670185, y: 11.842105263157894 } },
         { id: 2010, propertyId: 1002, name: 'Cieknąca rura', location: 'Piwnica', description: 'Rura instalacji wodnej cieknie, ślady rdzy.', status: 'inProgress', createdAt: '2026-05-05T14:49:51.966Z', photos: [], pinPosition: { x: 36.80738786279684, y: 84.3984962406015 } },
         // Słoneczna 23/A
         { id: 2011, propertyId: 1003, name: 'Pęknięte okno', location: 'Salon', description: 'Szyba zespolona pęknięta, wymaga wymiany.', status: 'inProgress', createdAt: '2026-05-10T14:49:51.966Z', photos: [], pinPosition: { x: 6.081241586823976, y: 26.365795724465556 }, updatedAt: '2026-05-11T16:27:06.780Z' },
         { id: 2012, propertyId: 1003, name: 'Zepsuty zamek', location: 'Drzwi wejściowe', description: 'Zamek antywłamaniowy nie blokuje prawidłowo.', status: 'inProgress', createdAt: '2026-04-29T14:49:51.966Z', photos: [], pinPosition: { x: 41.89299759812073, y: 94.04548856278268 } },
         { id: 2013, propertyId: 1003, name: 'Dziurawy sufit', location: 'Sypialnia', description: 'Po ulewie pojawił się przeciek w suficie.', status: 'inProgress', createdAt: '2026-05-02T14:49:51.966Z', photos: [], pinPosition: { x: 21.960039063531024, y: 50.73048514625972 } },
         { id: 2014, propertyId: 1003, name: 'Niedziałający domofon', location: 'Wejście', description: 'Domofon nie reaguje na dzwonienie.', status: 'inProgress', createdAt: '2026-04-23T14:49:51.966Z', photos: [], pinPosition: { x: 48.48100931718003, y: 92.58777210164969 } },
         { id: 2015, propertyId: 1003, name: 'Spękana podłoga', location: 'Kuchnia', description: 'Panele podłogowe spękane przy zlewie.', status: 'resolved', createdAt: '2026-04-11T14:49:51.966Z', photos: [], pinPosition: null },
         // Lipowa 5/11
         { id: 2016, propertyId: 1004, name: 'Awaria ogrzewania', location: 'Cały lokal', description: 'Piec gazowy nie uruchamia się, brak ciepła.', status: 'critical', createdAt: '2026-05-10T14:49:51.966Z', photos: [], pinPosition: null, updatedAt: '2026-05-11T16:28:19.652Z' },
         { id: 2017, propertyId: 1004, name: 'Zepsuty kran', location: 'Kuchnia', description: 'Bateria kuchenna kapie po zakręceniu.', status: 'inProgress', createdAt: '2026-04-30T14:49:51.966Z', photos: [], pinPosition: { x: 52.536557039539666, y: 71.32889028044907 } },
         { id: 2018, propertyId: 1004, name: 'Pękająca ściana', location: 'Salon', description: 'Rysa przy oknie powiększa się.', status: 'inProgress', createdAt: '2026-04-19T14:49:51.966Z', photos: [], pinPosition: { x: 30.57593834133981, y: 92.226148409894 } },
         { id: 2019, propertyId: 1004, name: 'Niedziałające gniazdko', location: 'Sypialnia', description: 'Gniazdko przy łóżku nie ma napięcia.', status: 'inProgress', createdAt: '2026-05-07T14:49:51.966Z', photos: [], pinPosition: { x: 2.702845378239983, y: 34.97338641141477 } },
         { id: 2020, propertyId: 1004, name: 'Zalany sufit', location: 'Łazienka', description: 'Zalanie od góry naprawione przez administrację.', status: 'resolved', createdAt: '2026-03-27T14:49:51.966Z', photos: [], pinPosition: null },
         // Różana 18
         { id: 2021, propertyId: 1005, name: 'Cieknący dach', location: 'Taras', description: 'Po deszczu woda wnika przez uszczelnienie tarasu.', status: 'critical', createdAt: '2026-05-08T14:49:51.966Z', photos: [], pinPosition: { x: 42.745098039215684, y: 15.267175572519085 } },
         { id: 2022, propertyId: 1005, name: 'Zepsuta roleta', location: 'Sypialnia', description: 'Roletka wewnętrzna nie zwijana, pęknięty mechanizm.', status: 'inProgress', createdAt: '2026-04-25T14:49:51.966Z', photos: [], pinPosition: { x: 40.98039215686274, y: 65.39440203562341 }, updatedAt: '2026-05-11T15:36:41.465Z' },
         { id: 2023, propertyId: 1005, name: 'Zatkany odpływ', location: 'Łazienka', description: 'Woda w brodziku bardzo powolnie spływa', status: 'inProgress', createdAt: '2026-04-16T14:49:51.966Z', photos: [], pinPosition: { x: 95.88235294117648, y: 7.888040712468193 }, updatedAt: '2026-05-11T16:28:58.035Z' },
         { id: 2024, propertyId: 1005, name: 'Grzyb na ścianie', location: 'Łazienka', description: 'Czarna pleśń w rogu pokoju pod sufitem.', status: 'inProgress', createdAt: '2026-04-28T14:49:51.966Z', photos: [], pinPosition: { x: 20.784313725490197, y: 2.2900763358778624 } },
         { id: 2025, propertyId: 1005, name: 'Zarysowane drzwi', location: 'Korytarz', description: 'Drzwi do korytarza zarysowane przez przeprowadzkę.', status: 'resolved', createdAt: '2026-03-12T14:49:51.966Z', photos: [], pinPosition: null }
     ];

     saveProperties();
     saveIssues();
     updatePropertyIssueCounts();
     updateStats();
     renderProperties();
     renderIssuesList();
 }

// ─── Data Export / Import ─────────────────────────────────────────────────────

/**
 * Export all properties and issues to a timestamped JSON file.
 * Photos (base64) and all fields are preserved verbatim.
 */
function exportData() {
    try {
        const payload = {
            version: 1,
            exportedAt: new Date().toISOString(),
            properties: properties,
            issues: issues
        };
        const json = JSON.stringify(payload, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const a = document.createElement('a');
        a.href = url;
        a.download = `propcheck-backup-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        alert('Błąd podczas eksportu danych: ' + err.message);
    }
}

/**
 * Import properties and issues from a JSON backup file.
 * Validates structure before applying to prevent data corruption.
 * @param {File} file - the selected .json file
 * @param {Function} onSuccess - called after successful import
 */
function importData(file, onSuccess) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const payload = JSON.parse(e.target.result);

            // Basic structure validation
            if (typeof payload !== 'object' || payload === null) {
                throw new Error('Plik nie zawiera prawidłowego obiektu JSON.');
            }
            if (!Array.isArray(payload.properties)) {
                throw new Error('Brak pola "properties" (tablica) w pliku.');
            }
            if (!Array.isArray(payload.issues)) {
                throw new Error('Brak pola "issues" (tablica) w pliku.');
            }

            // Validate each property has required fields
            payload.properties.forEach((p, i) => {
                if (typeof p.id === 'undefined') throw new Error(`Nieruchomość [${i}] nie ma pola "id".`);
                if (typeof p.name !== 'string') throw new Error(`Nieruchomość [${i}] nie ma pola "name".`);
                if (typeof p.address !== 'string') throw new Error(`Nieruchomość [${i}] nie ma pola "address".`);
            });

            // Validate each issue has required fields
            payload.issues.forEach((iss, i) => {
                if (typeof iss.id === 'undefined') throw new Error(`Usterka [${i}] nie ma pola "id".`);
                if (typeof iss.propertyId === 'undefined') throw new Error(`Usterka [${i}] nie ma pola "propertyId".`);
                if (typeof iss.name !== 'string') throw new Error(`Usterka [${i}] nie ma pola "name".`);
            });

            // Normalise issues: ensure photos is always an array, pinPosition defaults to null
            const normalisedIssues = payload.issues.map(iss => ({
                ...iss,
                photos: Array.isArray(iss.photos) ? iss.photos : (iss.photo ? [iss.photo] : []),
                pinPosition: iss.pinPosition || null
            }));

            // Normalise properties: ensure issues counts object exists
             const normalisedProperties = payload.properties.map(p => ({
                 ...p,
                 id: Number(p.id),
                 floorplanPhoto: p.floorplanPhoto || null,
                 issues: (p.issues && typeof p.issues === 'object')
                     ? p.issues
                     : { critical: 0, inProgress: 0, resolved: 0 }
             }));

             window.showDeleteConfirmation(
                 null,
                 `dane z pliku "${file.name}" (zastąpi aktualne dane)`,
                 () => {
                     properties = normalisedProperties;
                     issues = normalisedIssues;
                     saveProperties();
                     saveIssues();
                     updatePropertyIssueCounts();
                     updateStats();
                     renderProperties();
                     renderIssuesList();
                     if (typeof onSuccess === 'function') onSuccess();
                 },
                 'import'
             );

        } catch (err) {
            alert('Błąd importu: ' + err.message);
        }
    };
    reader.onerror = function() {
        alert('Nie udało się odczytać pliku.');
    };
    reader.readAsText(file);
}

// ─── PDF Report ────────────────────────────────────────────────────────────────

function showPdfToast(message, isError) {
    const toast = document.getElementById('pdfToast');
    const msg = document.getElementById('pdfToastMsg');
    const icon = document.getElementById('pdfToastIcon');
    if (!toast) return;

    msg.textContent = message;

    if (isError) {
        icon.innerHTML = '<path d="M10 6V10M10 14H10.01" stroke="#F87171" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="10" r="7" stroke="#F87171" stroke-width="1.8"/>';
    } else {
        icon.innerHTML = '<path d="M16 6L8 14L4 10" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }

    toast.style.display = 'flex';
    setTimeout(() => { toast.style.display = 'none'; }, 4000);
}

function initReportModal() {
    const modal = document.getElementById('reportModal');
    const openBtn = document.getElementById('openReportModalBtn');
    const closeBtn = document.getElementById('closeReportModal');
    const cancelBtn = document.getElementById('cancelReport');
    const confirmBtn = document.getElementById('confirmReport');
    const selectAllChk = document.getElementById('reportSelectAll');

    function openModal() {
        const listEl = document.getElementById('reportPropertyList');
        listEl.innerHTML = '';

        if (properties.length === 0) {
            listEl.innerHTML = '<p style="color: var(--text-secondary,#6B7280); font-size:14px;">Brak nieruchomości do uwzględnienia w raporcie.</p>';
            selectAllChk.style.display = 'none';
        } else {
            selectAllChk.style.display = 'flex';
            properties.forEach(p => {
                const propIssues = issues.filter(i => parseInt(i.propertyId) === parseInt(p.id));
                const label = document.createElement('label');
                label.className = 'form-checkbox';
                label.style.cssText = 'padding: 8px 10px; border-radius: 8px; background: var(--bg-secondary,#F9FAFB); cursor:pointer;';
                label.innerHTML = `
                    <input type="checkbox" class="report-prop-chk" value="${p.id}" checked>
                    <span class="checkbox-mark"></span>
                    <span class="checkbox-label" style="display:flex; flex-direction:column; gap:2px;">
                        <span style="font-weight:500;">${escapeHtml(p.name)}</span>
                        <span style="font-size:12px; color:var(--text-secondary,#6B7280);">${escapeHtml(p.address)} &bull; ${propIssues.length} ${propIssues.length === 1 ? 'usterka' : 'usterek'}</span>
                    </span>
                `;
                listEl.appendChild(label);
            });

            // sync select-all
            const chks = () => listEl.querySelectorAll('.report-prop-chk');
            selectAllChk.checked = true;
            selectAllChk.addEventListener('change', function() {
                chks().forEach(c => c.checked = this.checked);
            });
            listEl.addEventListener('change', () => {
                const all = chks();
                selectAllChk.checked = [...all].every(c => c.checked);
            });
        }

        openModalWithAutoClose('reportModal');
    }

    function closeModal() {
        closeModalTracked('reportModal');
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const checked = [...document.querySelectorAll('.report-prop-chk:checked')];
            if (checked.length === 0) {
                showPdfToast('Zaznacz co najmniej jedną nieruchomość.', true);
                return;
            }
            const selectedIds = checked.map(c => parseInt(c.value));
            closeModal();
            generatePDF(selectedIds);
        });
    }
}

// Measures a base64 image and returns { w, h } in pixels
function getImageDimensions(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload  = () => resolve({ w: img.naturalWidth,  h: img.naturalHeight });
        img.onerror = () => resolve({ w: 1, h: 1 }); // fallback 1:1
        img.src = src;
    });
}

/**
 * Generates a floorplan map image with issue pins for PDF export
 * @param {HTMLImageElement|null} preloadedImg - Pre-loaded image element
 * @param {Array} issues - Array of issues with pinPosition
 * @returns {string|null} Base64 JPEG data URL or null if generation fails
 */
/**
 * Normalize floorplan image to optimal size for PDF rendering.
 * Ensures consistent pin sizing regardless of original image dimensions.
 * Target: ~800px width (golden mean between very small and very large images)
 * @param {HTMLImageElement} img - Original floorplan image
 * @returns {Object} - {width, height, scale} of normalized image
 */
function normalizeFloorplanSize(img) {
    const TARGET_WIDTH = 800; // Golden mean for consistent pin sizing
    const MAX_WIDTH = 1200;   // Don't exceed reasonable file size
    
    if (!img || img.width === 0 || img.height === 0) {
        return { width: 0, height: 0, scale: 1 };
    }
    
    // Calculate scale to reach target width, but don't upscale if already smaller
    const scale = Math.min(1, TARGET_WIDTH / img.width);
    
    // Don't exceed maximum width (for very tall landscape images)
    const finalScale = Math.min(scale, MAX_WIDTH / img.width);
    
    return {
        width: Math.round(img.width * finalScale),
        height: Math.round(img.height * finalScale),
        scale: finalScale
    };
}

function generateFloorplanMapImage(preloadedImg, issues) {
    if (!preloadedImg || !issues || issues.length === 0) {
        return null;
    }

    if (preloadedImg.width === 0 || preloadedImg.height === 0) {
        return null;
    }

    try {
        // Normalize image size for consistent pin sizing
        const normalized = normalizeFloorplanSize(preloadedImg);
        
        // Create canvas with the normalized image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            return null;
        }
        
        canvas.width = normalized.width;
        canvas.height = normalized.height;
        
        // Draw the normalized floorplan image
        ctx.drawImage(preloadedImg, 0, 0, canvas.width, canvas.height);
        
        // Draw pins on top of the floorplan
        // Pin size scales with normalized image (maintains visual consistency)
        const pinRadius = Math.max(18, Math.round(20 * normalized.scale));
        
        // Render pins with original issue numbering (preserves gaps for unpinned issues)
        issues.forEach((issue, originalIndex) => {
            // Skip issues without valid pin positions
            if (!issue.pinPosition || typeof issue.pinPosition.x !== 'number' || typeof issue.pinPosition.y !== 'number') {
                return;
            }
            
            const pinX = (issue.pinPosition.x / 100) * canvas.width;
            const pinY = (issue.pinPosition.y / 100) * canvas.height;
            
            // Pin color based on status
            let pinColor;
            switch (issue.status) {
                case 'critical':
                    pinColor = '#EF4444'; // red-500
                    break;
                case 'resolved':
                    pinColor = '#22C55E'; // green-500
                    break;
                default:
                    pinColor = '#F59E0B'; // amber-500
            }
            
            // Draw pin shadow
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;
            
            // Draw main pin circle
            ctx.fillStyle = pinColor;
            ctx.beginPath();
            ctx.arc(pinX, pinY, pinRadius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            
            // Draw white border (no shadow)
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(pinX, pinY, pinRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw issue number from original list position (1, 2, 3... with gaps if unpinned)
            const issueNumber = (originalIndex + 1).toString();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(issueNumber, pinX, pinY);
        });
        
        // Convert canvas to JPEG (smaller file size than PNG)
        return canvas.toDataURL('image/jpeg', 0.85);
        
    } catch (err) {
        console.error('[PDF Map] Canvas rendering error:', err);
        return null;
    }
}

/**
 * Pre-load an image and return it when ready
 * @param {string} src - Image source (data URI or path)
 * @returns {Promise<HTMLImageElement|null>}
 */
function preloadImage(src) {
    return new Promise((resolve) => {
        if (!src) {
            resolve(null);
            return;
        }
        
        const img = new Image();
        // Allow cross-origin loading from relative paths
        img.crossOrigin = 'anonymous';
        
        let timeoutHandle = null;
        const cleanup = () => {
            if (timeoutHandle) clearTimeout(timeoutHandle);
            img.onload = null;
            img.onerror = null;
        };
        
        img.onload = () => {
            cleanup();
            console.log('[PDF] Image pre-loaded:', src.substring(0, 50));
            resolve(img);
        };
        
        img.onerror = (err) => {
            cleanup();
            console.warn('[PDF] Failed to pre-load image:', src.substring(0, 50), err);
            resolve(null);
        };
        
        timeoutHandle = setTimeout(() => {
            cleanup();
            console.warn('[PDF] Pre-load timeout:', src.substring(0, 50));
            resolve(null);
        }, 5000);
        
        img.src = src;
    });
}

async function generatePDF(selectedPropertyIds) {
    // Guard: jsPDF must be loaded
    if (!window.jspdf || !window.jspdf.jsPDF) {
        showPdfToast('Błąd: biblioteka PDF nie jest dostępna. Sprawdź połączenie z internetem.', true);
        return;
    }

    const confirmBtn = document.getElementById('confirmReport');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<span style="opacity:.6">Generowanie...</span>';
    }

    // ── Pre-load all floorplan images ──────────────────────────────────────
    const selectedProperties = properties.filter(p => selectedPropertyIds.includes(parseInt(p.id)));
    const floorplanImageCache = new Map();
    
    for (const property of selectedProperties) {
        if (property.floorplanPhoto) {
            const img = await preloadImage(property.floorplanPhoto);
            if (img) {
                floorplanImageCache.set(property.id, img);
            }
        }
    }

    // ── Pre-load all image dimensions (async, before any jsPDF work) ──────
    const PHOTO_COL_W = 55; // fixed column width in mm for each photo (max 3 cols)
    const PHOTO_GAP   = 3;  // gap between photos in mm
    const PHOTO_MAX   = 6;  // max photos rendered per issue

    // Build a flat list of all photos across selected issues
    const selectedIssuesForDims = issues.filter(i =>
        selectedPropertyIds.includes(parseInt(i.propertyId))
    );
    // Map: photoSrc → aspect ratio (h/w), measured once
    const photoAspectMap = new Map();
    const allPhotoSrcs = [];
    selectedIssuesForDims.forEach(issue => {
        if (issue.photos) {
            issue.photos.slice(0, PHOTO_MAX).forEach(src => {
                if (src && src.startsWith('data:image') && !photoAspectMap.has(src)) {
                    allPhotoSrcs.push(src);
                }
            });
        }
    });
    // Measure all in parallel
    if (allPhotoSrcs.length > 0) {
        const dims = await Promise.all(allPhotoSrcs.map(src => getImageDimensions(src)));
        allPhotoSrcs.forEach((src, i) => {
            const { w, h } = dims[i];
            photoAspectMap.set(src, w > 0 ? h / w : 1);
        });
    }

    // Helper: compute rendered height (mm) for a single photo given its column width
    function photoRenderedH(src, colW) {
        const aspect = photoAspectMap.get(src) ?? 0.65;
        return colW * aspect;
    }

    // Available horizontal space for photos inside a card (mm):
    // card starts at MARGIN, photos start at MARGIN+18, card ends at MARGIN+CONTENT_W
    // leave 4mm right padding inside card → usable = CONTENT_W - 18 - 4
    // CONTENT_W = PAGE_W(210) - MARGIN(16)*2 = 178mm → PHOTO_AREA_W = 178 - 18 - 4 = 156mm
    const PHOTO_AREA_W = 156;

    // Helper: compute total photo block height for a given issue
    // Returns { blockH, colW, rows } where rows is array of photo groups per grid row
    function calcPhotoBlock(issue) {
        const photos = (issue.photos || []).slice(0, PHOTO_MAX).filter(
            s => s && s.startsWith('data:image')
        );
        if (photos.length === 0) return { blockH: 0, colW: 0, rows: [] };

        const cols = Math.min(photos.length, 3);
        const totalGaps = (cols - 1) * PHOTO_GAP;
        // colW = available area divided equally, never exceeds PHOTO_AREA_W
        const colW = Math.min(
            (PHOTO_AREA_W - totalGaps) / cols,
            PHOTO_COL_W  // optional per-column cap (55mm) for very tall portrait photos
        );

        // Group into rows of `cols`
        const rows = [];
        for (let i = 0; i < photos.length; i += cols) {
            rows.push(photos.slice(i, i + cols));
        }

        // Height = sum of the tallest photo in each row + gaps between rows
        let blockH = 0;
        rows.forEach((row, ri) => {
            const rowH = Math.max(...row.map(src => photoRenderedH(src, colW)));
            blockH += rowH;
            if (ri < rows.length - 1) blockH += PHOTO_GAP;
        });

        return { blockH, colW, rows };
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

        // ── Register Roboto font (bundled as base64 in fonts.js) ─────────
        let useFallbackFont = false;
        if (window.ROBOTO_REGULAR_B64 && window.ROBOTO_BOLD_B64) {
            try {
                doc.addFileToVFS('Roboto-Regular.ttf', window.ROBOTO_REGULAR_B64);
                doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
                doc.addFileToVFS('Roboto-Bold.ttf', window.ROBOTO_BOLD_B64);
                doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
            } catch (fontErr) {
                console.error('[PDF] Błąd rejestracji czcionki:', fontErr);
                useFallbackFont = true;
            }
        } else {
            console.warn('[PDF] fonts.js nie załadowany, używam fallback helvetica');
            useFallbackFont = true;
        }

        const FONT_NAME = useFallbackFont ? 'helvetica' : 'Roboto';

        const PAGE_W = 210;
        const PAGE_H = 297;
        const MARGIN = 16;
        const CONTENT_W = PAGE_W - MARGIN * 2;

        // ── Colour palette ──────────────────────────────────────────────
        const C = {
            brand:      [139, 115, 85],   // #8B7355 warm brown
            brandLight: [250, 247, 242],   // #FAF7F2
            text:       [28,  28,  30],    // near-black
            muted:      [107, 114, 128],   // gray-500
            border:     [229, 231, 235],   // gray-200
            critical:   [239, 68,  68],    // red-500
            inProgress: [245, 158, 11],    // amber-500
            resolved:   [34,  197, 94],    // green-500
            white:      [255, 255, 255],
        };

        const today = new Date().toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
        let pageNum = 1;

        // ── helpers ──────────────────────────────────────────────────────
        function setFont(style, size, color) {
            doc.setFont(FONT_NAME, style);
            doc.setFontSize(size);
            doc.setTextColor(...(color || C.text));
        }

            function addPageIfNeeded(yPos, needed) {
                if (yPos + needed > PAGE_H - MARGIN) {
                    doc.addPage();
                    pageNum++;
                    drawPageHeader();
                    return MARGIN + 14;
                }
                return yPos;
            }

            function drawPageHeader() {
                // brand bar
                doc.setFillColor(...C.brand);
                doc.rect(0, 0, PAGE_W, 10, 'F');

                setFont('bold', 11, C.white);
                doc.text('PropCheck', MARGIN, 6.8);

                setFont('normal', 8, C.white);
                doc.text('Raport usterek', PAGE_W - MARGIN, 6.8, { align: 'right' });
            }

            function drawPageFooter() {
                const totalPages = doc.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    doc.setDrawColor(...C.border);
                    doc.setLineWidth(0.3);
                    doc.line(MARGIN, PAGE_H - 10, PAGE_W - MARGIN, PAGE_H - 10);
                    setFont('normal', 8, C.muted);
                    doc.text(`Wygenerowano: ${today}`, MARGIN, PAGE_H - 6);
                    doc.text(`Strona ${i} / ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 6, { align: 'right' });
                }
            }

            function statusLabel(status) {
                switch (status) {
                    case 'critical':   return 'Krytyczne';
                    case 'inProgress': return 'Usterka';
                    case 'resolved':   return 'Rozwiązane';
                    default:           return status;
                }
            }

            function statusColor(status) {
                switch (status) {
                    case 'critical':   return C.critical;
                    case 'inProgress': return C.inProgress;
                    case 'resolved':   return C.resolved;
                    default:           return C.muted;
                }
            }

            // ── Cover page ───────────────────────────────────────────────────
            drawPageHeader();

            // Brand hero block
            doc.setFillColor(...C.brandLight);
            doc.roundedRect(MARGIN, 18, CONTENT_W, 42, 3, 3, 'F');

            setFont('bold', 22, C.brand);
            doc.text('Raport Usterek', PAGE_W / 2, 34, { align: 'center' });

            setFont('normal', 11, C.muted);
            doc.text('Wygenerowano przez PropCheck', PAGE_W / 2, 42, { align: 'center' });

            setFont('normal', 10, C.muted);
            doc.text(today, PAGE_W / 2, 50, { align: 'center' });

            // Summary stats - exclude resolved issues
            const selectedIssues = issues.filter(i => 
                selectedPropertyIds.includes(parseInt(i.propertyId)) &&
                i.status !== 'resolved'
            );
            const criticalCount   = selectedIssues.filter(i => i.status === 'critical').length;
            const inProgressCount = selectedIssues.filter(i => i.status === 'inProgress').length;
            const resolvedCount   = 0; // Don't show resolved in PDF

            const statBoxW = (CONTENT_W - 12) / 4;
            const statBoxes = [
                { label: 'Nieruchomości', value: selectedProperties.length, color: C.brand },
                { label: 'Krytyczne',     value: criticalCount,             color: C.critical },
                { label: 'Usterka',        value: inProgressCount, color: C.inProgress },
                { label: 'Razem',         value: selectedIssues.length,     color: C.muted },
            ];

            statBoxes.forEach((box, idx) => {
                const bx = MARGIN + idx * (statBoxW + 4);
                const by = 68;
                doc.setFillColor(...C.white);
                doc.setDrawColor(...C.border);
                doc.setLineWidth(0.4);
                doc.roundedRect(bx, by, statBoxW, 22, 2, 2, 'FD');

                doc.setFont(FONT_NAME, 'bold');
                doc.setFontSize(16);
                doc.setTextColor(...box.color);
                doc.text(String(box.value), bx + statBoxW / 2, by + 11, { align: 'center', baseline: 'middle' });

                doc.setFont(FONT_NAME, 'normal');
                doc.setFontSize(8);
                doc.setTextColor(...C.muted);
                doc.text(box.label, bx + statBoxW / 2, by + 18, { align: 'center', baseline: 'middle' });
            });

            // Table of contents
            let y = 102;
            setFont('bold', 11, C.text);
            doc.text('Spis treści', MARGIN, y);
            y += 5;
            doc.setDrawColor(...C.border);
            doc.setLineWidth(0.3);
            doc.line(MARGIN, y, PAGE_W - MARGIN, y);
            y += 5;

            selectedProperties.forEach((p, idx) => {
                // Only count non-resolved issues for TOC
                const propIssues = selectedIssues.filter(i => parseInt(i.propertyId) === parseInt(p.id));
                if (propIssues.length > 0) {
                    setFont('normal', 10, C.text);
                    doc.text(`${idx + 1}.  ${p.name}`, MARGIN + 4, y);
                    setFont('normal', 9, C.muted);
                    doc.text(`${propIssues.length} ${propIssues.length === 1 ? 'usterka' : 'usterek'}`, PAGE_W - MARGIN, y, { align: 'right' });
                    y += 7;
                }
            });

            // ── Property pages ────────────────────────────────────────────────
            for (const property of selectedProperties) {
                doc.addPage();
                pageNum++;
                drawPageHeader();
                y = MARGIN + 14;

                // Property header band
                doc.setFillColor(...C.brandLight);
                doc.rect(MARGIN, y, CONTENT_W, 18, 'F');
                doc.setFillColor(...C.brand);
                doc.rect(MARGIN, y, 3, 18, 'F');

                setFont('bold', 13, C.text);
                doc.text(property.name, MARGIN + 7, y + 7);
                setFont('normal', 9, C.muted);
                doc.text(property.address, MARGIN + 7, y + 14);

                const propIssues = selectedIssues.filter(i => parseInt(i.propertyId) === parseInt(property.id));
                setFont('normal', 9, C.muted);
                doc.text(`${propIssues.length} ${propIssues.length === 1 ? 'usterka' : 'usterek'}`, PAGE_W - MARGIN - 4, y + 9, { align: 'right', baseline: 'middle' });

                y += 24;

                // ── Floorplan Map (if exists and has pins) ───────────────────────
                const pinnedIssues = propIssues.filter(i => 
                    i.pinPosition && 
                    typeof i.pinPosition.x === 'number' && 
                    typeof i.pinPosition.y === 'number'
                );
                
                if (property.floorplanPhoto && pinnedIssues.length > 0) {
                    // Check if we have a pre-loaded image for this property
                    const preloadedImg = floorplanImageCache.get(property.id);
                    
                    if (preloadedImg) {
                        try {
                            const mapImageData = generateFloorplanMapImage(preloadedImg, propIssues);
                            
                            if (mapImageData && typeof mapImageData === 'string' && mapImageData.length > 100) {
                                // Calculate dimensions preserving aspect ratio
                                const maxMapW = 150; // mm max width
                                const maxMapH = 95;  // mm max height
                                
                                // Get original aspect ratio from preloaded image
                                const imgAspectRatio = preloadedImg.width / preloadedImg.height;
                                
                                // Calculate final dimensions respecting both max constraints
                                let mapW, mapH;
                                if (imgAspectRatio > maxMapW / maxMapH) {
                                    // Width is the limiting factor
                                    mapW = maxMapW;
                                    mapH = maxMapW / imgAspectRatio;
                                } else {
                                    // Height is the limiting factor
                                    mapH = maxMapH;
                                    mapW = maxMapH * imgAspectRatio;
                                }
                                
                                // Check if we need a new page
                                y = addPageIfNeeded(y, mapH + 10);
                                
                                // Center the map
                                const mapX = MARGIN + (CONTENT_W - mapW) / 2;
                                
                                try {
                                    // Add map image (JPEG format)
                                    doc.addImage(mapImageData, 'JPEG', mapX, y, mapW, mapH);
                                    
                                    // Border around map
                                    doc.setDrawColor(...C.border);
                                    doc.setLineWidth(0.5);
                                    doc.rect(mapX, y, mapW, mapH);
                                    
                                    y += mapH + 8;
                                    
                                    // Label
                                    setFont('normal', 8, C.muted);
                                    doc.text('Mapa usterek', PAGE_W / 2, y, { align: 'center' });
                                    y += 8;
                                } catch (addImgErr) {
                                    console.error('[PDF] Błąd dodawania obrazu:', addImgErr.message);
                                }
                            }
                        } catch (mapErr) {
                            console.error('[PDF] Błąd generowania mapy:', mapErr.message);
                        }
                    }
                }

                if (propIssues.length === 0) {
                    setFont('normal', 10, C.muted);
                    doc.text('Brak usterek do wyświetlenia.', MARGIN, y);
                    continue;
                }

                // Sort: critical first, then inProgress (resolved already filtered out)
                const sorted = [...propIssues].sort((a, b) => {
                    const order = { critical: 0, inProgress: 1, resolved: 2 };
                    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
                });

                sorted.forEach((issue, issueIdx) => {
                    const hasDesc = issue.description && issue.description.trim().length > 0;
                    const photoCount = issue.photos ? issue.photos.length : 0;

                    // ── Precise height calculation ───────────────────────
                    const HEADER_H   = 22;  // title + location chip area
                    const PADDING_B  = 5;   // bottom padding inside card
                    const DESC_LINE_H = 4.5;

                    // Description height
                    let descH = 0;
                    let descLines = [];
                    if (hasDesc) {
                        descLines = doc.splitTextToSize(issue.description, CONTENT_W - 24);
                        descH = descLines.length * DESC_LINE_H + 2; // +2 gap after desc
                    }

                    // Photo block height (uses real aspect ratios)
                    const photoBlock = calcPhotoBlock(issue);
                    const photosH = photoBlock.blockH > 0 ? photoBlock.blockH + 3 : 0; // +3 top gap

                    // Extra-photos label
                    const hasExtraLabel = photoCount > PHOTO_MAX;
                    const extraLabelH = hasExtraLabel ? 5 : 0;

                    const rowH = HEADER_H + descH + photosH + extraLabelH + PADDING_B;

                    y = addPageIfNeeded(y, rowH + 4);

                    // ── Card background & border ─────────────────────────
                    const rowBg = issueIdx % 2 === 0 ? C.white : [248, 248, 250];
                    doc.setFillColor(...rowBg);
                    doc.setDrawColor(...C.border);
                    doc.setLineWidth(0.25);
                    doc.roundedRect(MARGIN, y, CONTENT_W, rowH, 2, 2, 'FD');

                    // Status stripe
                    doc.setFillColor(...statusColor(issue.status));
                    doc.roundedRect(MARGIN, y, 3, rowH, 1, 1, 'F');

                    // Issue number badge
                    doc.setFillColor(...C.border);
                    doc.circle(MARGIN + 10, y + 8, 5, 'F');
                    setFont('bold', 8, C.muted);
                    doc.text(String(issueIdx + 1), MARGIN + 10, y + 6.6, { align: 'center', baseline: 'top' });

                    // Title
                    setFont('bold', 10, C.text);
                    const titleLines = doc.splitTextToSize(issue.name, CONTENT_W - 70);
                    doc.text(titleLines, MARGIN + 18, y + 7);

                    // Location chip
                    const locText = issue.location;
                    setFont('normal', 8, C.muted);
                    const locW = doc.getTextWidth(locText) + 6;
                    doc.setFillColor(...C.brandLight);
                    doc.setDrawColor(...C.border);
                    doc.roundedRect(MARGIN + 18, y + 11, locW, 6, 1, 1, 'FD');
                    setFont('normal', 7, C.brand);
                    doc.text(locText, MARGIN + 21, y + 15.2);

                    // Date
                    setFont('normal', 8, C.muted);
                    doc.text(formatDate(issue.createdAt), PAGE_W - MARGIN - 4, y + 7, { align: 'right' });

                    // Status badge
                    const sLabel = statusLabel(issue.status);
                    const sColor = statusColor(issue.status);
                    const sW = doc.getTextWidth(sLabel) + 8;
                    doc.setFillColor(sColor[0], sColor[1], sColor[2], 0.12);
                    doc.setDrawColor(...sColor);
                    doc.setLineWidth(0.4);
                    const sX = PAGE_W - MARGIN - 4 - sW;
                    doc.roundedRect(sX, y + 10, sW, 6, 1, 1, 'FD');
                    setFont('bold', 7, sColor);
                    doc.text(sLabel, sX + sW / 2, y + 13, { align: 'center', baseline: 'middle' });

                    let innerY = y + HEADER_H;

                    // ── Description ──────────────────────────────────────
                    if (hasDesc) {
                        setFont('normal', 8, C.muted);
                        doc.text(descLines, MARGIN + 18, innerY);
                        innerY += descH;
                    }

                    // ── Photos ───────────────────────────────────────────
                    if (photoBlock.blockH > 0) {
                        innerY += 3; // top gap before photos
                        const { colW, rows } = photoBlock;

                        rows.forEach((rowPhotos) => {
                            // row height = tallest photo in this row
                            const rowPhotoH = Math.max(...rowPhotos.map(src => photoRenderedH(src, colW)));

                            rowPhotos.forEach((src, colIdx) => {
                                const ph = photoRenderedH(src, colW);
                                const px = MARGIN + 18 + colIdx * (colW + PHOTO_GAP);
                                // vertically align photos to top of row
                                const py = innerY;

                                try {
                                    const imgFormat = src.includes('data:image/png') ? 'PNG' : 'JPEG';
                                    doc.addImage(src, imgFormat, px, py, colW, ph, undefined, 'FAST');
                                    doc.setDrawColor(...C.border);
                                    doc.setLineWidth(0.3);
                                    doc.rect(px, py, colW, ph);
                                } catch (imgErr) {
                                    // silently skip broken images
                                }
                            });

                            innerY += rowPhotoH + PHOTO_GAP;
                        });

                        if (hasExtraLabel) {
                            setFont('normal', 7, C.muted);
                            doc.text(`+${photoCount - PHOTO_MAX} więcej zdjęć`, MARGIN + 18, innerY + 1);
                        }
                    }

                    y += rowH + 4;
                });
            }

            // ── Footer on all pages ───────────────────────────────────────────
            drawPageFooter();

            // ── Save ──────────────────────────────────────────────────────────
            const fileName = `PropCheck_raport_${today.replace(/\./g, '-')}.pdf`;
            doc.save(fileName);

            showPdfToast('Raport PDF zapisany! Gotowy do wysłania ekipie.');
        } catch (err) {
            console.error('PDF generation error:', err);
            showPdfToast('Błąd podczas generowania PDF. Spróbuj ponownie.', true);
        } finally {
            const confirmBtn = document.getElementById('confirmReport');
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="margin-right: 6px;">
                        <path d="M9 2V12M9 12L5 8M9 12L13 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 14H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                    Generuj PDF`;
            }
        }
}
