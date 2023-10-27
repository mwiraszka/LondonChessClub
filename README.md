# London Chess Club

<span style="color: lightblue; border: 1px solid lightblue; border-radius: 2px; padding: 4px;">LCC web app (development server)</span>
<br />
http://londonchessclub.ca.s3-website.us-east-2.amazonaws.com/
<br />
<br />

<p>
This is a web app built for the London Chess Club to demonstrate an all-in-one Software-as-a-Service (SaaS) design. Current beta version features include:
</p>

> <b>FRONTEND</b>

- Angular for a component-based frontend architecture
- NgRx for reactive state management
- Clarity Design System (CDS) for icons
  <br /><br />

> <b>BACKEND</b> (AWS)

- S3 for static web hosting
- Route 53 for DNS and traffic management
- CodeBuild for configuring the build process and CI/CD pipeline
- Cognito for user authentication
- Lambda for serverless backend functions
- API Gateway for API management and routing
- DynamoDB for a NoSQL database system

<br />
<h3>Releases</h3>

<details>
<summary style="cursor: pointer">v1.3.0-beta</summary>

**Released on TBD**

<h4>Features</h4>

- [Articles] Support banner images for articles
- [Articles] Remove unnecessary 'subtitle' field

<h4>Refactor / Chores</h4>

- [Core] Use generic types for ServiceResponse's payload property for better type safety

<h4>Fixes</h4>

- [Core] Fix bug causing forms to submit twice when using the 'enter' key
- [Change Password] Fix bug preventing new password from being sent to the server

</details>

<details>
<summary style="cursor: pointer">v1.2.0-beta</summary>

**Released on October 4th, 2023**

<h4>Features</h4>

- [Core] Support submitting via 'enter' key in all forms
- [Change Password] Add ability to return to the previous page and request a new code after an email has already been entered

<h4>Refactor / Chores</h4>

- [Core] Simplify handling of form validation messages

<h4>Fixes</h4>

- [Core] Revert changes to algorithm of 'kebabize' helper function, ensuring that the correct CSS classes are added in the Members Table component
- [Core] Ensure all validator functions work as expected again, after major code refactor in the previous release

</details>

<details>
<summary style="cursor: pointer">v1.1.0-beta</summary>

**Released on August 31st, 2023**

<h4>Features</h4>

- [About] Embed Google Maps map of club location

<h4>Refactor / Chores</h4>

- [Core] Enforce strict typing and apply better formatting in all files using new ESLint, Prettier and Beautify set up
- [Core] Update and clean up this README file
- [Core] Ensure all functions have an explicit return type

</details>

<details>
<summary style="cursor: pointer">v1.0.0-beta</summary>

**Released on September 26th, 2022**

<h4>Refactor / Chores</h4>

- [Core] Clean up comments throughout codebase
- [Core] Add any missing information to this README file

<h4>Bug Fixes</h4>

- [Core] Revert accidental removal of DevTools module property 'logOnly' to re-disable all but logs when in a production environment

</details>

<details>
<summary style="cursor: pointer">v0.8.2-alpha</summary>

**Released on September 22nd, 2022**

<h4>Features</h4>

- [Articles] Add 'date created' and 'date edited' information to article cards
- [Schedule] Improve date formatting in schedule component
- [Core] Centre admin control links displayed above the schedule, members, and article-grid components
- [Core] Sanitize any actions in NgRx DevTools that include sensitive information

<h4>Refactor / Chores</h4>

- [Articles] Remove any unused code from article-grid and article-form components and resize the cards that make up the article-grid
- [Core] Clean up .gitignore file

</details>

<details>
<summary style="cursor: pointer">v0.8.1-alpha</summary>

**Released on September 13th, 2022**

<h4>Features</h4>

- [Core] Implement custom trackBy function to improve performance of ngFor directive's tracking algorithm

<h4>Refactor / Chores</h4>

- [Core] Wrap createEffect() callbacks with 'return' for easier debugging

<h4>Bug Fixes</h4>

- [Schedule] Correct faulty date format conversions used in schedule component

</details>

<details>
<summary style="cursor: pointer">v0.8.0-alpha</summary>

**Released on September 8th, 2022**

<h4>Features</h4>

- [Core] Integrate an NgRx (redux-based) infrastructure for state management
- [Core] Integrate various backend solutions through AWS, including: DynamoDB for a NoSQL database, Cognito and IAM for user authentication and authorization, API Gateway and Lambda functions for HTTP request manipulation and routing, S3 for static hosting, CodeBuild for an automated CI/CD pipeline triggered directly by GitHub PR merges, and Route 53 and CloudFront for DNS record management, CDN services, and traffic management
- [Core] Implement an assortment of basic UI/UX features, such as toast notifications, modals (pop-ups) for action confirmation, an alert bar at the top of the screen, and a loading spinner for when data is being fetched from the database
- [Nav] Implement a standard nav bar to route to the various pages available, including an icon-only view on smaller devices, and a user account section to house any account-specific information and actions
- [Auth] Implement user sign up, login, and change password flows, granting LCC committee members admin access to perform Create, Read, Update and Delete (CRUD) actions on any data which is regularly updated: currently members, articles, and scheduled events
- [Members] Implement basic members table and paginator components, fully fitted with sorting and filtering algorithms
- [Articles] _(Work in progress)_ Implement basic database CRUD functionality and a responsive grid layout for articles
- [Schedule] Implement basic CRUD functionality and a responsive table layout for all club events stored in the database
- [About] Create a responsive grid layout to organize the most commonly sought information about the club
- [Photo Gallery] Create a responsive grid layout to house photos from club meetings and club-organized events, including the functionality to enlarge photos in an image overlay 'preview' mode
- [Home] Create a responsive grid layout to showcase only the most pertinent information from other pages (such as only the next 4 events from the schedule, and a more limited amount of photos from the photo gallery)

</details>

<br />
<h3>The London Chess Club</h3>

The London Chess Club (est. 1965) hosts a mix of blitz and rapid chess tournaments, lectures and simuls for players of all ages and skill levels. Its current static WordPress website can be found at [londonchessclub.ca](https://www.londonchessclub.ca).
