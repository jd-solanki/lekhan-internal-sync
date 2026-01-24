// eslint/rules/no-statusmessage-in-create-error.ts
import type { TSESTree } from '@typescript-eslint/utils'
import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`,
)

export const noStatusMessageInCreateError = createRule({
  name: 'no-statusmessage-in-create-error',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce `statusText` instead of deprecated `statusMessage` in createError',
    },
    messages: {
      useStatusText: '`statusMessage` is deprecated in createError. Use `statusText` instead.',
    },
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier'
          && node.callee.name === 'createError'
          && node.arguments[0]?.type === 'ObjectExpression'
        ) {
          const arg = node.arguments[0]

          const statusMessageProp = arg.properties.find(
            (prop): prop is TSESTree.Property =>
              prop.type === 'Property'
              && prop.key.type === 'Identifier'
              && prop.key.name === 'statusMessage',
          )

          if (statusMessageProp) {
            context.report({
              node: statusMessageProp,
              messageId: 'useStatusText',
              fix(fixer) {
                return fixer.replaceText(statusMessageProp.key, 'statusText')
              },
            })
          }
        }
      },
    }
  },
})
