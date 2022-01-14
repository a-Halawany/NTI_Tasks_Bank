const validator = require('validator');


class check {
    static checkName(req) {
        let error = false
        try {
            if (validator.isEmpty(req.body.name)) throw new Error('This field is required')
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
}


module.exports = check