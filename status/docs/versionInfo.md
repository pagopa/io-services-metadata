# VersionInfo structure
The file "status/versionInfo.json" contains some information related to the app version.
Each key contains a `VersionPerPlatform` in order to distinguish the semantic between the two different supported platforms. 

### `min_app_version`
This value indicates the minimum app version required to use the app. 
#### Examples
```
"min_app_version": {
    "ios": "2.0.0",
    "android": "2.0.0"
  }
```

| User has the app version |            Result             |
|:------------------------:|:-----------------------------:|
|          1.19.0          | ❌ The user cannot run the app |
|          2.0.0           |  ✅ The user can run the app   |
|          2.5.0           |  ✅ The user can run the app   |

### `min_app_version_pagopa`
This value indicates the minimum pagopa version required to use the wallet section.
If undefined, the user can always use the wallet.
#### Examples
```
"min_app_version": {
    "ios": "2.0.0",
    "android": "2.0.0"
  }
```

| User has the app version |                 Result                  |
|:------------------------:|:---------------------------------------:|
|          1.19.0          | ❌ The user cannot use the wallet or pay |
|          2.0.0           |  ✅ The user can use the wallet or pay   |
|          2.5.0           |  ✅ The user can use the wallet or pay   |

### `latest_released_app_version`
This value indicates the latest app released. This value is used to identify the app in beta for some related actions (for example automatically identify a beta report). 
An app in beta is an app with version > `latest_released_app_version`.
#### Examples
```
"latest_released_app_version": {
    "ios": "2.0.0",
    "android": "2.0.0"
  }
```

| User has the app version | isAppBeta | isAppRelease |
|:------------------------:|:---------:|-------------:|
|          1.19.0          |     ❌     |            ❌ |
|          2.0.0           |     ❌     |            ✅ |
|          2.5.0           |     ✅     |            ❌ |

### `rollout_app_version`
This value indicates if the app is considered in rollout phase. This value is used to identify the app in rollout for some related actions (for example automatically identify a rollout report).
An app in rollout is an app with version === `rollout_app_version`.
#### Examples
```
"rollout_app_version": {
    "ios": "2.0.0",
    "android": "2.0.0"
  }
```

| User has the app version | isRollout | 
|:------------------------:|:---------:|
|          1.19.0          |     ❌     |          
|          2.0.0           |     ✅     |         
|          2.5.0           |     ❌     |        

## Usage example

### I want to force the update if the user have an app version `< 2.0.0`
Change `min_app_version` to `2.0.0`

### I want to receive the beta report for a new beta lane  `2.1.0`
When the app `2.0.0` is released, change `latest_released_app_version` to `2.0.0`

### I want to monitor the rollout for the new relesed app  `2.1.0`
Change `rollout_app_version` to `2.0.0`. When the rollout is completed, change `rollout_app_version` to `0.0.0`

