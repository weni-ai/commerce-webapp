# Changelog
<!-- documentation: https://keepachangelog.com/en/1.1.0/ -->

## [1.0.0] - 2024-10-04

Release of the internally named version 1.0, integrating with the real API.

### Added

- Environment variables support for `Sentry` and `API base URL`.
- Integration for list `available solutions`, `integrate solutions`, `update integrated solution`, `list integrated solutions` and `delete integrated solution`.
- Global handling of unhandled rejections (for example: errors coming from the API should issue an error alert as feedback to the user).
- Automation to automatically create the staging tag from the `staging` branch.
- [APIPhantom](https://github.com/weni-ai/APIPhantom) support.

[1.0.0]: https://github.com/weni-ai/commerce-webapp/compare/0.1.3...1.0.0
