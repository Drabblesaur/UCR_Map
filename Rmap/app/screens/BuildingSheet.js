
import React, {useState, useEffect} from 'react';
import { Button, StyleSheet, Text, View,Keyboard,ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CommonActions } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather'; 
import { TouchableWithoutFeedback, BottomSheetTextInput, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import ItemButton from '../components/ItemButton';
import { zoomInto } from '../screens/MapViewer'

function BuildingSheet(props){

    const [searchTerm, setSearchTerm] = useState('');
    const [buildingData, setBuildingData] = useState([]);

    const handleFocus = () => {
        console.log("focused search bar");
    }

    const handleItemPress = (building) => {
        zoomInto(building);
      }

    const handleSearch = async (term) => {
        try {
          const response = await fetch(`http://192.168.6.63:4000/buildingData/${term}`);

          const data = await response.json();
          setBuildingData(data);
        } catch (error) {
          console.log(error);
        }
      }
    useEffect(() => {
        const fetchInitialData = async () => {
          try {

            const response = await fetch(`http://192.168.6.63:4000/buildingData?limit=5`);
            const data = await response.json();
            setBuildingData(data);
          } catch (error) {
            console.log(error);
          }
        }
        fetchInitialData();
    }, []);

      return(
        <View style={styles.container}>
          {/* Title & Back Button*/}
          <View style={styles.menu_container}>
            <Text style={{fontSize: 32, fontWeight: 'bold', color: 'white'}}>Buildings</Text>
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); props.navigation.dispatch(CommonActions.goBack());}}>
              <Feather name="x-circle" size={32} color="white" />
            </TouchableWithoutFeedback>
          </View>
          <BottomSheetTextInput 
            style={styles.searchBar} 
            placeholder="Search"
            onFocus={() => {handleFocus();}}
            onChangeText={(text) => {setSearchTerm(text);}}
            onSubmitEditing={() => {handleSearch(searchTerm);}}
          />
          {/* Display search results */}
          <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
            {buildingData.map((building) => {
                return (
                    <ItemButton 
                        key={building._id} 
                        title={building.properties.building}
                        backgroundColor="#E6FCE3" 
                        subtitle="0.5 mi" // You can replace this with the actual distance if you have that data
                        onPress={() => {handleItemPress(building)}}
                    />
                );
            })}
        </BottomSheetScrollView>
        </View>
      );
    
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft:20,
        paddingRight:20,
        //backgroundColor: 'lightgrey',
        },
    menu_container:{ 
        flexDirection: 'row',
        // backgroundColor: 'white',
        width: '100%',
        justifyContent: 'space-between',
    },
    searchBar: {
        marginTop: 10,
        flexDirection: 'row',
        height: 33,
        width: '100%',
        backgroundColor: '#E7E7E7',
        borderRadius: 10,
        alignItems: 'center',
        paddingLeft: 10,
      },
      contentContainer: {
        width: '100%',
        flexDirection: 'column',
        //backgroundColor: "white",
      },
});

export default BuildingSheet;