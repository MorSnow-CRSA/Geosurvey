import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Modal, Image, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firestore'; // Adjust the import according to your project structure
import { ActivityIndicator } from 'react-native';
const StationsScreen = ({ setPage, setBack, setStationId, navigationParams, setNavigationParams }) => {
    const [stations, setStations] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('success');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setBack("home");
        fetchStations();

        console.log("Received params:", navigationParams);

        if (navigationParams?.showSuccessPopup) {
            console.log("Should show success popup");
            setPopupMessage("Station added successfully!");
            setPopupType('success');
            setShowPopup(true);
        } else if (navigationParams?.showErrorPopup) {
            console.log("Should show error popup");
            setPopupMessage("Network error. Station will be added later.");
            setPopupType('error');
            setShowPopup(true);
        }
    }, [navigationParams, setBack]);

    useEffect(() => {
        if (!showPopup) {
            setNavigationParams({});
        }
    }, [showPopup, setNavigationParams]);

    const fetchStations = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "station"));
            const stationsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStations(stationsList);
            setLoading(false);
        } catch (e) {
            console.error("Error fetching stations: ", e);
        }
    };

    const renderStation = ({ item }) => (
        <Pressable style={styles.stationCard} onPress={() => {setPage("StationDetails", { stationId: item.id }); setStationId(item.id)}}>
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
        </Pressable>
        
    );

    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.stationsContainer}>
                    <Pressable style={styles.addButton} onPress={() => setPage("AddStation")}>
                        <Text style={styles.addButtonText}>+ Add new station</Text>
                    </Pressable>

                    {loading ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    ) : (
                        <FlatList
                            scrollEnabled={false}
                            data={stations}
                            renderItem={renderStation}
                            keyExtractor={item => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}
                </View>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={showPopup}
                onRequestClose={() => setShowPopup(false)}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, popupType === 'error' && styles.modalViewError]}>
                        <View style={[styles.iconContainer, popupType === 'error' ? styles.iconError : styles.iconSuccess]}>
                            <Text style={styles.icon}>{popupType === 'error' ? '!' : '✓'}</Text>
                        </View>
                        <Text style={[styles.modalText, popupType === 'error' && styles.modalTextError]}>
                            {popupMessage}
                        </Text>
                        <Pressable
                            style={[styles.closeButton, popupType === 'error' && styles.closeButtonError]}
                            onPress={() => setShowPopup(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    // ... your existing styles ...
    stationsContainer: {
        flex: 1,
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
        elevation: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50'
    },
    modalViewError: {
        borderLeftColor: '#ff5722'
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    iconSuccess: {
        backgroundColor: '#4CAF50'
    },
    iconError: {
        backgroundColor: '#ff5722'
    },
    icon: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "#4CAF50",
        fontSize: 18,
        fontWeight: '500'
    },
    modalTextError: {
        color: "#ff5722"
    },
    closeButton: {
        backgroundColor: "#4CAF50",
        borderRadius: 20,
        padding: 10,
        paddingHorizontal: 20,
        elevation: 2
    },
    closeButtonError: {
        backgroundColor: "#ff5722"
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default StationsScreen;