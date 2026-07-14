## ADDED Requirements

### Requirement: Default instance

The extension SHALL default the target Nitter instance to `xcancel.com` when the user has not configured one.

#### Scenario: Fresh install

- **WHEN** the extension is installed and no instance has been saved
- **THEN** redirects target `xcancel.com`

### Requirement: Configurable instance

The extension SHALL provide an options page with a single field for the target Nitter instance, and SHALL persist the value so it survives browser restarts and syncs across the user's signed-in browsers.

#### Scenario: Change the instance

- **WHEN** the user enters `nitter.example.com` on the options page and saves
- **THEN** the value is persisted and subsequent status/article navigations redirect to `https://nitter.example.com/...`

#### Scenario: Custom self-hosted instance

- **WHEN** the user has saved a self-hosted instance host
- **THEN** redirects target that host instead of `xcancel.com`

### Requirement: Redirect rules follow the configured instance

The extension SHALL rebuild its redirect rules whenever the configured instance changes, so that the active instance always matches the saved setting.

#### Scenario: Rules update after a change

- **WHEN** the user saves a new instance value
- **THEN** the redirect rules are updated to point at the new instance without requiring a browser restart
