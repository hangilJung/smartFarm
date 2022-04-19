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
  saveDataTest: ``,
  loadSensorData: `select 
                        si.sensor_information_id,
                        si.sensor_node_id,
                        si.sensor_category,
                        si.sensor_name,
                        sd.sensor_data_value,
                        sd.sensor_data_created_at 
                    from
                        sensor_data sd
                    join
                        sensor_information si 
                    on
                        si.sensor_information_id = sd.sensor_information_id
                    where 
                        sd.sensor_data_created_at = 
                        (
                        select 
                            new_max_created_at
                        from
                            max_created_at 
                        where
                            sensor_information_id = 40
                        )
                    union
                    select 
                        si.sensor_information_id,
                        si.sensor_node_id,
                        si.sensor_category,
                        si.sensor_name,
                        sd.sensor_data_value,
                        sd.sensor_data_created_at 
                    from
                        sensor_data sd
                    join
                        sensor_information si 
                    on
                        si.sensor_information_id = sd.sensor_information_id
                    where 
                        sd.sensor_data_created_at = 
                        (
                        select 
                            new_max_created_at
                        from
                            max_created_at 
                        where
                            sensor_information_id = 1
                        );`,
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
                    si.sensor_name,
                    sd.sensor_data_value,
                    sd.sensor_data_created_at 
                from 
                    sensor_information si 
                join
                    sensor_data sd 
                on
                    si.sensor_information_id = sd.sensor_information_id 
                where 
                    sd.sensor_data_created_at = 
                    (
                    select 
                        old_max_created_at
                    from
                        max_created_at  
                    where 
                        sensor_information_id = 1
                    )
                union 
                select 
                    si.sensor_name,
                    sd.sensor_data_value,
                    sd.sensor_data_created_at 
                from 
                    sensor_information si 
                join
                    sensor_data sd 
                on
                    si.sensor_information_id = sd.sensor_information_id 
                where 
                    sd.sensor_data_created_at = 
                    (
                    select 
                        old_max_created_at
                    from
                        max_created_at  
                    where 
                        sensor_information_id = 40
                    );`,
  actionRecord: `
                insert into 
                    action_record (actuator_id, contents, action_record_created_at) 
                values(
                    (
                    select 
                        actuator_id 
                    from 
                        actuator a 
                    where 
                        actuator_category = ?),
                    ?,
                    now()
                );`,
  readActionRecord: ``,
  maxCreatedAt: `
                update 
                    max_created_at 
                set
                    old_max_created_at = 
                    (select
                        *
                    from 		                    
                    (select
                        new_max_created_at
                    from
                        max_created_at
                    where 
                        sensor_information_id = ?) a),
                    new_max_created_at = ?	
                where 
                    sensor_information_id = ?;`,
  loadMinutesSensorData: `
                        select 
                            si.sensor_name,
                            cast(cast((sd.sensor_data_value) as decimal(7, 1)) as float) as sensor_data_value,
                            sd.sensor_data_created_at 
                        from 
                            sensor_data sd 
                        join
                            sensor_information si 
                        on
                            si.sensor_information_id  = sd.sensor_information_id 
                        where 
                            sd.sensor_data_created_at >= ?
                        and
                            sd.sensor_data_created_at < ?
                        group by
                            year(sd.sensor_data_created_at),
                            month(sd.sensor_data_created_at),
                            day(sd.sensor_data_created_at),
	                        hour(sd.sensor_data_created_at),
                            minute(sd.sensor_data_created_at),
                            si.sensor_name 
                        order by
                            si.sensor_information_id,
                            sd.sensor_data_created_at;`,
  loadHoursSensorData: `
                        select 
                            si.sensor_name,
                            cast(cast((sd.sensor_data_value) as decimal(7, 1)) as float) as sensor_data_value,
                            sd.sensor_data_created_at 
                        from 
                            sensor_data sd 
                        join
                            sensor_information si 
                        on
                            si.sensor_information_id  = sd.sensor_information_id 
                        where 
                            sd.sensor_data_created_at >= ?
                        and
                            sd.sensor_data_created_at < ?
                        group by
                            year(sd.sensor_data_created_at),
                            month(sd.sensor_data_created_at),
                            day(sd.sensor_data_created_at),
                            hour(sd.sensor_data_created_at),
                            si.sensor_name 
                        order by
                            si.sensor_information_id,
                            sd.sensor_data_created_at;`,
  loadDaysSensorData: `
                        select 
                            si.sensor_name,
                            cast(cast((sd.sensor_data_value) as decimal(7, 1)) as float) as sensor_data_value,
                            sd.sensor_data_created_at 
                        from 
                            sensor_data sd 
                        join
                            sensor_information si 
                        on
                            si.sensor_information_id  = sd.sensor_information_id 
                        where 
                            sd.sensor_data_created_at >= ?
                        and
                            sd.sensor_data_created_at < ?
                        group by
                            year(sd.sensor_data_created_at),
                            month(sd.sensor_data_created_at),
                            day(sd.sensor_data_created_at),
                            si.sensor_name 
                        order by
                            si.sensor_information_id,
                            sd.sensor_data_created_at;`,
  loadMonthsSensorData: `
                        select 
                            si.sensor_name,
                            cast(cast((sd.sensor_data_value) as decimal(7, 1)) as float) as sensor_data_value,
                            sd.sensor_data_created_at 
                        from 
                            sensor_data sd 
                        join
                            sensor_information si 
                        on
                            si.sensor_information_id  = sd.sensor_information_id 
                        where 
                            sd.sensor_data_created_at >= ?
                        and
                            sd.sensor_data_created_at < ?
                        group by
                            year(sd.sensor_data_created_at),
                            month(sd.sensor_data_created_at),
                            si.sensor_name 
                        order by
                            si.sensor_information_id,
                            sd.sensor_data_created_at;`,
  loadYearSensorData: `
                        select 
                            si.sensor_name,
                            cast(cast((sd.sensor_data_value) as decimal(7, 1)) as float) as sensor_data_value,
                            sd.sensor_data_created_at 
                        from 
                            sensor_data sd 
                        join
                            sensor_information si 
                        on
                            si.sensor_information_id  = sd.sensor_information_id 
                        where 
                            sd.sensor_data_created_at >= ?
                        and
                            sd.sensor_data_created_at < ?
                        group by
                            year(sd.sensor_data_created_at),
                            si.sensor_name 
                        order by
                            si.sensor_information_id,
                            sd.sensor_data_created_at;`,
  loadActionRecord: `
                    select 
                        *
                    from 
                        action_record ar
                    order by
                        action_record_created_at desc 
                    limit
                        10;`,
  actuatorStatusZero: `
                    update
                        actuator
                    set
                        actuator_status = 0`,
};

module.exports = query;
