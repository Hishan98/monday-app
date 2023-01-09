const router = require('express').Router();
const mondaySdk = require('monday-sdk-js');
const mutation = require('../GraphQL/Mutation');
const query = require('../GraphQL/Queries');

const monday = mondaySdk();
monday.setToken('eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIxNjk3MzU0OSwidWlkIjozNzgwMzY4MywiaWFkIjoiMjAyMy0wMS0wNFQxNjo0MDoyMi44OTRaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTQ2NjM4MzMsInJnbiI6InVzZTEifQ.nwyyK9PWryIUQL8bJ-FYVEBFZvP7S4-b7h_HW5H0BtU');
router.post("/setState", async (req, res) => {

    const item_id = req.body.payload.inputFields.itemId;
    const board_id = req.body.payload.inputFields.boardId;

    //data
    const hashtag = req.body.payload.inputFields.hashtag; // # or other hashtags
    const hashtagState = req.body.payload.inputFields.hashtagRemove.value; // delete or don't delete
    const baseUrl = req.body.payload.inputFields.itemColumnValues.columnValues;

    const main = () => {
        //change Group
        if (req.body.payload.inputFields.itemColumnValues.hasOwnProperty('groupId')) {
            const group_id = req.body.payload.inputFields.itemColumnValues.groupId
            try {

                let data = monday.api(mutation.updateGroup(item_id, group_id)).then(res => {
                    return res;
                });
                console.log(data)


            } catch (error) {
                console.log(error)

            }
        }

        //change name (Done)
        if (baseUrl.hasOwnProperty('name') && hashtagState == "delete") {


            var new_item_name = item_name.data.boards[0].items[0].name.split(hashtag)[0].trim();
            const item_query = `{\\\"name\\\":\\\"` + new_item_name + `\\\"}`
            try {

                let data = monday.api(mutation.updateItem(item_id, board_id, item_query)).then(res => {
                    return res;
                });
                console.log(data);

            } catch (error) {
                console.log(error)

            }
        }

        //change Person
        if (baseUrl.hasOwnProperty('person')) {

            const person_ids = baseUrl.person.personsAndTeams;

            function getQuery(person_ids) {
                let newArr = [];
                person_ids.map((index) => {
                    newArr.push(`{\\"id\\":` + index.id + `,\\"kind\\":\\"` + index.kind + `\\"}`)
                });
                const set_item_query = `{\\\"person\\\":{\\\"personsAndTeams\\\":[` + newArr + `]}}`
                return set_item_query;
            }
            const item_query = getQuery(person_ids);
            console.log(item_query);

            try {

                let data = monday.api(mutation.updateItem(item_id, board_id, item_query)).then(res => {
                    return res;
                });
                console.log(data);

            } catch (error) {
                console.log(error)

            }
        }

        // //change Status 
        if (baseUrl.hasOwnProperty('status')) {

            var item_status = baseUrl.status.index;
            const item_query = `{\\\"status\\\":{\\\"index\\\":` + item_status + `}}`
            try {

                let data = monday.api(mutation.updateItem(item_id, board_id, item_query)).then(res => {
                    return res;
                });
                console.log(data);

            } catch (error) {
                console.log(error)

            }
        }

        //change Date 
        if (baseUrl.hasOwnProperty('date4')) {
            try {
                if (baseUrl.date4.hasOwnProperty('date') && baseUrl.date4.hasOwnProperty('time')) {
                    const item_date = baseUrl.date4.date;
                    const item_time = baseUrl.date4.time;
                    const set_timestamp = `{\\\"date4\\\":{\\\"date\\\":\\\"` + item_date + `\\\",\\\"time\\\":\\\"` + item_time + `\\\"}}`

                    let data = monday.api(mutation.updateItem(item_id, board_id, set_timestamp)).then(res => {
                        return res;
                    });
                    console.log(data);

                } else if (baseUrl.date4.hasOwnProperty('date')) {
                    const item_date = baseUrl.date4.date;
                    const set_timestamp = `{\\\"date4\\\":{\\\"date\\\":\\\"` + item_date + `\\\"}}`
                    let data = monday.api(mutation.updateItem(item_id, board_id, set_timestamp)).then(res => {
                        return res;
                    });
                    console.log(data);
                }
            } catch (error) {
                console.log(error)

            }
        }

        console.log(baseUrl);
    }

    //get item name and check for hashtag
    const item_name = await monday.api(query.ItemNameByID(item_id, board_id)).then(res => {

        setTimeout(() => {
            if (res.data.boards[0].items[0].hasOwnProperty('name')) {
                if (res.data.boards[0].items[0].name.includes(hashtag)) {
                    main();
                } else {
                    console.log('Hashtag not exists, Hashtag = ' + hashtag + " and other val = " + res.data.boards[0].items[0].name);
                }
            } else {
                console.log("don't have a property.")
            }
        }, 1000);

        return res;
    });

    res.status(200);
})

module.exports = router;