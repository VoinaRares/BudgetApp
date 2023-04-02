import React, { useState, useEffect, Fragment, useContext } from 'react';
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  QuerySnapshot,
} from 'firebase/firestore';
import db from './firebase';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from './auth/Auth';




function SnapshotFirebase()
{
    const collectionref = collection(db, 'users');

    const [budger, setBudget] = useState([]);


    const showMsg = onSnapshot(collectionref, (querySnapshot) => 
    {
        const items =[];
         querySnapshot.forEach((doc) => {
            items.push(doc.data());
         });
         setBudget(items);
    })
    return () => {
        showMsg();
    };
}