import React from 'react';
import { View,ScrollView, Text, StyleSheet } from 'react-native';
import { db,  } from '../firestore.js';
import { useState, useEffect } from 'react';
import {collection,  doc,  getDoc} from 'firebase/firestore';
const NotesList   = ({setPage, setBack, stationId}) => {
    
    const [notes, setNotes] = useState([]);

    const getNotes = async () => {
        const docRef = doc(collection(db, "station"), stationId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setNotes(docSnap.data().notes);
            console.log(notes);
        }
        else{
            console.log("No such document!");
        }
    }
    useEffect(() => {
        setBack("StationDetails");
        getNotes();
    }, []);

    
    
    const NoteItem = ({ note }) => {
        return (
          <View style={styles.noteCard}>
            <View style={styles.noteInfo}>
            <Text style={styles.noteName}>Note : {note.comment}</Text>
              <Text style={styles.noteName}>Date : {new Date(note.date.toDate()).toLocaleDateString().slice(0,10)}</Text>
              <Text style={styles.lastUpdate}>By : {note.user}</Text>
            </View>
          </View>
        );
    };


  return (
    <ScrollView style={styles.stationsContainer}>

    {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
    ))}

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    stationsContainer: {
    flex: 1,
    backgroundColor: '#2B2F77',
    paddingTop: 80,
    paddingHorizontal: 20,
    width: '100%',
  },
  noteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2B2F77',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
  },
  noteInfo: {
    flex: 1,
  },
  noteName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastUpdate: {
    color: 'white',
    fontSize: 14,
  },
  noteIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
 
  
  
  
});

export default NotesList;