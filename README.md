# London Chess Club Website

<span style="color: lightgreen; border: 1px solid lightgreen; border-radius: 2px; padding: 4px;">current website</span><br />
https://www.londonchessclub.ca<br /><br />

<span style="color: yellow; border: 1px solid yellow; border-radius: 2px; padding: 4px;">new website (development server)</span><br />
http://londonchessclub.ca.s3-website.us-east-2.amazonaws.com/<br /><br />

<h3>Releases</h3>
<details>
<summary style="cursor: pointer">v0.8.0-alpha</summary>

**Released on September 8th, 2022**

<h4 style="color: green">Features</h4>

- [Core] Integrated an NgRx (redux-based) infrastructure for state management

- [Core] Integrated various backend solutions through AWS, including: DynamoDB for a NoSQL database, Cognito and IAM for user authentication and authorization, API Gateway and Lambda functions for HTTP request manipulation and routing, S3 for static hosting, CodeBuild for an automated CI/CD pipeline triggered directly by GitHub PR merges, and Route 53 and CloudFront for DNS record management, CDN services, and traffic management

- [Core] Implemented an assortment of basic UI/UX features, such as toast notifications, modals (pop-ups) for action confirmation, an alert bar at the top of the screen, and a loading spinner for when data is being fetched from the database

- [Nav] Implemented a standard nav bar to route to the various pages available, including an icon-only view on smaller devices, and a user account section to house any account-specific information and actions

- [Auth] Implemented user sign up, login, and change password flows, granting LCC committee members admin access to perform Create, Read, Update and Delete (CRUD) actions on any data which is regularly updated: currently members, articles, and scheduled events

- [Members] Implemented basic members table and paginator components, fully fitted with sorting and filtering algorithms

- [Articles] _(Work in progress)_ Implemented basic database CRUD functionality and a responsive grid layout for articles

- [Schedule] Implemented basic CRUD functionality and a responsive table layout for all club events stored in the database

- [About] Created a responsive grid layout to organize the most commonly sought information about the club

- [Photo Gallery] Created a responsive grid layout to house photos from club meetings and club-organized events, including the functionality to enlarge photos in an image overlay 'preview' mode

- [Home] Created a responsive grid layout to showcase only the most pertinent information from other pages (such as only the next 4 events from the schedule, and a more limited amount of photos from the photo gallery)

</details>

<details>
<summary style="cursor: pointer">v0.8.1-alpha</summary>

**Released on September 8th, 2022**

<h4 style="color: green">Features</h4>

- [Core] Implement custom trackBy function to improve performance of ngFor directive's tracking algorithm

<h4 style="color: orange">Refactor</h4>

- [Core] Wrapped createEffect() callbacks with 'return' for easier debugging

<h4 style="color: red">Bug Fixes</h4>

- [Schedule] Corrected faulty date format conversions used in schedule component

</details>
