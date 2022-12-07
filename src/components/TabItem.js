import React from 'react'
import { TouchableOpacity, Image, Text, TouchableHighlight, View, Platform } from 'react-native'
import { ms, mvs, s, vs } from 'react-native-size-matters';
import { SvgXml } from 'react-native-svg';
import { DrawerActions } from '@react-navigation/native';

import { Tab1, Tab2, Tab3, Tab4, Tab5 } from '../icons/SvgIcons/Index';
import { Colors, Font } from '../Provider/Colorsfont';
import { config } from '../Provider/configProvider';

const TabItemSimple = ({ navigation, icon, path, index, activeIndex, reset = false, title }) => {


    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={(reset && index != 4) ? () => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: path }],
                })
            } :
                () => {
                    // navigation.toggleDrawer();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: path }],
                    })
                    // navigation.dispatch(DrawerActions.toggleDrawer());

                }} style={[{
                    flex: (config.language === 1 ? 1 : (index === 0 || index === 3 || index === 4) ? 0.18 : 0.23),
                    paddingTop: vs(9),
                    alignItems: 'center',
                    backgroundColor: index === activeIndex ? Colors.tabBackground : 'transparent'
                }]}>
                    
            <SvgXml xml={
                index === 0 ?
                    `<svg xmlns="http://www.w3.org/2000/svg" width="17.352" height="18.363" viewBox="0 0 17.352 18.363">
                    <path id="Home_Icon" d="M18396.547,17303.666h-16.137a.666.666,0,0,1-.434-.176.651.651,0,0,1-.176-.436v-10.781a.521.521,0,0,1,.051-.244l.01-.014a.609.609,0,0,1,.16-.207l8.076-6.373a.605.605,0,0,1,.379-.133.634.634,0,0,1,.379.133l8.07,6.363,0,.01a.557.557,0,0,1,.168.207l0,.014a.478.478,0,0,1,.051.244v10.781a.6.6,0,0,1-.605.611Zm-8.07-16.973-7.3,5.762-.152.119v9.871h14.918v-9.871Zm0,12.936a4.643,4.643,0,0,1-3.283-1.352,4.7,4.7,0,0,1-1.344-2.891h1.225a3.437,3.437,0,0,0,3.4,3.023,3.429,3.429,0,0,0,3.4-3.023h1.225a4.633,4.633,0,0,1-4.627,4.242Z" transform="translate(-18379.801 -17285.303)" fill=${index === activeIndex ? Colors.Theme : Colors.inActiveTab}/>
                    </svg>`
                    : index === 1 ?
                        `<svg xmlns="http://www.w3.org/2000/svg" width="18.781" height="18.781" viewBox="0 0 18.781 18.781">
                    <g id="Appointment_Icon" transform="translate(-2.1 -2.102)">
                    <path id="Subtraction_35" data-name="Subtraction 35" d="M18318,17304.2h-14.914a1.939,1.939,0,0,1-1.936-1.936V17288.7a1.939,1.939,0,0,1,1.936-1.936h2.809v-.777a.579.579,0,0,1,1.158,0v.777h6.98v-.777a.577.577,0,0,1,1.154,0v.777H18318a1.937,1.937,0,0,1,1.932,1.936v13.559A1.937,1.937,0,0,1,18318,17304.2Zm-15.691-12.2v10.268a.777.777,0,0,0,.777.777H18318a.777.777,0,0,0,.777-.777v-10.266h-16.469Zm.777-4.068a.777.777,0,0,0-.777.777v2.133h16.469v-2.133a.777.777,0,0,0-.777-.777Z" transform="translate(-18299.055 -17283.313)" fill=${index === activeIndex ? Colors.Theme : Colors.inActiveTab}/>
                    <path id="Path_11821" data-name="Path 11821" d="M16.758,15.15l-4.114,3.526-1.532-1.531a.653.653,0,1,0-.923.923l1.959,1.959a.653.653,0,0,0,.886.034L17.6,16.143a.653.653,0,1,0-.849-.991Z" transform="translate(-2.426 -4.05)" fill=${index === activeIndex ? Colors.Theme : Colors.inActiveTab}/>
                    </g>
                    </svg>`
                        : index === 2 ?
                            `<svg xmlns="http://www.w3.org/2000/svg" width="23.203" height="20" viewBox="0 0 23.203 20">
                    <g id="Consultation" transform="translate(-49.799 -78.752)">
                    <path id="Union_116" data-name="Union 116" d="M19.362,19.734l-1.612-1.612H13.105a1.555,1.555,0,0,1-1.557-1.551V13.266H8.359l-2.712,2.72a1.143,1.143,0,0,1-.787.33A1.134,1.134,0,0,1,3.73,15.19V13.266H2.179A2.183,2.183,0,0,1,0,11.089V2.179A2.183,2.183,0,0,1,2.179,0H16.041a2.181,2.181,0,0,1,2.175,2.179V9.522h3.43A1.557,1.557,0,0,1,23.2,11.073v5.5a1.557,1.557,0,0,1-1.557,1.551H20.9V19.1a.9.9,0,0,1-.553.835A.979.979,0,0,1,20,20,.888.888,0,0,1,19.362,19.734Zm-6.716-8.661v5.5a.453.453,0,0,0,.459.451h4.873a.54.54,0,0,1,.39.165l1.41,1.41.026-1.03a.548.548,0,0,1,.549-.545h1.292a.452.452,0,0,0,.455-.451v-5.5a.456.456,0,0,0-.455-.453h-8.54A.457.457,0,0,0,12.647,11.073ZM1.1,2.179v8.911a1.077,1.077,0,0,0,1.08,1.074h2.1a.553.553,0,0,1,.549.553V15.19c0,.01,0,.02.016.02s.01,0,.018-.006l2.879-2.873a.552.552,0,0,1,.386-.167h3.418v-1.09a1.555,1.555,0,0,1,1.557-1.551h4.016V2.179a1.086,1.086,0,0,0-1.08-1.08H2.183A1.084,1.084,0,0,0,1.1,2.179ZM14.333,15.57a.55.55,0,1,1,0-1.1H20.42a.55.55,0,0,1,0,1.1Zm0-2.392a.551.551,0,1,1,0-1.1H20.42a.551.551,0,0,1,0,1.1ZM8.2,10.888a.955.955,0,0,1-.95-.95V8.49H5.806a.953.953,0,0,1-.95-.95V5.73a.951.951,0,0,1,.95-.954H7.255V3.33a.953.953,0,0,1,.95-.952h1.807a.959.959,0,0,1,.958.952V4.776h1.44a.957.957,0,0,1,.958.954V7.54a.958.958,0,0,1-.958.95h-1.44V9.939a.961.961,0,0,1-.958.95ZM5.951,7.39H7.8a.553.553,0,0,1,.549.551V9.788H9.866V7.941a.554.554,0,0,1,.553-.551h1.845V5.879H10.419a.553.553,0,0,1-.553-.551V3.481H8.349V5.327a.552.552,0,0,1-.549.551H5.951Z" transform="translate(49.799 78.752)" fill=${index === activeIndex ? Colors.Theme : Colors.inActiveTab}/>
                    </g>
                    </svg>`
                            : index === 3 ?
                                `<svg xmlns="http://www.w3.org/2000/svg" width="17.426" height="20.23" viewBox="0 0 17.426 20.23">
                    <g id="Lab_Test_Icon" transform="translate(-35.483 0)">
                    <path id="Path_11809" data-name="Path 11809" d="M52.72,17.658l-5.4-10.843V1.185h.711a.593.593,0,0,0,0-1.185H40.364a.593.593,0,0,0,0,1.185h.711V6.815l-5.4,10.842a1.778,1.778,0,0,0,1.59,2.573H51.129A1.778,1.778,0,0,0,52.72,17.658ZM42.2,7.219a.593.593,0,0,0,.062-.264V1.185h3.872V6.954a.593.593,0,0,0,.062.264L48.13,11.1H45.956a1.856,1.856,0,0,0-3.519,0H40.263Zm2.67,4.477a.672.672,0,1,1-.672-.672A.672.672,0,0,1,44.868,11.7Zm6.261,7.349H37.263a.593.593,0,0,1-.53-.859l2.938-5.9h2.765a1.856,1.856,0,0,0,3.519,0H48.72l2.939,5.9A.593.593,0,0,1,51.129,19.045Z" transform="translate(0)" fill=${index === activeIndex ? Colors.Theme : Colors.inActiveTab}/>
                    <path id="Path_11810" data-name="Path 11810" d="M146.681,353a1.679,1.679,0,1,0,1.679,1.679A1.68,1.68,0,0,0,146.681,353Zm0,2.286a.607.607,0,1,1,.607-.607A.608.608,0,0,1,146.681,355.286Z" transform="translate(-105.079 -338.448)" fill=${index === activeIndex ? Colors.Theme : Colors.inActiveTab}/>
                    <path id="Path_11811" data-name="Path 11811" d="M290.072,353.432a.536.536,0,1,0-.37.617A.536.536,0,0,0,290.072,353.432Z" transform="translate(-243.441 -338.97)" fill=${index === activeIndex ? Colors.Theme : Colors.inActiveTab}/>
                    <path id="Path_11812" data-name="Path 11812" d="M338.075,385.438a.536.536,0,1,0-.37.617A.536.536,0,0,0,338.075,385.438Z" transform="translate(-289.533 -369.704)" fill=${index === activeIndex ? Colors.Theme : Colors.inActiveTab}/>
                    <path id="Path_11813" data-name="Path 11813" d="M274.076,417.432a.536.536,0,1,0-.37.617A.536.536,0,0,0,274.076,417.432Z" transform="translate(-228.081 -400.163)" fill=${index === activeIndex ? Colors.Theme : Colors.inActiveTab}/>
                    </g>
                   </svg>`
                                :
                                `<svg xmlns="http://www.w3.org/2000/svg" width="19.145" height="19.145" viewBox="0 0 19.145 19.145">
                    <path id="Profile_More_Icon" data-name="Profile&amp;More_Icon" d="M16.341,2.8A9.573,9.573,0,0,0,2.8,16.341,9.573,9.573,0,0,0,16.341,2.8ZM4.8,16.542a4.847,4.847,0,0,1,9.547,0,8.432,8.432,0,0,1-9.547,0Zm1.73-8.171a3.044,3.044,0,1,1,3.044,3.044A3.047,3.047,0,0,1,6.528,8.371Zm8.789,7.393a5.978,5.978,0,0,0-3.475-3.9,4.165,4.165,0,1,0-4.539,0,5.977,5.977,0,0,0-3.475,3.9,8.451,8.451,0,1,1,11.49,0Zm0,0" transform="translate(0.001)" fill=${index === activeIndex ? Colors.Theme : Colors.inActiveTab}/>
                    </svg>`

            } />
           
            <Text style={{
                fontSize: Font.xsmall,
                color: (index === activeIndex) ? Colors.Theme : Colors.inActiveTab,
                fontFamily: Font.Regular,
                position: 'absolute',
                bottom: Platform.OS==='ios' ? vs(30) : vs(20)
            }} >{title}</Text>

        </TouchableOpacity>
    )
}

export default TabItemSimple
