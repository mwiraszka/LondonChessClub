const ROOT_API_URL = 'https://lgqi8xer38.execute-api.us-east-2.amazonaws.com';

export const environment = {
  production: false,
  aws: {
    cognitoUserPool: {
      userPoolId: 'us-east-2_W9IbTHSe9',
      clientId: '646fep86clslssd31shun84u',
    },
    articlesEndpoint: ROOT_API_URL + '/dev/articles/',
    membersPublicEndpoint: ROOT_API_URL + '/dev/members/public/',
    membersPrivateEndpoint: ROOT_API_URL + '/dev/members/',
  },
  googleMaps: {
    apiKey: 'AIzaSyAuLCJPCzFJXPWYUPM61Txue8PeJabI6DI',
  },
  imagesEndpoint: 'https://api.londonchess.ca/api/images/',
  newEventsEndpoint: 'http://localhost:3000/events',
};
