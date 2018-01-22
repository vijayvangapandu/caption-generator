/**
 * CaptionView component
 * @flow
 */

import React, { Component } from 'react';
import CarouselView from './CarouselView';
import ClipboardView from './ClipboardView';
import c from '../constants';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Platform
} from 'react-native';

export default class CaptionView extends Component<{}> {
    constructor(props) {
        super(props);
    }
    render () {
        let {
            labels,
            generateCaptions,
            selectedCaption,
            captions,
            captionsLoading,
            onPressCaptionItem
        } = this.props;
        return (
            <View>
                {!!labels && <View style={styles.labelView}>
                    {!!labels && labels.map((label, i) => (
                        <Text
                            key={i}
                            style={styles.labelText}
                            onPress={() => this.props.generateCaptions(i)}
                            style={[styles.labelText, selectedCaption === i ? styles.labelTextActive : null]}>
                            {label}
                        </Text>
                    ))}
                </View>}
                {!!captions.length && <View style={[styles.captionView, captionsLoading ? styles.captionViewLoading : null]}>
                    {<View style={styles.captionViewInner}>
                        {!!captionsLoading ? (
                            <ActivityIndicator size="small" color={c.PURPLE} />
                        ) : (
                            <CarouselView
                                captions={captions}
                                onPressCaptionItem={(item) => onPressCaptionItem(item)} />
                        )}
                    </View>}
                    <ClipboardView />
                </View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    labelView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    labelText: {
        backgroundColor: c.WHITE,
        borderWidth: 3,
        borderColor: c.PURPLE,
        color: c.PURPLE,
        marginHorizontal: 5,
        marginBottom: 8,
        ...Platform.select({
            ios: {
                borderRadius:10,
                padding: 5
            },
            android: {
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                paddingLeft: 13,
                paddingRight: 5,
                paddingTop: 7,
                paddingBottom: 3,
            }
        })
    },
    labelTextActive: {
        borderColor: c.GREEN,
        color: c.GREEN,
    },
    captionView: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        flexGrow: 1,
        paddingBottom: 10,
        paddingRight:10
    },
    captionViewInner: {
        flexGrow: 1,
    },
    captionViewLoading: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 215
    }
});