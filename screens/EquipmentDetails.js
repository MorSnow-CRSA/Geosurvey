import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firestore';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { ActivityIndicator } from 'react-native';
const EquipmentDetails = ({ setPage, setBack, stationId, equipmentId }) => {
    setBack("StationDetails");
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                // First, get the station document
                const stationDoc = await getDoc(doc(db, 'station', stationId));
                if (stationDoc.exists()) {
                    const stationData = stationDoc.data();
                    console.log("stationData", stationData)
                    // Find the specific equipment by name
                    const equipmentObject = stationData.equipments.find(eq => eq === equipmentId);
                    console.log("equipment", equipmentObject)
                    console.log("equipmentId", equipmentId)
                    console.log("stationId", stationId)
                    if (equipmentObject && equipmentObject.notes) {
                        // Sort notes by date in descending order
                        const sortedNotes = [...equipmentObject.notes].sort(
                            (a, b) => new Date(b.date) - new Date(a.date)
                        );
                        setNotes(sortedNotes);
                    } else {
                        setNotes([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching notes:", error);
                setNotes([]);
            }
        };
        fetchNotes();
        setLoading(false);
        console.log("notes", notes)
    }, [stationId, equipmentId])

    const renderNote = (note) => (
        <View key={note.date} style={styles.noteCard}>
            <View style={styles.noteInfo}>
                <Text style={styles.noteDate}>
                    {new Date(note.date).toLocaleDateString()}
                </Text>
                <Text style={styles.userName}>{note.user.split('@')[0].split('.')[0].join(' ')}</Text>
                <Text style={styles.noteContent}>{note.content}</Text>
            </View>
            <Ionicons 
                name="document-text-outline"
                size={24} 
                color="#1a3875"
            />
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{equipmentId} history details</Text>
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
                <Text style={styles.equipmentName}>{equipmentId}</Text>
                <Text style={styles.notesCount}>
                    {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </Text>
            </View>
            
            <ScrollView style={styles.notesList}>
                {notes.map(note => renderNote(note))}
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
    equipmentName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
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
    noteDate: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a3875',
        marginBottom: 4,
    },
    userName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    noteContent: {
        fontSize: 14,
        color: '#333',
    }
});

export default EquipmentDetails;
