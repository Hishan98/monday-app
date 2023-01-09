const ItemNameByID = (item_id, board_id) => {
  const query = `query  {
    boards (ids:${board_id}){
      items(ids:${item_id} ) {
        name
      }
    }
  }`;
  return query;
}

module.exports.ItemNameByID = ItemNameByID;
