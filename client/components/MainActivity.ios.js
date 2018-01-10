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
                    showImagePicker={this.props.showImagePicker}
                    processImage={this.props.processImage}
                    onActionSelected={this.props.onActionSelected}
                    loadCameraPhoto={this.props.loadCameraPhoto}
                />
            </View>
        );
    }
}
