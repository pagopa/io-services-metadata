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

## Updating services data

1. Create a git branch
1. Manually update or create new public services data (`services-data`)
1. Manually update services description of all visible services
1. Commit, push and create a Pull Request
