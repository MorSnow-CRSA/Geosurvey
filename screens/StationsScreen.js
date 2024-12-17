import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';

const StationsScreen = ({setBack, setPage, modalContent, setModalContent}) => {
  const [modal, setModal] = useState(modalContent);
  setModalContent(null);
  const cardData = [
    { id: '1', title: 'Add Note', style: styles.whiteCard, action: 'addNote' },
    { id: '2', title: 'View Notes', style: styles.lightBlueCard, action: 'viewNotes' },
    { id: '3', title: 'Station State', style: styles.lightBlueCard, action: 'StationState' },
  ];

  const renderCard = ({ item }) => (
    <TouchableOpacity style={[styles.card, item.style]} onPress={() => {setPage(item.action); setBack("Station")}}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );

  setBack("home")
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports & Station Overview</Text>
        <Text style={styles.headerSubtitle}>
          Add reports, view past entries, and monitor station performance.
        </Text>
      </View>

      <FlatList
        data={cardData}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.cardsContainer}
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
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#B0C4DE',
    fontSize: 16,
  },
  cardsContainer: {
    padding: 5,
  },
  row: {
    gap: 15,
  },
  card: {
    flex: 1,
    height: 150,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  whiteCard: {
    backgroundColor: 'white',
  },
  lightBlueCard: {
    backgroundColor: '#82bada',
    color:"#ffffff"
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a3875',
  },
  arrow: {
    fontSize: 36,
    fontWeight:"bold",
    color: '#1a3875',
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

export default StationsScreen;