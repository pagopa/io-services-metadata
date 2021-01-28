### cobadgeServices.json
#### changes
**01.27.2021**
- change `CobadgeResponse/executionStatus` from string to enum: `OK`,`KO`,`PENDING`
- remove pattern from date fields and change format from `date` to `date-time`. io-utils generates an invalid regex
- add operation id on each API. io-utils can't generate request types without them.
- change response code from 201 to 200
- add security/Bearer (for each API) and securityDefinitions field 