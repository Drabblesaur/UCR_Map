import { Button, StyleSheet, Text, View, DeviceEventEmitter } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CommonActions } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet'; 
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DetailedViewSheet(props){
    console.log(props.route.params)
    const [userdata, setUserdata] = React.useState(null);
    const FavoriteHandler = (email, building) => {
        console.log(email);
        fetch('http://192.168.6.63:4000/addFavorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({
                email, //coming from userdata.email
                building, //coming from props.route.params.building.properties.building

            })
        })
            .then(res => res.json())
            .then(async data => {
                if (data.error) {
                    alert(data.error)
                }
                else if (data.message == "favorite added succesfully!") {
                    console.log('userdata from detailed sheet:', userdata);
                    alert(data.message);
                }
            })
            .catch(err => {
                alert(err)
            })
    }
    const loaddata = () => {
      AsyncStorage.getItem('user')
          .then(async (value) => {
              fetch('http://192.168.6.63:4000/userdata', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + JSON.parse(value).token
                  },
                  body: JSON.stringify({ email: JSON.parse(value).user.email })
              })
                  .then(res => res.json()).then(data => {
                      if (data.message == 'User Found') {
                          setUserdata(data.user)
  
                          
                      }
                      else {
                          alert('Login Again')
                          
                      }
                  })
                  .catch(err => {
                      
                      console.log('value1: ', value)
                  })
          })
          .catch(err => {
              
              console.log('value2: ', value)
          })
  }
  useEffect(() => {
      loaddata()
  }, [])
    return(
        <View style={
            {
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: 20,
                paddingTop: 10,
                paddingLeft:20,
                paddingRight:20,
                backgroundColor: props.route.params.sheetColor, 
            }
            }
        >
            <View style = {styles.header_container}>
                {/* Title Container*/}
                <View style = {styles.title_container}>
                    <Text style={{fontSize: 32, fontWeight: 'bold', color: 'white'}}>{props.route.params.building}</Text>
                </View>
                <TouchableWithoutFeedback onPress={() => {goBack(props);}}>
                    <Feather name="x-circle" size={32} color="white" />
                </TouchableWithoutFeedback>
            </View>
            {/* Display Room Text */}
            <View style={styles.room_container}>
                {displayRoomText(props.route.params)}
            </View>
            {/* Building Options */}
            <View style={styles.option_container}>
                <TouchableWithoutFeedback>
                    <View style={styles.option_walking}>
                        <FontAwesome5 name="walking" size={24} color="white" />
                        <Text style={{fontSize: 14, fontWeight: 'bold', color: 'white'}}>Walking</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.option_biking}>
                    <FontAwesome5 name="biking" size={24} color="black" />
                    <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}>Biking</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => FavoriteHandler(userdata.email, props.route.params.building)}>
                    <View style={styles.option_fav}>
                    <Feather name="star" size={24} color="black" />
                    <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}>Favorite</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            {/* Display Floor Buttons */}
            <View style={styles.header_container}>
            <Text style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>Floors</Text>
            </View>
            <View style={styles.floor_container}>
                {displayFloorButtons(props)}
            </View>
            <StatusBar/>
        </View>
    );
}

function displayRoomText(params) {
    if (params.type == "room") {
        return (<Text style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>Room {params.room}</Text>);
        return (<Text style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>Room {params.room}</Text>);
    }
    return;
}

function displayFloorButtons(props) { // Lists out buttons for each floor that can be displayed
    var a = []
    for (var i = 1; i <= props.route.params.floors; i++) {
        a[i-1] = i;
    }
    return a.map(i => {return (
        <TouchableWithoutFeedback 
        title = {`${i}`}
        key={`button-${i}`}
        onPress={() => {setMapFloorDisplay(props.route.params.building, i); console.log("pressed " + i);}}>
            <View style={styles.floorbuttons}>
            <Text style={{fontSize: 32, fontWeight: 'bold', color: 'white'}}>{i}</Text>
            </View>
        </TouchableWithoutFeedback>
        )});
    return a.map(i => {return (
        <TouchableWithoutFeedback 
        title = {`${i}`}
        key={`button-${i}`}
        onPress={() => {setMapFloorDisplay(props.route.params.building, i); console.log("pressed " + i);}}>
            <View style={styles.floorbuttons}>
            <Text style={{fontSize: 32, fontWeight: 'bold', color: 'white'}}>{i}</Text>
            </View>
        </TouchableWithoutFeedback>
        )});
}

function setMapFloorDisplay(buildingName, floor) { // Display building's floor on MapViewer
    // Toggle MapViewer's floor
    DeviceEventEmitter.emit("event.toggleOverlay", floor, buildingName);
    // Remove listeners
    DeviceEventEmitter.removeAllListeners("event.toggleOverlay");
}

function goBack(props) {
    resetMapViewer();
    // Go back to previous navigation screen
    props.navigation.dispatch(CommonActions.goBack());
}

function resetMapViewer() {
    // Toggle MapViewer's floor to empty set
    DeviceEventEmitter.emit("event.toggleOverlay", 0, "NULL");
    // Remove listeners
    DeviceEventEmitter.removeAllListeners("event.toggleOverlay");
}

const styles = StyleSheet.create({
    header_container:{
        flexDirection: 'row',
        // backgroundColor: 'white',
        width: '100%',
        justifyContent: 'space-between',
    
    },
    title_container:{
        width: '80%',
        //backgroundColor: 'green',
    },
    floor_container:{
        flexDirection: 'row',
        width: '100%',
        //backgroundColor: 'red',
    },
    floorbuttons:{
        backgroundColor: '#478BFF',
        margin: 5,
        width: 50,
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    room_container:{
        //backgroundColor: 'yellow',
        width: '100%',
    },
    option_container:{
        marginTop: 10,
        flexDirection: 'row',
        width: '100%',
        //backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    option_walking:{
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#478BFF',
        alignItems: 'center',
        flexDirection: 'column',
        width: 100,
    },
    option_biking:{
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'column',
        width: 100,
    },
    option_fav:{
        borderWidth: 3,
        borderColor: '#F0AF24',
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'column',
        width: 100,
    },
  });

export default DetailedViewSheet;