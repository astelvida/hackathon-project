import firebase from 'firebase';
import {
  SAVE_PREFERENCES_SUCCESS,
  GET_PREFERENCES_SUCCESS,
  GET_PREFERENCES,
  GET_PROJECT_OWNERS,
  GET_MATCHES_SUCCESS,
} from './firebaseActionTypes';


export const savePreferences = (preferences) => (dispatch) => {
  const role = preferences.role.Investor ? 'investor' : 'projectOwner';
  const { currentUser } = firebase.auth();
  for (const prop in preferences) {
    for (const key in preferences[prop]) {
      if (!preferences[prop][key] && prop !== 'product') {
        delete preferences[prop][key];
      }
    }
  }
  const dbSave = Object.keys(preferences).map(key =>
    firebase.database().ref(`/byId/${currentUser.uid}`)
    .set({ ...preferences, email: currentUser.email }));
  const dbSave2 = Object.keys(preferences).map(key =>
    firebase.database().ref(`/users/${key}/${currentUser.uid}`)
    .set(preferences[key]));
  return Promise.all(dbSave).then(() =>
    dispatch({ type: SAVE_PREFERENCES_SUCCESS, preferences: preferences }),
  );
};


export const getPreferences = () => (
  (dispatch) => {
    dispatch({ type: GET_PREFERENCES });
    const { currentUser } = firebase.auth();
    return firebase.database()
    .ref(`/byId/${currentUser.uid}`)
    .on('value', (snapshot) => {
      dispatch({
        type: GET_PREFERENCES_SUCCESS,
        preferences: snapshot.val(),
      });
    });
  }
);


export const getMatches = (user) => ((dispatch) => {
  dispatch({ type: GET_PROJECT_OWNERS });
  const categories = ['industry', 'range', 'round', 'role'];

  const promises = categories.map((category) => {
    const databaseRef = firebase.database().ref().child(`users/${category}`);
    const pref = Object.keys(user.preferences[category])[0];
    const querybaseRef = querybase.ref(databaseRef, [pref]);
    let prefConditional = pref;
    if (category === 'role') {
      prefConditional = 'Project Owner';
    }
    const queriedDbRef = querybaseRef.where({ [prefConditional]: true });
    return new Promise(function(resolve, reject) {
      queriedDbRef.on('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  });

  Promise.all(promises).then((result) => {
    let matches = [];
    const final = {};
    const res2 = [];
    result.forEach((categ, index) =>
    matches = matches.concat(...Object.keys(categ)));
    matches = matches.filter((uid, index) => matches.indexOf(uid) === index)
    result.forEach((categ, index) => final[categories[index]] = categ);

    console.log('result', result)
    matches.forEach((uid) => {
      if (final.industry[uid] && final.role[uid] &&
        final.range[uid] && final.round[uid]) {
        res2.push(uid);
      }
    });

    const allUsers = res2.map((uid) => {
      const query = firebase.database().ref(`/byId/${uid}`);
      return new Promise((resolve) => {
        query.on('value', (snapshot) => {
          resolve(snapshot.val());
        });
      });
    });

    return Promise.all(allUsers).then(data => dispatch({
      type: GET_MATCHES_SUCCESS,
      matches: data,
    }));
  });
});
