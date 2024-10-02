import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import logo from '../assets/images/logo.png';

const HomeScreen = ({setPage, setBack}) => {

  // setBack(null);
  const sections = [
    { id: '1', itemName: 'Cars', icon: 'car-estate' },
    { id: '2', itemName: 'Drones', icon: 'drone' },
    { id: '3', itemName: 'Lab equipments', icon: 'tools' },
    { id: '4', itemName: 'Stations', icon: 'space-station' },
  ];

  const renderReportCard = ({ item }) => (
    // <View style={styles.reportCard}>

    // </View>
    <TouchableOpacity onPress={() => {setPage(item.itemName); setBack("home")}} style={styles.reportCard}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name={item.icon} size={48} color="#21437f" style={styles.carIcon} />
      </View>
      <View style={styles.reportInfo}>
        <Text style={styles.stationName}>{item.itemName}</Text>
      </View>
      </TouchableOpacity>
  );

  return (
    <View style={styles.container}>


      <FlatList
        data={sections}
        renderItem={renderReportCard}
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
  addButton: {
    backgroundColor: '#1E6FFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  latestReportsText: {
    fontSize: 16,
    marginBottom: 10,
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
  stationName: {
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

export default HomeScreen;