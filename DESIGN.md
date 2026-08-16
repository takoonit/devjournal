---
name: "DevJournal"
colors:
  primary: "#4655b7"
  on-primary: "#ffffff"
  primary-container: "#dfe1ff"
  on-primary-container: "#202a73"
  secondary-container: "#f8d8f1"
  tertiary-container: "#f5e45d"
  surface: "#fff8f7"
  surface-container: "#f5eff7"
  on-surface: "#1d1b20"
typography:
  display:
    fontFamily: "Google Sans Flex"
    fontSize: "6rem"
    fontWeight: "750"
  headline:
    fontFamily: "Google Sans Flex"
    fontSize: "3.5rem"
    fontWeight: "650"
  body:
    fontFamily: "Google Sans Flex"
    fontSize: "1rem"
    fontWeight: "400"
rounded:
  small: "0.5rem"
  medium: "0.75rem"
  large: "1rem"
  extra-large: "1.75rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  primary-action:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
---

## Overview

DevJournal helps independent developers turn daily work notes into a public body of work. The interface should make capture feel immediate, make private and public state unmistakable, and give ongoing work a sense of optimistic momentum.

## Expressive Intent

The product should feel inventive, encouraging, and alive without turning writing into spectacle. Color, shape, type, and motion direct attention toward the next useful action: start a project, continue active work, write an entry, or publish deliberately.

## Attention Hierarchy

The current task is the primary focal point. On the ledger, that is the active project or first-project action. On a project, it is the new-entry action. In the composer, it is the writing surface followed by the separate private-save and publish decisions. Large Google Sans Flex display type, primary containers, contrasting rounded shapes, and one prominent filled or extended action establish this order. Supporting counts, metadata, filters, and navigation use quieter surface containers.

## Context & Restraint

Expression is welcome in the editor hero, project identity, entry-type choice, empty states, and completion feedback. Long-form reading, form fields, settings, import/export, authentication, publishing confirmation, and destructive dialogs stay familiar and calm. Shape changes and color must communicate grouping, selection, status, or action priority rather than decorate empty space.

## Accessibility

Text and icons must meet WCAG AA contrast against their assigned Material color roles. Interactive controls keep a minimum 44px target, visible keyboard focus, semantic names, and at least two indicators for selected or error states. Body text scales without clipping at 200%, layouts avoid horizontal overflow at 320px, and color never carries status alone. Reduced motion removes translation, scale, morphing, and spring-like effects while preserving immediate state changes.

## Hero Moments

1. The editor ledger uses a large expressive headline, asymmetric primary container, and extended action to make the next work session obvious.
2. Entry types use a tonal button group whose selected control changes color, weight, and shape. The composer itself remains a calm high-emphasis surface.

## Expressive System

Color follows complete Material roles rather than isolated accents: cobalt primary roles establish action, orchid secondary roles group supporting choices, and warm yellow tertiary roles mark progress and entry categories. Typography uses Google Sans Flex, changing weight, width, optical size, and roundedness by role, with the strongest contrast reserved for display text. Containment uses large and extra-large card corners, full control corners, and contrasting adjacent shapes to group related content. Component choice favors native semantic controls styled as Material buttons, cards, app bars, navigation rails, bottom navigation, chips, and dialogs. State layers cover hover, focus, pressed, selected, and disabled states. Emphasized motion uses short scale and shape responses around meaningful actions, never decorative loops.

## Responsive Sizing

Compact layouts run from 320px through 599px with a top app bar, bottom navigation, single-column cards, full-width forms, and reachable actions. Medium layouts from 600px through 1023px use a wider single pane and contextual toolbars. Expanded layouts at 1024px and above use a navigation rail and supporting panes. Type and macro spacing use `clamp()`, content measure remains readable, controls keep 44px targets, and containers own composition changes through media or container queries.

## Platform Adaptation

Target: `web` in Next.js and React. CSS custom properties provide Material color roles, shape scales, state layers, and motion tokens. Google Sans Flex supplies variable weight, width, optical size, grade, slant, and roundedness through `next/font`. Native links, buttons, inputs, details, and dialogs keep browser semantics. Android-only or unavailable-on-web M3 Expressive components, including official split-button and shape-morph implementations, are not copied; connected native buttons, CSS transitions, and static shape contrast are the fallbacks. Wallpaper-derived dynamic color is unavailable on the web, so DevJournal ships tested light and dark schemes from one cobalt seed direction.

## Evidence

- `M3E-OFFICIAL-OVERVIEW` (advisory, web-safe): Material Design 3 homepage, “M3 Expressive: Design with emotion” and “Expressive components,” retrieved 2026-08-16. https://m3.material.io/
- `M3E-RESEARCH-ATTENTION` (advisory): Google Design, “Better, Easier, Emotional UX,” sections “What is expressive design?” and “Expressive designs are easier to use,” retrieved 2026-08-16. https://design.google/library/expressive-material-design-google-research
- `M3-INTERACTION-STATES` (normative): Material Design 3, “States,” requirements for consistent and redundant state indicators, retrieved 2026-08-16. https://m3.material.io/foundations/interaction/states/overview
- `M3-ADAPTIVE-LAYOUT` (advisory): Material Design 3, “Canonical layout examples,” scaffold and breakpoint guidance, retrieved 2026-08-16. https://m3.material.io/foundations/layout/canonical-examples/overview
- `GSF-VARIABLE-TYPE` (advisory): Google Design, “Making Google Sans Flex,” variable-axis and small-size legibility guidance, retrieved 2026-08-16. https://design.google/library/google-sans-flex-font
- `M3E-WEB-FALLBACK` (normative availability check): Material Design 3, “Split buttons,” Web Expressive implementation marked unavailable, retrieved 2026-08-16. https://m3.material.io/components/split-button
