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
  saveDataId: `
            insert into 
                sensor_data (
                            sensor_information_id,
                            sensor_data_value,
                            sensor_data_created_at
                            )
            values(?,?,?);`,
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
                    sd.sensor_information_id,
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
                    sd.sensor_information_id,
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
                            sensor_information_id in (1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30)
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
                            year(sd.sensor_data_created_at),
                            month(sd.sensor_data_created_at),
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
                            year(sd.sensor_data_created_at),
                            month(sd.sensor_data_created_at),
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
                            sensor_information_id in (1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30)
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
                            sensor_information_id in (1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30)
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
                            sensor_information_id in (1,2,3,4,5,6,7,8, 14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30)
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
                        cast((ifnull(sd.sensor_data_value, -500)) as decimal(5, 0)) as sensor_data_value,
                        sd.sensor_data_created_at 
                    from 
                        sensor_information si 
                    join
                        sensor_data sd 
                    on
                        si.sensor_information_id = sd.sensor_information_id
                    where 
                        si.sensor_information_id in (6, 30, 31, 32)
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
                        cast((ifnull(sd.sensor_data_value, -500)) as decimal(5, 0)) as sensor_data_value,
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
                        sd.sensor_information_id as sensor_information_id,
                        cast(ifnull(avg((sd.sensor_data_value)), null) as decimal(5, 1)) as sensor_data_value,
                        date_format(sd.sensor_data_created_at, '%Y-%m-%d %H:00:00') as sensor_data_created_at
                    from 
                        sensor_data sd
                    where  
                        sd.sensor_data_created_at >= subtime(now(),'11:00:00')
                    and
                        sd.sensor_information_id in(14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29)
                    group by
                        year(sd.sensor_data_created_at),
                        month(sd.sensor_data_created_at),
                        day(sd.sensor_data_created_at),
                        hour(sd.sensor_data_created_at),
                        sd.sensor_information_id
                    order by    
                        sd.sensor_data_created_at,
                        sd.sensor_information_id
                    ) as a
                order by
                    sensor_information_id;`,
  insertNutricultureMachinePageStatusValue: `
                                            insert into 
                                                nutrient_status_value (address, value) 
                                            values (?, ?)`,
  nutricultureMachinePageStatusValue: `
                                    select 
                                        address,
                                        value
                                    from 
                                        nutrient_status_value`,
  updateNutricultureMachinePageStatus: `
                                    update
                                        nutrient_status_value
                                    set
                                        value = ?
                                    where
                                        address = ?`,
  writeHourConsumptionData: `
                        insert into
                            power_consumption_data (hour_value, total_value, ago_value, created_at)
                        values(
                        (
                        select
                            a.sensor_data_value - b.sensor_data_value
                        from 
                            (
                            select 
                                sensor_data_value
                            from 
                            (
                            select
                                max(sd.sensor_data_value) as sensor_data_value,
                                max(sensor_data_created_at) as sensor_data_created_at
                            from 
                                sensor_data sd 
                            where
                                sensor_data_created_at >= date_sub(now(), interval 1 hour)
                            and
                                sensor_information_id = 40
                            group by
                                hour(sensor_data_created_at)
                            order by
                                sensor_data_created_at desc 
                            limit 2
                            ) x
                            order by
                                x.sensor_data_created_at
                            limit 1
                            ) a,
                            (
                            select 
                                sensor_data_value
                            from 
                                (
                                select
                                    max(sd.sensor_data_value) as sensor_data_value,
                                    max(sensor_data_created_at) as sensor_data_created_at
                                from 
                                    sensor_data sd 
                                where
                                    sensor_data_created_at >= date_sub(now(), interval 2 hour)
                                and
                                    sensor_data_created_at < date_format((date_sub(now(), interval 1 hour)), '%Y-%m-%d %H:59:59')
                                and 
                                    sensor_information_id = 40
                                group by
                                    hour(sensor_data_created_at)
                                order by
                                    sensor_data_created_at desc 
                                limit 2
                                ) x
                            order by
                                x.sensor_data_created_at
                            limit 1
                            )  b
                            ), 
                            (
                            select 
                                sensor_data_value
                            from 
                            (
                            select
                                max(sd.sensor_data_value) as sensor_data_value,
                                max(sensor_data_created_at) as sensor_data_created_at
                            from 
                                sensor_data sd 
                            where
                                sensor_data_created_at >= date_sub(now(), interval 1 hour)
                            and
                                sensor_information_id = 40
                            group by
                                hour(sensor_data_created_at)
                            order by
                                sensor_data_created_at desc 
                            limit 2
                            ) x
                            order by
                                x.sensor_data_created_at
                            limit 1
                            ), 
                            ( 
                            select 
                                sensor_data_value
                            from 
                                (
                                select
                                    max(sd.sensor_data_value) as sensor_data_value,
                                    max(sensor_data_created_at) as sensor_data_created_at
                                from 
                                    sensor_data sd 
                                where
                                    sensor_data_created_at >= date_sub(now(), interval 2 hour)
                                and
                                    sensor_data_created_at < date_format((date_sub(now(), interval 1 hour)), '%Y-%m-%d %H:59:59')
                                and 
                                    sensor_information_id = 40
                                group by
                                    hour(sensor_data_created_at)
                                order by
                                    sensor_data_created_at desc 
                                limit 2
                                ) x
                            order by
                                x.sensor_data_created_at
                            limit 1
                            ), 
                            (select date_format(date_sub(now(), interval 1 hour), '%Y-%m-%d %H:00:00')));`,

  hourConsumptionData: `
                        select
                            hour_value as value,
                            created_at
                        from 
                            power_consumption_data
                        where
                            created_at >= date_format(date_sub(date_sub(now(), interval 1 day), interval 1 hour),'%Y-%m-%d %T')
                        order by 
                            created_at;`,
  dayConsumptionData: `
                        select
                            cast((sum(hour_value)/1000 ) as decimal(8,1)) as value,
                            date_format(created_at, '%Y-%m-%d') as created_at
                        from
                            power_consumption_data 
                        where
                            created_at >= date_format(now(),'%Y-%m-%d 00:00:00')
                        and
                            created_at < date_format(now(), '%Y-%m-%d 23:59:59')
                        group by
                            year(created_at),
                            month(created_at),
                            day(created_at);`,
  dayMaxValue: `
                select 
                    max(a.value) as value
                from
                (	
                    select
                        cast((sum(hour_value)/1000 ) as decimal(8,1)) as value,
                        created_at
                    from
                        power_consumption_data pcd
                    group by
                        year(created_at),
                        month(created_at),
                        day(created_at)
                ) a;`,
  monthConsumptionData: `
                        select
                            cast((sum(hour_value)/1000 ) as decimal(8,1)) as value,
                            date_format(created_at, '%Y-%m') as created_at
                        from
                            power_consumption_data 
                        where
                            created_at >= date_format(now(),'%Y-%m-01 00:00:00')
                        and
                            created_at < date_format(date_add(last_day(now()), interval 1 day), '%Y-%m-%d 00:00:00')
                        group by
                            year(created_at),
                            month(created_at);`,
  yearConsumptionData: `
                        select
                            cast((sum(hour_value)/1000000 ) as decimal(8,1)) as value,
                            date_format(created_at, '%Y') as created_at
                        from
                            power_consumption_data 
                        where
                            created_at >= date_format(now(),'%Y-01-01 00:00:00')
                        and
                            created_at < date_format(date_add(last_day(now()), interval 1 year), '%Y-1-1 00:00:00')
                        group by
                            year(created_at);`,
  currentAmountOfChange: `
                        select
                            sensor_data_value 
                        from
                            sensor_data
                        where
                            sensor_data_created_at >= date_sub(now(), interval 10 second) 
                        and
                            sensor_information_id in (44)
                        order by 
                            sensor_data_created_at desc
                        limit 1;`,
  accumulateConsumptionData: `
                            select
                                cast((sum(sensor_data_value)/1000000) as decimal(8,1))  as value
                            from
                                sensor_data sd 
                            where
                                sensor_data_created_at = 
                                                        (
                                                        select
                                                            max(sensor_data_created_at)
                                                        from
                                                            sensor_data
                                                        where
                                                            sensor_information_id = 40
                                                        )
                            and
                                sensor_information_id = 40;`,
  hourlyConsumptionData: `call power_consumption_hour(?,?);`,
  dailyConsumptionData: `call power_consumption_day(?,?);`,
  monthlyConsumptionData: `call power_consumption_month(?,?);`,
  yearlyConsumptionData: `call power_consumption_year(?,?);`,
  sensorDataMinutely: `
                    select 
                        sd.sensor_information_id,
                        cast((avg(sd.sensor_data_value)) as decimal(8, 1)) as sensor_data_value,
                        date_format(sd.sensor_data_created_at, '%Y-%m-%d %H:%i:00') as sensor_data_created_at
                    from 
                        sensor_data sd 
                    where  
                        sd.sensor_data_created_at >= ?
                    and
                        sd.sensor_data_created_at < ?
                    and
                        sensor_information_id in (1,2,5,6,7,8,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32)
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
  sensorDataHourly: `                   
                    call sensor_data_hour(?,?)`,
  sensorDataDaily: ` 
                     call sensor_data_day(?,?)`,
  sensorDataMonthly: `
                    call sensor_data_month(?,?)`,
  sensorDataYearly: `
                    call sensor_data_year(?,?)`,
  saveHourSensorData: `
                    insert into 
                            hour_data
                    select 
                        sensor_information_id,
                        cast((avg(sensor_data_value)) as decimal(6, 1)) as sensor_data_value,
                        date_format(sensor_data_created_at, '%Y-%m-%d %H:00:00') as sensor_data_created_at
                    from
                        sensor_data sd 
                    where
                        sensor_data_created_at >= date_format(date_sub(now(), interval 1 hour), '%Y-%m-%d %H:00:00')
                    and
                        sensor_data_created_at < date_format(now(), '%Y-%m-%d %H:00:00')
                    and
                        sensor_information_id in (1,2,3,4,5,6,7,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32)
                    group by
                        hour(sensor_data_created_at),
                        sensor_information_id;`,
  saveHourRainFallData: `
                        insert into 
                            hour_data
                        select
                            sensor_information_id,
                            cast((sensor_data_value) as decimal(6, 1)) as sensor_data_value,
                            date_format(sensor_data_created_at, '%Y-%m-%d %H:00:00') as sensor_data_created_at
                        from
                            sensor_data sd2
                        where
                            sensor_data_created_at =( 
                                                    select 
                                                        max(sensor_data_created_at) as sensor_data_created_at 
                                                    from
                                                        sensor_data sd 
                                                    where
                                                        sensor_information_id =8
                                                    )
                        and
                            sensor_information_id = 8;`,
  detectSaveSensorData: `
                        select
                            sensor_information_id ,
                            sensor_data_value ,
                            sensor_data_created_at 
                        from
                            sensor_data
                        where
                            sensor_data_created_at >= date_format(date_sub(now(), interval 1 minute), '%Y-%m-%d %H:%i:00')
                        and
                            sensor_data_created_at < date_format(now(), '%Y-%m-%d %H:%i:00')
                        and
                            sensor_information_id in  (1,2,5,6,7,8,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32);`,

  fiveMinuteAgoSensorData: `
                        select
                            case 
                                when(sensor_information_id = 6) then 'inInsol'
                                when(sensor_information_id = 31) then 'co2Temp'
                                when(sensor_information_id = 32) then 'co2Humi'
                            end as	sensor_name,
                            sensor_data_value,
                            sensor_data_created_at 
                        from 
                            sensor_data sd 
                        where	
                            sensor_data_created_at >= date_sub(now(), interval 5 minute)
                        and
                            sensor_data_created_at < date_sub(now(), interval 4 minute)	
                        and
                            sensor_information_id in (31,32,6);`,
  todaySupply: `
                select 
                    * 
                from 
                    nutrient_status_value
                where 
                    address in ('44521', '44523', '44525', '44527')`,
  detectAction: `
                select
                    sensor_name,
                    cast((sensor_data_value) as decimal(5,1)) as sensor_data_value,
                    sensor_data_created_at
                from
                    sensor_data sd 
                join
                    sensor_information si 
                on
                    si.sensor_information_id =sd.sensor_information_id 
                where
                    sensor_data_created_at =(
                                            select 
                                                max(sensor_data_created_at)	
                                            from 
                                                sensor_data
                                            where 
                                                sensor_information_id = 1
                                            )
                and
                    si.sensor_information_id in (1,2,5,7,8,6, 30, 31, 32);`,
};

module.exports = query;
