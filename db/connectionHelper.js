const connection = (query ) => {
    connection.connect();
    connectDB.query(query, (error, result) => {
        if (error) {
            logger.error(error)
            return {
                Success: false,
                Message: error
            }
        }

        if (!result.length) {
            return {
                success: false,
                message: "Username does not exist"
            }
            connection.end();
        }
        if (result.length) {
            return {
                data:result,
                success: false,
                message: "Username does not exist"
            }
            connection.end();
        }
    })

}