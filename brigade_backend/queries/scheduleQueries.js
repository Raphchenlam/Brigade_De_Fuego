const pool = require('./DBPool');


const getScheduleWeekInfoByID = async (scheduleWeekId) =>
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
            endDate: row.end_date
        };
        return scheduleWeek;
    }

    return undefined;
};
exports.getScheduleWeekInfoByID = getScheduleWeekInfoByID;

const getAllSchedulePeriodsByScheduleWeekID = async (scheduleWeekId) =>
{
    const scheduleObj = await pool.query(
        `SELECT *
        FROM schedule_period
        WHERE schedule_week_id = $1`,
        [scheduleWeekId]
    )

    return scheduleObj.rows.map(row => {
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
exports.getAllSchedulePeriodsByScheduleWeekID = getAllSchedulePeriodsByScheduleWeekID;


const selectAllEmployeesScheduleByScheduleWeekId = async (scheduleWeekId) =>
{
    /* const result = await pool.query(
        `SELECT first_name || ' ' || last_name AS name, e.role, es.*, sp.*
        FROM schedule_week as sw
        JOIN schedule_period as sp ON sp.schedule_week_id = sw.id
        JOIN employee_schedule as es ON es.schedule_period_id = sp.id
        JOIN employee as e ON e.employee_number = es.employee_number
        WHERE sw.id = $1`,
        [scheduleWeekId]
    ); */

    const result = await pool.query(
        `SELECT first_name || ' ' || last_name AS name, e.role, es.*, sp.*
        FROM schedule_week as sw
        JOIN schedule_period as sp ON sp.schedule_week_id = sw.id
        JOIN employee_schedule as es ON es.schedule_period_id = sp.id
        JOIN employee as e ON e.employee_number = es.employee_number
        WHERE sw.id = $1`,
        [scheduleWeekId]
    );

    return result.rows.map(row =>
    {
        const employeeSchedule = {
            id: row.id,
            employeeNumber: row.employee_number,
            name: row.name,
            role: row.role,
            date: row.date,
            shiftName : row.shift_name,
            startTime: row.start_time,
            endTime: row.end_time,
            time: row.start_time + "-" + row.end_time
        };
        return employeeSchedule;
    });
};
exports.selectAllEmployeesScheduleByScheduleWeekId = selectAllEmployeesScheduleByScheduleWeekId;




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
        console.log("scheduleWeekToInsert", scheduleWeekToInsert)
        let weekIdToInsert;
        for (let day of Object.keys(scheduleWeekToInsert)) 
        {
            if (day == "weekId")
            {
                weekIdToInsert = scheduleWeekToInsert[day];
            }
            if (day != "weekId")
            {
                console.log("DATE", scheduleWeekToInsert[day]);
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

        return scheduleObj.rows.map(row => {
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
        console.log("ERREUR", error)
        throw new Error("L'insertion a échoué pour une raison inconnue");
    } finally
    {
        client.release();
    }
};
exports.insertNewScheduleWeek = insertNewScheduleWeek;