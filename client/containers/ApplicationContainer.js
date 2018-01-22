/**
 * caption generator
 * @flow
 */

import React, { Component } from 'react';
import { Map } from 'immutable';
import ImagePicker from 'react-native-image-picker';
require('../utils/network-logger.js')();

export default class ApplicationContainer extends Component {
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
    componentWillMount() {
        this.setState({
            store: require('../mock/mock_data.js')
        });
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
            this.processImage(image);
        }
    }
    loadCameraPhoto = () => {
        ImagePicker.launchCamera(
            this.pickerOptions, (response) =>
                this.processImagePickerResponse(response)
        );
    }
    loadLibraryPhoto = () => {
        ImagePicker.launchImageLibrary(
            this.pickerOptions, (response) =>
                this.processImagePickerResponse(response)
        );
    }
    showImagePicker = () => {
        ImagePicker.showImagePicker(
            this.pickerOptions, (response) =>
                this.processImagePickerResponse(response)
        );
    }
    setActiveItem = (item) => {
        let image = {
            data: item.data,
            fileName: item.fileName,
            type: 'img/jpg'
        };
        this.setState({
            image,
            captions: item.captions,
            labels: item.labels,
            selectedCaption: 0
        });
        this.forceUpdate();
    }
    processImage = (image) => {
        this.setState({
            image,
            appLoading:true
        });
        return fetch('http://localhost:3001/api/v1/process-image', {
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
        .catch((error)=> {
            console.warn('network error', error)
        });
    }
    generateCaptions = (index) => {
        this.setState({
            captionsLoading: true,
            selectedCaption: index
        });
        fetch('http://localhost:3001/api/v1/generate-captions', {
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
        .then((captions) => {
            this.setState({
                captionsLoading: false,
                captions
            });
        })
        .catch((error)=> console.warn('network error', error));
    }
    copyText = () => {
        console.log('tapped');
    }
    onActionSelected = () => {
        if (this.state.drawerOpen) {
            this.refs['DRAWER'].closeDrawer();
        }  else {
            this.refs['DRAWER'].openDrawer();
        }
    }
    onDrawerOpen = () => {
        this.setState({drawerOpen:true});
    }
    onDrawerClose = () => {
        this.setState({drawerOpen:false});
    }
    onPressCaptionItem = (item) => {
        console.log('caption pressed', item);
    }
    render() {
        return this.props.render(
            this.state,
            {
                onActionSelected: this.onActionSelected,
                onDrawerOpen: this.onDrawerOpen,
                onDrawerClose: this.onDrawerClose,
                generateCaptions: this.generateCaptions,
                setActiveItem: this.setActiveItem,
                showImagePicker: this.showImagePicker,
                loadCameraPhoto: this.loadCameraPhoto,
                copyText: this.copyText,
                onPressCaptionItem: this.onPressCaptionItem
            }
        );
    }
}