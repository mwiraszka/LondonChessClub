# The London Chess Club (LCC) Website

Welcome to the source code repository for the new LCC website! Here you'll find links to test out new features, a summary of what's changed with each release, and instructions on how to report a bug or request a change.

## Staging environment

<http://londonchessclub.ca.s3-website.us-east-2.amazonaws.com/>

## Old (current) website

<http://londonchessclub.ca>

## Architecture

> FRONTEND

- `Angular v14` for frontend framework
- `NgRx` for reactive state management
- `Feather` for icons
- `SCSS` for style preprocessing with Sass

> BACKEND (AWS)

- `S3` for static web hosting and image storage
- `Route 53` for DNS and traffic management
- `DynamoDB` for a NoSQL database system
- `CodeBuild` for configuring the build process and CI/CD pipeline
- `API Gateway` for API management and routing
- `Cognito & IAM` for user authentication
- `Lambda` for serverless backend functions
- `EC2` for running an Express.js server, responsible for article image CRUD operations

## Release notes

|     |     |
| --- | --- |
| 🚀 | New **features** and **improvements** to the website |
| 🐛 | Bug fixes |
| 🔧 | Code refactoring (no visible changes) |

### Beta version release notes

<details>
<summary style="cursor: pointer">
v1.6.5-beta - December 16th, 2023
</summary>

- 🚀 Add support for hyperlinks and bullet points in article bodies
- 🚀 Minor revamping of home screen, about screen, and app header
- 🚀 Update some static content on about screen

- 🐛 Fix some minor layout bugs in Article Grid component
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
- 🚀 Add more event categories and only display upcoming events on home page

- 🐛 Ensure admin control buttons don't propagate and trigger click events on their parent components

- 🔧 Create a `formatDate` pipe that invokes the `formatDate` utility function

</details>

<details>
<summary style="cursor: pointer">
v1.4.2-beta - November 16th, 2023
</summary>

- 🚀 Automatically log in after a successful password change, redirect user to home page, and hide sensitive information from Redux Devtools

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
- 🚀 Add ability to return to the previous page and request a new code after an email has already been entered

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
- 🚀 Implement a standard nav bar to route to the various pages available, including an icon-only view on smaller devices, and a user account section to house any account-specific information and actions
- 🚀 Implement user sign up, login, and change password flows, granting LCC committee members admin access to perform Create, Read, Update and Delete (CRUD) actions on any data which is regularly updated: currently members, articles, and scheduled events
- 🚀 Implement basic members table and paginator components, fully fitted with sorting and filtering algorithms
- 🚀 _(Work in progress)_ Implement basic database CRUD functionality and a responsive grid layout for articles
- 🚀 Implement basic CRUD functionality and a responsive table layout for all club events stored in the database
- 🚀 Create a responsive grid layout to organize the most commonly sought information about the club
- 🚀 Create a responsive grid layout to house photos from club meetings and club-organized events, including the functionality to enlarge photos in an image overlay 'preview' mode
- 🚀 Create a responsive grid layout to showcase only the most pertinent information from other pages (such as only the next 4 events from the schedule, and a more limited amount of photos from the photo gallery)

</details>

## Report a bug / Request a change

Have an idea how we can improve the website? Find a bug?

1. Submit a new issue [here](https://github.com/mwiraszka/LondonChessClub/issues); or
2. Contact a club committee member
