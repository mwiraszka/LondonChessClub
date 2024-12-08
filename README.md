# The London Chess Club (LCC) Web App

Welcome to the source code repository for the LCC web app! Here you'll find an overview of the application's architecture, a summary of what's changed with each release, and instructions on how to report a bug or request a change.

<https://londonchess.ca>

## Architecture

> FRONTEND

- `Angular v19` for frontend framework
- `NgRx` for reactive state management
- `Feather` for icons
- `SCSS` for style preprocessing with Sass
- `Lichess PGN Viewer` for rendering chess games
- `Ng2 Charts` for additional game stats
- `Ng2 PDF Viewer` for PDF documents

> BACKEND (AWS)

- `S3` for static web hosting and image storage
- `Route 53` for DNS and traffic management
- `DynamoDB` for a NoSQL database system
- `API Gateway` for API management and routing
- `Cognito & IAM` for user authentication
- `Lambda` for serverless backend functions
- `CloudFront` for content delivery
- `EC2` for running an Express.js server, responsible for article image CRUD operations

> DEV OPS

- `GitHub Actions` for automated workflows to build project, run unit tests, and deploy preview & production versions of the website

## Release notes

|     |                                   |
| --- | --------------------------------- |
| 🚀  | New features & improvements       |
| 🐛  | Bug fixes                         |
| 🔧  | Behind-the-scenes changes         |

<details>
<summary style="cursor: pointer">
v5.0.0 - December TBD, 2024
</summary>

- 🚀 Create a custom Date Picker component and implement in Event and Member Form component for date-related inputs
- 🚀 Improve efficiency of custom sorting algorithm (used for sorting members, club events and articles) and handle certain edge cases more appropriately 
- 🔧 Upgrade to Angular v19
- 🔧 Adapt Schedule, Members and Articles services to new backend architecture
- Convert all frontend date types to either ISO 8601 date strings (standard dates in the format YYYY-MM-DDTHH:MM:SS) or Moment types in date-heavy contexts where lots of calculations may be needed
- 🔧 Consolidate all components, directives and pipes into more streamlined standalone components
- 🔧 Create custom `range` pipe for easier iteration over consecutive integers in templates
- 🔧 Clean up redundant code in Nav component
- 🔧 Improve error handling and provide more comprehensive error messages to notification toasts for easier debugging when needed
- 🔧 Rename Schedule and Club Event features and components to simply 'Event' wherever appropriate 
- 🔧 Migrate deprecated `@import` rule to `@use`/`@forward` in prepararation for future release of Dart Sass 3.0.0, where `@import` will no longer be available
- 🔧 Migrate deprecated global built-in functions to use explicit `sass:` prefix
- 🔧 Migrate from Jasmine to Jest for unit tests
- 🔧 Update path aliases and remove redundant `.eslintrc` file


</details>

<details>
<summary style="cursor: pointer">
v4.1.9 - November 30th, 2024
</summary>

- 🚀 Re-sort 2024 PGNs

</details>

<details>
<summary style="cursor: pointer">
v4.1.8 - November 30th, 2024
</summary>

- 🚀 Add PGNs for LCC Championship

</details>

<details>
<summary style="cursor: pointer">
v4.1.7 - November 19th, 2024
</summary>

- 🚀 Generate favicons and icons for a wider range of devices and themes
- 🚀 Improve safe mode notice text styling
- 🚀 Improve disabled button styling
- 🐛 Reverse logic of safe mode toggle switch in Member Editor form
- 🐛 Fix bug where a valid member ID in the URL was sometimes interpreted as invalid
- 🐛 Fix bug where sometimes previous event or member would be loaded up when editing

</details>

<details>
<summary style="cursor: pointer">
v4.1.6 - November 18th, 2024
</summary>

- 🔧 Upgrade Angular to `v18.2.12` and update all third-party packages & dev dependencies

</details>

<details>
<summary style="cursor: pointer">
v4.1.5 - November 17th, 2024
</summary>

- 🚀 Add ability to show/hide sensitive information when logged in as admin wherever personal details may be displayed
- 🚀 Improve how image placeholders are handled and prevent layout shifts from occurring during article loading process
- 🚀 Only display edit date on articles which were edited on a different date than the creation date
- 🐛 Always attempt to fetch the latest article, member or club event whenever the page is refreshed
- 🐛 Ensure single quotes appear as expected in article previews on Home and News pages
- 🔧 Simplify a lot of the logic around fetching and updating articles, members and club events

</details>

<details>
<summary style="cursor: pointer">
v4.1.4 - November 2nd, 2024
</summary>

- 🐛 Fix issue in Member Editor preventing new members from being added
- 🔧 Upgrade to Angular v18.1.0 and update some third-party packages

</details>

<details>
<summary style="cursor: pointer">
v4.1.3 - October 31st, 2024
</summary>

- 🚀 Improve links at the bottom of article pages and a few more minor improvements to Article Editor

</details>

<details>
<summary style="cursor: pointer">
v4.1.2 - October 31st, 2024
</summary>

- 🚀 Improve background/text contrast on disabled buttons
- 🚀 Add support for multi-line event descriptions
- 🚀 Various minor improvements to the Article Editor
- 🔧 Improve some naming conventions used throughout codebase

</details>

<details>
<summary style="cursor: pointer">
v4.1.1 - October 28th, 2024
</summary>

- 🚀 Add PGNs for round 7 of LCC Championship

</details>

<details>
<summary style="cursor: pointer">
v4.1.0 - October 23rd, 2024
</summary>

- 🚀 Add a 'Analyze in Lichess' button for games in the Game Archives page which redirects you to Lichess' analysis board with the full PGN loaded
- 🚀 Add 'Analyze this position' text to existing 'Analysis Board' button to help avoid confusion
- 🚀 Display opening and result stats for filtered games
- 🚀 Add support for null paths and tooltips to be passed in to Link component
- 🐛 Prevent left-right arrow keys from controlling scrollbar in the expansion panel when a game is focused since they already control previous/next move in the Lichess PGN Viewer
- 🐛 Add a newline character after the game termination marker, followed by an intentional blank line, to all PGNs in the Game Archives
- 🐛 Ensure embedded images in articles are responsive and are always displayed at max-width 

</details>

<details>
<summary style="cursor: pointer">
v4.0.19 - October 18th, 2024
</summary>

- 🚀 Add PGNs for round 6 of LCC Championship

</details>

<details>
<summary style="cursor: pointer">
v4.0.18 - October 14th, 2024
</summary>

- 🚀 Add PGNs for round 5 of LCC Championship

</details>

<details>
<summary style="cursor: pointer">
v4.0.17 - October 6th, 2024
</summary>

- 🐛 Fix formatting of all PGNs in the Game Archives

</details>

<details>
<summary style="cursor: pointer">
v4.0.16 - October 5th, 2024
</summary>

- 🚀 Add PGNs for round 4 of LCC Championship

</details>

<details>
<summary style="cursor: pointer">
v4.0.15 - October 4th, 2024
</summary>

- 🔧 Configure separate API endpoint for dev & prod environments 

</details>

<details>
<summary style="cursor: pointer">
v4.0.14 - September 28th, 2024
</summary>

- 🐛 Add PGNs for round 3 of LCC Championship (Sections C, D and E)

</details>

<details>
<summary style="cursor: pointer">
v4.0.13 - September 27th, 2024
</summary>

- 🐛 Add PGNs for round 3 of LCC Championship (Sections A and B)
- 🐛 Reduce padding around Lichess PGN Viewer menu options

</details>

<details>
<summary style="cursor: pointer">
v4.0.12 - September 22nd, 2024
</summary>

- 🐛 Update some game PGNs and add remainder of games from second round of LCC Championship
- 🐛 Sort 2024's PGNs by tournament round number

</details>

<details>
<summary style="cursor: pointer">
v4.0.11 - September 20th, 2024
</summary>

- 🐛 Update game PGNs from first round and add some PGNs from second round of LCC Championship

</details>

<details>
<summary style="cursor: pointer">
v4.0.10 - September 13th, 2024
</summary>

- 🐛 Add game PGNs from first round of LCC Championship

</details>

<details>
<summary style="cursor: pointer">
v4.0.9 - September 1st, 2024
</summary>

- 🐛 Ensure article content persists on page reload when composing or editing an article
- 🔧 Clean up some code related to the Loader Service
- 🔧 Update how external and mailto links are configured to better follow [HTML standard](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element)

</details>

<details>
<summary style="cursor: pointer">
v4.0.8 - August 9th, 2024
</summary>

- 🚀 Update About page

</details>

<details>
<summary style="cursor: pointer">
v4.0.7 - August 5th, 2024
</summary>

- 🚀 Improve admin user authentication error handling and how toast notifications are displayed when the error message is long
- 🐛 Fix bug where Article and Members pages would sometimes hang while loading

</details>

<details>
<summary style="cursor: pointer">
v4.0.6 - August 4th, 2024
</summary>

- 🚀 Display scores next to players' names in the PGN viewer component
- 🚀 Add the ability to filter games in the Game Archives page by first/last name, whether the player was White or Black, and the number of moves 

</details>

<details>
<summary style="cursor: pointer">
v4.0.5 - July 5th, 2024
</summary>

- 🔧 Add step in GitHub action workflow to automatically invalidate CloudFront distribution whenever updating the production website S3

</details>

<details>
<summary style="cursor: pointer">
v4.0.4 - July 2nd, 2024
</summary>

- 🔧 Switch to `pnpm` and set up dedicated GitHub Actions workflows for preview and production static hosting buckets on S3
- 🔧 Set up basic unit tests

</details>

<details>
<summary style="cursor: pointer">
v4.0.3 - June 29th, 2024
</summary>

- 🚀 Remember user's show/hide past events preference in the Schedule component
- 🐛 Ensure browser back button takes you back to the top of the article after navigating to a page anchor via the article's table of contents
- 🐛 Fix Link List component's header colour theming

</details>

<details>
<summary style="cursor: pointer">
v4.0.2 - June 27th, 2024
</summary>

- 🚀 Improve colour contrast in warning toasts
- 🐛 Send prefetch request with appropriate headers to article images API to prevent the need for CORS browser plug-ins when creating/editing articles

</details>

<details>
<summary style="cursor: pointer">
v4.0.1 - June 26th, 2024
</summary>

- 🚀 Some minor styling touch-ups
- 🚀 Only display an article has been edited if it's at least 5 minutes after the creation time
- 🚀 Remove all 'MB' and empty {Fritz} annotations from archived games' PGNs

</details>

<details>
<summary style="cursor: pointer">
v4.0.0 - June 25th, 2024
</summary>

- 🚀 Upgrade to Angular v18
- 🚀 Overhaul redesign of colour theming throughout app
- 🚀 Revamp the user settings dropdown menu (top-right of app header)
- 🚀 Revamp the upcoming event banner (top of screen), and do not show again for at least 24 hours once it's been clicked
- 🚀 Introduce a dark mode, and add ability to toggle theme from the dropdown menu, defaulting to the user's browser preferences
- 🚀 Minor improvements to various UI components: buttons, tooltips, toasts, forms, screen headers, modification info boxes, event alert banners, and the page loading spinner
- 🐛 Fix layout issue on Game Archives page
- 🐛 Fix layout issue in app header when viewing app on a large screen
- 🔧 Simplify some CSS Flex code throughout codebase and remove other redundant/unused styles

</details>

<details>
<summary style="cursor: pointer">
v3.3.2 - May 25th, 2024
</summary>

- 🚀 Add more recent games (from 2017 to 2023) to club game archives
- 🚀 Various minor improvements to spruce up the Game Archives page
- 🐛 Fix a bug which made only a handful of game PGNs accessible in each expansion panel

</details>

<details>
<summary style="cursor: pointer">
v3.3.1 - May 3rd, 2024
</summary>

- 🚀 Add support for linking scheduled club events to an article where more details can be found

</details>

<details>
<summary style="cursor: pointer">
v3.3.0 - May 2nd, 2024
</summary>

- 🚀 Highlight the London Chess Championship event in the new homepage welcome section
- 🚀 Improve styling of notification toasts
- 🐛 Fix a bug which sometimes caused the page to redirect to a 404 error page
- 🐛 Fix a bug which prevented the user from navigating to the same anchor (section) of an article multiple times consecutively
- 🔧 Overhaul redesign of AWS Cognito admin authentication and password change flows

</details>

<details>
<summary style="cursor: pointer">
v3.2.0 - April 30th, 2024
</summary>

- 🚀 Revamp home screen with a more user-friendly layout and links to club's Instagram page and noticeboard on WhatsApp
- 🚀 Improve website SEO by 1) including more meaningful text within `<noscript>` tags for better description in SERPs, 2) using `<h1>` tags in Screen Header component, and 3) adding more meta tags to root index.html file
- 🚀 Dynamically generate metadata and title for each individual screen so that screen-specific titles appear in the browser tab (e.g. tab now says 'Members' when viewing the members table)
- 🔧 Implement module lazy-loading for a quicker initial load
- 🔧 Refactor website routing to split add/edit/view screens as variants of their parent member/article/event screens instead of standalone screens, and create dedicated member/article/event routing modules to handle their routing instead of a single app-level routing module
- 🔧 Refactor club map component to follow best practices with latest Google Maps API changes
- 🔧 Improve console log and error handling

</details>

<details>
<summary style="cursor: pointer">
v3.1.3 - April 24th, 2024
</summary>

- 🚀 Post PDFs of minutes from club's first three board meetings, as well as the club's bylaws
- 🚀 Change scrollbar colour to grey
- 🚀 Change article 'sticky' icon to be a bookmark
- 🐛 Ensure the next club event (in the app banner as well as the highlighted row on the Schedule screen) changes over at 9:00pm EST instead of midnight on Friday UTC time (which is currently equivalent to 7:00pm EST)
- 🔧 Replace `moment.js` library with `moment-timezone`, and improve date formatting algorithm

</details>

<details>
<summary style="cursor: pointer">
v3.1.2 - April 15th, 2024
</summary>

- 🐛 Fix a bug where scheduled club events would get sorted by date in the reverse order

</details>

<details>
<summary style="cursor: pointer">
v3.1.1 - April 14th, 2024
</summary>

- 🚀 Display provisional peak ratings in Members Table in regular `XXXX/X` format instead of converting to `(provisional)` fallback text
- 🐛 Several minor improvements and bug fixes related to article/member/event editing as well as image URL/file retrieval
- 🐛 Fix a bug where the Members Table would unsort itself after a member was edited or deleted

</details>

<details>
<summary style="cursor: pointer">
v3.1.0 - April 14th, 2024
</summary>

- 🚀 Implement article image placeholders and URL source fallbacks for better UX and to help prevent layout shift on page load when an image source is not loadable or unavailable
- 🚀 Keep admin user on the Add Member and Add Event pages after a new item (member/event) has been successfully created, to prevent them from having to re-navigate to the page each time when adding multiple items
- 🚀 Style scrollbars more consistently across app
- 🚀 Add ability to revert chosen article banner image when creating/editing an article
- 🚀 Retain form state on page refresh, and store chosen image's URL in local storage
- 🐛 Fix bug preventing admin user from setting an image on a new article
- 🔧 Major rework of the article image presigned URL/ image file serialization
- 🔧 Implement new navigation flow to help differentiate between deep-linking and page refreshing, which require slightly different page setup logic

</details>

<details>
<summary style="cursor: pointer">
v3.0.12 - April 3rd, 2024
</summary>

- 🐛 Fix bug with article view & edit navigation

</details>

<details>
<summary style="cursor: pointer">
v3.0.11 - April 3rd, 2024
</summary>

- 🐛 Fix some security vulnerabilities

</details>

<details>
<summary style="cursor: pointer">
v3.0.10 - April 2nd, 2024
</summary>

- 🚀 Save working progress in forms so that refreshing the page does not return the form to the item's original state
- 🚀 When linking directly to a 'create' or 'edit' screen for an item that could not be found in the store, make an API call to fetch that item before resorting to redirecting the user to another screen. This will allow the user to send links that take you directly to a specific article - the full collection of articles doesn't need to first be fetched from the database for this to work anymore
- 🐛 Fix bug where non-admin users were able to access certain 'edit' screens (in readonly mode)
- 🔧 Reorganize app's reusable utility functions
- 🔧 Add `type` modifier to certain imports and exports to future-proof app in the event that a transpiler (such as Babel or Vite) is introduced and it becomes unclear which imports/exports should be available at runtime (see: [this article](https://typescript-eslint.io/blog/consistent-type-imports-and-exports-why-and-how/))
- 🔧 Refactor `*ngFor` and `*ngIf` directives to Angular's new `@for` and `@if` control-flow syntax for better DX and a slightly smaller bundle size since the new syntax is built into the template engine
- 🔧 Add `readonly` modifier to all imported types and methods used in templates or help prevent accidental overwrites

</details>

<details>
<summary style="cursor: pointer">
v3.0.9 - March 12th, 2024
</summary>

- 🚀 Add a link in the app footer to the club's Instagram page
- 🚀 Display a loading spinner whenever any database operation takes place, such as updating an article or deleting an event
- 🚀 Change lecture event tag colour to blue to help differentiate from blitz tournament tags
- 🚀 After an article has been published or edited, navigate the admin user to that article instead of the News screen
- 🚀 After an article has been deleted, only navigate the user to the News screen if they're coming from the Article View screen
- 🐛 Ensure members table remains sorted after a create/edit/delete operation has completed
- 🔧 Rename all requesting database actions, changing prefix from 'load' to 'fetch'

</details>

<details>
<summary style="cursor: pointer">
v3.0.8 - March 11th, 2024
</summary>

- 🚀 Add support for linking to sections of article pages
- 🚀 Revert club map back to Google Maps' default red marker styling and improve marker's longitude and latitude co-ordinates
- 🔧 Update Angular Google Maps library to `v17.3.0-rc.0` and replace deprecated `map-marker` with `advanced-map-marker` HTML element

</details>

<details>
<summary style="cursor: pointer">
v3.0.7 - March 10th, 2024
</summary>

- 🐛 Reinstate Angular Service Worker to prevent page from not being found when deep-linking into subroutes such as `/members` or `/news`

</details>

<details>
<summary style="cursor: pointer">
v3.0.6 - March 9th, 2024
</summary>

- 🐛 Fix issue where Members table sometimes hangs when sorting

</details>

<details>
<summary style="cursor: pointer">
v3.0.5 - March 9th, 2024
</summary>

- 🚀 Replace 100-items per page option in paginator component with one that allows user to see _all_ table items at once
- 🐛 Remove the option to install a bootable version of the website, and all ngsw (Angular Service Worker) related code

</details>

<details>
<summary style="cursor: pointer">
v3.0.4 - March 2nd, 2024
</summary>

- 🐛 Fix minor alignment issue in app footer

</details>

<details>
<summary style="cursor: pointer">
v3.0.3 - March 2nd, 2024
</summary>

- 🔧 Test out new website update notification process with change introduced in v3.0.2

</details>

<details>
<summary style="cursor: pointer">
v3.0.2 - March 2nd, 2024
</summary>

- 🐛 No longer force user from refreshing the page when a new version of the website becomes available, and instead only display a notification in the app footer that a new version is available

</details>

<details>
<summary style="cursor: pointer">
v3.0.1 - February 5th, 2024
</summary>

- 🚀 Migrate archived games (1974-2000) from old website
- 🚀 Update City Champion screen with result from 2023 Championship match

</details>

<details>
<summary style="cursor: pointer">
v3.0.0 - January 24th, 2024
</summary>

- 🚀 Upgrade to Angular v17
- 🚀 Show loading spinner over Photo Gallery photo while it loads
- 🚀 Create a PGN viewer widget and use to display archived games in new Game Archives screen
- 🐛 Remove spaces between link text and any punctuation that follows

</details>

<details>
<summary style="cursor: pointer">
v2.2.5 - January 18th, 2024
</summary>

- 🚀 Update main contact email to `welcome@londonchess.ca`

</details>

<details>
<summary style="cursor: pointer">
v2.2.4 - January 17th, 2024
</summary>

- 🚀 Add next/previous image buttons on Photo Gallery screen
- 🔧 Refactor ImageOverlay state as a general Photos state, and add more photo-related actions and selectors

</details>

<details>
<summary style="cursor: pointer">
v2.2.3 - January 17th, 2024
</summary>

- 🚀 Display each member's last update date in the members table
- 🚀 Carry over some markdown table features to the members table (i.e. horizontal scrollbar and larger font sizes)
- 🐛 Fix issue preventing admin user from adding a new member without supplying certain optional properties
- 🐛 Fix paginator tooltip text
- 🔧 Consolidate/remove repeated or no longer used table code

</details>

<details>
<summary style="cursor: pointer">
v2.2.2 - January 12th, 2024
</summary>

- 🐛 Fix various bugs which sometimes prevented an admin user from posting or editing an article
- 🔧 Improve some NgRx action names following v2.2.0's navigation refactor

</details>

<details>
<summary style="cursor: pointer">
v2.2.1 - January 11th, 2024
</summary>

- 🚀 Add fun chess pieces graphic to app header and update header font
- 🚀 Increase number of articles shown on the Home screen from 4 to 5
- 🐛 Prevent tooltips from displaying out of screen's bounds

</details>

<details>
<summary style="cursor: pointer">
v2.2.0 - January 9th, 2024
</summary>

- 🚀 Add ability to open any linkable item in a new tab by ctrl-clicking, and also display URL in browser on hover (previously was only possible on certain standard text links)
- 🚀 Various minor improvements to admin user dropdown component
- 🚀 Scroll to top of screen after toggling past events in the Schedule screen
- 🚀 Brief update on 2023 Championship Match (more details and photos to follow)
- 🔧 Refactor navigation logic throughout app to make better use of Angular's routing features
- 🔧 Leverage NgNeat's `until-destroy` library for a neater way to unsubscribe from observables when a component is destroyed

</details>

<details>
<summary style="cursor: pointer">
v2.1.0 - December 31st, 2023
</summary>

- 🚀 Add support for 'sticky' articles, allowing admins to bump up selected articles to the top of the list
- 🚀 Auto-expire warning toasts (red notifications in bottom-left of screen) just as with success toasts
- 🚀 Navigate to Home screen when clicking on either London Chess Club logo or text in main app header, and always in the current browser tab
- 🐛 Fix bug causing unsaved changes dialog from appearing when editing an article, even when it was returned to its original state
- 🐛 Fix some broken links on the About screen, and make sure they open up in a new tab when expected

</details>

<details>
<summary style="cursor: pointer">
v2.0.4 - December 23rd, 2023
</summary>

- 🐛 Fix some layout issues on Article Viewer screen
- 🐛 Fix timezone of default 'created by' & 'last edited by' dates for member edits when value is not found in database
- 🔧 Revert table width hacks in Markdown Renderer component now that layout has been corrected

</details>

<details>
<summary style="cursor: pointer">
v2.0.3 - December 22nd, 2023
</summary>

- 🐛 Fix some typos on the About screen
- 🐛 Ensure article banner images can be fetched through both HTTP and HTTPS and on all environments

</details>

<details>
<summary style="cursor: pointer">
v2.0.2 - December 20th, 2023
</summary>

- 🔧 Revert changes made in v2.0.1 to test out effects of the directive in the `index.html`

</details>

<details>
<summary style="cursor: pointer">
v2.0.1 - December 20th, 2023
</summary>

- 🐛 Use `upgrade-insecure-requests` directive to ensure article images endpoint can be reached via HTTP on both staging and prod environments

</details>

<details>
<summary style="cursor: pointer">
v2.0.0 - December 20th, 2023
</summary>

- 🚀 Make adjustments to this README.md prior to v2.0.0 launch
- 🚀 Move About screen to after Home screen in the navigation tabs
- 🚀 Improve About screen layout and content
- 🚀 Display only future events in Schedule by default, with an option to show past events
- 🐛 Fix issue which prevented article banner images from being fetched using secure connection (HTTPS protocol)
- 🐛 Correct club event date-time tiemzone calculations which were causing Thursday club event dates to show up as Wednesday
- 🐛 Fix Angular Service Worker issues when app is running on a production environment
- 🐛 Fix bug which prevented form validation icon from appearing in Create/Edit Event screen
- 🔧 Split `utils.ts` into more categorized util files, and leverage `moment.js` library for better date-time calculations

</details>

### Beta version release notes

<details>
<summary style="cursor: pointer">
v1.6.8-beta - December 19th, 2023
</summary>

- 🚀 Update content on About screen
- 🚀 Update content on Champion screen
- 🐛 Fix password change bug
- 🔧 Update `manifest.webmanifest` file

</details>

<details>
<summary style="cursor: pointer">
v1.6.7-beta - December 18th, 2023
</summary>

- 🚀 Make member's year of birth field visible only to admins
- 🐛 Correct peak rating calculation for when a member's rating is edited
- 🐛 Ensure current date in new member empty form template correctly uses local timezone and not UTC time

</details>

<details>
<summary style="cursor: pointer">
v1.6.6-beta - December 17th, 2023
</summary>

- 🚀 Add a 'report a bug' link to the website footer
- 🚀 Limit banner image height so that it doesn't expand too much on larger screens
- 🐛 Fix bug preventing new banner images from being uploaded in some scenarios

</details>

<details>
<summary style="cursor: pointer">
v1.6.5-beta - December 16th, 2023
</summary>

- 🚀 Add support for hyperlinks and bullet points in article bodies
- 🚀 Minor revamping of home screen, about screen, and app header
- 🚀 Update some static content on about screen
- 🐛 Fix some minor layout bugs in Article Grid component
- 🐛 Fix bug causing unsaved changes modal to appear after successfully updating a member
- 🐛 Display correct 6:00 PM start time in banner alert message

</details>

<details>
<summary style="cursor: pointer">
v1.6.4-beta - December 12th, 2023
</summary>

- 🚀 Sort articles based on creation date
- 🚀 Hide more markdown characters from article body preview in Article Grid
- 🐛 Only show article edit date if different from creation date
- 🐛 Ensure new lines are at least preserved with HTML 'break' tags for now

</details>

<details>
<summary style="cursor: pointer">
v1.6.3-beta - December 10th, 2023
</summary>

- 🚀 Update schedule event types; add icon beside championship type
- 🐛 Fix various small bugs in Event Form component

</details>

<details>
<summary style="cursor: pointer">
v1.6.2-beta - December 9th, 2023
</summary>

- 🚀 Improve styling on divider lines used throughout app
- 🐛 Fix layout of Modification Info component, particularly for small devices
- 🐛 Fix bug where the create/edit member form incorrectly detected changes in the member's details

</details>

<details>
<summary style="cursor: pointer">
v1.6.1-beta - December 9th, 2023
</summary>

- 🐛 Fix bug causing embedded tables in articles to mess up the screen layout

</details>

<details>
<summary style="cursor: pointer">
v1.6.0-beta - December 7th, 2023
</summary>

- 🚀 Revamp top-right dropdown user menu
- 🚀 In the admin-only article/event/member edit forms, display author's name next to each article/event/member; display in the new user dropdown menu as well
- 🚀 Various minor layout improvements in form and toaster components
- 🔧 Improve user login and Cognito auth flow
- 🔧 Overhaul refactor of item creation and update dates to support JS Date objects, as well as store and read items' new creation & update details

</details>

<details>
<summary style="cursor: pointer">
v1.5.3-beta - December 2nd, 2023
</summary>

- 🚀 Improve modal (pop-up) button colour scheme
- 🐛 Fix bug where long links in the article body would break the layout on small devices

</details>

<details>
<summary style="cursor: pointer">
v1.5.2-beta - December 1st, 2023
</summary>

- 🔧 Increase production budgets in `angular.json` to accomodate for the new icon library

</details>

<details>
<summary style="cursor: pointer">
v1.5.1-beta - December 1st, 2023
</summary>

- 🚀 Add support for LCC-styled markdown tables in articles' content section
- 🚀 Replace CDS with Angular Feather library for icons
- 🚀 Increase limit on article body length and align text left in markdown preview section of Article Editor
- 🐛 Prevent user menu dropdown icon from displaying above the image previews when an image is selected in the Photo Gallery
- 🔧 Remove all dependencies to Clarity Design System library and replace with a more lightweight alternative solutions jfor icons

</details>

<details>
<summary style="cursor: pointer">
v1.5.0-beta - December 1st, 2023
</summary>

- 🚀 Add support for markdown in articles!
- 🐛 Fix various minor layout bugs on News and Photo Gallery screens
- 🐛 Restrict article banner image size to 1MB to ensure image uploads do not fail
- 🐛 Ensure dates used to determine upcoming events are compared correctly
- 🔧 Clean up various warnings showing up in the console, related to issues with the webmanifest and common JS packages

</details>

<details>
<summary style="cursor: pointer">
v1.4.5-beta - November 22nd, 2023
</summary>

- 🐛 Fix various minor bugs on Photo Gallery screen

</details>

<details>
<summary style="cursor: pointer">
v1.4.4-beta - November 22nd, 2023
</summary>

- 🚀 Improve typography and layout of Schedule and Nav components
- 🚀 Add more photos and archive links to Photo Gallery screen
- 🚀 Improve styling of 'secondary' buttons throughout app
- 🐛 Fix various minor bugs on Article Editor and Article Viewer screens
- 🔧 Revamp this `README` file and issue tickets for upcoming full release (v2.0.0)
- 🔧 Reorganize `layout` style partials

</details>

<details>
<summary style="cursor: pointer">
v1.4.3-beta - November 19th, 2023
</summary>

- 🚀 Display next event as a banner with option to link to that particular event on the Schedule screen
- 🚀 Improve how images are displayed on small devices
- 🚀 Add more event categories and only display upcoming events on the Home screen
- 🐛 Ensure admin control buttons don't propagate and trigger click events on their parent components
- 🔧 Create a `formatDate` pipe that invokes the `formatDate` utility function

</details>

<details>
<summary style="cursor: pointer">
v1.4.2-beta - November 16th, 2023
</summary>

- 🚀 Automatically log in after a successful password change, redirect user to Home screen, and hide sensitive information from Redux Devtools
- 🐛 Fix bug preventing user from accessing add member, add article and add event screens
- 🐛 Fix bug causing 'Last edited: Invalid Date' to be displayed after creating a new article

</details>

<details>
<summary style="cursor: pointer">
v1.4.1-beta - November 15th, 2023
</summary>

- 🚀 Add tables for executive committee and board of directors
- 🚀 Fix table column widths for all breakpoints to prevent layout shifts when sorting and awkward gaps between columns
- 🐛 Fix some small layout bugs on Champion screen
- 🐛 Fix bug preventing user menu to open

</details>

<details>
<summary style="cursor: pointer">
v1.4.0-beta - November 13th, 2023
</summary>

- 🚀 Overhaul layout upgrades on all screens
- 🔧 Implement power-of-2 't-shirt size' naming conventions for spacing style rules, including paddings, margins and flex gaps
- 🔧 Update some copy
- 🔧 Remove unnecessary/ unused style sheet partials

</details>

<details>
<summary style="cursor: pointer">
v1.3.3-beta - November 5th, 2023
</summary>

- 🚀 Update production environment variable for article images endpoint to not include port number now that nginx reverse proxy is set up

</details>

<details>
<summary style="cursor: pointer">
v1.3.2-beta - November 4th, 2023
</summary>

- 🚀 Update production environment variable for article images endpoint to use IP address of server running on the new EC2 instance

</details>

<details>
<summary style="cursor: pointer">
v1.3.1-beta - November 1st, 2023
</summary>

- 🔧 Update `README` and `.gitignore` files

</details>

<details>
<summary style="cursor: pointer">
v1.3.0-beta - October 30th, 2023
</summary>

- 🚀 Support banner images for articles
- 🚀 Create an Article Viewer screen to display the entire article whenever one is selected in the Article Grid
- 🚀 Remove unnecessary 'subtitle' field
- 🚀 Improve screen layouts for XL-wide devices
- 🚀 Improve truncation logic and support truncation by line count
- 🚀 Modify all toast titles to make them more distinct from notification descriptions directly below
- 🐛 Fix bug causing forms to submit twice when using the 'enter' key
- 🐛 Fix bug preventing new password from being sent to the server

- 🔧 Use generic types for `ServiceResponse`'s payload property for better type safety

</details>

<details>
<summary style="cursor: pointer">
v1.2.0-beta - October 4th, 2023
</summary>

- 🚀 Support submitting via 'enter' key in all forms
- 🚀 Add ability to return to the previous screen and request a new code after an email has already been entered
- 🐛 Revert changes to algorithm of 'kebabize' helper function, ensuring that the correct CSS classes are added in the Members Table component
- 🐛 Ensure all validator functions work as expected again, after major code refactor in the previous release

- 🔧 Simplify handling of form validation messages

</details>

<details>
<summary style="cursor: pointer">
v1.1.0-beta - August 31st, 2023
</summary>

- 🚀 Embed Google Maps map of club location
- 🔧 Enforce strict typing and apply better formatting in all files using new ESLint, Prettier and Beautify set up
- 🔧 Update and clean up this `README` file
- 🔧 Ensure all functions have an explicit return type

</details>

<details>
<summary style="cursor: pointer">
v1.0.0-beta - September 26th, 2022
</summary>

- 🐛 Revert accidental removal of DevTools module property 'logOnly' to re-disable all but logs when in a production environment
- 🔧 Clean up comments throughout codebase
- 🔧 Add any missing information to this `README` file

</details>

### Alpha version release notes

<details>
<summary style="cursor: pointer">
v0.8.2-alpha - September 22nd, 2022
</summary>

- 🚀 Add 'date created' and 'date edited' information to article cards
- 🚀 Improve date formatting in schedule component
- 🚀 Centre admin control links displayed above the schedule, members, and article grid components
- 🚀 Sanitize any actions in NgRx DevTools that include sensitive information
- 🔧 Remove any unused code from article grid and article form components and resize the cards that make up the article grid
- 🔧 Clean up `.gitignore` file

</details>

<details>
<summary style="cursor: pointer">
v0.8.1-alpha - September 13th, 2022
</summary>

- 🚀 Implement custom trackBy function to improve performance of ngFor directive's tracking algorithm
- 🐛 Correct faulty date format conversions used in schedule component
- 🔧 Wrap `createEffect()` callbacks with `return` for easier debugging

</details>

<details>
<summary style="cursor: pointer">
v0.8.0-alpha - September 8th, 2022
</summary>

- 🚀 Integrate an NgRx (redux-based) infrastructure for state management
- 🚀 Integrate various backend solutions through AWS, including: DynamoDB for a NoSQL database, Cognito and IAM for user authentication and authorization, API Gateway and Lambda functions for HTTP request manipulation and routing, S3 for static hosting, CodeBuild for an automated CI/CD pipeline triggered directly by GitHub PR merges, and Route 53 and CloudFront for DNS record management, CDN services, and traffic management
- 🚀 Implement an assortment of basic UI/UX features, such as toast notifications, modals (pop-ups) for action confirmation, an alert bar at the top of the screen, and a loading spinner for when data is being fetched from the database
- 🚀 Implement a standard nav bar to route to the various screens available, including an icon-only view on smaller devices, and a user account section to house any account-specific information and actions
- 🚀 Implement user sign up, login, and change password flows, granting LCC committee members admin access to perform Create, Read, Update and Delete (CRUD) actions on any data which is regularly updated: currently members, articles, and scheduled events
- 🚀 Implement basic members table and paginator components, fully fitted with sorting and filtering algorithms
- 🚀 _(Work in progress)_ Implement basic database CRUD functionality and a responsive grid layout for articles
- 🚀 Implement basic CRUD functionality and a responsive table layout for all club events stored in the database
- 🚀 Create a responsive grid layout to organize the most commonly sought information about the club
- 🚀 Create a responsive grid layout to house photos from club meetings and club-organized events, including the functionality to enlarge photos in an image overlay 'preview' mode
- 🚀 Create a responsive grid layout to showcase only the most pertinent information from other screens (such as only the next 4 events from the schedule, and a more limited amount of photos from the photo gallery)

</details>

## Report a bug / Request a change

Have an idea how we can improve the website? Find a bug?

1. Submit a new issue [here](https://github.com/mwiraszka/LondonChessClub/issues); or
2. Contact a club committee member
