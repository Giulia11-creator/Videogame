import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // importa la tua configurazione Firebase

/**
 * 🔹 Crea o aggiorna un utente in una collezione Firestore.
 * @param {string} collectionName - Nome della collezione (es. "TravelLevel").
 * @param {string} uid - UID dell'utente.
 * @param {object} options - Dati aggiuntivi (es. { score, email }).
 */
export async function addUser(collectionName, uid, options = {}) {
  const userRef = doc(db, collectionName, uid);

  try {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      await setDoc(
        userRef,
        {
          points: Number(options.score ?? 0),
          totalClicks: Number(options.totalClicks ?? 0),
          lastUpdate: serverTimestamp(),
        },
        { merge: true }
      );
      console.log(`✅ Utente aggiornato in ${collectionName}`);
    } else {
      await setDoc(userRef, {
        id: uid,
        nick: options.email ?? "",
        points: Number(options.score ?? 0),
        totalClicks: Number(options.totalClicks ?? 0),
        createdAt: serverTimestamp(),
        lastUpdate: serverTimestamp(),
      });
      console.log(`🆕 Nuovo utente creato in ${collectionName}`);
    }
  } catch (error) {
    console.error("❌ Errore durante il salvataggio:", error);
    throw error;
  }
}

/**
 * 🔹 Aggiunge punti a un documento in Firestore (o lo crea se non esiste).
 * @param {string} collectionName - Nome della collezione (es. "Leaderboard").
 * @param {string} uid - UID dell'utente.
 * @param {number} delta - Quantità di punti da aggiungere.
 * @param {string} field - Campo da aggiornare (default: "totalPoints").
 * @param {object} extraData - Dati opzionali da salvare alla creazione.
 */
export async function addPoints(
  collectionName,
  uid,
  delta,
  field = "totalPoints",
  extraData = {}
) {
  const ref = doc(db, collectionName, uid);
  const docSnap = await getDoc(ref);

  if (docSnap.exists()) {
    await updateDoc(ref, {
      [field]: increment(delta),
    });
    console.log(`✅ Aggiornati ${delta} punti in ${collectionName}/${uid}`);
  } else {
    await setDoc(ref, {
      id: uid,
      [field]: increment(delta),
      ...extraData, // es: { nick: email }
    });
    console.log(`🆕 Creato nuovo documento in ${collectionName}/${uid}`);
  }
}
