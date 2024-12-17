import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const HomeScreen = ({setPage, setBack, user, ModalContent ,setModalContent}) => {
  const [modal, setModal] = useState(ModalContent);
  setModalContent(null);
  const sections = [
    { id: '1', itemName: 'Station', action: 'Management' },
    { id: '2', itemName: 'Drone', action: 'reservation' },
    { id: '3', itemName: 'Material', action: 'reservation' },
    { id: '4', itemName: 'Vehicule', action: 'reservation' },
  ];

  const renderReportCard = ({ item }) => (
    <TouchableOpacity onPress={() => {setPage(item.itemName); setBack("home")}} style={styles.reportCard}>
      <View style={styles.reportInfo}>
        <Text style={styles.stationName}>{item.itemName}</Text>
        <Text style={styles.action}>{item.action}</Text>
      </View>
      <MaterialCommunityIcons name='arrow-right' size={24} color="#21437f" style={styles.Icon} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user.email.split('.')[0].charAt(0).toUpperCase() + user.email.split('.')[0].slice(1)}</Text>
        <Text style={styles.titleText}>Manage & Reserve</Text>
        <Text style={styles.subtitleText}>
          Streamline your operations by selecting one of the following options.
        </Text>
      </View>

      <FlatList
        data={sections}
        renderItem={renderReportCard}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      {modal && (
        <Text style={[
          styles.modalContent, 
          modal.type === 'success' ? styles.successModal : styles.errorModal
        ]}>
          {modal.message}
        </Text>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a3875',
    padding: 20,
    width: '100%',
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  titleText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitleText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  reportCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    width: '48%',
    height: 80,
  },
  reportInfo: {
    flex: 1,
  },
  stationName: {
    color: '#21437f',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  action: {
    color: '#21437f',
    fontSize: 14,
  },
  Icon: {
    marginLeft: 8,
  },
  modalContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
  },
  successModal: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  errorModal: {
    backgroundColor: '#f44336',
    color: 'white',
  },
});

export default HomeScreen;