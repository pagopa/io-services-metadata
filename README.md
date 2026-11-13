# Services Metadata for the Digital Citizenship initiative

This repository contains data and metadata for services used by the IO app.

## Prerequisites

1. Install `node`
1. Run `npm install -g yarn`
1. Run `yarn install`

## Updating services metadata

1. Create a git branch
1. Update `services.yml`
1. Run `yarn generate:definitions`
1. Run `yarn update_services`
1. Commit, push and create a Pull Request

## Updating municipalities metadata

1. Create a git branch
1. Run `yarn generate:definitions`
1. Run `yarn update_municipalities`
1. Commit, push and create a Pull Request

> It could happen some municipalities are missing. For those cases simply add the json files in the relative folder
> ex: a municipality with codice catastale code `C234`:
> - create a json file `C234.json`
> - add it inside `municipalities/C/2`
> - run `yarn update_municipalites` to execute an healty check on the added data

## Updating services data

1. Create a git branch
1. Manually update or create new public services data (`services-data`)
1. Manually update services description of all visible services
1. Commit, push and create a Pull Request

## CGN featured opportunities

Configure `config.cgn.featured_opportunities` in `status/backend.json` with a minimum app version and an ordered list of catalog references:

```json
{
	"min_app_version": { "ios": "5.0.0.0", "android": "5.0.0.0" },
	"opportunities": [
		{ "merchantId": "merchant-id", "discountId": "discount-id" }
	]
}
```

Use the merchant ID and the ID of one of its published discounts. The app resolves the first three references through the CGN merchant API, displaying the merchant name and image and the discount description, limited to one line and falling back to the discount name when absent. Missing, expired, future, or unavailable opportunities are omitted. An empty list disables the section. Selecting a card opens the CGN discount details in the app.

