const query = {
  login: `select 
                * 
            from 
                account 
            where 
                user_id = ? and user_pw = ?`,
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
                    join  
                        sensor_information si 
                    on
                        sd.sensor_information_id = si.sensor_information_id 
                    where 
                        sd.sensor_data_created_at >= date_format(now(), '%Y-%m-%d %H:%i:00')`,
  dataValidation: `
                select 
                    sensor_name, 
                    sensor_minimum_value, 
                    sensor_maximum_value  
                from 
                  sensor_information`,
  loadSensorDataAll: `
                    select 
                        si.sensor_node_id,
                        si.sensor_category,
                        si.sensor_name,
                        si.sensor_location,
                        sd.sensor_data_value,
                        sensor_data_created_at
                    from 
                        sensor_information si
                    join 
                        sensor_data sd 
                    on
                        si.sensor_information_id = sd.sensor_information_id
                    where
                        sd.sensor_data_created_at >=  date(now())
                    and
                        sd.sensor_data_created_at < date(date_add(now(), interval 1 day))
                    order by 
                        sd.sensor_data_created_at desc`,
  loadSensorDataValueRange: `
                    select
                        sensor_name, 
                        sensor_minimum_value, 
                        sensor_maximum_value   
                    from
                        sensor_information`,
  getSensorDataRange: `
                    select
                        sensor_name, 
                        sensor_minimum_value , 
                        sensor_maximum_value  
                    from 
                        sensor_information`,
  saveInvalidSensorData: `
                    insert into
                        invalid_sensor_data (
                                            sensor_information_id, 
                                            invalid_sensor_data_value, 
                                            invalid_sensor_data_created_at)
                    values
                        (
                        (
                        select
                            sensor_information_id 
                        from 
                            sensor_information 
                        where 
                            sensor_name = ?), ?, ?)`,
  aFewMinutesAgo: `
                select 
                    * 
                from 
                    sensor_data sd 
                    join  
                    sensor_information si 
                on
                    sd.sensor_information_id = si.sensor_information_id 
                where 
                    sd.sensor_data_created_at >= date_format(date_sub(now(), interval 1 minute), '%Y-%m-%d %H:%i:00')
                and
                    sd.sensor_data_created_at < date_format(now(), '%Y-%m-%d %H:%i:00')`,
};

module.exports = query;
