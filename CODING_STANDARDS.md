# Coding Standards - Solar Calculator Project

This document outlines the coding standards and conventions for the Solar Calculator project.

## Language Standards

### Code Comments and Documentation
- **All code comments must be in English**
- **All README files must be in English**
- **All technical documentation must be in English**
- **All variable names, function names, and class names must be in English**

### User Interface Text
- **User-facing text (labels, messages, form fields) can be in Spanish** (since this is a Panamanian application)
- **Email content and responses can be in Spanish**
- **Console logs and error messages should be in English for debugging purposes**

## File Naming Conventions

### Components
- Use PascalCase: `SolarPanelCalculator.jsx`
- Use descriptive names that clearly indicate the component's purpose

### Hooks
- Use camelCase with `use` prefix: `useConsumptionData.js`
- Use descriptive names that indicate the hook's functionality

### Utilities and Helpers
- Use camelCase: `costCalculations.js`
- Use descriptive names that indicate the function's purpose

## Code Style

### JavaScript/JSX
- Use ES6+ syntax
- Use functional components with hooks
- Use destructuring for props and state
- Use template literals for string interpolation
- Use arrow functions for event handlers

### Comments
- Use `//` for single-line comments
- Use `/* */` for multi-line comments
- Write clear, concise comments that explain the "why" not the "what"
- Comment complex business logic and calculations

### Imports and Exports
- Use named exports for components and hooks
- Use default exports sparingly
- Group imports: external libraries first, then internal modules
- Use absolute imports when possible

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── assets/             # Static assets (images, documents)
├── utils/              # Utility functions (if any)
└── styles/             # CSS and styling files
```

## Git Commit Messages

- Use English for commit messages
- Use conventional commit format: `type(scope): description`
- Examples:
  - `feat(calculator): add solar panel size calculation`
  - `fix(hooks): resolve consumption data update issue`
  - `docs(readme): update installation instructions`

## Testing Standards

- Write tests in English
- Use descriptive test names
- Test both success and error scenarios
- Mock external dependencies

## Performance Considerations

- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect
- Use useMemo and useCallback when appropriate
- Avoid unnecessary re-renders

## Security Standards

- Never commit API keys or sensitive data
- Use environment variables for configuration
- Validate all user inputs
- Sanitize data before sending to backend

## Accessibility

- Use semantic HTML elements
- Provide alt text for images
- Ensure proper color contrast
- Support keyboard navigation

## Browser Support

- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Use polyfills for older browser support if needed
- Test on multiple devices and screen sizes

## Code Review Checklist

- [ ] Code follows language standards
- [ ] All comments are in English
- [ ] Variable and function names are descriptive
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
- [ ] Code is properly formatted
- [ ] No unused imports or variables
- [ ] Tests pass (if applicable)

## Questions or Concerns

If you have questions about these standards or need clarification, please:
1. Check existing code for examples
2. Ask in code review comments
3. Create an issue for discussion
4. Contact the development team
