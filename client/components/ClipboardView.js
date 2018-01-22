/**
 * Clipboard component
 * @flow
 */

import React, { Component } from 'react';
import c from '../constants';
import {
    View,
    Text,
    StyleSheet,
    Clipboard
} from 'react-native';

export default class ClipboardView extends Component<{}> {
    render() {
        return (
            <View style={styles.clipboardView}>
                <Text>Clipboard</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    clipboardView: {
        height:50,
        width: 50,
        backgroundColor: c.PURPLE
    }
});