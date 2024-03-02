# The London Chess Club (LCC) Website

Welcome to the source code repository for the new LCC website! Here you'll find links to test out new features, a summary of what's changed with each release, and instructions on how to report a bug or request a change.

<https://londonchess.ca>

## Staging environment (for testing new features)

<http://londonchessclub.ca.s3-website.us-east-2.amazonaws.com>

## Architecture

> FRONTEND

- `Angular v17` for frontend framework
- `NgRx` for reactive state management
- `Feather` for icons
- `SCSS` for style preprocessing with Sass
- `Lichess PGN Viewer` for rendering chess games

> BACKEND (AWS)

- `S3` for static web hosting and image storage
- `Route 53` for DNS and traffic management
- `DynamoDB` for a NoSQL database system
- `CodeBuild` for configuring the build process and CI/CD pipeline
- `API Gateway` for API management and routing
- `Cognito & IAM` for user authentication
- `Lambda` for serverless backend functions
- `CloudFront` for content delivery
- `EC2` for running an Express.js server, responsible for article image CRUD operations

## Release notes

|    |    |
| -- | -- |
| 🚀 | New **features** and **improvements** |
| 🐛 | Bug fixes |
| 🔧 | Code refactoring |

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
