import { noStatusCodeInCreateError } from './rules/no-statuscode-in-create-error'
import { noStatusMessageInCreateError } from './rules/no-statusmessage-in-create-error'

export const rules = {
  'no-statuscode-in-create-error': noStatusCodeInCreateError,
  'no-statusmessage-in-create-error': noStatusMessageInCreateError,
}
