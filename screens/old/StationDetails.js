import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { db } from '../../firestore';
import { doc, getDoc } from 'firebase/firestore';
import {useState, useEffect } from 'react';

const StationDetails = ({setPage, setBack, stationId}) => {

  // setBack(null);
  const [station, setStation] = useState(null);
  const getStation = async () => {
    const docRef = doc(db, "station", stationId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setStation(docSnap.data());
    }
  };
  useEffect(() => {
    setBack("Stations");
    getStation();
  }, []);
  const sections = [
    { id: '1', itemName: 'Add note', icon: 'create-new-folder' },
    { id: '2', itemName: 'View notes', icon: 'note' },
    { id: '3', itemName: 'Status', icon: 'preview' },
    { id: '4', itemName: 'Add equipment', icon: 'add' },
    { id: '5', itemName: 'Update station', icon: 'edit-document' },
    { id: '6', itemName: 'Generate report', icon: 'file-download' },
  ];
  

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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
              contentContainerStyle={styles.flatListContent}
          />
      </ScrollView>
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
    flex: 1,
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
  flatListContent: {
    paddingBottom: 20, // Adjust this value if needed
  },
});

export default StationDetails;