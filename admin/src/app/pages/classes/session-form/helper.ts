export const validateSessionForm = (
    name: string,
    description: string,
    date: string,
    startTime: string,
    endTime: string,
    imageFile: File
) => {
    const errors = [];

    if(name === '' || !name) {
        errors.push('Name')
    }

    if(description === '' || !description) {
        errors.push('Description')
    }

    if(date === '' || !date) {
        errors.push('Date')
    }

    if(startTime === '' || !startTime) {
        errors.push('Start Time')
    }

    if(endTime === '' || !endTime) {
        errors.push('End Time')
    }

    if(!imageFile) {
        errors.push('Image')
    }

    return {
        hasErrors: errors.length !== 0,
        errors: errors
    }
}