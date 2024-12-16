import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { db } from '../../firestore';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import {useState, useEffect } from 'react';

const StationNotes = ({setPage, setBack, stationId}) => {

    const [lastVisit, setLastVisit] = useState("");
    const [equipmentStatus, setEquipmentStatus] = useState("");


    // Function to fetch the last equipment with "damaged" status for a specific station
    const fetchNotes = async (stationId) => {
        try {
            const q = query(
                collection(db, "station", stationId, "notes"),
                orderBy("date", "desc"),
            );
            const querySnapshot = await getDocs(q);
            const notes = querySnapshot.docs.map((doc) => doc.data());
            return notes;
        } catch (error) {
            console.error("Error fetching notes: ", error);
            return [];
        }
    };
    
    
    // Example usage
    useEffect(() => {
        const getNotes = async () => {
            const notes = await fetchNotes(stationId);
            console.log("Notes: ", notes);
        };
    
        getNotes();
    }, [stationId]);
  

  const OptionsDetails = ({ item }) => (

    <TouchableOpacity onPress={() => {setPage(item.itemName); setBack("home")}} style={styles.reportCard}>
      <View style={styles.iconWrapper}>
        <MaterialIcons name={item.icon} size={48} color="#21437f" style={styles.carIcon} />
      </View>
      <View style={styles.reportInfo}>
        <Text style={styles.optionName}>{item.itemName}</Text>
      </View>
      </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        {station && (
        <View style={styles.stationDetails}>
            <Text style={styles.stationName}>Station : {station.name}</Text>
        </View>
        )}
      <FlatList
        data={notes}
        renderItem={({ item }) => <NoteItem note={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2F77',
    paddingTop: 80,
    paddingHorizontal: 20,
    margin: 0,
    width: '100%',
  },
  stationDetails: {
    fontSize: 16,
    marginBottom: 10,
  },
  stationName: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  reportCard: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#21437f',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    width: '48%',
    color: '#21437f',
  },
  reportInfo: {
    flex: 1,
  },
  optionName: {
    color: '#21437f',
    fontSize: 16,
    marginBottom: 5,
  },
  lastUpdate: {
    color: 'white',
    fontSize: 14,
  },
  iconWrapper: {
    paddingLeft: 10,
  },
  reportIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  carIcon: {
    marginBottom: 5,
  },  
});

export default StationNotes;