import { StyleSheet, Platform } from 'react-native';
import c from './constants';
export default  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: c.WHITE,
    },
    toolbarAndroid: {
        height: 50,
        backgroundColor: c.PURPLE
    },
    storeView: {
        flexDirection: 'column',
        backgroundColor: c.PURPLE
    },
    storeViewCell: {
        padding: 5,
        width: '100%',
        alignItems: 'center',
        backgroundColor: c.PURPLE,
    },
    storeViewLoadingCell: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    storeViewImage: {
        width: 150,
        height: 150,
        borderRadius: 3,
        borderWidth: 1
    },
    storeViewText: {
        color: c.WHITE,
        fontSize: 12,
        backgroundColor: c.PURPLE,
        fontWeight: 'bold',
        marginTop: 3
    },
    storeViewCellActive: {
        backgroundColor: c.GREEN
    },
    introView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    introViewInner: {
        width: 300,
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 0,
        borderWidth: 3,
        borderRadius: 3,
        borderColor: c.PURPLE,
        marginTop: 50
    },
    modalTitle: {
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 16
    },
    modalText: {
        marginBottom: 15
    },
    imageView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222',
        position: 'relative'
    },
    imageComponent:{
        width: 275,
        height: 185,
        resizeMode: 'contain'
    },
    modalView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    modalViewInner: {
        backgroundColor: c.WHITE,
        width: 300,
        padding: 15,
        borderWidth: 3,
        borderRadius: 3,
        borderColor: c.PURPLE,
        flex: -1
    },
    button: {
        height: 150
    },
    toolbarView: {
        marginTop: 'auto',
        paddingTop: 5,
        marginBottom: 0,
        flex:0,
        paddingTop: 15,
        paddingBottom: 8,
        backgroundColor: c.PURPLE
    },
    toolBarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    row: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom:10
    },
    navigationView: {
        paddingTop: 10,
        paddingLeft: 0,
        paddingBottom: 90
    },
    navigationViewTitle: {
        color: c.WHITE,
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'right',
        marginRight: 20,
        ...Platform.select({
            ios: {
                marginTop: 10
            },
            android: {
                marginTop: 0
            }
        })
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    },
    swiperViewSlide: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200
    },
    heroContainer: {
        marginTop: 0
    },
    headerView: {
        backgroundColor: c.PURPLE,
        paddingTop: 30,
        paddingBottom: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        color: c.WHITE,
        fontWeight: 'bold',
        fontSize: 18
    }
});
