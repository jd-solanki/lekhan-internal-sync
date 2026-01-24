import type { TSESTree } from '@typescript-eslint/utils'
import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`,
)

function isPgTableCall(node: TSESTree.Node | undefined): node is TSESTree.CallExpression {
  return (
    node?.type === 'CallExpression'
    && node.callee.type === 'Identifier'
    && node.callee.name === 'pgTable'
  )
}

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getTableName(callExpr: TSESTree.CallExpression): string | null {
  const firstArg = callExpr.arguments[0]
  if (firstArg?.type === 'Literal' && typeof firstArg.value === 'string') {
    return firstArg.value
  }
  return null
}

export const dbTableNaming = createRule({
  name: 'db-table-naming',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce pgTable variables use dbTable<Entity> pattern in PascalCase',
    },
    messages: {
      invalidNaming: 'Table variable "{{actual}}" must be "{{expected}}" (pattern: dbTable<Entity> from pgTable(\'{{tableName}}\', ...))',
      noDestructuring: 'Cannot destructure from pgTable - use direct assignment: const {{expected}} = pgTable(...)',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    return {
      // Check: export const name = pgTable(...)
      ExportNamedDeclaration(node) {
        if (
          node.declaration?.type === 'VariableDeclaration'
          && node.declaration.kind === 'const'
        ) {
          for (const declarator of node.declaration.declarations) {
            if (!isPgTableCall(declarator.init))
              continue

            const callExpr = declarator.init
            const tableName = getTableName(callExpr)

            // Reject destructuring
            if (declarator.id.type === 'ObjectPattern') {
              const expected = tableName
                ? `dbTable${tableName.split('_').map(toPascalCase).join('')}`
                : 'dbTable<Entity>'

              context.report({
                node: declarator.id,
                messageId: 'noDestructuring',
                data: { expected },
              })
              continue
            }

            // Handle: export const name = pgTable(...)
            if (declarator.id.type === 'Identifier') {
              const varName = declarator.id.name

              if (!varName.startsWith('dbTable')) {
                const expected = tableName
                  ? `dbTable${tableName.split('_').map(toPascalCase).join('')}`
                  : 'dbTable<Entity>'

                context.report({
                  node: declarator.id,
                  messageId: 'invalidNaming',
                  data: {
                    actual: varName,
                    expected,
                    tableName: tableName || '<table>',
                  },
                })
                continue
              }

              // Validate full pattern if table name known
              if (tableName) {
                const entityName = tableName.split('_').map(toPascalCase).join('')
                const expected = `dbTable${entityName}`

                if (varName !== expected) {
                  context.report({
                    node: declarator.id,
                    messageId: 'invalidNaming',
                    data: {
                      actual: varName,
                      expected,
                      tableName,
                    },
                  })
                }
              }
            }
          }
        }
      },

      // Check: const name = pgTable(...) (non-exported)
      VariableDeclaration(node) {
        if (node.kind !== 'const')
          return

        // Skip if this is part of an export (already handled above)
        if (node.parent?.type === 'ExportNamedDeclaration')
          return

        for (const declarator of node.declarations) {
          if (!isPgTableCall(declarator.init))
            continue

          const callExpr = declarator.init
          const tableName = getTableName(callExpr)

          // Reject destructuring
          if (declarator.id.type === 'ObjectPattern') {
            const expected = tableName
              ? `dbTable${tableName.split('_').map(toPascalCase).join('')}`
              : 'dbTable<Entity>'

            context.report({
              node: declarator.id,
              messageId: 'noDestructuring',
              data: { expected },
            })
            continue
          }

          // Handle: const name = pgTable(...)
          if (declarator.id.type === 'Identifier') {
            const varName = declarator.id.name

            if (!varName.startsWith('dbTable')) {
              const expected = tableName
                ? `dbTable${tableName.split('_').map(toPascalCase).join('')}`
                : 'dbTable<Entity>'

              context.report({
                node: declarator.id,
                messageId: 'invalidNaming',
                data: {
                  actual: varName,
                  expected,
                  tableName: tableName || '<table>',
                },
              })
              continue
            }

            if (tableName) {
              const entityName = tableName.split('_').map(toPascalCase).join('')
              const expected = `dbTable${entityName}`

              if (varName !== expected) {
                context.report({
                  node: declarator.id,
                  messageId: 'invalidNaming',
                  data: {
                    actual: varName,
                    expected,
                    tableName,
                  },
                })
              }
            }
          }
        }
      },
    }
  },
})
