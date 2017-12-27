/**
 * MainActivity component
 * @flow
 */

import React, { Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import MainActivity from './components/MainActivity';
import NavigationView  from './components/NavigationView';
import DrawerLayout from 'react-native-drawer-layout-polyfill';
import styles from './styles';
import {
    StyleSheet,
    NavigatorIOS,
    View,
    Text,
    StatusBar
} from 'react-native';

export default class App extends Component<{}> {
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
            drawerOpen: false,
            store: []
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
    onActionSelected = () => {
        if (this.state.drawerOpen) {
            this.refs['DRAWER'].closeDrawer();
        }  else {
            this.refs['DRAWER'].openDrawer();
        }
    }
    render() {
        return (
            <DrawerLayout
                ref={'DRAWER'}
                drawerWidth={200}
                drawerPosition={DrawerLayout.positions.Left}
                drawerBackgroundColor={'#841584'}
                onDrawerOpen={(state) => this.setState({drawerOpen: true})}
                onDrawerClose={(state) => this.setState({drawerOpen: false})}
                renderNavigationView={() => {
                    return <NavigationView
                                setActiveItem={(item) => this.setActiveItem(item)}
                                store={this.state.store}
                                image={this.state.image} />
            }}>
            <StatusBar backgroundColor={"#841584"} barStyle={"light-content"} />
            <NavigatorIOS
                initialRoute={{
                    component: () => {
                        return <MainActivity
                            onActionSelected={()=> this.onActionSelected()}
                            processImagePickerResponse = {(response) =>
                                this.processImagePickerResponse(response)
                            }
                        />
                    },
                    barTintColor: '#841584',
                    title: 'cgen'
                }}
                style={{flex: 1}}
            />
            </DrawerLayout>
        );
    }
}
