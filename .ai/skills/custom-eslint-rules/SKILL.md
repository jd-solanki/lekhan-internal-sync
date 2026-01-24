# Custom ESLint Rules Development Guide

## Project Structure

```

my-nuxt-app/
├── eslint/
│   ├── rules/
│   │   ├── no-statuscode-in-create-error.ts
│   │   └── no-statusmessage-in-create-error.ts
│   ├── tests/
│   │   ├── no-statuscode-in-create-error.test.ts
│   │   └── no-statusmessage-in-create-error.test.ts
│   ├── index.ts
│   └── tsconfig.json
├── eslint.config.js
└── package.json

```

## Rule Template

```typescript
// eslint/rules/rule-name.ts
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`
);

export const ruleName = createRule({
  name: 'rule-name',
  meta: {
    type: 'problem', // or 'suggestion' or 'layout'
    docs: {
      description: 'Rule description here',
    },
    messages: {
      messageId: 'Error message template here',
    },
    schema: [], // JSON schema for rule options
    fixable: 'code', // Include if rule provides auto-fix
  },
  defaultOptions: [],
  
  create(context) {
    return {
      // AST node type to match (e.g., CallExpression, FunctionDeclaration)
      NodeType(node) {
        // Check conditions
        if (shouldReport) {
          context.report({
            node: targetNode,
            messageId: 'messageId',
            fix(fixer) {
              // Return fixer for auto-fix (optional)
              return fixer.replaceText(node, 'replacement');
            },
          });
        }
      },
    };
  },
});
```

## Test Template

```typescript
// eslint/tests/rule-name.test.ts
import { RuleTester } from '@typescript-eslint/rule-tester';
import { describe, afterAll } from 'vitest';
import { ruleName } from '../rules/rule-name';

// Required for vitest integration
RuleTester.afterAll = afterAll;
RuleTester.describe = describe;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
});

ruleTester.run('rule-name', ruleName, {
  valid: [
    // Test cases that SHOULD NOT trigger the rule
    `codeExample1()`,
    `codeExample2({ correct: true })`,
  ],
  invalid: [
    // Test cases that SHOULD trigger the rule
    {
      code: `incorrectCodeExample()`,
      output: `correctCodeExample()`, // Expected after auto-fix
      errors: [{ messageId: 'messageId' }],
    },
  ],
});
```

## Test Case Guidelines

### Valid Test Cases

Include examples that:

1. **Correct usage** - Code that follows the rule
2. **Different functions** - Same pattern but different function names (shouldn't match)
3. **Different structures** - Similar code structures that shouldn't trigger
4. **Edge cases** - Boundary conditions that are acceptable

### Invalid Test Cases

Include examples that:

1. **Basic violation** - Simple case of deprecated pattern
2. **With multiple properties** - Deprecated pattern with other properties
3. **Nested/complex** - In different contexts (throw statements, assignments, etc.)
4. **Multi-line** - Test formatting preservation
5. **Edge cases** - Unusual but valid violations

## Common AST Node Types

- `CallExpression` - Function calls: `func(args)`
- `FunctionDeclaration` - Function definitions: `function name() {}`
- `ArrowFunctionExpression` - Arrow functions: `() => {}`
- `ObjectExpression` - Object literals: `{ key: value }`
- `Property` - Object properties
- `Identifier` - Variable/function names
- `MemberExpression` - Property access: `obj.prop`
- `ImportDeclaration` - Import statements

## Example: Property Replacement Rule Pattern

For rules that replace deprecated object properties (like `statusCode → status`):

### Rule Structure

```typescript
create(context) {
  return {
    CallExpression(node) {
      // 1. Check if it's the target function call
      if (
        node.callee.type === 'Identifier' &&
        node.callee.name === 'targetFunction' &&
        node.arguments[0]?.type === 'ObjectExpression'
      ) {
        const arg = node.arguments[0];
        
        // 2. Find deprecated property
        const deprecatedProp = arg.properties.find(
          (prop): prop is TSESTree.Property =>
            prop.type === 'Property' &&
            prop.key.type === 'Identifier' &&
            prop.key.name === 'deprecatedName'
        );

        // 3. Report and fix
        if (deprecatedProp) {
          context.report({
            node: deprecatedProp,
            messageId: 'useNewName',
            fix(fixer) {
              return fixer.replaceText(deprecatedProp.key, 'newName');
            },
          });
        }
      }
    },
  };
}
```

### Test Structure

```typescript
ruleTester.run('rule-name', ruleName, {
  valid: [
    // Correct usage
    `targetFunction({ newName: value })`,
    
    // Different function (shouldn't match)
    `otherFunction({ deprecatedName: value })`,
    
    // No arguments
    `targetFunction()`,
    
    // String argument instead of object
    `targetFunction('string')`,
  ],
  invalid: [
    // Simple case
    {
      code: `targetFunction({ deprecatedName: 123 })`,
      output: `targetFunction({ newName: 123 })`,
      errors: [{ messageId: 'useNewName' }],
    },
    
    // Multiple properties
    {
      code: `targetFunction({ deprecatedName: 123, other: 'value' })`,
      output: `targetFunction({ newName: 123, other: 'value' })`,
      errors: [{ messageId: 'useNewName' }],
    },
    
    // In throw statement
    {
      code: `throw targetFunction({ deprecatedName: 404 })`,
      output: `throw targetFunction({ newName: 404 })`,
      errors: [{ messageId: 'useNewName' }],
    },
    
    // Multi-line
    {
      code: `targetFunction({
        deprecatedName: 'value',
        other: 123
      })`,
      output: `targetFunction({
        newName: 'value',
        other: 123
      })`,
      errors: [{ messageId: 'useNewName' }],
    },
  ],
});
```

## How to Request New Rules

Provide:

1. **Function/pattern to target** - Which function calls or code patterns to match
2. **Deprecated property/pattern** - What to find and replace
3. **Replacement** - What it should become
4. **Context** - Any specific conditions (e.g., only in certain functions)
5. **Example code** - Before and after examples

### Example Request Format

```
Create ESLint rule:
- Target: `createError()` calls
- Replace: `statusCode` property → `status`
- Auto-fix: Yes
- Example:
  Before: createError({ statusCode: 403 })
  After: createError({ status: 403 })
```

## Testing

```bash
# Run all ESLint rule tests
npm run test:eslint

# Run specific test file
vitest eslint/tests/rule-name.test.ts

# Watch mode
npm run test:eslint:watch
```

## Registration

### 1. Export from index.ts

```typescript
// eslint/index.ts
import { ruleName } from './rules/rule-name';

export const rules = {
  'rule-name': ruleName,
  // ... other rules
};
```

### 2. Add to eslint.config.js

```javascript
import { rules } from './eslint/index.ts';

export default [
  {
    plugins: {
      'local': { rules }
    },
    rules: {
      'local/rule-name': 'error', // or 'warn'
    }
  }
];
```

## Useful Resources

- [TypeScript ESLint Custom Rules](https://typescript-eslint.io/developers/custom-rules)
- [AST Explorer](https://astexplorer.net/) - Visualize AST (select @typescript-eslint/parser)
- [ESLint Rule API](https://eslint.org/docs/latest/extend/custom-rules)
- [@typescript-eslint/utils API](https://typescript-eslint.io/packages/utils)

## Tips

1. **Use AST Explorer** to understand node structures for your target code
2. **Start with valid cases** - Easier to write tests for correct code first
3. **Test edge cases** - Multi-line, nested, with/without other properties
4. **Keep rules focused** - One responsibility per rule
5. **Provide clear messages** - Users should understand what's wrong and how to fix
