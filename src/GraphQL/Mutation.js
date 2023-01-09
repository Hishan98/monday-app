//update item Data
const updateItem = (item_id, board_id, values) => {
  const query = `mutation{
    change_multiple_column_values(
        board_id:${board_id}, 
        item_id:${item_id}, 
        create_labels_if_missing: true,
        column_values: "${values}"
    ) {
      id
    }
  }`;
  return query;
}

//update Group
const updateGroup = (item_id, group_id) => {
  const query = `mutation {
    move_item_to_group (item_id:  ${item_id}, group_id: "${group_id}") {
        id
    }
}`;
  return query;
}

module.exports.updateItem = updateItem;
module.exports.updateGroup = updateGroup;