# Lemonade

Lemonade is an aws authenticator tool that allows users to get aws credentials for different assumed account roles that are multi-factor (mfa) protected. These credentials can be used to make api calls to aws.

  - AWS-SDK Api calls
  - Different aws tools

You can read more about how lemonade works in this article: [medium article](https://medium.com/@jaxonisack/aws-mfa-account-protection-is-awesome-but-not-so-much-for-api-calls-875b9be2070f) .


### New Features!
  - Select different profiles from the system tray
  - Go offline when you dont want any profiles to be active
  - Much longer expiration of the primary session. Currently 32hrs
  - Prompt to update when new version of the app is published

### Installation

Download an executable file for lemonade from this url page: [lemonade releases](https://github.com/bychwa/lemonade/releases) .

### App Views

| | |
|:-------------------------:|:-------------------------:|
|<img align="left" src="https://github.com/bychwa/lemonade/raw/master/docs/tray.png" width="400"/>|<img align="right" src="https://github.com/bychwa/lemonade/raw/master/docs/profiles.png" width="400" /> |
|----: Menu From Tray icon ----:|:---- Hover over profiles to select ----:|
|<img src="https://github.com/bychwa/lemonade/raw/master/docs/settings.png" width="400" /> |<img align="right" src="https://github.com/bychwa/lemonade/raw/master/docs/mfa.png" width="400" /> |
|:---- Settings for your credentials ----:|:---- Authenticating with mfa ----:|
|<img align="left" src="https://github.com/bychwa/lemonade/raw/master/docs/gui-offline.png" width="400" />|<img align="right" src="https://github.com/bychwa/lemonade/raw/master/docs/gui-profile.png" width="400" />|
|:---- When not using, go offline ----:|:---- You can pick profile you want ----:|

### Todos

 * Encrypt data store with keychain password when offline
