import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { db } from '../firestore';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import {useState, useEffect } from 'react';

const StationStatus = ({setPage, setBack, stationId}) => {

    const [lastVisit, setLastVisit] = useState("");
    

    // Function to fetch the last equipment with "damaged" status for a specific station
    const fetchLastDamagedEquipment = async (stationId) => {
        try {
            const q = query(
                collection(db, "station", stationId, "equipment"),
                where("status", "==", "damaged"),
                orderBy("date", "desc"),
            );
    
            const querySnapshot = await getDocs(q);
            let lastDamagedEquipment = null;
    
            querySnapshot.forEach((doc) => {
                lastDamagedEquipment = doc.data();
            });
    
            return lastDamagedEquipment;
        } catch (error) {
            console.error("Error fetching last damaged equipment: ", error);
            return null;
        }
    };
    
    // Example usage
    useEffect(() => {
        const getLastDamagedEquipment = async () => {
            const equipment = await fetchLastDamagedEquipment(stationId);
            console.log("Last damaged equipment: ", equipment);
        };
    
        getLastDamagedEquipment();
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
        data={sections}
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