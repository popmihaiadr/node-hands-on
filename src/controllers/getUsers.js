/*
    Description: This module is responsible for handling the write requests.
*/


/* 
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Dependencies                                                                                                    │
  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
 */
const { getUsersHandler } = require('../handlers')
const { ALLOWED_METHODS } = require('../setup')

// We define an async function to handle the write requests
const getUsers = async (data, callback) => {
    const { payload, method, headers } = data;


    if (ALLOWED_METHODS['getUsers'].indexOf(method) > -1) {
    
        
        if ('count' in headers) {
            const countHeaderValue = headers['count'];
           if (countHeaderValue<10)
           {
            const result = await getUsersHandler(countHeaderValue);
            if (result && result.status === 200) {
                callback(200, result)
            }

            callback(500, result)
           }
         else {
            console.log('Count value is bigger than 10');
            callback(400, { 'message': 'Send a smaller value for count' })
         }
        } else {
            console.log('Count is not part of the header')
            callback(400, { 'message': 'Count is not part of the header!' })
        }
    } else {
        console.log('Method not allowed for getUsers!')
        callback(405, { 'message': 'Method not allowed for getUsers!' })
    }
}

module.exports = getUsers