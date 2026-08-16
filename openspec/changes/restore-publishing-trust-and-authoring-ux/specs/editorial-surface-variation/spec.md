## ADDED Requirements

### Requirement: Main editor surfaces have distinct editorial roles
The system SHALL distinguish the editor index, project record, and settings page through hierarchy and composition while retaining the Press Proof token and component system.

#### Scenario: Editor index composition
- **WHEN** a user visits the editor index
- **THEN** the page presents a working-ledger hierarchy with dateline, compact totals, and project entry points as its primary structure

#### Scenario: Project record composition
- **WHEN** a user visits a project record
- **THEN** the page presents project identity, status, dates, stack, public access, and record actions as an issue cover before the timeline

#### Scenario: Settings composition
- **WHEN** a user visits settings
- **THEN** the page presents a colophon index and grouped sections instead of repeating the same masthead-ledger composition used by the editor index

### Requirement: Settings use progressive disclosure
The system SHALL keep core profile and publishing controls immediately available while allowing secondary settings groups to be collapsed with native semantics.

#### Scenario: Initial settings view
- **WHEN** settings first renders
- **THEN** Profile and Publishing are open while Composition, Links, and Data Portability can remain collapsed

#### Scenario: Keyboard navigation
- **WHEN** a keyboard user traverses and activates a settings disclosure summary
- **THEN** focus order remains logical and all controls in the opened section are reachable

#### Scenario: Save collapsed settings
- **WHEN** the user changes a control and later collapses its section before saving
- **THEN** the changed value remains in form state and is included in the save action

### Requirement: Public empty state reads as an unprinted folio
The system SHALL present an empty public portfolio without a warning-style color slab or a false claim that projects have a publish control.

#### Scenario: No public projects
- **WHEN** the public portfolio has no project with a public entry
- **THEN** the page shows a quiet paper surface, restrained rule or folio mark, concise entry-level explanation, and no warning wash

#### Scenario: Empty state at mobile width
- **WHEN** the empty public portfolio is viewed at 320px or wider
- **THEN** text and any owner-facing editor link wrap without clipping or page-wide horizontal scrolling

### Requirement: Midnight Ink has readable material separation
The system SHALL distinguish canvas, base, raised sheet, input, and rule surfaces in Midnight Ink without adding a new accent or decorative effect.

#### Scenario: Dark theme hierarchy
- **WHEN** Midnight Ink is active
- **THEN** adjacent structural surfaces and hairline rules remain distinguishable at normal display brightness

#### Scenario: Semantic color roles remain stable
- **WHEN** either theme is active
- **THEN** red remains the single accent and positive, warning, and destructive colors retain their existing semantic meanings

### Requirement: Press Proof invariants remain intact
The system SHALL preserve the existing typography, reading measure, interaction size, focus, semantic order, and motion constraints while varying page composition.

#### Scenario: Composer and published prose
- **WHEN** authoring and public prose are compared
- **THEN** both use the existing `text-prose` metrics and 66ch measure

#### Scenario: Accessible controls
- **WHEN** new or rearranged controls are inspected
- **THEN** they retain at least a 44px target, visible focus, semantic labels, and DOM order matching visual order

#### Scenario: Reduced motion
- **WHEN** reduced motion is active
- **THEN** the redesigned surfaces use opacity-only block transitions and no decorative text animation

#### Scenario: Populated public pages
- **WHEN** a public portfolio contains projects and entries
- **THEN** the existing populated project-row and timeline composition remains unchanged except for publishing correctness and access-state fixes
