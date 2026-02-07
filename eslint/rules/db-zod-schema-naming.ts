import type { TSESTree } from '@typescript-eslint/utils'
import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`,
)

const SCHEMA_FUNCTION_SUFFIXES: Record<string, string> = {
  createSelectSchema: 'Select',
  createInsertSchema: 'Insert',
  createUpdateSchema: 'Update',
}

function isSchemaCall(node: TSESTree.Node | undefined): node is TSESTree.CallExpression {
  return (
    node?.type === 'CallExpression'
    && node.callee.type === 'Identifier'
    && node.callee.name in SCHEMA_FUNCTION_SUFFIXES
  )
}

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getEntityName(callExpr: TSESTree.CallExpression): string | null {
  const firstArg = callExpr.arguments[0]
  if (firstArg?.type === 'Identifier') {
    const name = firstArg.name
    // Remove dbTable prefix if present
    if (name.startsWith('dbTable')) {
      return name.slice(7) // Remove 'dbTable'
    }
    return name
  }
  return null
}

export const dbZodSchemaNaming = createRule({
  name: 'db-zod-schema-naming',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce strict Drizzle Zod schema naming: dbSchema<Entity><Select|Insert|Update> from dbTable<Entity>',
    },
    messages: {
      invalidNaming: 'Schema "{{actual}}" must be "{{expected}}" (pattern: dbSchema<Entity>{{suffix}} from {{functionName}}(dbTable<Entity>))',
      missingPrefix: 'Schema must start with "dbSchema"',
      wrongSuffix: 'Schema from {{functionName}} must end with "{{expectedSuffix}}" (got "{{actual}}")',
      entityNotPascalCase: 'Entity name "{{entity}}" in "{{actual}}" must be PascalCase',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    return {
      ExportNamedDeclaration(node) {
        if (
          node.declaration?.type === 'VariableDeclaration'
          && node.declaration.kind === 'const'
        ) {
          for (const declarator of node.declaration.declarations) {
            if (!isSchemaCall(declarator.init))
              continue

            const callExpr = declarator.init
            const functionName = callExpr.callee.name
            const expectedSuffix = SCHEMA_FUNCTION_SUFFIXES[functionName]
            const entityName = getEntityName(callExpr)

            // Handle: export const name = createSelectSchema(dbTableEntity)
            if (declarator.id.type === 'Identifier') {
              const varName = declarator.id.name

              if (!varName.startsWith('dbSchema')) {
                const expected = entityName
                  ? `dbSchema${toPascalCase(entityName)}${expectedSuffix}`
                  : `dbSchema<Entity>${expectedSuffix}`

                context.report({
                  node: declarator.id,
                  messageId: 'invalidNaming',
                  data: {
                    actual: varName,
                    expected,
                    suffix: expectedSuffix,
                    functionName,
                  },
                })
                continue
              }

              // Check suffix
              if (!varName.endsWith(expectedSuffix)) {
                context.report({
                  node: declarator.id,
                  messageId: 'wrongSuffix',
                  data: {
                    actual: varName,
                    expectedSuffix,
                    functionName,
                  },
                })
                continue
              }

              // Validate full pattern if entity known
              if (entityName) {
                const pascalEntity = toPascalCase(entityName)
                const expected = `dbSchema${pascalEntity}${expectedSuffix}`

                // Check if entity part is PascalCase
                const entityPart = varName.slice(8, varName.length - expectedSuffix.length) // Remove 'dbSchema' and suffix
                if (entityPart !== pascalEntity) {
                  context.report({
                    node: declarator.id,
                    messageId: 'invalidNaming',
                    data: {
                      actual: varName,
                      expected,
                      suffix: expectedSuffix,
                      functionName,
                    },
                  })
                }
              }
            }
            // Handle: export const { name } = createSelectSchema(dbTableEntity)
            else if (declarator.id.type === 'ObjectPattern') {
              for (const prop of declarator.id.properties) {
                if (
                  prop.type === 'Property'
                  && prop.key.type === 'Identifier'
                ) {
                  const varName = prop.key.name

                  if (!varName.startsWith('dbSchema')) {
                    const expected = entityName
                      ? `dbSchema${toPascalCase(entityName)}${expectedSuffix}`
                      : `dbSchema<Entity>${expectedSuffix}`

                    context.report({
                      node: prop.key,
                      messageId: 'invalidNaming',
                      data: {
                        actual: varName,
                        expected,
                        suffix: expectedSuffix,
                        functionName,
                      },
                    })
                    continue
                  }

                  if (!varName.endsWith(expectedSuffix)) {
                    context.report({
                      node: prop.key,
                      messageId: 'wrongSuffix',
                      data: {
                        actual: varName,
                        expectedSuffix,
                        functionName,
                      },
                    })
                    continue
                  }

                  if (entityName) {
                    const pascalEntity = toPascalCase(entityName)
                    const expected = `dbSchema${pascalEntity}${expectedSuffix}`
                    const entityPart = varName.slice(8, varName.length - expectedSuffix.length)

                    if (entityPart !== pascalEntity) {
                      context.report({
                        node: prop.key,
                        messageId: 'invalidNaming',
                        data: {
                          actual: varName,
                          expected,
                          suffix: expectedSuffix,
                          functionName,
                        },
                      })
                    }
                  }
                }
              }
            }
          }
        }
      },
    }
  },
})
