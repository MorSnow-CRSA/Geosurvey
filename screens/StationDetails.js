import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firestore';
import { collection, getDoc, doc } from 'firebase/firestore';

const StationDetails = ({ setPage, setBack, stationId, setEquipmentId }) => {
    
    const [station, setStation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStation = async () => {
            try {
                const stationDoc = await getDoc(doc(db, 'station', stationId));
                if (stationDoc.exists()) {
                    const stationData = stationDoc.data();
                    // Process equipment to include their latest notes
                    const equipmentsWithLatestNotes = stationData.equipments.map(equipment => {
                        const notes = equipment.notes || [];
                        const latestNote = notes.sort((a, b) => 
                            new Date(b.date) - new Date(a.date)
                        )[0] || null;

                        return {
                            ...equipment,
                            latestNote: latestNote,
                        };
                    });

                    setStation({
                        ...stationData,
                        equipments: equipmentsWithLatestNotes
                    });

                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching station:", error);
                setLoading(false);
            }
        };

        fetchStation();
    }, [stationId]);
    
    const renderEquipmentStatus = (equipment) => {
        const isPerforming = equipment.latestNote !== null ? equipment.latestNote.status: "working";
        return (
            <Pressable key={equipment.name} style={styles.equipmentCard} onPress={() => {setPage("EquipmentDetails"); setBack("StationDetails"); setEquipmentId(equipment.name)}}>
                <View style={styles.equipmentInfo}>
                    <Text style={styles.equipmentName}>{equipment.name}</Text>
                    <Text style={[
                        styles.equipmentStatus,
                        { color: isPerforming ==="working" ? '#4CAF50' : '#FF0000' }
                    ]}>
                        {isPerforming}
                    </Text>
                    {equipment.latestNote && (
                        <>
                        <Text style={styles.lastNote}>
                        Last update :{equipment.latestNote.Date.toDate().toDateString()}
                        </Text>
                        <Text style={styles.lastNote}>Last visit By: {equipment.latestNote.user.split("@")[0].split(".").join(" ")}</Text>
                        </>
                    )}
                </View>
                <Ionicons 
                    name={isPerforming === "working" ? 'checkmark-circle' : 'alert-circle'} 
                    size={24} 
                    color={isPerforming === "working" ? '#4CAF50' : '#FF0000'} 
                />
            </Pressable>
        );
    };

    if (loading) return null;
    if (!station) return null;

    // Find the latest note among all equipment
    const allNotes = station.equipments.flatMap(eq => eq.notes || []);
    const latestNote = allNotes.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.stationName}>{station.name}</Text>
                <Text style={styles.lastVisit}>
                    Last visit: {latestNote ? latestNote.Date.toDate().toDateString() : 'No visits yet'} 
                    {latestNote ? ` by ${latestNote.user.split("@")[0].split(".").join(" ")}` : ''}
                </Text>
            </View>
            
            <ScrollView style={styles.equipmentList}>
                {station.equipments?.map(equipment => renderEquipmentStatus(equipment))}
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
    stationName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    lastVisit: {
        fontSize: 14,
        color: '#B0C4DE',
    },
    equipmentList: {
        flex: 1,
    },
    equipmentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
    },
    equipmentInfo: {
        flex: 1,
    },
    equipmentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a3875',
        marginBottom: 4,
    },
    equipmentStatus: {
        fontSize: 14,
    },
    lastNote: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontStyle: 'italic'
    }
});

export default StationDetails;
