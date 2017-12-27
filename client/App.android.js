/**
 * caption generator
 * @flow
 */

import React, { Component } from 'react';
import { Map } from 'immutable';
import ImagePicker from 'react-native-image-picker';
import NavigationView  from './components/NavigationView';
import ImageView from './components/ImageView';
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
    asyncPurgeStore = async (key: string) => {
        try {
            await AsyncStorage.removeItem((key, error) => {
                if (error) {
                    console.warn('purge store error', error);
                } else {
                    this.forceUpdate();
                }
            })
        } catch (error) {
            console.warn('purge store error', error);
        }
    }
    asycnMultiGet = async () => {
        try {
            await AsyncStorage.getAllKeys((error, keys) => {
                AsyncStorage.multiGet(keys, (error, stores) => {
                    store = stores.map((store) => {
                        return JSON.parse(store[1])
                    });
                    this.setState({store});
                });
                if (keys.length >= 5) {
                    this.asyncPurgeStore(keys[5]);
                }
            });
        } catch (error) {
            console.warn('async multi get error', error);
        }
    }
    componentWillMount() {
        // AsyncStorage.clear((error)=> {
        //     console.log(error);
        // });
        this.asycnMultiGet();
    }
    asyncStoreData = async () => {
        try {
            await AsyncStorage.setItem(this.state.image.fileName, JSON.stringify({
                timestamp: new Date().getTime(),
                data: this.state.image.data,
                fileName: this.state.image.fileName,
                type: this.state.image.imagetype,
                captions: this.state.captions,
                labels: this.state.labels
            }));
        } catch (error) {
            console.warn('error saving data', error);
        }
    }
    setSelectedImage(imgData: string) {
        console.log('pressed', imgData);
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
        fetch('http://192.168.0.7:3001/api/v1/process', {
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
            }, () => {
                this.asyncStoreData()
                    .then(() => this.asycnMultiGet());
            });
        })
        .catch((error)=> console.warn('network error', error));
    }
    generateCaptions(index) {
        this.setState({
            captionsLoading: true,
            selectedCaption: index
        });
        fetch('http://192.168.0.7:3001/api/v1/captions', {
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
    _onPressCaptionItem(id) {
        this.state.captions.forEach((item) => {
            if (id === item.id) {
                Clipboard.setString(this.state.captions[id].text);
                ToastAndroid.show('Copied!', ToastAndroid.SHORT);
            }
        });
    }
    _onActionSelected = () => {
        if (this.state.drawerOpen) {
            this.refs['DRAWER'].closeDrawer();
        }  else {
            this.refs['DRAWER'].openDrawer();
        }
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
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {alert("Modal has been closed.")}}>
                <View style={styles.modalView}>
                    <View style={styles.modalViewInner}>
                        <View>
                            <Text style={styles.modalTitle}>caption generator</Text>
                            <Text>1) choose an image</Text>
                            <Text>2) process the image</Text>
                            <Text>3) tap a caption to copy it</Text>
                            <Text style={styles.modalText}>4) profit</Text>
                            <Button
                                onPress={() => this.setModalVisible(!this.state.modalVisible)}
                                style={[styles.button]}
                                title="Got It!"
                                color="#841584"
                                accessibilityLabel="close modal" />
                        </View>
                    </View>
                </View>
            </Modal>
            <StatusBar backgroundColor="#841584" barStyle="light-content" />
            <ToolbarAndroid
                style={styles.toolbarAndroid}
                titleColor="#fff"
                actions={[{title: 'Photos', show: 'always'}]}
                onActionSelected={() => this._onActionSelected()}
                title="cgen" />
            <ImageView
                image={this.state.iamge}
                loading={this.state.appLoading} />
            <View>
                    {!!this.state.labels && <View style={styles.labelView}>
                        {!!this.state.labels && this.state.labels.map((label, i) => (
                            <Text
                                key={i}
                                style={styles.labelText}
                                onPress={() => this.generateCaptions(i)}
                                style={[styles.labelText, this.state.selectedCaption === i ? styles.labelTextActive : null]}>
                            {label}
                            </Text>
                        ))}
                    </View>}
                    {!!this.state.captions.length && <View style={styles.captionView}>
                        {!!this.state.captionsLoading ? (
                            <ActivityIndicator size="small" color="#841584" />
                        ) : (
                            <FlatList
                                data={this.state.captions}
                                extraData={this.state}
                                keyExtractor={(item) => item.id}
                                onPressItem={(item) => this._onPressCaptionItem(item.id)}
                                renderItem={({item}) => (
                                    <Text
                                        onPress={() => this._onPressCaptionItem(item.id)}
                                        style={styles.caption}>{item.text}</Text>
                            )} />
                        )}
                    </View>}
            </View>
                <View style={styles.toolbarView}>
                    <View style={styles.row}>
                        <Button
                            style={styles.button}
                            _onPress={() => this.setModalVisible(true)}
                            title="Show Modal"
                            color="#841584"
                            accessibilityLabel="show modal dialog" />
                        <Button
                            style={styles.button}
                            onPress={() => this.loadLibraryPhoto()}
                            title="Library Photos"
                            color="#841584"
                            accessibilityLabel="load photos from library" />
                    </View>
                    <View style={styles.row}>
                        <Button
                            style={styles.button}
                            onPress={() => this.loadCameraPhoto()}
                            title="Camera Photos"
                            color="#841584"
                            accessibilityLabel="load photos from camera" />
                        <Button
                            style={styles.button}
                            onPress={() => this.showImagePicker()}
                            title="Show Picker"
                            color="#841584"
                            accessibilityLabel="show image picker" />
                        <Button
                            style={styles.button}
                            onPress={() => this.processImage()}
                            title="Process Image"
                            color="#841584"
                            accessibilityLabel="process current image" />
                    </View>
                </View>
            </View>
            </DrawerLayoutAndroid>
        );
    }
}