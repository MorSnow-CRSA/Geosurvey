import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firestore';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { ActivityIndicator } from 'react-native';
const ViewNotes = ({setPage, setBack}) => {
    const [notes, setNotes] = useState([]);
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // Fetch all stations for the dropdown
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'station'));
                const stationsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name
                }));
                setStations(stationsList);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stations:", error);
                setLoading(false);
            }
        };

        fetchStations();
    }, []);

    // Fetch notes when a station is selected
    useEffect(() => {
        const fetchAllNotes = async () => {
            if (!selectedStation) return;
            
            try {
                setLoading(true);
                const stationDoc = await getDoc(doc(db, 'station', selectedStation.id));
                
                if (stationDoc.exists()) {
                    const stationData = stationDoc.data();
                    
                    // Collect all notes from all equipment
                    const allNotes = stationData.equipments.reduce((acc, equipment) => {
                        if (equipment.notes && equipment.notes.length > 0) {
                            const equipmentNotes = equipment.notes.map(note => ({
                                ...note,
                                equipmentName: equipment.name
                            }));
                            return [...acc, ...equipmentNotes];
                        }
                        return acc;
                    }, []);

                    // Sort notes by date in descending order
                    const sortedNotes = allNotes.sort((a, b) => 
                        new Date(b.date) - new Date(a.date)
                    );

                    setNotes(sortedNotes);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching notes:", error);
                setLoading(false);
            }
        };

        fetchAllNotes();
        console.log("notes", notes);
    }, [selectedStation]);

    const renderNote = (note) => (
        <View key={`${note.date}-${note.equipmentName}`} style={styles.noteCard}>
            <View style={styles.noteInfo}>
                
                <Text style={styles.equipmentName}>{note.equipmentName}</Text>
                <Text style={styles.noteContent}>{note.comment}</Text>
                <Text style={styles.noteDetails}>
                    {note.Date.toDate().toDateString()} - By: {note.user.split("@")[0].split(".").join(" ")}
                </Text>
                
            </View>
            {/* <Ionicons 
                name="document-text-outline"
                size={24} 
                color="#1a3875"
            /> */}
            <Ionicons 
                name={note.status === "working" ? 'checkmark-circle' : 'alert-circle'} 
                size={24} 
                color={note.status === "working" ? '#4CAF50' : '#FF0000'} 
            />
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>View Notes</Text>
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
                <Text style={styles.headerTitle}>View Notes</Text>
                <View style={styles.dropdownContainer}>
                    <TouchableOpacity 
                        style={styles.dropdown}
                        onPress={() => setDropdownVisible(!dropdownVisible)}
                    >
                        <Text style={styles.dropdownText}>
                            {selectedStation ? selectedStation.name : "Select Station"}
                        </Text>
                        <Ionicons 
                            name={dropdownVisible ? "chevron-up" : "chevron-down"} 
                            size={24} 
                            color="white" 
                        />
                    </TouchableOpacity>

                    {dropdownVisible && (
                        <ScrollView style={styles.dropdownList}>
                            {stations.map((station, index) => (
                                <TouchableOpacity 
                                key={station.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSelectedStation(station);
                                    setDropdownVisible(false);
                                }}
                                >
                                <Text style={styles.dropdownItemText}>{station.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>
                {selectedStation && (
                    <Text style={styles.notesCount}>
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
                    </Text>
                )}
            </View>
            
            <ScrollView style={styles.notesList}>
                {selectedStation ? 
                    (notes.length > 0 ? 
                        notes.map(note => renderNote(note)) 
                        : 
                        <View style={styles.noNotesContainer}>
                            <Text style={styles.noNotesText}>No notes found</Text>
                        </View>
                    ) 
                    : null
                }
            </ScrollView>
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
        marginBottom: 20,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    notesCount: {
        fontSize: 14,
        color: '#B0C4DE',
    },
    notesList: {
        flex: 1,
    },
    noteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
    },
    noteInfo: {
        flex: 1,
    },
    noteDetails: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        
    },
    equipmentName: {
        fontSize: 14,
        color: '#1a3875',
        fontWeight: '500',
        marginBottom: 4,
    },
    userName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    noteContent: {
        fontSize: 16,
        color: '#1a3875',
        marginBottom: 4,
    },
    dropdownContainer: {
        position: 'relative',
        zIndex: 1000,
        marginBottom: 16,
    
    },
    dropdown: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        color: 'white',
        fontSize: 16,
    },
    dropdownListContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        marginTop: 4,
        maxHeight: 200,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 2000,
    },
    dropdownList: {
        width: '100%',
        maxHeight: 200,
        backgroundColor: 'white',
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%',
        zIndex: 500,
    },
    dropdownItemText: {
        color: '#1a3875',
        fontSize: 16,
    },
    noNotesContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        marginTop: 20,
    },
    noNotesText: {
        color: '#B0C4DE',
        fontSize: 16,
    },
});

export default ViewNotes;
