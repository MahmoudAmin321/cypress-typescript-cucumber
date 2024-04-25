// TODO


///t /// shoud return method Not allowed, if unsupported method is passed

///==================================================================
//- add items to cart & retrieve cart

//--- add items to cart
///t should add product to cart successfully
///t should add product to Only target cart
///t should return Not found, if invalid cart id is passed
///t passing product id should be mandatory
///t passing quantity should be mandatory
//------ should return error, if invalid product id is passed
///////////t non-existing
///////////t bool
///////////t alphabetic char
///////////t special char (i.e. $)
//------ should return error, if invalid quantity is passed
///////////t 0
///////////t -ve
///////////t bool
///////////t alphabetic char
///////////t special char (i.e. $)

//--- retrieve cart
///t response of cart with items should have correct structure (key, type if needed)
///t response of empty cart should have empty items
///t in response, cart id should be same as request parameter
///t should return Not found, if invalid cart id is passed

//t  should retrieve same product id as added product to cart
/////////1 add item to cart
////////2 retrieve cart
///////3 product id in 2 should be same as 1

//t upon adding multiple quantities of same product, should retrieve total quantities

//t upon adding quantity of different products, should retrieve correct quantity for each product

///==================================================================
//- delete cart
///t cart created without user sign in can be deleted without authorization 
///t bug - cart created by signed-in user, can be deleted Only by this user 
///t cart can be deleted, while it is Not empty
///t should return Not found, if invalid cart id is passed
