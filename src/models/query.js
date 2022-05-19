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
                            sd.sensor_information_id,
                            cast((sd.sensor_data_value) as decimal(8, 1)) as sensor_data_value,
                            date_format(sd.sensor_data_created_at, '%Y-%m-%d %H') as sensor_data_created_at
                        from 
                            sensor_data sd 
                        where  
                            sd.sensor_data_created_at >=  ?
                        and
                            sd.sensor_data_created_at < ?
                        and
                            sensor_information_id in (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30)
                        group by
                            year(sd.sensor_data_created_at),
                            month(sd.sensor_data_created_at),
                            day(sd.sensor_data_created_at),
                            hour(sd.sensor_data_created_at),    
                            minute(sd.sensor_data_created_at),                        
                            sd.sensor_information_id
                        order by
                            sd.sensor_information_id,
                            sd.sensor_data_created_at;`,
  loadHoursSensorData: `
                        select 
                            sd.sensor_information_id,
                            cast((avg(sd.sensor_data_value)) as decimal(8, 1)) as sensor_data_value,
                            date_format(sd.sensor_data_created_at, '%Y-%m-%d %H') as sensor_data_created_at
                        from 
                            sensor_data sd 
                        where  
                            sd.sensor_data_created_at >= ?
                        and
                            sensor_information_id in (?, ?)
                        group by
                            day(sd.sensor_data_created_at),
                            hour(sd.sensor_data_created_at),                            
                            sd.sensor_information_id
                        order by
                            sd.sensor_information_id,
                            sd.sensor_data_created_at;`,
  loadHoursCo2SensorData: `
                        select 
                            sd.sensor_information_id,
                            cast((avg(sd.sensor_data_value)) as decimal(8, 1)) as sensor_data_value,
                            date_format(sd.sensor_data_created_at, '%Y-%m-%d %H') as sensor_data_created_at
                        from 
                            sensor_data sd 
                        where  
                            sd.sensor_data_created_at >= ?
                        and
                            sensor_information_id in (?)
                        group by
                            day(sd.sensor_data_created_at),
                            hour(sd.sensor_data_created_at),                            
                            sd.sensor_information_id
                        order by
                            sd.sensor_information_id,
                            sd.sensor_data_created_at;`,
  loadDaysSensorData: `
                        select 
                            sd.sensor_information_id,
                            cast((avg(sd.sensor_data_value)) as decimal(8, 1)) as sensor_data_value,
                            date_format(sd.sensor_data_created_at, '%Y-%m-%d') as sensor_data_created_at
                        from 
                            sensor_data sd 
                        where  
                            sd.sensor_data_created_at >= ?
                        and
                            sd.sensor_data_created_at < ?
                        and
                            sensor_information_id in (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30)
                        group by
                            year(sd.sensor_data_created_at),
                            month(sd.sensor_data_created_at),
                            day(sd.sensor_data_created_at),                            
                            sd.sensor_information_id
                        order by
                            sd.sensor_information_id,
                            sd.sensor_data_created_at;`,
  loadMonthsSensorData: `
                        select 
                            sd.sensor_information_id,
                            cast((avg(sd.sensor_data_value)) as decimal(8, 1)) as sensor_data_value,
                            date_format(sd.sensor_data_created_at, '%Y-%m') as sensor_data_created_at
                        from 
                            sensor_data sd 
                        where  
                            sd.sensor_data_created_at >= ?
                        and
                            sd.sensor_data_created_at < ?
                        and
                            sensor_information_id in (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30)
                        group by
                            year(sd.sensor_data_created_at),
                            month(sd.sensor_data_created_at),                        
                            sd.sensor_information_id
                        order by
                            sd.sensor_information_id,
                            sd.sensor_data_created_at;`,
  loadYearSensorData: `
                        select 
                            sd.sensor_information_id,
                            cast((avg(sd.sensor_data_value)) as decimal(8, 1)) as sensor_data_value,
                            date_format(sd.sensor_data_created_at, '%Y') as sensor_data_created_at
                        from 
                            sensor_data sd 
                        where  
                            sd.sensor_data_created_at >= ?
                        and
                            sd.sensor_data_created_at < ?
                        and
                            sensor_information_id in (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30)
                        group by
                            year(sd.sensor_data_created_at),                        
                            sd.sensor_information_id
                        order by
                            sd.sensor_information_id,
                            sd.sensor_data_created_at;`,
  loadActionRecord: `
                    select 
                        contents,
                        action_record_created_at
                    from 
                        action_record ar
                    order by
                        action_record_created_at desc;`,
  actuatorStatusZero: `
                    update
                        actuator
                    set
                        actuator_status = 0`,
  mainInsideSensorData: `                
                    select 
                        si.sensor_name,
                        cast((sd.sensor_data_value) as decimal(5, 0)) as sensor_data_value,
                        sd.sensor_data_created_at 
                    from 
                        sensor_information si 
                    join
                        sensor_data sd 
                    on
                        si.sensor_information_id = sd.sensor_information_id
                    where 
                        si.sensor_information_id in (3, 4, 6, 30)
                    and
                        sd.sensor_data_created_at = (
                                                    select 
                                                        max(sensor_data_created_at)	
                                                    from 
                                                        sensor_data
                                                    where 
                                                        sensor_information_id = 1
                                                    )
                    order by
                        sd.sensor_information_id,
                        sd.sensor_data_created_at;`,
  mainOutsideSensorData: `                
                    select 
                        si.sensor_name,
                        cast((sd.sensor_data_value) as decimal(5, 1)) as sensor_data_value,
                        sd.sensor_data_created_at 
                    from 
                        sensor_information si 
                    join
                        sensor_data sd 
                    on
                        si.sensor_information_id = sd.sensor_information_id
                    where 
                        si.sensor_information_id in (1, 2, 5, 7, 8)
                    and
                        sd.sensor_data_created_at = (
                                                    select 
                                                        max(sensor_data_created_at)	
                                                    from 
                                                        sensor_data
                                                    where 
                                                        sensor_information_id = 1
                                                    )
                    order by
                        sd.sensor_information_id,
                        sd.sensor_data_created_at;`,
  updateSensorDataSettingValue: `
                                update 
                                    sensor_information 
                                set
                                    sensor_setting_value = ?
                                where 
                                    sensor_name = ?
                                ;`,
  nutrientStartSupplyDatetime: `
                                insert into
                                    nutrient_supply (matter, line, start_supply_date_time)
                                values
                                    (?, ?, ?);`,
  nutrientLineSupply: `
                        select 
                            * 
                        from 
                            nutrient_supply 
                        order by 
                            start_supply_date_time desc 
                        limit 2;`,
  nutrientEndSupplyDatetime: `
                            update 
                                nutrient_supply 
                            set 
                                supply = ?, 
                                total_supply = ?, 
                                end_supply_date_time = ?
                            where 
                                start_supply_date_time = (
                                                            select 
                                                                * 
                                                            from 
                                                                (
                                                                select 
                                                                    max(start_supply_date_time) 
                                                                from 
                                                                    nutrient_supply) as a
                                                        );`,
  readNutrientSupply: `
                    select 
                        * 
                    from 
                        nutrient_supply 
                    order by 
                        end_supply_date_time desc 
                    limit 1;`,
  hourlyLineSupply: `
                    insert into 
                        nutrient_hourly_line_supply (matter, line, supply_date_time, supply) 
                    values 
                        (?, ?, ?, ?);`,
  readBedData: `
                select
                    *
                from 
                (   
                select 
                    sd.sensor_information_id,
                    cast(avg((sd.sensor_data_value)) as decimal(5, 1)) as sensor_data_value,
                    date_format(sd.sensor_data_created_at, '%Y-%m-%d %H:00:00') as sensor_data_created_at
                from 
                    sensor_data sd
                where  
                    sd.sensor_data_created_at >= subtime(now(),'11:00:00')
                and
                    sd.sensor_information_id in(14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29)
                group by
                    day(sd.sensor_data_created_at),
                    hour(sd.sensor_data_created_at),
                    sd.sensor_information_id
                order by    
                    sd.sensor_data_created_at,
                    sd.sensor_information_id
                ) as a
                order by
                    sensor_information_id;`,
  nutricultureMachinePageStatusValue: `
                                    select 
                                        * 
                                    from 
                                        nutrient_status_value`,
};

module.exports = query;
