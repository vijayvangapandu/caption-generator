/**
 * caption generator
 * @flow
 */

import React, { Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import ImageView from './ImageView';
import CaptionView from './CaptionView';
import ToolBarView from './ToolBarView';
import styles from '../styles.js';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    TabBarIOS,
    ActivityIndicator,
    FlatList
} from 'react-native';
require('../utils/network-logger.js')();

export default class MainActivity extends Component<{}> {
    constructor(props) {
        super();
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
    showImagePicker = () => {
        ImagePicker.showImagePicker(
            this.pickerOptions, (response) =>
                this.props.processImagePickerResponse(response)
        );
    }

    render() {
        return (
            <View style={styles.container}>

                <ImageView
                    image={this.props.image}
                    loading={this.props.appLoading} />

                <CaptionView
                    selectedCaption={this.props.selectedCaption}
                    labels={this.props.labels}
                    captions={this.props.captions}
                    onPressCaptionItem={this.props.onPressCaptionItem}
                    captionsLoading={this.props.captionsLoading}
                    generateCaptions={(index) => this.props.generateCaptions(index)}
                />

                <ToolBarView
                    showImagePicker={this.showImagePicker}
                    processImage={this.processImage}
                    onActionSelected={this.props.onActionSelected}
                />
            </View>
        );
    }
}
