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
    const doc = await db.collection('settings').doc('config').get({ source: 'server' });
    _settingsCache = doc.exists ? doc.data() : defaultSettings();
    return _settingsCache;
  } catch (e) {
    console.error("Firestore Settings Error:", e);
    return defaultSettings();
  }
}

function defaultSettings() {
  return {
    whatsappNumber: '917736348312',
    storeName: 'Calligraphy Tools Store',
    storeEmail: 'muhammedajeer54@gmail.com',
    storeInstagram: 'calligraphy_tools_store',
    adminPassword: 'ajeer@.com',
    kitTitle: 'Starter Kit for Beginners',
    kitDesc: 'Everything you need to start your calligraphy journey. Includes 2 font style guides, premium qalams, ink, practice sheets, and a carrying case.',
    kitPrice: 999,
    kitOrig: 1499,
    kitFeatures: [
      { icon: '🖊️', title: 'Calligraphy Qalam', desc: '2 sizes included' },
      { icon: '🎨', title: 'Premium Ink', desc: '2 bottles, 30ml each' },
      { icon: '📄', title: 'Practice Sheets', desc: '50 ruled sheets' },
      { icon: '📘', title: 'Font Guides', desc: 'Naskh & Nastaliq' }
    ]
  };
}

async function saveSettings(data) {
  await db.collection('settings').doc('config').set(data, { merge: true });
  _settingsCache = null;
}
