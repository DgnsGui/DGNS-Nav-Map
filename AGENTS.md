# Codex Agent Instructions

This is a messy Snap Spectacles Lens Studio 5.12 TypeScript project.

## Mission
Take full ownership of improving the map system.

1. Understand the entire map / pins / places system
2. Identify inconsistencies, duplicated logic, and architectural issues
3. Refactor the system to be clean, modular, and maintainable

## Bugs to Fix
### BUG 1
Pins created via `Add Pin` do not spawn quest markers.
All pins must always spawn a quest marker.

### BUG 2
Places sometimes spawn at incorrect positions, offset from the user location.
They must always appear around the user’s real position.

## Requirements
- Centralize all pin creation into a single system (`PinFactory` or equivalent)
- Centralize quest marker creation
- Ensure a single source of truth for user position
- Fix coordinate space inconsistencies (local vs world)
- Remove duplicated logic between Add Pin and Places flows
- Make the system deterministic and stable

## Constraints
- Lens Studio 5.12 API
- TypeScript only
- Optimize for Spectacles performance
- Avoid allocations in update loops

## Deliverables
- Clean refactor
- Bug fixes
- Clear explanation of what was broken and why
