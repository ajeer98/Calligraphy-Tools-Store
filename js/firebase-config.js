// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfUQvmEN6Y0BPMVebSXbhrTfykHYs76eU",
  authDomain: "calligraphy-tools-store-4b30d.firebaseapp.com",
  projectId: "calligraphy-tools-store-4b30d",
  storageBucket: "calligraphy-tools-store-4b30d.firebasestorage.app",
  messagingSenderId: "153968589719",
  appId: "1:153968589719:web:2e29163adc0f96da5722d2",
  measurementId: "G-6F749LFSHB"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

let _settingsCache = null;

async function getSettings() {
  if (_settingsCache) return _settingsCache;
  try {
    const doc = await db.collection('settings').doc('config').get();
    _settingsCache = doc.exists ? doc.data() : defaultSettings();
    return _settingsCache;
  } catch (e) {
    return defaultSettings();
  }
}

function defaultSettings() {
  return {
    whatsappNumber: '919999999999',
    storeName: 'Ajeer Calligraphy Store',
    adminPassword: 'admin123'
  };
}

async function saveSettings(data) {
  await db.collection('settings').doc('config').set(data, { merge: true });
  _settingsCache = null;
}
