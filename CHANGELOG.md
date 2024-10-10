# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-10-10

Release of the internally named version 1.0, integrating with the real API.


### Added

- [Sentry](https://sentry.io/) integration.
- Unit tests for: `utils/index.ts`, `TreatUnhandledRejection.ts` and `HomeView.vue`

### Fixed

- Error when trying to integrate or edit a solution integration when the globals were empty.

## [1.0.0] - 2024-10-04

Release of the internally named version 1.0, integrating with the real API.

### Added

- Environment variables support for `Sentry` and `API base URL`.
- Integration for list `available solutions`, `integrate solutions`, `update integrated solution`, `list integrated solutions` and `delete integrated solution`.
- Global handling of unhandled rejections (for example: errors coming from the API should issue an error alert as feedback to the user).
- Automation to automatically create the staging tag from the `staging` branch.
- [APIPhantom](https://github.com/weni-ai/APIPhantom) support.

[1.0.0]: https://github.com/weni-ai/commerce-webapp/compare/0.1.3...1.0.0
[1.1.0]: https://github.com/weni-ai/commerce-webapp/compare/1.0.0...1.1.0
