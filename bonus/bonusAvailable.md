### vacanze/bonuses_available.json
- pointed by app <= `1.9.0.4` with `bpnEnabled=false`
- note: if you add a bonus, or adding an existing one, with flag `hidden=false` these versions, app opens an alert asking for an app update
- it's recommended to **DO NOT EDIT** this file (wrong handling of the continue button)

### bonus_available.json
- pointed by app <= `1.9.0.4` with `bpnEnabled=true`
- only for tests purposes

### bonus_available_v1.json
- pointed by app == `1.10.0.3` & `1.10.0.4`
- from these versions
    - if you add a bonus or edit an existing one with `hidden=false` & `is_active=false` app does nothing
    - if you add a bonus or edit an existing one with `hidden=false` & `is_active=true` app asks for an update

### bonus_available_v2.json
- pointed by app > `1.10.0.4`
- A new logic for handling a bonus visibility has been implemented. Now every bonus has a new property `visibility` which can be evaluated with 3 different values:
  - `visible`: Visible for every app distributed starting from **WIP**
  - `hidden`: Hidden for every app
  - `experimental`: Bonus will be shown on any app with the related **Feature Flag** enabled by it's distributed config