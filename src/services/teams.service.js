import { get, set, ref, update, push, remove } from 'firebase/database';
import { db } from '../../firebaseAppConfig';

export const addTeam = async (userUid, name) => {
  try {
    const result = await push(ref(db, 'teams'), {});
    const uid = result.key;
    const owner = userUid;
    const channels = {};
    const members = {};
    members[userUid] = true;

    await set(ref(db, `teams/${uid}`), { name, owner, members, channels, uid });
    await update(ref(db), { [`users/${userUid}/MyTeams/${name}`]: uid });
    return uid;
  } catch (error) {
    console.error('Error adding team:', error);
    throw error;
  }
};

export const checkIfTeamNameExists = async (name) => {
  try {
    const teamsRef = ref(db, 'teams');
    const snapshot = await get(teamsRef);

    if (snapshot.exists()) {
      const teamsData = snapshot.val();
      return Object.values(teamsData).some((team) => team.name === name);
    }

    return false;
  } catch (error) {
    console.error('Error checking if team name exists:', error.message);
    throw new Error('Error checking if team name exists');
  }
};

export const getTeamsByUserUids = async (userUids) => {
  try {
    const snapshot = await get(ref(db, 'teams'));

    if (snapshot.exists()) {
      const teamsData = Object.values(snapshot.val());
      // .filter((team) =>
      //   userUids.includes(team.uid)
      // );
      return teamsData;
    }

    return [];
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getAllTeams = async () => {
  try {
    const snapshot = await get(ref(db, 'teams'));

    if (!snapshot.exists()) {
      return [];
    }
    const teamsArray = Object.values(snapshot.val());

    return teamsArray;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getTeamsByUid = async (uuid) => {
  try {
    const snapshot = await get(ref(db, 'teams/' + uuid));

    if (!snapshot.exists()) {
      return [];
    }
    const team = snapshot.val();
    console.log(team);
    return team;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getTeamMembers = async (teamUid) => {
  try {
    const snapshot = await get(ref(db, `teams/${teamUid}/members/`));
    if (!snapshot.exists()) {
      return [];
    }
    const membersArray = Object.keys(snapshot.val()).filter(
      (memberId) => snapshot.val()[memberId] === true
    );
    return membersArray;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};
