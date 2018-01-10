/**
 * caption generator
 * @flow
 */

import React, { Component } from 'react';
import ApplicationContainer from './containers/ApplicationContainer';
import ImagePicker from 'react-native-image-picker';
import NavigationView  from './components/NavigationView';
import ImageView from './components/ImageView';
import CaptionView from './components/CaptionView';
import ToolBarView from './components/ToolBarView';
import styles from './styles';
import c from './constants';
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
    render() {
        return (
            <ApplicationContainer render={(state, actions) => (
                <DrawerLayoutAndroid
                    ref={'DRAWER'}
                    drawerWidth={c.DRAWER_WIDTH}
                    drawerPosition={DrawerLayoutAndroid.positions.Left}
                    drawerBackgroundColor={c.PURPLE}
                    onDrawerOpen={() => actions.onDrawerOpen()}
                    onDrawerClose={() => actions.onDrawerClose()}
                    renderNavigationView={() => {
                        return <NavigationView
                                    setActiveItem={(item) => actions.setActiveItem(item)}
                                    store={state.store}
                                    image={state.image} />
                    }}>
                    <View style={styles.container}>

                        <StatusBar backgroundColor={c.PURPLE} barStyle="light-content" />

                        <ToolbarAndroid
                            style={styles.toolbarAndroid}
                            titleColor={c.WHITE}
                            onActionSelected={() => actions.onActionSelected()}
                            title="cgen" />

                        <ImageView
                            image={state.image}
                            loading={state.appLoading} />

                        <CaptionView
                            selectedCaption={state.selectedCaption}
                            labels={state.labels}
                            captions={state.captions}
                            captionsLoading={state.captionsLoading}
                            onPressCaptionItem={() => actions.onPressCaptionItem()}
                            generateCaptions={(index) => actions.generateCaptions(index)}
                        />

                        <ToolBarView
                            showImagePicker={() => actions.showImagePicker()}
                            processImage={() => actions.processImage()}
                            onActionSelected={() => actions.onActionSelected()} />

                    </View>
                </DrawerLayoutAndroid>
            )}/>
        );
    }
}