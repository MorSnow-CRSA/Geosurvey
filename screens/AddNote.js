import React, { useState, useEffect } from 'react';
import {db, storage} from '../firestore';
import { doc, collection, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const AddReportScreen = ({ setBack, setPage, user, setModalContent }) => {
    const [stations, setStations] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [selectedStation, setSelectedStation] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [status, setStatus] = useState('working');
    const [equipmentComments, setEquipmentComments] = useState('');
    const [date, setDate] = useState(new Date());
    const [dataCollected, setDataCollected] = useState(false);
    const [stationComments, setStationComments] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [stationsDropdownVisible, setStationsDropdownVisible] = useState(false);
    const [equipmentsDropdownVisible, setEquipmentsDropdownVisible] = useState(false);
    const [images, setImages] = useState([]);
    const getStations = async () => {
        const querySnapshot = await getDocs(collection(db, "station"));
        const stationsList = [];
        querySnapshot.forEach((doc) => {
            stationsList.push({ id: doc.id, ...doc.data() });
        });
        setStations(stationsList);
        console.log("stationsList", stationsList);
    };

    const getEquipments = async () => {
        console.log("called with", selectedStation.id);
        if (!selectedStation.id) return;
        
        const docRef = doc(collection(db, "station"), selectedStation.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const equipmentData = docSnap.data().equipments || [];
            setEquipments(equipmentData.map(equipment => {
                return typeof equipment === 'string' 
                    ? { name: equipment } 
                    : equipment;
            }));
        } else {
            setEquipments([]);
        }
        console.log("equipments", equipments);
    };

    useEffect(() => {
        getStations();
        console.log(stations);
    }, []);

    useEffect(() => {
        if (selectedStation) {
            getEquipments();
        }
    }, [selectedStation]);

    setBack("stations");

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const formatDate = (date) => {
        if (date instanceof Date) {
            return date.toLocaleDateString();
        }
        return 'Select a date';
    };

    const handleWebDateTimeChange = (event) => {
        console.log(event.target.value);
        try {
            setDate(new Date(event.target.value));
        } catch (error) {
            console.error("Error setting date time: ", error);
        }
    };

    const handleSave = async () => {
        try {
            // Get reference to the station document
            const stationRef = doc(db, "station", selectedStation.id);
            const stationSnap = await getDoc(stationRef);

            if (stationSnap.exists()) {
                const stationData = stationSnap.data();
                const equipments = stationData.equipments || [];

                // Find the specific equipment by name
                const equipmentIndex = equipments.findIndex(eq => eq.name === selectedEquipment);

                if (equipmentIndex !== -1) {
                    // Initialize notes array if it doesn't exist
                    if (!equipments[equipmentIndex].notes) {
                        equipments[equipmentIndex].notes = [];
                    }

                    // Add new note to the equipment
                    equipments[equipmentIndex].notes.push({
                        status: status,
                        comment: equipmentComments,
                        date: date,
                        dataCollected: dataCollected,
                        user: user.email,
                        images: images,
                    });

                    // Update the document in Firestore
                    await updateDoc(stationRef, {
                        equipments: equipments
                    });

                    console.log("Note saved successfully");
                    // Optional: Clear form or show success message
                    setPage("Station");
                    setModalContent({"type": "success", "message": "Note saved successfully"});
                } else {
                    console.error("Equipment not found");
                }
            } else {
                console.error("Station document not found");
            }
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Station Report</Text>
        <Text style={styles.headerSubtitle}>
          Fill out the form to report an issue. Select the station, choose the instrument, and describe the identified problem.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setStationsDropdownVisible(!stationsDropdownVisible)}
          >
            <Text style={styles.dropdownText}>
              {selectedStation ? selectedStation.name : "Select Station"}
            </Text>
            <Ionicons 
              name={stationsDropdownVisible ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>

          {stationsDropdownVisible && (
            <ScrollView style={styles.dropdownList}>
              {stations.map((station, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedStation(station);
                    setStationsDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{station.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setEquipmentsDropdownVisible(!equipmentsDropdownVisible)}
          >
            <Text style={styles.dropdownText}>
              {selectedEquipment ? selectedEquipment : "Select Equipment"}
            </Text>
            <Ionicons 
              name={equipmentsDropdownVisible ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>

          {equipmentsDropdownVisible && (
            <ScrollView style={styles.dropdownList}>
              {equipments.map((equipment, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedEquipment(equipment.name);
                    setEquipmentsDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{equipment.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.statusContainer}>
          <TouchableOpacity 
            style={[styles.statusButton, status === 'working' && styles.statusButtonActive]}
            onPress={() => setStatus(status === 'working' ? '' : 'working')}>
            <Text style={[styles.statusText, status === 'working' && styles.statusTextActive]}>Working</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusButton, status === 'broken' && styles.statusButtonActive]}
            onPress={() => setStatus(status === 'broken' ? '' : 'broken')}>
            <Text style={[styles.statusText, status === 'broken' && styles.statusTextActive]}>Broken</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusButton, status === 'replaced' && styles.statusButtonActive]}
            onPress={() => setStatus(status === 'replaced' ? '' : 'replaced')}>
            <Text style={[styles.statusText, status === 'replaced' && styles.statusTextActive]}>Replaced</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusButton, status === 'defective' && styles.statusButtonActive]}
            onPress={() => setStatus(status === 'defective' ? '' : 'defective')}>
            <Text style={[styles.statusText, status === 'defective' && styles.statusTextActive]}>Defective</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusButton, status === 'other' && styles.statusButtonActive]}
            onPress={() => setStatus(status === 'other' ? '' : 'other')}>
            <Text style={[styles.statusText, status === 'other' && styles.statusTextActive]}>Other</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.textArea}
          placeholder="Provide comments on the instrument's state or any issues."
          multiline
          numberOfLines={4}
          value={equipmentComments}
          onChangeText={setEquipmentComments}
          placeholderTextColor="#666"
        />

        {Platform.OS === 'web' ? (
            <input
                type="date"
                value={date.toISOString().slice(0,10)}
                onChange={handleWebDateTimeChange}
                style={styles.input}
            /> 
        ) : Platform.OS === 'ios' ? (
            <DateTimePicker
                style={styles.input}
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
            />
        ) : (
            <>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={{ color: '#fff' }}>
                        {formatDate(date)}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
            </>
        )}

        <View style={styles.dataCollectedContainer}>
          <Text style={styles.dataCollectedText}>Did you collect data?</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={[styles.radioButton, dataCollected === true && styles.radioButtonActive]}
              onPress={() => setDataCollected(true)}>
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.radioButton, dataCollected === false && styles.radioButtonActive]}
              onPress={() => setDataCollected(false)}>
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.historyButton}>
            <Ionicons name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a3875',
  },
  header: {
    padding: 20,
    paddingTop: 40,
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
    lineHeight: 22,
  },
  form: {
    padding: 20,
    gap: 15,
  },
  dropdown: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#666',
    fontSize: 16,
  },
  instrumentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#82bada',
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#ffffff20',
  },
  statusButtonActive: {
    backgroundColor: '#82bada',
  },
  statusText: {
    color: '#fff',
  },
  statusTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  dataCollectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dataCollectedText: {
    color: 'white',
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  radioButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#ffffff20',
  },
  radioButtonActive: {
    backgroundColor: '#82bada',
  },
  radioText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4169E1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#82bada',
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    zIndex: 1000,
    elevation: 5,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'scroll',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownContainer: {
    zIndex: 1000,
    elevation: 1000,
    position: 'relative',
  },
});

export default AddReportScreen;