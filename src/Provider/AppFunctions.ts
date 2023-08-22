import moment from "moment-timezone"
import PdfThumbnail from "react-native-pdf-thumbnail";

export const getIsAppointmentChatEnabled = (appointmentDate?: Date, apppointmentStatus?: String): Boolean => {


    if (!appointmentDate || !apppointmentStatus) {
        return false
    }

    const acceptedDate = new Date(appointmentDate)
    let limitSOD = new Date(appointmentDate)
    limitSOD.setDate((acceptedDate.getDate() + 8))
    const appointmentMillis = moment(acceptedDate).valueOf()
    const limitMillis = moment(limitSOD).valueOf()
    const nowMillis = moment().valueOf()

    console.log({ acceptedDate, limitSOD, appointmentMillis, limitMillis, nowMillis, diffBwAppAndLimit: (((limitMillis - appointmentMillis) / 1000) / 60 / 60 / 24) + ' Days', diffBwLimitAndNow: (((limitMillis - nowMillis) / 1000) / 60 / 60 / 24) + ' Days' });


    return (apppointmentStatus.toLowerCase() === 'accepted' || apppointmentStatus.toLowerCase() === 'completed') &&
        (limitMillis > nowMillis)
}

export const getISChatImplemented = (appointmentDate: string, appointmentTime: string) => {


    const givenTimeString = `${appointmentDate} ${appointmentTime}`;

    // const givenTimeString = 'Tue, 25 Jul 2023 07:50 PM - 10:15 AM'

    const dateString = givenTimeString.split(' ')[1] + ' ' + givenTimeString.split(' ')[2] + ' ' + givenTimeString.split(' ')[3];
    const startTimeString = givenTimeString.split(' ')[4] + ' ' + givenTimeString.split(' ')[5];

    const givenDate = moment(dateString, 'D MMM YYYY');
    const startTime = moment(startTimeString, 'h:mm A');

    const givenDateTime = moment(givenDate).set({ hour: startTime.hours(), minute: startTime.minutes() });

    const updatedDateTime = moment(givenDateTime).add(6, 'hours');

    const sixHoursOrMorePassed = moment().isAfter(updatedDateTime);

    return sixHoursOrMorePassed
}

export const GetThumbnail = async (url: string) => {
    const result = await PdfThumbnail.generate(url, 0);
    return result;
}