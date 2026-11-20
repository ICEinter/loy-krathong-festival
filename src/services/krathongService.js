import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  onSnapshot,
  increment,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { INITIAL_CONTESTANTS } from '../data/mockContestants';

const COLLECTION_NAME = 'krathongs';

/**
 * Real-time subscription to Krathongs collection in Firestore
 */
export function subscribeToKrathongs(onUpdate, onError) {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
          });
          onUpdate(items);
        } else {
          // If Firestore is brand new and empty, seed initial 20 contestants
          seedInitialContestants().then((seeded) => {
            if (seeded) onUpdate(seeded);
          });
        }
      },
      (error) => {
        console.warn("[Firestore] onSnapshot error (falling back to local):", error);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("[Firestore] subscribe error:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Seed initial 20 contestants into Firestore if empty
 */
export async function seedInitialContestants() {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      console.log("[Firestore] Seeding 20 initial contestants into Firestore...");
      for (const item of INITIAL_CONTESTANTS) {
        await setDoc(doc(db, COLLECTION_NAME, item.id), {
          ...item,
          createdAt: serverTimestamp()
        });
      }
      return INITIAL_CONTESTANTS;
    }
    return null;
  } catch (err) {
    console.warn("[Firestore] Seed error:", err);
    return null;
  }
}

/**
 * Save new Krathong to Firestore
 */
export async function saveKrathongToFirestore(contestant) {
  try {
    const docRef = doc(db, COLLECTION_NAME, contestant.id);
    await setDoc(docRef, {
      ...contestant,
      createdAt: serverTimestamp()
    });
    console.log("[Firestore] Krathong saved successfully:", contestant.id);
    return true;
  } catch (err) {
    console.error("[Firestore] Save error:", err);
    throw err;
  }
}

/**
 * Increment vote for a Krathong in Firestore
 */
export async function voteKrathongInFirestore(contestantId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, contestantId);
    await updateDoc(docRef, {
      votes: increment(1)
    });
    console.log("[Firestore] Vote counted for:", contestantId);
    return true;
  } catch (err) {
    console.error("[Firestore] Vote error:", err);
    throw err;
  }
}

