import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { db } from '../firestore';
import { collection, query, doc, orderBy, getDocs, getDoc } from 'firebase/firestore';
import {useState, useEffect } from 'react';

const StationStatus = ({setPage, setBack, stationId}) => {
    const [station, setStation] = useState(null);
    const [equipmentStatus, setEquipmentStatus] = useState("");

    const getStation = async () => {
        const docRef = doc(db, "station", stationId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setStation(docSnap.data());
        }
    };
    useEffect(() => {
        getStation();
    }, [stationId]);
    // Function to fetch the last equipment with "damaged" status for a specific station
    const fetchLastNoteForEachEquipment = async (stationId) => {
        try {
            const q = query(
                collection(db, "station", stationId, "equipment"),
                orderBy("date", "desc")
            );
    
            const querySnapshot = await getDocs(q);
            let equipmentWithLastNotes = [];
    
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.notes && data.notes.length > 0) {
                    const lastNote = data.notes[data.notes.length - 1];
                    equipmentWithLastNotes.push({
                        equipment: data.name, // Assuming 'name' is the equipment name field
                        status: lastNote
                    });
                }
            });
    
            return equipmentWithLastNotes;
        } catch (error) {
            console.error("Error fetching last notes for each equipment: ", error);
            return [];
        }
    };
    
    // Example usage
    useEffect(() => {
        const getLastNotesForEachEquipment = async () => {
            const equipment = await fetchLastNoteForEachEquipment(stationId);
            setEquipmentStatus(equipment);
        };
    
        getLastNotesForEachEquipment();
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
                data={equipmentStatus}
        renderItem={OptionsDetails}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
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

export default StationStatus;