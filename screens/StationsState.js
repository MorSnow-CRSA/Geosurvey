import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { db } from '../firestore';
import { doc, getDocs, collection } from 'firebase/firestore';
import { ActivityIndicator } from 'react-native';
const StationsState = ({setBack, setPage, setStationId}) => {
  
    setBack("Station")
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "station"));
                const stationsList = querySnapshot.docs.map(doc => {
                    const stationData = doc.data();
                    
                    // Collect all notes from all equipment
                    const allNotes = stationData.equipments.reduce((notes, equipment) => {
                        if (equipment.notes && equipment.notes.length > 0) {
                            return [...notes, ...equipment.notes.map(note => ({
                                ...note,
                                equipmentName: equipment.name
                            }))];
                        }
                        return notes;
                    }, []);

                    // Get the most recent note
                    const latestNote = allNotes.sort((a, b) => 
                        new Date(b.Date) - new Date(a.Date)
                    )[0] || null;

                    return {
                        id: doc.id,
                        name: stationData.name,
                        lastVisit: latestNote ? latestNote.Date : 'No visits yet',
                        visitor: latestNote ? latestNote.user.split("@")[0].split(".").join(" ") : 'None',
                    };
                });
                setStations(stationsList);
                setLoading(false);
            } catch (err) {
                console.log(err, "err");
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchStations();
    }, []);

  const renderCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, item.style]} 
      onPress={() => {setPage("StationDetails"); setBack("StationState"); setStationId(item.id)}}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.visitInfo}>
            {item.lastVisit !== 'No visits yet' ? (
                <Text style={styles.visitText}>Last visit : {item.lastVisit.toDate().toDateString()}</Text>
            ) : (
                <Text style={styles.visitText}>Last visit : No visits yet</Text>
            )}
            <Text style={styles.visitText}>Visitor : {item.visitor}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Stations State</Text>
            </View> 
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stations State</Text>
      </View>

      <FlatList
        data={stations}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.cardsContainer}
      />
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
    backgroundColor: 'white',
  },
  cardContent: {
    flex: 1,
  },
  stationLabel: {
    fontSize: 16,
    color: '#1a3875',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a3875',
    marginBottom: 16,
    whiteSpace: 'wrap',
  },
  visitInfo: {
    gap: 4,
  },
  visitText: {
    fontSize: 14,
    color: '#1a3875',
  },
  arrow: {
    fontSize: 36,
    fontWeight: "bold",
    color: '#1a3875',
    marginLeft: 10,
  },
});

export default StationsState;