const {Pool} = require('pg')
const dbErrors = require('./db_errors')
const connectionString = 'postgres://postgres:postgres@192.168.110.23:5432/demonology'
const pool = new Pool({connectionString})

module.exports = {
//-------------------------------------------------------------------------------
//---------------------------таблица Users---------------------------------------
//-------------------------------------------------------------------------------

    newUserDataCreate: async function  (data)  {
        const user_id = data
        //считать все данные из таблиц START_UNIT, START_SQUAD, START_PRESET, START_STONES
        //для таблиц PRESET_DATA, SQUAD_DATA, UNIT_DATA, CASHBOX_DATA создать записи для текущего пользователя

        //считать данные стартовых юнитов-----------------------------------------
        try {
            //проверка на существование записей у пользователя в таблице UNIT_DATA
            const unitsForUserId = await this.unitDataGetByUserId(user_id)
            //если данных нет - то не записывать еще раз
            if (unitsForUserId.length === 0) {
                //считать данные по стартовым юнитам
                const start_units = await this.startUnits()
                //для теста
                console.log(start_units)
                const countRows = start_units.length
                for (let i = 0; i < countRows; i++) {
                    const params = start_units[i]
                    //записать данные по юнитам в сейв нового игрока (таблица unit_data)
                    const unit_data = await this.unitDataInsert({user_id, params})
                }
            }
        } catch (e) {
            console.error(e.errorId, e.message)
        }

        //считать данные стартовых отрядов-----------------------------------------
        try {
            //проверка на существование записей у пользователя в таблице SQUAD_DATA
            const squadsDataUser = await this.squadDataGetByUserId(user_id)
            //если данных нет - то записать
            if (squadsDataUser.length === 0) {
                //считать стартовые отряды
                const start_squads = await this.startSquads()
                //для теста
                console.log(start_squads)
                //количество отрядов
                const countRows = start_squads.length
                for (let i = 0; i < countRows; i++) {
                    let params = start_squads[i]
                    //подготовить данные к записи в таблицу SQUAD_DATA
                    //для этого необходимо найти соответсвующие ID юнитов из таблицы стартовых отрядов в таблице Unit_data
                    //перезаписать на соответсвующий Unit_data_id
                    //вытащить данные id из таблицы Unit_data для записей в таблице Start_squads
                    //для первого слота
                    let slot_unit_id = params.slot_1_unit_id
                    params.slot_1_unit_id = await this.getUnitIdToStartId({slot_unit_id, user_id})
                    //для второго слота
                    slot_unit_id = params.slot_2_unit_id
                    params.slot_2_unit_id = await this.getUnitIdToStartId({slot_unit_id, user_id})
                    //для третьего слотa
                    slot_unit_id = params.slot_3_unit_id
                    params.slot_3_unit_id = await this.getUnitIdToStartId({slot_unit_id, user_id})
                    //для четвертого слота
                    slot_unit_id = params.slot_4_unit_id
                    params.slot_4_unit_id = await this.getUnitIdToStartId({slot_unit_id, user_id})
                    //для пятого слота
                    slot_unit_id = params.slot_5_unit_id
                    params.slot_5_unit_id = await this.getUnitIdToStartId({slot_unit_id, user_id})
                    //для шестого слота
                    slot_unit_id = params.slot_6_unit_id
                    params.slot_6_unit_id = await this.getUnitIdToStartId({slot_unit_id, user_id})

                    //записать данные по отрядам в сейв нового игрока (таблица squad_data)
                    const squad_data = await this.squadDataInsert({user_id, params})
                }
            }
        } catch (e) {
            console.error(e.errorId, e.message)
        }

        //считать данные стартовых пресетов-----------------------------------------------
        try {
            //проверка на существование записей у пользователя в таблице PRESET_DATA
            const presetForUserId = await this.presetDataGetByUserId(user_id)
            //если данных нет - то не записывать еще раз
            if (presetForUserId.length === 0) {
                const start_presets = await this.startPreset()
                //для теста
                console.log(start_presets)
                const countRows = start_presets.length
                for (let i = 0; i < countRows; i++) {
                    const params = start_presets[i]
                    const presetUser = await this.presetDataInsert({user_id, params})
                    //для теста
                    console.log(presetUser)
                }
            }
        } catch (e) {
            console.error(e.errorId, e.message)
        }

        //считать данные стартового набора камней-----------------------------------------
        try {
            const start_stones = await this.startStones()
            //для теста
            console.log(start_stones)
        } catch (e) {
            console.error(e.errorId, e.message)
        }

        //считать данные стартовых миров--------------------------------------------------
        try {
            //проверка на существование записей у пользователя в таблице WORLD_DATA

            const worldUsers = await this.worldDataGetByUserId(user_id)
            //для теста
            //console.log(worldUsers)
            //если данных нет - то не записывать еще раз
            if (worldUsers.length === 0) {
                //считать данные по стартовым юнитам
                const start_worlds = await this.startWorlds()
                //для теста
                console.log(start_worlds)
                const countRows = start_worlds.length
                for (let i = 0; i < countRows; i++) {
                    const params = start_worlds[i]
                    //записать данные по юнитам в сейв нового игрока (таблица unit_data)
                    const unit_data = await this.worldDataInsert({user_id, params})
                }

            }
        } catch (e) {
            console.error(e.errorId, e.message)
        }
    },

    userGetById: async function (data)  {
        try {
            const user_id = data
            const res = await pool.query('SELECT * FROM users where user_id=$1', [user_id])
            return res.rows.length > 0 ? res.rows[0] : null
        } catch (e) {
            throw overrideError(e)
        }
    },

    userGetAll: async function ()  {
        try {
            const res = await pool.query('SELECT * FROM users', null)
            return res.rows
        } catch (e) {
            throw overrideError(e)
        }
    },

    //записать сформированную сервером сессию для определенного юзера в таблицу USERS и вернуть ее
    userUpdateSessionIdByUserId: async function  (data)  {
        try {
            const user_id = data
            //создать новый уникальный sessionId
            const newSessionId = ''
            const sessionId = await pool.query('UPDATE public.users\n' +
                                                '\tSET session_id=$2, last_time=now()\n' +
                                                '\tWHERE user_id=$1 RETURNING session_id', [user_id, newSessionId])
            return sessionId.rows.length > 0 ? sessionId.rows[0]: null
        } catch (e) {
            throw overrideError(e)
        }

    },

    //Возвращает true, если сервер дает добро на подключение по сокету с этим sessionId
    userCheckSessionId: async function (data)  {
        try {
            const session_id = data
            const countSession = await pool.query('select true \n' +
                                                'from users where session_id =$1 \n' +
                                                'and last_time::date > (now() - interval \'10 days\')', [session_id])


            return countSession.rows.length > 0 ? true: false
        } catch (e) {
            throw overrideError(e)
        }

    },

    /*
    * В параметрах - только user_id
    * TODO = сделать чтобы передавалось еще значение логина в виде id платформы
    * */

    userGetSessionIdByUserId: async function (data)  {
        try {
            const user_id = data
            //создать новый уникальный sessionId
            const newSessionId = ''
            //TODO сделать чтобы передавалось с клиента
            const login = "google_id_1"
            //проверка на существования пользователя с таким user_id
            const countUser = await pool.query('SELECT user_id as countUser FROM users where user_id=$1', [user_id])
            if (countUser.rows.length === 0){
                //создать новую запись в БД
                const userInsert = await pool.query('INSERT INTO public.users(\n' +
                                                    '\tuser_id, session_id, registered, last_time, login, dust, tutorial)\n' +
                                                    '\tVALUES ($1, $2, false, now(), $3, (select dust_start from config), false);', [user_id, newSessionId, login])

                //создать стартовые данные для Юзера
                const startData  = await this.newUserDataCreate(user_id)
            }


            //проверка на заполнение сессии
            const countSessionId = await pool.query('SELECT count(session_id) FROM users\n' +
                                                    '\twhere user_id = $1 and not session_id = \'\'', [user_id])


            if (countSessionId === 0)
            {

                //добавить новую сессию user_id и вернуть сессию
                const sessionId = await pool.query('UPDATE public.users\n' +
                                                    '\tSET session_id=$2, last_time=now()\n' +
                                                    '\tWHERE user_id=$1 RETURNING session_id', [user_id, newSessionId])
                return sessionId.rows.length > 0 ? sessionId.rows[0]: null

            }
            else
            {
                //проверить сессию на валидность
                const updateSession = await pool.query('UPDATE public.users\n' +
                                                    '\tSET session_id=$1, last_time=now()\n' +
                                                    '\tWHERE user_id = $2\n' +
                                                    '\tand last_time::date < (now() - interval \'10 days\')', [newSessionId, user_id])

                const sessionId  = await pool.query('SELECT session_id FROM users WHERE user_id = $1;', [user_id])


                return sessionId.rows.length > 0 ? sessionId.rows[0]: null

            }
        } catch (e) {
            throw overrideError(e)
        }

    },

//-------------------------------------------------------------------------------
//--------------------start_data_for_new_user------------------------------------
//-------------------------------------------------------------------------------
    /*
    *считатать стартовые данные для нового пользователя из таблицы START_UNITS
    *на выходе - данные стартовых юнитов
    * */

    startUnits: async function () {
        try {
            const start_units = await pool.query('SELECT * FROM start_units')
            return start_units.rows
        } catch (e) {
            throw overrideError(e)
        }
    },

    /*
    *считатать стартовые данные для нового пользователя из таблицы START_SQUADS
    *на выходе - данные стартовых отрядов
    * */

    startSquads: async function () {
        try {
            const start_squads = await pool.query('SELECT * FROM start_squads')
            return start_squads.rows
        } catch (e) {
            throw overrideError(e)
        }
    },

    /*
    *считатать стартовые данные для нового пользователя из таблицы START_PRESETS
    *на выходе - данные стартовых пресетов
    * */

    startPreset: async function () {
        try {
            const start_presets = await pool.query('SELECT * FROM start_preset')
            return start_presets.rows
        } catch (e) {
            throw overrideError(e)
        }
    },

    /*
    * считатать стартовые данные для нового пользователя из таблицы START_STONES
    * на выходе - данные о стартовом наборе камней
    * */
    startStones: async function () {
        try {
            const start_stones = await pool.query('SELECT * FROM start_stones')
            return start_stones.rows
        } catch (e) {
            throw overrideError(e)
        }
    },

    /*
    *считатать стартовые данные для нового пользователя из таблицы START_WORLDS
    *на выходе - данные о стартовых мирах
    * */
    startWorlds: async function  ()  {
        try {
            const start_worlds = await pool.query('SELECT * FROM start_worlds')
            return start_worlds.rows
        } catch (e) {
            throw overrideError(e)
        }
    },

    /*
    * получение идентификатора записи юнита из таблицы Unit_data соответсвтующей записи в таблице Start_units
    * для определенного пользователя
    * */
    getUnitIdToStartId: async function (data)  {
        let {slot_unit_id, user_id} = data
        if (slot_unit_id !== null){
            let start_unit_id = slot_unit_id
            try {
                const  startUnitId = await pool.query('SELECT \n' +
                    '\t(select ud.unit_data_id from unit_data as ud \n' +
                    '\t where ud.name = su.name and ud.unit_id = su.unit_id \n' +
                    '\t and ud.unit_type = su.unit_type and ud.abil_id = su.abil_id\n' +
                    '\t and ud.point_x = su.point_x and ud.point_y = su.point_y' +
                    '\t and ud.user_id = $1)\n' +
                    '\tFROM start_units as su\n' +
                    '\tWHERE SU.start_units_id = $2', [user_id, start_unit_id] )
                //присвоить новое значение параметру
                return slot_unit_id = startUnitId.rows[0].unit_data_id
            } catch (e) {
                throw  overrideError(e)
            }
            //const newValue = await startUnitIdFromUnitData({user_id, start_unit_id})
        }
        return slot_unit_id
    },
//-------------------------------------------------------------------------------
//--------------------работа с сохраненными данными игрока-----------------------
//-------------------------------------------------------------------------------

//--------------------таблица UNIT_DATA------------------------------------------

    /*
    *считатать сохраненные данные юнитов пользователя из таблицы UNIT_DATA
    *на входе - user_id
    *на выходе - данные юнитов пользователя
    * */
    unitDataGetByUserId: async function (data) {
        try {
            const user_id = data
            const start_stones = await pool.query('SELECT * FROM unit_data WHERE user_id = $1', [user_id])
            return start_stones.rows
        } catch (e) {
            throw overrideError(e)
        }
    },

    //добавить нового Юнита пользователю
    unitDataInsert: async function (data){
        try {
            const {user_id, params} = data
            const textSql = 'INSERT INTO unit_data(\n' +
                        '\tname, user_id, unit_id, unit_type, abil_id,\n' +
                        '\tpoint_x, point_y)\n' +
                        '\tVALUES ($1, $2, $3, $4, $5, $6, $7);'

            const paramsSql = [params.name, user_id, params.unit_id, params.unit_type, params.abil_id, params.point_x, params.point_y]

            const unitDataInsertUnit = await pool.query(textSql, paramsSql)
            return true
        } catch (e) {
            throw overrideError(e)
        }
    },


//--------------------таблица PRESET_DATA----------------------------------------
   /*
   *считатать сохраненные данные пресетов пользователя из таблицы PRESET_DATA
   *на входе - user_id
   *на выходе - данные пресетов пользователя
   * */
    presetDataGetByUserId: async function (data) {
        try {
            const user_id = data
            const preset_data = await pool.query('SELECT * FROM preset_data WHERE user_id = $1', [user_id])
            return preset_data.rows
        } catch (e) {
            throw overrideError(e)
        }
    },

    //добавить новый пресет пользователю
    presetDataInsert: async function  (data){
        try {
            const {user_id, params} = data
            const textSql = 'INSERT INTO preset_data(user_id, title_preset, slot_1_point_x, slot_1_point_y, \n' +
                            '\tslot_2_point_x, slot_2_point_y, slot_3_point_x, slot_3_point_y, \n' +
                            '\tslot_4_point_x, slot_4_point_y, slot_5_point_x, slot_5_point_y, \n' +
                            '\tslot_6_point_x, slot_6_point_y, slot_1_unit_type, slot_2_unit_type, \n' +
                            '\tslot_3_unit_type, slot_4_unit_type, slot_5_unit_type, slot_6_unit_type)\n' +
                            '\tVALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20);'

            const paramsSql = [user_id, params.title, params.slot_1_point_x, params.slot_1_point_y,
                                params.slot_2_point_x, params.slot_2_point_y,
                                params.slot_3_point_x, params.slot_3_point_y,
                                params.slot_4_point_x, params.slot_4_point_y,
                                params.slot_5_point_x, params.slot_5_point_y,
                                params.slot_6_point_x, params.slot_6_point_y,
                                params.slot_1_type, params.slot_2_type, params.slot_3_type,
                                params.slot_4_type, params.slot_5_type, params.slot_6_type]

            const presetData = await pool.query(textSql, paramsSql)
            return true
        } catch (e) {
            throw overrideError(e)
        }
    },
//---------------------таблица SQUAD_DATA----------------------------------------

    /*
    * Вытащить данные из таблицы отрядов пользователей Squad_data
    * */
    squadDataGetByUserId: async function (data) {
        try {
            const user_id = data
            const res = await pool.query('select * from squad_data where user_id = $1', [user_id])
            return  res.rows
        } catch (e) {
            throw overrideError(e)
        }
    },

    /*
     * добавить новый отряд в таблице Squad_data для определенного пользователя
     * */
    squadDataInsert: async function (data)  {
      try{
          const {user_id, params} = data


          const textSql = 'INSERT INTO public.squad_data(\n' +
                            '\tuser_id, slot_1_point_x, slot_1_point_y, slot_1_unit_data_id, slot_1_unit_type,\n' +
                            '\tslot_2_point_x, slot_2_point_y, slot_2_unit_data_id, slot_2_unit_type,\n' +
                            '\tslot_3_point_x, slot_3_point_y, slot_3_unit_data_id, slot_3_unit_type,\n' +
                            '\tslot_4_point_x, slot_4_point_y, slot_4_unit_data_id, slot_4_unit_type,\n' +
                            '\tslot_5_point_x, slot_5_point_y, slot_5_unit_data_id, slot_5_unit_type,\n' +
                            '\tslot_6_point_x, slot_6_point_y, slot_6_unit_data_id, slot_6_unit_type,\n' +
                            '\tslot_1_abil_id, slot_2_abil_id, slot_3_abil_id, slot_4_abil_id, slot_5_abil_id, slot_6_abil_id)\n' +
                            '\tVALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,\n' +
                            '\t$18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)'

          const paramsSql = [user_id, params.slot_1_point_x, params.slot_1_point_y, params.slot_1_unit_id, params.slot_1_unit_type,
                              params.slot_2_point_x, params.slot_2_point_y, params.slot_2_unit_id, params.slot_2_unit_type,
                              params.slot_3_point_x, params.slot_3_point_y, params.slot_3_unit_id, params.slot_3_unit_type,
                              params.slot_4_point_x, params.slot_4_point_y, params.slot_4_unit_id, params.slot_4_unit_type,
                              params.slot_5_point_x, params.slot_5_point_y, params.slot_5_unit_id, params.slot_5_unit_type,
                              params.slot_6_point_x, params.slot_6_point_y, params.slot_6_unit_id, params.slot_6_unit_type,
                              params.slot_1_abil_id, params.slot_2_abil_id, params.slot_3_abil_id, params.slot_4_abil_id,
                              params.slot_5_abil_id, params.slot_6_abil_id]
          const presetData = await pool.query(textSql, paramsSql)
          return true
      }  catch (e) {
          throw overrideError(e)
      }
    },
//---------------------таблица WORLD_DATA----------------------------------------

    /*
        вытащить все миры пользователя
        на входе: user_id = индентификатор пользователя
    */

    worldDataGetByUserId: async function (data)  {
        try {
            const user_id = data
            const res = await pool.query('SELECT wdata.world_data_id, wdata.user_id, wdata.stone_cached_stats, wdata.stones, wmap.*\n'+
                '\tFROM world_data AS wdata LEFT JOIN world_map wmap ON (wmap.world_map_id = wdata.world_map_id)\n'+
                '\tWHERE user_id = $1', [user_id])
            return res.rows
        } catch (e) {
            throw overrideError(e)
        }

    },

    /*
      Добавить новый мир пользователю
      на входе: user_id = индентификатор пользователя
                world_map_id = идентификатор мира
    */

    worldDataInsert: async function (data)  {
        try {
            const {user_id, params} = data
            const res = await pool.query('INSERT INTO public.world_data(\n' +
                                        '\tuser_id, world_map_id)\n' +
                                        '\tVALUES ($1, $2)', [user_id, params.world_map_id])

        } catch (e) {
            throw overrideError(e)
        }
    },

    /*
    Обновить данные мира пользователя
    на входе: world_data_id = идентификатор мира пользователя
              param = какой параметр изменить
              json = json с данными
    */


    worldDataUpdate: async function (data)  {
        try {
            const {stone_cached_stats, stones, world_data_id} = data
            const res = await pool.query('UPDATE world_data\n' +
                '\tSET  stone_cached_stats=$1, stones = $2\n' +
                '\tWHERE world_data_id =$3', [stone_cached_stats, stones, world_data_id])

        } catch (e) {
            throw overrideError(e)
        }
    },

    /*
        Удалить данные мира
        на входе: world_data_id = уникальный идентификатор мира пользователя

     */
    worldDataDelete: async function (data) {
        try {
            const world_data_id = data
            const res = await pool.query('DELETE FROM world_data\n' +
                                        '\tWHERE world_data_id =$1', [world_data_id])
        } catch (e) {
            throw overrideError(e)
        }
    },

//-------------------------------------------------------------------------------
//---------------------------работа с общими таблицами---------------------------
//-------------------------------------------------------------------------------



    // worldDataGetByUserId: async (user_id ) => {
    //     const result = await query('SELECT * FROM world_data', null)
    //     // const result = await query('SELECT * FROM world_data where user_id=$1', [user_id])
    //     return result
    // },

//-------------------------------------------------------------------------------
//--------------------------создание стартовых данных----------------------------
//-------------------------------------------------------------------------------

// на входе user_id который получили от сервера авторизации

//     newUserDataCreate: async (data) => {
//         const user_id = data
//         //считать все данные из таблиц START_UNIT, START_SQUAD, START_PRESET, START_STONES
//         //для таблиц PRESET_DATA, SQUAD_DATA, UNIT_DATA, CASHBOX_DATA создать записи для текущего пользователя
//
//         //считать данные стартовых юнитов-----------------------------------------
//         try {
//             //проверка на существование записей у пользователя в таблице UNIT_DATA
//             const unitsForUserId = await unitDataGetByUserId(user_id)
//             //если данных нет - то не записывать еще раз
//             if (unitsForUserId.length === 0) {
//                 //считать данные по стартовым юнитам
//                 const start_units = await startUnits()
//                 //для теста
//                 console.log(start_units)
//                 const countRows = start_units.length
//                 for (let i = 0; i < countRows; i++) {
//                     const params = start_units[i]
//                     //записать данные по юнитам в сейв нового игрока (таблица unit_data)
//                     const unit_data = await unitDataInsert({user_id, params})
//                 }
//             }
//         } catch (e) {
//             console.error(e.errorId, e.message)
//         }
//
//         //считать данные стартовых отрядов-----------------------------------------
//         try {
//             //проверка на существование записей у пользователя в таблице SQUAD_DATA
//             const squadsDataUser = await squadDataGetByUserId(user_id)
//             //если данных нет - то записать
//             if (squadsDataUser.length === 0) {
//                 //считать стартовые отряды
//                 const start_squads = await startSquads()
//                 //для теста
//                 console.log(start_squads)
//                 //количество отрядов
//                 const countRows = start_squads.length
//                 for (let i = 0; i < countRows; i++) {
//                     let params = start_squads[i]
//                     //подготовить данные к записи в таблицу SQUAD_DATA
//                     //для этого необходимо найти соответсвующие ID юнитов из таблицы стартовых отрядов в таблице Unit_data
//                     //перезаписать на соответсвующий Unit_data_id
//                     //вытащить данные id из таблицы Unit_data для записей в таблице Start_squads
//                     //для первого слота
//                     let slot_unit_id = params.slot_1_unit_id
//                     params.slot_1_unit_id = await getUnitIdToStartId({slot_unit_id, user_id})
//                     //для второго слота
//                     slot_unit_id = params.slot_2_unit_id
//                     params.slot_2_unit_id = await getUnitIdToStartId({slot_unit_id, user_id})
//                     //для третьего слотa
//                     slot_unit_id = params.slot_3_unit_id
//                     params.slot_3_unit_id = await getUnitIdToStartId({slot_unit_id, user_id})
//                     //для четвертого слота
//                     slot_unit_id = params.slot_4_unit_id
//                     params.slot_4_unit_id = await getUnitIdToStartId({slot_unit_id, user_id})
//                     //для пятого слота
//                     slot_unit_id = params.slot_5_unit_id
//                     params.slot_5_unit_id = await getUnitIdToStartId({slot_unit_id, user_id})
//                     //для шестого слота
//                     slot_unit_id = params.slot_6_unit_id
//                     params.slot_6_unit_id = await getUnitIdToStartId({slot_unit_id, user_id})
//
//                     //записать данные по отрядам в сейв нового игрока (таблица squad_data)
//                     const squad_data = await squadDataInsert({user_id, params})
//                 }
//             }
//         } catch (e) {
//             console.error(e.errorId, e.message)
//         }
//
//         //считать данные стартовых пресетов-----------------------------------------------
//         try {
//             //проверка на существование записей у пользователя в таблице PRESET_DATA
//             const presetForUserId = await presetDataGetByUserId(user_id)
//             //если данных нет - то не записывать еще раз
//             if (presetForUserId.length === 0) {
//                 const start_presets = await startPreset()
//                 //для теста
//                 console.log(start_presets)
//                 const countRows = start_presets.length
//                 for (let i = 0; i < countRows; i++) {
//                     const params = start_presets[i]
//                     const presetUser = await presetDataInsert({user_id, params})
//                     //для теста
//                     console.log(presetUser)
//                 }
//             }
//         } catch (e) {
//             console.error(e.errorId, e.message)
//         }
//
//         //считать данные стартового набора камней-----------------------------------------
//         try {
//             const start_stones = await startStones()
//             //для теста
//             console.log(start_stones)
//         } catch (e) {
//             console.error(e.errorId, e.message)
//         }
//
//         //считать данные стартовых миров--------------------------------------------------
//         try {
//             //проверка на существование записей у пользователя в таблице WORLD_DATA
//
//             const worldUsers = await worldDataGetByUserId(user_id)
//             //для теста
//             //console.log(worldUsers)
//             //если данных нет - то не записывать еще раз
//             if (worldUsers.length === 0) {
//                 //считать данные по стартовым юнитам
//                 const start_worlds = await startWorlds()
//                 //для теста
//                 console.log(start_worlds)
//                 const countRows = start_worlds.length
//                 for (let i = 0; i < countRows; i++) {
//                     const params = start_worlds[i]
//                     //записать данные по юнитам в сейв нового игрока (таблица unit_data)
//                     const unit_data = await worldDataInsert({user_id, params})
//                 }
//
//             }
//         } catch (e) {
//             console.error(e.errorId, e.message)
//         }
//     },

}



const overrideError = (e) => {
    const code = e.code
    const errorId = dbErrors[code] ? dbErrors[code] : 'unknown_db_error'
    return {
        code,
        errorId,
        message: e.message,
        stack: e.stack,
    }
}







