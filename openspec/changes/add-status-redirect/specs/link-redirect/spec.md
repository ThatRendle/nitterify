## ADDED Requirements

### Requirement: Redirect status links

The extension SHALL redirect navigations to x.com and twitter.com status URLs to the configured Nitter instance, preserving the path.

#### Scenario: Tweet permalink

- **WHEN** the browser navigates to `https://x.com/jack/status/20`
- **THEN** the extension redirects to `https://<instance>/jack/status/20`

#### Scenario: twitter.com host

- **WHEN** the browser navigates to `https://twitter.com/jack/status/20`
- **THEN** the extension redirects to `https://<instance>/jack/status/20`

#### Scenario: Media subpath

- **WHEN** the browser navigates to `https://x.com/jack/status/20/photo/1`
- **THEN** the extension redirects to `https://<instance>/jack/status/20/photo/1`

#### Scenario: Handle-less status

- **WHEN** the browser navigates to `https://x.com/i/web/status/20`
- **THEN** the extension redirects to `https://<instance>/i/web/status/20`

### Requirement: Redirect article links

The extension SHALL redirect navigations to x.com and twitter.com article URLs to the configured Nitter instance, preserving the path.

#### Scenario: Article permalink

- **WHEN** the browser navigates to `https://x.com/i/article/2075361336381555096`
- **THEN** the extension redirects to `https://<instance>/i/article/2075361336381555096`

### Requirement: Strip the query string

The extension SHALL discard the query string when redirecting, so that share-tracking parameters are not carried to the Nitter instance.

#### Scenario: Tracking parameters removed

- **WHEN** the browser navigates to `https://x.com/jack/status/20?s=46&t=abc123`
- **THEN** the extension redirects to `https://<instance>/jack/status/20` with no query string

### Requirement: Leave unmapped paths untouched

The extension SHALL NOT redirect x.com or twitter.com URLs that do not match a status or article path, because they have no clean Nitter equivalent.

#### Scenario: Home timeline is not redirected

- **WHEN** the browser navigates to `https://x.com/home`
- **THEN** the extension does not redirect and the navigation proceeds to x.com

#### Scenario: Bare profile is not redirected

- **WHEN** the browser navigates to `https://x.com/jack`
- **THEN** the extension does not redirect and the navigation proceeds to x.com
