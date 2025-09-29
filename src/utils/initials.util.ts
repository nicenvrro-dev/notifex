/**
 * Extracts initials from either:
 * - (firstName, lastName)
 * - full name string
 */
export function extractInitials(firstNameOrFullName: string = "", lastName: string = "") {
  const parts = lastName ? [firstNameOrFullName, lastName] : firstNameOrFullName.trim().split(/\s+/)

  return[parts[0], parts[parts.length - 1]].filter(Boolean).map(
    (name) => name[0]?.toUpperCase() ?? ""
  ).join("")
}
