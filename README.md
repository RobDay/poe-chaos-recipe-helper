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

