import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const StationsScreen = ({setBack, setPage}) => {

  setBack("home")
  return (
    <View style={styles.container}>
     

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports & Station Overview</Text>
        <Text style={styles.headerSubtitle}>
          Add reports, view past entries, and monitor station performance.
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.card, styles.whiteCard]}>
            <Text style={styles.cardTitle}>Add Report</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.lightBlueCard]}>
            <Text style={styles.cardTitle}>View Reports</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.card, styles.lightBlueCard]}>
            <Text style={styles.cardTitle}>Station State</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    gap: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  card: {
    flex: 1,
    height:150,
    // aspectRatio: 1,
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
  
});

export default StationsScreen;