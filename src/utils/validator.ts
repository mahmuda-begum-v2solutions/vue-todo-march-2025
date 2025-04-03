import { isValidText, sanitizeInput } from './sanitizeInput'

export class TodoValidator {
  private title: string
  private description: string
  public errors: { title?: string; description?: string } = {}

  constructor(title: string, description: string) {
    this.title = sanitizeInput(title)
    this.description = sanitizeInput(description)
  }

  // ✅ Validate title
  private validateTitle(requireAlphaNumeric: boolean = true): boolean {
    const titleWithoutSpaces = this.title.replace(/\s+/g, '') // Remove spaces only for length check

    if (!this.title) {
      this.errors.title = 'Title field is required'
      return false
    }
    if (titleWithoutSpaces.length > 20) {
      this.errors.title = 'Title must be max 20 characters (excluding spaces)'
      return false
    }
    if (requireAlphaNumeric && !isValidText(this.title)) {
      this.errors.title = 'Title can only contain alphabets and numbers'
      return false
    }
    return true
  }

  // ✅ Validate description
  private validateDescription(requireAlphaNumeric: boolean = true): boolean {
    const descriptionWithoutSpaces = this.description.replace(/\s+/g, '') // Remove spaces only for length check

    if (!this.description) {
      this.errors.description = 'Description field is required'
      return false
    }
    if (descriptionWithoutSpaces.length > 40) {
      this.errors.description = 'Description must be max 40 characters (excluding spaces)'
      return false
    }
    if (requireAlphaNumeric && !isValidText(this.description)) {
      this.errors.description = 'Description can only contain alphabets and numbers'
      return false
    }
    return true
  }

  // ✅ Run all validations
  public validate(requireAlphaNumeric: boolean = true): boolean {
    this.errors = {} // Reset errors before validation
    const isTitleValid = this.validateTitle(requireAlphaNumeric)
    const isDescriptionValid = this.validateDescription(requireAlphaNumeric)
    return isTitleValid && isDescriptionValid
  }

  // ✅ Get sanitized values
  public getSanitizedData(): { title: string; description: string } {
    return { title: this.title, description: this.description }
  }
}
