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
  
