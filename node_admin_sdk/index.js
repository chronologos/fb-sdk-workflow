// b/75399423
const admin = require('firebase-admin');
app = admin.initializeApp({ 
    credential: admin.credential.applicationDefault(),
    projectId: "ian-firebase-auth-sdk", 
}); // Detects the default creds

// admin.firestore().; // This will work

// admin.auth().foo(); // This will fail

const listAllUsers = (nextPageToken) => {
    // List batch of users, 1000 at a time.
    app
        .auth()
        .listUsers(1000, nextPageToken)
        .then((listUsersResult) => {
            listUsersResult.users.forEach((userRecord) => {
                console.log('user', userRecord.toJSON());
            });
            if (listUsersResult.pageToken) {
                // List next batch of users.
                listAllUsers(listUsersResult.pageToken);
            }
        })
        .catch((error) => {
            console.log('Error listing users:', error);
        });
};
// Start listing users from the beginning, 1000 at a time.
listAllUsers();
