const query = {
  login: `select * from account where user_id = ? and user_pw = ?`,
  saveData: `insert into 
                sensor_data (sensor_information_id, 
                            sensor_data_value,
                            sensor_data_created_at) 
            values 
            (( 
            select
                sensor_information_id
            from 
                sensor_information
            where
                sensor_name = ?) 
            , ?, ?) ;`,
  loadSensorData: `select 
                        * 
                    from 
                        sensor_data sd 
                    left outer join  
                        sensor_information si 
                    on
                        sd.sensor_information_id = si.sensor_information_id 
                    where 
                        sd.sensor_data_created_at >= ?
                        
                    `,
};

module.exports = query;
