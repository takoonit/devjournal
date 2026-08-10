## ADDED Requirements

### Requirement: Composer actions remain reachable on mobile
The system SHALL keep the primary composer actions visible and operable at narrow widths while the software keyboard is open.

#### Scenario: Compose with a mobile keyboard
- **WHEN** a user edits an entry in a narrow visual viewport with the software keyboard open
- **THEN** `Save private` and `Publish entry` remain reachable without dismissing the keyboard or scrolling to the end of the document

#### Scenario: Bottom safe area is present
- **WHEN** a mobile device reports a bottom safe-area inset
- **THEN** the action row includes that inset and does not cover the final editable content

### Requirement: Entry type selection stays understandable at narrow widths
The system SHALL keep the selected entry type visible and make every available type reachable by touch and keyboard.

#### Scenario: Selected type at narrow width
- **WHEN** the composer is rendered at mobile width
- **THEN** the selected TypeStamp remains visible beside a `Change type` control

#### Scenario: Change type on mobile
- **WHEN** the user activates `Change type`
- **THEN** all entry types become available without page-wide horizontal overflow and the chosen type returns to the visible summary

#### Scenario: Desktop type picker
- **WHEN** the composer has enough inline space
- **THEN** the full existing TypeStamp row remains visible

### Requirement: Shortcut hints match the user's platform
The system SHALL accept Meta+Enter and Ctrl+Enter while displaying the shortcut convention for the current platform.

#### Scenario: macOS hint
- **WHEN** the composer runs on macOS
- **THEN** the hint displays `⌘↵` and Meta+Enter submits a valid form

#### Scenario: Windows or Linux hint
- **WHEN** the composer runs on Windows or Linux
- **THEN** the hint displays `Ctrl+Enter` and Ctrl+Enter submits a valid form

### Requirement: Project creation continues into authoring
The system SHALL route a successfully created project directly to its project record.

#### Scenario: Create a project
- **WHEN** the user submits a valid new-project form
- **THEN** the system creates the project and opens `/editor/projects/<created-id>` so the first entry action is immediately available

### Requirement: Tech stack entry is consistent
The system SHALL provide the same tech-stack parsing and editing behavior in project creation and project editing.

#### Scenario: Add comma-separated technologies
- **WHEN** the user enters multiple comma-separated technologies and confirms the field
- **THEN** the system adds each trimmed non-empty value as a separate technology

#### Scenario: Avoid duplicate technologies
- **WHEN** the user enters a technology already present with different letter casing or surrounding whitespace
- **THEN** the system retains one value and does not add a duplicate

### Requirement: Public portfolio access is signposted from a project
The system SHALL show a direct public-page action on a project record once that project has a confirmed public entry.

#### Scenario: Project has public work
- **WHEN** a project contains at least one confirmed public entry
- **THEN** its editor record shows a `View public page` link that opens the matching portfolio slug

#### Scenario: Project is private
- **WHEN** a project has no confirmed public entries
- **THEN** the project record does not claim that a public page exists

### Requirement: Export filenames use the local calendar date
The system SHALL derive date segments in `.devjournal` download filenames from the user's local calendar date.

#### Scenario: Local date differs from UTC
- **WHEN** the user's local date differs from the current UTC date
- **THEN** a backup or selected-project export filename contains the local `yyyy-MM-dd` date

### Requirement: Root navigation redirects without rendering an erroring page
The system SHALL redirect `/` to `/portfolio` through Next.js routing configuration rather than a rendered Cache Components page.

#### Scenario: Visit the root route
- **WHEN** a visitor requests `/`
- **THEN** the response redirects to `/portfolio` without logging a page-render redirect validation error
