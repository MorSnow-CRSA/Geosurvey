import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firestore'; // Adjust the import according to your project structure

const StationsScreen = ({ setPage, setBack, setStationId, params }) => {
    const [stations, setStations] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        setBack("home");
        fetchStations();

        if (params?.showSuccessPopup) {
            setPopupMessage("Station added successfully!");
            setShowPopup(true);
        } else if (params?.showErrorPopup) {
            setPopupMessage("Error adding station. Please try again.");
            setShowPopup(true);
        }
    }, [params, setBack]);

    const fetchStations = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "station"));
            const stationsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStations(stationsList);
        } catch (e) {
            console.error("Error fetching stations: ", e);
        }
    };

    const renderStation = ({ item }) => (
        <TouchableOpacity style={styles.stationCard} onPress={() => {setPage("StationDetails", { stationId: item.id }); setStationId(item.id)}}>
            <View style={{ alignSelf: 'center', width: '100%', height: '100px' }}>
                {item.image &&(
                    <Image
                    source={{ uri: item.image }}
                    style={{  width: '100%', height: '100%' }} 
                    resizeMode="contain" 
                    />
                )}
                
            </View>
            <View style={{ alignSelf: 'center', width: '100%'  }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>{item.name}</Text>
            </View>
        </TouchableOpacity>
        
    );

    return (
        <View style={styles.stationsContainer}>
            <TouchableOpacity style={styles.addButton} onPress={() => setPage("AddStation")}>
                <Text style={styles.addButtonText}>+ Add new station</Text>
            </TouchableOpacity>

            <FlatList
                data={stations}
                renderItem={renderStation}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContainer}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={showPopup}
                onRequestClose={() => setShowPopup(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{popupMessage}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowPopup(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    // ... your existing styles ...
    stationsContainer: {
        flex: 1,
        backgroundColor: '#2B2F77',
        padding: 20,
        width: '100%',
    },
    addButton: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#2B2F77',
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: 20,
    },
    row: {
        flex: 1,
        justifyContent: "space-between",
        marginBottom: 10,
    },
    stationCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        flex: 1,
        margin: 5,
        // height: 100,
    },
    stationImage: {
        width: '100%',
        height: '100%',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "#2B2F77",
        fontSize: 18
    },
    closeButton: {
        backgroundColor: "#2B2F77",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default StationsScreen;