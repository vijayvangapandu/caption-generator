/**
 * caption generator
 * @flow
 */

import React, { Component } from 'react';
import { Map } from 'immutable';
import ImagePicker from 'react-native-image-picker';
import NavigationView  from './components/NavigationView';
import ImageView from './components/ImageView';
import CaptionView from './components/CaptionView';
import ToolBarView from './components/ToolBarView';
import styles from './styles';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    Image,
    AsyncStorage,
    FlatList,
    Clipboard,
    ToastAndroid,
    StatusBar,
    ToolbarAndroid,
    ActivityIndicator,
    TouchableHighlight,
    DrawerLayoutAndroid,
    Modal
} from 'react-native';
require('./utils/network-logger.js')();

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uri: null,
            image: {
                data: null,
                fileName: null,
                type: null
            },
            captions: [],
            labels: [],
            appLoading: false,
            captionsLoading: false,
            selectedCaption: 0,
            modalVisible: false,
            drawerOpen: false,
            store: []
        }
        this.pickerOptions = {
            title: 'Photo Picker',
            takePhotoButtonTitle: 'Take Photo...',
            chooseFromLibraryButtonTitle: 'Choose from Library...',
            maxWidth: 500,
            maxHeight: 500,
            aspectX: 2,
            aspectY: 1,
            storageOptions: {
                skipBackup: true
            }
        }
    }
    processImagePickerResponse(response) {
        console.log('Response = ', response);

        if (response.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        }
        else {
            let image = {
                type: response.type,
                fileName: response.fileName,
                data: `data:image/jpeg;base64,${response.data}`
            };
            this.setState({image});
        }
    }
    loadCameraPhoto() {
        ImagePicker.launchCamera(
            this.pickerOptions, (response) => this.processImagePickerResponse(response)
        );
    }
    loadLibraryPhoto() {
        ImagePicker.launchImageLibrary(
            this.pickerOptions, (response) => this.processImagePickerResponse(response)
        );
    }
    showImagePicker() {
        ImagePicker.showImagePicker(
            this.pickerOptions, (response) => this.processImagePickerResponse(response)
        );
    }
    processImage() {
        this.setState({appLoading:true});
        fetch('http://192.168.0.5:3001/api/v1/process', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.state.image.fileName,
                type: this.state.image.type,
                dataURL: this.state.image.data
            })
        })
        .then((raw) => raw.json())
        .then((json) => {
            this.setState({
                appLoading:false,
                captions: json.captions,
                labels: json.labels
            });
        })
        .catch((error)=> console.warn('network error', error));
    }
    generateCaptions(index) {
        this.setState({
            captionsLoading: true,
            selectedCaption: index
        });
        fetch('http://192.168.0.5:3001/api/v1/captions', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                label: this.state.labels[index]
            })
        })
        .then((raw) => raw.json())
        .then((response) => {
            this.setState({
                captionsLoading: false,
                captions: response.captions
            });
        })
        .catch((error)=> console.warn('network error', error));
    }
    _setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    setActiveItem = (item) => {
        let image = {
            data: item.data,
            fileName: item.fileName,
            type: 'img/jpg'
            //@TODO get actual image type
        };
        this.setState({
            image,
            captions: item.captions,
            labels: item.labels
        });
    }
    onPressCaptionItem(id) {
        this.state.captions.forEach((item) => {
            if (id === item.id) {
                Clipboard.setString(this.state.captions[id].text);
                ToastAndroid.show('Copied!', ToastAndroid.SHORT);
            }
        });
    }
    onActionSelected = () => {
        if (this.state.drawerOpen) {
            this.refs['DRAWER'].closeDrawer();
        }  else {
            this.refs['DRAWER'].openDrawer();
        }
    }
    componentWillMount() {
        this.setState({
            store: require('./mock/mock_data.js')
        })
    }
    render() {
        return (
            <DrawerLayoutAndroid
                ref={'DRAWER'}
                drawerWidth={200}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                drawerBackgroundColor={'#841584'}
                onDrawerOpen={(state) => this.setState({drawerOpen: true})}
                onDrawerClose={(state) => this.setState({drawerOpen: false})}
                renderNavigationView={() => {
                    return <NavigationView
                                setActiveItem={(item) => this.setActiveItem(item)}
                                store={this.state.store}
                                image={this.state.image} />
                }}>
            <View style={styles.container}>

                <StatusBar backgroundColor="#841584" barStyle="light-content" />

                <ToolbarAndroid
                    style={styles.toolbarAndroid}
                    titleColor="#fff"
                    onActionSelected={() => this.onActionSelected()}
                    title="cgen" />

                <ImageView
                    image={this.state.image}
                    loading={this.state.appLoading} />

                <CaptionView
                    selectedCaption={this.state.selectedCaption}
                    labels={this.state.labels}
                    captions={this.state.captions}
                    onPressCaptionItem={this.state.onPressCaptionItem}
                    captionsLoading={this.state.captionsLoading} />

                <ToolBarView
                    showImagePicker={this.showImagePicker}
                    processImage={this.processImage}
                    onActionSelected={this.onActionSelected} />

            </View>
            </DrawerLayoutAndroid>
        );
    } 
}