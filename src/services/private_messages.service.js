import { getDatabase, ref, push, get, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { db, auth } from '../../firebaseAppConfig';

/**
 * Sends a message to a specified channel in Firebase Realtime Database.
 *
 * @param {string} channelId - The ID of the channel to send the message to.
 * @param {string} text - The text of the message to send.
 * @returns {Promise<void>} A promise that resolves when the message is sent successfully.
 */
export const addMessageToChannel = async (channelId, text) => {
  const database = getDatabase();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('User not authenticated');
  }

  const message = {
    uid: currentUser.uid,
    owner: currentUser.email || 'unknown', // Default to 'Anonymous' if displayName is not set
    text,
    createdOn: new Date().toISOString(),
  };

  return push(ref(database, `channelMessages/${channelId}/`), message);
};

export const getChannelMessages = async (channelId) => {
  const channelsRef = ref(db, 'channelMessages/' + channelId);
  try {
    const snapshot = await get(channelsRef);
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([key, value]) => ({
        id: key,
        ...value,
      }));
    } else {
      console.log('No data available');
      return [];
    }
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};

export const messageRef = ref(db, 'privateMessage');

export const createPrivateMessage = async (messageData) => {
  try {
    const { currentUser } = auth;
    console.log('createPrivateMessage --->');

    if (!currentUser) {
      throw new Error('User not authenticated.');
    }

    const { uid, displayName } = currentUser;

    if (!messageData || !messageData.id || !messageData.type) {
      throw new Error('Invalid message data');
    }

    const createdOn = Date.now();

    const mergedMessageData = {
      createdOn,
      username: displayName || '',
      uid,
      ...messageData,
    };

    const messageId = messageData.id;

    const userMessageRef = ref(db, `privateMessage/${messageId}`);
    await set(userMessageRef, mergedMessageData);

    return { messageId, ...mergedMessageData };
  } catch (error) {
    console.error('Error creating private message:', error);
    throw error;
  }
};