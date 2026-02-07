import type { TSESTree } from '@typescript-eslint/utils'
import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`,
)

export const noStatusCodeInCreateError = createRule({
  name: 'no-statuscode-in-create-error',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce `status` instead of deprecated `statusCode` in createError',
    },
    messages: {
      useStatus: '`statusCode` is deprecated in createError. Use `status` instead.',
    },
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        // Check if calling createError
        if (
          node.callee.type === 'Identifier'
          && node.callee.name === 'createError'
          && node.arguments[0]?.type === 'ObjectExpression'
        ) {
          const arg = node.arguments[0]

          // Find statusCode property
          const statusCodeProp = arg.properties.find(
            (prop): prop is TSESTree.Property =>
              prop.type === 'Property'
              && prop.key.type === 'Identifier'
              && prop.key.name === 'statusCode',
          )

          if (statusCodeProp) {
            context.report({
              node: statusCodeProp,
              messageId: 'useStatus',
              fix(fixer) {
                // Replace `statusCode` with `status`
                return fixer.replaceText(statusCodeProp.key, 'status')
              },
            })
          }
        }
      },
    }
  },
})
