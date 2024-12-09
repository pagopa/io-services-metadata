### zendesk.json

The `zendesk.json` file contains the configuration that guide the zendesk assistance request flow.

Below the fields that composing the configuration:

- `panicMode` [**required**]: Boolean. If true when the user tries to open a new request, the panic mode screen is shown.
- `zendeskCategories` [**optional**]: maps the categories and the sub-categories created in Zendesk.
  
  - `id` [**required**]: String. The Zendesk id of the categories custom field.
  - `categories` [**required**]: The array of the categories created in Zendesk. Every object represents a category.
    
    - `value` [**required**]: String. The name of the category, or the tag given to the category, in Zendesk.
    - `description` [**required**]: The Italian and the English category description shown in the app.

      - `it-IT` [**required**]: String. 
      - `en-EN` [**required**]: String. 
    - `zendeskSubCategories` [**optional**]: The sub-categories associated with the category.

        - `id` [**required**]: String. The Zendesk id of the sub-category custom field.
        - `subCategories` [**required**]: The array values of the sub-categories created in Zendesk. Every object represents a sub-category.

            - `value` [**required**]: String. The name of the sub-category, or the tag given to the sub-category, in Zendesk.
            - `description` [**required**]: The Italian and the English sub-category description shown in the app.

                - `it-IT` [**required**]: String.
                - `en-EN` [**required**]: String. 
  

### paymentMap.json

The `paymentMap.json` file contains the mapping between the sub-categories and the payment status.

Below the fields that compose the configuration:

- `subcategoryId` [**required**]: String. The unique identifier for subcategory in the payment process.

- `subcategories` [**required**]: Object. Contains subcategory definitions, where each key represents a specific payment scenario and maps to an array of associated payment statuses.

  - `pagamenti_pagopa_in_corso` [**required**]: Array of strings. Represents payments that are currently in progress.
    - Example value: `"PAYMENT_ONGOING"`.

  - `pagamenti_pagopa_blocco` [**required**]: Array of strings. Represents payments that are blocked due to an issue.  
    - Example value: `[]` (empty array, indicating no mapped statuses).

  - `pagamenti_pagopa_info_stato` [**required**]: Array of strings. Represents queries or information about the payment status.  
    - Example value: `[]` (empty array, indicating no mapped statuses).

  - `pagamenti_pagopa_altro_problema` [**required**]: Array of strings. Represents other unspecified issues related to payments.  
    - Example value: `[]` (empty array, indicating no mapped statuses). 
