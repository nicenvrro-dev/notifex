// Extract initials from either (firstName, lastName) OR a fullName
export function getNameInitials(firstNameOrFullName: string = "", lastName: string = "") {
  let parts: string[];

  if (lastName) {
    // Case: first + last name provided separately
    parts = [firstNameOrFullName, lastName];
  } else {
    // Case: only full name provided
    parts = firstNameOrFullName.trim().split(/\s+/);
  }

  // Take the first letter of the first and last "words" only
  const initials = [parts[0], parts[parts.length - 1]]
    .filter(Boolean)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  return initials;
}
