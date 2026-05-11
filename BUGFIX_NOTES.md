# Bug Fix: "Gotowe" Button Not Working When Adding Photos to Issue

## Problem
When editing an existing issue and adding photos, clicking the "Gotowe" (Done) or "Umieść pinezkę" (Place Pin) button would fail with:
```
QuotaExceededError: Failed to execute 'setItem' on 'Storage': Setting the value of 'propcheck_issues' exceeded the quota.
```

## Root Causes
1. **localStorage quota exceeded**: Base64 encoded photos are HUGE (MB each). With multiple issues and photos, total data exceeded browser's 5-10MB localStorage limit.
2. **Event handler conflicts**: The addEventListener for the button was calling preventDefault() before checking isEditMode, preventing edit mode handler from working.

## Solutions Implemented

### 1. Image Compression
- File: `dashboard.js`, function `compressImageToBase64()`
- What it does: 
  - Compresses images to max 800x800px
  - Uses JPEG quality 0.6 (60%)
  - Reduces typical 5MB photo to ~500KB
  - Reduction: ~90% size decrease

### 2. localStorage Error Handling
- File: `dashboard.js`, function `saveIssues()`
- What it does:
  - Catches QuotaExceededError
  - Shows user-friendly error message
  - Fallback: saves data without photos if quota exceeded
  - Logs data sizes for debugging

### 3. Event Handler Fix
- File: `dashboard.js`, initAddIssueModal() line 335
- What it does:
  - Moved isEditMode check BEFORE preventDefault()
  - In edit mode, listener returns early without preventing default
  - Allows onclick handler to execute in edit mode

### 4. IndexedDB Setup (Optional)
- File: `dashboard.js`, functions at top of file
- Purpose: Future support for storing photos separately from localStorage
- Currently: Initialized but not actively used (compression is primary solution)

## Testing Checklist
- Add 5+ photos to a new issue → should compress successfully
- Edit existing issue and add more photos → should work without error
- Add 10 photos (max limit) → should fit in localStorage
- Check browser console for compression logs (KB sizes)
- Verify "Gotowe" and "Umieść pinezkę" buttons respond to clicks
- Test on slower device to verify async image compression works

## Expected Improvements
- Before: ~2-3 photos maximum before quota error
- After: 8-10 photos fit comfortably in localStorage
- Data size: Reduced from potential 50MB+ to <5MB

## Files Modified
- examples/dashboard.js (main file with all fixes)
