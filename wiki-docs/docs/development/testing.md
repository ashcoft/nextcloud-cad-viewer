---
sidebar_position: 3
---

# Testing

This guide covers testing practices for Nextcloud CAD Viewer.

## Testing Framework

The project uses **Jest** as the testing framework, configured in `jest.config.js`.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/unit/example.test.js
```

## Test Structure

Tests are organized in the `tests/` directory:

```
tests/
├── unit/           # Unit tests
│   ├── components/
│   └── utils/
├── integration/    # Integration tests
└── fixtures/       # Test data files
```

## Writing Unit Tests

### Basic Test Example

```javascript
// tests/unit/components/Viewer.test.js
import { mount } from '@vue/test-utils';
import Viewer from '../../../src/components/Viewer.vue';

describe('Viewer Component', () => {
  it('renders correctly', () => {
    const wrapper = mount(Viewer);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays loading state initially', () => {
    const wrapper = mount(Viewer);
    expect(wrapper.find('.loading').exists()).toBe(true);
  });
});
```

### Testing Async Code

```javascript
test('loads file successfully', async () => {
  const wrapper = mount(Viewer, {
    propsData: { fileId: 123 }
  });
  
  await wrapper.vm.loadFile();
  expect(wrapper.vm.isLoading).toBe(false);
  expect(wrapper.vm.fileLoaded).toBe(true);
});
```

## Test Coverage

Generate a coverage report:

```bash
npm run test:coverage
```

Open `tests/coverage/index.html` in your browser to view the interactive report.

### Coverage Goals

Aim for:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

## Mocking Dependencies

### Mocking API Calls

```javascript
// __mocks__/axios.js
export default {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
};
```

### Mocking Vue Router

```javascript
const createMockRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  currentRoute: { value: { name: 'viewer' } }
});
```

## Integration Tests

Integration tests verify that multiple components work together:

```javascript
describe('File Loading Flow', () => {
  it('completes full load cycle', async () => {
    // Test the complete flow from file selection to rendering
  });
});
```

## Continuous Integration

Tests run automatically on every pull request via GitHub Actions:

1. Install dependencies
2. Run linting
3. Execute all tests
4. Report coverage

### CI Configuration

See `.github/workflows/test.yml` for the complete CI setup.

## Debugging Tests

### Verbose Output

```bash
npm test -- --verbose
```

### Debug Specific Test

```bash
npm test -- --testNamePattern="should load file"
```

### Using Console.log

```javascript
test('debug example', () => {
  console.log('Debug info:', someValue);
  expect(true).toBe(true);
});
```

## Best Practices

1. **Test One Thing Per Test**: Each test should verify a single behavior
2. **Use Descriptive Names**: Test names should explain what's being tested
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Avoid Test Interdependence**: Tests should run independently
5. **Mock External Services**: Don't rely on external APIs in tests

## Common Issues

### Test Fails with Import Error

Ensure proper module mocking:

```javascript
jest.mock('axios');
```

### Async Test Timeout

Increase timeout if needed:

```javascript
jest.setTimeout(10000);
```

### Memory Leaks

Clean up after tests:

```javascript
afterEach(() => {
  wrapper.unmount();
});
```

Previous: [Build Process](./build.md) | Next: [Requirements](../compatibility/requirements.md)
