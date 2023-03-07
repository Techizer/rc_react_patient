import moment from "moment-timezone"

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

    console.log({acceptedDate, limitSOD, appointmentMillis, limitMillis, nowMillis, diffBwAppAndLimit: (((limitMillis - appointmentMillis)/1000)/60/60/24) + ' Days', diffBwLimitAndNow: (((limitMillis - nowMillis)/1000)/60/60/24) + ' Days'});


    return (apppointmentStatus.toLowerCase() === 'accepted' || apppointmentStatus.toLowerCase() === 'completed') &&
        (limitMillis > nowMillis)
}

export const getISChatImplemented = (appointmentDateMilliseconds: number) => {
    return appointmentDateMilliseconds > moment('2023-02-27').valueOf()
}