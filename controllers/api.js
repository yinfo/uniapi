

module.exports.its404 = async function (req, res) {

    res.status(404).json({
        type: 'error',
        errorId: 'PAGE_NOT_FOUND',
        message: 'Страница не существует'
    })
}























