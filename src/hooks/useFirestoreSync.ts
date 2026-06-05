import { useEffect } from 'react';
import { useStore, StoreState } from '../store';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'firebase/auth';
import { handleFirestoreError, OperationType } from './useFirebase';

function setupCollectionSync<K extends keyof StoreState>(
  collectionName: string,
  stateKey: K,
  sortFn?: (a: any, b: any) => number
) {
  const ref = collection(db, collectionName);
  return onSnapshot(ref, (snapshot) => {
    let data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
    if (data.length > 0) {
      if (sortFn) data.sort(sortFn);
      useStore.setState({ [stateKey]: data } as any);
    } else {
      const storeState = useStore.getState() as any;
      const currentItems = storeState[stateKey] as any[];
      if (currentItems && Array.isArray(currentItems)) {
        currentItems.forEach(async (item) => {
          try { await setDoc(doc(db, collectionName, item.id), item); } catch(err) {}
        });
      }
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, collectionName);
  });
}

export function useFirestoreSync() {
  useEffect(() => {
    const unsubs = [
      setupCollectionSync('tasks', 'tasks'),
      setupCollectionSync('careRecords', 'careRecords', (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()),
      setupCollectionSync('elders', 'elders'),
      setupCollectionSync('staff', 'staff'),
      setupCollectionSync('assessments', 'assessments'),
      setupCollectionSync('buildings', 'buildings'),
      setupCollectionSync('floors', 'floors'),
      setupCollectionSync('rooms', 'rooms'),
      setupCollectionSync('roomTypes', 'roomTypes'),
      setupCollectionSync('iotDevices', 'iotDevices'),
      setupCollectionSync('careLevels', 'careLevels'),
      setupCollectionSync('serviceItems', 'serviceItems'),
      setupCollectionSync('beds', 'beds'),
      setupCollectionSync('alerts', 'alerts'),
      setupCollectionSync('sysUsers', 'sysUsers'),
      setupCollectionSync('sysRoles', 'sysRoles'),
    ];

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);
}