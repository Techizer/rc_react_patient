import { useSelector } from "react-redux";
import { apifuntion } from "../Provider/APIProvider";
import { config } from "../Provider/configProvider";
import { msgProvider } from "../Provider/messageProvider";
import moment from "moment";

const useBooking = () => {

    const { loggedInUserDetails, selectedProvider, isMultiBooking, customBookingDates } = useSelector(state => state.StorageReducer)

    const getTimeSlots = async (selectedDate, currentData = '') => {
        var current = new Date();
        let min = current.getMinutes() < 10 ? "0" + current.getMinutes() : current.getMinutes();
        let hour = current.getHours() < 10 ? "0" + current.getHours() : current.getHours();
        var timcurrent = hour + ":" + min;
        const currentDate = moment().format('YYYY-MM-DD')
        let url = config.baseURL + "api-patient-next-date-time";

        var data = new FormData();
        data.append("provider_id", selectedProvider ? selectedProvider?.providerId : '');
        data.append("date", selectedDate);
        data.append("task_type", 'task_base');
        data.append("service_type", selectedProvider.providerType);

        return await apifuntion
            .postApi(url, data)
            .then((obj) => {
                if (obj.status == true) {
                    const newTimeSlot = [];
                    const Arr1 = [];
                    const Arr2 = [];
                    if (obj.result.task_time != "") {
                        var names = obj.result.task_time;
                        var nameArr = names.split(",");


                        var task_ar1 = false;
                        var task_ar2 = true;
                        if (obj.result.task_time != "") {

                            for (let l = 0; l < nameArr.length; l++) {
                                if (currentDate == selectedDate) {
                                    const timeStr = nameArr[l];

                                    const convertTime = (timeStr) => {
                                        const [time, modifier] = timeStr.split(" ");
                                        let [hours, minutes] = time.split(":");
                                        if (hours === "12") {
                                            hours = "00";
                                        }
                                        if (modifier === "PM") {
                                            hours = parseInt(hours, 10) + 12;
                                        }
                                        return `${hours}:${minutes}`;
                                    };
                                    var finaltime = convertTime(timeStr);

                                    if (finaltime >= timcurrent) {
                                        newTimeSlot.push({
                                            time: nameArr[l],
                                            time_status: false,
                                        });
                                        if (!task_ar1) {
                                            task_ar1 = true;
                                            task_ar2 = false;
                                            Arr1.push({ time: nameArr[l], time_status: false });
                                        } else {
                                            task_ar1 = false;
                                            task_ar2 = true;
                                            Arr2.push({ time: nameArr[l], time_status: false });
                                        }
                                    }
                                } else {
                                    newTimeSlot.push({ time: nameArr[l], time_status: false });
                                    if (!task_ar1) {
                                        task_ar1 = true;
                                        task_ar2 = false;
                                        Arr1.push({ time: nameArr[l], time_status: false });
                                    } else {
                                        task_ar1 = false;
                                        task_ar2 = true;
                                        Arr2.push({ time: nameArr[l], time_status: false });
                                    }
                                }
                            }


                        }
                    }
                    const result = {
                        newTimeSlot,
                        Arr1,
                        Arr2,
                    }
                    return result;
                } else {
                    return false;
                }
            })
            .catch((error) => {
                console.log("getTimeDate-error ------- " + error);
            });
    };

    const getTimeSlotAvailability = async () => {
        let datesArray = []
        let timesArray = []

        let commaSeparatedDates = '';
        let commaSeparatedTimes = '';

        datesArray = Object.keys(customBookingDates);
        timesArray = Object.values(customBookingDates).map(entry => entry.time);

        commaSeparatedDates = datesArray.join(', ');
        commaSeparatedTimes = timesArray.join(', ');

        let url = config.baseURL + "api-check-calendar-time";

        var data = new FormData();
        data.append("service_type", selectedProvider.providerType);
        data.append("provider_id", selectedProvider ? selectedProvider?.providerId : '');
        data.append("selectedDate", commaSeparatedDates);
        data.append("selectedTime", timesArray[0]);

        return await apifuntion
            .postApi(url, data)
            .then((obj) => {
                if (obj.status == true) {
                    return obj.result
                } else {
                    return false;
                }
            }).catch((error) => {
                console.log("getTimeSlotAvailability-error ------- " + error);
            });
    };

    const RepeatBooking = async (service, Id, taskId, type) => {

        let conditionsFailed = false;
        if (conditionsFailed) {
            return false
        } else {

            //   setState({ isLoading: true })
            let url = config.baseURL + "api-repeat-booking";
            var data = new FormData();
            data.append('service_type', service)
            data.append('lgoin_user_id', loggedInUserDetails?.user_id)
            data.append('provider_id', Id)
            data.append('task_id', taskId)
            data.append('booking_type', type)

            // console.log(data._parts);
            // return
            apifuntion.postApi(url, data, 1).then((obj) => {

                console.log('RepeatBooking Response', obj)
                if (obj.status == true) {
                    msgProvider.showSuccess('Appointment booked successfully')
                    // setState({ isLoading: false })

                } else {
                    // setState({ isLoading: false })
                    msgProvider.showError(obj?.message)
                }
            }).catch((error) => {
                // setState({ isLoading: false })
                msgProvider.showError('Something went wrong, please try again later.')
                console.log("repeat-booking-error ------- ", error)
            })
        }

    }

    return {
        getTimeSlots,
        RepeatBooking,
        getTimeSlotAvailability
    }

}

export default useBooking;