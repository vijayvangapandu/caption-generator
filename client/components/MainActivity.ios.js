/**
 * caption generator
 * @flow
 */

import React, { Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import ImageView from './ImageView';
import styles from '../styles.js';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    TabBarIOS,
    NavigatorIOS,
    AsyncStorage
} from 'react-native';
require('../utils/network-logger.js')();

export default class MainActivity extends Component<{}> {
    constructor(props) {
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
            drawrOpen: false,
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

    _loadCameraPhoto = () => {
        ImagePicker.launchCamera(
            this.pickerOptions, (response) =>
                this.props.processImagePickerResponse(response)
        );
    }
    _loadLibraryPhoto = () => {
        ImagePicker.launchImageLibrary(
            this.pickerOptions, (response) =>
                this.props.processImagePickerResponse(response)
        );
    }
    _showImagePicker = () => {
        ImagePicker.showImagePicker(
            this.pickerOptions, (response) =>
                this.props.processImagePickerResponse(response)
        );
    }

    render() {
        return (
            <View style={styles.container}>

                <ImageView
                    image={this.state.image}
                    loading={this.state.appLoading} />

                <TabBarIOS
                    tintColor={'#841584'}
                    unselectedItemTintColor={'#000'}>

                    <TabBarIOS.Item
                        systemIcon={'most-recent'}
                        selected={false}
                        onPress={() => console.log('tab bar tap')}>
                        <Text>library photos</Text>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        systemIcon={'recents'}
                        selected={false}
                        onPress={() => console.log('tab bar tap')}>
                        <Text>process image</Text>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        systemIcon={'search'}
                        selected={false}
                        onPress={() => this._showImagePicker()}>
                        <Text>show picker</Text>
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        systemIcon={'more'}
                        selected={false}
                        onPress={() => this.props.onActionSelected()}>
                        <Text>camera</Text>
                    </TabBarIOS.Item>
                </TabBarIOS>
            </View>
        );
    }
}
