## Description
<!-- Provide a brief description of the changes in this PR -->

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 🔨 Refactoring
- [ ] 📝 Documentation
- [ ] 🎨 UI/UX improvements

## Code Standards Checklist

### Page Architecture
- [ ] Uses `AppPage` for page chrome (no `MainCard` in page files)
- [ ] URL-driven filters/pagination (`useUrlQuery` from `react-router-dom`)
- [ ] Loading/Error/Empty states via `AppPage` props
- [ ] Search/filters in toolbar (not inline in page body)

### Data & Exports
- [ ] Exports use `core/export` (CSV/XLSX/PDF)
- [ ] Data fetching uses standardized hooks from `data/hooks/`
- [ ] Server-side pagination implemented

### Security & Access
- [ ] RBAC gates on restricted actions (if applicable)
- [ ] No sensitive data in client logs
- [ ] API endpoints use proper authentication

### UI/UX Standards
- [ ] No horizontal scroll @ 1440/1024/768/375px viewports
- [ ] Container width respects theme settings (max 1200px when enabled)
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Loading indicators during async operations

### Code Quality
- [ ] TypeScript: No `any` types (use proper types or `unknown`)
- [ ] ESLint: No warnings or errors
- [ ] Prettier: Code formatted
- [ ] Tests: Unit/E2E tests added/updated (if applicable)

## Testing
<!-- Describe how you tested these changes -->

- [ ] Tested in development environment
- [ ] Tested across different screen sizes
- [ ] Tested with sample data
- [ ] No console errors

## Screenshots/Videos
<!-- Add screenshots or videos if this is a UI change -->

## Related Issues
<!-- Link to related issues: Fixes #123, Closes #456 -->

## Additional Notes
<!-- Any additional context or notes for reviewers -->

