const validator = require('validator');
let regex = /^[a-z '-]+$/i

class check {
    static checkName(req) {
        let error = false
        let name = req.body.name
        try {
            if (validator.isEmpty(name)) throw new Error('This field is required')
            if (!regex.test(name)) throw new Error(`{ ${name} } is not a valid name`)
        } catch (e) {
            error = e.message
        }
        return error
    }
    static checkAddress(req) {
        let error = false
        try {
            if (validator.isEmpty(req.body.Address)) throw new Error('This field is required')
        } catch (e) {
            error = e.message
        }
        return error
    }
    static checkPhone(req) {
        let error = false
        try {
            if (validator.isEmpty(req.body.phone)) throw new Error('This field is required')
            if (!validator.isMobilePhone(req.body.phone, ['ar-EG'])) throw new Error('Enter a valid Phone number')
        } catch (e) {
            error = e.message
        }
        return error
    }
    static checkinitalBalance(req) {
        let error = false;
        try {
            if (validator.isEmpty(req.body.initalBalance)) throw new Error('This field is required')
            if (!validator.isInt(req.body.initalBalance, { gt: 0 })) throw new Error('Enter a valid Balance')
        } catch (e) {
            error = e.message
        }
        return error
    }
    static checkTransValue(req) {
        let error = false;
        try {
            if (!validator.isInt(req.body.value, { gt: 49 })) throw new Error('Enter a valid Balance grater than 50 EG')
        } catch (e) {
            error = e.message
        }
        return error
    }
}


module.exports = check