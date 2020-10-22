## TODO

- Build a parser for the API response into a workabout model which categorizes feed items
- Build a class, RecipeManager which accepts an array of models & handles business logic for available recipes
  - This class will decide what optimal recipes are to concurrent redemptions
  - This will determine the order you put things into your inventory
- Build a component which owns a RecipeManager which builds an overlay of _n_ concurrent chaos recipes. This class should:

  - support accepting a mouse click, but also pass it through the app
  - eventually support regal recipe
  - use a shared feed response list with the core app
  - positionally layout on the screen based on screen coordinates
  - handle multiple grid systems based on standard and quad tab sized
  - be non-draggable

- Build a component which holds the main app controls and statuses. You should be able to:
  - Toggle the chaos recipe overlay
  - Force refresh the feed response. If this is done when the overlay is up, it refreshes it
  - Show a layout of each category & the count of items

TODO:

<!-- 1. Add the ability so that the non-item-overlay items naturally click through rather than propagate -->
<!-- 2. Maybe support two chaos recipes at once. For now, that only works if you just use 2x3 (in total) for each recipe in weapon slots (two daggers or one short bow). Super advanced optimization that will be annoying to write. Would need to sort the recipe response by weapon size. Similarly, would need to optimize the recipe manager to pair these items together -->

<!-- 3. Refactor the stashOverlay to pull the logic out of the layout controller -->
<!-- 4. Itemized recipe manager -->

5. Build the filter swapping functionality
6. Audit logs and use a real logging tool
7. Build preferences to not worry about how to serve/store configs
