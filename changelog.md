## Version 0.1.0

#### December 18, 2021

- [ NEW FEATURE 🎉 ] Add favicon and other browser icon/manifest files
- [ NEW FEATURE 🎉 ] Implement basic routing functionality
- [ NEW FEATURE 🎉 ] Introduce this changelog.md as a means of keeping track of new features and bug fixes
- [ REFACTOR 📁 ] Completely redesign app folder structure
- [ REFACTOR 📁 ] Implement 7:1 SCSS architecture for styles

### Version 0.1.1

#### December 18, 2021

- [ REFACTOR 📁 ] Update LCC colour scheme and themes
- [ REFACTOR 📁 ] Remove redundant code after changes & reformat HTML
- [ BUG FIX 🐛 ] Match header colour to footer's
- [ BUG FIX 🐛 ] Fix some grammatical errors

<br>

## Version 0.2.0

#### December 24, 2021

- [ NEW FEATURE 🎉 ] Add basic form validators
- [ NEW FEATURE 🎉 ] Implement CRUD operations scaffolding with a mock-members class
- [ NEW FEATURE 🎉 ] Implement NgRx for state management; replace all temporary @Input() and @Output() bindings/event emitters
- [ REFACTOR 📁 ] Refactor entire application to use Clarity Design System; replace all Angular Material, Toastr and FortAwesome libraries with a unified CDS style
- [ REFACTOR 📁 ] Simplify project folder structure

### Version 0.2.1

#### December 25, 2021

- [ NEW FEATURE 🎉 ] Improve form validation in Members component by using more specific RegEx patterns to compare input against
- [ BUG FIX 🐛 ] Prevent build fails by increasing initial build budget from Angular's default value

<br>

## Version 0.3.0

#### December 26, 2021

- [ REFACTOR 📁 ] Reorganize project folder structure to better follow LIFT principle, while accommodating for new effects-related files
- [ REFACTOR 📁 ] Prefix all feature component selectors with lcc- instead of default app- prefix
- [ REFACTOR 📁 ] Include model in interface file names
- [ REFACTOR 📁 ] Remove redundant NavStore; instead debug navigation events with default NgRx router-store

<br>

## Version 0.4.0

#### December 28, 2021

- [ NEW FEATURE 🎉 ] Connect to MongoDB database through a Node.js and Express.js backend
- [ REFACTOR 📁 ] Use past tense verbs in NgRx action types for greater clarity
- [ REFACTOR 📁 ] Remove redundant sources of state truth from services and components
- [ BUG FIX 🐛 ] Fix Members state duplication bug

<br>

## Version 0.5.0

#### December 29, 2021

- [ NEW FEATURE 🎉 ] Convert app to PWA and implement service worker update strategy with (currently temp) prompt in root component
- [ NEW FEATURE 🎉 ] Navigate user to new browser tab/window on any external links
- [ NEW FEATURE 🎉 ] Integrate modals for CRUD action and service worker update confirmation prompts through NgRx effects
- [ NEW FEATURE 🎉 ] Keep original name in EditMember component header and in Modal title for edit confirmation, in the event that the name itself has been changed
- [ REFACTOR 📁 ] Update index.html with new webmanifest file; reorganize icons in assets folder and remove superfluous icons
- [ REFACTOR 📁 ] Redefine ModelContent object to include custom button classes and button actions

<br>

## Version 0.6.0

#### January 1, 2022

- [ NEW FEATURE 🎉 ] Implement router guard and display default browser 'confirm' modal whenever user tries to change page with unsaved changes
- [ NEW FEATURE 🎉 ] Add other main feature components and implement basic navigation functionality
- [ REFACTOR 📁 ] Organize features into separate folders for app core, shared, and pages
- [ REFACTOR 📁 ] Consolidate AddMember and EditMember components into a single MemberEditor component with derived flag value to control distinct operations; keep separate store actions but refactor action naming conventions to reflect these changes
- [ REFACTOR 📁 ] Resign this changelog file to include all-caps labels and emojis, while removing unnecessary code scope specifications
- [ BUG FIX 🐛 ] Fix null member error when certain actions deployed

<br>

## Version 0.7.0

#### January 2, 2022

- [ NEW FEATURE 🎉 ] Implement photo upload functionality in ArticlesEditor component; check validity of file with new custom MIME-type validator
- [ NEW FEATURE 🎉 ] Add ArticleList and ArticleEditor child components under Articles; reconfigure all child components as separate child routes
- [ NEW FEATURE 🎉 ] Display confirmation modal if unsaved changes are detected and Cancel is clicked from editor page
- [ REFACTOR 📁 ] Rename News to Articles in all places the Nav tab title and page header; rename addMode and updateMode within editor contexts to createMode and editMode, respectively
- [ REFACTOR 📁 ] Create a single AppState selector responsible for selecting and combining unsaved state from all feature components

<br>

## Version 0.8.0

#### January 3, 2022

- [ REFACTOR 📁 ] Reconfigure Members and Articles -editor and -list child components as child routes of their respective container components; redistribute state among the two child components

### Version 0.8.1

#### January 7, 2022

- [ NEW FEATURE 🎉 ] Implement sticky footer
- [ BUG FIX 🐛 ] Load editor component in edit mode when edit selected

<br>

## Version 0.9.0

#### January 9, 2022

- [ REFACTOR 📁 ] Replace default browser confirmation modal in router deactivation flow with custom LCC modal component; ensure cancel selection resets component's state if user confirms cancellation

### Version 0.9.1

#### January 29, 2022

- [ BUG FIX 🐛 ] Return user to list component when update button is clicked
- [ REFACTOR 📁 ] Add intermediate 'confirmed' action to represent a modal confirmation for adding or updating members/articles
- [ REFACTOR 📁 ] Add explicit 'beforeEdit' and 'afterEdit' objects in store for a clearer distinction between the two values

<br>

## Version 0.10.0

#### TBD
