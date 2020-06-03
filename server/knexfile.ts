import path from 'path'

module.exports = {
    client: 'sqlite3',
    connection:{
        //caminho até o file do database.sqlite
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite')
    },
    migrations:{
        //caminho até as migrations
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds:{
        //caminho até as migrations
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true
}