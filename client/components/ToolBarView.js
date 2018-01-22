/**
 * ToolBar component
 * @flow
 */

import React, { Component } from 'react';
import styles from '../styles';
import {
    View,
    Text,
    Button,
    TouchableOpacity
} from 'react-native';

export default class ToolBarView extends Component<{}> {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <View style={styles.toolbarView}>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => this.props.loadCameraPhoto()}>
                        <Text style={styles.toolBarText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.showImagePicker()}>
                        <Text style={styles.toolBarText}>Pick</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.copyText()}>
                        <Text style={styles.toolBarText}>Copy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.onActionSelected()}>
                        <Text style={styles.toolBarText}>Recent</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}