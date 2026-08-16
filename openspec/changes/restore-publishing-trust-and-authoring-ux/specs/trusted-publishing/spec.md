## ADDED Requirements

### Requirement: New entries are private until explicitly published
The system SHALL create every new entry as private unless the owner explicitly chooses the publish action.

#### Scenario: Save a private entry
- **WHEN** the owner completes the composer and chooses `Save private`
- **THEN** the system stores the entry locally with confirmed public state set to false

#### Scenario: Publish is an explicit choice
- **WHEN** the owner completes the composer without selecting a publish action
- **THEN** the system SHALL NOT send the entry to the public data store

### Requirement: Only the authenticated owner can publish
The system SHALL require a valid Supabase owner session for every public mutation, SHALL rely on owner RLS policies for authorization, and SHALL grant ownership only through explicit administrative provisioning.

#### Scenario: Owner is provisioned
- **WHEN** an administrator inserts the intended Supabase Auth UUID into an empty `owner_settings` table
- **THEN** that account becomes the sole publishing owner

#### Scenario: First signup is not the owner
- **WHEN** an account signs up while `owner_settings` is empty
- **THEN** the system SHALL NOT grant publishing ownership based on signup order

#### Scenario: Connected owner publishes
- **WHEN** an authenticated owner publishes a valid private entry
- **THEN** the system writes the current profile, project, and entry to Supabase under the owner session

#### Scenario: Unauthenticated publish attempt
- **WHEN** a user without a valid owner session chooses `Publish entry`
- **THEN** the system keeps the entry private, preserves its content, and provides a path to connect the owner account

#### Scenario: Unauthorized account attempts a mutation
- **WHEN** an authenticated account that is not the configured owner sends a public mutation
- **THEN** the system rejects the request without changing local confirmed public state or Supabase portfolio data

### Requirement: Public state reflects confirmed remote state
The system SHALL set `Entry.isPublic` to true only after Supabase confirms the entry is public and SHALL keep public state truthful when a mutation fails.

#### Scenario: Publish succeeds
- **WHEN** Supabase confirms a publish mutation
- **THEN** the system marks the local entry public and announces that it is visible on the portfolio

#### Scenario: Publish fails
- **WHEN** a publish mutation fails because of configuration, authorization, validation, or network error
- **THEN** the system keeps the local entry private, preserves all entered content, and shows a retryable error

#### Scenario: Unpublish fails
- **WHEN** an unpublish mutation fails
- **THEN** the system leaves the local entry marked public and warns that the public copy is still visible

### Requirement: Published records stay coherent
The system SHALL synchronize edits and deletions that affect confirmed public entries before reporting local success.

#### Scenario: Edit a public entry
- **WHEN** the owner saves changes to a confirmed public entry
- **THEN** the system updates Supabase first, updates the local entry after confirmation, and invalidates the affected public route

#### Scenario: Edit a project with public entries
- **WHEN** the owner changes a project that contains a confirmed public entry
- **THEN** the system updates the public project before closing the editor and invalidates both old and new slug paths when applicable

#### Scenario: Edit the public profile
- **WHEN** the owner saves profile changes while at least one entry is public
- **THEN** the system updates the public profile before reporting settings saved

#### Scenario: Delete public content
- **WHEN** the owner confirms deletion of a public entry or a project containing public entries
- **THEN** the system removes the affected Supabase record before deleting the local record

### Requirement: Local records map safely to Supabase records
The system SHALL use stable local source identifiers for repeatable public writes without requiring local IDs to be UUIDs.

#### Scenario: Repeat a publish or update
- **WHEN** the same local profile, project, or entry is sent more than once
- **THEN** the system updates the remote record with the matching source identifier instead of creating a duplicate

#### Scenario: Legacy project can be adopted safely
- **WHEN** exactly one legacy remote project has the same slug and no source identifier
- **THEN** the system assigns the local source identifier once and continues the mutation

#### Scenario: Legacy profile requires reconciliation
- **WHEN** a remote profile has no source identifier
- **THEN** the system rejects automatic adoption and directs the owner to reconcile it administratively

#### Scenario: Conflicting source identity
- **WHEN** a slug is already assigned to a different non-null source identifier
- **THEN** the system rejects the mutation and reports a conflict without overwriting either record

### Requirement: Public routes expose only projects with public entries
The system SHALL allow anonymous project reads, list a project, and resolve its slug only while it has at least one entry whose confirmed public state is true in Supabase.

#### Scenario: First entry is published
- **WHEN** the first entry for a project becomes public
- **THEN** the project appears on `/portfolio` and resolves at its public slug after revalidation

#### Scenario: Last public entry is unpublished
- **WHEN** the last public entry for a project is successfully unpublished or deleted
- **THEN** the project disappears from the portfolio index and its public slug no longer resolves

#### Scenario: Public terminology
- **WHEN** the editor or public empty state describes visibility
- **THEN** the copy refers to entry-level publishing and SHALL NOT imply a separate project publish control

### Requirement: Public mutations refresh server-rendered output
The system SHALL invalidate the portfolio data tags and affected paths after each successful public mutation.

#### Scenario: Mutation completes
- **WHEN** a publish, update, unpublish, or delete mutation succeeds
- **THEN** the system invalidates `/portfolio`, the affected project path, and the relevant portfolio cache tags before returning success
