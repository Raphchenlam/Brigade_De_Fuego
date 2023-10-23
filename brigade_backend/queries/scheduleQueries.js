const pool = require('./DBPool');


const selectScheduleWeekInfoByID = async (scheduleWeekId) =>
{
    const result = await pool.query(
        `SELECT * FROM schedule_week
            WHERE id = $1`,
        [scheduleWeekId]);

    const row = result.rows[0];
    if (row)
    {
        const scheduleWeek = {
            id: row.id,
            starDate: row.start_date,
            endDate: row.end_date,
            published: row.published
        };
        return scheduleWeek;
    }

    return undefined;
};
exports.selectScheduleWeekInfoByID = selectScheduleWeekInfoByID;

const selectAllSchedulePeriodsByScheduleWeekID = async (scheduleWeekId) =>
{
    const scheduleObj = await pool.query(
        `SELECT *
        FROM schedule_period
        WHERE schedule_week_id = $1`,
        [scheduleWeekId]
    )

    return scheduleObj.rows.map(row =>
    {
        const schedulePeriodObj = {
            id: row.id,
            date: row.date,
            shiftName: row.shift_name,
            scheduleWeekId: row.schedule_week_id,
            averageTraffic: row.average_traffic,
            expectedTraffic: row.expected_traffic,
            actualTraffic: row.actual_traffic,
            averageCostByClient: row.average_cost_by_client,
            requiredSkillPoints: row.required_skill_points,
            expectedSkillPoints: row.expected_skill_points,
            scheduledSkillPoints: row.scheduled_skill_points
        };
        return schedulePeriodObj;
    });
};
exports.selectAllSchedulePeriodsByScheduleWeekID = selectAllSchedulePeriodsByScheduleWeekID;


const selectAllEmployeesScheduleByScheduleWeekId = async (scheduleWeekId) =>
{
    const result = await pool.query(
        `SELECT first_name || ' ' || last_name AS name, e.role, e.skill_points, es.*, sp.*
        FROM schedule_week as sw
        JOIN schedule_period as sp ON sp.schedule_week_id = sw.id
        JOIN employee_schedule as es ON es.schedule_period_id = sp.id
        JOIN employee as e ON e.employee_number = es.employee_number
        WHERE sw.id = $1
        ORDER BY e.role`,
        [scheduleWeekId]
    );

    return result.rows.map(row =>
    {
        const employeeSchedule = {
            id: row.id,
            employeeNumber: row.employee_number,
            name: row.name,
            role: row.role,
            skillPoints: row.skill_points,
            date: row.date,
            shiftName: row.shift_name,
            startTime: row.start_time,
            endTime: row.end_time,
            time: row.start_time + "-" + row.end_time
        };
        return employeeSchedule;
    });
};
exports.selectAllEmployeesScheduleByScheduleWeekId = selectAllEmployeesScheduleByScheduleWeekId;

const selectEmployeeScheduleByWeekId = async (employeeId, scheduleWeekId) =>
{
    const result = await pool.query(
        `SELECT es.*, sp.date, sp.shift_name, sw.published
        FROM employee_schedule as es
        JOIN schedule_period as sp ON sp.id = es.schedule_period_id
        JOIN schedule_week as sw ON sw.id = sp.schedule_week_id
        WHERE es.employee_number = $1 AND sp.schedule_week_id = $2
        ORDER BY sp.id`,
        [employeeId, scheduleWeekId]
    );

    return result.rows.map(row =>
    {
        const employeeSchedule = {
            id: row.schedule_period_id,
            employeeNumber: row.employee_number,
            date: row.date,
            shiftName: row.shift_name,
            startTime: row.start_time,
            endTime: row.end_time,
            time: row.start_time + "-" + row.end_time,
            isPublished: row.published
        };
        return employeeSchedule;
    });
};
exports.selectEmployeeScheduleByWeekId = selectEmployeeScheduleByWeekId;

const selectNextShiftForEmployee = async (employeeNumber) =>
{
    const result = await pool.query(
        `SELECT * FROM employee_schedule as es
        JOIN schedule_period as sp ON sp.id = es.schedule_period_id
        JOIN schedule_week as sw ON sw.id = sp.schedule_week_id
        WHERE es.employee_number = $1
        AND sp.date >= CURRENT_DATE
        AND sw.published = true
        ORDER BY sp.date
        LIMIT 1`,
        [employeeNumber]
    );
    const row = result.rows[0];
    if (row)
    {
        const shift = {
            id: row.schedule_period_id,
            employeeNumber: row.employee_number,
            date: row.date,
            shiftName: row.shift_name,
            startTime: row.start_time,
            endTime: row.end_time,
            time: row.start_time + "-" + row.end_time,
            isPublished: row.published
        };
        return shift;
    }
    return undefined;

};
exports.selectNextShiftForEmployee = selectNextShiftForEmployee;


const selectAllEventScheduleByWeekId = async (scheduleWeekId) =>
{
    const result = await pool.query(
        `SELECT se.*, e.*, sp.date, sp.shift_name, sw.published
        FROM schedule_event as se
		JOIN event as e ON e.name = se.event_name
        JOIN schedule_period as sp ON sp.id = se.schedule_period_id
        JOIN schedule_week as sw ON sw.id = sp.schedule_week_id
        WHERE sp.schedule_week_id = $1
        ORDER BY sp.id`,
        [scheduleWeekId]
    );
    const row = result.rows[0];
    if (row)
    {
        return result.rows.map(row =>
        {
            const event = {
                eventName: row.event_name,
                schedulePeriodId: row.schedule_period_id,
                impact: row.impact,
                isActive: row.is_active,
                date: row.date,
                shiftName: row.shift_name,
            };
            return event;
        });
    }
    return [];
};
exports.selectAllEventScheduleByWeekId = selectAllEventScheduleByWeekId;


const selectEmailFromEmployeeNumber = async (employeeNumber) =>
{
    const result = await pool.query(
        `SELECT email
        FROM employee
        WHERE employee_number = $1`,
        [employeeNumber]
    );
    let row = result.rows[0];
    if (row) return row
    return undefined
};
exports.selectEmailFromEmployeeNumber = selectEmailFromEmployeeNumber

const selectAllWaitersForOperationByDateAndShift = async (date, shift) =>
{
    const result = await pool.query(
        `SELECT es.employee_number, e.first_name, e.last_name, e.color_hexcode, sp.date, sp.shift_name, es.start_time, es.end_time  FROM employee_schedule as es
        INNER JOIN schedule_period as sp ON es.schedule_period_id = sp.id
        INNER JOIN employee as e ON e.employee_number = es.employee_number
        WHERE sp.date = $1 AND sp.shift_name = $2 AND e.role='Serveur'`,
        [date, shift]
    );

    return result.rows.map(row =>
    {
        const employeeSchedule = {
            waiterNumber: row.employee_number,
            waiterName: row.first_name + " " + row.last_name,
            waiterColor: row.color_hexcode,
            date: row.date,
            shift: row.shift_name,
            shiftTime: row.start_time + "-" + row.end_time
        };
        return employeeSchedule;
    });
};
exports.selectAllWaitersForOperationByDateAndShift = selectAllWaitersForOperationByDateAndShift;

const insertNewScheduleWeek = async (scheduleWeek, clientParam) =>
{
    const client = clientParam || await pool.connect();
    const scheduleWeekToInsert = scheduleWeek;
    if (!clientParam)
    {
        await client.query('BEGIN');
    }
    try
    {
        const result = await client.query(
            `INSERT INTO schedule_week (id,start_date,end_date)
        VALUES ($1,$2,$3)
        RETURNING *`,
            [scheduleWeekToInsert.weekId, scheduleWeekToInsert.monday, scheduleWeekToInsert.sunday]);
        if (result.rowCount === 0)
        {
            return undefined;
        }
        const row = result.rows[0];
        let weekIdToInsert;

        for (let day of Object.keys(scheduleWeekToInsert)) 
        {
            if (day == "weekId")
            {
                weekIdToInsert = scheduleWeekToInsert[day];
            }
            if (day != "weekId")
            {
                await client.query(
                    `INSERT INTO schedule_period ("date", shift_name, schedule_week_id, average_traffic, expected_traffic, actual_traffic, average_cost_by_client, required_skill_points, expected_skill_points, scheduled_skill_points)
                    VALUES ($1, 'Midi', $2, 0, 0, 0, 0, 0, 0, 0)`,
                    [scheduleWeekToInsert[day], weekIdToInsert]);
                await client.query(
                    `INSERT INTO schedule_period ("date", shift_name, schedule_week_id, average_traffic, expected_traffic, actual_traffic, average_cost_by_client, required_skill_points, expected_skill_points, scheduled_skill_points)
                        VALUES ($1, 'Soir', $2, 0, 0, 0, 0, 0, 0, 0)`,
                    [scheduleWeekToInsert[day], weekIdToInsert]);
            }
        };

        const scheduleObj = await client.query(
            `SELECT *
            FROM schedule_period
            WHERE schedule_week_id = $1`,
            [row.id]
        )

        await client.query("COMMIT");

        return scheduleObj.rows.map(row =>
        {
            const schedulePeriodObj = {
                id: row.id,
                date: row.date,
                shiftName: row.shift_name,
                scheduleWeekId: row.schedule_week_id,
                averageTraffic: row.average_traffic,
                expectedTraffic: row.expected_traffic,
                actualTraffic: row.actual_traffic,
                averageCostByClient: row.average_cost_by_client,
                requiredSkillPoints: row.required_skill_points,
                expectedSkillPoints: row.expected_skill_points,
                scheduledSkillPoints: row.scheduled_skill_points
            };
            return schedulePeriodObj;
        });
    } catch (error)
    {
        await client.query("ROLLBACK");
        console.error("ERREUR", error)
        throw new Error("L'insertion a échoué pour une raison inconnue");
    } finally
    {
        client.release();
    }
};

exports.insertNewScheduleWeek = insertNewScheduleWeek;

const insertNewEmployeeSchedule = async (scheduledEmployeeList, clientParam) =>
{
    const client = clientParam || await pool.connect();

    if (!clientParam)
    {
        await client.query('BEGIN');
    }
    try
    {
        if (scheduledEmployeeList.length > 0)
        {
            for (i = 0; i < scheduledEmployeeList.length; i++)
            {
                for (j = 0; j < 14; j++)
                {
                    if (
                        scheduledEmployeeList[i] &&
                        scheduledEmployeeList[i].schedules &&
                        scheduledEmployeeList[i].schedules[j].startTime != null
                    )
                    {
                        const result = await pool.query(
                            `INSERT INTO employee_schedule (employee_number, schedule_period_id, start_time, end_time)
                VALUES ($1,$2,$3,$4)`,
                            [scheduledEmployeeList[i].employeeNumber, scheduledEmployeeList[i].schedules[j].id, scheduledEmployeeList[i].schedules[j].startTime, scheduledEmployeeList[i].schedules[j].endTime]
                        );
                    }
                }
            }
        }
        await client.query("COMMIT");
    } catch (error)
    {
        await client.query("ROLLBACK");
        console.error("ERREUR", error)
        throw new Error("L'insertion a échoué pour une raison inconnue");
    } finally
    {
        client.release();
    }
};
exports.insertNewEmployeeSchedule = insertNewEmployeeSchedule;


const updateSchedulePeriodsInformations = async (weekInformationsList, clientParam) =>
{
    const client = clientParam || await pool.connect();
    if (!clientParam)
    {
        await client.query('BEGIN');
    }
    try
    {
        for (i = 0; i < weekInformationsList.length; i++)
        {
            const result = await pool.query(
                `UPDATE schedule_period
            SET average_traffic = $2, average_cost_by_client = $3, scheduled_skill_points = $4
                WHERE id = $1`,
                [weekInformationsList[i].id, weekInformationsList[i].traffic, weekInformationsList[i].averageCostByClient, weekInformationsList[i].scheduledSkillPoints]
            );
        }
        await client.query("COMMIT");
    } catch (error)
    {
        await client.query("ROLLBACK");
        console.error("ERREUR", error)
        throw new Error("L'insertion a échoué pour une raison inconnue");
    } finally
    {
        client.release();
    }
};
exports.updateSchedulePeriodsInformations = updateSchedulePeriodsInformations;

const updateScheduleWeekStatus = async (scheduleWeekId, isPublished) =>
{
    const result = await pool.query(
        `UPDATE schedule_week
            SET published = $2
                WHERE id = $1`,
        [scheduleWeekId, isPublished]
    );
};
exports.updateScheduleWeekStatus = updateScheduleWeekStatus;


const updateEventForScheduleWeek = async (periodIdList, eventList, clientParam) =>
{
    const lowest = Math.min(...periodIdList);
    const highest = Math.max(...periodIdList);
    const client = clientParam || await pool.connect();
    try
    {
        await client.query('BEGIN');

        await pool.query(
            `DELETE FROM schedule_event
            WHERE schedule_period_id >= $1 AND schedule_period_id <= $2`,
            [lowest, highest]
        );

        if (eventList.length > 0)
        {
            for (i = 0; i < eventList.length; i++)
            {
                if (eventList[i].events.length > 0)
                {
                    for (j = 0; j < eventList[i].events.length; j++)
                    {
                        if (eventList[i] &&
                            eventList[i].events[j] &&
                            eventList[i].events[j] != null)
                        {
                            const result = await pool.query(
                                `INSERT INTO schedule_event (schedule_period_id, event_name)
                                VALUES ($1,$2)`,
                                [eventList[i].idSchedulePeriod, eventList[i].events[j]]
                            );
                        }
                    }
                }
            }
        }
        client.query('COMMIT');
    } catch (error)
    {
        await client.query("ROLLBACK");
        throw Error;
    } finally
    {
        client.release();
    }
};
exports.updateEventForScheduleWeek = updateEventForScheduleWeek;


const deleteEmployeeFromSchedule = async (periodIdList) =>
{
    const lowest = Math.min(...periodIdList);
    const highest = Math.max(...periodIdList);
    const result = await pool.query(
        `DELETE FROM employee_schedule
        WHERE schedule_period_id >= $1 AND schedule_period_id <= $2`,
        [lowest, highest]
    );
};

exports.deleteEmployeeFromSchedule = deleteEmployeeFromSchedule;