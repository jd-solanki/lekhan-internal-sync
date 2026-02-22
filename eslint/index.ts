import { dbTableNaming } from './rules/db-table-naming'
import { dbTypeNaming } from './rules/db-type-naming'
import { dbZodSchemaNaming } from './rules/db-zod-schema-naming'
import { noStatusCodeInCreateError } from './rules/no-statuscode-in-create-error'
import { noStatusMessageInCreateError } from './rules/no-statusmessage-in-create-error'
import { publicDbZodSchemaNaming } from './rules/public-db-zod-schema-naming'

export const rules = {
  'no-statuscode-in-create-error': noStatusCodeInCreateError,
  'no-statusmessage-in-create-error': noStatusMessageInCreateError,
  'db-zod-schema-naming': dbZodSchemaNaming,
  'public-db-zod-schema-naming': publicDbZodSchemaNaming,
  'db-table-naming': dbTableNaming,
  'db-type-naming': dbTypeNaming,
}
