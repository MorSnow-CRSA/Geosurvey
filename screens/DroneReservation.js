import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firestore';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { sendEmail } from './Email';

const DroneReservation = ({setPage, setBack, user, setModalContent}) => {
    setBack("home")
    const [drones, setDrones] = useState([]);
    const [selectedDrone, setSelectedDrone] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [subject, setSubject] = useState('');
    const [markedDates, setMarkedDates] = useState({});

    // Fetch drones for dropdown
    useEffect(() => {
        const fetchDrones = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'drone'));
                const dronesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    managers: doc.data().managers || [],
                    reservations: doc.data().reservations || []
                }));
                setDrones(dronesList);
            } catch (error) {
                console.error("Error fetching drones:", error);
            }
        };
        fetchDrones();
    }, []);

    // Update marked dates when drone is selected or date range changes
    useEffect(() => {
        const newMarkedDates = {};
        
        // Add existing reservations
        if (selectedDrone) {
            selectedDrone.reservations.forEach(reservation => {
                newMarkedDates[reservation.date] = { 
                    marked: true, 
                    dotColor: 'orange' 
                };
            });
        }

        // Add selected range
        if (dateRange.startDate && dateRange.endDate) {
            const start = new Date(dateRange.startDate);
            const end = new Date(dateRange.endDate);

            for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
                const dateString = date.toISOString().split('T')[0];
                newMarkedDates[dateString] = {
                    ...newMarkedDates[dateString],
                    selected: true,
                    startingDay: dateString === dateRange.startDate,
                    endingDay: dateString === dateRange.endDate,
                    color: '#1a3875',
                };
            }
        }

        setMarkedDates(newMarkedDates);
    }, [selectedDrone, dateRange]);

    const handleDayPress = (day) => {
        if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
            // Start new range
            setDateRange({
                startDate: day.dateString,
                endDate: ''
            });
        } else {
            // Complete the range
            if (new Date(day.dateString) < new Date(dateRange.startDate)) {
                setDateRange({
                    startDate: day.dateString,
                    endDate: dateRange.startDate
                });
            } else {
                setDateRange({
                    ...dateRange,
                    endDate: day.dateString
                });
            }
        }
    };

    

    const handleSubmit = () => {
        if (!selectedDrone) return;

        const droneSnapshot = doc(db, 'drone', selectedDrone.id);
        
        // Handle everything in the background
        Promise.all([
            getDoc(droneSnapshot).then(droneDoc => {
                const currentReservations = droneDoc.data().reservations || [];
                const newReservation = {
                    from_date: dateRange.startDate,
                    to_date: dateRange.endDate,
                    subject: subject,
                    user: user.email,
                    approved: false,
                };
                
                return updateDoc(droneSnapshot, { 
                    reservations: [...currentReservations, newReservation]
                });
            }),
            ...selectedDrone.managers.map(manager => 
                sendEmail(manager, selectedDrone.name, user.email, dateRange.startDate, dateRange.endDate, subject)
            )
        ]).catch(error => {
            console.error("Background operations error:", error);
            setModalContent({'type':'error', 'message':'You are offline, the request will be sent when you are online'});
            setPage("home");
        });
        
        // Execute immediately
        setModalContent({'type':'success', 'message':'reservation request sent successfully'})
        setPage("home");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Drone reservation</Text>
            </View>

            {/* Drone Selector Dropdown */}
            <View style={styles.dropdownContainer}>
                <TouchableOpacity 
                    style={styles.dropdown}
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                >
                    <Text style={styles.dropdownText}>
                        {selectedDrone ? selectedDrone.name : "Select Drone"}
                    </Text>
                    <Ionicons 
                        name={dropdownVisible ? "chevron-up" : "chevron-down"} 
                        size={24} 
                        color="#1a3875" 
                    />
                </TouchableOpacity>

                {dropdownVisible && (
                    <View style={styles.dropdownListContainer}>
                        <ScrollView 
                            style={styles.dropdownList}
                            nestedScrollEnabled={true}
                        >
                            {drones.map((drone) => (
                                <TouchableOpacity 
                                    key={drone.id}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setSelectedDrone(drone);
                                        setDropdownVisible(false);
                                    }}
                                >
                                    <Text style={styles.dropdownItemText}>{drone.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* Calendar */}
            <View style={styles.calendarContainer}>
                <Calendar
                    onDayPress={handleDayPress}
                    markedDates={markedDates}
                    markingType={'period'}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#1a3875',
                        selectedDayBackgroundColor: '#1a3875',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#1a3875',
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                        dotColor: 'orange',
                        selectedDotColor: '#ffffff',
                        arrowColor: '#1a3875',
                        monthTextColor: '#1a3875',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16
                    }}
                />
            </View>

            {/* Subject Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Subject of reservation"
                    value={subject}
                    onChangeText={setSubject}
                    multiline
                />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
            >
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
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
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    dropdownContainer: {
        position: 'relative',
        zIndex: 1000,
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        color: '#1a3875',
        fontSize: 16,
    },
    dropdownListContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 10,
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
    },
    dropdownList: {
        width: '100%',
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownItemText: {
        color: '#1a3875',
        fontSize: 16,
    },
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    inputContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    input: {
        fontSize: 16,
        color: '#1a3875',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#4169e1',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateRangeContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    dateRangeText: {
        color: 'white',
        fontSize: 14,
        lineHeight: 20,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20, // Add padding at the bottom for better scrolling
    },
});

export default DroneReservation; 