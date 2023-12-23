export const environment = {
  production: true,
  cognito: {
    userPoolId: 'us-east-2_W9IbTHSe9',
    clientId: '646fep86clslssd31shun84u',
    articlesEndpoint:
      'https://lgqi8xer38.execute-api.us-east-2.amazonaws.com/dev/articles/',
    membersEndpoint:
      'https://lgqi8xer38.execute-api.us-east-2.amazonaws.com/dev/members/',
    scheduleEndpoint:
      'https://lgqi8xer38.execute-api.us-east-2.amazonaws.com/dev/club-events/',
  },
  googleMaps: {
    apiKey: 'AIzaSyAuLCJPCzFJXPWYUPM61Txue8PeJabI6DI',
  },
  imagesEndpoint: 'https://api.londonchess.ca/api/images/',
};
