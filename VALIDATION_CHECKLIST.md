# Analytics Dashboard - Runtime Validation Checklist

**Date**: October 21, 2025  
**Milestone**: P1.1 + P1.2 + P1.3 (Analytics UX Enhancements)  
**Status**: ✅ Static validation complete, ⏳ Runtime validation pending

---

## 📋 Pre-Flight Checks

### 1. Start Development Server
```bash
# Ensure clean state
lsof -i :3002
# If occupied: kill -9 <PID>

# Start server
npm start

# Expected output:
# ➜  Local:   http://localhost:3002/
```

### 2. Open Analytics Dashboard
```
Navigate to: http://localhost:3002/analytics
```

**Initial Verification**:
- [ ] Page loads without errors
- [ ] No red console errors (F12 → Console)
- [ ] Filter bar visible with all controls
- [ ] KPI cards render
- [ ] Charts render (empty data is acceptable)

---

## ✅ Test Suite

### Test 1: Filter Controls Presence (30 seconds)

**Action**: Visual inspection of filter bar

**Verify**:
- [ ] Date From field (date input)
- [ ] Date To field (date input)
- [ ] Source field (text input)
- [ ] **Stage dropdown** (new in P1.1)
- [ ] **Owner ID field** (new in P1.1)
- [ ] Trend Interval dropdown
- [ ] Apply button
- [ ] Reset button

---

### Test 2: Stage Filter (1 minute)

**Action**:
1. Click Stage dropdown
2. Select "Proposal"
3. Click "Apply"

**Verify**:
- [ ] Dropdown shows 8 options: "All stages" + 7 deal stages
- [ ] URL updates to: `/analytics?stage=Proposal&interval=day`
- [ ] No console errors
- [ ] (If backend connected) Network tab shows API calls with `stage=Proposal`

---

### Test 3: Owner Filter (1 minute)

**Action**:
1. Enter Owner ID: `test-uuid-123`
2. Click "Apply"

**Verify**:
- [ ] URL updates to include: `&ownerId=test-uuid-123`
- [ ] No console errors
- [ ] (If backend connected) Network tab shows API calls with `ownerId=test-uuid-123`

---

### Test 4: Filter Persistence (1 minute)

**Action**:
1. Set filters:
   - Stage: "Negotiation"
   - Owner ID: "owner-456"
   - Date From: "2024-01-01"
2. Click "Apply"
3. Refresh page (F5)

**Verify**:
- [ ] All filters restored from localStorage
- [ ] Stage shows "Negotiation"
- [ ] Owner ID shows "owner-456"
- [ ] Date From shows "2024-01-01"
- [ ] URL reflects the filters

---

### Test 5: URL Precedence (30 seconds)

**Action**:
1. With filters already set from Test 4
2. Manually navigate to: `/analytics?stage=Discovery&interval=week`

**Verify**:
- [ ] Stage dropdown shows "Discovery" (URL overrides localStorage)
- [ ] Interval shows "Weekly" (URL overrides)
- [ ] Other filters (Owner, dates) still show localStorage values

---

### Test 6: Reset Button (30 seconds)

**Action**:
1. With filters set, click "Reset" button

**Verify**:
- [ ] All filter fields cleared
- [ ] URL becomes `/analytics` (no query params)
- [ ] Refresh page → filters stay empty
- [ ] Console: No errors about localStorage

---

### Test 7: Chart Tooltips - Dates (1 minute)

**Action**:
1. If LineChart (Trends) has data, hover over a data point
2. Inspect tooltip content

**Verify**:
- [ ] Date shows formatted: "Jan 15, 2024" (not "2024-01-15")
- [ ] Uses localized format (respects browser locale)

**If no data**: Skip this test, proceed to Test 8

---

### Test 8: Chart Tooltips - Numbers (1 minute)

**Action**:
1. Hover over LineChart or BarChart data points
2. Inspect value formatting

**Verify**:
- [ ] Numbers show compact: "1.2K" or "1,234" (not "1234")
- [ ] Large numbers abbreviated: "1.5M" (not "1500000")
- [ ] Uses localized format (respects browser locale)

**If no data**: Skip this test, proceed to Test 9

---

### Test 9: Drill-down to Deals (2 minutes)

**Action**:
1. Set filters:
   - Stage: "Proposal"
   - Date From: "2024-01-01"
   - Date To: "2024-01-31"
2. Click "Apply"
3. Click "Deals Created" KPI card

**Verify**:
- [ ] Navigate to `/deals?stage=Proposal&dateFrom=2024-01-01&dateTo=2024-01-31`
- [ ] "Active filters" chip appears on Deals page
- [ ] Chip shows count of active filters
- [ ] Click chip delete icon → filters cleared
- [ ] URL updates to `/deals` (no params)
- [ ] All deals shown (no filter applied)

---

### Test 10: Drill-down to Leads (1 minute)

**Action**:
1. Navigate back to `/analytics`
2. Set filters and click "Apply"
3. Click "Leads Created" KPI card

**Verify**:
- [ ] Navigate to `/leads?dateFrom=...&dateTo=...`
- [ ] "Active filters" chip appears on Leads page
- [ ] Chip delete clears filters and updates URL
- [ ] All leads shown after clearing

---

### Test 11: Funnel Drill-down (1 minute)

**Action**:
1. If BarChart (Funnel) has data, click on a bar
2. Observe navigation

**Verify**:
- [ ] Navigate to `/deals?stage=<clicked_stage>&...`
- [ ] Stage filter matches the clicked funnel stage
- [ ] Other filters carried forward

**If no data**: Skip this test

---

### Test 12: Trends Drill-down (1 minute)

**Action**:
1. If LineChart (Trends) has data, click on a data point
2. Observe navigation

**Verify**:
- [ ] Navigate to `/deals?dateFrom=<date>&dateTo=<date>&...`
- [ ] Date range matches the clicked point
- [ ] Other filters carried forward

**If no data**: Skip this test

---

## 🧪 Automated Tests

### Smoke Tests
```bash
npm run test:smoke
```

**Expected**: All tests pass

**If failures**: Note which test(s) and error messages

---

### Analytics E2E Test
```bash
npm run test:e2e -- e2e/analytics.spec.ts
```

**Expected**: Test passes, covers:
- KPI rendering
- Filter application
- Drill-down navigation

**If failures**: Share Playwright trace/screenshot

---

## 📊 Success Criteria

**Pass Threshold**: 10/12 manual tests + 2/2 automated tests

**Acceptable Skips**:
- Chart tooltip tests (if no data available)
- Funnel/Trends drill-down (if no data available)

**Critical Tests** (must pass):
- Test 2: Stage Filter
- Test 3: Owner Filter
- Test 4: Filter Persistence
- Test 5: URL Precedence
- Test 6: Reset Button
- Test 9: Drill-down to Deals
- Test 10: Drill-down to Leads

---

## 🐛 Issue Reporting Template

If any test fails, provide:

```
Test Number: [e.g., Test 4]
Test Name: [e.g., Filter Persistence]

Steps Taken:
1. [Step-by-step what you did]
2. ...

Expected Behavior:
[What should have happened]

Observed Behavior:
[What actually happened]

Current URL:
[e.g., http://localhost:3002/analytics?stage=Proposal]

Console Errors:
[Copy/paste any red errors from DevTools Console]

Network Issues:
[Any 404/500 errors from Network tab]

Screenshots:
[If applicable]
```

---

## ✅ Sign-off

**Validated By**: ________________  
**Date**: ________________  
**Result**: ☐ PASS  ☐ PARTIAL  ☐ FAIL  

**Notes**:
```
[Any observations, edge cases found, or suggestions]
```

---

## 🚀 Next Steps After Validation

### If All Tests Pass:

Choose next milestone:
- **P1.4**: Leads drill-down parity (funnel/trends → leads)
- **P1.5-P1.6**: Company/Contact detail/edit pages
- **P1.7**: Lazy-load charts (bundle optimization)
- **P1.8**: SWR/React Query integration

Or address follow-ups:
1. Replace Owner text field with Autocomplete + useUsers hook
2. Extract DEAL_STAGES to src/constants/deals.ts
3. Add unit tests for URL builders

### If Tests Fail:

Report issues using template above, and we'll provide targeted fixes.

---

**Document Version**: 1.0  
**Last Updated**: October 21, 2025

